describe("OGC and OpenLayers filter generation test.", function() {
	//The GWDP.ui.getFilterFormValues function is defined in ui.js and 
	//is dependent on the Extjs UI/DOM.
	//The function itself returns the form.getForm().getValues() output.
	//All tests must mock it for filtering functions works
	
    it("verified reqiured filter functions are defined", function() {
    	GWDP.ui.getFilterFormValues = function() {
			return {//MOCK test data
			}; 
		};
        expect(GWDP.ui.getCurrentFilterCQLAsString).toBeDefined();
        expect(GWDP.ui.getCurrentFilterCQL).toBeDefined();
        expect(GWDP.ui.getFilterFormValues).toBeDefined();
    });
    
    it("verified reqiured CQL building is correct (empty filter set)", function() {
    	GWDP.ui.getFilterFormValues = function() {
			return {//MOCK test data
			}; 
		};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("(QW_SN_FLAG = '" + GWDP.NO_POINTS_VALUE + "') AND (NAT_AQUIFER_CD = '" + GWDP.NO_POINTS_VALUE + "') AND (AGENCY_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("verified reqiured CQL building is correct (default filter set), any 'All' filters turn off the filter completely.", function() {
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1'))");
    });
    
    it("verified reqiured CQL building is correct (well types off)", function() {
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "off",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("(WL_SN_FLAG = '1')");
    	
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "off",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("(QW_SN_FLAG = '1')");
    	
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "off",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "off",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("(QW_SN_FLAG = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("verified reqiured CQL building is correct (contributing agencies)", function() {
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "Agency1",    
    			principalAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (AGENCY_CD = 'Agency1')");

    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "Agency1,Agency2",    
    			principalAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND ((AGENCY_CD = 'Agency1') OR (AGENCY_CD = 'Agency2'))");
    	
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "",    
    			principalAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (AGENCY_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
    
    it("verified reqiured CQL building is correct (principal aquifers)", function() {
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "aq1"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (NAT_AQUIFER_CD = 'aq1')");

    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    "aq1,aq2"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND ((NAT_AQUIFER_CD = 'aq1') OR (NAT_AQUIFER_CD = 'aq2'))");
    	
    	GWDP.ui.getFilterFormValues = function() {
    		return {//MOCK test data
    			QW_SN_FLAG :    "on",
    			QW_WELL_CHARS :    "All",
    			QW_WELL_TYPE:    "All", 
    			WL_SN_FLAG:    "on",    
    			WL_WELL_CHARS:    "All",
    			WL_WELL_TYPE:    "All",
    			contributingAgencies:     "All",    
    			principalAquifer:    ""
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1')) AND (NAT_AQUIFER_CD = '" + GWDP.NO_POINTS_VALUE + "')");
    });
});

describe("GWDP logical operators test", function() {
	it("verified GWDP.EQUALS, GWDP.OR, and GWDP.AND operators", function() {
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