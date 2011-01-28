package gov.usgs;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class IdentifyDataProxy extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/xml");

		RequestType serviceRequest = RequestType.valueOf(req.getParameter("request"));
		String url = serviceRequest.makeRESTUrl(req.getParameter("agency_cd"), req.getParameter("siteNo"));

		System.out.println("gw_data_portal fetching " + serviceRequest + " data from get url: " + url);

		try {
			String content = URLUtil.getStringFromURLGET(url).toString();
			resp.getOutputStream().print(content);
			//if (DebugSettings.isTraceSet) 
			System.out.println(":::" + content);
		} catch (Exception e) {

		}

		System.out.println("Done: " + url);
	}
}
