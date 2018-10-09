package main

import (
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"log"
	"net/http"
	"os"
	"path/filepath"
	. "rest-api/features"
	"strings"
)


var corsHandler = func(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		enableCors(&w)

		if (*r).Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r) //proceed in the middleware chain!
	})
}

func enableCors(w *http.ResponseWriter) {

	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Use(
		//render.SetContentType(render.ContentTypeJSON), // Set content-Type headers as application/json
		middleware.Logger,                             // Log API request calls
		//middleware.DefaultCompress,                    // Compress results, mostly gzipping assets and json
		//middleware.RedirectSlashes,                    // Redirect slashes to no slash URL versions
		//middleware.Recoverer,                          // Recover from panics without crashing server
	)

	router.Use(corsHandler)
	router.Use(JwtAuthentication) //attach JWT users middleware


	router.Route("/api", func(r chi.Router) {
		r.Mount("/products", ProductRoutes())
		r.Mount("/users", UserRoutes())
		r.Mount("/productOrders", ProductRequestsRoutes())
		r.Mount("/statistics", StatisticsRoutes())
		r.Mount("/gc",GoogleCloudStorageRoutes())
	})

	workDir, _ := os.Getwd()
	filesDir := filepath.Join(workDir, "files")
	FileServer(router, "/", http.Dir(filesDir))

	return router
}


func main() {
	router := Routes()

	log.Fatal(http.ListenAndServe(":8081", router)) // Note, the port is usually gotten from the environment.
}



func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	fs := http.StripPrefix(path, http.FileServer(root))

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//w.Header().Set("Content-Type", "text/html; charset=utf-8")
		//w.Header().Set("Content-Type", "application/xml")
		fs.ServeHTTP(w, r)
	}))
}