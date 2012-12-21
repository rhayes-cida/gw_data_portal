

//When using an XYZ layer with OpenLayers, this needs to be appended to the
//base URL.
GWDP.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';

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
    	name: "World Topo Map",
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/"+GWDP.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
    },
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
    	name: "World Relief Map",
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/"+GWDP.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
    }
  ,
  // aquifers go here with opacity < 1
  {
	  // http://igsarm-cida-javadev1.er.usgs.gov:8081/geoserver/ngwmn/wms?service=WMS&version=1.1.0&request=GetMap&layers=ngwmn:aquifrp025&styles=&bbox=-160.2360533326389,17.674692621715167,-64.56616224353957,49.385619651248135&width=995&height=330&srs=EPSG:4269&format=application/openlayers
	 	name: 'National aquifers',
	 	url: GWDP.ui.map.baseWMSServiceUrl,
	 	type: OpenLayers.Layer.WMS,
	 	layers: 'ngwmn:aquifrp025',
	 	legend: [  // from phragmites
	 	         {
	 	        	 name: 'National aquifers',
	 	        	 imgHtml: '<img src=images/legends/national_aquifers.jpg />',
	 	        	 helpContext: 'national_aquifer'
	 	         }
	 	],
	 	// drawingOrder: 4,
	 	initialOn: true,
	 	opacity: 0.5,
	 	transparent:true,
	 	
	 	helpContext: 'national_aquifer'
     }
  ];


GWDP.ui.map.networkLayers = [{
  	 	name: 'Contour-based 1 m reduction',
  	 	url: GWDP.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: 'ngwmn:VW_GWDP_GEOSERVER',
  	 	legend: [
  	 	         {
  	 	        	 // TODO Fix
  	 	        	 name: 'Contour-based 1 m reduction',
  	 	        	 imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	 	        	 divId: 'legend-contour-layer',
  	 	        	 helpContext: 'contour_corridor'
  	 	         }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: true,
  	 	opacity: 1.0,
  	 	helpContext: 'contour_corridor',
        geotiff: {
            identifier: '7',
            gridBaseCRS: 'urn:ogc:def:crs:EPSG::102039',
            gridOffsets: '30,-30'
        }
       }
 ];

