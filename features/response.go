package features

import (
	"github.com/go-chi/render"
	"net/http"
)

func buildErrorResponse (errorType int) (map[string]interface{}) {
	return map[string]interface{} {"errorType" : errorType}
}

func renderResponse (w http.ResponseWriter, r *http.Request,message interface{},status int) {
	w.WriteHeader(status)
	render.JSON(w, r, message )
}