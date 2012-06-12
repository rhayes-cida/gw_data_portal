package gov.usgs;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class DataRelayServlet
 */
public class DataRelayServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	private String cacheServer;
	private Set<String> headerStopList = new HashSet<String>();
	private ServletContext context;
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		cacheServer = DebugSettings.CACHE_SERVER;
		context = config.getServletContext();
	}

	private void redirect(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ServletContext ngwmn = context.getContext("/ngwmn");
		RequestDispatcher rd = ngwmn.getRequestDispatcher("/data");
        rd.forward(request, response);
	}
	
	private void relay(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		URL url = new URL(cacheServer);
		String method = request.getMethod();
		
		InputStream requestBody = request.getInputStream();
		URLConnection conn = url.openConnection();
		HttpURLConnection hconn = (HttpURLConnection) conn;
	
		hconn.setRequestMethod(method);
		hconn.setDoOutput(true);
		
		OutputStream relayBody = hconn.getOutputStream();
		try {
			copy(requestBody,relayBody);
		} finally {
			relayBody.close();
		}
		
		hconn.connect();
		
		Map<String, List<String>> headers = hconn.getHeaderFields();
		for (Map.Entry<String, List<String>> me : headers.entrySet()) {
			if ( ! headerStopList.contains(me.getKey())) {
				for (String hv : me.getValue()) {
					response.addHeader(me.getKey(), hv);
				}
			}
		}
		
		InputStream relayResponse = hconn.getInputStream();
		try {
			OutputStream responseBody = response.getOutputStream();
			try {
				copy(relayResponse, responseBody);
			}
			finally {
				responseBody.close();
			}
		} 
		finally {
			relayResponse.close();
		}
	}
	
	private void copy(InputStream is, OutputStream os) 
			throws IOException
	{
		byte[] buf = new byte[1024];
		
		while (true) {
			int ct = is.read(buf);
			if (ct <= 0) {
				break;
			}
			os.write(buf, 0, ct);
		}
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		redirect(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		redirect(request, response);
	}

}
