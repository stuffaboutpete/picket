(function(Picket, _){
	
	_.Factory = function(
		typeDefinitionFactory,
		classFactory,
		interfaceFactory,
		typeRegistry,
		memberRegistry,
		namespaceManager
	)
	{
		if (!(typeDefinitionFactory instanceof Picket.Type.DefinitionFactory)) {
			throw new _.Factory.Fatal(
				'NO_DEFINITION_FACTORY_PROVIDED',
				'Provided type: ' + typeof typeDefinitionFactory
			);
		}
		if (!(classFactory instanceof Picket.Type.Class.Factory)) {
			throw new _.Factory.Fatal(
				'NO_CLASS_FACTORY_PROVIDED',
				'Provided type: ' + typeof classFactory
			);
		}
		if (!(interfaceFactory instanceof Picket.Type.Interface.Factory)) {
			throw new _.Factory.Fatal(
				'NO_INTERFACE_FACTORY_PROVIDED',
				'Provided type: ' + typeof interfaceFactory
			);
		}
		if (!(typeRegistry instanceof Picket.Registry.Type)) {
			throw new _.Factory.Fatal(
				'NO_TYPE_REGISTRY_PROVIDED',
				'Provided type: ' + typeof typeRegistry
			);
		}
		if (!(memberRegistry instanceof Picket.Registry.Member)) {
			throw new _.Factory.Fatal(
				'NO_MEMBER_REGISTRY_PROVIDED',
				'Provided type: ' + typeof memberRegistry
			);
		}
		if (!(namespaceManager instanceof Picket.NamespaceManager)) {
			throw new _.Factory.Fatal(
				'NO_NAMESPACE_MANAGER_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		this._typeDefinitionFactory = typeDefinitionFactory;
		this._classFactory = classFactory;
		this._interfaceFactory = interfaceFactory;
		this._typeRegistry = typeRegistry;
		this._memberRegistry = memberRegistry;
		this._namespaceManager = namespaceManager;
	};
	
	_.Factory.prototype.build = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Factory.Fatal(
				'NON_STRING_SIGNATURE_PROVIDED',
				'Provided type: ' + typeof signature
			);
		}
		if (signature === '') {
			throw new _.Factory.Fatal('EMPTY_STRING_SIGNATURE_PROVIDED');
		}
		var definition = this._typeDefinitionFactory.build(signature);
		if (definition instanceof _.Class.Definition) {
			var classObject = this._classFactory.build(
				definition,
				this._typeRegistry,
				this._memberRegistry,
				this._namespaceManager
			);
			if (!(classObject instanceof Picket.Type.Class)) {
				throw new _.Factory.Fatal(
					'NON_CLASS_RETURNED_FROM_FACTORY',
					'Returned type: ' + typeof classObject
				);
			}
			return classObject;
		} else if (definition instanceof _.Interface.Definition) {
			var interfaceObject = this._interfaceFactory.build(definition);
			if (!(interfaceObject instanceof Picket.Type.Interface)) {
				throw new _.Factory.Fatal(
					'NON_INTERFACE_RETURNED_FROM_FACTORY',
					'Returned type: ' + typeof interfaceObject
				);
			}
			return interfaceObject;
		} else {
			throw new _.Factory.Fatal(
				'NON_DEFINITION_RETURNED_FROM_FACTORY',
				'Returned type: ' + typeof definition
			);
		}
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {}
);
