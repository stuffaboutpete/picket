(function(ClassyJS, _){
	
	_.Event = function(definition, isFromInterface, value, typeChecker, accessController)
	{
		if (!(definition instanceof ClassyJS.Member.Event.Definition)) {
			throw new _.Event.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (!(typeChecker instanceof ClassyJS.TypeChecker)) {
			throw new _.Event.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof ClassyJS.Access.Controller)) {
			throw new _.Event.Fatal(
				'NO_ACCESS_CONTROLLER_PROVIDED',
				'Provided type: ' + typeof accessController
			);
		}
		if (value !== null && value !== undefined && value !== '') {
			throw new _.Event.Fatal(
				'INVALID_VALUE_PROVIDED',
				'Provided type: ' + typeof value
			);
		}
		var types = definition.getArgumentTypeIdentifiers();
		for (var i = 0; i < types.length; i++) {
			if (types[i] === 'undefined') throw new _.Event.Fatal('UNDEFINED_ARGUMENT_TYPE');
			if (types[i] === 'null') throw new _.Event.Fatal('NULL_ARGUMENT_TYPE');
		}
		this._definition = definition;
		this._isAbstract = isFromInterface;
		this._typeChecker = typeChecker;
		this._accessController = accessController;
	};
	
	_.Event.prototype.getName = function()
	{
		return this._definition.getName();
	};
	
	_.Event.prototype.getArgumentTypeIdentifiers = function()
	{
		return this._definition.getArgumentTypeIdentifiers();
	};
	
	_.Event.prototype.getAccessTypeIdentifier = function()
	{
		// @todo Method untested
		return this._definition.getAccessTypeIdentifier();
	};
	
	_.Event.prototype.requestBind = function(targetInstance, accessInstance)
	{
		if (this._isAbstract) throw new _.Event.Fatal('INTERACTION_WITH_ABSTRACT');
		if (typeof targetInstance != 'object') {
			throw new _.Event.Fatal(
				'NON_OBJECT_TARGET_INSTANCE_PROVIDED',
				'Provided type: ' + typeof targetInstance
			);
		}
		if (typeof accessInstance != 'object') {
			throw new _.Event.Fatal(
				'NON_OBJECT_ACCESS_INSTANCE_PROVIDED',
				'Provided type: ' + typeof accessInstance
			);
		}
		var accessType = this._definition.getAccessTypeIdentifier();
		var canAccess = this._accessController.canAccess(
			targetInstance,
			accessInstance,
			accessType
		);
		if (canAccess !== true) {
			throw new _.Event.Fatal(
				'ACCESS_NOT_ALLOWED',
				'Access type: ' + accessType
			);
		}
		this._accessController.canAccess(
			targetInstance,
			accessInstance,
			this._definition.getAccessTypeIdentifier()
		);
		return true;
	};
	
	_.Event.prototype.trigger = function(callbacks, arguments)
	{
		if (this._isAbstract) throw new _.Event.Fatal('INTERACTION_WITH_ABSTRACT');
		if (Object.prototype.toString.call(callbacks) != '[object Array]') {
			throw new _.Event.Fatal(
				'NON_ARRAY_CALLBACKS_PROVIDED',
				'Provided type: ' + typeof callbacks
			);
		}
		for (var i in callbacks) {
			if (Object.prototype.toString.call(callbacks[i]) != '[object Array]') {
				throw new _.Event.Fatal(
					'NON_ARRAY_CALLBACK_PROVIDED',
					'Provided type: ' + typeof callbacks[i]
				);
			}
			if (typeof callbacks[i][0] != 'object') {
				throw new _.Event.Fatal(
					'NON_OBJECT_CALLBACK_INSTANCE',
					'Provided type: ' + typeof callbacks[i][0]
				);
			}
			if (!(callbacks[i][1] instanceof ClassyJS.Member.Method)) {
				throw new _.Event.Fatal(
					'INVALID_CALLBACK_METHOD',
					'Provided type: ' + typeof callbacks[i][1]
				);
			}
		}
		if (Object.prototype.toString.call(arguments) != '[object Array]') {
			throw new _.Event.Fatal(
				'NON_ARRAY_ARGUMENTS_PROVIDED',
				'Provided type: ' + typeof arguments
			);
		}
		var areValid = this._typeChecker.areValidTypes(
			arguments,
			this._definition.getArgumentTypeIdentifiers()
		);
		if (areValid !== true) throw new _.Event.Fatal('INVALID_ARGUMENTS');
		for (var i in callbacks) callbacks[i][1].call(
			callbacks[i][0],
			callbacks[i][0],
			callbacks[i][0],
			arguments
		);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {}
);
