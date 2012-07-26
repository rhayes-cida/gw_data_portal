package gov.usgs.cida.retrofit;

import static org.junit.Assert.*;

import org.junit.Test;

public class TransformTest {

	@Test
	public void testConstructorParsing() {
		Transform tr = new Transform("time<-parseDateTime(time)");
		assertEquals("time", tr.obj);
		assertEquals("parseDateTime", tr.func);
		
		String[] arguments = {"time"};
		assertArrayEquals(arguments, tr.args);
		assertTrue(tr.isValid);
	}
	
	@Test
	public void testConstructor_NullOrEmptyReturnsInvalid() {
		Transform tr = new Transform(null);
		assertNotNull(tr);
		assertFalse(tr.isValid);
		
		tr = new Transform("");
		assertNotNull(tr);
		assertFalse(tr.isValid);
	}

}
