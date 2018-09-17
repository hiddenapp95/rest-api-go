package features

import (
	"context"
	"encoding/json"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"rest-api/utils"
	"strings"
)

type User struct {
	gorm.Model
	Email string `json:"email"`
	Password string `json:"password"`
	Role string `json:"role"`
	Token string `json:"token";sql:"-"`
}

type Token struct {
	UserId uint
	jwt.StandardClaims
}

func UserRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Post("/", Create)
	return router
}


func Create(w http.ResponseWriter, r *http.Request)  {

	user := &User{}
	err := json.NewDecoder(r.Body).Decode(user) //decode the request body into struct and failed if any error occur
	if err != nil {
		render.JSON(w, r, utils.BuildResponse("Invalid request"))
		return
	}

	tempUser := &User{}

	err = GetDB().Table("users").Where("email = ?", user.Email).First(tempUser).Error

	if  err != nil && err != gorm.ErrRecordNotFound {
		render.JSON(w, r, utils.BuildResponse("Invalid request"))
		return
	}

	if err != gorm.ErrRecordNotFound{
		render.JSON(w, r, utils.BuildResponse("Mail already in use"))
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)

	GetDB().Create(user)

	if user.ID <= 0 {
		render.JSON(w, r, utils.BuildResponse( "Failed to create account, connection error."))
		return
	}

	render.JSON(w, r, utils.BuildResponse("CreatedUser"))
	return
}


func Login(w http.ResponseWriter, r *http.Request) {

	user := &User{}
	err := json.NewDecoder(r.Body).Decode(user) //decode the request body into struct and failed if any error occur
	if err != nil {
		render.JSON(w, r, utils.BuildResponse("Invalid request"))
		return
	}

	email := user.Email
	password := user.Password

	err = GetDB().Table("users").Where("email = ?", email).First(user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			render.JSON(w, r, utils.BuildResponse("Email address not found"))
			return
		}
		render.JSON(w, r, utils.BuildResponse("Email address not found"))
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil || err == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		render.JSON(w, r, utils.BuildResponse("Invalid login credentials. Please try again"))
		return
	}

	//Worked! Logged In
	user.Password = ""

	//Create JWT token
	tk := &Token{UserId: user.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString //Store the token in the response

	resp := utils.BuildResponse("OK")
	resp["user"] = user
	render.JSON(w, r,resp)
	return
}

var JwtAuthentication = func(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		notAuth := []string{"/api/users/new","/api/users/","/api/users", "/api/users/login"} //List of endpoints that doesn't require users
		requestPath := r.URL.Path //current request path

		if utils.InArray(requestPath,notAuth) {
			next.ServeHTTP(w, r)
			return
		}

		response := make(map[string]string)
		tokenHeader := r.Header.Get("Authorization") //Grab the token from the header

		if tokenHeader == "" || len(strings.Split(tokenHeader, " "))!=2 { //Token is missing, returns with error code 403 Unauthorized
			response["message"] = "Invalid token"
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			render.JSON(w, r, response)
			return
		}

		tokenPart := strings.Split(tokenHeader, " ")[1] //Grab the token part, what we are truly interested in

		tokenData := Token{}

		token, err := jwt.ParseWithClaims(tokenPart, tokenData, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("token_password")), nil
		})

		if err != nil || !token.Valid { //Malformed token, returns with http code 403 as usual
			response["message"] = "Invalid token"
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			render.JSON(w, r, response)
			return
		}

		//Everything went well, proceed with the request and set the caller to the user retrieved from the parsed token
		ctx := context.WithValue(r.Context(), "user", tokenData.UserId)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r) //proceed in the middleware chain!
	})
}