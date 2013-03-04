Ext.ns("GWDP");
Ext.ns("GWDP.ui");

GWDP.ui.learnMoreTabs;

Ext.onReady(function(){
	var contentTabs = new Yetii({
			id: 'ngwmn-learn-tab-container',
			tabclass: 'ngwmn-tab'
		});
	GWDP.ui.learnMoreTabs = contentTabs;
	
	GWDP.domain.Agency.getAgencyMetadata(
		{},
		function(store){
			var records = store.data.items;
			var content = '';
			for(var i = 0; i < records.length; i++) {
				var agencyCd = records[i].data['AGENCY_CD'];  
				var agencyName = records[i].data['AGENCY_NM'];
				content += "<div class='ngwmn-partner-container'>" +
					"<img class='ngwmn-partner-logo' src='assets/images/logos/" + GWDP.domain.getAgencyLogo(agencyCd) + "'>" +
					"<span class='ngwmn-partner-name'>" + agencyName + "</span>" +
				"</div>";
 			}
			
			document.getElementById('ngwmn-partners').innerHTML = content;
		});
});