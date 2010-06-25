package gov.usgs;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.jsp.JspWriter;


public class HTMLUtil {

	/*
	  ORGANIZATION_ID
		WELL_MONITORING_PURPOSE_TYPE
		NATIONAL_AQUIFER_NAME
	 */
	
	public static void getOrganizationIdList(JspWriter out, Connection connection) {		
		String sql = "SELECT UNIQUE ORGANIZATION_ID value, ORGANIZATION_ID display FROM GW_DATA_PORTAL.WELL_REGISTRY WHERE STATE_NAME NOT IN ('Unknown','YUKON TERRITORIES','MANITOBA') ORDER BY 1";
		runQuery(sql, out, connection);
	}
	
	public static void getWellMonitoringPurposeTypeList(JspWriter out, Connection connection) {
		String sql = "SELECT UNIQUE WELL_MONITORING_PURPOSE_TYPE Value, WELL_MONITORING_PURPOSE_TYPE Display FROM GW_DATA_PORTAL.WELL_REGISTRY ORDER BY 1";
		runQuery(sql, out, connection);
	}

	public static void getNationalAquiferNameList(JspWriter out, Connection connection) {
		String sql = "SELECT UNIQUE NATIONAL_AQUIFER_NAME Value, NATIONAL_AQUIFER_NAME Display FROM GW_DATA_PORTAL.WELL_REGISTRY ORDER BY 1";
		runQuery(sql, out, connection);
	}
	
	public static void runQuery(String sql, JspWriter out, Connection connection) {
		
		ResultSet rset = null;
		Statement statement = null;
		//run the query
		try {
			statement = connection.createStatement();
			rset = statement.executeQuery(sql);
			while (rset.next()) {
				out.write("<option value=\"" + rset.getString("value") + "\">" + rset.getString("display") + "</option>");
			}
			rset.close();  
			rset = null;
			statement.close();
			statement = null;
		} catch (Exception e) {
			System.out.println("gw data portal map - listbox query data retrieval failed");      
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
		}    
	}
}
