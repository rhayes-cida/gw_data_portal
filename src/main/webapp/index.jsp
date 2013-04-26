<!DOCTYPE html>
<html>
	<head>
	    <meta http-equiv="X-UA-Compatible" content="chrome=IE8"> 
<!--[if lt IE 9]>
	<script>
	var canvas_loaded_for_old_ie = 1;
	</script>
	<script language="javascript" type="text/javascript" src="excanvas.r60.js"></script>
<![endif]-->
	    
		
		<title>National Groundwater Monitoring Network</title>
		<link rel="icon" 
      		type="image/png" 
      		href="favicon.ico">
      	
      	<!-- openlayers from war overlay -->
  		<jsp:include page="js/openlayers/openlayers.jsp">
            <jsp:param name="debug-qualifier" value="true" />
        </jsp:include>
      	
	
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
		
		<!-- APPLICATION CODE IMPORTS -->
		<script type="text/javascript" src="assets/js/namespace.js"></script>
		<jsp:include page="server_js_props.jsp"></jsp:include>
		<script type="text/javascript" src="assets/js/config.js"></script>
		<script type="text/javascript" src="assets/js/utils.js"></script>
        
		<!-- Extensions -->
	   	<script type="text/javascript" src='assets/ux/MultiSelect/MultiSelect.js'></script>
		<link rel="stylesheet" href="assets/ux/MultiSelect/MultiSelect.css"/>
	   	<script type="text/javascript" src='assets/ux/notify/Notify.js'></script>
		<link rel="stylesheet" href="assets/ux/notify/Notify.css"/>
	   	<script type="text/javascript" src='assets/ux/togglebutton/ToggleButton.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/LayerSwitcher.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/OverviewMap.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/SiteSelector.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/PanZoom.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/ZoomBox.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/Click.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/Hover.js'></script>
	   	<script type="text/javascript" src='assets/js/MapControl/ExtJSTools.js'></script>
	
		<!-- Data domain objects -->		
		<script type="text/javascript" src="assets/js/domain/BaseDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/WellDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/AgencyDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/StateDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/CountyDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/AquiferDomain.js"></script>
		
        <script type="text/javascript" src="assets/js/UiFormatters.js"></script>
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
		<link rel="stylesheet" href="assets/ngwmn_ext_skin/xtheme-ngwmn.css"/>
		<link rel="stylesheet" href="assets/css/index.css"/>
		<link rel="stylesheet" href="assets/css/custom.css"/>
    	
	
		<!-- Google Analytics -->
		<script type="text/javascript">
		
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-29564531-2']);
		_gaq.push (['_gat._anonymizeIp']);
		_gaq.push(['_trackPageview']);
		
		(function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })();
		
		</script>
		<script type="application/javascript" src="http://www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>
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
<!--[if lt IE 9]>
	<script type="text/javascript" 
   			src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>

  	<script>
   		CFInstall.check({
     		mode: "overlay"
   		});
  	</script>
<![endif]-->

		<jsp:include page="header.jsp"><jsp:param value="true" name="headerTitle"/></jsp:include>
		
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
            <button name="download" type="submit"></button>
		</form>
	</body>
</html>