package gov.usgs;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MetadataController {
	
	private Logger logger = LoggerFactory.getLogger(getClass());
	
	public static class NameCountPair {
		public String name;
		public int count = 0;
		
		NameCountPair(String n, int c) {
			name = n;
			count = c;
		}
	}
	
	@RequestMapping("/aquifers")
	@ResponseBody
	public List<NameCountPair> aquifers() {
		
		ArrayList<NameCountPair> value = new ArrayList<NameCountPair>(4);
		
		value.add(new NameCountPair("Alpha", 1));
		value.add(new NameCountPair("Beta", 2));
		value.add(new NameCountPair("Gamma", 3));
		value.add(new NameCountPair("Delta", 4));
		
		return value;
	}
	
	@RequestMapping("/agencies")
	@ResponseBody
	public List<NameCountPair> agencies() {
		
		ArrayList<NameCountPair> value = new ArrayList<NameCountPair>();
		
		value.add(new NameCountPair("USGS", 1000000));
		value.add(new NameCountPair("MBMG", 200));
		value.add(new NameCountPair("TWDB", 425));
		
		return value;
	}

	@RequestMapping("/states")
	@ResponseBody
	public List<NameCountPair> states() {
		
		ArrayList<NameCountPair> value = new ArrayList<NameCountPair>();
		
		value.add(new NameCountPair("NJ", 500));
		value.add(new NameCountPair("TX", 400));
		value.add(new NameCountPair("WI", 2));
		value.add(new NameCountPair("NV", 0));
		
		return value;
	}

}
