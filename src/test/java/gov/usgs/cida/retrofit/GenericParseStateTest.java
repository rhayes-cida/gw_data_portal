package gov.usgs.cida.retrofit;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

/**
 * Generic test for ParseState contract. Any implementation should 
 * have a test which inherits from this test and overrides the 
 * configureParseState() method
 * 
 * @author ilinkuo
 *
 */
public class GenericParseStateTest {
	
	protected SimpleParseState configureParseState() {
		return new SimpleParseState("row", "col1", "col2");
	}

	@Test
	public void testInChunk_enterAndExit() {
		ParseState ps = configureParseState();
		
		assertFalse("inChunk = false before parsing", ps.inChunk());

		ps.enter("root");
		assertFalse("inChunk = false outside of chunk", ps.inChunk());
		
		ps.enter("row");
		assertTrue("inChunk = true on chunk start tag", ps.inChunk());
		
		ps.exit("row");
		assertFalse("inChunk = false on chunk end tag", ps.inChunk());
		
		ps.exit("root");
		assertFalse("inChunk = false on last tag", ps.inChunk());
	}
	
	@Test
	public void testInField_enterAndExit() {
		ParseState ps = configureParseState();
		
		assertFalse("inField = false before parsing", ps.inField());
		
		ps.enter("root");
		assertFalse("inField = false outside of chunk", ps.inField());
		
		ps.enter("row");
		assertFalse("inField = false inside of chunk but outside of field", ps.inField());
		
		ps.enter("col1");
		assertTrue("inField = true on field start tag", ps.inField());
		
		ps.exit("col1");
		assertFalse("inField = false on field end tag", ps.inField());
		
		ps.exit("row");
		assertFalse("inField = false on chunk end tag", ps.inField());
		
		ps.exit("root");
		assertFalse("inField = false on last tag", ps.inField());

	}
	
	@Test
	public void testOnChunkEnd_enterAndExit() {
		ParseState ps = configureParseState();
		
		assertFalse("onChunkEnd = false before parsing", ps.onChunkEnd());

		ps.enter("root");
		assertFalse("onChunkEnd = false outside of chunk", ps.onChunkEnd());
		
		ps.enter("row");
		assertFalse("onChunkEnd = true on chunk start tag", ps.onChunkEnd());
		
		ps.exit("row");
		assertTrue("onChunkEnd = false on chunk end tag", ps.onChunkEnd());
		
		ps.exit("root");
		assertFalse("onChunkEnd = false on last tag", ps.onChunkEnd());
	}
	
	@Test
	public void testInField_shouldBeFalseOutsideofChunk() {
		ParseState ps = configureParseState();
		
		assertFalse("inField = false before parsing", ps.inField());
		
		ps.enter("root");
		assertFalse("inField = false outside of chunk", ps.inField());
		
		ps.enter("col1");
		assertFalse("inField = false on field start tag outside of chunk", ps.inField());
		
		ps.exit("col1");
		assertFalse("inField = false on field end tag", ps.inField());
		
		ps.enter("row");
		assertFalse("inField = false inside of chunk but outside of field", ps.inField());
		
		ps.enter("col1");
		assertTrue("inField = true on field start tag", ps.inField());
		
		ps.exit("col1");
		assertFalse("inField = false on field end tag", ps.inField());
		
		ps.exit("row");
		assertFalse("inField = false on chunk end tag", ps.inField());
		
		ps.enter("col1");
		assertFalse("inField = false on field start tag outside of chunk", ps.inField());
		
		ps.exit("col1");
		assertFalse("inField = false on field end tag", ps.inField());
		
		ps.exit("root");
		assertFalse("inField = false on last tag", ps.inField());

	}
	
	@Test
	public void testExit_optionalEndTagName() {
		ParseState ps = configureParseState();
		
		assertFalse("inField = false before parsing", ps.inField());
		
		ps.enter("root");
		assertFalse("inField = false outside of chunk", ps.inField());
		
		ps.enter("col1");
		assertFalse("inField = false on field start tag outside of chunk", ps.inField());
		
		ps.exit();
		assertFalse("inField = false on field end tag", ps.inField());
		
		ps.enter("row");
		assertFalse("inField = false inside of chunk but outside of field", ps.inField());
		
		ps.enter("col1");
		assertTrue("inField = true on field start tag", ps.inField());
		
		ps.exit();
		assertFalse("inField = false on field end tag", ps.inField());
		
		ps.exit();
		assertFalse("inField = false on chunk end tag", ps.inField());
		
		ps.enter("col1");
		assertFalse("inField = false on field start tag outside of chunk", ps.inField());
		
		ps.exit();
		assertFalse("inField = false on field end tag", ps.inField());
		
		ps.exit();
		assertFalse("inField = false on last tag", ps.inField());
	}
	
	@Test(expected = IllegalStateException.class) 
	public void testExit_throwsErrorOnMismatch() {
		ParseState ps = configureParseState();
		
		ps.enter("root", "row");
		ps.exit("borg"); // Should throw an error here due to mismatch of borg and row
		ps.exit("root");
	}
	
	@Test
	public void testGetData_BaseCase() {
		ParseState ps = configureParseState();
		

		ps.enter("root", "row", "col1");

		assertNull("Obama", ps.putFieldValue("Obama"));
		
		ps.exit("col1");
		
		ps.enter("col2");
		
		assertNull(ps.putFieldValue("Romney"));
		
		ps.exit("col2");
		
		ps.exit("row");
		
		ps.exit("root");
		assertFalse("inChunk = false on last tag", ps.inChunk());
		
		List<String> expected = new ArrayList<String>();
		expected.add("Obama");
		expected.add("Romney");
		assertEquals(expected, ps.getData());
	}
	
	
	
	
	
	
}
