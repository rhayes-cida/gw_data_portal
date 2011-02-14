package gov.usgs;

public enum RequestType {
	well_log("/wfs?request=GetFeature&typeName=gwml:WaterWell&INFO_FORMAT=text/xml&featureId="),
	water_level("/sos?request=GetObservation&featureId="),
	water_quality("/qw?mimeType=xml&siteid=");



	public static final String serverBase = DebugSettings.serverBase; // used to switch between local and prod development
	public static final String mediatorPath = "/cocoon/gin/gwdp/agency/";

	protected final String path;
	protected final String serviceQuery;

	private RequestType(String serviceQuery) {
		this.path = mediatorPath;
		this.serviceQuery = serviceQuery;
	}

	public String makeRESTUrl(String agency, String siteId) {
		assert(agency != null && siteId != null);
		return serverBase + path + agency + serviceQuery + siteId;
	}
}
