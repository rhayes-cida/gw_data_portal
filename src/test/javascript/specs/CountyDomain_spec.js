var countyMetaDataUrl = 'metadata/counties';

var CountyMetaDataResponse = '[{"STATE_NM":"MONTANA","COUNTY_CD":"043","COUNTY_NM":"JEFFERSON","COUNT":1},'+
	'{"STATE_NM":"MONTANA","COUNTY_CD":"085","COUNTY_NM":"ROOSEVELT","COUNT":5}]';

describe("CountyDomain.js", function() {
	it("defines some core API functions and properties", function() {
        expect(GWDP.domain.County.getCountyStore).toBeDefined();
        expect(GWDP.domain.County.getCountyMetadata).toBeDefined();
	});
});
	

describe("GWDP.domain.County.getCountyStore", function() {
	it("builds a configured Ext.data.JsonStore with the correct fields for County metadata", function() {
		var jsonStore = GWDP.domain.County.getCountyStore({defaultOption: "defOpt"});
		expect(jsonStore.proxy.url).toBe(countyMetaDataUrl);
		expect(jsonStore.data.items.length).toBe(1);
		expect(jsonStore.data.items[0].data['STATE_NM']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['COUNTY_NM']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['COUNTY_CD']).toBe('defOpt');
		expect(jsonStore.data.items[0].data['COUNT']).toBe('defOpt');
		
		jsonStore2 = GWDP.domain.County.getCountyStore({defaultOption: null});
		expect(jsonStore2.proxy.url).toBe(countyMetaDataUrl);
		expect(jsonStore2.data.items.length).toBe(0);
	});
});

describe("GWDP.domain.County.getCountyMetadata", function() {
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();

		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.County.getCountyMetadata({ something: "val"}, callback, "defOpt");
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "POST" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: countyMetaDataUrl })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.something).toBe("val");;
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	it("correctly parses a valid json response into an Ext.data.JsonStore, and passes that to the callback", function() {
		
		//do the call
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(CountyMetaDataResponse);
		var callback = sinon.spy();
		GWDP.domain.County.getCountyMetadata({ something: "val"}, callback, "defOpt");
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		var jsonStore = callback.getCall(0).args[0];
		expect(jsonStore.getCount()).toBe(3);
		expect(jsonStore.getAt(0).data['STATE_NM']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['COUNTY_NM']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['COUNTY_CD']).toBe('defOpt');
		expect(jsonStore.getAt(0).data['COUNT']).toBe('defOpt');
		expect(jsonStore.getAt(1).data['STATE_NM']).toBe('MONTANA');
		expect(jsonStore.getAt(1).data['COUNTY_NM']).toBe('JEFFERSON');
		expect(jsonStore.getAt(1).data['COUNTY_CD']).toBe('043');
		expect(jsonStore.getAt(1).data['COUNT']).toBe(1);
		expect(jsonStore.getAt(2).data['STATE_NM']).toBe('MONTANA');
		expect(jsonStore.getAt(2).data['COUNTY_NM']).toBe('ROOSEVELT');
		expect(jsonStore.getAt(2).data['COUNTY_CD']).toBe('085');
		expect(jsonStore.getAt(2).data['COUNT']).toBe(5);
		
		//do the call without a default option specified
		TestSupport.initServer();
		TestSupport.setServerJsonResponse(CountyMetaDataResponse);
		var callback2 = sinon.spy();
		GWDP.domain.County.getCountyMetadata({ something: "val"}, callback2);
		
		TestSupport.doServerRespond();
		
		expect(callback2.called).toBe(true);
		var jsonStore2 = callback2.getCall(0).args[0];
		expect(jsonStore2.getCount()).toBe(2);
		expect(jsonStore2.getAt(0).data['STATE_NM']).toBe('MONTANA');
		expect(jsonStore2.getAt(0).data['COUNTY_NM']).toBe('JEFFERSON');
		expect(jsonStore2.getAt(0).data['COUNTY_CD']).toBe('043');
		expect(jsonStore2.getAt(0).data['COUNT']).toBe(1);
		expect(jsonStore2.getAt(1).data['STATE_NM']).toBe('MONTANA');
		expect(jsonStore2.getAt(1).data['COUNTY_NM']).toBe('ROOSEVELT');
		expect(jsonStore2.getAt(1).data['COUNTY_CD']).toBe('085');
		expect(jsonStore2.getAt(1).data['COUNT']).toBe(5);
	});
});