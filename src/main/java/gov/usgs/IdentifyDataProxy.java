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
		
		
		/*
		 * 
		 
		  http://infotrek.er.usgs.gov/ogc-ie/wfs?request=GetFeature&featureId=USGS.425856089320601&typeName=gwml:WaterWell
			http://infotrek.er.usgs.gov/ogc-ie/sosbbox?request=GetObservation&featureId=USGS.425856089320601
			http://qwwebservices.usgs.gov/Result/search?siteid=USGS-394642074375401&mimeType=xml
		 
		 * 
		 */
		
		
		if ("well_log".equals(requestType)) {
			url = "http://infotrek.er.usgs.gov/ogc-ie/wfs?request=GetFeature&featureId=USGS." + 
						req.getParameter("siteNo") + 
						"&typeName=gwml:WaterWell";
		} else if ("water_level".equals(requestType)) {
			url = "http://infotrek.er.usgs.gov/ogc-ie/sosbbox?request=GetObservation&featureId=USGS." +
						req.getParameter("siteNo"); 
		} else if ("water_quality".equals(requestType)) {
			url = "http://qwwebservices.usgs.gov/Result/search?siteid=USGS-" + 
						req.getParameter("siteNo") + 
						"&mimeType=html";
		}
		
		//System.out.println("gw_data_portal fetching data from url: " + url);
		
		try {
			resp.getOutputStream().print(
					URLUtil.getStringFromURLGET(url)      
			);
		} catch (Exception e) {
		
		}
  }
}
