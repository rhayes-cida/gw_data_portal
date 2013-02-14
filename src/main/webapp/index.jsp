<%@ page import="gov.usgs.HTMLUtil,
				javax.naming.Context,
				javax.naming.InitialContext,
				javax.sql.DataSource,
				java.sql.SQLException,
				java.sql.Connection"%>
<!DOCTYPE html>
<html>
	<head>
		<title>National Groundwater Monitoring Network Data Portal (BETA)</title>
		<link rel="icon" 
      		type="image/png" 
      		href="favicon.ico">
      	
      	<!-- openlayers from war overlay -->
  		<jsp:include page="js/openlayers/openlayers.jsp">
            <jsp:param name="debug-qualifier" value="true" />
        </jsp:include>
      	
		<!-- Dygraph documents this as a needed IE8 hack  -->
	    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7; IE=EmulateIE9"> 
		<!--[if IE]><script language="javascript" type="text/javascript" src="excanvas.r60.js"></script><![endif]-->
	
		<!--  extjs assets -->
	    <script type='text/javascript' src='jquery-1.3.2-old-extend.js'></script>
	    <script type='text/javascript' src='ext-3.4.0/adapter/jquery/ext-jquery-adapter.js'></script>
		<script src="ext-3.4.0/adapter/ext/ext-base.js"></script>
		<script src="ext-3.4.0/ext-all-debug.js"></script>
<!-- 		<script src="ext-3.4.0/examples/ux/BufferView.js"></script> -->
		<link rel="stylesheet" href="ext-3.4.0/resources/css/ext-all.css"/>
		
		<!-- GA -->
		<script type='text/javascript' src='https://www.google.com/jsapi'></script>
		<script type="text/javascript" src="assets/js/GoogleAnalyticsUtils.js"></script>
		
		<!-- application assets -->
		<jsp:include page="globalJavascriptProperties.jsp"></jsp:include>

		<!-- Data domain objects -->		
		<script type="text/javascript" src="assets/js/domain/BaseDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/WellDomain.js"></script>
		
		<script type="text/javascript" src="assets/js/Mediator.js"></script>
		<script type="text/javascript" src="assets/js/map.js"></script>
		<script type="text/javascript" src="assets/js/ui.js"></script>
		<script type="text/javascript" src="assets/js/SiteIdSelectorPopup.js"></script>
		<script type="text/javascript" src="assets/js/DocNavHelper.js"></script>
		<script type="text/javascript">
			google.load("visualization", "1");
		</script>
		<script type="text/javascript" src="assets/js/SiteIdentifyWindow.js"></script>
		<script type="text/javascript" src="assets/js/DownloadPopup.js"></script>
		
		
		
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
	
		<!-- Google Analytics -->
		<script type="text/javascript">
		
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-29564531-2']);
		_gaq.push (['_gat._anonymizeIp']);
		_gaq.push(['_trackPageview']);
		
		(function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })();
		
		</script>
		
		<!-- Dygraph (see above for associated canvas hacks for IE) -->
<!-- 		<script type="text/javascript" src="http://cida.usgs.gov/js/dygraphs/2012_07_21_bc2d2/dygraph-dev.js"></script> -->
		<script type="text/javascript" src="dygraph.js"></script>
  		<style>
  			.dygraph-legend{
  				opacity: .70;
  				filter:alpha(opacity=70);
				filter: "alpha(opacity=70)";
				top: 2px !important;
				width: 248px !important;
  			}
  		
  		</style>
	</head>
	
	<body>
		<jsp:include page="header.jsp"><jsp:param value="National Groundwater Monitoring Network Data Portal (BETA)" name="pageTitle"/></jsp:include>
		
		<div id="map-area" class="x-hidden" style="width: 100%; height: 100%;">
		</div>
		
<%
		//TODO not a fan of directly building HTML with JDBC directly in the JSPs
		Connection connection = null;

		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/gwDataPortalUserDS");
			connection = ds.getConnection();

%>
		<!--  PARAM LISTS -->
		<div id="agency-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="agency" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All Organization IDs</option>
				<% HTMLUtil.getAgencyList(out, connection); %>
			</select>
		</div>

		<div id="qw-well-type-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="qw-well-type" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All Water Quality Sub Networks</option>
				<% HTMLUtil.getQWWellTypeList(out, connection); %>
			</select>
		</div>
		
		
		<div id="wl-well-type-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="wl-well-type" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All Water Level Sub Networks</option>
				<% HTMLUtil.getWLWellTypeList(out, connection); %>
			</select>
		</div>
		
		<div id="ntlAquifer-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="ntlAquifer" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All National Aquifers</option>
				<% HTMLUtil.getNationalAquiferNameList(out, connection); %>
			</select>
		</div>



<%
		} catch (Exception e) {
			log("Error in NGWMN portal index.jsp",e);
%>
			<jsp:text><![CDATA[
			<div id="agency-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="agency" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">(cached)All Organization IDs</option>
				<option title="Illinois Environmental Protection Agency"value="IL EPA">IL Envtl Protection Agency</option>
				<option title="Indiana Department of Natural Resources"value="IN DNR">IN Dept. of Natural Resources</option>
				<option title="Illinois State Water Survey"value="ISWS">IL State Water Survey</option>
				<option title="Montana Bureau of Mines and Geology"value="MBMG">MT Bureau of Mines and Geology</option>
				<option title="Minnesota Department of Natural Resources"value="MN DNR">MN Dept. of Natural Resources</option>
				<option title="Minnesota Pollution Control Agency"value="MPCA">MN Pollution Control Agency</option>
				<option title="United States Geological Survey New Jersey / New Jersey Geological Survey"value="USGS">USGS NWIS</option>
				<option title="Texas Water Development Board"value="TWDB">TX Water Development Board</option>
			</select>
		</div>

		<div id="qw-well-type-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="qw-well-type" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">(cached)All Water Quality Sub Networks</option>
				<option title="Surveillance - Background"value="1-1">Surveillance - Background</option>
				<option title="Surveillance - Known Changes"value="1-3">Surveillance - Known Changes</option>
				<option title="Trend - Background"value="2-1">Trend - Background</option>
				<option title="Trend - Known Changes"value="2-3">Trend - Known Changes</option>
				<option title="Unknown - Background"value="999-1">Unknown - Background</option>
				<option title="Unknown - Unknown"value="999-999">Unknown - Unknown</option>
				
				<!--
				<option value="" selected="selected">(cached)All Water Quality Sub Networks</option>
				<option title="Surveillance - Targeted"value="Surveillance - Targeted">Surveillance - Targeted</option>
				<option title="Surveillance - Unstressed"value="Surveillance - Unstressed">Surveillance - Unstressed</option>
				<option title="Trend - Targeted"value="Trend - Targeted">Trend - Targeted</option>
				<option title="Trend - Unknown"value="Trend - Unknown">Trend - Unknown</option>
				<option title="Trend - Unstressed"value="Trend - Unstressed">Trend - Unstressed</option>
				-->
			</select>
		</div>
		<div id="wl-well-type-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="wl-well-type" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">(cached)All Water Level Sub Networks</option>
				<option title="Surveillance - Background"value="1-1">Surveillance - Background</option>
				<option title="Surveillance - Known Changes"value="1-3">Surveillance - Known Changes</option>
				<option title="Trend - Background"value="2-1">Trend - Background</option>
				<option title="Trend - Known Changes"value="2-3">Trend - Known Changes</option>
								
				<!--
				<option value="" selected="selected">All Water Level Sub Networks</option>
				<option title="Surveillance - Targeted"value="Surveillance - Targeted">Surveillance - Targeted</option>
				<option title="Surveillance - Unstressed"value="Surveillance - Unstressed">Surveillance - Unstressed</option>
				<option title="Trend - Targeted"value="Trend - Targeted">Trend - Targeted</option>
				<option title="Trend - Unstressed"value="Trend - Unstressed">Trend - Unstressed</option>
				-->
			</select>
		</div>
		<div id="ntlAquifer-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="ntlAquifer" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">(cached)All National Aquifers</option>
				<option title="Alluvial aquifers"value="Alluvial aquifers">Alluvial aquifers</option>
				<option title="Cambrian-Ordovician aquifer system"value="Cambrian-Ordovician aquifer system">Cambrian-Ordovician aquifer system</option>
				<option title="Coastal lowlands aquifer system"value="Coastal lowlands aquifer system">Coastal lowlands aquifer system</option>
				<option title="Early Mesozoic basin aquifers"value="Early Mesozoic basin aquifers">Early Mesozoic basin aquifers</option>
				<option title="Edwards-Trinity aquifer system"value="Edwards-Trinity aquifer system">Edwards-Trinity aquifer system</option>
				<option title="Lower Tertiary aquifers"value="Lower Tertiary aquifers">Lower Tertiary aquifers</option>
				<option title="Northern Atlantic Coastal Plain aquifer system"value="Northern Atlantic Coastal Plain aquifer system">Northern Atlantic Coastal Plain aquifer system</option>
				<option title="Northern Rocky Mountains Intermontane Basins aquifer systems"value="Northern Rocky Mountains Intermontane Basins aquifer systems">Northern Rocky Mountains Intermontane Basins aquifer systems</option>
				<option title="Paleozoic aquifers"value="Paleozoic aquifers">Paleozoic aquifers</option><option title="Pecos River Basin alluvial aquifer"value="Pecos River Basin alluvial aquifer">Pecos River Basin alluvial aquifer</option>
				<option title="Piedmont and Blue Ridge crystalline-rock aquifers"value="Piedmont and Blue Ridge crystalline-rock aquifers">Piedmont and Blue Ridge crystalline-rock aquifers</option><option title="Rio Grande aquifer system"value="Rio Grande aquifer system">Rio Grande aquifer system</option>
				<option title="Sand and gravel aquifers (glaciated regions)"value="Sand and gravel aquifers (glaciated regions)">Sand and gravel aquifers (glaciated regions)</option>
				<option title="Seymour aquifer"value="Seymour aquifer">Seymour aquifer</option>
				<option title="Texas coastal uplands aquifer system"value="Texas coastal uplands aquifer system">Texas coastal uplands aquifer system</option>
				<option title="Upper Cretaceous aquifers"value="Upper Cretaceous aquifers">Upper Cretaceous aquifers</option>
				<option title="Valley and Ridge aquifers"value="Valley and Ridge aquifers">Valley and Ridge aquifers</option>
			</select>
		</div>

		
			
			]]>
			</jsp:text>
<% 
		} finally {
			if (connection != null) {
				try { connection.close(); } catch (SQLException e3) { ; }
				connection = null;
			}
		}
%>		
		<form method="GET" target="_blank" class="x-hidden" id="qw-csv-export" action="http://qwwebservices.usgs.gov/Result/search">
			<input type="hidden" name="siteid" id="qw-siteid"/>
			<input type="hidden" name="mimeType" value="csv"/>
			<input type="hidden" name="zip" value="yes"/>
		</form>

		<form method="GET" target="_blank" class="x-hidden" id="wl-xml-export" action="http://infotrek.er.usgs.gov/ogc-ie/sosbbox">
			<input type="hidden" name="featureId" id="wl-siteid"/>
			<input type="hidden" name="request" value="GetObservation"/>
		</form>
		
		<jsp:include page="footer.jsp"></jsp:include>
		
		<form id="exportForm" style="display:none" method="GET" action="export">
			<%-- For list of parameters, see the java class HTTPParameters.ExtParam --%>
			<%-- TODO: write these out instead of explicit --%>
			<input type="hidden" name="siteNo"/>
			<input type="hidden" name="agency_cd"/>
			<input type="hidden" name="wlSnFlag"/>
			<input type="hidden" name="qwSnFlag"/>
			<input type="hidden" name="downloadToken"/>
		</form>
		
		<form id="multisiteDownloadForm" style="display:none;" method="POST" action="data">
			<!--  Used by DownloadPopup.jsp, which creates the input fields -->
			<button name="download" type="submit"/>
		</form>
	</body>
</html>