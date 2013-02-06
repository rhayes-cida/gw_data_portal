<!-- this file is a mechanism for writing out server defined properties into the 
javascript memory space -->
<%@page import="gov.usgs.DebugSettings"%>
<script type="text/javascript">
Ext.ns("GWDP");
Ext.ns("GWDP.ui");
Ext.ns("GWDP.ui.map");

Ext.ns("GWDP.domain"); //data domain namespace
Ext.ns("GWDP.domain.Well"); //data domain namespace for well objects

GWDP.ui.map.baseMapServerUrl = '<%=DebugSettings.GEOSERVER%>';
//define urls for map server services
GWDP.ui.map.baseWMSServiceUrl = GWDP.ui.map.baseMapServerUrl + '/wms?request=GetMap';
GWDP.ui.map.baseWFSServiceUrl = GWDP.ui.map.baseMapServerUrl + '/wfs?request=GetFeature';
</script>

<script type="text/javascript" src="assets/js/config.js"></script>