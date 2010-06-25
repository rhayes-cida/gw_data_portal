package gov.usgs;


import java.io.IOException;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class MVServlet extends HttpServlet {

	@Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    resp.setContentType("image/png");   

		String params = req.getQueryString();
  	URL baseUrl = new URL("http",req.getServerName(),req.getServerPort(),req.getContextPath() + "/templates");
  	try {
  		String mapreq = "";
  		
  		if ("/mvwms".equals(req.getServletPath())) {
				//fetch base query
				String query = URLUtil.getStringFromURL(baseUrl.toExternalForm() + "/base_query.jsp;jsessionid=" + req.getSession().getId(), params + "&queryId=map");
//System.out.println(query.replaceAll("%2526lt;", "<").replaceAll("%252B", "+").replaceAll("FROM", "FROM\n"));	
				//fetch xml request
				mapreq =  URLUtil.getStringFromURL(baseUrl.toExternalForm() + "/base_map_request.jsp;jsessionid=" + req.getSession().getId(), params + "&query=" + query + "&requestId=map");      
//System.out.println(mapreq);	
  		} else {
				mapreq =  URLUtil.getStringFromURL(baseUrl.toExternalForm() + "/base_map_request.jsp;jsessionid=" + req.getSession().getId(), params + "&requestId=legend");      
  		}
	
			//POST xml request to mapviewer server and return byte stream (image)
			URLUtil.writeBytesToOutputStream("http://maptrek.er.usgs.gov/mapviewer_dev/omserver", "xml_request=" + mapreq, resp.getOutputStream());
  	} catch (Exception e) {
  		; //nothing
  	}
  }
}
