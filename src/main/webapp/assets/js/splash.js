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
});
