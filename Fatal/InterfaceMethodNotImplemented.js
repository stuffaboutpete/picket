;(function(undefined){
	
	InterfaceMethodNotImplementedFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	InterfaceMethodNotImplementedFatal.prototype = Object.create(Error.prototype);
	InterfaceMethodNotImplementedFatal.prototype.name = 'Fatal: InterfaceMethodNotImplemented';
	
})();