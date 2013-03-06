var agencyMetaDataUrl = 'metadata/agencies';

var AgencyMetaDataResponse = '[{"AGENCY_CD":"MPCA","AGENCY_NM":"Minnesota Pollution Control Agency","COUNT":38},{"AGENCY_CD":"ISWS","AGENCY_NM":"Illinois State Water Survey","COUNT":23}]';

describe("AgencyDomain.js", function() {
	it("defines some core API functions and properties", function() {
        expect(GWDP.domain.Agency.getAgencyStore).toBeDefined();
        expect(GWDP.domain.Agency.getAgencyMetadata).toBeDefined();
	});
});
	

describe("GWDP.domain.Agency.getAgencyStore", function() {
	it("builds a configured Ext.data.JsonStore with the correct fields for Agency metadata", function() {
		var jsonStore = GWDP.domain.Agency.getAgencyStore({defaultOption: "defOpt"});
		expect(jsonStore.proxy.url).toBe(agencyMetaDataUrl);
		expect(jsonStore.data.items.length).toBe(1);
		expect(jsonStore.data.items[0].data['AGENCY_CD']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['AGENCY_NM']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['COUNT']).toBe('defOpt');
		
		jsonStore2 = GWDP.domain.Agency.getAgencyStore({defaultOption: null});
		expect(jsonStore2.proxy.url).toBe(agencyMetaDataUrl);
		expect(jsonStore2.data.items.length).toBe(0);
	});
});

describe("GWDP.domain.Agency.getAgencyMetadata", function() {
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();

		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.Agency.getAgencyMetadata({ something: "val"}, callback, "defOpt");
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "GET" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: agencyMetaDataUrl })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.something).toBe("val");;
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	it("correctly parses a valid json response into an Ext.data.JsonStore, and passes that to the callback", function() {
		
		//do the call
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(AgencyMetaDataResponse);
		var callback = sinon.spy();
		GWDP.domain.Agency.getAgencyMetadata({ something: "val"}, callback, "defOpt");
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		var jsonStore = callback.getCall(0).args[0];
		expect(jsonStore.getCount()).toBe(3);
		expect(jsonStore.getAt(0).data['AGENCY_CD']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['AGENCY_NM']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['COUNT']).toBe('defOpt');
		expect(jsonStore.getAt(1).data['AGENCY_CD']).toBe('MPCA');
		expect(jsonStore.getAt(1).data['AGENCY_NM']).toBe('Minnesota Pollution Control Agency');
		expect(jsonStore.getAt(1).data['COUNT']).toBe(38);
		expect(jsonStore.getAt(2).data['AGENCY_CD']).toBe('ISWS');
		expect(jsonStore.getAt(2).data['AGENCY_NM']).toBe('Illinois State Water Survey');
		expect(jsonStore.getAt(2).data['COUNT']).toBe(23);
		
		//do the call without a default option specified
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(AgencyMetaDataResponse);
		var callback2 = sinon.spy();
		GWDP.domain.Agency.getAgencyMetadata({ something: "val"}, callback2);
		
		TestSupport.doServerRespond();
		
		expect(callback2.called).toBe(true);
		var jsonStore2 = callback2.getCall(0).args[0];
		expect(jsonStore2.getCount()).toBe(2);
		expect(jsonStore2.getAt(0).data['AGENCY_CD']).toBe('MPCA');
		expect(jsonStore2.getAt(0).data['AGENCY_NM']).toBe('Minnesota Pollution Control Agency');
		expect(jsonStore2.getAt(0).data['COUNT']).toBe(38);
		expect(jsonStore2.getAt(1).data['AGENCY_CD']).toBe('ISWS');
		expect(jsonStore2.getAt(1).data['AGENCY_NM']).toBe('Illinois State Water Survey');
		expect(jsonStore2.getAt(1).data['COUNT']).toBe(23);
	});
});