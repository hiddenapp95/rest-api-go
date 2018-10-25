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
	TotalPrice int `json:"totalPrice"`
	ToBusiness int `json:"toBusiness"`
	TotalProductsOrderedCount int `json:"totalProductsOrdered"`
	TotalPriceFromPrivate int `json:"totalPriceFromPrivate"`
	TotalPriceFromNotPrivate int `json:"totalPriceFromNotPrivate"`
	TotalProductsOrderedCountFromPrivate int `json:"totalProductsOrderedFromPrivate"`
	TotalProductsOrderedCountFromNotPrivate int `json:"totalProductsOrderedFromNotPrivate"`
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

	err := db.Raw(`	SELECT 	SUM(total_price)as total_price,
		(
		   SELECT SUM(total_price)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = true
		) as total_price_from_private,
		(
		   SELECT SUM(total_price)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = false
		) as total_price_from_not_private,
		SUM(to_business) as to_business,
		COUNT(product_id) as total_products_ordered_count,
		(
		   SELECT COUNT(product_id)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = true
		) as to_business_from_private,
		(
		   SELECT COUNT(product_id)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = false
		) as to_business_from_not_private
FROM public.product_orders
INNER JOIN products on product_orders.product_id = products.id`).Scan(&orderStatistic).Error


	/*
	SELECT 	SUM(total_price)as total_price,
		(
		   SELECT SUM(total_price)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = true
		) as total_price_from_private,
		(
		   SELECT SUM(total_price)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = false
		) as total_price_from_not_private,
		SUM(to_business) as to_business,
		COUNT(product_id) as total_products_ordered_count,
		(
		   SELECT COUNT(product_id)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = true
		) as from_private_to_business,
		(
		   SELECT COUNT(product_id)
		   FROM public.product_orders
			INNER JOIN products on product_orders.product_id = products.id
			where products.private = false
		) as from_not_private_to_business
FROM public.product_orders
INNER JOIN products on product_orders.product_id = products.id
	*/


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