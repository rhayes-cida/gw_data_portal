describe("Library Checking test.", function() {
    it("verified that ExtJS gets loaded", function() {
        expect(Ext).toBeDefined();
    });
   
    it("verified that OpenLayers gets loaded", function() {
        expect(OpenLayers).toBeDefined();
    });
});

describe("Verify GWDP namespace generation test.", function() {
    it("verified that GWDP namespaces get defined", function() {
        expect(GWDP).toBeDefined();
        
        expect(GWDP.ui).toBeDefined();
        expect(GWDP.ui.map).toBeDefined();
        expect(GWDP.ui.help).toBeDefined();
        
        expect(GWDP.domain).toBeDefined();
        expect(GWDP.domain.Well).toBeDefined();
        expect(GWDP.domain.Agency).toBeDefined();
        expect(GWDP.domain.State).toBeDefined();
        expect(GWDP.domain.Aquifer).toBeDefined();
    });
});

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
    	expect(CQL).toBe("(QW_SN_FLAG = 'POINTS_OFF') AND (NAT_AQUIFER_CD = 'POINTS_GO_OFF') AND (AGENCY_CD = 'POINTS_GO_OFF')");
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
    			principleAquifer:    "All"
    		}; 
    	};
    	var CQL = GWDP.ui.getCurrentFilterCQLAsString();
    	expect(CQL).toBe("((QW_SN_FLAG = '1') OR (WL_SN_FLAG = '1'))");
    });
    
	//TODO MORE TESTS, YEAH!!!	
});