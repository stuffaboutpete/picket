;(function(undefined){
	
	Class.Method = function(name, method, scope, returnType, argTypes){
		this.name = name;
		this.method = method;
		this.scope = scope || new Class.Scope(Class.Scope.PUBLIC);
		this.returnType = returnType;
		this.argTypes = argTypes;
	};
	
})();