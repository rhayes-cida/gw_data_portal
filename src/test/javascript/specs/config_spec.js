describe("Javascript importing", function() {
	//this is only imported during and required for testing
    it("loads sinon library for testing support", function() { 
        expect(sinon).toBeDefined();
    });
    
    it("loads Extjs library", function() {
        expect(Ext).toBeDefined();
    });
   
    it("loads OpenLayers library", function() {
        expect(OpenLayers).toBeDefined();
    });
});

describe("GWDP namespace generation", function() {
    it("defines all major namespaces of the GWDP codebase", function() {
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
