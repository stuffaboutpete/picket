(function(ClassyJS, _){
	
	_.Class = function(definition, typeRegistry, memberRegistry, namespaceManager)
	{
		if (!(definition instanceof ClassyJS.Type.Class.Definition)) {
			throw new _.Class.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (!(typeRegistry instanceof ClassyJS.Registry.Type)) {
			throw new _.Class.Fatal(
				'NO_TYPE_REGISTRY_PROVIDED',
				'Provided type: ' + typeof typeRegistry
			);
		}
		if (!(memberRegistry instanceof ClassyJS.Registry.Member)) {
			throw new _.Class.Fatal(
				'NO_MEMBER_REGISTRY_PROVIDED',
				'Provided type: ' + typeof memberRegistry
			);
		}
		if (!(namespaceManager instanceof ClassyJS.NamespaceManager)) {
			throw new _.Class.Fatal(
				'NO_NAMESPACE_MANAGER_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		this._definition = definition;
		this._typeRegistry = typeRegistry;
		this._memberRegistry = memberRegistry;
		this._namespaceManager = namespaceManager;
	};
	
	_.Class.prototype.getName = function()
	{
		return this._definition.getName();
	};
	
	_.Class.prototype.isExtension = function()
	{
		return this._definition.isExtension();
	};
	
	_.Class.prototype.getParentClass = function()
	{
		if (!this.isExtension()) throw new _.Class.Fatal('NO_PARENT_CLASS_RELATIONSHIP');
		return this._definition.getParentClass();
	};
	
	_.Class.prototype.getInterfaces = function()
	{
		// @todo Not tested method
		return this._definition.getInterfaces();
	};
	
	_.Class.prototype.requestInstantiation = function()
	{
		if (this._definition.isAbstract()) {
			throw new ClassyJS.Type.Class.Fatal('CANNOT_INSTANTIATE_ABSTRACT_CLASS');
		}
		if (this._memberRegistry.hasAbstractMembers(this)) {
			throw new ClassyJS.Type.Class.Fatal('CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS');
		}
		if (this._memberRegistry.hasUnimplementedInterfaceMembers(this)) {
			throw new ClassyJS.Type.Class.Fatal(
				'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
			);
		}
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {}
);
