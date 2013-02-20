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

GWDP.domain.getArrayStore = function(fieldsArray){
	return new Ext.data.ArrayStore({
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
		    url: 'identify'		
		}),
	    autoDestroy: false,
	    storeId: 'myStore',
	    fields: fieldsArray
	});
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


/**
 * @param bbox bbox must be in format x,y,x,y
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes an array of json objects which represents a feature
 */
GWDP.domain.getDomainObjects = function(protocol, typeName, bbox, filters, callback) {	
	Ext.Ajax.request({
		url: GWDP.ui.map.baseWFSServiceUrl,
		method: 'GET',
		params: GWDP.domain.constructParams(typeName, bbox, filters, false),
		success: function(response, options) {
			callback(protocol.parseResponse(response));
		}
	});
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.getDomainObjectsCount = function(typeName, bbox, filters, callback) {
	Ext.Ajax.request({
		url: GWDP.ui.map.baseWFSServiceUrl,
		method: 'GET',
		params: GWDP.domain.constructParams(typeName, bbox, filters, true),
		success: function(response, options) {
			var numOfRecs = response.responseXML.lastChild.attributes.getNamedItem('numberOfFeatures').value;
			callback(numOfRecs);
		}
	});
};

GWDP.domain.getAgencyLogo = function(agencyCd, stateCd) {
	if (agencyCd == 'IL EPA') { 
		return 'iepa_logo.jpg'; 
	} else if (agencyCd == 'IN DNR') { 
		return 'indnrtitle.gif'; 
	} else if (agencyCd == 'ISWS') { 
		return 'ilstatewatersurvey.gif'; 
	} else if (agencyCd == 'MBMG') { 
		return 'MontanaBMG.jpg';
	} else if (agencyCd == 'MN DNR') { 
		return 'mn_dnr_logo.gif'; 
	} else if (agencyCd == 'MPCA') { 
		return 'mpca7000.gif'; 
	} else if (agencyCd == 'TWDB') { 
		return 'twdb.gif'; 
	} else if (agencyCd == 'NJGS') { 
		return 'njgslogo.gif'; 
	} else if (agencyCd == 'USGS'){ 
		if(stateCd == '34') {
			return 'njgslogo.gif'; 
		} else if(stateCd == '17') {
			return 'ilstatewatersurvey.gif';
		} else if(stateCd == '18') { 
			return 'indnrtitle.gif'; 
		} else {
			return 'USGS_logo.png';
		}
	}
};

