package features

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"net/http"
	"time"
)

type ProductRequestInfo struct{
	Id uint `json:"id"`
	Quantity int `json:"quantity"`
}

type ProductRequest struct {
	BaseModel
	ProductId uint `json:"product"`
	UserId uint `json:"userId"`
}

type ProductOrder struct{
	Quantity int `json:"quantity"`
	ProductId int `json:"productId"`
	Price uint64 `json:"price"`
	Title string `json:"title"`
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
	var productOrders []ProductOrder
	//userId := r.Context().Value("userId") . (uint)
	//userId := 1
	//err := GetDB().Table("product_requests").Where("user_id = " + strconv.FormatUint(uint64(userId),10)).Find(&productRequests).Error
	err := db.Raw(`SELECT COUNT(product_id)as Quantity,product_id as ProductId, SUM(price) as Price, title as Title
	FROM public.product_requests
	INNER JOIN products on product_requests.product_id = products.id
	where user_id = 1
	GROUP BY product_id,price,title`).Scan(&productOrders).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}
	renderResponse(w, r,productOrders,http.StatusOK)
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
	product.CreatedAt = time.Now()
	err = db.Save(&product).Where("id = ?", product.Id).Error
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

	for _, element := range productRequestInfo {

		for i := 0; i < element.Quantity; i++ {
		productRequest := ProductRequest{}
		//productRequest.UserId = r.Context().Value("userId"). (uint)
		productRequest.UserId = 1
		productRequest.ProductId = element.Id
		productRequest.CreatedAt = time.Now()

			err = GetDB().Create(&productRequest).Error
			if err!=nil{
				renderResponse(w, r,buildErrorResponse(productRequestsErrors["DbError"]),http.StatusBadRequest)
				return
			}
		}
	}

	renderResponse(w, r,productRequestInfo,http.StatusOK)
}
