GWDP.domain.Well.typeName = "VW_GWDP_GEOSERVER";
GWDP.domain.Well.featurePrefix = "ngwmn";

GWDP.domain.Well.WFSAjaxParams = function(bbox) {
	return {
		SERVICE: 'WFS',
		VERSION: "1.1.0",
		srsName: "EPSG:4326",
		outputFormat: 'GML2',
		BBOX: bbox,
		typeName: GWDP.domain.Well.featurePrefix + ':' + GWDP.domain.Well.typeName
	}
};

GWDP.domain.Well.WFSProtocol = new OpenLayers.Protocol.WFS.v1_1_0({
	outputFormat: 'GML2',
	geometryName: 'GEOM',
	featurePrefix: GWDP.domain.Well.featurePrefix,
	featureType: GWDP.domain.Well.typeName
});

GWDP.domain.Well.getWells = function(bbox, filters, callback) {
	//TODO do something with filters
	Ext.Ajax.request({
		url: GWDP.ui.map.baseWFSServiceUrl,
		method: 'GET',
		params: GWDP.domain.Well.WFSAjaxParams(bbox),
		success: function(response, options) {
			callback(GWDP.domain.Well.WFSProtocol.parseResponse(response));
		}
	})
};