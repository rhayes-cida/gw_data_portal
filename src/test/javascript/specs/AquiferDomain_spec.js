var aquiferMetaDataUrl = 'metadata/aquifers';

var AquiferMetaDataResponse = '[{"AQUIFERCODE":"N100ALLUVL","AQUIFER":"Alluvial aquifers","COUNT":29},{"AQUIFERCODE":"S300CAMORD","AQUIFER":"Cambrian-Ordovician aquifer system","COUNT":93}]';

describe("AquiferDomain.js", function() {
	it("defines some core API functions and properties", function() {
        expect(GWDP.domain.Aquifer.getAquiferStore).toBeDefined();
        expect(GWDP.domain.Aquifer.getAquiferMetadata).toBeDefined();
	});
});
	

describe("GWDP.domain.Aquifer.getAquiferStore", function() {
	it("builds a configured Ext.data.JsonStore with the correct fields for Aquifer metadata", function() {
		var jsonStore = GWDP.domain.Aquifer.getAquiferStore({defaultOption: "defOpt"});
		expect(jsonStore.proxy.url).toBe(aquiferMetaDataUrl);
		expect(jsonStore.data.items.length).toBe(1);
		expect(jsonStore.data.items[0].data['AQUIFER']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['AQUIFERCODE']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['COUNT']).toBe('defOpt');
		
		jsonStore2 = GWDP.domain.Aquifer.getAquiferStore({defaultOption: null});
		expect(jsonStore2.proxy.url).toBe(aquiferMetaDataUrl);
		expect(jsonStore2.data.items.length).toBe(0);
	});
});

describe("GWDP.domain.Aquifer.getAquiferMetadata", function() {
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();

		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.Aquifer.getAquiferMetadata({ something: "val"}, callback, "defOpt");
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "GET" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: aquiferMetaDataUrl })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.something).toBe("val");;
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	it("correctly parses a valid json response into an Ext.data.JsonStore, and passes that to the callback", function() {
		
		//do the call
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(AquiferMetaDataResponse);
		var callback = sinon.spy();
		GWDP.domain.Aquifer.getAquiferMetadata({ something: "val"}, callback, "defOpt");
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		var jsonStore = callback.getCall(0).args[0];
		expect(jsonStore.getCount()).toBe(3);
		expect(jsonStore.getAt(0).data['AQUIFERCODE']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['AQUIFER']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['COUNT']).toBe('defOpt');
		expect(jsonStore.getAt(1).data['AQUIFERCODE']).toBe('N100ALLUVL');
		expect(jsonStore.getAt(1).data['AQUIFER']).toBe('Alluvial aquifers');
		expect(jsonStore.getAt(1).data['COUNT']).toBe(29);
		expect(jsonStore.getAt(2).data['AQUIFERCODE']).toBe('S300CAMORD');
		expect(jsonStore.getAt(2).data['AQUIFER']).toBe('Cambrian-Ordovician aquifer system');
		expect(jsonStore.getAt(2).data['COUNT']).toBe(93);
		
		//do the call without a default option specified
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(AquiferMetaDataResponse);
		var callback2 = sinon.spy();
		GWDP.domain.Aquifer.getAquiferMetadata({ something: "val"}, callback2);
		
		TestSupport.doServerRespond();
		
		expect(callback2.called).toBe(true);
		var jsonStore2 = callback2.getCall(0).args[0];
		expect(jsonStore2.getCount()).toBe(2);
		expect(jsonStore2.getAt(0).data['AQUIFERCODE']).toBe('N100ALLUVL');
		expect(jsonStore2.getAt(0).data['AQUIFER']).toBe('Alluvial aquifers');
		expect(jsonStore2.getAt(0).data['COUNT']).toBe(29);
		expect(jsonStore2.getAt(1).data['AQUIFERCODE']).toBe('S300CAMORD');
		expect(jsonStore2.getAt(1).data['AQUIFER']).toBe('Cambrian-Ordovician aquifer system');
		expect(jsonStore2.getAt(1).data['COUNT']).toBe(93);
	});
});