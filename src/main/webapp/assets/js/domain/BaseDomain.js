/**
 * @param typeName layer name for the OWS layer being requested
 * 
 * @return basic ajax params that will work for WFS calls to our geoserver
 */
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

/**
 * @param typeName layer name for the OWS layer being requested
 * @param bbox bounding box string
 * @param cql_filter CQL filter string
 * @param forHits boolean of whether or not we are requesting a full WFS result or just the resultType=hits call
 * 
 * @return a json config object for making ajax requests to an OWS service
 */
GWDP.domain.constructParams = function(typeName, bbox, cql_filter, forHits) {
	var requestParams = GWDP.domain.WFSAjaxParams(typeName);
	
	if(forHits) {
		requestParams.resultType="hits"; 
		requestParams.VERSION="1.1.0"; //to enable resultType=hits
	}
	
	if(!cql_filter) {
		requestParams.BBOX=bbox;
	} else {
		requestParams.CQL_FILTER=cql_filter + " AND " + GWDP.domain.getBBOXCql(bbox);
	}
	
	return requestParams;
};

/**
 * @param fieldsArray array of field names used to configure this store
 * @param url destination for the remote data source
 * 
 * @return Extjs JsonStore
 */
GWDP.domain.getArrayStore = function(fieldsArray, url){
	return new Ext.data.ArrayStore({
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
		    url: url	
		}),
	    autoDestroy: false,
	    fields: fieldsArray
	});
};

/**
 * @param fieldsArray array of field names used to configure this store
 * @param url destination for the remote data source
 * 
 * @return Extjs JsonStore
 */
GWDP.domain.getJsonStore = function(fieldsArray, url){
	return new Ext.data.JsonStore({
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
		    url: url	
		}),
	    autoDestroy: false,
	    fields: fieldsArray
	});
};

/**
 * @param records array of json object records
 * @param store with the correct configuration for loading the records array
 * 
 * @return the same store that was passed in
 */
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
	return store;
};

/**
 * @param jsonText text representation of a json object
 * @param store with the correct configuration for loading the parsed json
 * @defaultOption is provided, will create a record in the store with this value for all fields at index 0.
 * 
 * @return the same store that was passed in
 */
GWDP.domain.loadJsonIntoStore = function(jsonText, store, defaultOption) {
	var json = {data: Ext.util.JSON.decode(jsonText) };
	
	if(defaultOption) {
		var option = {};
		for(var key in json.data[0]) {
			option[key] = defaultOption;
		}
		store.loadData([option].concat(json.data)); 
	} else {
		store.loadData(json.data); 
	}
	
	return store;
};


/**
 * @param bbox bbox must be in format x,y,x,y
 * @param cql_filter string representation of the filters.
 * @param callback function that takes an array of json objects which represents a feature
 */
GWDP.domain.getDomainObjects = function(url, protocol, typeName, bbox, cql_filter, callback) {	
	Ext.Ajax.request({
		url: url,
		method: 'GET',
		params: GWDP.domain.constructParams(typeName, bbox, cql_filter, false),
		success: function(response, options) {
			if(callback) callback(protocol.parseResponse(response));
		}
	});
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param cql_filter string representation of the filters.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.getDomainObjectsCount = function(url, typeName, bbox, cql_filter, callback) {
	Ext.Ajax.request({
		url: url,
		method: 'GET',
		params: GWDP.domain.constructParams(typeName, bbox, cql_filter, true),
		success: function(response, options) {
			var numOfRecs = response.responseXML.lastChild.attributes.getNamedItem('numberOfFeatures').value;
			if(callback) callback(numOfRecs);
		}
	});
};



/**
 * @param agencyCd short code of agency
 * @param stateCd optional numeric code for state 
 * 
 * @return String of the icon filename.
 */
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

/**
 * @param bboxArray an array representing the coordinates of a bbox
 * 
 * @return String representation of the bbox with the xy coordinates swapped
 */
GWDP.domain.convertXyToYx = function(bboxArray) {
	return bboxArray[1] + ',' + bboxArray[0] + ',' + bboxArray[3] + ',' + bboxArray[2];  //wfs v1.1.0 uses a y,x coordinate format
};


/**
 * @param bboxString String representation of a bbox
 * 
 * @return String fragment of bbox portion of CQL filter
 */
GWDP.domain.getBBOXCql = function(bboxString) {
	return '(BBOX(GEOM,' + bboxString + '))';
};
