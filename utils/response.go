package utils

func BuildResponse (message string) (map[string]interface{}) {
	return map[string]interface{} {"message" : message}
}