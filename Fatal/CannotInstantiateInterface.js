;(function(undefined){
	
	CannotInstantiateInterfaceFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	CannotInstantiateInterfaceFatal.prototype = Object.create(Error.prototype);
	CannotInstantiateInterfaceFatal.prototype.name = 'Fatal: CannotInstantiateInterface';
	
})();