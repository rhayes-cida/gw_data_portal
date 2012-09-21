<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page contentType="text/html;charset=utf-8"%>
<!DOCTYPE html>
<html>
    <head>
    	<link rel="stylesheet" href="scrollable_map/css/scrollable_map.css"/>
  		<link rel="stylesheet" href="ext-3.4.0/resources/css/ext-all.css"/>
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>	
    
	    <script src='jquery-1.3.2-old-extend.js'></script>
	    <script src='ext-3.4.0/adapter/jquery/ext-jquery-adapter.js'></script>
		<script src="ext-3.4.0/adapter/ext/ext-base.js"></script>
    	<script src="ext-3.4.0/ext-all-debug.js"></script>
    
        <script type="text/javascript">
            var FEEDBACK = new function() {
                // PRIVATE FIELDS
                var sessionScopeFeedbackText = '<%= StringUtils.trimToEmpty((String) session.getAttribute("feedback-text")).replace("'", "&quot;")%>' ;
                var commentSubmittalUrl = 'feedback/submit';
                var submitButton, emailInput, emailRequired, emailError, commentInput, commentError;  
                var defaultComment =  'Please enter your comment here.';
		
                <% session.removeAttribute("feedback-text");%>
                
                    this.config = function() {
                        submitButton 	= document.getElementById('submit');
                        emailRequired	= document.getElementById('emailResponseRequired');
                        emailInput		= document.getElementById('email');
                        emailError		= document.getElementById('emailError'); 
                        commentInput	= document.getElementById('comment');
                        commentError	= document.getElementById('commentError');
			
                        submitButton.disabled 	= true;
                        commentInput.value		= sessionScopeFeedbackText ? sessionScopeFeedbackText :defaultComment;
                        emailInput.value		= '';
                    };
		
                    this.getCommentSubmittalUrl = function(){ 
                        return commentSubmittalUrl;
                    };
		
                    this.closeEmailPanel = function() {
                        Ext.MessageBox.alert('Feedback Sent', 'Thank you!');
                        // TODO Close feedback panel?
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
                             var conn2 	= new Ext.data.Connection();
                             // make webservice call
                             conn2.request({
                                 url: FEEDBACK.getCommentSubmittalUrl(),
                                 method: 'POST',
                                 params: { "comments" : commentInput.value,
                                     "email" : emailInput.value,
                                     "replyrequired" : replyReq },
                                 success: function(responseObject) {
                                     if (responseObject.responseText.indexOf("success") >= 0){
                                         commentInput.value = '';
                                         commentError.innerHTML = 'Feedback submitted -- thanks';
                                         commentError.style.color = "#000000";		
                                         FEEDBACK.closeEmailPanel();
                                     } else { // failed
                                         Ext.Msg.alert('Feedback', "Sorry, submission failed. Please retype security text and try again. " + serverErrorMessage);
                                         return false;
                                     }
                                 },
                                 failure: function(response, opts) {
                                     Ext.Msg.alert('Feedback', response.statusText);
                                     return false;
                                 }
                             });
                         } else {
                             return false;
                         }
                    	};
				
            }();
	                            
                Ext.onReady(FEEDBACK.config);
        </script>
    </head>
    
    
    <body>
			<div id="banner-area">
	
			<h2 id="site-title">
				National Ground Water Monitoring Network Data Portal (BETA)
			</h2>
        </div><!--/banner-area-->
        <div>

            <div id="contact-popup">
                <form id="contact-form" action="" method="post" name="commentForm">
                    <table>
                        <tr>
                            <td>
                                <label for="emailResponseRequired">Require response:</label>
                            </td>
                            <td>			
                                <input id="emailResponseRequired" type="checkbox"  value="true" alt="Response Required Checkbox" name="emailResponseRequired" checked="checked" />
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
                            <td>&nbsp;</td>  
                            <td>
                                <input id="submit"
                                       onkeypress="function(key) { if (key.which == 13) FEEDBACK.submitComment(); }"
                                       onclick="FEEDBACK.submitComment();" 
                                       type="button" 
                                       value="Submit" />
                            </td>	 
                        </tr>
                    </table>
                </form>
            </div>
        </div>
        
                
</body>
</html>
