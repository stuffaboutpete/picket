(function(_){
	
	_.Mocker = function(namespaceManager, reflectionClassFactory)
	{
		
		// Ensure we have been given
		// a namespace manager
		if (!(namespaceManager instanceof ClassyJS.NamespaceManager)) {
			throw new _.Mocker.Fatal(
				'NON_NAMESPACE_MANAGER_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		
		// Ensure we have been given a factory
		// for creating reflection classes
		if (!(reflectionClassFactory instanceof ClassyJS.Mocker.ReflectionClassFactory)) {
			throw new _.Mocker.Fatal(
				'NON_REFLECTION_CLASS_FACTORY_PROVIDED',
				'Provided type: ' + typeof reflectionClassFactory
			);
		}
		
		// Save both dependencies
		this._namespaceManager = namespaceManager;
		this._reflectionClassFactory = reflectionClassFactory;
		
	};
	
	_.Mocker.prototype.getMock = function(className)
	{
		
		// Ensure we are given a string class name
		if (typeof className != 'string') {
			throw new _.Mocker.Fatal(
				'NON_STRING_CLASS_NAME_PROVIDED',
				'Provided type: ' + typeof className
			);
		}
		
		// Get the real constructor function
		// for the class and ensure it is a function
		var constructor = this._namespaceManager.getNamespaceObject(className);
		if (typeof constructor != 'function') {
			throw new _.Mocker.Fatal(
				'NON_FUNCTION_RETURNED_FROM_NAMESPACE_MANAGER',
				'Returned type: ' + typeof constructor + '; Provided identifier: ' + className
			);
		}
		
		// Create a proxy class, assigning
		// the target class's prototype to it
		var Mock = function(){};
		Mock.prototype = constructor.prototype;
		
		// Create an instance of the proxy
		var mock = new Mock();
		
		// Ensure that any methods on the
		// original class exist on the mock,
		// by using the reflection API
		var reflectionClass = this._reflectionClassFactory.build(className);
		var methods = reflectionClass.getMethods();
		for (var i = 0; i < methods.length; i++) mock[methods[i].getName()] = function(){};
		
		// Return the finished mock
		return mock;
		
	};
	
})(window.ClassyJS = window.ClassyJS || {});
