;(function(undefined){
	
	RuntimeFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	RuntimeFatal.prototype = Object.create(Error.prototype);
	RuntimeFatal.prototype.name = 'Fatal: Runtime';
	
})();