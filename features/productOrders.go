package features

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"net/http"
	"time"
)

type ProductOrder struct {
	BaseModel
	ProductId uint `json:"product"`
	CustomerName string `json:"customerName"`
	CreatedByUserId uint `json:"createdByUserId"`
}

type CustomerProductOrder struct{
	Quantity int `json:"quantity"`
	ProductId int `json:"productId"`
	TotalPrice uint64 `json:"totalPrice"`
	Title string `json:"title"`
	CustomerName string `json:"customerName"`
}

type ProductSummary struct{
	Title string `json:"title"`
	Quantity int `json:"quantity"`
	CustomerName string `json:"customerName"`
}

type CustomerName struct{
	CustomerName string `json:"customerName"`
}

func ProductRequestsRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/name/{name}", GetProductOrderByName)
	router.Get("/", GetCustomers)
	router.Post("/", CreateProductRequests)
	router.Put("/",CreateProductRequests)
	router.Delete("/",DeleteAllCustomers)
	router.Get("/productsSummary",GetProductsSummary)
	return router
}
func DeleteAllCustomers(w http.ResponseWriter, r *http.Request) {
	err :=  GetDB().Delete(ProductOrder{}).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,"OK",http.StatusOK)
}



func GetProductsSummary(w http.ResponseWriter, r *http.Request) {
	var productsSumary []ProductSummary

	err := db.Raw(`SELECT title, COUNT(product_id) as Quantity, customer_name
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id
	GROUP BY title,customer_name`).Scan(&productsSumary).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,productsSumary,http.StatusOK)
}

func GetCustomers(w http.ResponseWriter, r *http.Request) {
	var customerName []CustomerName

	err := db.Raw(`SELECT customer_name
	FROM public.product_orders
	GROUP BY customer_name`).Scan(&customerName).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,customerName,http.StatusOK)
}

func GetProductOrders(w http.ResponseWriter, r *http.Request) {
	var productOrders []CustomerProductOrder

	err := db.Raw(`	SELECT customer_name,product_id,COUNT(product_id)as Quantity, total_price, title
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id
	GROUP BY customer_name,product_id,total_price,title`).Scan(&productOrders).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	var response = map[string][]CustomerProductOrder{}

	for _, element := range productOrders {
		response[element.CustomerName] = append(response[element.CustomerName], element)
	}

	renderResponse(w, r,response,http.StatusOK)
}
func GetProductOrderByName(w http.ResponseWriter, r *http.Request) {
	var productOrders []CustomerProductOrder
	name := chi.URLParam(r,"name")

	err := db.Raw(`	SELECT customer_name,product_id,COUNT(product_id)as Quantity, total_price , title
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id
	where customer_name= '` + name + `' GROUP BY customer_name,product_id,total_price,title`).Scan(&productOrders).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,productOrders,http.StatusOK)
}

type CreateProductOrderRequest struct {
	CustomerName string `json:"customerName"`
	Products []CreateProductOrder `json:"products"`
}

type CreateProductOrder struct{
	Id uint `json:"id"`
	Quantity int `json:"quantity"`
}

func CreateProductRequests(w http.ResponseWriter, r *http.Request) {
	var createProductRequest CreateProductOrderRequest
	userId := r.Context().Value("userId") . (uint)

	err := json.NewDecoder(r.Body).Decode(&createProductRequest)//decode the request body into struct and failed if any error occur

	if err!=nil{
		renderResponse(w, r,buildErrorResponse(errorMap["InvalidParams"]),http.StatusBadRequest)
		return
	}

	tx := db.Begin()

	if tx.Error != nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	err = GetDB().Delete(ProductOrder{}, "customer_name = ?", createProductRequest.CustomerName).Error

	if err!=nil{
		tx.Rollback()
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	now := time.Now()

	for _, element := range createProductRequest.Products {

		for i := 0; i < element.Quantity; i++ {
			productRequest := ProductOrder{}
			productRequest.ProductId = element.Id
			productRequest.CustomerName = createProductRequest.CustomerName
			productRequest.CreatedAt = now
			productRequest.CreatedByUserId = userId

			err = GetDB().Create(&productRequest).Error
			if err!=nil{
				tx.Rollback()
				renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
				return
			}
		}
	}

	tx.Commit()
	renderResponse(w, r,createProductRequest,http.StatusOK)
}
