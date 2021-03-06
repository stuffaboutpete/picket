(function(Picket, _){
	
	_.Factory = function(
		memberDefinitionFactory,
		propertyFactory,
		methodFactory,
		eventFactory,
		constantFactory,
		typeChecker,
		accessController
	)
	{
		if (!(memberDefinitionFactory instanceof Picket.Member.DefinitionFactory)) {
			throw new _.Factory.Fatal(
				'NO_DEFINITION_FACTORY_PROVIDED',
				'Provided type: ' + typeof memberDefinitionFactory
			);
		}
		if (!(propertyFactory instanceof Picket.Member.Property.Factory)) {
			throw new _.Factory.Fatal(
				'NO_PROPERTY_FACTORY_PROVIDED',
				'Provided type: ' + typeof propertyFactory
			);
		}
		if (!(methodFactory instanceof Picket.Member.Method.Factory)) {
			throw new _.Factory.Fatal(
				'NO_METHOD_FACTORY_PROVIDED',
				'Provided type: ' + typeof methodFactory
			);
		}
		if (!(eventFactory instanceof Picket.Member.Event.Factory)) {
			throw new _.Factory.Fatal(
				'NO_EVENT_FACTORY_PROVIDED',
				'Provided type: ' + typeof eventFactory
			);
		}
		if (!(constantFactory instanceof Picket.Member.Constant.Factory)) {
			throw new _.Factory.Fatal(
				'NO_CONSTANT_FACTORY_PROVIDED',
				'Provided type: ' + typeof constantFactory
			);
		}
		if (!(typeChecker instanceof Picket.TypeChecker)) {
			throw new _.Factory.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof Picket.Access.Controller)) {
			throw new _.Factory.Fatal(
				'NO_ACCESS_CONTROLLER_PROVIDED',
				'Provided type: ' + typeof accessController
			);
		}
		this._memberDefinitionFactory = memberDefinitionFactory;
		this._propertyFactory = propertyFactory;
		this._methodFactory = methodFactory;
		this._eventFactory = eventFactory;
		this._constantFactory = constantFactory;
		this._typeChecker = typeChecker;
		this._accessController = accessController;
	};
	
	_.Factory.prototype.build = function(signature, isFromInterface, value)
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
		if (typeof isFromInterface != 'boolean') {
			throw new _.Factory.Fatal(
				'NON_BOOLEAN_INTERFACE_INDICATOR_PROVIDED',
				'Provided type: ' + typeof isFromInterface
			);
		}
		var definition = this._memberDefinitionFactory.build(signature, typeof value == 'function');
		if (definition instanceof _.Property.Definition) {
			var propertyObject = this._propertyFactory.build(
				definition,
				isFromInterface,
				value,
				this._typeChecker,
				this._accessController
			);
			if (!(propertyObject instanceof Picket.Member.Property)) {
				throw new _.Factory.Fatal(
					'NON_PROPERTY_RETURNED_FROM_FACTORY',
					'Returned type: ' + typeof propertyObject
				);
			}
			return propertyObject;
		} else if (definition instanceof _.Method.Definition) {
			var methodObject = this._methodFactory.build(
				definition,
				isFromInterface,
				value,
				this._typeChecker,
				this._accessController
			);
			if (!(methodObject instanceof Picket.Member.Method)) {
				throw new _.Factory.Fatal(
					'NON_METHOD_RETURNED_FROM_FACTORY',
					'Returned type: ' + typeof methodObject
				);
			}
			return methodObject;
		} else if (definition instanceof _.Event.Definition) {
			var eventObject = this._eventFactory.build(
				definition,
				isFromInterface,
				undefined,
				this._typeChecker,
				this._accessController
			);
			if (!(eventObject instanceof Picket.Member.Event)) {
				throw new _.Factory.Fatal(
					'NON_EVENT_RETURNED_FROM_FACTORY',
					'Returned type: ' + typeof eventObject
				);
			}
			return eventObject;
		} else if (definition instanceof _.Constant.Definition) {
			var constantObject = this._constantFactory.build(
				definition,
				isFromInterface,
				value,
				this._typeChecker,
				this._accessController
			);
			if (!(constantObject instanceof Picket.Member.Constant)) {
				throw new _.Factory.Fatal(
					'NON_CONSTANT_RETURNED_FROM_FACTORY',
					'Returned type: ' + typeof constantObject
				);
			}
			return constantObject;
		} else {
			throw new _.Factory.Fatal(
				'NON_DEFINITION_RETURNED_FROM_FACTORY',
				'Returned type: ' + typeof definition
			);
		}
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {}
);
