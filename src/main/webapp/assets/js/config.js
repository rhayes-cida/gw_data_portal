Ext.ns("GWDP");
Ext.ns("GWDP.ui");
Ext.ns("GWDP.ui.map");

//When using an XYZ layer with OpenLayers, this needs to be appended to the
//base URL.
GWDP.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';

// define urls for map server services
GWDP.ui.map.baseMapServerUrl = 'http://cida.usgs.gov/ArcGIS/services/GWDP68_Phragmites/MapServer';
GWDP.ui.map.baseWMSServiceUrl = GWDP.ui.map.baseMapServerUrl + '/WMSServer';

GWDP.ui.getLegendHTML = function(url, layers/* string containing comma separated layer names */){
	// Return the html representing the layers by retrieving the map legend at url.
	var html = '';
	var listOfLayers = layers.split(',');
	for (var i = 0;  i < listOfLayers.length; i++){
		if (i != 0) {
			html += '<br/>';
		}
		html += '<img src=' + url + '?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=' + listOfLayers[i] + '>';
	}
	return html;
};

/* Define an object containing all base layers used in the application.
 * The use_white property is used to style controls when that base layer is visible */
GWDP.ui.map.baseLayers = [
  {
	  name: 'World Imagery',
	  url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/' + GWDP.ui.map.XYZ_URL_POSTFIX,
	  type: OpenLayers.Layer.XYZ,
      use_white: true
  },
  {
		name: 'World Street Map',
		url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/' + GWDP.ui.map.XYZ_URL_POSTFIX,
		type: OpenLayers.Layer.XYZ
  },
  {
    	name: "World Topo Map",
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/"+GWDP.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
    },
    {
    	name: "World Relief Map",
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/"+GWDP.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
    }
  ];


GWDP.ui.map.networkLayers = [{
  	 	name: 'Contour-based 1 m reduction',
  	 	url: GWDP.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '4',
  	 	legend: [
  	 	         {
  	 	        	 name: 'Contour-based 1 m reduction',
  	 	        	 imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	 	        	 divId: 'legend-contour-layer',
  	 	        	 helpContext: 'contour_corridor'
  	 	         }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'contour_corridor',
        geotiff: {
            identifier: '7',
            gridBaseCRS: 'urn:ogc:def:crs:EPSG::102039',
            gridOffsets: '30,-30'
        }
       },
       {
  	 	name: 'Lidar-based 1 m reduction',
  	 	url: GWDP.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '11,14',
  	 	legend:[
  	 	        {
  	 	        	name: 'Lidar-based 1 m reduction',
  	 	        	imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	 	        	divId: 'legend-lidar-1m-reduction',
  	 	        	helpContext: 'lidar_1m_reduction'
  	 	        },
  	 	        {
  	 	        	name: 'Lidar availability',
  	 	        	imgHtml: '<img src=images/legends/lidar_availability.jpg />',
  	 	        	divId: 'legend-lidar-unavailable'
  	 	        }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'lidar_1m_reduction',
  	 	geotiff: {
            identifier: '2',
            gridBaseCRS: 'urn:ogc:def:crs:EPSG::102039',
            gridOffsets: '30 -30'
        }
       },
       {
  	 	name: 'Lidar-based 50 cm reduction',
  	 	url: GWDP.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '13,14',
  	 	legend:[
  	 	        {
  	 	        	name: 'Lidar-based 50 cm reduction',
  	 	        	imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	 	        	divId: 'legend-lidar-50cm-reduction',
  	 	        	helpContext: 'lidar_50cm_reduction'
  	 	        },
  	 	        {
  	 	        	name: 'Lidar Availability',
  	 	        	imgHtml: '<img src=images/legends/lidar_availability.jpg />',
  	 	        	divId: 'legend-lidar-unavailable'
  	 	        }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'lidar_50cm_reduction',
  	 	geotiff: {
            identifier: '1',
            gridBaseCRS: 'urn:ogc:def:crs:EPSG::102039',
            gridOffsets: '30 -30'
        }
       }
 ];

