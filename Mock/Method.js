(function(Mock){
	
	var Method = function()
	{
		
	};
	
	Method.prototype.withArg = function()
	{
		this.expectedArguments = arguments;
		return this;
	};
	
	Method.prototype.will = function(callback)
	{
		if (typeof callback != 'function') {
			throw new Error('Callback must be a function');
		}
		this.callback = callback;
		return this;
	};
	
	Method.prototype.argumentsValid = function()
	{
		if (typeof this.expectedArguments == 'undefined') return true;
		for (var i = 0; i < this.expectedArguments.length; i++) {
			if (this.expectedArguments[i] != arguments[i]) return false;
		}
		return true;
	};
	
	Method.prototype.process = function()
	{
		if (typeof this.callback == 'undefined') return;
		return this.callback.apply(null, arguments);
	};
	
	Mock.Method = Method;
	
})(window.Mock || {});