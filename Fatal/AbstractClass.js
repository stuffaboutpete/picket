;(function(undefined){
	
	AbstractClassFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	AbstractClassFatal.prototype = Object.create(Error.prototype);
	AbstractClassFatal.prototype.name = 'Fatal: AbstractClass';
	
})();