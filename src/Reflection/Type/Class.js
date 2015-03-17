(function(ClassyJS, Reflection, _){
	
	_.Class = function(className)
	{
		return _.call(this, className, 'class');
	};
	
	ClassyJS.Inheritance.makeChild(_.Class, _);
	
	_.Class.prototype.getMock = function()
	{
		
		// Get the real constructor function
		// for the class and ensure it is a function
		var constructor = _._namespaceManager.getNamespaceObject(this._name);
		if (typeof constructor != 'function') {
			throw new _.Mocker.Fatal(
				'NON_FUNCTION_RETURNED_FROM_NAMESPACE_MANAGER',
				'Returned type: ' + typeof constructor + '; Provided identifier: ' + this._name
			);
		}
		
		// Create a proxy class, assigning
		// the target class's prototype to it
		var Mock = function(){};
		Mock.prototype = constructor.prototype;
		
		// Create an instance of the proxy
		var mock = new Mock();
		
		var methods = this.getMethods();
		for (var i = 0; i < methods.length; i++) mock[methods[i].getName()] = function(){};
		
		// Return the finished mock
		return mock;
		
	};
	
	Reflection.Class = _.Class;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.Reflection = window.Reflection || {},
	window.Reflection.Type = window.Reflection.Type || {}
);
