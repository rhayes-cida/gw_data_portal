TestSupport = function() {
	return {
		stubExtAjaxRequest: function() {
			sinon.stub(Ext.Ajax, "request");
		},
		
		restoreExtAjaxRequest: function() {
			Ext.Ajax.request.restore();
		}
	};
}();