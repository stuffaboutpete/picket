;(function(undefined){
	
	UnknownMethodFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	UnknownMethodFatal.prototype = Object.create(Error.prototype);
	UnknownMethodFatal.prototype.name = 'Fatal: UnknownMethod';
	
})();