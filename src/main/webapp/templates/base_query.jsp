<%
	String queryId = request.getParameter("queryId");
%>
<% if ("map".equals(queryId)) {
	String orgId = request.getParameter("orgId");
	String wellMonitoringType = request.getParameter("wellMonitoringType");
	String ntlAquiferName = request.getParameter("ntlAquiferName");
%>
SELECT 
	GEOM 
FROM 
	GW_DATA_PORTAL.WELL_REGISTRY 
WHERE 
<% if (orgId != null) { %> ORGANIZATION_ID = <%= orgId %> AND <%}%>
<% if (wellMonitoringType != null) { %> WELL_MONITORING_PURPOSE_TYPE = '<%= wellMonitoringType %>' AND <%}%>
<% if (ntlAquiferName != null) { %> NATIONAL_AQUIFER_NAME = '<%= ntlAquiferName %>' AND <%}%>
	1 = 1
<%}%>