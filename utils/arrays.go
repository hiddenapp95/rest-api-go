package utils

func InArray(val string, array []string) (bool) {
	for _, element := range array {
		if element == val{
			return true
		}
	}
	return false
}