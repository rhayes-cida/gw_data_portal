Ext.onReady(function(){
	var fullWFSExtent = '-50,-180,85,-50';
	
	//get WL wells and update HTML
	GWDP.domain.Well.getWellCount(
		fullWFSExtent, 
		'WL_SN_FLAG=1', //only wells with WL flag
		function(r){
			document.getElementById('ngwmnWLWellCount').innerHTML = r;
		});
	
	//get QW wells and update HTML
	GWDP.domain.Well.getWellCount(
		fullWFSExtent, 
		"QW_SN_FLAG=1", //only wells with QW flag
		function(r){
			document.getElementById('ngwmnQWWellCount').innerHTML = r;
		});
	
	GWDP.domain.Agency.getAgencyMetadata(
		{},
		function(r){
			document.getElementById('agencyCount').innerHTML = r.data.length;
		});
	
	GWDP.domain.State.getStateMetadata(
			{},
			function(r){
				document.getElementById('stateCount').innerHTML = r.data.length;
			});
	
	GWDP.domain.Aquifer.getAquiferMetadata(
			{},
			function(r){
				document.getElementById('aquiferCount').innerHTML = r.data.length;
			});
});

GWDP.ui.ieHoverOver = function(div) {
	div.className += " ngwmn-container-hover";
};


GWDP.ui.ieHoverOut = function(div) {
	div.className = div.className.replace(/ ngwmn-container-hover/g, "");
};