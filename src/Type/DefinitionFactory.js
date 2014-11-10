;(function(ClassyJS, _){
	
	_.DefinitionFactory = function(classDefinitionFactory, interfaceDefinitionFactory)
	{
		if (!(classDefinitionFactory instanceof _.Class.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal(
				'CLASS_DEFINITION_FACTORY_NOT_PROVIDED',
				'Provided type: ' + typeof classDefinitionFactory
			);
		}
		if (!(interfaceDefinitionFactory instanceof _.Interface.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal(
				'INTERFACE_DEFINITION_FACTORY_NOT_PROVIDED',
				'Provided type: ' + typeof interfaceDefinitionFactory
			);
		}
		this._classDefinitionFactory = classDefinitionFactory;
		this._interfaceDefinitionFactory = interfaceDefinitionFactory;
	};
	
	_.DefinitionFactory.prototype.build = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.DefinitionFactory.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var classMatch = signature.match(/\bclass\b/);
		var interfaceMatch = signature.match(/\binterface\b/);
		if (classMatch && interfaceMatch || !classMatch && !interfaceMatch) {
			throw new _.DefinitionFactory.Fatal('AMBIGUOUS_SIGNATURE');
		}
		var factory = (classMatch)
			? this._classDefinitionFactory
			: this._interfaceDefinitionFactory;
		var returnObject = factory.build(signature);
		if (typeof returnObject != 'object') {
			throw new _.DefinitionFactory.Fatal(
				'FACTORY_RETURNED_NON_OBJECT',
				'Returned type: ' + typeof returnObject
			);
		}
		return returnObject;
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {}
);
