package gov.usgs;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ExportServlet extends HttpServlet {

	@Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	 	
		String downloadToken = req.getParameter("token");
		String siteNo = req.getParameter("siteNo");
		String agencyCd = req.getParameter("agency_cd");
		String wlSnFlag = req.getParameter("wlSnFlag");
		String qwSnFlag = req.getParameter("qwSnFlag");
		
  	resp.setContentType("application/zip");
    resp.setHeader("Content-Disposition", "attachment; filename=gwdp_" + agencyCd + "_" + siteNo + ".zip");
    resp.addCookie(new Cookie("exportToken", downloadToken));
    
    
    ServletOutputStream os = resp.getOutputStream();
    
		ZipOutputStream zos = new ZipOutputStream(os);

		//fetch files
		// Get response data.
		RequestType serviceRequest = RequestType.well_log;
		String urlString = serviceRequest.makeRESTUrl(agencyCd, siteNo);
		zos.putNextEntry(new ZipEntry("well_log.xml"));
		zipUrlContents(urlString, zos);
    zos.flush();

    if ("Yes".equals(wlSnFlag)) {
  		serviceRequest = RequestType.water_level;
  		urlString = serviceRequest.makeRESTUrl(agencyCd, siteNo);
  		zos.putNextEntry(new ZipEntry("water_level.xml"));
  		zipUrlContents(urlString, zos);
      zos.flush();
    }
    
    if ("Yes".equals(qwSnFlag)) {
  		serviceRequest = RequestType.water_quality;
  		urlString = serviceRequest.makeRESTUrl(agencyCd, siteNo);
  		zos.putNextEntry(new ZipEntry("water_quality.xml"));
  		zipUrlContents(urlString, zos);
      zos.flush();
    }    
		
    zos.close();
    os.flush();
 	
  }
	
	private void zipUrlContents(String urlString, ZipOutputStream zos) {

		DataInputStream input = null;
		StringBuffer page = new StringBuffer();
		
		try {
			

			URL url = new URL(urlString);
			URLConnection conn = url.openConnection();
			input = new DataInputStream(conn.getInputStream());
			BufferedReader br = new BufferedReader(new InputStreamReader(input));

			String str = "";
			while (null != ((str = br.readLine()))) {
				zos.write(str.getBytes());
			}

			br.close();
		} catch (Exception e) {
			e.printStackTrace();
		} 
	}

}
