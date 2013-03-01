describe("Library Checking test.", function() {
    it("verified that ExtJS gets loaded", function() {
        expect(Ext).toBeDefined();
    });
   
    it("verified that OpenLayers gets loaded", function() {
        expect(OpenLayers).toBeDefined();
    });
});

describe("Required GWDP namespace generation test.", function() {
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
