describe("filter.js", function() {
    it("defines some core API functions", function() {
        expect(GWDP.ui.getCurrentFilterCQLAsString).toBeDefined();
    });
});
	
describe("GWDP.ui.getCurrentFilterCQLAsString", function() {    
    it("builds the correct CQL string, when given an empty filter set", function() {
    	var filterVars = {//MOCK test data
			}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars);
    	expect(CQL).toBe("(QW_SN_FLAG = '" + GWDP.NO_POINTS_VALUE + "') AND (NAT_AQUIFER_CD = '" + GWDP.NO_POINTS_VALUE + "') AND (AGENCY_CD = '" + GWDP.NO_POINTS_VALUE + "')"+
    			 " AND (STATE_CD = '" + GWDP.NO_POINTS_VALUE + "') AND (COUNTY_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("builds the correct CQL string, when given a default filter set, any 'All' filters turn off the filter completely.", function() {
    	var filterVars = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1'))");
    });
    
    it("builds the correct CQL string, when given well types are off", function() {
    	var filterVars = {//MOCK test data
    			QW_SN_FLAG :    "off",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars);
    	expect(CQL).toBe("(WL_SN_FLAG = '1')");
    	
    	var filterVars2 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "off",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars2);
    	expect(CQL).toBe("(QW_SN_FLAG = '1')");
    	
    	var filterVars3 = {//MOCK test data
    			QW_SN_FLAG :    "off",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "off",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars3);
    	expect(CQL).toBe("(QW_SN_FLAG = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("builds the correct CQL string, when given contributing agencies", function() {
    	var filterVars = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "Agency1",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (AGENCY_CD = 'Agency1')");

    	var filterVars2 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "Agency1,Agency2",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars2);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND ((AGENCY_CD = 'Agency1') OR (AGENCY_CD = 'Agency2'))");
    	
    	var filterVars3 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'All'
    		};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars3);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (AGENCY_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("builds the correct CQL string, when given principal aquifers", function() {
    	var filterVars = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "aq1",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (NAT_AQUIFER_CD = 'aq1')");

    	var filterVars2 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "aq1,aq2",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars2);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND ((NAT_AQUIFER_CD = 'aq1') OR (NAT_AQUIFER_CD = 'aq2'))");
    	
    	var filterVars3 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "",
    			states: 'All',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars3);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (NAT_AQUIFER_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("builds the correct CQL string, when given states", function() {
    	var filterVars = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'st1',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (STATE_CD = 'st1')");

    	var filterVars2 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'st1,st2',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars2);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND ((STATE_CD = 'st1') OR (STATE_CD = 'st2'))");
    	
    	var filterVars3 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: '',
    			counties: 'All'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars3);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (STATE_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("builds the correct CQL string, when given counties", function() {
    	var filterVars = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'ct1'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (COUNTY_CD = 'ct1')");

    	var filterVars2 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: 'ct1,ct2'
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars2);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND ((COUNTY_CD = 'ct1') OR (COUNTY_CD = 'ct2'))");
    	
    	var filterVars3 = {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All",
    			states: 'All',
    			counties: ''
    		}; 
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString(filterVars3);
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (COUNTY_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
});

describe("GWDP logical operators", function() {
	it("builds the correct OpenLayers filter objects for GWDP.EQUALS, GWDP.OR, and GWDP.AND operators", function() {
		var op1 = GWDP.EQUALS("PROP1", "value1");
		var op2 = GWDP.EQUALS("PROP2", "value2");
		
		expect(op1.CLASS_NAME).toBe("OpenLayers.Filter.Comparison");
		expect(op1.property).toBe("PROP1");
		expect(op1.value).toBe("value1");
		
		expect(op2.CLASS_NAME).toBe("OpenLayers.Filter.Comparison");
		expect(op2.property).toBe("PROP2");
		expect(op2.value).toBe("value2");
		
		var orOp = GWDP.OR([op1, op2]);
		expect(orOp.CLASS_NAME).toBe("OpenLayers.Filter.Logical");
		expect(orOp.type).toBe("||");
		expect(orOp.filters[0]).toBe(op1);
		expect(orOp.filters[1]).toBe(op2);
		
		var andOp = GWDP.AND([op1, op2]);
		expect(andOp.CLASS_NAME).toBe("OpenLayers.Filter.Logical");
		expect(andOp.type).toBe("&&");
		expect(andOp.filters[0]).toBe(op1);
		expect(andOp.filters[1]).toBe(op2);
	});
});