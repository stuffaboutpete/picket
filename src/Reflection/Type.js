(function(_){
	
	_.Type = function(name)
	{
		this._name = name;
	};
	
	_.Type.acceptClassDependencies = function(namespaceManager, typeRegistry, memberRegistry)
	{
		_.Type._namespaceManager = namespaceManager;
		_.Type._typeRegistry = typeRegistry;
		_.Type._memberRegistry = memberRegistry;
	};
	
	_.Type.prototype.getMethods = function()
	{
		var members = _.Type._memberRegistry.getMembers(
			_.Type._typeRegistry.getClass(
				_.Type._namespaceManager.getNamespaceObject(this._name)
			)
		);
		var methods = [];
		for (var i in members) {
			if (members[i] instanceof ClassyJS.Member.Method) {
				methods.push(new Reflection.Method(members[i]));
			}
		}
		return methods;
	};
	
})(window.Reflection = window.Reflection || {});
