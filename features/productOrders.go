package features

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"net/http"
	"time"
)

type ProductOrderRequest struct {
	CustomerName string `json:"customerName"`
	Products []ProductToOrder `json:"products"`
}

type ProductToOrder struct{
	Id uint `json:"id"`
	Quantity int `json:"quantity"`
}

type ProductOrder struct {
	BaseModel
	ProductId uint `json:"product"`
	CustomerName string `json:"customerName"`
}

type CustomerProductOrder struct{
	Quantity int `json:"quantity"`
	ProductId int `json:"productId"`
	Price uint64 `json:"price"`
	Title string `json:"title"`
	CustomerName string `json:"customerName"`
}

type CustomerProductOrderResponse struct {
	CustomerName string `json:"customerName"`
	Products []CustomerProductOrder `json:"products"`
}

func ProductRequestsRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/{property}-{value}", GetProductRequests)
	router.Get("/myRequests", GetProductOrders)
	router.Post("/", CreateProductRequests)
	router.Put("/",CreateProductRequests)
	return router
}

var productRequestsErrors = map[string]int{
	"InvalidParams": 1,
	"DbError": 2,
}

func GetProductOrders(w http.ResponseWriter, r *http.Request) {
	var productOrders []CustomerProductOrder

	//userId := r.Context().Value("userId") . (uint)
	//userId := 1
	//err := GetDB().Table("product_requests").Where("user_id = " + strconv.FormatUint(uint64(userId),10)).Find(&productRequests).Error
	err := db.Raw(`	SELECT customer_name,product_id,COUNT(product_id)as Quantity, total_price, title
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id
	GROUP BY customer_name,product_id,total_price,title`).Scan(&productOrders).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}

	var response = map[string][]CustomerProductOrder{}

	for _, element := range productOrders {
		response[element.CustomerName] = append(response[element.CustomerName], element)
	}

	renderResponse(w, r,response,http.StatusOK)
}

func GetProductRequests(w http.ResponseWriter, r *http.Request) {
	var productRequests []CustomerProductOrder
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
	product.CreatedAt = time.Now()
	err = db.Save(&product).Where("id = ?", product.Id).Error
	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,product,http.StatusOK)
}

func CreateProductRequests(w http.ResponseWriter, r *http.Request) {
	var productRequestInfo ProductOrderRequest

	err := json.NewDecoder(r.Body).Decode(&productRequestInfo)//decode the request body into struct and failed if any error occur

	if err!=nil{
		renderResponse(w, r,buildErrorResponse(productRequestsErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}

	tx := db.Begin()

	if tx.Error != nil {
		renderResponse(w, r,buildErrorResponse(productRequestsErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}

	err = GetDB().Delete(ProductOrder{}, "customer_name = ?", productRequestInfo.CustomerName).Error

	if err!=nil{
		tx.Rollback()
		renderResponse(w, r,buildErrorResponse(productRequestsErrors["InvalidParams"]),http.StatusBadRequest)
		return
	}

	for _, element := range productRequestInfo.Products {

		for i := 0; i < element.Quantity; i++ {
		productRequest := ProductOrder{}
		//productRequest.UserId = r.Context().Value("userId"). (uint)
		//productRequest.UserId = 1
		productRequest.ProductId = element.Id
		productRequest.CustomerName = productRequestInfo.CustomerName
		productRequest.CreatedAt = time.Now()

			err = GetDB().Create(&productRequest).Error
			if err!=nil{
				tx.Rollback()
				renderResponse(w, r,buildErrorResponse(productRequestsErrors["DbError"]),http.StatusBadRequest)
				return
			}
		}
	}

	tx.Commit()
	renderResponse(w, r,productRequestInfo,http.StatusOK)
}
