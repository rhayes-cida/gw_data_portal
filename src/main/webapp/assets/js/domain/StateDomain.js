GWDP.domain.State.getStateStore = function(params) {
	var str = GWDP.domain.getJsonStore(['STATE_CD','STATE_NM','COUNT'], "metadata/states");
	if(params.defaultOption) {
		str.loadData([{
			STATE_CD: params.defaultOption, 
			STATE_NM: params.defaultOption,
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
GWDP.domain.State.getStateMetadata = function(params, callback, defaultOption) {
	var _store = GWDP.domain.State.getStateStore({defaultOption: defaultOption});
	Ext.Ajax.request({
		url: 'metadata/states',
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