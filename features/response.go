package features

import (
	"github.com/go-chi/render"
	"net/http"
)

func buildErrorResponse (errorType error) (map[string]interface{}) {
	return map[string]interface{} {"error" : errorType.Error()}
}

func renderResponse (w http.ResponseWriter, r *http.Request,message interface{},status int) {
	w.WriteHeader(status)
	render.JSON(w, r, message )
}