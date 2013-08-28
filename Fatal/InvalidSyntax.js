;(function(undefined){
	
	InvalidSyntaxFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	InvalidSyntaxFatal.prototype = Object.create(Error.prototype);
	InvalidSyntaxFatal.prototype.name = 'Fatal: InvalidSyntax';
	
})();