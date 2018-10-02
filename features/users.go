package features

import (
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"io/ioutil"
	"net/http"
	"os"
)

func UserRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Post("/login", Login)
	return router
}

type User struct {
	BaseModel
	Email string `json:"email" binding:"required"`
	Name  string `json:"name"`
}

type Token struct {
	UserId uint `json:"userId,omitempty" binding:"required"`
	Email string `json:"email,omitempty" binding:"required"`
	Role string `json:"role,omitempty" binding:"required"`
	Token string `json:"token,omitempty" binding:"required"`
	jwt.StandardClaims
}

type LoginRequest struct{
	AccessToken string `json:"accessToken"`
}

type GoogleResponse struct{
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Link          string `json:"link"`
	Picture       string `json:"picture"`
	Locale        string `json:"locale"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	loginRequest := &LoginRequest{}
	err := json.NewDecoder(r.Body).Decode(loginRequest)

	if err != nil {
		renderResponse(w, r,buildErrorResponse(errorMap["InvalidParams"]),http.StatusBadRequest)
		return
	}

	url := "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + loginRequest.AccessToken
	resp, err := http.Get(url)

	if err != nil {
		renderResponse(w, r,buildErrorResponse(errorMap["GoogleError"]),http.StatusBadRequest)
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	googleResponse := GoogleResponse{}

	json.Unmarshal([]byte(body), &googleResponse)

	user := &User{}
	err = GetDB().Table("users").Where("email = ?", googleResponse.Email).First(user).Error

	if err != nil {
		renderResponse(w, r,buildErrorResponse(errorMap["UserNotFound"]),http.StatusBadRequest)
		return
	}

	tk := &Token{UserId: user.Id,Email: user.Email}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	tk.Token = tokenString

	renderResponse(w, r,tk,http.StatusOK)
	return
}

