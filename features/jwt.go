package features

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"os"
	"rest-api/utils"
	"strings"
)

var JwtAuthentication = func(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		notAuth := []string{
			"/api/users/create",
			"/api/users/create/",
			"/api/users/login",
			"/api/users/login/"} //List of endpoints that doesn't require users
		requestPath := r.URL.Path //current request path

		if utils.InArray(requestPath,notAuth) || true {
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
		ctx := context.WithValue(r.Context(), "userId", tokenData.UserId)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r) //proceed in the middleware chain!
	})
}
