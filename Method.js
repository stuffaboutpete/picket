;(function(undefined){
	
	Class.Method = function(name, method, scope, isStatic, returnType, argTypes){
		this.name = name;
		this.method = method;
		this.scope = scope || new Class.Scope(Class.Scope.PUBLIC);
		this.isStatic = isStatic || false;
		this.returnType = returnType;
		this.argTypes = argTypes;
	};
	
})();