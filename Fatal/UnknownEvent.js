;(function(undefined){
	
	UnknownEventFatal = function(message){
		this.message = message;
		this.stack = Error().stack;
	};
	UnknownEventFatal.prototype = Object.create(Error.prototype);
	UnknownEventFatal.prototype.name = 'Fatal: UnknownEvent';
	
})();