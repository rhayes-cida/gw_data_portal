package gov.usgs;

import gov.usgs.URLUtil;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStreamReader;

import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class URLUtil {

	private static Logger logger = LoggerFactory.getLogger(URLUtil.class);

	//USE THIS CALL WHEN GETTING A BASE QUERY
	public static String getResponseAsStringFromURL(String urlString, String params) throws Exception {
		DataInputStream input = null;
		StringBuilder page = new StringBuilder();

		String returnString = "";

		// fetch base query
		try {
			// Get response data.
			input = new DataInputStream(URLUtil.makeUrlPostRequest(urlString, params).getInputStream());

			String str = "";
			while (null != ((str = input.readLine()))) {
				page.append(str);
			}

			input.close();
			returnString = page.toString();
			logger.trace("getResponseAsStringFromURL return string: {}", returnString);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Url: {}?{}",urlString,params);
		}

		return returnString;

	}

	public static String getHeaders(URLConnection uCon) {
		StringBuilder sb = new StringBuilder();
		Map<String, List<String>> headers = uCon.getHeaderFields();
		for (Map.Entry<String, List<String>> header: headers.entrySet()) {
			sb.append(header.getKey() + ": " + header.getValue().toString() + "\n");
		}
		return sb.toString();
	}

	//USE THIS CALL WHEN STREAMING BACK IMAGE FROM MAPVIEWER
	public static void writeBytesToOutputStream(String urlString, String params, ServletOutputStream out)
	throws Exception {
		URLConnection uCon = URLUtil.makeUrlPostRequest(urlString, params);
		logger.trace("headers: {}",getHeaders(uCon));
		DataInputStream input = null;
		try {

			input = new DataInputStream(uCon.getInputStream());
		} catch (Exception e) {
			logger.error("in writeBytesToOutputStream", e);
		}
		
		// Added code to detect/log if image size is too small, indicating a possible problem
		String contentLength = uCon.getHeaderField("Content-Length");
		if (contentLength != null) {
			Integer cl = Integer.parseInt(contentLength);
			if (cl != null && cl < 175) { // 175 just arbitrary. images should normally be at least 1K
				logger.warn("WARNING: maptile request response undersized at {} bytes", cl);
			}
		}


		BufferedInputStream buf = new BufferedInputStream(input);
		int readBytes = 0;
		// read from the file; write to the ServletOutputStream
		while ((readBytes = buf.read()) != -1)
			out.write(readBytes);

		input.close();
	}

	private static URLConnection makeUrlPostRequest(String urlString, String params) throws Exception {

		URL url;
		URLConnection urlConn;
		DataOutputStream printout;
		DataInputStream input = null;
		try {
			url = new URL(urlString);
			// URL connection channel.
			urlConn = url.openConnection();
			// Let the run-time system (RTS) know that we want input.
			urlConn.setDoInput(true);
			// Let the RTS know that we want to do output.
			urlConn.setDoOutput(true);
			// No caching, we want the real thing.
			urlConn.setUseCaches(false);
			// Specify the content type.
			urlConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			// Send POST output.
			printout = new DataOutputStream(urlConn.getOutputStream());


			printout.writeBytes(params);
			printout.flush();
			printout.close();

			return urlConn;
		} catch (Exception e) {
			logger.error("Problem with URL Post request for " + urlString, e);
			return null;
		}
	}


	public static StringBuffer getStringFromURLGET(String urlString) throws Exception {
		DataInputStream input = null;
		StringBuffer page = new StringBuffer();


		// Get response data.
		input = new DataInputStream(
				URLUtil.makeUrlGetRequest(urlString).getInputStream()
				);
		BufferedReader br = new BufferedReader(new InputStreamReader(input));

		String str = "";
		while (null != ((str = br.readLine()))) {
			page.append(str);
		}

		br.close();

		return page;
	}

	private static URLConnection makeUrlGetRequest(String urlString) throws Exception {
		URL url = new URL(urlString);
		URLConnection conn = url.openConnection();

		return conn;
	}
}
