Ext.onReady(function(){
	var fullWFSExtent = '-50,-180,85,-50';
	
	//get WL wells and update HTML
	GWDP.domain.Well.getWellCount(
		fullWFSExtent, 
		{WL_SN_FLAG: '1'}, //only wells with WL flag
		function(r){
			document.getElementById('ngwmnWLWellCount').innerHTML = r;
		});
	
	//get QW wells and update HTML
	GWDP.domain.Well.getWellCount(
		fullWFSExtent, 
		{QW_SN_FLAG: '1'}, //only wells with QW flag
		function(r){
			document.getElementById('ngwmnQWWellCount').innerHTML = r;
		});
	
	//TODO reenable when we get WFS service in place, this one MIGHT change to custom portal WS
//	GWDP.domain.Agency.getAgencyCount(
//		fullWFSExtent, 
//		null, 
//		function(r){
//			document.getElementById('agencyCount').innerHTML = r;
//		});
	
	//TODO reenable when we get WFS service in place
//	GWDP.domain.State.getStateCount(
//		fullWFSExtent, 
//		null, 
//		function(r){
//			document.getElementById('stateCount').innerHTML = r;
//		});
	
	//TODO reenable when we get WFS service in place
//	GWDP.domain.Aquifer.getAquiferCount(
//		fullWFSExtent, 
//		null, 
//		function(r){
//			document.getElementById('aquiferCount').innerHTML = r;
//		});
});
