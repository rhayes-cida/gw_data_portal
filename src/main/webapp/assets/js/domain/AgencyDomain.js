GWDP.domain.Agency.getAgencyStore = function(params) {
	var str = GWDP.domain.getJsonStore(['AGENCY_CD','AGENCY_NM','COUNT'], "metadata/agencies");
	if(params.defaultOption) {
		str.loadData([{
			AGENCY_CD: params.defaultOption, 
			AGENCY_NM: params.defaultOption,
			COUNT:params.defaultOption}]);
	}
	return str;
};

/**
 * @param params json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes loaded store as single parameter
 * @param defaultOption the string value of a record that will be inserted at position 0.
 * 
 * @return a json store, that will be in the process of loading. callback is called when loaded. 
 */
GWDP.domain.Agency.getAgencyMetadata = function(params, callback, defaultOption) {
	var _store = GWDP.domain.Agency.getAgencyStore({defaultOption: defaultOption});
	Ext.Ajax.request({
		url: 'metadata/agencies',
		method: 'GET',
		params: params, 
		success: function(response, options) {
			_store = GWDP.domain.loadJsonIntoStore(
					response.responseText, 
					_store,
					defaultOption
			);
			if(callback) callback(_store);
		}
	});
	return _store;
};
