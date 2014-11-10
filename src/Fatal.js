(function(_){
	
	_.Fatal = {};
	
	_.Fatal.getFatal = function(name, messages){
		
		var fatal = function(messageKey, detailMessage){
			this.code = messageKey;
			this.message = messages[messageKey];
			if (detailMessage) this.message = this.message + ' (' + detailMessage + ')';
			this.stack = Error().stack;
		};
		
		fatal.prototype = Object.create(Error.prototype);
		fatal.prototype.name = 'Fatal Error: ' + name;
		
		return fatal;
		
	};
	
})(window.ClassyJS = window.ClassyJS || {});
