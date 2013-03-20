;(function(undefined){
	
	Class.Method = function(name, method, scope){
		this.name = name;
		this.method = method;
		this.scope = scope || new Class.Scope(Class.Scope.PUBLIC);
	};
	
})();