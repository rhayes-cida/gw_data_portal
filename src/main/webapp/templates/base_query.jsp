<%
	String queryId = request.getParameter("queryId");
	String agency = request.getParameter("agency");
	String qwSnFlag = request.getParameter("qwSnFlag");
	String qwWellType = request.getParameter("qwWellType");
	String wlSnFlag = request.getParameter("wlSnFlag");
	String wlWellType = request.getParameter("wlWellType");
	String ntlAquiferName = request.getParameter("ntlAquiferName");
%>
<% if ("map".equals(queryId)) {
	String bbox = request.getParameter("BBOX");
%>
SELECT 
	gp.geom_3785 GEOM 
FROM 
	nwis_dwh_star.well_registry gp,
	(<% if ("".equals(qwSnFlag) && "".equals(wlSnFlag)) { %> SELECT '-1' my_siteid from DUAL <% } else { %> <% if (!"".equals(qwSnFlag)) { %> SELECT my_siteid FROM nwis_dwh_star.well_registry WHERE QW_SN_FLAG = 'Yes' <% if (!"".equals(qwWellType)) { %> AND qw_well_type_US_FLAG IN (<%= qwWellType %>) <% } %> <% } %> <% if (!"".equals(wlSnFlag) && !"".equals(qwSnFlag)) { %> UNION <% } %> <% if (!"".equals(wlSnFlag)) { %> SELECT my_siteid FROM nwis_dwh_star.well_registry WHERE WL_SN_FLAG = 'Yes' <% if (!"".equals(wlWellType)) { %> AND wl_well_type_US_FLAG IN (<%= wlWellType %>) <% } %><% } %><% } %>) inner 
WHERE 
	inner.my_siteid = gp.my_siteid AND 
	<% if (!"".equals(agency)) { %> agency_cd IN (<%= agency %>) AND <%}%>
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
		nwis_dwh_star.well_registry gp,
	(
	<% if ("".equals(qwSnFlag) && "".equals(wlSnFlag)) { %>
		SELECT '-1' my_siteid from DUAL 
	<% } else { %>
		<% if (!"".equals(qwSnFlag)) { %>
			SELECT my_siteid FROM nwis_dwh_star.well_registry WHERE QW_SN_FLAG = 'Yes' 
			<% if (!"".equals(qwWellType)) { %> AND qw_well_type_US_FLAG IN (<%= qwWellType %>) <% } %>
		<% } %>
		<% if (!"".equals(wlSnFlag) && !"".equals(qwSnFlag)) { %> UNION <% } %>
		<% if (!"".equals(wlSnFlag)) { %>
			SELECT my_siteid FROM nwis_dwh_star.well_registry WHERE WL_SN_FLAG = 'Yes' 
			<% if (!"".equals(wlWellType)) { %> AND wl_well_type_US_FLAG IN (<%= wlWellType %>) <% } %>
		<% } %>
	<% } %>
	) inner 
WHERE 
	inner.my_siteid = gp.my_siteid  
	<% if (!"".equals(agency)) { %> AND agency_cd IN (<%= agency %>) <%}%>
	<% if (!"".equals(ntlAquiferName)) { %> AND nat_aqfr_desc IN (<%= ntlAquiferName %>) <%}%>
<% if (!"".equals(ntlAquiferName)) { %> AND nat_aqfr_desc IN (<%= ntlAquiferName %>) <%}%>
<%} else if ("identify".equals(queryId)) {
	String idBBox = request.getParameter("idBBox");
%>
SELECT 
	SITE_NO, 
	SITE_NAME, 
	DEC_LAT_VA, 
	DEC_LONG_VA,
	QW_WELL_TYPE_US_FLAG QW_WELL_TYPE,
	WL_WELL_TYPE_US_FLAG WL_WELL_TYPE,
	NAT_AQFR_DESC,
	AGENCY_CD,
	decode(AGENCY_CD, 'IN DNR','indnrtitle.gif','ISWS','ilstatewatersurvey.gif','MBMG','MontanaBMG.jpg','MN DNR','mn_dnr_logo.gif','MPCA','mpca7000.gif','TWDB','twdb.gif','USGS NJ / NJGS','njgslogo.gif','USGS_logo.png') LOGO    
FROM 
		nwis_dwh_star.well_registry gp,
	(
	<% if ("".equals(qwSnFlag) && "".equals(wlSnFlag)) { %>
		SELECT '-1' my_siteid from DUAL 
	<% } else { %>
		<% if (!"".equals(qwSnFlag)) { %>
			SELECT my_siteid FROM nwis_dwh_star.well_registry WHERE QW_SN_FLAG = 'Yes' 
			<% if (!"".equals(qwWellType)) { %> AND qw_well_type_US_FLAG IN (<%= qwWellType %>) <% } %>
		<% } %>
		<% if (!"".equals(wlSnFlag) && !"".equals(qwSnFlag)) { %> UNION <% } %>
		<% if (!"".equals(wlSnFlag)) { %>
			SELECT my_siteid FROM nwis_dwh_star.well_registry WHERE WL_SN_FLAG = 'Yes' 
			<% if (!"".equals(wlWellType)) { %> AND wl_well_type_US_FLAG IN (<%= wlWellType %>) <% } %>
		<% } %>
	<% } %>
	) inner 
WHERE 
	inner.my_siteid = gp.my_siteid AND 
	<% if (!"".equals(agency)) { %> agency_cd IN (<%= agency %>) AND <%}%>
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