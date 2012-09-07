<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page contentType="text/html;charset=utf-8"%>
<!DOCTYPE html>
<html>
    <head>
    	<title>National Ground Water Monitoring Network Data Portal (BETA)</title>
		<link rel="icon" 
      		type="image/png" 
      		href="favicon.ico">
    	<link rel="stylesheet" href="scrollable_map/css/scrollable_map.css"/>
  		<link rel="stylesheet" href="ext-3.4.0/resources/css/ext-all.css"/>
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
    
        <script type="text/javascript">
            var FEEDBACK = new function() {
                // PRIVATE FIELDS
                var sessionScopeFeedbackText = '<%= StringUtils.trimToEmpty((String) session.getAttribute("feedback-text")).replace("'", "&quot;")%>' ;
                var captchaValidationUrl = 'securityimage/validatecaptcha/';
                var commentSubmittalUrl = 'service/contact/';
                var serverErrorMessage = '${param["serverErrorMessage"]}';
                var submitButton, emailInput, emailRequired, emailError, commentInput, commentError, captchaInput, captchaError, captchaImage;  
                var defaultComment =  'Please enter your comment here.';
                var captchaFailureMessage = 'Either the text did not match the security image or it has expired. Please try again with a new security image.';
		
                <% session.removeAttribute("feedback-text");%>
                
                    // PUBLIC METHODS
                    this.retrieveSecurityImage = function(){
                        var cacheBreak =  new Date().getMilliseconds();
                        document.getElementById('captchaImageDiv').innerHTML = '<img id="captchaImage" alt="Security Check Image" src="securityimage/getImage/?width=300&height=50&charsToPrint=6&circlesToDraw=30&cacheBreak=' + cacheBreak + '"   />';
                    };
		
                    this.config = function() {
                        submitButton 	= document.getElementById('submit');
                        emailRequired	= document.getElementById('emailResponseRequired');
                        emailInput		= document.getElementById('email');
                        emailError		= document.getElementById('emailError'); 
                        commentInput	= document.getElementById('comment');
                        commentError	= document.getElementById('commentError');
                        captchaInput	= document.getElementById('captcha');
                        captchaError	= document.getElementById('captchaError');
                        captchaImage	= document.getElementById('captchaImage');
			
                        submitButton.disabled 	= true;
                        commentInput.value		= sessionScopeFeedbackText ? sessionScopeFeedbackText :defaultComment;
                        captchaInput.value 		= '';
                        emailInput.value		= '';
                    };
		
                    this.getCaptchaValidationUrl = function(){
                        return captchaValidationUrl;
                    };
                    this.getCommentSubmittalUrl = function(){ 
                        return commentSubmittalUrl;
                    };
		
                    this.closeEmailPanel = function() {
                        new Ext.ux.Notify({
                            msgWidth: 200,
                            hideDelay: 2000,
                            title: 'Notification Window',
                            msg: 'Feedback submitted. Thank you for participating.'
                        }).show(document);
                    };
		
                    // If user pressed the enter key, we do not want the form submitted
                    this.keyPressed = function (key) {
                        if (key == 0) return false;
                    };
		
                    this.commentEntry = function() {
                        var enteredValue 		= commentInput.value;
                        submitButton.disabled 	= (enteredValue != '') ? false : true;
                    };

                    this.commentFocus = function() {
                        var commentValue	= commentInput.value;		
                        commentInput.value	= (commentValue == defaultComment) ? '' : commentValue;
                    };

                    this.commentLostFocus = function() {
                        var commentValue = commentInput.value;	
                        commentInput.value	= (commentValue == '') ? defaultComment : commentValue;
                        if (commentInput.value == defaultComment) { submitButton.disabled = true; }		
                    };


                    this.submitComment = function () {
                        emailError.innerHTML = '';	
                        captchaImage	= document.getElementById('captchaImage');
                        var emailAddress= emailInput.value;
                        var replyReq	= (emailRequired.checked) ? true : false;
                        var filter 		= /^.+@.+\..{2,3}$/;
                        var result 		= true;
                        var verified 	= false;
                        // Check EMail address if anything is entered or needs to be
                        if (replyReq) {
                            if (filter.test(emailAddress)) {
                                emailError.innerHTML = '';	
                            } else if (!filter.test(emailAddress) || emailAddress == '') {
                                emailError.innerHTML = '* Please enter a valid E-Mail address or uncheck the reply required box.';	
                                emailError.style.color = "#FF0000";	
                                result = false;	
                            } 
                        }

                        // Check that a comment is entered
                        if ( commentInput == '') {
                            emailError.innerHTML = '';
                            result = false;		
                            commentError.innerHTML = '* Please enter a comment';	
                            commentError.style.color = "#FF0000";		
                        }

                        if (result) {
                            var conn 	= new Ext.data.Connection();
				
                            conn.on({
                                'requestcomplete' : function (conn, responseObject, options) {
                                    var resp = Ext.util.JSON.decode(responseObject.responseText);
                                    verified = (resp["captcha"] == "true") ? true : false;
                                    if (verified) {
                                        var conn2 	= new Ext.data.Connection();
                                        // make webservice call
                                        captchaError.innerHTML = '';
                                        conn2.request({
                                            url: FEEDBACK.getCommentSubmittalUrl(),
                                            method: 'POST',
                                            params: { "comments" : commentInput.value,
                                                "email" : emailInput.value,
                                                "replyrequired" : replyReq },
                                            success: function(responseObject) {
                                                if (responseObject.responseText.indexOf("success") >= 0){
                                                    commentInput.value = '';
                                                    captchaInput.value = '';
                                                    FEEDBACK.retrieveSecurityImage();
                                                    FEEDBACK.closeEmailPanel();
                                                } else { // failed
                                                    Ext.Msg.alert('Feedback', "Sorry, submission failed. Please retype security text and try again. " + serverErrorMessage);
                                                    FEEDBACK.retrieveSecurityImage();
                                                    return false;
                                                }
                                            },
                                            failure: function(response, opts) {
                                                Ext.Msg.alert('Feedback', captchaFailureMessage);
                                                FEEDBACK.retrieveSecurityImage();
                                                return false;
                                            }
                                        });
                                    } else {
                                        captchaError.innerHTML = '* Security text did not match image or image has expired. Please try again. If you are continually having problems, please email pubs' + 'warehouse' + '@' + 'usg' + 's.gov';
                                        FEEDBACK.retrieveSecurityImage();
                                        return false;
                                    }
                                }
                            });
				
                            conn.request({
                                url: FEEDBACK.getCaptchaValidationUrl(),
                                method: 'GET',
                                autoAbort: true,
                                params: { "userCaptcha" :  captchaInput.value},
                                success: function(responseObject) { 
                                    conn = null;            	
                                },
                                failure: function(a, b) {
                                    Ext.Msg.alert('Feedback', captchaFailureMessage);
                                    FEEDBACK.retrieveSecurityImage();
                                    return false;
                                }
                            });

	            
				
                        } else {
                            return result;
                        }
			
                    }
		
		
                }();
                
                Ext.onReady(FEEDBACK.config);
        </script>
    </head>
    
    
    <body>
        <div id="usgs-header-panel">
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
				<!-- 
					<h4 class="access-help">Top Level USGS Links</h4>
		            <br /><a href="http://www.usgs.gov/" title="Link to main USGS page">USGS Home</a>
		            <br /><a href="http://www.usgs.gov/ask/index.html" title="Link to main USGS contact page">Contact USGS</a>
		            <br /><a href="http://search.usgs.gov/" title="Link to main USGS search (not publications search)">Search USGS</a>
				 -->
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
				National Ground Water Monitoring Network Data Portal (BETA)
			</h2>
		</div> <!--  // END HEADER -->

        </div><!--/header panel-->
        <div>

            <div id="contact-popup">
                <form id="contact-form" action="" method="post" name="commentForm">
                    <table>
                        <tr>
                            <td>
                                <label for="emailResponseRequired">Require response:</label>
                            </td>
                            <td>			
                                <input id="emailResponseRequired" type="checkbox" alt="Response Required Checkbox" name="emailResponseRequired" checked="checked" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="email">E-Mail (optional):</label>
                            </td>
                            <td>			
                                <input id="email" 
                                       onkeypress="FEEDBACK.keyPressed(event.charCode);" 
                                       type="text" 
                                       name="email" 
                                       size="30"/>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>			
                                <span id="emailError"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="comment">Comment:</label>
                            </td>
                            <td>
                                <textarea id="comment"
                                          onkeypress="FEEDBACK.keyPressed(event.charCode);" 
                                          onfocus="FEEDBACK.commentFocus();"
                                          onblur="FEEDBACK.commentLostFocus();"
                                          onkeyup="FEEDBACK.commentEntry();" 
                                          rows="10" 
                                          cols="40" 
                                          name="comment">
                                    Please enter your comment here.
                                </textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>			
                                <span id="commentError"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="captcha">Security Text:</label>
                            </td>
                            <td>
                                <input id="captcha" 
                                       onkeypress="FEEDBACK.keyPressed(event.charCode);"  
                                       type="text" 
                                       name="captcha" 
                                       size="6" 
                                       maxlength="6" />
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>
                                <div id="captchaImageDiv" >
                                    <img id="captchaImage" alt="Security Image" src='securityimage/getImage/?width=300&height=50&charsToPrint=6&circlesToDraw=30' />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>			
                                <span id="captchaError"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input id="submit"
                                       onkeypress="function(key) { if (key.which == 13) FEEDBACK.submitComment(); }"
                                       onclick="FEEDBACK.submitComment();" 
                                       type="button" 
                                       value="Submit" />
                            </td>	   
                            <td>
                                <input id="resetSecurityTextButton"
                                       onclick="FEEDBACK.retrieveSecurityImage();" 
                                       type="button" 
                                       value="Reset Security Image" />
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
        
        
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
						<a href="mailto:gwdp_help@usgs.gov" title="Contact Email">webmaster</a>
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
        
</body>
</html>
