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
		var members = _getMembers(this);
		var methods = [];
		for (var i in members) {
			if (members[i] instanceof ClassyJS.Member.Method) {
				methods.push(new Reflection.Method(members[i]));
			}
		}
		return methods;
	};
	
	_.Type.prototype.getProperties = function()
	{
		var members = _getMembers(this);
		var properties = [];
		for (var i in members) {
			if (members[i] instanceof ClassyJS.Member.Property) {
				properties.push(new Reflection.Property(members[i]));
			}
		}
		return properties;
	};
	
	var _getMembers = function(_this)
	{
		return _.Type._memberRegistry.getMembers(
			_.Type._typeRegistry.getClass(
				_.Type._namespaceManager.getNamespaceObject(_this._name)
			)
		);
	};
	
})(window.Reflection = window.Reflection || {});
