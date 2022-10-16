
var CaptchaGet_possibleTypes = ['CaptchaGet']
export var isCaptchaGet = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isCaptchaGet"')
  return CaptchaGet_possibleTypes.includes(obj.__typename)
}



var CaptchaVerify_possibleTypes = ['CaptchaVerify']
export var isCaptchaVerify = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isCaptchaVerify"')
  return CaptchaVerify_possibleTypes.includes(obj.__typename)
}



var Mutation_possibleTypes = ['Mutation']
export var isMutation = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isMutation"')
  return Mutation_possibleTypes.includes(obj.__typename)
}



var Query_possibleTypes = ['Query']
export var isQuery = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isQuery"')
  return Query_possibleTypes.includes(obj.__typename)
}



var Service_possibleTypes = ['Service']
export var isService = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isService"')
  return Service_possibleTypes.includes(obj.__typename)
}
