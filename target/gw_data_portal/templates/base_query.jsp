<%
	String queryId = request.getParameter("queryId");
	String agency = request.getParameter("agency");
	String qwWellType = request.getParameter("qwWellType");
	String wlWellType = request.getParameter("wlWellType");
	String ntlAquiferName = request.getParameter("ntlAquiferName");
%>
<% if ("map".equals(queryId)) {
	String bbox = request.getParameter("BBOX");
%>
SELECT 
	gp.geom_3785 GEOM 
FROM 
	nwis_dwh_star.well_registry gp 
WHERE 
<% if (!"".equals(agency)) { %> agency_cd IN (<%= agency %>) AND <%}%>
<% if (!"".equals(qwWellType)) { %> qw_well_type IN (<%= qwWellType %>) AND <%}%>
<% if (!"".equals(wlWellType)) { %> wl_well_type IN (<%= wlWellType %>) AND <%}%>
<% if (!"".equals(ntlAquiferName)) { %> nat_aqfr_desc IN (<%= ntlAquiferName %>) AND <%}%>
   	(sdo_filter(
      gp.geom_3785,
      mdsys.sdo_geometry(
        2003,
        3785,
        NULL,
        mdsys.sdo_elem_info_array(1,1003,3),
      mdsys.sdo_ordinate_array(<%=bbox%>)
      )
    ) = 'TRUE') 
<%} else if ("bbox".equals(queryId)) { %>
SELECT 
	min(gp.dec_long_va) || ',' || min(gp.dec_lat_va) ||','|| max(gp.dec_long_va) ||','||  max(gp.dec_lat_va) bbox,
	count(*) num_points  
FROM 
	nwis_dwh_star.well_registry gp 
WHERE 
<% if (!"".equals(agency)) { %> agency_cd IN (<%= agency %>) AND <%}%>
<% if (!"".equals(qwWellType)) { %> qw_well_type IN (<%= qwWellType %>) AND <%}%>
<% if (!"".equals(wlWellType)) { %> wl_well_type IN (<%= wlWellType %>) AND <%}%>
<% if (!"".equals(ntlAquiferName)) { %> nat_aqfr_desc IN (<%= ntlAquiferName %>) AND <%}%>
1=1
<%} else if ("identify".equals(queryId)) {
	String idBBox = request.getParameter("idBBox");
%>
SELECT 
	SITE_NO, 
	SITE_NAME, 
	DEC_LAT_VA, 
	DEC_LONG_VA,
	QW_WELL_TYPE,
	WL_WELL_TYPE,
	NAT_AQFR_DESC,
	AGENCY_CD  
FROM 
	nwis_dwh_star.WELL_REGISTRY gp 
WHERE 
<% if (!"".equals(agency)) { %> agency_cd IN (<%= agency %>) AND <%}%>
<% if (!"".equals(qwWellType)) { %> qw_well_type IN (<%= qwWellType %>) AND <%}%>
<% if (!"".equals(wlWellType)) { %> wl_well_type IN (<%= wlWellType %>) AND <%}%>
<% if (!"".equals(ntlAquiferName)) { %> nat_aqfr_desc IN (<%= ntlAquiferName %>) AND <%}%>
	(sdo_filter(
      gp.geom,
      mdsys.sdo_geometry(
        2003,
        8307,
        NULL,
        mdsys.sdo_elem_info_array(1,1003,3),
      mdsys.sdo_ordinate_array(<%=idBBox%>)
      )
    ) = 'TRUE') 
<%}%>