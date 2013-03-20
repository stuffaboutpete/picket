(function(){
	
	var Mock = function(classname)
	{
		if (typeof classname != 'string') {
			throw new Error('Class name must be a string');
		}
		var classnameParts = classname.split('.');
		var currentLevel = window;
		var invalidClassnameError = new Error(
			'Class name must describe a function'
		);
		for (var i = 0; i < classnameParts.length; i++) {
			if (typeof currentLevel[classnameParts[i]] == 'undefined') {
				throw invalidClassnameError;
			}
			if (i == (classnameParts.length - 1)) {
				if (typeof currentLevel[classnameParts[i]] != 'function') {
					throw invalidClassnameError;
				}
				this.class = currentLevel[classnameParts[i]];
			}
			currentLevel = currentLevel[classnameParts[i]];
		}
		this.expectations = [];
	}
	
	Mock.prototype.method = function(methodname)
	{
		if (typeof methodname != 'string') {
			throw new Error('Method name must be a string');
		}
		if (typeof this.class.methods[methodname] == 'undefined') {
			throw new Error('Method must be declared on mocked class');
		}
		this[methodname] = function(){
			return this.expectations[methodname].call.apply(
				this.expectations[methodname],
				arguments
			);
		};
		if (!this.expectations[methodname]) {
			this.expectations[methodname] = new Mock.Expectation();
		}
		return this.expectations[methodname];
	};
	
	Mock.prototype.resolve = function()
	{
		for (var i in this.expectations) {
			if (!this.expectations[i].callCountMet()) {
				throw new Error('At least one requirement was not met');
			}
		}
	};
	
	Mock.prototype.instanceOf = function(type)
	{
		return (type === Class || type === this.class);
	};
	
	window.Mock = Mock;
	
})();