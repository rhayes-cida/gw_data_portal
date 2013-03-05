describe("BaseDomain.js", function() {
	it("defines some core API functions and properties", function() {
        expect(GWDP.domain.constructParams).toBeDefined();
        expect(GWDP.domain.WFSAjaxParams).toBeDefined();
        expect(GWDP.domain.getArrayStore).toBeDefined();
        expect(GWDP.domain.getJsonStore).toBeDefined();
        expect(GWDP.domain.loadOpenlayersRecordIntoArrayStore).toBeDefined();
        expect(GWDP.domain.loadJsonIntoStore).toBeDefined();
        expect(GWDP.domain.getDomainObjects).toBeDefined();
        expect(GWDP.domain.getDomainObjectsCount).toBeDefined();
        expect(GWDP.domain.getAgencyLogo).toBeDefined();
        expect(GWDP.domain.convertXyToYx).toBeDefined();
        expect(GWDP.domain.getBBOXCql).toBeDefined();
	});
});
	
describe("GWDP.domain.getBBOXCql", function() {
	it("builds a CQL representation of a BBOX filter", function() {
        expect(GWDP.domain.getBBOXCql("bboxString")).toBe('(BBOX(GEOM,bboxString))');
	});
});

describe("GWDP.domain.convertXyToYx", function() {
	it("produces a bbox string with xy swapped when given an array of lat/lons", function() {
		expect(GWDP.domain.convertXyToYx([1,2,3,4])).toBe('2,1,4,3');
	});
});
	
describe("GWDP.domain.getAgencyLogo", function() {
	it("gives the correct logo filenames when given agency code and state code", function() {
		expect(GWDP.domain.getAgencyLogo('USGS')).toBe('USGS_logo.png');
		expect(GWDP.domain.getAgencyLogo('USGS', 34)).toBe('njgslogo.gif');
	});
});

describe("GWDP.domain.WFSAjaxParams", function() {
	it("defines some default WFS parameters", function() {
		var wfsParams = GWDP.domain.WFSAjaxParams('layerName');
		expect(wfsParams.typeName).toBe("layerName");
		expect(wfsParams.SERVICE).toBe("WFS");
		expect(wfsParams.outputFormat).toBe("GML2");
		expect(wfsParams.VERSION).toBe("1.0.0");
		expect(wfsParams.srsName).toBe("EPSG:4326");
	});
});

describe("GWDP.domain.constructParams", function() {
	it("alters default params to produce valid configurations for filtering(with and without bbox) and requesting result counts", function(){
		var noCQLNoHits = GWDP.domain.constructParams("layerName", "1,2,3,4", null, false);
		expect(noCQLNoHits.typeName).toBe("layerName");
		expect(noCQLNoHits.SERVICE).toBe("WFS");
		expect(noCQLNoHits.outputFormat).toBe("GML2");
		expect(noCQLNoHits.srsName).toBe("EPSG:4326");
		expect(noCQLNoHits.VERSION).toBe("1.0.0");
		expect(noCQLNoHits.BBOX).toBe("1,2,3,4");
		expect(noCQLNoHits.CQL_FILTER).toBeUndefined();
		expect(noCQLNoHits.resultType).toBeUndefined();
		
		var withCQLAndHits = GWDP.domain.constructParams("layerName", "1,2,3,4", "(1=1)", true);
		expect(withCQLAndHits.typeName).toBe("layerName");
		expect(withCQLAndHits.SERVICE).toBe("WFS");
		expect(withCQLAndHits.outputFormat).toBe("GML2");
		expect(withCQLAndHits.srsName).toBe("EPSG:4326");
		expect(withCQLAndHits.VERSION).toBe("1.1.0"); //WFS version changes for resultType=hits
		expect(withCQLAndHits.BBOX).toBeUndefined(); //bbox gets lumped into CQL filter if there is one
		expect(withCQLAndHits.CQL_FILTER).toBe("(1=1) AND (BBOX(GEOM,1,2,3,4))");
		expect(withCQLAndHits.resultType).toBe("hits");
	});
});

describe("GWDP.domain.getArrayStore", function() {
	it("builds a configured Ext.data.ArrayStore from an array of field names and url", function() {
		var arrayStore = GWDP.domain.getArrayStore(['field1', 'field2'], "someservice/url");
		expect(arrayStore.proxy.url).toBe('someservice/url');
		var mockOlRecordsObject = [{data: {field1: 'vf11', field2: 'vf21'}},{data: { field1:'vf12',field2: 'vf22'}}];
		GWDP.domain.loadOpenlayersRecordIntoArrayStore(mockOlRecordsObject, arrayStore);
		expect(arrayStore.data.items[0].data['field1']).toBe('vf11');
		expect(arrayStore.data.items[0].data['field2']).toBe('vf21');
		expect(arrayStore.data.items[1].data['field1']).toBe('vf12');
		expect(arrayStore.data.items[1].data['field2']).toBe('vf22');
	});
});

describe("GWDP.domain.getJsonStore", function() {
	it("builds a configured Ext.data.getJsonStore from an array of field names and url", function() {		
		var jsonStore = GWDP.domain.getJsonStore(['field1', 'field2'], "someservice/url");
		expect(jsonStore.proxy.url).toBe('someservice/url');
		GWDP.domain.loadJsonIntoStore("[{field1: 'vf11', field2: 'vf21'},{ field1:'vf12',field2: 'vf22'}]", jsonStore, "All");
		expect(jsonStore.data.items[0].data['field1']).toBe('All');
		expect(jsonStore.data.items[0].data['field2']).toBe('All');
		expect(jsonStore.data.items[1].data['field1']).toBe('vf11');
		expect(jsonStore.data.items[1].data['field2']).toBe('vf21');
		expect(jsonStore.data.items[2].data['field1']).toBe('vf12');
		expect(jsonStore.data.items[2].data['field2']).toBe('vf22');
	});
});
	
describe("GWDP.domain.getDomainObjectsCount", function() {
	
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();
		
		//do the call
		var callback = sinon.spy(); //use a spy to record what the function does
		GWDP.domain.getDomainObjectsCount(
			new OpenLayers.Protocol.WFS.v1_1_0({
				outputFormat: 'GML2',
				geometryName: 'GEOM',
				featurePrefix: "ns",
				featureType: "ns:layerName"
			}), 
			"ns:layerName", 
			"1,2,3,4", 
			"(SOME_PARAM=1)", 
			callback
		);
		
		expect(Ext.Ajax.request.calledWithMatch({ method: "GET" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: GWDP.ui.map.baseWFSServiceUrl })).toBe(true);
		
		TestSupport.restoreExtAjaxRequest();
	});
});