package features

import (
	"github.com/go-chi/chi"
	"net/http"
)

type Statistics struct{
	OrderStatistics OrderStatistics `json:"orderStatistics"`
	ProductStatistics []ProductStatistic `json:"productStatistics"`
}

type OrderStatistics struct {
	TotalPrice string `json:"totalPrice"`
	ToBusiness string `json:"toBusiness"`
	TotalProductsOrderedCount string `json:"totalProductsOrdered"`
}

type ProductStatistic struct {
	Id uint `json:"id"`
	Title string `json:"title"`
	Count int `json:"count"`
	TotalPrice int `json:"totalPrice"`
}

func StatisticsRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/", GetStatistics)
	return router
}

func GetStatistics(w http.ResponseWriter, r *http.Request) {
	var orderStatistic OrderStatistics
	var productStatistics []ProductStatistic

	err := db.Raw(`	SELECT SUM(total_price)as total_price, SUM(to_business) as to_business, COUNT(product_id) as total_products_ordered_count
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id`).Scan(&orderStatistic).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	err = db.Raw(`SELECT products.id,title,COUNT(product_id),SUM(total_price) as total_price
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id
	GROUP BY products.id`).Scan(&productStatistics).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	statistics := Statistics{OrderStatistics: orderStatistic, ProductStatistics: productStatistics }

	renderResponse(w, r,statistics,http.StatusOK)
}