<!-- this file is a mechanism for writing out server defined properties into the 
javascript memory space -->
<%@page import="gov.usgs.DebugSettings"%>
<script type="text/javascript">
GWDP.ui.map.baseMapServerUrl = '<%=DebugSettings.GEOSERVER%>';
</script>

