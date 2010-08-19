<%@ page import="gov.usgs.HTMLUtil,
				javax.naming.Context,
				javax.naming.InitialContext,
				javax.sql.DataSource,
				java.sql.SQLException,
				java.sql.Connection"%>

<html>
	<head>
		<title>United States Groundwater Data Portal Log In</title>
	
		<!--  extjs assets -->
		<script src="ext_js/adapter/ext/ext-base.js"></script>
		<script src="ext_js/ext-all.js"></script>
		<script type="text/javascript" src="assets/js/js_custom/custom.js"></script>
		<link rel="stylesheet" href="ext_js/resources/css/ext-all.css"/>
		
		<!-- application assets -->		
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
		<script type="text/javascript">
			Ext.onReady(function() {
				new Ext.Viewport({
					renderTo: document.body,
					layout: 'border',
					border: false,
					defaults: {border: false},
					items: [{
						region: 'north',
						contentEl: 'header'
					},{
						region: 'south',
						contentEl: 'footer'
					},{
						region: 'center',
						contentEl: 'wrapper'
					}]
				});
			});
		
			
		</script>

	
	</head>
	
	<body>
		<div id="header" class="x-hidden">
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
					<h4 class="access-help">Top Level USGS Links</h4>
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
				United States Groundwater Data Portal Log In
			</h2>
		</div> <!--  // END HEADER -->
		
		
		
		<div id="wrapper" style="width:100%" align="center" class="x-hidden">
			<div id="content" style="background-color: transparent">
			
			<form method="post" action=j_security_check>
				<h2>Please enter your name and password.  To cancel, close this window.</h3><br/>
				<table>
					<tr>
						<td>
							<p>Name:</p>
						</td>
						<td style="text-align: right">
							<p><input type="text" name="j_username" value="" /></p>
						</td>
					</tr>
					<tr>
						<td>
							<p>Password:</p>
						</td>
						<td style="text-align: right">
							<p><input type="password" name="j_password" value="" /></p>
						</td>
					</tr>
					<tr>
						<td colspan="2" style="text-align: center">
							<br/>
							<p><input type="submit" value="OK" style="width: 10em" /></p>
						</td>
					</tr>
				</table>
			</form>
			
			</div>
		</div>
		
		
		<!-- // START FOOTER -->
		<div style="width: 100%; margin-right: -1em;" id="footer" class="x-hidden">
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