<%@page import="java.util.*"%>

<%!
	// Splits into pairs using , as pair delimiter, - as within-pair delimiter
	public List<String[]> splitParam(String param){
		List<String[]> result = new ArrayList<String[]>();
		if (param != null && !param.isEmpty()){
			String[] params = param.split(",");
			for (String pair: params){
				if (!pair.isEmpty()){
					String[] parts =  pair.split("-");
					result.add(parts);
				}
			}
		}
		return result;
	}
	
	public String removeSingleQuotes(String value){
		if (value != null && !value.isEmpty()){
			value = value.replaceAll("'", "");
		}
		return value;
	}
%>

<%
	// removeSingleQuotes() must be called on those multi-parameters processed by getUrlParamStringFromPicklist() from ui.js
	String queryId = request.getParameter("queryId");
	String agency = request.getParameter("agency");
	String qwSnFlag = request.getParameter("qwSnFlag");
	String qwWellParam = removeSingleQuotes(request.getParameter("qwWellType"));
	String wlSnFlag = request.getParameter("wlSnFlag");
	String wlWellParam = removeSingleQuotes(request.getParameter("wlWellType"));
	// ntlAquiferName does not get removeSingleQuotes because it's inserted directly into an IN clause
	String ntlAquiferName = request.getParameter("ntlAquiferName");
	String WELL_CLAUSE = "( QW_WELL_TYPE = '%s' AND QW_WELL_CHARS = '%s' ) ";
%>
<% if ("map".equals(queryId)) {
	String bbox = request.getParameter("BBOX");
%>
SELECT 
	gp.geom_3785 GEOM 
FROM 
	gw_data_portal.well_registry gp,
	(<% if ("".equals(qwSnFlag) && "".equals(wlSnFlag)) { %> 
		SELECT '-1' my_siteid from DUAL 
	<% } else { %> 
		<% if (!"".equals(qwSnFlag)) { %> 
			SELECT my_siteid FROM gw_data_portal.well_registry WHERE QW_SN_FLAG = '1' 
			<% if (!"".equals(qwWellParam)) { %> 
				AND (
					<% 
						List<String> clauses = new ArrayList<String>();
						for (String[] pair: splitParam(qwWellParam)) {
							clauses.add("( QW_WELL_TYPE = '" + pair[0] + "' AND QW_WELL_CHARS = '" + pair[1] + "' )");
						}
						for (int i=0; i<clauses.size(); i++) {
							if (i != 0) out.println(" OR ");
							out.println(clauses.get(i));
						}
					%>
				)
			<% } %> 
		<% } %> 
		<% if (!"".equals(wlSnFlag) && !"".equals(qwSnFlag)) { %> 
			UNION 
		<% } %> 
		<% if (!"".equals(wlSnFlag)) { %> 
			SELECT my_siteid FROM gw_data_portal.well_registry WHERE WL_SN_FLAG = '1' 
			<% if (!"".equals(wlWellParam)) { %> 
				AND (
					<% 
						List<String> clauses = new ArrayList<String>();
						for (String[] pair: splitParam(wlWellParam)) {
							clauses.add("( WL_WELL_TYPE = '" + pair[0] + "' AND WL_WELL_CHARS = '" + pair[1] + "' )");
						}
						for (int i=0; i<clauses.size(); i++) {
							if (i != 0) out.println(" OR ");
							out.println(clauses.get(i));
						}
					%>
				)
			<% } %>
		<% } %>
	<% } %>) inner 
WHERE 
	inner.my_siteid = gp.my_siteid AND 
	gp.display_flag = '1' AND 
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
ORDER BY 
	SITE_NO 
<%} else if ("bbox".equals(queryId)) { %>
SELECT 
	min(gp.dec_long_va) || ',' || min(gp.dec_lat_va) ||','|| max(gp.dec_long_va) ||','||  max(gp.dec_lat_va) bbox,
	count(*) num_points  
FROM 
		gw_data_portal.well_registry gp,
	(
	<% if ("".equals(qwSnFlag) && "".equals(wlSnFlag)) { %>
		SELECT '-1' my_siteid from DUAL 
	<% } else { %>
		<% if (!"".equals(qwSnFlag)) { %>
			SELECT my_siteid FROM gw_data_portal.well_registry WHERE QW_SN_FLAG = '1' 
			<% if (!"".equals(qwWellParam)) { %> 
				AND (
					<% 
						List<String> clauses = new ArrayList<String>();
						for (String[] pair: splitParam(qwWellParam)) {
							clauses.add(String.format(WELL_CLAUSE, pair[0], pair[1]));
						}
						for (int i=0; i<clauses.size(); i++) {
							if (i != 0) out.println(" OR ");
							out.println(clauses.get(i));
						}
					%>
				)
			<% } %>
		<% } %>
		<% if (!"".equals(wlSnFlag) && !"".equals(qwSnFlag)) { %> UNION <% } %>
		<% if (!"".equals(wlSnFlag)) { %>
			SELECT my_siteid FROM gw_data_portal.well_registry WHERE WL_SN_FLAG = '1' 
			<% if (!"".equals(wlWellParam)) { %> 
				AND (
					<% 
						List<String> clauses = new ArrayList<String>();
						for (String[] pair: splitParam(wlWellParam)) {
							clauses.add("( WL_WELL_TYPE = '" + pair[0] + "' AND WL_WELL_CHARS = '" + pair[1] + "' )");
						}
						for (int i=0; i<clauses.size(); i++) {
							if (i != 0) out.println(" OR ");
							out.println(clauses.get(i));
						}
					%>
				)
			<% } %>			
		<% } %>
	<% } %>
	) inner 
WHERE 
	inner.my_siteid = gp.my_siteid AND 
	gp.display_flag = '1' 
	<% if (!"".equals(agency)) { %> AND agency_cd IN (<%= agency %>) <%}%>
	<% if (!"".equals(ntlAquiferName)) { %> AND nat_aqfr_desc IN (<%= ntlAquiferName %>) <%}%>

<%} else if ("identify".equals(queryId)) {
	String idBBox = request.getParameter("idBBox");
%>
SELECT 
	gp.SITE_NO, 
	gp.SITE_NAME, 
	trunc(gp.DEC_LAT_VA,3) DEC_LAT_VA,	
	trunc(gp.DEC_LONG_VA,3) DEC_LONG_VA,
	
	decode(QW_WELL_TYPE, 	'1', 	'Surveillance',
							'2', 	'Trend',
							'3',	'Special',
							'999',	'Unknown'
	) || ' - ' ||
	decode(QW_WELL_CHARS, 	'1', 	'Background',
							'2', 	'Suspected / Anticipated Changes',
							'3',	'Known Changes',
							'999',	'Unknown'
	) as QW_WELL_TYPE,
	decode(WL_WELL_TYPE, 	'1', 	'Surveillance', 
							'2', 	'Trend', 
							'3',	'Special', 
							'999',	'Unknown' 
	) || ' - ' ||
	decode(WL_WELL_CHARS, 	'1', 	'Background',
							'2', 	'Suspected / Anticipated Changes',
							'3',	'Known Changes',
							'999',	'Unknown'
	) as WL_WELL_TYPE,
	gp.WELL_DEPTH,
	gp.NAT_AQFR_DESC,
	gp.AGENCY_CD,
	gp.WL_SN_FLAG,
	gp.QW_SN_FLAG,
	gp.local_aquifer_name,
	'' well_depth_va,
	decode(gp.AGENCY_CD,'IL EPA', 'iepa_logo.jpg', 
			'IN DNR', 'indnrtitle.gif',
			'ISWS', 'ilstatewatersurvey.gif',
			'MBMG','MontanaBMG.jpg',
			'MN DNR','mn_dnr_logo.gif',
			'MPCA','mpca7000.gif',
			'TWDB','twdb.gif',
			'USGS', decode(gp.STATE_CD, 
							34, 'njgslogo.gif',
							17, 'ilstatewatersurvey.gif',
							18, 'indnrtitle.gif',
							'USGS_logo.png'),
			'USGS_logo.png') LOGO    
FROM 
		gw_data_portal.well_registry gp,
	(
	<% if ("".equals(qwSnFlag) && "".equals(wlSnFlag)) { %>
		SELECT '-1' my_siteid from DUAL 
	<% } else { %>
		<% if (!"".equals(qwSnFlag)) { %>
			SELECT my_siteid FROM gw_data_portal.well_registry WHERE QW_SN_FLAG = '1' 
			<% if (!"".equals(qwWellParam)) { %> 
				AND (
					<% 
						List<String> clauses = new ArrayList<String>();
						for (String[] pair: splitParam(qwWellParam)) {
							System.err.println(pair[0]);
							clauses.add(" ( QW_WELL_TYPE = '" + pair[0] + "' AND QW_WELL_CHARS = '" + pair[1] + "' ) ");
						}
						for (int i=0; i<clauses.size(); i++) {
							if (i != 0) out.println(" OR ");
							out.println(clauses.get(i));
						}
					%>
				)
			<% } %>
		<% } %>
		<% if (!"".equals(wlSnFlag) && !"".equals(qwSnFlag)) { %> UNION <% } %>
		<% if (!"".equals(wlSnFlag)) { %>
			SELECT my_siteid FROM gw_data_portal.well_registry WHERE WL_SN_FLAG = '1'
			<% if (!"".equals(wlWellParam)) { %> 
				AND (
					<% 
						List<String> clauses = new ArrayList<String>();
						for (String[] pair: splitParam(wlWellParam)) {
							clauses.add("( WL_WELL_TYPE = '" + pair[0] + "' AND WL_WELL_CHARS = '" + pair[1] + "' )");
						}
						for (int i=0; i<clauses.size(); i++) {
							if (i != 0) out.println(" OR ");
							out.println(clauses.get(i));
						}
					%>
				)
			<% } %>		
		<% } %>
	<% } %>
	) inner 
WHERE 
	inner.my_siteid = gp.my_siteid AND 
	gp.display_flag = '1' AND 
	<% if (!"".equals(agency)) { %> gp.agency_cd IN (<%= agency %>) AND <%}%>
	<% if (!"".equals(ntlAquiferName)) { %> 
		gp.nat_aqfr_desc IN (<%= ntlAquiferName %>) AND 
	<%}%>
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