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
			var content = '';
            store.each(function(record){
				var agencyCd = record.get('AGENCY_CD');  
				var agencyName = record.get('AGENCY_NM');
                var url = record.get('AGENCY_LINK');
                if(undefined == url || !url.length){
                    url = '';
                }
				content += "<div class='ngwmn-partner-container'>" +
                    "<a href='" + url + "'>" +
					"<img class='ngwmn-partner-logo' src='assets/images/logos/" + GWDP.domain.getAgencyLogo(agencyCd) + "'/>" +
                    "</a>" +
					"<span class='ngwmn-partner-name'>" + agencyName + "</span>" +
				"</div>";
            });
			document.getElementById('ngwmn-partners').innerHTML = content;
		});
});