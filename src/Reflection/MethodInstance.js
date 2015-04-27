(function(ClassyJS, _){
	
	_.MethodInstance = function(objectInstance, methodName)
	{
		
		// @todo Check class exists (typeRegistry.classExists(objectInstance))
		
		var classObject = ClassyJS._instantiator.getTypeRegistry().getClass(objectInstance);
		
		var members = ClassyJS._instantiator.getMemberRegistry().getMembers(classObject);
		
		var methodExists = false;
		
		for (var i = 0; i < members.length; i++) {
			if (!(members[i] instanceof ClassyJS.Member.Method)) continue;
			if (members[i].getName() == methodName) {
				methodExists = true;
				break;
			}
		}
		
		if (!methodExists) {
			throw new _.MethodInstance.Fatal(
				'METHOD_DOES_NOT_EXIST',
				'Method name: ' + methodName
			);
		}
		
		this._objectInstance = objectInstance;
		this._name = methodName;
		
	};
	
	_.MethodInstance.prototype.getMethod = function()
	{
		return ClassyJS._instantiator.getReflectionFactory().buildMethod(
			this._objectInstance,
			this._name
		);
	};
	
	_.MethodInstance.prototype.call = function()
	{
		return ClassyJS._instantiator.getMemberRegistry().callMethod(
			this._objectInstance,
			this._objectInstance,
			this._name,
			Array.prototype.splice.call(arguments, 0, arguments.length)
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.MethodInstance = _.MethodInstance;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
