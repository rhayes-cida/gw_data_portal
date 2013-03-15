
var ResultTypeHitsResponse = "<wfs:FeatureCollection " +
		"numberOfFeatures=\"2\" " +
		"timeStamp=\"2013-03-05T22:21:04.327Z\" " +
		"xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\" " +
		"xmlns:ns=\"gov.usgs.cida.ngwmn\" " +
		"xmlns:ogc=\"http://www.opengis.net/ogc\" " +
		"xmlns:gml=\"http://www.opengis.net/gml\" " +
		"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
		"xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
		"xmlns:ows=\"http://www.opengis.net/ows\" " +
		"xmlns:wfs=\"http://www.opengis.net/wfs\"/>";

var GML2Response = "<wfs:FeatureCollection " +
	"timeStamp=\"2013-03-05T22:21:04.327Z\" " +
	"xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\" " +
	"xmlns:ns=\"gov.usgs.cida.ngwmn\" " +
	"xmlns:ogc=\"http://www.opengis.net/ogc\" " +
	"xmlns:gml=\"http://www.opengis.net/gml\" " +
	"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
	"xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
	"xmlns:ows=\"http://www.opengis.net/ows\" " +
	"xmlns:wfs=\"http://www.opengis.net/wfs\">" +
	"<gml:boundedBy>" +
	"	<gml:null>unknown</gml:null>" +
	"</gml:boundedBy>" +
	"<gml:featureMember>" +
	"	<ns:layerName fid=\"layerName.fid-2\">" +
	"		<ns:att1>record1-att1</ns:att1>" +
	"		<ns:att2>record1-att2</ns:att2>" +
	"	</ns:layerName>" +
	"</gml:featureMember>" +
	"<gml:featureMember>" +
	"	<ns:layerName fid=\"layerName.fid-2\">" +
	"		<ns:att1>record2-att1</ns:att1>" +
	"		<ns:att2>record2-att2</ns:att2>" +
	"	</ns:layerName>" +
	"</gml:featureMember>" +
	"</wfs:FeatureCollection>";

var GML32BoundsResponse =
	'<?xml version="1.0" encoding="UTF-8"?>' + 
	'<wfs:FeatureCollection timeStamp="2013-03-14T14:14:07.766Z"' + 
	'	xsi:schemaLocation="http://www.opengis.net/gml/3.2 http://www.opengis.net/wfs/2.0"' + 
	'	xmlns:ns="gov.usgs.cida.ngwmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + 
	'	xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:wfs="http://www.opengis.net/wfs/2.0">' + 
	'	<wfs:boundedBy>' + 
	'		<gml:Envelope>' + 
	'			<gml:lowerCorner>-120 35</gml:lowerCorner>' + 
	'			<gml:upperCorner>-115 45</gml:upperCorner>' + 
	'		</gml:Envelope>' + 
	'	</wfs:boundedBy>' + 
	'	<wfs:member>' + 
	'		<ns:layerName' + 
	'			gml:id="layerName.fid-57189476_13d6937ff77_36c1">' + 
	'			<gml:boundedBy>' + 
	'				<gml:Envelope srsDimension="2"' + 
	'					srsName="http://www.opengis.net/gml/srs/epsg.xml#4269">' + 
	'					<gml:lowerCorner>-90 42</gml:lowerCorner>' + 
	'					<gml:upperCorner>-86 45</gml:upperCorner>' + 
	'				</gml:Envelope>' + 
	'			</gml:boundedBy>' + 
	'			<ns:MY_SITEID>USGS:350436119061901</ns:MY_SITEID>' + 
	'		</ns:layerName>' + 
	'	</wfs:member>' + 
	'</wfs:FeatureCollection>';


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
		
		var url = "http://testing/test/url";
		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.getDomainObjectsCount(
			url,
			"ns:layerName", 
			"1,2,3,4", 
			"(SOME_PARAM=1)", 
			callback
		);
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "POST" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: url })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.CQL_FILTER).toBe("(SOME_PARAM=1) AND (BBOX(GEOM,1,2,3,4))");
		expect(params.resultType).toBeDefined();
		expect(params.resultType).toBe("hits");
		expect(params.VERSION).toBe("1.1.0");
		expect(params.typeName).toBe("ns:layerName");
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	
	it("returns the correct number of features, and passes that to the callback, when given a valid GML2 response for resultType=hits requests", function() {
		TestSupport.initServer();
		
		var url = "http://testing.com/test/url/hits";
		
		//set the response for this URL
		TestSupport.setServerXmlResponse(ResultTypeHitsResponse);

		//do the call
		var callback = sinon.spy();
		GWDP.domain.getDomainObjectsCount(
			url,
			"ns:layerName", 
			"1,2,3,4", 
			"(SOME_PARAM=1)", 
			callback
		);
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		expect(callback.getCall(0).args[0]).toBe('2');
		
		TestSupport.restoreServer();
	});
});

describe("GWDP.domain.getDomainObjects", function() {
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();

		var url = "http://testing/test/url/gml2";
		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.getDomainObjects(
			url,
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
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "POST" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: url })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.CQL_FILTER).toBe("(SOME_PARAM=1) AND (BBOX(GEOM,1,2,3,4))");
		expect(params.resultType).toBeUndefined();
		expect(params.VERSION).toBe("1.0.0");
		expect(params.typeName).toBe("ns:layerName");
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	it("correctly parses a GML2 response into an array of records, and passes that to the callback, when given a valid GML2 response", function() {
		TestSupport.initServer();
		
		var url = "http://testing/test/url/gml2";
		
		//set the response for this URL
		TestSupport.setServerXmlResponse(GML2Response);
		
		//do the call
		var callback = sinon.spy();
		GWDP.domain.getDomainObjects(
			url,
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
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		var results = callback.getCall(0).args[0];
		expect(results.length).toBe(2);
		expect(results[0].data['att1']).toBe('record1-att1');
		expect(results[0].data['att2']).toBe('record1-att2');
		expect(results[1].data['att1']).toBe('record2-att1');
		expect(results[1].data['att2']).toBe('record2-att2');
		
		TestSupport.restoreServer();
	});
});

describe("GWDP.domain.getDomainObjectsBoundingBox", function() {
	it("performs an Ext.Ajax.request with the correct parameters (GML3.2 specific overrides)", function() {
		TestSupport.stubExtAjaxRequest();

		var urlBase = 'http://testing/test/url';
		var url = urlBase + "/wfs"; //Expect this

		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.getDomainObjectsBoundingBox(
			url,
			"ns:layerName", 
			"1,2,3,4", 
			"(SOME_PARAM=1)", 
			callback
		);
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "POST" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: urlBase + "/ows" })).toBe(true); //OVERRIDEN switch from wfs to ows
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.CQL_FILTER).toBe("(SOME_PARAM=1) AND (BBOX(GEOM,1,2,3,4))");
		expect(params.srsName).toBeUndefined(); //SHOULD BE REMOVED
		expect(params.VERSION).toBe("1.0.0");
		expect(params.request).toBe("GetFeature");
		expect(params.typeName).toBe("ns:layerName");
		expect(params.outputFormat).toBe("text/xml; subtype=gml/3.2"); //SPECIAL OVERRIDE FOR BOUNDS
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	it("correctly parses a GML3.2 response into an array of coords, and passes that to the callback, when given a valid GML3.2 response", function() {
		TestSupport.initServer();
		
		var url = "http://testing/test/url/wfs";
		
		//set the response for this URL
		TestSupport.setServerXmlResponse(GML32BoundsResponse);
		
		//do the call
		var callback = sinon.spy();
		GWDP.domain.getDomainObjectsBoundingBox(
			url,
			"ns:layerName", 
			"1,2,3,4", 
			"(SOME_PARAM=1)", 
			callback
		);

		TestSupport.doServerRespond();

//		TODO reenable tests after ambiguous XML parsing issues are done (See GWDP.domain.getDomainObjectsBoundingBox -n BaseDomain.js)
//		expect(callback.called).toBe(true);
//		var bbox = callback.getCall(0).args[0];
//		expect(bbox.length).toBe(4);
//		expect(bbox[0]).toBe('-120');
//		expect(bbox[1]).toBe('35');
//		expect(bbox[2]).toBe('-115');
//		expect(bbox[3]).toBe('45');
		
		TestSupport.restoreServer();
	});
});