var DNH = {
	extractValue: function(doc, elementName, attName /* optional */){
		if (!doc) return null;
		var elmt = doc.getElementsByTagName(elementName);
		elmt = elmt? elmt[0]: elmt;
		if (elmt){
			if (attName) { return elmt.getAttribute(attName)}
			return elmt.firstChild? elmt.firstChild.nodeValue: null;
		}
		return null;
	},
	
	isEmptyOrNull: function(doc, elementName, attName /* optional */){
		var val = DNH.extractValue(doc, elementName, attName);
		var temp = (val === null);
		return (val === null) || (val.length == 0);
	},
		
	createXmlDocFromString: function(str) {
		var theDocument = false;	//this will be the XML document

		if (window.ActiveXObject) {		//for IE users......
			try {
				theDocument = new ActiveXObject("Microsoft.XMLDOM");
				theDocument.async = false;
				theDocument.loadXML(str);
			} catch (e) {	
				alert("Error parsing XML.");
				return false;
			}
		} else if (window.XMLHttpRequest) {		//for everyone else
			try {
				var parser = new DOMParser();        
				theDocument = parser.parseFromString(str, "text/xml");
			} catch (e) {
				//oops. something went wrong in your parsing.
				alert("Error parsing XML.");
				return false;
			}
		} 
		return theDocument;
	},
	
	removeNameSpaces : function(xmlStr){
		var result = xmlStr.replace(/<[a-zA-Z0-9]+:/g,'<');
		result = result.replace(/<\/[a-zA-Z0-9]+:/g,'</');
		return result;
	}
}