package features

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/jinzhu/gorm"
	"net/http"
	"strconv"
)

type ProductRequestInfo struct{
	ProductId uint `json:"productId"`
	ProductQuantity uint `json:"quantity"`
}

type ProductRequest struct {
	gorm.Model
	ProductId uint `json:"product"`
	UserId uint `json:"userId"`
}

func ProductRequestsRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/{property}-{value}", GetProductRequests)
	router.Get("/myRequests", GetUserProductRequests)
	router.Post("/", CreateProductRequests)
	router.Put("/",UpdateProductRequests)
	return router
}

var productRequestsErrors = map[string]int{
	"InvalidParams": 1,
	"DbError": 2,
}

func GetUserProductRequests(w http.ResponseWriter, r *http.Request) {
	productRequests := make([]*ProductRequest, 0)
	userId := r.Context().Value("userId") . (uint)
	err := GetDB().Table("product_requests").Where("user_id = " + strconv.FormatUint(uint64(userId),10)).Find(&productRequests).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}
	renderResponse(w, r,productRequests,http.StatusOK)
}

func GetProductRequests(w http.ResponseWriter, r *http.Request) {
	productRequests := make([]*ProductRequest, 0)
	property := chi.URLParam(r,"property")
	value := chi.URLParam(r,"value")

	var err error

	if property == "all"{
		err = GetDB().Table("product_requests").Find(&productRequests).Error
	}else{
		err = GetDB().Table("product_requests").Where(property+" = " +value).Find(&productRequests).Error
	}

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}
	renderResponse(w, r,productRequests,http.StatusOK)
}

func UpdateProductRequests(w http.ResponseWriter, r *http.Request) {
	product := &Product{}

	err := json.NewDecoder(r.Body).Decode(product) //decode the request body into struct and failed if any error occur
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}
	err = db.Save(&product).Where("id = ?", product.ID).Error
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,product,http.StatusOK)
}

func CreateProductRequests(w http.ResponseWriter, r *http.Request) {
	var productRequestInfo []ProductRequestInfo

	err := json.NewDecoder(r.Body).Decode(&productRequestInfo)//decode the request body into struct and failed if any error occur

	if err!=nil{
		renderResponse(w, r,buildErrorResponse(productRequestsErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}

	var productRequests []ProductRequest
	
	for _, element := range productRequestInfo {
		productRequest := ProductRequest{}
		productRequest.UserId = r.Context().Value("userId"). (uint)
		productRequest.ProductId = element.ProductId

		err = GetDB().Create(&productRequest).Error
		if err!=nil{
			renderResponse(w, r,buildErrorResponse(productRequestsErrors["DbError"]),http.StatusBadRequest)
			return
		}

		productRequests = append(productRequests, productRequest)
	}

	renderResponse(w, r,productRequests,http.StatusOK)
}
