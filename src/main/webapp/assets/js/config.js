

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
  // aquifers go here with opacity < 1, transparent: true; OpenLayers infers that the layer is an overlay.
  {
	 	name: 'National aquifers',
	 	url: GWDP.ui.map.baseWMSServiceUrl,
	 	type: OpenLayers.Layer.WMS,
	 	layers: 'ngwmn:aquifrp025',
	 	
	 	// data for CIDA hook, from phragmites
	 	helpContext: 'national_aquifer',
	 	legend: [  
	 	         {
	 	        	 name: 'National aquifers',
	 	        	 imgHtml: '<img src=images/legends/national_aquifers.jpg />',
	 	        	 helpContext: 'national_aquifer'
	 	         }
	 	],
	 	
	 	initialOn: true,
	 	opacity: 0.7,
	 	transparent:true	 	
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

