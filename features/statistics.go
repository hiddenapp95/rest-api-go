package features

import (
	"github.com/go-chi/chi"
	"net/http"
)

type Statistic struct {
	TotalPrice string `json:"totalPrice"`
	ToBusiness string `json:"toBusiness"`
}

func StatisticsRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/", GetStatistics)
	return router
}

func GetStatistics(w http.ResponseWriter, r *http.Request) {
	var statistic Statistic

	err := db.Raw(`	SELECT SUM(total_price)as total_price, SUM(to_business) as to_business
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id`).Scan(&statistic).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(errorMap["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,statistic,http.StatusOK)
}