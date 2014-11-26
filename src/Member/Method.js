(function(ClassyJS, _){
	
	_.Method = function(definition, isFromInterface, value, typeChecker, accessController)
	{
		if (!(definition instanceof ClassyJS.Member.Method.Definition)) {
			throw new _.Method.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (!(typeChecker instanceof ClassyJS.TypeChecker)) {
			throw new _.Method.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof ClassyJS.Access.Controller)) {
			throw new _.Method.Fatal(
				'NO_ACCESS_CONTROLLER_PROVIDED',
				'Provided type: ' + typeof accessController
			);
		}
		if (isFromInterface === true || definition.isAbstract() === true) {
			if (value !== null && typeof value != 'undefined' && value !== '') {
				throw new _.Method.Fatal('UNEXPECTED_IMPLEMENTATION');
			}
			this._isAbstract = true;
		} else {
			if (typeof value != 'function') {
				throw new _.Method.Fatal(
					'NON_FUNCTION_IMPLEMENTATION',
					'Provided type: ' + typeof value
				);
			}
			this._isAbstract = false;
		}
		var types = definition.getArgumentTypeIdentifiers();
		for (var i = 0; i < types.length; i++) {
			if (types[i] === 'undefined') throw new _.Method.Fatal('UNDEFINED_ARGUMENT_TYPE');
			if (types[i] === 'null') throw new _.Method.Fatal('NULL_ARGUMENT_TYPE');
		}
		this._value = value;
		this._definition = definition;
		this._typeChecker = typeChecker;
		this._accessController = accessController;
	};
	
	_.Method.prototype.getName = function()
	{
		return this._definition.getName();
	};
	
	_.Method.prototype.getArgumentTypes = function()
	{
		return this._definition.getArgumentTypeIdentifiers();
	};
	
	_.Method.prototype.getReturnType = function()
	{
		// @todo Untested method
		return this._definition.getReturnTypeIdentifier();
	};
	
	_.Method.prototype.isStatic = function()
	{
		return this._definition.isStatic();
	};
	
	_.Method.prototype.isAbstract = function()
	{
		return this._isAbstract;
	};
	
	_.Method.prototype.call = function(target, accessInstance, args, scopeVariables)
	{
		if (this._isAbstract) throw new _.Method.Fatal('INTERACTION_WITH_ABSTRACT');
		if (typeof target != 'object' && typeof target != 'function') {
			throw new _.Method.Fatal(
				'NON_OBJECT_OR_CONSTRUCTOR_TARGET_PROVIDED',
				'Provided type: ' + typeof target
			);
		}
		if (typeof accessInstance != 'object') {
			throw new _.Method.Fatal(
				'NON_OBJECT_ACCESS_INSTANCE_PROVIDED',
				'Provided type: ' + typeof accessInstance
			);
		}
		if (Object.prototype.toString.call(args) != '[object Array]') {
			throw new _.Method.Fatal(
				'NON_ARRAY_ARGUMENTS_PROVIDED',
				'Provided type: ' + typeof args
			);
		}
		if (typeof scopeVariables != 'undefined' && typeof scopeVariables != 'object') {
			throw new _.Method.Fatal(
				'NON_OBJECT_SCOPE_VARIABLES',
				'Provided type: ' + typeof scopeVariables
			);
		}
		var canAccess = this._accessController.canAccess(
			target,
			accessInstance,
			this._definition.getAccessTypeIdentifier()
		);
		if (canAccess !== true) throw new _.Method.Fatal('ACCESS_NOT_ALLOWED');
		var areValidTypes = this._typeChecker.areValidTypes(args, this.getArgumentTypes());
		if (areValidTypes !== true) throw new _.Method.Fatal('INVALID_ARGUMENTS');
		this._value.$$owner = target;
		var that = this;
		var returnValue = (function(){
			if (scopeVariables) {
				for (var i in scopeVariables) {
					this[i] = scopeVariables[i];
				}
			}
			return that._value.apply(target, args);
		})();
		delete this._value.$$owner;
		var isValidType = this._typeChecker.isValidType(
			returnValue,
			this._definition.getReturnTypeIdentifier()
		);
		if (isValidType !== true) {
			throw new _.Method.Fatal(
				'INVALID_RETURN_VALUE',
				'Returned type: ' + typeof returnValue + '; ' +
				'Expected type: ' + this._definition.getReturnTypeIdentifier()
			);
		}
		return returnValue;
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {}
);
