<!DOCTYPE html>
<html>
	<head>
		<title>National Groundwater Monitoring Network Data Portal (BETA)</title>
		<link rel="icon" 
      		type="image/png" 
      		href="favicon.ico">
      	
      	<!-- openlayers from war overlay -->
  		<jsp:include page="js/openlayers/openlayers.jsp">
            <jsp:param name="debug-qualifier" value="false" />
        </jsp:include>
      	
		<!-- Dygraph documents this as a needed IE8 hack  -->
	    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7; IE=EmulateIE9"> 
		<!--[if IE]><script language="javascript" type="text/javascript" src="excanvas.r60.js"></script><![endif]-->
	
		<!--  extjs assets -->
	    <script type='text/javascript' src='jquery-1.3.2-old-extend.js'></script>
	    <script type='text/javascript' src='ext-3.4.0/adapter/jquery/ext-jquery-adapter.js'></script>
		<script src="ext-3.4.0/adapter/ext/ext-base.js"></script>
		<script src="ext-3.4.0/ext-all-debug.js"></script>
		<link rel="stylesheet" href="ext-3.4.0/resources/css/ext-all.css"/>
		
		<!-- GA -->
		<script type='text/javascript' src='https://www.google.com/jsapi'></script>
		<script type="text/javascript">
			google.load("visualization", "1");
		</script>
		<script type="text/javascript" src="assets/js/GoogleAnalyticsUtils.js"></script>
		
		<!-- Extensions -->
	   	<script type="text/javascript" src='assets/ux/MultiSelect/MultiSelect.js'></script>
		<link rel="stylesheet" href="assets/ux/MultiSelect/MultiSelect.css"/>
		
		<!-- APPLICATION CODE IMPORTS -->
		<script type="text/javascript" src="assets/js/namespace.js"></script>
		<jsp:include page="server_js_props.jsp"></jsp:include>
		<script type="text/javascript" src="assets/js/config.js"></script>
	
		<!-- Data domain objects -->		
		<script type="text/javascript" src="assets/js/domain/BaseDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/WellDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/AgencyDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/StateDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/AquiferDomain.js"></script>
		
		<script type="text/javascript" src="assets/js/Mediator.js"></script>
		<script type="text/javascript" src="assets/js/help.js"></script>
		<script type="text/javascript" src="assets/js/map.js"></script>
		<script type="text/javascript" src="assets/js/filter.js"></script>
		
		<script type="text/javascript" src="assets/js/SiteIdSelectorPopup.js"></script>
		<script type="text/javascript" src="assets/js/DocNavHelper.js"></script>
		<script type="text/javascript" src="assets/js/SiteIdentifyWindow.js"></script>
		<script type="text/javascript" src="assets/js/DownloadPopup.js"></script>
		
		<script type="text/javascript" src="assets/js/ui.js"></script>

		
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/index.css"/>
    	
	
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
		
		<form method="GET" target="_blank" class="x-hidden" id="qw-csv-export" action="http://qwwebservices.usgs.gov/Result/search">
			<input type="hidden" name="siteid" id="qw-siteid"/>
			<input type="hidden" name="mimeType" value="csv"/>
			<input type="hidden" name="zip" value="yes"/>
		</form>

		<form method="GET" target="_blank" class="x-hidden" id="wl-xml-export" action="http://infotrek.er.usgs.gov/ogc-ie/sosbbox">
			<input type="hidden" name="featureId" id="wl-siteid"/>
			<input type="hidden" name="request" value="GetObservation"/>
		</form>
		<jsp:include page="helpcontent.jsp"></jsp:include>
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