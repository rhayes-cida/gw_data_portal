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
	
	public static void getAgencyList(JspWriter out, Connection connection) {		
		String sql = "SELECT UNIQUE AGENCY_CD value, AGENCY_CD display FROM NWIS_DWH_STAR.WELL_REGISTRY ORDER BY 1";
		runQuery(sql, out, connection);
	}
	
	public static void getQWWellTypeList(JspWriter out, Connection connection) {
		String sql = "SELECT UNIQUE QW_WELL_TYPE_US_FLAG Value, QW_WELL_TYPE_US_FLAG Display FROM NWIS_DWH_STAR.WELL_REGISTRY WHERE qw_well_type_us_flag <> 'None' ORDER BY 1";
		runQuery(sql, out, connection);
	}
	
	public static void getWLWellTypeList(JspWriter out, Connection connection) {
		String sql = "SELECT UNIQUE WL_WELL_TYPE_US_FLAG Value, WL_WELL_TYPE_US_FLAG Display FROM NWIS_DWH_STAR.WELL_REGISTRY WHERE wl_well_type_us_flag <> 'None' ORDER BY 1";
		runQuery(sql, out, connection);
	}

	public static void getNationalAquiferNameList(JspWriter out, Connection connection) {
		String sql = "SELECT UNIQUE nat_aqfr_desc Value, nat_aqfr_desc Display FROM NWIS_DWH_STAR.WELL_REGISTRY WHERE nat_aqfr_desc is not null ORDER BY 1";
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
