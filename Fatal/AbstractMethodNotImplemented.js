;(function(undefined){
	
	AbstractMethodNotImplementedFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	AbstractMethodNotImplementedFatal.prototype = Object.create(Error.prototype);
	AbstractMethodNotImplementedFatal.prototype.name = 'Fatal: AbstractMethodNotImplemented';
	
})();