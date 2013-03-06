describe("DocNavHelper.js", function() {
	it("defines DNH API functions", function() {
        expect(DNH).toBeDefined();
        expect(DNH.createXmlDocFromString).toBeDefined();
        expect(DNH.extractValue).toBeDefined();
        expect(DNH.isEmptyOrNull).toBeDefined();
	});
});

describe("DNH.createXmlDocFromString", function() {
	it("returns a non-null document", function(){
		var result = DNH.createXmlDocFromString("<root/>");
		expect(result).toNotBe();
	});
});

describe("DNH.extractValue", function() {
	it("returns null when document is null", function(){
		expect(DNH.extractValue(null, "root")).toBeNull();
	});
	
	it("retrieves element -- happy path", function(){
		var doc = DNH.createXmlDocFromString("<root><child>George</child><child>Bush</child></root>");
		var result = DNH.extractValue(doc, "child");
		expect(result).toBe("George");
	});
	
	it("retrieves null if element is empty", function(){
		var doc = DNH.createXmlDocFromString("<root><child/><child>Bush</child></root>");
		var result = DNH.extractValue(doc, "child");
		expect(result).toBeNull();
	});
	
	it("retrieves attribute -- happy path", function(){
		var doc = DNH.createXmlDocFromString("<root><child m='Dick'>George</child><child m='Cheney'>Bush</child></root>");
		var result = DNH.extractValue(doc, "child","m");
		expect(result).toBe("Dick");
	});
	
	it("retrieves null if attribute does not exist", function(){
		var doc = DNH.createXmlDocFromString("<root><child>George</child><child m='Cheney'>Bush</child></root>");
		var result = DNH.extractValue(doc, "child","m");
		expect(result).toBeNull();
	});
});

describe("DNH.isEmptyOrNull", function() {
	it("returns false when document is null", function(){
		expect(DNH.isEmptyOrNull(null , "root")).toBe(true);
	});
	
	it("returns false when element not empty", function(){
		var doc = DNH.createXmlDocFromString("<root><child>George</child><child>Bush</child></root>");
		var result = DNH.isEmptyOrNull(doc, "child");
		expect(result).toBe(false);
	});
	
	it("returns true if element is empty", function(){
		var doc = DNH.createXmlDocFromString("<root><child/><child>Bush</child></root>");
		var result = DNH.isEmptyOrNull(doc, "child");
		expect(result).toBe(true);
	});
	
	it("returns true if element does not exist", function(){
		var doc = DNH.createXmlDocFromString("<root><child/><child>Bush</child></root>");
		var result = DNH.isEmptyOrNull(doc, "chi");
		expect(result).toBe(true);
	});
});
