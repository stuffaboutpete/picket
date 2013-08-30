;(function(undefined){
	
	InvalidReturnTypeFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	InvalidReturnTypeFatal.prototype = Object.create(Error.prototype);
	InvalidReturnTypeFatal.prototype.name = 'Fatal: InvalidReturnType';
	
})();