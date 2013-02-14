GWDP.domain.WFSAjaxParams = function(typeName) {
	var params = {
		SERVICE: 'WFS',
		VERSION: "1.0.0",
		srsName: "EPSG:4326",
		outputFormat: 'GML2',
		typeName: typeName
	};
	return params;
};

GWDP.domain.constructParams = function(typeName, bbox, filters, forHits) {
	var requestParams = GWDP.domain.WFSAjaxParams(typeName);
	
	if(forHits) {
		requestParams.resultType="hits"; 
		requestParams.VERSION="1.1.0"; //to enable resultType=hits
	}
	
	if(!filters) {
		requestParams.BBOX=bbox;
	} else {
		//TODO include bbox inside of filtering mechanism
		requestParams.CQL_FILTER=GWDP.domain.getFilterCQL(filters);
	}
	
	return requestParams;
};

GWDP.domain.getFilterCQL = function(filters) {
	var filterArray = [];
	for(var k in filters) {
		filterArray.push(new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: k,
          value: filters[k]
      }));
	}
	
	var olFilter = new OpenLayers.Filter.Logical({
      type: OpenLayers.Filter.Logical.AND,
      filters: filterArray
  });
	
	return olFilter.toString();
};

GWDP.domain.loadOpenlayersRecordIntoArrayStore = function(records, store) {
	var recordsArray = [];
	var fieldsArray = store.fields.items;
	for(var i = 0; i < records.length; i++) {
		var record = [];
		for(var j = 0; j < fieldsArray.length; j++){
			var attribute = fieldsArray[j].mapping || fieldsArray[j].name;
			record.push(records[i].data[attribute]);
		}
		recordsArray.push(record);
	}
	store.loadData(recordsArray);
};