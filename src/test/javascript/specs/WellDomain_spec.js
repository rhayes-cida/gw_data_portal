var WellCountResponse = '<?xml version="1.0" encoding="UTF-8"?>' + 
'<wfs:FeatureCollection numberOfFeatures="1135"' + 
'	timeStamp="2013-03-06T15:27:43.313Z"' + 
'	xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"' + 
'	xmlns:ngwmn="gov.usgs.cida.ngwmn" xmlns:ogc="http://www.opengis.net/ogc"' + 
'	xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + 
'	xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows"' + 
'	xmlns:wfs="http://www.opengis.net/wfs" />';

var GML2WellsResponse = '<?xml version="1.0" encoding="UTF-8"?>' + 
'<wfs:FeatureCollection xmlns="http://www.opengis.net/wfs"' + 
'	xmlns:wfs="http://www.opengis.net/wfs" xmlns:ngwmn="gov.usgs.cida.ngwmn"' + 
'	xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + 
'	xsi:schemaLocation="gov.usgs.cida.ngwmn http://cida-wiwsc-ngwmndev.er.usgs.gov:8081/ngwmn-geoserver/ngwmn/wfs?service=WFS&amp;version=1.0.0&amp;request=DescribeFeatureType&amp;typeName=ngwmn%3AVW_GWDP_GEOSERVER http://www.opengis.net/wfs http://cida-wiwsc-ngwmndev.er.usgs.gov:8081/ngwmn-geoserver/schemas/wfs/1.0.0/WFS-basic.xsd">' + 
'	<gml:boundedBy>' + 
'		<gml:null>unknown</gml:null>' + 
'	</gml:boundedBy>' + 
'	<gml:featureMember>' + 
'		<ngwmn:VW_GWDP_GEOSERVER' + 
'			fid="VW_GWDP_GEOSERVER.fid-57189476_13d402e7674_42ed">' + 
'			<ngwmn:MY_SITEID>MPCA:7734</ngwmn:MY_SITEID>' + 
'			<ngwmn:AGENCY_CD>MPCA</ngwmn:AGENCY_CD>' + 
'			<ngwmn:AGENCY_NM>Minnesota Pollution Control Agency</ngwmn:AGENCY_NM>' + 
'			<ngwmn:AGENCY_MED>MN Pollution Control Agency</ngwmn:AGENCY_MED>' + 
'			<ngwmn:SITE_NO>7734</ngwmn:SITE_NO>' + 
'			<ngwmn:SITE_NAME>MPCA Ambient Network Site 7734</ngwmn:SITE_NAME>' + 
'			<ngwmn:DISPLAY_FLAG>1</ngwmn:DISPLAY_FLAG>' + 
'			<ngwmn:DEC_LAT_VA>43.6770684</ngwmn:DEC_LAT_VA>' + 
'			<ngwmn:DEC_LONG_VA>-93.0300716</ngwmn:DEC_LONG_VA>' + 
'			<ngwmn:HORZ_DATUM>NAD83</ngwmn:HORZ_DATUM>' + 
'			<ngwmn:ALT_UNITS>0</ngwmn:ALT_UNITS>' + 
'			<ngwmn:ALT_UNITS_NM>Unknown</ngwmn:ALT_UNITS_NM>' + 
'			<ngwmn:ALT_DATUM_CD>NA</ngwmn:ALT_DATUM_CD>' + 
'			<ngwmn:WELL_DEPTH_UNITS>0</ngwmn:WELL_DEPTH_UNITS>' + 
'			<ngwmn:WELL_DEPTH_UNITS_NM>Unknown</ngwmn:WELL_DEPTH_UNITS_NM>' + 
'			<ngwmn:NAT_AQUIFER_CD>S300CAMORD</ngwmn:NAT_AQUIFER_CD>' + 
'			<ngwmn:NAT_AQFR_DESC>Cambrian-Ordovician aquifer system</ngwmn:NAT_AQFR_DESC>' + 
'			<ngwmn:COUNTRY_CD>US</ngwmn:COUNTRY_CD>' + 
'			<ngwmn:COUNTRY_NM>UNITED STATES OF AMERICA</ngwmn:COUNTRY_NM>' + 
'			<ngwmn:STATE_CD>27</ngwmn:STATE_CD>' + 
'			<ngwmn:STATE_NM>MINNESOTA</ngwmn:STATE_NM>' + 
'			<ngwmn:COUNTY_CD>000</ngwmn:COUNTY_CD>' + 
'			<ngwmn:COUNTY_NM>UNSPECIFIED</ngwmn:COUNTY_NM>' + 
'			<ngwmn:LOCAL_AQUIFER_NAME>364GALN, Galena Formation</ngwmn:LOCAL_AQUIFER_NAME>' + 
'			<ngwmn:QW_SYS_NAME>MN EQuIS</ngwmn:QW_SYS_NAME>' + 
'			<ngwmn:QW_SN_FLAG>1</ngwmn:QW_SN_FLAG>' + 
'			<ngwmn:QW_BASELINE_FLAG>1</ngwmn:QW_BASELINE_FLAG>' + 
'			<ngwmn:QW_WELL_CHARS>1</ngwmn:QW_WELL_CHARS>' + 
'			<ngwmn:QW_WELL_TYPE>2</ngwmn:QW_WELL_TYPE>' + 
'			<ngwmn:QW_WELL_PURPOSE>1</ngwmn:QW_WELL_PURPOSE>' + 
'			<ngwmn:WL_SN_FLAG>0</ngwmn:WL_SN_FLAG>' + 
'			<ngwmn:WL_BASELINE_FLAG>999</ngwmn:WL_BASELINE_FLAG>' + 
'			<ngwmn:WL_WELL_CHARS>999</ngwmn:WL_WELL_CHARS>' + 
'			<ngwmn:WL_WELL_TYPE>999</ngwmn:WL_WELL_TYPE>' + 
'			<ngwmn:WL_WELL_PURPOSE>1</ngwmn:WL_WELL_PURPOSE>' + 
'			<ngwmn:GEOM>' + 
'				<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' + 
'					<gml:coordinates xmlns:gml="http://www.opengis.net/gml"' + 
'						decimal="." cs="," ts=" ">-93.0300716,43.6770684</gml:coordinates>' + 
'				</gml:Point>' + 
'			</ngwmn:GEOM>' + 
'			<ngwmn:INSERT_DATE>2011-01-28T10:35:16</ngwmn:INSERT_DATE>' + 
'			<ngwmn:UPDATE_DATE>2012-09-13T17:05:13</ngwmn:UPDATE_DATE>' + 
'			<ngwmn:QW_DATA_PROVIDER>MPCA</ngwmn:QW_DATA_PROVIDER>' + 
'			<ngwmn:WL_DATA_FLAG>1</ngwmn:WL_DATA_FLAG>' + 
'			<ngwmn:QW_DATA_FLAG>1</ngwmn:QW_DATA_FLAG>' + 
'			<ngwmn:LOG_DATA_FLAG>1</ngwmn:LOG_DATA_FLAG>' + 
'		</ngwmn:VW_GWDP_GEOSERVER>' + 
'	</gml:featureMember>' + 
'	<gml:featureMember>' + 
'		<ngwmn:VW_GWDP_GEOSERVER' + 
'			fid="VW_GWDP_GEOSERVER.fid-57189476_13d402e7674_42ee">' + 
'			<ngwmn:MY_SITEID>MPCA:7090</ngwmn:MY_SITEID>' + 
'			<ngwmn:AGENCY_CD>MPCA</ngwmn:AGENCY_CD>' + 
'			<ngwmn:AGENCY_NM>Minnesota Pollution Control Agency</ngwmn:AGENCY_NM>' + 
'			<ngwmn:AGENCY_MED>MN Pollution Control Agency</ngwmn:AGENCY_MED>' + 
'			<ngwmn:SITE_NO>7090</ngwmn:SITE_NO>' + 
'			<ngwmn:SITE_NAME>MPCA Ambient Network Site 7090</ngwmn:SITE_NAME>' + 
'			<ngwmn:DISPLAY_FLAG>1</ngwmn:DISPLAY_FLAG>' + 
'			<ngwmn:DEC_LAT_VA>43.7035213</ngwmn:DEC_LAT_VA>' + 
'			<ngwmn:DEC_LONG_VA>-92.9667379</ngwmn:DEC_LONG_VA>' + 
'			<ngwmn:HORZ_DATUM>NAD83</ngwmn:HORZ_DATUM>' + 
'			<ngwmn:ALT_UNITS>0</ngwmn:ALT_UNITS>' + 
'			<ngwmn:ALT_UNITS_NM>Unknown</ngwmn:ALT_UNITS_NM>' + 
'			<ngwmn:ALT_DATUM_CD>NA</ngwmn:ALT_DATUM_CD>' + 
'			<ngwmn:WELL_DEPTH_UNITS>0</ngwmn:WELL_DEPTH_UNITS>' + 
'			<ngwmn:WELL_DEPTH_UNITS_NM>Unknown</ngwmn:WELL_DEPTH_UNITS_NM>' + 
'			<ngwmn:NAT_AQUIFER_CD>S300CAMORD</ngwmn:NAT_AQUIFER_CD>' + 
'			<ngwmn:NAT_AQFR_DESC>Cambrian-Ordovician aquifer system</ngwmn:NAT_AQFR_DESC>' + 
'			<ngwmn:COUNTRY_CD>US</ngwmn:COUNTRY_CD>' + 
'			<ngwmn:COUNTRY_NM>UNITED STATES OF AMERICA</ngwmn:COUNTRY_NM>' + 
'			<ngwmn:STATE_CD>27</ngwmn:STATE_CD>' + 
'			<ngwmn:STATE_NM>MINNESOTA</ngwmn:STATE_NM>' + 
'			<ngwmn:COUNTY_CD>000</ngwmn:COUNTY_CD>' + 
'			<ngwmn:COUNTY_NM>UNSPECIFIED</ngwmn:COUNTY_NM>' + 
'			<ngwmn:LOCAL_AQUIFER_NAME>364GALN, Galena Formation</ngwmn:LOCAL_AQUIFER_NAME>' + 
'			<ngwmn:QW_SYS_NAME>MN EQuIS</ngwmn:QW_SYS_NAME>' + 
'			<ngwmn:QW_SN_FLAG>1</ngwmn:QW_SN_FLAG>' + 
'			<ngwmn:QW_BASELINE_FLAG>1</ngwmn:QW_BASELINE_FLAG>' + 
'			<ngwmn:QW_WELL_CHARS>1</ngwmn:QW_WELL_CHARS>' + 
'			<ngwmn:QW_WELL_TYPE>2</ngwmn:QW_WELL_TYPE>' + 
'			<ngwmn:QW_WELL_PURPOSE>1</ngwmn:QW_WELL_PURPOSE>' + 
'			<ngwmn:WL_SN_FLAG>0</ngwmn:WL_SN_FLAG>' + 
'			<ngwmn:WL_BASELINE_FLAG>999</ngwmn:WL_BASELINE_FLAG>' + 
'			<ngwmn:WL_WELL_CHARS>999</ngwmn:WL_WELL_CHARS>' + 
'			<ngwmn:WL_WELL_TYPE>999</ngwmn:WL_WELL_TYPE>' + 
'			<ngwmn:WL_WELL_PURPOSE>1</ngwmn:WL_WELL_PURPOSE>' + 
'			<ngwmn:GEOM>' + 
'				<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' + 
'					<gml:coordinates xmlns:gml="http://www.opengis.net/gml"' + 
'						decimal="." cs="," ts=" ">-92.9667379,43.7035213</gml:coordinates>' + 
'				</gml:Point>' + 
'			</ngwmn:GEOM>' + 
'			<ngwmn:INSERT_DATE>2011-01-28T10:35:16</ngwmn:INSERT_DATE>' + 
'			<ngwmn:UPDATE_DATE>2012-09-13T17:05:13</ngwmn:UPDATE_DATE>' + 
'			<ngwmn:QW_DATA_PROVIDER>MPCA</ngwmn:QW_DATA_PROVIDER>' + 
'			<ngwmn:WL_DATA_FLAG>1</ngwmn:WL_DATA_FLAG>' + 
'			<ngwmn:QW_DATA_FLAG>0</ngwmn:QW_DATA_FLAG>' + 
'			<ngwmn:LOG_DATA_FLAG>1</ngwmn:LOG_DATA_FLAG>' + 
'		</ngwmn:VW_GWDP_GEOSERVER>' + 
'	</gml:featureMember>' + 
'</wfs:FeatureCollection>';

describe("WellDomain.js", function() {
	it("defines some core API functions and properties", function() {
        expect(GWDP.domain.Well.featurePrefix).toBeDefined();
        expect(GWDP.domain.Well.typeName).toBeDefined();
        expect(GWDP.domain.Well.fields).toBeDefined();
        expect(GWDP.domain.Well.WFSProtocol).toBeDefined();
        expect(GWDP.domain.Well.updateWellCount).toBeDefined();
        expect(GWDP.domain.Well.getWells).toBeDefined();
        expect(GWDP.domain.Well.getWellCount).toBeDefined();
	});
});
	

describe("GWDP.domain.Well.getWellCount", function() {
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();
		
		var url = "http://testing/test/url";
		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.Well.getWellCount(
			url,
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
		expect(params.typeName).toBe("ngwmn:VW_GWDP_GEOSERVER");
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	
	it("returns the correct number of wells, and passes that to the callback, when given a valid GML2 response for resultType=hits requests", function() {
		TestSupport.initServer();
		
		var url = "http://testing.com/test/url/hits";
		
		//set the response for this URL
		TestSupport.setServerXmlResponse(WellCountResponse);

		//do the call
		var callback = sinon.spy();
		GWDP.domain.Well.getWellCount(
				url,
				"1,2,3,4", 
				"(SOME_PARAM=1)", 
				callback
			);
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		expect(callback.getCall(0).args[0]).toBe('1135');
		
		TestSupport.restoreServer();
	});
});

describe("GWDP.domain.Well.getWLWellCount", function() {
	it("performs an Ext.Ajax.request with the cql_filter param wrapped explicitly for WL wells", function() {
		TestSupport.stubExtAjaxRequest();
		
		var url = "http://testing/test/url";
		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.Well.getWLWellCount(
			url,
			"1,2,3,4", 
			"(SOME_PARAM=1)", 
			callback
		);
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "POST" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: url })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.CQL_FILTER).toBe("(WL_SN_FLAG = '1') AND ((SOME_PARAM=1)) AND (BBOX(GEOM,1,2,3,4))");
		expect(params.resultType).toBeDefined();
		expect(params.resultType).toBe("hits");
		expect(params.VERSION).toBe("1.1.0");
		expect(params.typeName).toBe("ngwmn:VW_GWDP_GEOSERVER");
		
		TestSupport.restoreExtAjaxRequest();
	});
});

describe("GWDP.domain.Well.getQWWellCount", function() {
	it("performs an Ext.Ajax.request with the cql_filter param wrapped explicitly for QW wells", function() {
		TestSupport.stubExtAjaxRequest();
		
		var url = "http://testing/test/url";
		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.Well.getQWWellCount(
			url,
			"1,2,3,4", 
			"(SOME_PARAM=1)", 
			callback
		);
		
		//verify ajax params
		expect(Ext.Ajax.request.calledWithMatch({ method: "POST" })).toBe(true);
		expect(Ext.Ajax.request.calledWithMatch({ url: url })).toBe(true);
		
		var params = Ext.Ajax.request.getCall(0).args[0].params;
		expect(params).toBeDefined();
		expect(params.CQL_FILTER).toBe("(QW_SN_FLAG = '1') AND ((SOME_PARAM=1)) AND (BBOX(GEOM,1,2,3,4))");
		expect(params.resultType).toBeDefined();
		expect(params.resultType).toBe("hits");
		expect(params.VERSION).toBe("1.1.0");
		expect(params.typeName).toBe("ngwmn:VW_GWDP_GEOSERVER");
		
		TestSupport.restoreExtAjaxRequest();
	});
});

describe("GWDP.domain.Well.getWells", function() {
	it("performs an Ext.Ajax.request with the correct parameters", function() {
		TestSupport.stubExtAjaxRequest();

		var url = "http://testing/test/url/gml2";
		//do the call
		var callback = null; //callback will never happen anyway
		GWDP.domain.Well.getWells(
			url,
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
		expect(params.typeName).toBe("ngwmn:VW_GWDP_GEOSERVER");
		
		TestSupport.restoreExtAjaxRequest();
	});
	
	it("correctly parses a GML2 response into an array of records, and passes that to the callback, when given a valid GML2 response", function() {
		TestSupport.initServer();
		
		var url = "http://testing/test/url/gml2";
		
		//set the response for this URL
		TestSupport.setServerXmlResponse(GML2WellsResponse);
		
		//do the call
		var callback = sinon.spy();
		GWDP.domain.Well.getWells(
				url,
				"1,2,3,4", 
				"(SOME_PARAM=1)", 
				callback
			);
		
		TestSupport.doServerRespond();
		
		expect(callback.called).toBe(true);
		var results = callback.getCall(0).args[0];

		expect(results[0].data['STATE_CD']).toBe('27');
		expect(results[0].data['STATE_NM']).toBe('MINNESOTA');
		expect(results[0].data['DEC_LAT_VA']).toBe('43.6770684');
		expect(results[0].data['DEC_LONG_VA']).toBe('-93.0300716');
		
		expect(results[1].data['STATE_CD']).toBe('27');
		expect(results[1].data['STATE_NM']).toBe('MINNESOTA');
		expect(results[1].data['DEC_LAT_VA']).toBe('43.7035213');
		expect(results[1].data['DEC_LONG_VA']).toBe('-92.9667379');
		
		TestSupport.restoreServer();
	});
});
