package gov.usgs;

import java.util.Properties;

import javax.naming.NamingException;

import gov.usgs.cida.config.DynamicReadOnlyProperties;

public class DebugSettings {
	public static volatile boolean isTraceSet = true;
	private static Properties props = initProps();
	public static String base = props.getProperty("java:/comp/env/GWDP_Portal/baseServer");
	public static String mvBase = props.getProperty("java:/comp/env/GWDP_Portal/mappingServer");
	
	public static String tBase = props.getProperty("GWDP_Portal/baseServer");
	public static String tmvBase = props.getProperty("GWDP_Portal/mappingServer");

	public static final String prodServerBase = "http://cida.usgs.gov";
	public static final String localServerBase = "http://localhost:8090";
	public static final String serverBase = base;

	private static DynamicReadOnlyProperties initProps() {
		try {
			return new DynamicReadOnlyProperties().addJNDIContexts((String[]) null);
		} catch (NamingException e) {
			e.printStackTrace();
		}
		return null;
	}

}
