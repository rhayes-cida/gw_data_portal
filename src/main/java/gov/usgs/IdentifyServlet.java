package gov.usgs;

import java.io.IOException;
import java.net.URL;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;


public class IdentifyServlet extends HttpServlet {

	@Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	  resp.setContentType("text/json");

	  ServletOutputStream os = resp.getOutputStream();
	  StringBuffer siteJsonOut = new StringBuffer(" ");
		String params = req.getQueryString();
		

  	URL baseUrl = new URL("http",req.getServerName(),req.getServerPort(),req.getContextPath() + "/templates");
		
  	Statement statement = null;
		ResultSet rset = null;
		Connection connection = null; 	
		
  	try {  		
			//fetch base query
			String query = URLUtil.getStringFromURL(baseUrl.toExternalForm() + "/base_query.jsp;jsessionid=" + req.getSession().getId(), params + "&queryId=identify");

			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/gwDataPortalUserDS");
			connection = ds.getConnection();
			statement = connection.createStatement();

			rset = statement.executeQuery(query);
			while (rset.next()) {	  
				

				String jsonObj = "{" + 
				"gwuId: '" + rset.getString("GWUID") + "'" + 
				", locId: '" + rset.getString("LOC_ID") + "'" + 
				", LATWGS84: '" + rset.getString("LATWGS84") + "'" + 
				", LONGWGS84: '" + rset.getString("LONGWGS84") + "'" + 
				", wellMonitoringPurposeType: '" + rset.getString("WELL_MONITORING_PURPOSE_TYPE") + "'" + 
				", nationalAquiferName: '" + rset.getString("NATIONAL_AQUIFER_NAME") + "'" + 
				", organizationId: '" + rset.getString("ORGANIZATION_ID") + "'" +
				"},";
				
				siteJsonOut.append(jsonObj);

			}
	
			statement.close();
			statement = null;
			rset.close();  
			rset = null;
			connection.close();  
			connection = null;
		} catch (Exception e) {
			System.out.println("gw data portal map - identify servlet - query data retrieved failed");   
			e.printStackTrace();
		} finally {
	    if (rset != null) {
	      try { rset.close(); } catch (SQLException e1) { ; }
	      rset = null;
	    }
	    if (statement != null) {
	      try { statement.close(); } catch (SQLException e2) { ; }
	      statement = null;
	    }
	    if (connection != null) {
	      try { connection.close(); } catch (SQLException e3) { ; }
	      connection = null;
	    }
		}
	    
    os.print("{sites:[" + siteJsonOut.substring(0,siteJsonOut.length()-1) + "]}");
		os.flush();
  }

}
