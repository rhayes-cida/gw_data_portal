package gov.usgs;

import java.util.Properties;

import javax.naming.NamingException;

import gov.usgs.cida.config.DynamicReadOnlyProperties;

public class DebugSettings {
	public static volatile boolean isTraceSet = true;
	private static final Properties props = initProps();
	
	/**
	 * Usually, choice of http://cida.usgs.gov and http://localhost:8090. It has to be
	 * publicly visible to the js front end
	 */
	public static final String MAPPING_SERVER = props.getProperty("java:/comp/env/GWDP_Portal/mappingServer");
	public static final String SERVER_BASE = props.getProperty("java:/comp/env/GWDP_Portal/baseServer");	

	private static DynamicReadOnlyProperties initProps() {
		try {
			return new DynamicReadOnlyProperties().addJNDIContexts((String[]) null);
		} catch (NamingException e) {
			e.printStackTrace();
		}
		return null;
	}

}
