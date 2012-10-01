package gov.usgs;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Servlet implementation class ContactService
 */
public class ContactService extends HttpServlet {
	
	private RemedySender sender;

	public static class FeedbackRequest {
		private String comments;
		private String email;
		private boolean emailResponseRequired;

		public FeedbackRequest(HttpServletRequest req) {
			comments = req.getParameter("comments");
			email = req.getParameter("email");
			String rrq = req.getParameter("replyrequired");
			emailResponseRequired = Boolean.parseBoolean(rrq);
		}

		public String getEmail() {
			return email;
		}

		public boolean getEmailResponseRequired() {
			return emailResponseRequired;
		}

		public String getComments() {
			return comments;
		}

	}

	private static final long serialVersionUID = 1L;
       
    public ContactService() {
        super();
    }

	private final static Logger logger = LoggerFactory.getLogger(ContactService.class);

	private WebApplicationContext ctx;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		ctx = WebApplicationContextUtils.getWebApplicationContext(config.getServletContext());
		sender = ctx.getBean("remedySender", RemedySender.class);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
	throws ServletException, IOException {
		String remoteAddr = req.getRemoteAddr();
		String email = req.getParameter("email");
		String emailResponseRequired = req.getParameter("replyrequired");

		logger.debug("Request Email: {}, ResponseRequired: {}", email, emailResponseRequired);
		logger.info("From: {} email: {}", remoteAddr, email);
		
		FeedbackRequest cue = new FeedbackRequest(req);
		sender.emailPubs(cue);
		
		PrintWriter writer = resp.getWriter();
		try {
			writer.append("<status>success</status>");
			writer.flush();
		} finally {
			if (writer != null ) writer.flush();
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
	throws ServletException, IOException {
		doGet(req, resp);
	}

}
