;(function(undefined){
	
	CloneFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	CloneFatal.prototype = Object.create(Error.prototype);
	CloneFatal.prototype.name = 'Fatal: Clone';
	
})();