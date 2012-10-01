package gov.usgs;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class RemedySender {
	private final static Logger logger = LoggerFactory.getLogger(RemedySender.class);

	public JavaMailSender mailSender;
	public SimpleMailMessage templateMessage;

	public RemedySender() {
	}
	
	private static final String USGS_REMEDY = "servicedesk@usgs.gov";

	private static final String NO_REPLY_NAME = "NGWMN Help";
	private static final String NO_REPLY_ADDRESS = "gwdp_help@usgs.gov";

	public static final InternetAddress DEFAULT_REPLY_TO_ADDRESS = makeDefaultReplyToAddress();
	public static final InternetAddress[] DEFAULT_SENDTO_ADDRESSES = makeDefaultSendToAddress();
	public static final InternetAddress[] SENDTO_ADDRESS = DEFAULT_SENDTO_ADDRESSES;

	private static InternetAddress[] makeDefaultSendToAddress() {
		try {
			return new InternetAddress[] {new InternetAddress(USGS_REMEDY)};
		} catch (AddressException e) {
			e.printStackTrace();
		}
		return null;
	}

	private static InternetAddress makeDefaultReplyToAddress() {
		try {
			return new InternetAddress(NO_REPLY_ADDRESS, NO_REPLY_NAME);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}

	public void emailPubs(ContactService.FeedbackRequest cue) {

		boolean hasEmail = cue.getEmail() != null && !"".equals(cue.getEmail());
		String userEmail = (hasEmail)? cue.getEmail() : "" ;

		try {
			// FROM ADDRESS:
			InternetAddress addressFrom = (hasEmail)? new InternetAddress(userEmail): DEFAULT_REPLY_TO_ADDRESS;

	        SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
	        if (hasEmail) {
	        	msg.setReplyTo(userEmail);
	        }
			
			StringBuilder sb = new StringBuilder();
			if (hasEmail) {
				sb.append("A NGWMN user with email address ").append(userEmail).append(" sends some feedback.\n");
			} else {
				sb.append("A NGWMN user who does not care to provide their email address sends this feedback.\n");
			}
			if (cue.getEmailResponseRequired()) {
				sb.append("A response is requested, to email: ").append(userEmail).append("\n");
			}
			sb.append("\n\n");
			sb.append("Comment:\n");
			sb.append(cue.getComments());
			msg.setText(sb.toString());
			
			mailSender.send(msg);
				
			logger.info("Email sent to Remedy");
		} catch (MessagingException e) {
			logger.error("Error emailing Remedy.", e);
		}
	}
	
	public void setMailSender(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	public void setTemplateMessage(SimpleMailMessage templateMessage) {
		this.templateMessage = templateMessage;
	}

}