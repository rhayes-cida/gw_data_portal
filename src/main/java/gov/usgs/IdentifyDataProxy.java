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
		
		String requestType = req.getParameter("request");
		String url = "";
		String wlMediator = req.getParameter("mediator");
		if (wlMediator == null || "".equals(wlMediator)) wlMediator = "usgs";
		
		if ("well_log".equals(requestType)) {
			url = "http://cida.usgs.gov/cocoon/gin/wfs/gw_"+wlMediator+"?request=GetFeature&FID=USGS." + 
						req.getParameter("siteNo") + 
						"&typeName=gwml:WaterWell&INFO_FORMAT=text/xml";
		} else if ("water_level".equals(requestType)) {
			if ("ISWS".equals(wlMediator)) {
				url = "http://cida.usgs.gov/cocoon/gin/sos/gw_"+wlMediator+"?request=GetObservation&featureId=USGS-" +
					req.getParameter("siteNo"); 
			} else {
				url = "http://infotrek.er.usgs.gov/ogc-ie/sosbbox?request=GetObservation&featureId=USGS-" + 
					req.getParameter("siteNo");
			}
		} else if ("water_quality".equals(requestType)) {
			url = "http://cida.usgs.gov/cocoon/gin/proxy/qw/Result/flat?siteid=USGS-" + 
						req.getParameter("siteNo") + 
						"&mimeType=xml";
		}
		
		System.out.println("gw_data_portal fetching data from url: " + url);
		
		try {
			resp.getOutputStream().print(
					URLUtil.getStringFromURLGET(url)      
			);
		} catch (Exception e) {
		
		}
  }
}
