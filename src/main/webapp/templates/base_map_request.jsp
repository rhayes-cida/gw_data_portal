<?xml version="1.0" encoding="windows-1252" ?>
<map_request 
             datasource="GW_DATA_PORTAL_USER_DEV" 
			 srid="3785" 
             width="<%=request.getParameter("width")%>" 
             height="<%=request.getParameter("height")%>" 
             bgcolor="#ffffff" 
			 transparent="true" 
             antialiasing="true" 
             format="PNG8_STREAM">
  <box><coordinates><%=request.getParameter("BBOX")%></coordinates></box>             
  <themes>
    <theme name="wells">
      <jdbc_query 
        spatial_column="geom" 
        render_style="M.WELL" 
        jdbc_srid="3785" 
        datasource="GW_DATA_PORTAL_USER_DEV" 
        asis="true">
        <%=request.getParameter("query")%>
      </jdbc_query>
    </theme>
  </themes>
</map_request>
<!-- datasource="gw_data_portal_user"  -->