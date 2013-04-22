package gov.usgs;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MetadataController {
	
	private Logger logger = LoggerFactory.getLogger(getClass());
	private JdbcTemplate template;
	
	@RequestMapping("/aquifers")
	@ResponseBody
	public List<Map<String,Object>> aquifers() {
				
		List<Map<String,Object>> result = template.queryForList(
				"select nat_aquifer_cd aquiferCode, nat_aqfr_desc aquifer, count(*) count\n" + 
				"from gw_data_portal.well_registry\n" + 
				"group by nat_aquifer_cd, nat_aqfr_desc order by nat_aqfr_desc");
		
		logger.debug("Found {} aquifers", result.size());
		
		return result;
	}
	
	@RequestMapping("/agencies")
	@ResponseBody
	public List<Map<String,Object>> agencies() {
		
		List<Map<String,Object>> result = template.queryForList(
				"SELECT wr.agency_cd, a.agency_nm, a.agency_link, COUNT(wr.my_siteid) count \n" + 
				"FROM gw_data_portal.well_registry wr, gw_data_portal.agency_lov a \n" + 
				"WHERE wr.agency_cd = a.agency_cd \n" + 
				"AND (a.org_type <>'NWIS' or a.agency_cd='USGS') \n" + 
				"GROUP BY wr.agency_cd, a.agency_nm, a.agency_link \n" +
				"ORDER BY a.agency_nm");
		
		logger.debug("Found {} agencies", result.size());

		return result;
	}

	@RequestMapping("/states")
	@ResponseBody
	public List<Map<String,Object>> states() {
		
		List<Map<String,Object>> result = template.queryForList(
				"select state_cd, state_nm, count(*) count\n" + 
				"from gw_data_portal.well_registry\n" + 
				"group by state_cd, state_nm order by state_nm");
		
		logger.debug("Found {} states", result.size());

		return result;
	}
	
	@RequestMapping("/counties")
	@ResponseBody
	public List<Map<String,Object>> states(@RequestParam("stateCd") final String stateCd) {
		List<Map<String,Object>> result;
		
		if(stateCd== null || "".equals(stateCd)) {
			result = template.queryForList(
					"select state_nm, county_cd, county_nm, count(*) count\n" + 
					"from gw_data_portal.well_registry\n" +
//					"where county_cd != '000' and county_nm != 'UNSPECIFIED'\n"+
					"group by state_nm, county_cd, county_nm order by county_nm");
		} else {
			result = template.queryForList(
				"select state_nm, county_cd, county_nm, count(*) count\n" + 
				"from gw_data_portal.well_registry\n" +
				"where state_cd = ?\n"+
//				"and county_cd != '000' and county_nm != 'UNSPECIFIED'\n"+
				"group by state_nm, county_cd, county_nm order by county_nm", stateCd);
		}
		
		logger.debug("Found {} counties for state cd "+stateCd, result.size());

		return result;
	}
	
	public void setDataSource(DataSource dataSource) {
		template = new JdbcTemplate(dataSource);
	}

}
