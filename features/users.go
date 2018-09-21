package features

import (
	"context"
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"rest-api/utils"
	"strings"
)

func UserRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Post("/create", Create)
	router.Post("/login", Login)
	return router
}

type User struct {
	gorm.Model
	Email string `json:"email" binding:"required"`
	Password string `json:"password,omitempty" binding:"required"`
	Role string `json:"role,omitempty"`
}

type Token struct {
	UserId uint `json:"userId,omitempty" binding:"required"`
	Email string `json:"email,omitempty" binding:"required"`
	Role string `json:"role,omitempty" binding:"required"`
	Token string `json:"token,omitempty" binding:"required"`
	jwt.StandardClaims
}

var userErrors = map[string]int{
	"InvalidParams": 0,
	"DbError": 1,
	"MailAlreadyInUse": 2,
	"ErrorNotFound": 3,
	"UserNotFound": 4,
	"InvalidPassword": 5,
	"InvalidToken": 6,
}

func Create(w http.ResponseWriter, r *http.Request)  {
	user := &User{}
	err := json.NewDecoder(r.Body).Decode(user) //decode the request body into struct and failed if any error occur
	if err != nil {
		renderResponse(w, r,buildErrorResponse(userErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}
	tempUser := &User{}
	err = GetDB().Table("users").Where("email = ?", user.Email).First(tempUser).Error
	if  err != nil && err != gorm.ErrRecordNotFound {
		renderResponse(w, r,buildErrorResponse(userErrors["DbError"]),http.StatusBadRequest)
		return
	}
	if err != gorm.ErrRecordNotFound{
		renderResponse(w, r,buildErrorResponse(userErrors["MailAlreadyInUse"]),http.StatusBadRequest)
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	err = GetDB().Create(user).Error
	if user.ID <= 0 || err!= nil {
		renderResponse(w, r,buildErrorResponse(userErrors["DbError"]),http.StatusBadRequest)
		return
	}
	render.JSON(w, r, "Created user")
	return
}

func Login(w http.ResponseWriter, r *http.Request) {

	user := &User{}
	err := json.NewDecoder(r.Body).Decode(user) //decode the request body into struct and failed if any error occur
	if err != nil {
		renderResponse(w, r,buildErrorResponse(userErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}

	email := user.Email
	password := user.Password

	err = GetDB().Table("users").Where("email = ?", email).First(user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			renderResponse(w, r,buildErrorResponse(userErrors["UserNotFound"]),http.StatusBadRequest)
			return
		}
		renderResponse(w, r,buildErrorResponse(userErrors["DbError"]),http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil || err == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		renderResponse(w, r,buildErrorResponse(userErrors["InvalidPassword"]),http.StatusUnauthorized)
		return
	}

	//Worked! Logged In
	user.Password = ""

	//Create JWT token
	tk := &Token{UserId: user.ID,Email: user.Email, Role: user.Role}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	tk.Token = tokenString //Store the token in the response

	renderResponse(w, r,tk,http.StatusOK)
	return
}

var JwtAuthentication = func(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		notAuth := []string{
			"/api/users/create",
			"/api/users/create/",
			"/api/products/",
			"/api/products",
			"/api/users/login",
			"/api/users/login/"} //List of endpoints that doesn't require users
		requestPath := r.URL.Path //current request path

		if utils.InArray(requestPath,notAuth) {
			next.ServeHTTP(w, r)
			return
		}

		tokenHeader := r.Header.Get("Authorization") //Grab the token from the header

		if tokenHeader == "" || len(strings.Split(tokenHeader, " "))!=2 { //Token is missing, returns with error code 403 Unauthorized
			renderResponse(w, r,buildErrorResponse(userErrors["InvalidToken"]),http.StatusForbidden)
			return
		}

		tokenPart := strings.Split(tokenHeader, " ")[1] //Grab the token part, what we are truly interested in

		tokenData := Token{}

		token, err := jwt.ParseWithClaims(tokenPart, tokenData, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("token_password")), nil
		})

		if err != nil || !token.Valid { //Malformed token, returns with http code 403 as usual
			renderResponse(w, r,buildErrorResponse(userErrors["InvalidToken"]),http.StatusForbidden)
			return
		}

		//Everything went well, proceed with the request and set the caller to the user retrieved from the parsed token
		ctx := context.WithValue(r.Context(), "user", tokenData.UserId)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r) //proceed in the middleware chain!
	})
}