GWDP.NO_POINTS_VALUE = "POINTS_OFF";

GWDP.OR = function(expressions) {
	return new OpenLayers.Filter.Logical({
		type: OpenLayers.Filter.Logical.OR,
		filters: expressions
	});
};

GWDP.AND = function(expressions) {
	return new OpenLayers.Filter.Logical({
		type: OpenLayers.Filter.Logical.AND,
		filters: expressions
	});
};

GWDP.EQUALS = function(prop, value) {
	return new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: prop,
		value: value
	});
};

GWDP.ui.constructWLorQWFilters = function(filterVals, WLorQWPrefix) {
	var typeParam = WLorQWPrefix + "_WELL_TYPE";
	var charsParam = WLorQWPrefix + "_WELL_CHARS";
	var flagParam = WLorQWPrefix + "_SN_FLAG";
	
	var typeFilters = []; //this should remain empty if ALL is selected
	var types = filterVals[typeParam].split(',');
	if(types[0] && types[0].toLowerCase() != 'all') { //if selections that don't include all are made, build an array of filters
		for(var i = 0; i < types.length; i++) {
			typeFilters.push(GWDP.EQUALS(typeParam, types[i]));
		}
	} if(!types || !types[0]) { //when nothing is selected, turn OFF
		typeFilters.push(GWDP.EQUALS(typeParam, GWDP.NO_POINTS_VALUE));
	}
	
	var charsFilters = [];
	var chars = filterVals[charsParam].split(',');
	if(chars[0] && chars[0].toLowerCase() != 'all') {
		for(var i = 0; i < chars.length; i++) {
			charsFilters.push(GWDP.EQUALS(charsParam, chars[i]));
		}
	} if(!chars || !chars[0]) { //when nothing is selected, turn OFF
		charsFilters.push(GWDP.EQUALS(charsParam, GWDP.NO_POINTS_VALUE));
	}
	
	var flagLevelFilter = GWDP.EQUALS(flagParam, "1");
	
	if(charsFilters.length == 0 && typeFilters.length==0) { //showing all categories and subetworks by not filtering on them
		return flagLevelFilter;
	} else {
		var andFilter = [flagLevelFilter];
		
		if(typeFilters.length > 1) {
			andFilter.push(GWDP.OR(typeFilters));
		} else if(typeFilters.length == 1){
			andFilter.push(typeFilters[0]);
		}
		
		if(charsFilters.length > 1) {
			andFilter.push(GWDP.OR(charsFilters));
		} else if(charsFilters.length == 1) {
			andFilter.push(charsFilters[0]);
		}
		
		return GWDP.AND(andFilter);
	}
};

GWDP.ui.constructWLFilters = function(filterVals) {
	return GWDP.ui.constructWLorQWFilters(filterVals, 'WL');
};

GWDP.ui.constructQWFilters = function(filterVals) {
	return GWDP.ui.constructWLorQWFilters(filterVals, 'QW');
};

GWDP.ui.constructNetworkFilters = function(filterVals) { 
	var wlFlag = filterVals['WL_SN_FLAG'] == 'on';
	var qwFlag = filterVals['QW_SN_FLAG'] == 'on';
	
	var wlFilter;
	if(wlFlag) {
		wlFilter = GWDP.ui.constructWLFilters(filterVals);
	}
	
	var qwFilter;
	if(qwFlag) {
		qwFilter = GWDP.ui.constructQWFilters(filterVals);
	}
	
	if(qwFilter && wlFilter) { //if both filters exist, OR them
		return GWDP.OR([qwFilter, wlFilter]);
	} else if (qwFilter){ //if just one of the filters, return it
		return qwFilter;
 	} else if (wlFilter){
		return wlFilter;
 	}  else { //if everything in the network filters is unchecked, we show nothing
		return GWDP.EQUALS("QW_SN_FLAG", GWDP.NO_POINTS_VALUE);
	}
};

GWDP.ui.constructAquiferFilters = function(filterVals) { 
	var aquiferFilter = filterVals['principalAquifer'];
	if(!aquiferFilter) { //nothing selected, show NO points
		return GWDP.EQUALS("NAT_AQUIFER_CD", GWDP.NO_POINTS_VALUE);
	}
	
	var aquifers = aquiferFilter.split(',');

	if(aquifers.length > 0 && aquifers[0].toLowerCase() == 'all') { //all being selected means we do NOT filter on this
		return null;
	}
	
	if(aquifers.length==1) {
		return GWDP.EQUALS("NAT_AQUIFER_CD", aquifers[0]);
	}
	
	var olAquiferFilters = [];
	for(var i = 0; i < aquifers.length; i++) {
		olAquiferFilters.push(GWDP.EQUALS("NAT_AQUIFER_CD", aquifers[i]));
	}
	
	if(olAquiferFilters.length > 0) {
		return GWDP.OR(olAquiferFilters);
	} else {
		return null;
	}
};

GWDP.ui.constructAgencyFilters = function(filterVals) { 
	var agencyFilter = filterVals['contributingAgencies'];
	if(!agencyFilter) { //nothing selected, no points to show
		return GWDP.EQUALS("AGENCY_CD", GWDP.NO_POINTS_VALUE);
	}
	
	var agencys = agencyFilter.split(',');
	
	
	if(agencys.length > 0 && agencys[0].toLowerCase() == 'all') { //all being selected means we do NOT filter on this
		return null;
	}
	
	if(agencys.length==1) {
		return GWDP.EQUALS("AGENCY_CD", agencys[0]);
	}
	
	var olAgencyFilters = [];
	for(var i = 0; i < agencys.length; i++) {
		olAgencyFilters.push(GWDP.EQUALS("AGENCY_CD", agencys[i]));
	}
	
	if(olAgencyFilters.length > 0) {
		return GWDP.OR(olAgencyFilters);
	} else {
		return null;
	}
};

GWDP.ui.constructStateFilters = function(filterVals) { 
	var stateFilter = filterVals['states'];
	if(!stateFilter) { //nothing selected, no points to show
		return GWDP.EQUALS("STATE_CD", GWDP.NO_POINTS_VALUE);
	}
	
	var states = stateFilter.split(',');
	
	if(states.length > 0 && states[0].toLowerCase() == 'all') { //all being selected means we do NOT filter on this
		return null;
	}
	
	if(states.length==1) {
		return GWDP.EQUALS("STATE_CD", states[0]);
	}
	
	var olStateFilters = [];
	for(var i = 0; i < states.length; i++) {
		olStateFilters.push(GWDP.EQUALS("STATE_CD", states[i]));
	}
	
	if(olStateFilters.length > 0) {
		return GWDP.OR(olStateFilters);
	} else {
		return null;
	}
};

GWDP.ui.constructCountyFilters = function(filterVals) { 
	var countyFilter = filterVals['counties'];
	if(!countyFilter) { //nothing selected, no points to show
		return GWDP.EQUALS("COUNTY_CD", GWDP.NO_POINTS_VALUE);
	}
	
	var countys = countyFilter.split(',');
	
	
	if(countys.length > 0 && countys[0].toLowerCase() == 'all') { //all being selected means we do NOT filter on this
		return null;
	}
	
	if(countys.length==1) {
		return GWDP.EQUALS("COUNTY_CD", countys[0]);
	}
	
	var olCountyFilters = [];
	for(var i = 0; i < countys.length; i++) {
		olCountyFilters.push(GWDP.EQUALS("COUNTY_CD", countys[i]));
	}
	
	if(olCountyFilters.length > 0) {
		return GWDP.OR(olCountyFilters);
	} else {
		return null;
	}
};

GWDP.ui.constructAvailableDataFilter = function(filterVals) {
	var wlFlag = filterVals['WL_DATA_FLAG'] == 'on';
	var qwFlag = filterVals['QW_DATA_FLAG'] == 'on';
	var logFlag = filterVals['LOG_DATA_FLAG'] == 'on';
	
	if(!wlFlag && !qwFlag && !logFlag) {
		return null;
	}
	
	var availableDataFilters = [];
	
	if(wlFlag) availableDataFilters.push(GWDP.EQUALS("WL_DATA_FLAG", "1"));
	if(qwFlag) availableDataFilters.push(GWDP.EQUALS("QW_DATA_FLAG", "1"));
	if(logFlag) availableDataFilters.push(GWDP.EQUALS("LOG_DATA_FLAG", "1"));
	
	return GWDP.AND(availableDataFilters);
};

GWDP.ui.getCurrentFilterCQL = function(filterVals) {
	var topLevelAndArray = [];
	
	var networkFilter = GWDP.ui.constructNetworkFilters(filterVals);
	if(networkFilter) topLevelAndArray.push(networkFilter);

	var availableDataFilter = GWDP.ui.constructAvailableDataFilter(filterVals);
	if(availableDataFilter) topLevelAndArray.push(availableDataFilter);
	
	var aquiferFilter = GWDP.ui.constructAquiferFilters(filterVals);
	if(aquiferFilter) topLevelAndArray.push(aquiferFilter);
	
	var agencyFilter = GWDP.ui.constructAgencyFilters(filterVals);
	if(agencyFilter) topLevelAndArray.push(agencyFilter);
	
	var stateFilter = GWDP.ui.constructStateFilters(filterVals);
	if(stateFilter) topLevelAndArray.push(stateFilter);
	
	var countyFilter = GWDP.ui.constructCountyFilters(filterVals);
	if(countyFilter) topLevelAndArray.push(countyFilter);
	
	if(topLevelAndArray.length > 0) {
		return GWDP.AND(topLevelAndArray);
	} else {
		return null;
	}
};

GWDP.ui.getCurrentFilterCQLAsString = function(filterVals) {
	var filter = GWDP.ui.getCurrentFilterCQL(filterVals);
	if(filter) {
//		console.log(filter.toString());
		return filter.toString();
	} else {
		return '';
	}
};