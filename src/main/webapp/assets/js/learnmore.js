Ext.ns("GWDP");
Ext.ns("GWDP.ui");

GWDP.ui.learnMoreTabs;

Ext.onReady(function(){
	var contentTabs = new Yetii({
			id: 'ngwmn-learn-tab-container',
			tabclass: 'ngwmn-tab'
		});
	GWDP.ui.learnMoreTabs = contentTabs;
	
	//Populate partners content
	var fullWFSExtent = '-50,-180,85,-50';
	//TODO, this is stubbed in as a WFS call, will most likely
	GWDP.domain.Agency.getAgencies(
		fullWFSExtent, 
		null, 
		function(records){
			var target = document.getElementById('ngwmn-partners');
			for(var i = 0; i < records.length; i++) {
				var agencyCd = records[i].data['AGENCY_CD'];  //TODO get correct data field
				var agencyName = records[i].data['AGENCY_NAME']; //TODO get correct data field
				target += "<div class='ngwmn-partner-container'>" +
					"<img class='ngwmn-partner-logo' src='assets/images/logos/" + GWDP.domain.getAgencyLogo(agencyCd) + "'>" +
					"<span class='ngwmn-partner-name'>" + agencyName + "</span>" +
				"</div>";
 			}
		});
});