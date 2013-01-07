<!-- this file is a mechanism for writing out server defined properties into the 
javascript memory space -->
<%@page import="gov.usgs.DebugSettings"%>
<script type="text/javascript">
Ext.ns("GWDP");
Ext.ns("GWDP.ui");
Ext.ns("GWDP.ui.map");

GWDP.ui.map.baseMapServerUrl = '<%=DebugSettings.GEOSERVER%>';
//define urls for map server services
GWDP.ui.map.baseWMSServiceUrl = GWDP.ui.map.baseMapServerUrl + '/wms?request=GetMap';
</script>

<script type="text/javascript" src="assets/js/config.js"></script>