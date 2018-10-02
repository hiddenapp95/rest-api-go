package features

import "errors"

var errorMap = map[string]error{
	"DbError": errors.New("DefaultError"),
	"InvalidToken": errors.New("InvalidToken"),
	"TokenMissing": errors.New("TokenMissing"),
	"InvalidParams": errors.New("InvalidParams"),
	"GoogleError": errors.New("GoogleError"),
	"UserNotFound": errors.New("UserNotFound"),
}