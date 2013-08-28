;(function(undefined){
	
	InvalidArgumentTypeFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	InvalidArgumentTypeFatal.prototype = Object.create(Error.prototype);
	InvalidArgumentTypeFatal.prototype.name = 'Fatal: InvalidArgumentType';
	
})();