package gov.usgs;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class IdentifyDataProxy extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/xml");

		RequestType serviceRequest = RequestType.valueOf(req.getParameter("request"));
		String url = serviceRequest.makeRESTUrl(req.getParameter("agency_cd"), req.getParameter("siteNo"));

		System.out.println("gw_data_portal fetching " + serviceRequest + " data from get url: " + url);

		PrintWriter writer = null;
		try {
			String content = URLUtil.getStringFromURLGET(url).toString();
			//resp.setCharacterEncoding("UTF-8"); seems default setting solves this problem of encoding mismatch
			writer = resp.getWriter();
			writer.write(content);
			writer.flush();

			if (DebugSettings.isTraceSet) System.out.println(":::" + content);
		} catch (Exception e) {
			System.err.println("failed: " + url);
			e.printStackTrace(System.err);
		} finally {
			if (writer != null) writer.close();
		}

		System.out.println("Done: " + url);
	}
}
