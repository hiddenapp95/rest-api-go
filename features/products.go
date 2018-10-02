package features

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"net/http"
	"time"
)

type Product struct {
	BaseModel
	Title string `json:"title"`
	Image string `json:"image"`
	Description string `json:"description"`
	TotalPrice uint64 `json:"totalPrice"`
	ToBusiness uint64 `json:"toBusiness"`
	Enabled  bool `json:"enabled"`
}

func ProductRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/all", GetProducts)
	router.Get("/enabled", GetAvailableProducts)
	router.Post("/", CreateProduct)
	router.Put("/",UpdateProduct)
	return router
}

func GetAvailableProducts(w http.ResponseWriter, r *http.Request) {
	var products []Product

	var err error
	err = GetDB().Table("products").Where("enabled = " ,true).Find(&products).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}
	renderResponse(w, r,products,http.StatusOK)
}


func GetProducts(w http.ResponseWriter, r *http.Request) {
	var products []Product

	var err error
	err = GetDB().Table("products").Find(&products).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}
	renderResponse(w, r,products,http.StatusOK)
}

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	product := &Product{}

	err := json.NewDecoder(r.Body).Decode(product) //decode the request body into struct and failed if any error occur
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["InvalidParams"]),http.StatusBadRequest)
		return
	}

	product.UpdatedAt = time.Now()
	err = db.Save(&product).Where("id = ?", product.Id).Error
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,product,http.StatusOK)
}

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	product := &Product{}

	err := json.NewDecoder(r.Body).Decode(product) //decode the request body into struct and failed if any error occur

	if err!=nil{
		renderResponse(w, r,buildErrorResponse(errorMap["InvalidParams"]),http.StatusBadRequest)
		return
	}
	product.CreatedAt = time.Now()
	err = GetDB().Create(product).Error
	if err!=nil{
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,product,http.StatusOK)
}
