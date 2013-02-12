<html>
	<head>
		<title>National Groundwater Monitoring Network Data Portal (BETA)</title>
		<link rel="icon" 
      		type="image/png" 
      		href="favicon.ico">
		<!--  extjs assets -->
		<script src="ext-3.4.0/adapter/ext/ext-base.js"></script>
		<script src="ext-3.4.0/ext-all.js"></script>
		<script type="text/javascript" src="assets/js/js_custom/custom.js"></script>
		
		<link rel="stylesheet" href="ext-3.4.0/resources/css/ext-all.css"/>
		
		
		<!-- application assets -->		
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/splash.css"/>
		
		<!-- Google Analytics -->
		<script type="text/javascript">
		
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-29564531-2']);
		_gaq.push (['_gat._anonymizeIp']);
		_gaq.push(['_trackPageview']);
		
		(function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })();
		
		</script>
	</head>
	
	<body>
		<jsp:include page="header.jsp"></jsp:include>
		
		<div id="wrapper" style="width:100%" align="center">
			<div id="content">
				<table id="ngwmn-content-strip"><tr><td> <!-- START SPLASH CONTENT -->
					<div id="ngwmn-title-container">
						<p class="ngwmn-title">
							National Groundwater<br/>
							Monitoring Network <span class="ngwmn-highlight">Data Portal</span>
						</p>
					</div>
					
					<div id="ngwmn-description-container">
						<div id='ngwmn-description-section'>
							<p>
								The <span class="ngwmn-highlight">National Groundwater Monitoring Network</span> 
								(NGWMN)  is a compilation of selected groundwater monitoring wells from Federal, 
								State, and local groundwater monitoring networks across the nation.<br/><br/>
								The NGWMN is a product of the <a href="http://acwi.gov/sogw/index.html">Subcomittee on Groundwater</a> 
								of the federal Advisory Committee on Water Information (<a href="http://acwi.gov/">ACWI</a>).
							</p><br/>
							<p>
								The <span class="ngwmn-highlight">NGWMN Data Portal</span> provides access to 
								groundwater data from multiple, dispersed databases in a web-based mapping 
								application. The portal contains current and historical data including water 
								levels, water quality, lithology, and well construction.
							</p>	
						</div>
						
						<div id='ngwmn-current-net-section'>
							<table>
							<tr><td colspan=2 class='ngwmn-table-title'>CURRENT NETWORK:</td></tr>
							<tr><th><div id="ngwmnGWWellCount">2800</div></th><td>ground-water wells</td></tr>
							<tr><th><div id="ngwmnWLWellCount">1,200</div></th><td>water-level wells</td></tr>
							<tr><th><div id="ngwmnQWWellCount">600</div></th><td>water-quality wells</td></tr>
							<tr><td colspan=2><hr/></td></tr>
							<tr><th>10</th><td>subnetworks</td></tr>
							<tr><td colspan=2><hr/></td></tr>
							<tr><th>30</th><td>contributing agencies</td></tr>
							<tr><th>26</th><td>states</td></tr>
							<tr><th>14</th><td>principal</td></tr>
							</table>
						</div>
					</div>
					
					<div id="ngwmn-link-box-container">
					<a href="learnmore.jsp"><div id="ngwmn-learn-container">
						<div id="ngwmn-learn-header">LEARN about the Network</div>
						<div class='ngwmn-img-container'>
							<img src="assets/images/learn_fig.png" alt="Learn more figure. Link to learn more page"/>
						</div>
						<div id="ngwmn-learn-footer"></div>
					</div></a>
					<a href="index.jsp"><div id="ngwmn-explore-container">
						<div id="ngwmn-explore-header">EXPLORE the Network</div>
						<div class='ngwmn-img-container'>
							<img src="assets/images/us--125.5-25--65.5-49.5.png" alt="Base image of the US"/>
							<img src="geoserver/wms?request=GetMap&LAYERS=ngwmn%3AVW_GWDP_GEOSERVER&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&STYLES=&FORMAT=image%2Fpng&SRS=EPSG%3A4326&BBOX=-125.5,25,-65.5,49.5&WIDTH=350&HEIGHT=170" alt="Well network points"/>
						</div>
						<div id="ngwmn-explore-footer">The NGWMN Data Portal</div>
					</div></a>
					</div>
					<div id="ngwmn-join-section">
						<span class="title">JOIN THE NETWORK - include your data in the Portal!</span><br/><br/>
						<p>The network is made up of selected wells from existing monitoring networks across the 
						nation. Data from your network can be added the the NGWMN. The Portal accesses and translates 
						you data from it's native format into a single standard on the fly, you keep control of your 
						data. <a href="learnmore.jsp">Click here to learn more</a>.</p>
					</div>
					<div class='ngwmn-spacer'></div>
				</td></tr></table> <!-- END SPLASH CONTENT -->
			</div>
		</div>

		<jsp:include page="footer.jsp"></jsp:include>

	</body>
</html>