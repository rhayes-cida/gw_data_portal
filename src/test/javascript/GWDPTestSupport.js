TestSupport = function() {
	//private members
	var _server;
	
	/**
	 * Weird extjs hacks!!!
	 * The way extjs processes asyncronous callbacks is non-standard (uses the js setInterval).
	 * for the purposes of testing, we override the setInterval function temporarily so we can process all events right away.
	 * 
	 * Here is pseudocode on how the hack works:
	 *     overrideSetInterval();
	 *     //any extjs code that may start asynchronous calls that you want processed asap
	 *     restoreSetInterval();
	 * 
	 * Note that we have built this code flow into the initServer and doServerRespond functions.
	 */
	var oldSetInterval = setInterval;
	var callbacks = [];
	var overrideSetInterval = function() {
		setInterval = function (callback, delay) {
		    callbacks.push(callback);
		};
	};
	var restoreSetInterval = function() {
		setInterval = oldSetInterval;
		for (i in callbacks) {
		    callbacks[i].call();
		}
	};
	//This has to be overridden as a side affect of the above hack.
	Ext.apply(Array.prototype, {
	    remove : function(o){
	    	if(!this.indexOf) return; //this fixes the problem and is the only change
	        var index = this.indexOf(o);
	        if(index != -1){
	            this.splice(index, 1);
	        }
	        return this;
	    }
	});
	
return {
	stubExtAjaxRequest: function() {
		sinon.stub(Ext.Ajax, "request");
	},
	
	restoreExtAjaxRequest: function() {
		Ext.Ajax.request.restore();
	},
	
	initServer: function() {
		_server = sinon.fakeServer.create();
		overrideSetInterval();
	},
	
	restoreServer: function(server) {
		_server.restore();
	},
	
	setServerXmlResponse: function(url, xml) {
		_server.respondWith([
	            200,
	            { "Content-Type": "application/xml" },
	            xml
	        ]);
	},
	
	setServerJsonResponse: function(url, json) {
		_server.respondWith(url, [
 	            200,
 	            { "Content-Type": "application/json" },
 	           JSON.stringify(json)
 	        ]);
	},
	
	doServerRespond: function() {
		_server.respond();
		restoreSetInterval();
	}
};}();