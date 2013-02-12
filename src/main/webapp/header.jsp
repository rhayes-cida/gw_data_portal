<%
	String pageTitle = request.getParameter("pageTitle") == null ? "" : request.getParameter("pageTitle"); 
%>
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
			<%=pageTitle%>
			</h2>
		</div> <!--  // END HEADER -->