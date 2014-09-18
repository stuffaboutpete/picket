;(function(undefined){
	
	AbstractEventNotImplementedFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	AbstractEventNotImplementedFatal.prototype = Object.create(Error.prototype);
	AbstractEventNotImplementedFatal.prototype.name = 'Fatal: AbstractEventNotImplemented';
	
})();