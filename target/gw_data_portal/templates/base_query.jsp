<%
	String queryId = request.getParameter("queryId");
%>
<% if ("map".equals(queryId)) {
	String orgId = request.getParameter("orgId");
	String wellMonitoringType = request.getParameter("wellMonitoringType");
	String ntlAquiferName = request.getParameter("ntlAquiferName");
	String bbox = request.getParameter("BBOX");
%>
SELECT 
	gp.GEOM GEOM 
FROM 
	GW_DATA_PORTAL.WELL_REGISTRY gp 
WHERE 
<% if (!"".equals(orgId)) { %> ORGANIZATION_ID IN (<%= orgId %>) AND <%}%>
<% if (!"".equals(wellMonitoringType)) { %> WELL_MONITORING_PURPOSE_TYPE IN (<%= wellMonitoringType %>) AND <%}%>
<% if (!"".equals(ntlAquiferName)) { %> NATIONAL_AQUIFER_NAME IN (<%= ntlAquiferName %>) AND <%}%>
    (sdo_filter(
      gp.geom,
      mdsys.sdo_geometry(
        2003,
        8307,
        NULL,
        mdsys.sdo_elem_info_array(1,1003,3),
      mdsys.sdo_ordinate_array(<%=bbox%>)
      )
    ) = 'TRUE') 
<%}%>