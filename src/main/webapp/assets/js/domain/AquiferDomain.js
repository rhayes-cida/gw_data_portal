GWDP.domain.Aquifer.getAquiferStore = function(params) {
	var str = GWDP.domain.getJsonStore(['AQUIFER','AQUIFERCODE','COUNT'], "metadata/aquifers");
	if(params.defaultOption) {
		str.loadData([{
			AQUIFER: params.defaultOption, 
			AQUIFERCODE: params.defaultOption,
			COUNT:params.defaultOption
		}]);
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
GWDP.domain.Aquifer.getAquiferMetadata = function(params, callback, defaultOption) {
	var _store = GWDP.domain.Aquifer.getAquiferStore({defaultOption: defaultOption});
	Ext.Ajax.request({
		url: 'metadata/aquifers',
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