package gov.usgs;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static gov.usgs.HTTPParameters.ExtParam.*;


public class IdentifyDataProxy extends HttpServlet {
	
	private static Logger logger = LoggerFactory.getLogger(IdentifyDataProxy.class);

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/xml");

		RequestType serviceRequest = RequestType.valueOf(req.getParameter("request"));
		String url = serviceRequest.makeCacheRESTUrl(AGENCY_CODE.parse(req), SITE_NO.parse(req));

		logger.info("gw_data_portal fetching {} data from get url: {}", serviceRequest, url);

		PrintWriter writer = null;
		try {
			String content = URLUtil.getStringFromURLGET(url).toString();
			//resp.setCharacterEncoding("UTF-8"); seems default setting solves this problem of encoding mismatch
			writer = resp.getWriter();
			writer.write(content);
			writer.flush();

			logger.trace("got {}",content);
		} catch (Exception e) {
			logger.error("failed " + url, e);
		} finally {
			if (writer != null) writer.close();
		}

		logger.info("Done get for {}",url);
	}
}
