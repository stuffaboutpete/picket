;(function(undefined){
	
	InterfaceEventNotImplementedFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	InterfaceEventNotImplementedFatal.prototype = Object.create(Error.prototype);
	InterfaceEventNotImplementedFatal.prototype.name = 'Fatal: InterfaceEventNotImplemented';
	
})();