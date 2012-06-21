package gov.usgs;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class SettingsServlet
 */
public class SettingsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public SettingsServlet() {
        super();
    }
    
    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("application/json");
		PrintWriter pw = response.getWriter();
		log("gov.usgs.SettingsServlet.doGet sending cacheBase=" + DebugSettings.CACHE_SERVER);
		try {
			pw.print("{");
			pw.printf(" %s:\"%s\"\n", "baseServer", DebugSettings.SERVER_BASE);
			pw.printf(",%s:\"%s\"\n", "cacheBase", DebugSettings.CACHE_SERVER);
			pw.print("}");
		}
		finally {
			pw.close();
		}
	}

    @Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
