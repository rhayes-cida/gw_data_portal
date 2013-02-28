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
        
      	<script src="ext-3.4.0/adapter/ext/ext-base.js"></script>
		<script src="ext-3.4.0/ext-all.js"></script>

		<!-- application assets -->
		<jsp:include page="globalJavascriptProperties.jsp"></jsp:include>

		<script type="text/javascript" src="assets/js/domain/BaseDomain.js"></script>
		<script type="text/javascript" src="assets/js/domain/AgencyDomain.js"></script>
		
		<!-- application assets -->		
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/learnmore.css"/>
		
		<script type="text/javascript" src="yetii/yetii.js"></script>
		<script type="text/javascript" src="assets/js/learnmore.js"></script>
	</head>
	
	<body>
		<jsp:include page="header.jsp"></jsp:include>
		
		<div id="wrapper" style="width:100%" align="center">
			<div id="content">
				<table id="ngwmn-content-strip"><tr><td> <!-- START LEARN CONTENT -->
					<div id="ngwmn-title-container">
						<p class="ngwmn-title">
							<a href="splash.jsp">National <span class="ngwmn-highlight">Groundwater</span>
							Monitoring Network</a>
						</p>
					</div>
					<div id="ngwmn-description-container">
						<p>
						The <span class="ngwmn-highlight">National Ground Water Monitoring Network (NGWMN)</span> is a compliation of selected wells
						monitoring ground-water aquifers all around the nation. The <span class="ngwmn-highlight">NGWMN Data Portal</span> brings real-time
						ground-water data together in one place to provide users with current and reliable information for
						the planning, management, and development of ground-water resources.
						</p>
					</div>
					
					<div id="ngwmn-learn-tab-container" class='ngwmn-tab-layout'>
						<ul id="ngwmn-learn-tab-container-nav"  class='ngwmn-tab-layout'>
					    	<li><a href="#aboutNetwork">ABOUT THE NETWORK</a></li>
					    	<li><a href="#dataPortal">THE DATA PORTAL</a></li>
					    	<li><a href="#dataProviders">DATA PROVIDERS</a></li>
					    	<li><a href="#getInvloved">GET INVOLVED</a></li>
					    </ul>
					    
					    <div class="ngwmn-tabs-container">
						    <div class="ngwmn-tab" id="aboutNetwork">
						    	<div class="ngwmn-tab-content">
							    	<div class="ngwmn-tab-title">About the Network</div>
							    	<hr/>
							    	<div><jsp:include page="learn/aboutTheNetwork.jsp"></jsp:include></div>
						    	</div>
						    </div>
						    
						    <div class="ngwmn-tab" id="dataPortal">
						    	<div class="ngwmn-tab-content">
							    	<div class="ngwmn-tab-title">The Data Portal</div>
							    	<hr/>
							    	<div><jsp:include page="learn/theDataPortal.jsp"></jsp:include></div>
						    	</div>
						    </div>
						    
						    <div class="ngwmn-tab" id=""dataProviders"">
						    	<div class="ngwmn-tab-content">
							    	<div class="ngwmn-tab-title">Data Providers</div>
							    	<hr/>
							    	<div><jsp:include page="learn/partners.jsp"></jsp:include></div>
						    	</div>
						    </div>
						    
						    <div class="ngwmn-tab" id="getInvloved">
						    	<div class="ngwmn-tab-content">
							    	<div class="ngwmn-tab-title">Get Involved</div>
							    	<hr/>
							    	<div><jsp:include page="learn/getInvolved.jsp"></jsp:include></div>
						    	</div>
						    </div>
					    </div>
				    </div>
				</td></tr></table> <!-- END LEARN CONTENT -->
			</div>
		</div>

		<jsp:include page="footer.jsp"></jsp:include>
	</body>
</html>