;(function(undefined){
	
	Class.Method = function(name, method, scope, isStatic){
		this.name = name;
		this.method = method;
		this.scope = scope || new Class.Scope(Class.Scope.PUBLIC);
		this.isStatic = isStatic || false;
	};
	
})();