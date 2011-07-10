<%@ page import="gov.usgs.HTMLUtil,
				javax.naming.Context,
				javax.naming.InitialContext,
				javax.sql.DataSource,
				java.sql.SQLException,
				java.sql.Connection"%>

<html>
	<head>
		<title>National Ground Water Monitoring Network Portal</title>

		<!-- scrollable map assets -->
		<script type="text/javascript" src="scrollable_map/JMap-header.js"></script>
		<script type="text/javascript" src="scrollable_map/JMap-base.js"></script>
		<script type="text/javascript" src="scrollable_map/JMap-all.js"></script>
		<link rel="stylesheet" href="scrollable_map/css/scrollable_map.css"/>
	
		<!--  extjs assets -->
		<!--[if IE]><script language="javascript" type="text/javascript" src="ext_flot/excanvas.r60.js"></script><![endif]-->
	    <script language="javascript" type='text/javascript' src='ext_flot/jquery-1.3.2-old-extend.js'></script>
	    <script language="javascript" type='text/javascript' src='ext_js/adapter/jquery/ext-jquery-adapter.js'></script>
		<script src="ext_js/adapter/ext/ext-base.js"></script>
		<script src="ext_js/ext-all-debug.js"></script>
		<script src="ext_js/examples/ux/BufferView.js"></script>
		<link rel="stylesheet" href="ext_js/resources/css/ext-all.css"/>
		
		<!-- application assets -->
		<script type="text/javascript" src="assets/js/Mediator.js"></script>
		<script type="text/javascript" src="assets/js/ui.js"></script>
		<script type="text/javascript" src="assets/js/SiteIdSelectorPopup.js"></script>
		<script type="text/javascript" src="assets/js/DocNavHelper.js"></script>
		<script type="text/javascript" src="assets/js/SiteIdentifyWindow.js"></script>
		<script type="text/javascript" src="assets/js/BaseLayersWindow.js"></script>
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	

		<!-- more flot assets -->
	    <script language="javascript" type="text/javascript" src="ext_flot/jquery.flot.0.6.js"></script>
	
	    <link rel='stylesheet' type='text/css' href='ext_flot/Flot.css' />
	    <script language="javascript" type="text/javascript" src="ext_flot/Csv.js"></script>
	    <script language="javascript" type="text/javascript" src="ext_flot/GetText.js"></script>
	
	    <script language="javascript" type="text/javascript" src="ext_flot/Flot.ja.js"></script>
	    <script language="javascript" type="text/javascript" src="ext_flot/Flot.pack.js"></script>
	    <script language="javascript" type="text/javascript" src="ext_flot/jquery.flot.axislabels.js"></script>
	
	
	</head>
	
	<body>
		<div id="placeholder"></div>
		<div id="header">
			<div id="banner-area">
			     
				<h1>US Geological Survey</h1><!-- Not actually visible unless printed -->
				<div id="usgs-header-logo">
					<a title="Link to the ACWI main web page" href="http://acwi.gov/">
						<img src="assets/images/acwi_logo.png" alt="ACWI Logo" height="72"/>
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
				National Ground Water Monitoring Network Portal
			</h2>
		</div> <!--  // END HEADER -->
		
		
		
		<div id="wrapper" style="width:100%" align="center">
			<div id="content"></div>
		</div>
		
		<!-- render map to this div -->
		<div id="map-area" class="x-hidden">
			<div id="map-tools" class="map-tools"></div>
			<div id="legend-div"></div>
		</div>
		
		
		
<%
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
			e.printStackTrace();
%>
			<jsp:text><![CDATA[
			<div id="agency-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="agency" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All Organization IDs</option>
				<option title="Illinois Environmental Protection Agency"value="IL EPA">IL Envtl Protection Agency</option><option title="Indiana Department of Natural Resources"value="IN DNR">IN Dept. of Natural Resources</option><option title="Illinois State Water Survey"value="ISWS">IL State Water Survey</option><option title="Montana Bureau of Mines and Geology"value="MBMG">MT Bureau of Mines and Geology</option><option title="Minnesota Department of Natural Resources"value="MN DNR">MN Dept. of Natural Resources</option><option title="Minnesota Pollution Control Agency"value="MPCA">MN Pollution Control Agency</option><option title="Texas Water Development Board"value="TWDB">TX Water Development Board</option><option title="United States Geological Survey New Jersey / New Jersey Geological Survey"value="USGS NJ / NJGS">US Geo Survey NJ / NJ Geo Survey</option>
			</select>
		</div>

		<div id="qw-well-type-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="qw-well-type" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All Water Quality Sub Networks</option>
				<option title="Surveillance - Targeted"value="Surveillance - Targeted">Surveillance - Targeted</option><option title="Surveillance - Unstressed"value="Surveillance - Unstressed">Surveillance - Unstressed</option><option title="Trend - Targeted"value="Trend - Targeted">Trend - Targeted</option><option title="Trend - Unknown"value="Trend - Unknown">Trend - Unknown</option><option title="Trend - Unstressed"value="Trend - Unstressed">Trend - Unstressed</option>
			</select>
		</div>
		<div id="wl-well-type-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="wl-well-type" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All Water Level Sub Networks</option>
				<option title="Surveillance - Targeted"value="Surveillance - Targeted">Surveillance - Targeted</option><option title="Surveillance - Unstressed"value="Surveillance - Unstressed">Surveillance - Unstressed</option><option title="Trend - Targeted"value="Trend - Targeted">Trend - Targeted</option><option title="Trend - Unstressed"value="Trend - Unstressed">Trend - Unstressed</option>
			</select>
		</div>
		<div id="ntlAquifer-div" class="x-hidden">
			<p class="caption">ctrl + click to select more than one</p>
			<select id="ntlAquifer" multiple="multiple" size="5" style="width: 100%">
				<option value="" selected="selected">All National Aquifers</option>
				<option title="Alluvial aquifers"value="Alluvial aquifers">Alluvial aquifers</option><option title="Cambrian-Ordovician aquifer system"value="Cambrian-Ordovician aquifer system">Cambrian-Ordovician aquifer system</option><option title="Coastal lowlands aquifer system"value="Coastal lowlands aquifer system">Coastal lowlands aquifer system</option><option title="Early Mesozoic basin aquifers"value="Early Mesozoic basin aquifers">Early Mesozoic basin aquifers</option><option title="Edwards-Trinity aquifer system"value="Edwards-Trinity aquifer system">Edwards-Trinity aquifer system</option><option title="Lower Tertiary aquifers"value="Lower Tertiary aquifers">Lower Tertiary aquifers</option><option title="Northern Atlantic Coastal Plain aquifer system"value="Northern Atlantic Coastal Plain aquifer system">Northern Atlantic Coastal Plain aquifer system</option><option title="Northern Rocky Mountains Intermontane Basins aquifer systems"value="Northern Rocky Mountains Intermontane Basins aquifer systems">Northern Rocky Mountains Intermontane Basins aquifer systems</option><option title="Paleozoic aquifers"value="Paleozoic aquifers">Paleozoic aquifers</option><option title="Pecos River Basin alluvial aquifer"value="Pecos River Basin alluvial aquifer">Pecos River Basin alluvial aquifer</option><option title="Piedmont and Blue Ridge crystalline-rock aquifers"value="Piedmont and Blue Ridge crystalline-rock aquifers">Piedmont and Blue Ridge crystalline-rock aquifers</option><option title="Rio Grande aquifer system"value="Rio Grande aquifer system">Rio Grande aquifer system</option><option title="Sand and gravel aquifers (glaciated regions)"value="Sand and gravel aquifers (glaciated regions)">Sand and gravel aquifers (glaciated regions)</option><option title="Seymour aquifer"value="Seymour aquifer">Seymour aquifer</option><option title="Texas coastal uplands aquifer system"value="Texas coastal uplands aquifer system">Texas coastal uplands aquifer system</option><option title="Upper Cretaceous aquifers"value="Upper Cretaceous aquifers">Upper Cretaceous aquifers</option><option title="Valley and Ridge aquifers"value="Valley and Ridge aquifers">Valley and Ridge aquifers</option>
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
   					<p id="footer-page-url">URL: http://cida.usgs.gov/gw_data_portal/</p>
					<p id="footer-contact-info">
						  Page Contact Information:
						<a href="mailto:nlbooth@usgs.gov?subject=GW Data Portal" title="Contact Email">webmaster</a>
					</p>
       				<p id="footer-page-modified-info">Page Last modified: <script type="text/javascript">document.write(document.lastModified);</script></p>
				</div><!-- /page-info -->
				<div id="gov-buttons">
					<a href="http://cida.usgs.gov/" title="link to the official CIDA web portal">
						<img alt="CIDA button" src="assets/images/logos/cida_logo.jpg" width="100"/>
					</a>
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
		
		<form id="exportForm" style="display:none" method="GET" action="export">
			<input type="hidden" name="siteNo"/>
			<input type="hidden" name="agency_cd"/>
			<input type="hidden" name="wlSnFlag"/>
			<input type="hidden" name="qwSnFlag"/>
			<input type="hidden" name="token"/>
		</form>
		
	</body>
</html>