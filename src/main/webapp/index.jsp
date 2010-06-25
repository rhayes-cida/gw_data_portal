<%@ page import="gov.usgs.HTMLUtil,
				javax.naming.Context,
				javax.naming.InitialContext,
				javax.sql.DataSource,
				java.sql.SQLException,
				java.sql.Connection"%>

<html>
	<head>
		<title>United States Groundwater Data Portal</title>
	
		<!-- scrollable map assets -->
		<script type="text/javascript" src="scrollable_map/JMap-header.js"></script>
		<script type="text/javascript" src="scrollable_map/JMap-base.js"></script>
		<script type="text/javascript" src="scrollable_map/JMap-all.js"></script>
		<link rel="stylesheet" href="scrollable_map/css/scrollable_map.css"/>
	
		<!--  extjs assets -->
		<script src="ext_js/adapter/ext/ext-base.js"></script>
		<script src="ext_js/ext-all.js"></script>
		<script type="text/javascript" src="assets/js/js_custom/custom.js"></script>
		<link rel="stylesheet" href="ext_js/resources/css/ext-all.css"/>
		
		<!-- application assets -->
		<script type="text/javascript" src="assets/js/ui.js"></script>
		<script type="text/javascript" src="assets/js/ncp.js"></script>
		<script type="text/javascript" src="assets/js/SiteIdSelector.js"></script>
		<script type="text/javascript" src="assets/js/SiteIdentifyWindow.js"></script>
		<script type="text/javascript" src="assets/js/MapLayersWindow.js"></script>
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
	
	</head>
	
	<body>
		<div id="header">
			<div id="banner-area">
			     
				<h1>US Geological Survey</h1><!-- Not actually visible unless printed -->
				<div id="usgs-header-logo">
					<a title="Link to the US Geological Survey main web page" href="http://www.usgs.gov">
						<img src="assets/images/USGS_web_logo.gif" alt="USGS Logo"/>
					</a>
				</div>
				
				<div class="print-only" id="usgsPrintCommHeader">
					<h3 id="printCommType">Web Page Hardcopy</h3>
					<p class="hide">The section 'Web Page Hardcopy' is only visible when printed.  Ignore if viewing with style sheets turrned off</p>
					<p id="printCommDate">
						<script type="text/javascript">document.write(new Date().toLocaleString());</script>Wed Jul 22 15:17:15 2009
					</p>
					<p id="printCommPrintFrom">Printed From: <script type="text/javascript">document.write(document.location.href);</script>http://infotrek.er.usgs.gov/warp/</p>
					<p>
					  This print version of the page is optimized to print only the
					  content portions of the web page your were viewing and is not
					  intended to have the same formatting as the original page.
					</p>
				</div>
				
				<div id="ccsa-area">
					<h4 class="access-help">Top Level USGS Links</h4>
					<br/>
					<a title="Link to main USGS page" href="http://www.usgs.gov/">USGS Home</a>
					<br/>
					<a title="Link to main USGS contact page" href="http://www.usgs.gov/ask/index.html">Contact USGS</a>
					<br/>
					<a title="Link to main USGS search (not publications search)" href="http://search.usgs.gov/">Search USGS</a>
					<br/>
				</div>
			</div><!-- End content -->
				
			<div class="access-help" id="quick-links">
				<h4>Quick Page Navigation</h4>
				<ul title="links to portions of this page.  Details:  Not normally visible and intended for screen readers.  Page layout has the content near top. Links opening new windows are noted in titles.">
					<li><a title="Main content of this page.  Starts with the pages name." href="#page-content">Page Main Content</a></li>
					<li><a title="Short list of top pages within the site.  Before page content." href="#site-top-links">Top Pages Within This Site</a></li>
					<li><a title="Complete list of page within the site.  After page content." href="#site-full-links">All Pages Within This Site</a></li>
					<li><a title="Pages within the site and external links.  After page content." href="#full-navigation">All Site Pages Plus External Links</a></li>
					<li><a title="HTML and CSS validation links for this page.  After page content." href="#validation-info">HTML and CSS Validation Info</a></li>
					<li><a title="Mainenance info, general USGS links.  Bottom of page, after content." href="#footer">Misc. Page Info</a></li>
				</ul>
			</div>
			
			<h2 id="site-title">
				United States Groundwater Data Portal
			</h2>
		</div> <!--  // END HEADER -->
		
		
		
		<div id="wrapper" style="width:100%" align="center">
			<div id="content"></div>
		</div>
		
		<!-- render map to this div -->
		<div id="map-area" class="x-hidden">
			<div id="map-tools" class="map-tools"></div>
			<img id="visid" src="http://internal.usgs.gov/visual/visual_id_files/raster/BW/80x22_black.jpg"/>
			<div id="legend-div"></div>
		</div>
		
		
		
<%
		Connection connection = null;

		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/nawqaDS");
			connection = ds.getConnection();

%>
		<!--  PARAM LISTS -->
		<div id="state-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="state" multiple="multiple" size="5" style="width: 100%" onmousedown="resetOtherGeoPicklists(this)">
				<option value="" selected="selected">All States</option>
				<% HTMLUtil.getStateList(out, connection); %>
			</select>
		</div>

		<div id="eparegion-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="eparegion" multiple="multiple" size="5" style="width: 100%" onmousedown="resetOtherGeoPicklists(this)">
				<option value="" selected="selected">All EPA Regions</option>
				<% HTMLUtil.getEpaRegionList(out, connection); %>
			</select>
		</div>
		
		<div id="studyunit-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="studyunit" multiple="multiple" size="5" style="width: 100%" onmousedown="resetOtherGeoPicklists(this)">
				<option value="" selected="selected">All Study Units</option>
				<% HTMLUtil.getStudyUnitList(out, connection); %>
			</select>
		</div>



<%
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connection != null) {
				try { connection.close(); } catch (SQLException e3) { ; }
				connection = null;
			}
		}
%>		
		

		
		<!-- // START FOOTER -->
		<div style="width: 100%; margin-right: -1em;" id="footer">
			<div id="usgs-policy-links">
				<h4 class="access-help">USGS Policy Information Links</h4>
				<ul class="hnav">
					<li><a title="USGS web accessibility policy" href="http://www.usgs.gov/accessibility.html">Accessibility</a></li>
					<li><a title="USGS Freedom of Information Act information" href="http://www.usgs.gov/foia/">FOIA</a></li>
					<li><a title="USGS privacy policies" href="http://www.usgs.gov/privacy.html">Privacy</a></li>
					<li><a title="USGS web policies and notices" href="http://www.usgs.gov/policies_notices.html">Policies and Notices</a></li>
				</ul>
			</div><!-- end usgs-policy-links -->
   
			<div class="content">
				<div id="page-info">
					<p id="footer-doi-links">
						<span class="vcard">
							<a title="Link to the main DOI web site" href="http://www.doi.gov/" class="url fn org">U.S. Department of the Interior</a>
							<span class="adr">
								<span class="street-address">1849 C Street, N.W.</span><br/>
								<span class="locality">Washington</span>, 
								<span class="region">DC</span>
								<span class="postal-code">20240</span>
							</span>
							<span class="tel">202-208-3100</span>
						</span><!-- vcard -->
         				|
						<span class="vcard">
							<a title="Link to the main USGS web site" href="http://www.usgs.gov" class="url fn org">U.S. Geological Survey</a>
							<span class="adr">
								<span class="post-office-box">Box 25286</span><br/>
								<span class="locality">Denver</span>, 
								<span class="region">CO</span>
								<span class="postal-code">8022</span>
							</span>
						</span><!-- vcard -->
      				</p>
   					<p id="footer-page-url">URL: </p>
					<p id="footer-contact-info">
						  Page Contact Information:
						<a href="mailto:nlbooth@usgs.gov?subject=GW Trends Map Comments" title="Contact Email">webmaster</a>
					</p>
       				<p id="footer-page-modified-info">Page Last modified: <script type="text/javascript">document.write(document.lastModified);</script></p>
				</div><!-- /page-info -->
				<div id="gov-buttons">
					<a href="http://firstgov.gov/" title="link to the official US Government web portal">
						<img alt="FirstGov button" src="http://infotrek.er.usgs.gov/docs/nawqa_www/nawqa_public_template/assets/footer_graphic_firstGov.jpg"/>
					</a>
					<a href="http://www.takepride.gov/" title="Link to Take Pride in America, a volunteer organization that helps to keep America's public lands beautiful.">
						<img alt="Take Pride in America button" src="http://infotrek.er.usgs.gov/docs/nawqa_www/nawqa_public_template/assets/footer_graphic_takePride.jpg"/>
					</a>
				</div><!-- /gov-buttons -->
			</div><!-- /content -->
		</div>
		<!-- // END FOOTER -->
		
	</body>
</html>