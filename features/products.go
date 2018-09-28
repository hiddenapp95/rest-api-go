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
	Price uint64 `json:"price"`
	Enabled  bool `json:"enabled"`
}

func ProductRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/{property}-{value}", GetProducts)
	router.Post("/", CreateProduct)
	router.Put("/",UpdateProduct)
	return router
}

var productErrors = map[string]int{
	"InvalidParams": 1,
	"DbError": 2,
}

func GetProducts(w http.ResponseWriter, r *http.Request) {
	products := make([]*Product, 0)
	property := chi.URLParam(r,"property")
	value := chi.URLParam(r,"value")

	var err error

	if property == "all"{
		err = GetDB().Table("products").Find(&products).Error
	}else{
		err = GetDB().Table("products").Where(property+"  = " +value).Find(&products).Error
	}

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

	product.UpdatedAt = time.Now()
	err = db.Save(&product).Where("id = ?", product.Id).Error
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,product,http.StatusOK)
}

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	product := &Product{}

	err := json.NewDecoder(r.Body).Decode(product) //decode the request body into struct and failed if any error occur

	if err!=nil{
		renderResponse(w, r,buildErrorResponse(userErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}
	product.CreatedAt = time.Now()
	err = GetDB().Create(product).Error
	if err!=nil{
		renderResponse(w, r,buildErrorResponse(userErrors["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,product,http.StatusOK)
}
