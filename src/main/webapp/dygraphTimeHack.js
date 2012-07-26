if ( Dygraph && Dygraph.dateParser) {
	// Hack to override Dygraph time parsing to explicitly handle ISO8601 dates 
	// when browser's native date parsing can't handle it. This is a known 
	// problem for IE8, and possibly Safari webkit as well
	
	// References:
	//		http://msdn.microsoft.com/en-us/library/ff743760%28v=vs.94%29.aspx
	//		http://stackoverflow.com/questions/8266710/javascript-date-parse-difference-in-chrome-and-other-browsers


	Dygraph.dateParser = function(dateStr){
		// If the native date parsing is able to handle it, then return the result quickly
		var d = Dygraph.dateStrToMillis(dateStr);
		if (d && !isNaN(d)) return d;
		
		/* Only those browsers with poor native date parsing capabilities have to pay
			the performance cost of more complicated ISO8601 parsing.
			Try parsing as ISO8601 calendar date, according to http://en.wikipedia.org/wiki/ISO_8601#Calendar_dates
			Supporting YYYYMMDD and YYYY-MM-DD, but leaving out YYYY-MM
		*/
		// var ISO8601DateRegex = /^(\d{4})-?(\d\d)-?(\d\d)/;
		/*	Parsing ISO8601 time, according to http://en.wikipedia.org/wiki/ISO_8601#Times
		 * 	Supporting hh:mm:ss, hhmmss, hh:mm, hhmm, hh
		 */
		// var ISO8601TimeRegex = /T(\d\d)(:?(\d\d)?:?(\d\d))?/;
		/* Parsing ISO8601 time zones, according to http://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators
		 * Supporting <time>Z and <time><offset>
		 */
		//var ISO8601TimeZoneRegEx = /Z|[+-](\d\d)(:?(\d\d)?:?(\d\d))?$/;
		
		// combined Date Time parsing, ignoring time zone because Date.UTC() can't deal with it
		var ISO8601DateTimeRegex = /^(\d{4})-?(\d\d)-?(\d\d)(T(\d\d)(:?(\d\d)?:?(\d\d))?)?/;
		var m = ISO8601DateTimeRegex.exec(dateStr);
		d = Date.UTC(m[1], m[2], m[3]|| 1, m[5]||"00", m[7]||"00", m[8]||"00");
		if (!d || isNaN(d)) {
			Dygraph.error("Couldn't parse " + dateStr + " as a date");
		}
		return d;	
	};
	
	Dygraph.ISO8601TimeZoneRegex = /Z|z|[+-]\d\d:?\d\d$/;
	
	Dygraph.dateParser = function(dateStr){
		var d = null;
		// Switching default behavior to using locale instead of GMT if no timezone specified
		if (Dygraph.ISO8601TimeZoneRegex.test(dateStr)){ // has time zone
			// If the native date parsing is able to handle it, then return the result quickly
			d = Dygraph.dateStrToMillis(dateStr);
			if (!d || isNaN(d)){
				d = Dygraph.parseISO8601Date(dateStr, true);
			}
		} else {// no time zone included.
			// In this case, can't use native parsing first because it defaults to GMT.
			// Try to parse as ISO8601 date first.
			d = Dygraph.parseISO8601Date(dateStr, true);
			if (!d || isNaN(d)){ // then try native
				d = Dygraph.dateStrToMillis(dateStr);
			}
		}
		
		if (!d || isNaN(d)) {
			Dygraph.error("Couldn't parse " + dateStr + " as a date");
		}
		return d;
	};
	
	Dygraph.ISO8601DateTimeRegex = /^(\d{4})-?(\d\d)-?(\d\d)(T(\d\d)(:?(\d\d)?:?(\d\d))?)?/;
	
	Dygraph.parseISO8601Date = function(dateStr, asLocal){
		// var ISO8601DateRegex = /^(\d{4})-?(\d\d)-?(\d\d)/;
		/*	Parsing ISO8601 time, according to http://en.wikipedia.org/wiki/ISO_8601#Times
		 * 	Supporting hh:mm:ss, hhmmss, hh:mm, hhmm, hh
		 */
		// var ISO8601TimeRegex = /T(\d\d)(:?(\d\d)?:?(\d\d))?/;
		/* Parsing ISO8601 time zones, according to http://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators
		 * Supporting <time>Z and <time><offset>
		 */
		
		// combined Date Time parsing, ignoring time zone because Date.UTC() can't deal with it
		var m = Dygraph.ISO8601DateTimeRegex.exec(dateStr);

		if (asLocal){
			return new Date(m[1], (m[2] || 1) - 1, m[3] || "1", m[5]||"00", m[7]||"00", m[8]||"00");
		} else {
			return Date.UTC(m[1], (m[2] || 1) - 1, m[3] || "1", m[5]||"00", m[7]||"00", m[8]||"00");
		}
	};
}