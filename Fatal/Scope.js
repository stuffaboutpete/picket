;(function(undefined){
	
	ScopeFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	ScopeFatal.prototype = Object.create(Error.prototype);
	ScopeFatal.prototype.name = 'Fatal: Scope';
	
})();