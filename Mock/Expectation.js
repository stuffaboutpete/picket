(function(Mock){
	
	var Expectation = function()
	{
		this.methods = [];
		this.defaultMethod;
		this.callCount = 0;
	};
	
	Expectation.prototype.at = function(location)
	{
		var locationTypeError = new Error(
			'Location must be a non negative integer or either of ' +
			'the strings \'any\' and \'none\''
		);		
		if (typeof location == 'number') {
			if (location < 0) throw locationTypeError;
		} else if (typeof location == 'string') {
			if (location != 'any' && location != 'none') {
				throw locationTypeError;
			}
		} else {
			throw locationTypeError;
		}
		this.callCountMet = function(){
			switch (location) {
				case 'any': return true;
				case 'none': return (this.callCount === 0);
				default: return (this.callCount > location);
			}
		};
		this.incrementCallCount = function(){
			if (location == 'none') {
				throw new Error('Method should not be called');
			}
			this.callCount++;
		};
		var method = new Mock.Method();
		if (location == 'any') {
			this.defaultMethod = method;
		} else {
			this.methods[location] = method;
		}
		return method;
	};
	
	Expectation.prototype.atLeast = function(location)
	{
		if (typeof location != 'number' || location < 1) {
			throw new Error('Location must be a positive integer');
		}
		this.callCountMet = function(){
			return (this.callCount >= location);
		};
		this.incrementCallCount = function(){
			this.callCount++;
		};
		var method = new Mock.Method();
		this.defaultMethod = method;
		return method;
	};
	
	Expectation.prototype.atMost = function(location)
	{
		if (typeof location != 'number' || location < 1) {
			throw new Error('Location must be a positive integer');
		}
		this.callCountMet = function(){
			return (this.callCount <= location);
		};
		this.incrementCallCount = function(){
			this.callCount++;
			if (this.callCount > location) {
				throw new Error('Method called too many times');
			}
		};
		var method = new Mock.Method();
		this.defaultMethod = method;
		return method;
	};
	
	Expectation.prototype.call = function()
	{
		if (this.methods[this.callCount]) {
			var method = this.methods[this.callCount];
		} else {
			var method = this.defaultMethod
		}
		this.incrementCallCount();
		if (!method.argumentsValid.apply(method, arguments)) {
			throw new Error('Method was called with unexpected arguments');
		}
		return method.process.apply(method, arguments);
	}
	
	Mock.Expectation = Expectation;
	
})(window.Mock || {});