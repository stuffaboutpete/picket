;(function(undefined){
	
	InvalidClassDeclarationFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	InvalidClassDeclarationFatal.prototype = Object.create(Error.prototype);
	InvalidClassDeclarationFatal.prototype.name = 'Fatal: InvalidClassDeclaration';
	
})();