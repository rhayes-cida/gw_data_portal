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

	public static final String GWP_DATASOURCE = "java:comp/env/jdbc/gwDataPortalUserDS";

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
			String query = URLUtil.getResponseAsStringFromURL(baseUrl.toExternalForm() + "/base_query.jsp;jsessionid=" + req.getSession().getId(), params + "&queryId=identify");
			System.out.println("NGWMN: " + query);
			
			log("query: " + query);
			
			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup(GWP_DATASOURCE);
			connection = ds.getConnection();
			statement = connection.createStatement();
			
			int ct = 0;

			rset = statement.executeQuery(query);
			//System.out.println(query);
			while (rset.next()) {	  

				String siteName = rset.getString("SITE_NAME");
				String siteNo = rset.getString("SITE_NO");
				String agencyCd = rset.getString("AGENCY_CD");
				if (siteName == null || siteName.isEmpty() || "null".equalsIgnoreCase(siteName)) {
					siteName = agencyCd + "-" + siteNo;
				}
				String jsonObj = "{" + 
				"siteNo: '" + siteNo + "'" + 
				", siteName: '" + siteName + "'" + 
				", decLatVa: '" + rset.getString("DEC_LAT_VA") + "'" + 
				", decLongVa: '" + rset.getString("DEC_LONG_VA") + "'" + 
				", qwWellType: '" + rset.getString("QW_WELL_TYPE") + "'" + 
				", wlWellType: '" + rset.getString("WL_WELL_TYPE") + "'" + 
				", localAquiferName: '" + rset.getString("local_aquifer_name") + "'" +
				", nationalAquiferName: '" + rset.getString("NAT_AQFR_DESC") + "'" + 
				", agency: '" + agencyCd + "'" +
				", agencyName: '" + rset.getString("AGENCY_NM") + "'" +
				", qwSnFlag: '" + rset.getString("QW_SN_FLAG") + "'" +
				", wlSnFlag: '" + rset.getString("WL_SN_FLAG") + "'" +
				", logDataFlag: '" + rset.getString("LOG_DATA_FLAG") + "'" +
				", wlDataFlag: '" + rset.getString("WL_DATA_FLAG") + "'" +
				", qwDataFlag: '" + rset.getString("QW_DATA_FLAG") + "'" +
				", wellDepth: '" + rset.getString("WELL_DEPTH") + "'" + 
				//", wellDepth: '" + rset.getString("well_depth_va") + "'" +
				", logo: '" + rset.getString("LOGO") + "'" +
				", link: '" + rset.getString("LINK") + "'" +
				", linkDesc: '" + rset.getString("LINKDESC") + "'" +
				"},";

				siteJsonOut.append(jsonObj);
				ct++;

			}

			log("count of sites found: " + ct);
			statement.close();
			statement = null;
			rset.close();  
			rset = null;
			connection.close();  
			connection = null;
		} catch (Exception e) {
			log("problem in " + this.getClass().getSimpleName(), e);
			System.out.println("gw data portal map - identify servlet - query data retrieved failed");   
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
