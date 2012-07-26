package gov.usgs.cida.retrofit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import org.junit.Test;

public class XML2CSVTest {

	@Test
	public void test() throws XMLStreamException, IOException {
		XMLInputFactory factory = StAXFactory.getXMLInputFactory();
		XMLStreamReader in = factory.createXMLStreamReader(new StringReader("<root><row><key>Amber</key><value>4</value></row></root>"));

		ParseState ps = new SimpleParseState("row", "key", "value");
		StringWriter out = new StringWriter();
		XML2CSV converter = new XML2CSV();
		converter.convert(in, ps, out);

		String result = out.toString();
		assertTrue(result != null);

		assertEquals("key,value\nAmber,4\n", result);
	}

}
