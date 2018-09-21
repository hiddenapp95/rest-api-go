package features

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/jinzhu/gorm"
	"net/http"
)

type Product struct {
	gorm.Model
	Name string `json:"name"`
	Price string `json:"price"`
	Status  bool `json:"status"`
}

func ProductRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/", GetProducts)
	router.Post("/", CreateProduct)
	router.Put("/",UpdateProduct)
	return router
}

var productErrors = map[string]int{
	"InvalidParams": 1,
	"DbError": 2,
}

func GetProducts(w http.ResponseWriter, r *http.Request) {
	//todoID := chi.URLParam(r, "todoID")
	products := make([]*Product, 0)
	err := GetDB().Table("products").Find(&products).Error
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}
	renderResponse(w, r,products,http.StatusOK)
}

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	product := &Product{}

	err := json.NewDecoder(r.Body).Decode(product) //decode the request body into struct and failed if any error occur
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}

	err = db.Model(&product).Where("id = ?", product.ID).Updates(product).Error
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}

	product.Status = !product.Status

	renderResponse(w, r,product,http.StatusOK)
}

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	product := &Product{}

	err := json.NewDecoder(r.Body).Decode(product) //decode the request body into struct and failed if any error occur

	if err!=nil{
		renderResponse(w, r,buildErrorResponse(userErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,product,http.StatusOK)
}
