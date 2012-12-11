GoogleAnalyticsUtils = function(){
	var eventDebug = true;
	var eventDebugVerbose = false;

	return {
		logEvent : function(category, action, label, value) {
			if (eventDebug && eventDebugVerbose && console && console.log) {
				console.log('logging event: category=' + category + ', action=' + action + ', label=' + label + ', value=' + value);
			}
			_gaq.push(['_trackEvent', category, action, label, value]);
		},
		
		//log total number of times a single site downloaded
		logDownloadSite : function(stationNumber) {
			if (eventDebug && console && console.log) {
				console.log('logging site download: ' + stationNumber);
			}
			GoogleAnalyticsUtils.logEvent('Download', 'Single Site', stationNumber);
		},
		
		//log total times multi-site download was clicked
		logDownloadSiteSetTotal : function(numberOfTypes) {
			if (eventDebug && console && console.log) {
				console.log('logging multisite download request: ' + numberOfTypes + ' download types selected');
			}
			GoogleAnalyticsUtils.logEvent('Download', 'Multiple Site', "Requested", numberOfTypes);
		},
		
		//log multi-site downloads by type
		logDownloadSiteSetByType : function(downloadType, numberOfSites) {
			if (eventDebug && console && console.log) {
				console.log('logging multisite download by type: ' + numberOfSites + " " + downloadType + ' sites');
			}
			GoogleAnalyticsUtils.logEvent('Download', 'Multiple Site By Type', downloadType, numberOfSites);
		},
		
		//log multi-site downloads by agency
		logDownloadSiteSetByAgency : function(agency, numberOfSites) {
			if (eventDebug && console && console.log) {
				console.log('logging multisite download by agency: ' + numberOfSites + " " + agency + ' sites');
			}
			GoogleAnalyticsUtils.logEvent('Download', 'Multiple Site By Agency', agency, numberOfSites);
		},
		
		//log total number of times the identify tool was used successfully (either single or site list)
		logSiteIdentifyUsed : function() {
			if (eventDebug && console && console.log) {
				console.log('logging identify');
			}
			GoogleAnalyticsUtils.logEvent('Identify', 'Site', 'Any');
		},
		
		//log total number of times a single site was identified
		logSiteIdentifyByStation : function(agencyAndStationNumber) {
			if (eventDebug && console && console.log) {
				console.log('logging single identify by agency:site: ' + agencyAndStationNumber);
			}
			GoogleAnalyticsUtils.logEvent('Identify', 'Site', agencyAndStationNumber);
		},
		
		//log total number of times multiple sites were returned by an identify
		logSiteIdentifySet : function(numberOfSites) {
			if (eventDebug && console && console.log) {
				console.log('logging identify set: ' + numberOfSites + " sites");
			}
			GoogleAnalyticsUtils.logEvent('Identify', 'Site', "Set", numberOfSites);
		},
		
		//log how many times an agency was explicitly requested in a map
		logMapByAgency : function(agency) {
			if (eventDebug && console && console.log) {
				console.log('logging map of agency: ' + agency);
			}
			GoogleAnalyticsUtils.logEvent('Map', 'By Agency', agency);
		},
		
		//log total times any map was requested
		logMap : function() {
			if (eventDebug && console && console.log) {
				console.log('logging the request of a map');
			}
			GoogleAnalyticsUtils.logEvent('Map', 'Any', 'Requested');
		},
		
		//log single site identify
		logSiteLinkClick : function(url) {
			if (eventDebug && console && console.log) {
				console.log('logging external link click: ' + url);
			}
			GoogleAnalyticsUtils.logEvent('ExternalLink', 'Identified Site', url);
		}
	};
}();