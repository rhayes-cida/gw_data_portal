package gov.usgs;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class DiagnoseServlet
 */
public class DiagnoseServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public DiagnoseServlet() {
        super();
    }

    private void diagnose(String mtd, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("text/plain");
    	
    	PrintWriter sow = response.getWriter();
    	try {
    		sow.printf("method: %s (%s)\n", request.getMethod(), mtd);
    		sow.printf("path: %s\n", request.getPathInfo());
    		sow.printf("context: %s\n", request.getContextPath());
    		
    		sow.printf("params\n");
    		Enumeration<String> pp_e = request.getParameterNames();
    		List<String> pp = Collections.list(pp_e);
    		for (String p : pp) {
    			sow.printf("param %s:\n", p);
    			String[] pvv = request.getParameterValues(p);
    			for (String v : pvv) {
    				sow.printf("\t: %s\n", v);
    			}
    		}
    		
    		sow.printf("headers\n");
    		List<String> hdrr = Collections.list(request.getHeaderNames());
    		for (String hdr : hdrr) {
    			sow.printf("header %s:\n", hdr);
    			
    			List<String> hdvv = Collections.list(request.getHeaders(hdr));
    			for (String v : hdvv) {
    				sow.printf("\t: %s\n", v);
    			}
    		}
    		
    		// TODO How get the posted form data?
    	} finally {
    		sow.close();
    	}
    }
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		diagnose("get", request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		diagnose("post", request, response);
	}

}
