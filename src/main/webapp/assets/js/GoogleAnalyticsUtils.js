GoogleAnalyticsUtils = function(){
	var eventDebug = false;
	var eventDebugVerbose = false;

	return {
		logEvent : function(category, action, label, value) {
			if (eventDebug && eventDebugVerbose && console && console.log) {
				console.log('logging event: category=' + category + ', action=' + action + ', label=' + label + ', value=' + value);
			}
			_gaq.push(['_trackEvent', category, action, label, value]);
		},
		
		//log single site download
		logDownloadSite : function(stationNumber) {
			if (eventDebug && console && console.log) {
				console.log('logging site download: ' + stationNumber);
			}
			GoogleAnalyticsUtils.logEvent('Download', 'Site', stationNumber);
		},
		
		//log multi-site download
		logDownloadSiteSet : function(downloadType, numberOfSites) {
			if (eventDebug && console && console.log) {
				console.log('logging set of sites download: ' + numberOfSites + " " + downloadType + ' sites');
			}
			GoogleAnalyticsUtils.logEvent('Download', 'Site', downloadType + " Set", numberOfSites);
		},
		
		//log single site identify
		logIdentify : function(stationNumber) {
			if (eventDebug && console && console.log) {
				console.log('logging identify: ' + stationNumber);
			}
			GoogleAnalyticsUtils.logEvent('Identify', 'Site', stationNumber);
		},
		
		//log single site identify
		logIdentifySet : function(numberOfSites) {
			if (eventDebug && console && console.log) {
				console.log('logging identify set: ' + numberOfSites + " sites");
			}
			GoogleAnalyticsUtils.logEvent('Identify', 'Site', "Set", numberOfSites);
		},
		
		//log single site identify
		logMap : function(agency) {
			if (eventDebug && console && console.log) {
				console.log('logging map of agency: ' + agency);
			}
			GoogleAnalyticsUtils.logEvent('Map', agency);
		},
		
		//log single site identify
		logLinkClick : function(url) {
			if (eventDebug && console && console.log) {
				console.log('logging external link click: ' + url);
			}
			GoogleAnalyticsUtils.logEvent('ExternalLink', url);
		}
	};
}();