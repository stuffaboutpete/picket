;(function(undefined){
	
	UnknownPropertyFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	UnknownPropertyFatal.prototype = Object.create(Error.prototype);
	UnknownPropertyFatal.prototype.name = 'Fatal: UnknownProperty';
	
})();