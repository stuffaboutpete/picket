(function(Picket, _){
	
	_.Property = function(definition, isFromInterface, value, typeChecker, accessController)
	{
		if (!(definition instanceof Picket.Member.Property.Definition)) {
			throw new _.Property.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (isFromInterface !== false) {
			throw new _.Property.Fatal('PROPERTY_CANNOT_BE_DEFINED_BY_INTERFACE');
		}
		if (typeof value == 'undefined') throw new _.Property.Fatal('NO_DEFAULT_VALUE_PROVIDED');
		if (!(typeChecker instanceof Picket.TypeChecker)) {
			throw new _.Property.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof Picket.Access.Controller)) {
			throw new _.Property.Fatal(
				'NO_ACCESS_CONTROLLER_PROVIDED',
				'Provided type: ' + typeof accessController
			);
		}
		if (value !== null && typeof value != 'undefined' && value !== '') {
			var expectedType = definition.getTypeIdentifier();
			var isValidType = typeChecker.isValidType(value, expectedType);
			if (isValidType !== true) {
				throw new _.Property.Fatal(
					'INVALID_DEFAULT_VALUE',
					'Provided type: ' + typeof value + '; ' +
					'Expected type: ' + expectedType
				);
			}
		}
		this._definition = definition;
		this._defaultValue = value;
		this._typeChecker = typeChecker;
		this._accessController = accessController;
	};
	
	_.Property.prototype.getTypeIdentifier = function()
	{
		return this._definition.getTypeIdentifier();
	};
	
	_.Property.prototype.getAccessTypeIdentifier = function()
	{
		// @todo Method not tested
		return this._definition.getAccessTypeIdentifier();
	};
	
	_.Property.prototype.getDefaultValue = function(targetInstance, accessInstance)
	{
		// @todo This if statement is a hack - this
		// class shouldn't be handling access control
		// and its an issue for the Reflection.Property.
		// Original state commented below.
		// Also, related test disabled.
		if (targetInstance && accessInstance) {
			_requestAccess(this, targetInstance, accessInstance);
		}
		// _requestAccess(this, targetInstance, accessInstance);
		if (this._defaultValue !== null) {
			if (Object.prototype.toString.call(this._defaultValue) == '[object Array]') {
				var newArray = [];
				for (var i = 0; i < this._defaultValue.length; i++) {
					newArray.push(this._defaultValue[i]);
				}
				return newArray;
			}
			if (typeof this._defaultValue == 'object') {
				var newObject = {};
				for (var key in this._defaultValue) {
					newObject[key] = this._defaultValue[key];
				}
				return newObject;
			}
		}
		return this._defaultValue;
	};
	
	_.Property.prototype.getName = function()
	{
		return this._definition.getName();
	};
	
	_.Property.prototype.set = function(targetInstance, accessInstance, value)
	{
		_requestAccess(this, targetInstance, accessInstance);
		_checkType(this, value);
		return value;
	};
	
	_.Property.prototype.get = function(targetInstance, accessInstance, value)
	{
		_requestAccess(this, targetInstance, accessInstance);
		_checkType(this, value);
		return value;
	};
	
	var _requestAccess = function(_this, targetInstance, accessInstance)
	{
		if (typeof targetInstance != 'object') {
			throw new _.Property.Fatal(
				'NON_OBJECT_TARGET_INSTANCE_PROVIDED',
				'Provided type: ' + typeof targetInstance
			);
		}
		var accessType = _this._definition.getAccessTypeIdentifier();
		var canAccess = _this._accessController.canAccess(
			targetInstance,
			accessInstance,
			accessType
		);
		if (canAccess !== true) {
			throw new _.Property.Fatal(
				'ACCESS_NOT_ALLOWED',
				'Access type: ' + accessType
			);
		}
	};
	
	var _checkType = function(_this, value)
	{
		var allowedType = _this._definition.getTypeIdentifier();
		var validType = _this._typeChecker.isValidType(
			value,
			allowedType
		);
		if (validType !== true) {
			throw new _.Property.Fatal(
				'INVALID_TYPE',
				'Allowed type: ' + allowedType + '; ' +
				'Provided type: ' + typeof value
			);
		}
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {}
);
