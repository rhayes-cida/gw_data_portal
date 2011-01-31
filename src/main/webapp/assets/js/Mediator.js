var MEDIATOR = {};

MEDIATOR.cleanAgencyCode = function(value){
	// Replaces one or more non alphanumeric characters by single underscore
	var result = value.replace(/\W/g,"_");
	result = result.replace(/__+/g,"_");
	return result;
}
