var stateMetaDataUrl = 'metadata/states';

var StateMetaDataResponse = '[{"STATE_CD":"27","STATE_NM":"MINNESOTA","COUNT":92},{"STATE_CD":"30","STATE_NM":"MONTANA","COUNT":271}]';

describe("StateDomain.js", function() {
	it("defines some core API functions and properties", function() {
        expect(GWDP.domain.State.getStateStore).toBeDefined();
        expect(GWDP.domain.State.getStateMetadata).toBeDefined();
	});
});
	

describe("GWDP.domain.State.getStateStore", function() {
	it("builds a configured Ext.data.JsonStore with the correct fields for State metadata", function() {
		var jsonStore = GWDP.domain.State.getStateStore({defaultOption: "defOpt"});
		expect(jsonStore.proxy.url).toBe(stateMetaDataUrl);
		expect(jsonStore.data.items.length).toBe(1);
		expect(jsonStore.data.items[0].data['STATE_CD']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['STATE_NM']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['COUNT']).toBe('defOpt');
		
		jsonStore2 = GWDP.domain.State.getStateStore({defaultOption: null});
		expect(jsonStore2.proxy.url).toBe(stateMetaDataUrl);
		expect(jsonStore2.data.items.length).toBe(0);
	});
});

describe("GWDP.domain.State.getStateMetadata", function() {
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();

		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.State.getStateMetadata({ something: "val"}, callback, "defOpt");
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "GET" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: stateMetaDataUrl })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.something).toBe("val");;
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	it("correctly parses a valid json response into an Ext.data.JsonStore, and passes that to the callback", function() {
		
		//do the call
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(StateMetaDataResponse);
		var callback = sinon.spy();
		GWDP.domain.State.getStateMetadata({ something: "val"}, callback, "defOpt");
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		var jsonStore = callback.getCall(0).args[0];
		expect(jsonStore.getCount()).toBe(3);
		expect(jsonStore.getAt(0).data['STATE_CD']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['STATE_NM']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['COUNT']).toBe('defOpt');
		expect(jsonStore.getAt(1).data['STATE_CD']).toBe('27');
		expect(jsonStore.getAt(1).data['STATE_NM']).toBe('MINNESOTA');
		expect(jsonStore.getAt(1).data['COUNT']).toBe(92);
		expect(jsonStore.getAt(2).data['STATE_CD']).toBe('30');
		expect(jsonStore.getAt(2).data['STATE_NM']).toBe('MONTANA');
		expect(jsonStore.getAt(2).data['COUNT']).toBe(271);
		
		//do the call without a default option specified
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(StateMetaDataResponse);
		var callback2 = sinon.spy();
		GWDP.domain.State.getStateMetadata({ something: "val"}, callback2);
		
		TestSupport.doServerRespond();
		
		expect(callback2.called).toBe(true);
		var jsonStore2 = callback2.getCall(0).args[0];
		expect(jsonStore2.getCount()).toBe(2);
		expect(jsonStore2.getAt(0).data['STATE_CD']).toBe('27');
		expect(jsonStore2.getAt(0).data['STATE_NM']).toBe('MINNESOTA');
		expect(jsonStore2.getAt(0).data['COUNT']).toBe(92);
		expect(jsonStore2.getAt(1).data['STATE_CD']).toBe('30');
		expect(jsonStore2.getAt(1).data['STATE_NM']).toBe('MONTANA');
		expect(jsonStore2.getAt(1).data['COUNT']).toBe(271);
	});
});