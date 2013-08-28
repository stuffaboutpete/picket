;(function(undefined){
	
	InterfaceIncorrectlyDefinedFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	InterfaceIncorrectlyDefinedFatal.prototype = Object.create(Error.prototype);
	InterfaceIncorrectlyDefinedFatal.prototype.name = 'Fatal: InterfaceIncorrectlyDefined';
	
})();