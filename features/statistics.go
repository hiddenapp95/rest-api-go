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

var statisticsErrors = map[string]int{
	"InvalidParams": 1,
	"DbError": 2,
}

func GetStatistics(w http.ResponseWriter, r *http.Request) {
	var statistic Statistic

	//userId := r.Context().Value("userId") . (uint)
	//userId := 1
	//err := GetDB().Table("product_requests").Where("user_id = " + strconv.FormatUint(uint64(userId),10)).Find(&productRequests).Error
	err := db.Raw(`	SELECT SUM(total_price)as total_price, SUM(to_business) as to_business
	FROM public.product_orders
	INNER JOIN products on product_orders.product_id = products.id`).Scan(&statistic).Error

	if err!=nil {
		renderResponse(w, r,buildErrorResponse(productErrors["DbError"]),http.StatusBadRequest)
		return
	}

	renderResponse(w, r,statistic,http.StatusOK)
}