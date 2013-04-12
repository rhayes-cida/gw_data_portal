GWDP.domain.County.getCountyStore = function(params) {
	var str = GWDP.domain.getJsonStore(['STATE_NM','COUNTY_NM','COUNTY_CD','COUNT'], "metadata/counties");
	if(params.defaultOption) {
		str.loadData([{
			STATE_NM: params.defaultOption,
			COUNTY_NM: params.defaultOption,
			COUNTY_CD: params.defaultOption,
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
GWDP.domain.County.getCountyMetadata = function(params, callback, defaultOption) {
	var _store = GWDP.domain.County.getCountyStore({defaultOption: defaultOption});
	if(!params) {
		params = {};
	}
	if(!params.stateCd) {
		params.stateCd = 0;
	}
	Ext.Ajax.request({
		url: 'metadata/counties',
		method: 'POST',
		params: params, 
		success: function(response, options) {
			if(response.responseText =='[]') {
				if(defaultOption) _store.loadData([{
					STATE_NM: defaultOption,
					COUNTY_NM: defaultOption,
					COUNTY_CD: defaultOption,
					COUNT:defaultOption}]);
			} else {
				_store = GWDP.domain.loadJsonIntoStore(
						response.responseText, 
						_store,
						defaultOption
				);
			}
			if(callback) callback(_store);
		}
	});
	return _store;
};


GWDP.domain.County.updateCountyMetadata = function(store, params, callback, defaultOption) {
	if(!params) {
		params = {};
	}
	if(!params.stateCd) {
		params.stateCd = 0;
	}
	Ext.Ajax.request({
		url: 'metadata/counties',
		method: 'POST',
		params: params, 
		success: function(response, options) {
			if(response.responseText =='[]') {
				if(defaultOption) store.loadData([{
					STATE_NM: defaultOption,
					COUNTY_NM: defaultOption,
					COUNTY_CD: defaultOption,
					COUNT:defaultOption}]);
			} else {
				store = GWDP.domain.loadJsonIntoStore(
						response.responseText, 
						store,
						defaultOption
				);
			}
			if(callback) callback(store);
		}
	});
	return store;
};