package gov.usgs;

public enum RequestType {
	well_log("/wfs?request=GetFeature&typeName=gwml:WaterWell&INFO_FORMAT=text/xml&FID=USGS."),
	water_level("/wfs?request=GetObservation&featureId=USGS-"),
	water_quality("/qw/Result/flat?mimeType=xml&siteid=USGS-");

	public final String prodServerBase = "http://cida.usgs.gov";
	public final String localServerBase = "http://localhost:8280";
	public final String serverBase = prodServerBase;
	public final String mediatorPath = "/cocoon/gin/gwdp/agency/";

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
