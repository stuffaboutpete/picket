(function(ClassyJS, _){
	
	_.Constant = function(definition, isFromInterface, value, typeChecker, accessController)
	{
		if (!(definition instanceof ClassyJS.Member.Constant.Definition)) {
			throw new _.Constant.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (isFromInterface !== false) {
			throw new _.Constant.Fatal('IS_FROM_INTERFACE');
		}
		if (!(typeChecker instanceof ClassyJS.TypeChecker)) {
			throw new _.Constant.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof ClassyJS.Access.Controller)) {
			throw new _.Constant.Fatal(
				'NO_ACCESS_CONTROLLER_PROVIDED',
				'Provided type: ' + typeof accessController
			);
		}
		if (['undefined', 'string', 'number'].indexOf(typeof value) == -1) {
			throw new _.Constant.Fatal(
				'INVALID_VALUE_TYPE',
				'Provided type: ' + typeof value
			);
		}
		if (typeof value != 'undefined') {
			var typeIdentifier = definition.getTypeIdentifier();
			var isValid = typeChecker.isValidType(value, typeIdentifier);
			if (isValid !== true) {
				throw new _.Constant.Fatal(
					'INVALID_VALUE',
					'Constant type: ' + typeIdentifier
				);
			}
		} else {
			value = _generateValue(definition.getTypeIdentifier());
		}
		this._value = value;
		this._definition = definition;
		this._accessController = accessController;
	};
	
	_.Constant.prototype.getName = function()
	{
		return this._definition.getName();
	};
	
	_.Constant.prototype.get = function(targetConstructor, accessInstance)
	{
		if (typeof targetConstructor != 'function') {
			throw new _.Constant.Fatal(
				'NON_FUNCTION_TARGET_CONSTRUCTOR_PROVIDED',
				'Provided type: ' + typeof targetConstructor
			);
		}
		if (typeof accessInstance != 'object') {
			throw new _.Constant.Fatal(
				'NON_OBJECT_ACCESS_INSTANCE_PROVIDED',
				'Provided type: ' + typeof accessInstance
			);
		}
		var canAccess = this._accessController.canAccess(
			targetConstructor,
			accessInstance,
			this._definition.getAccessTypeIdentifier()
		);
		if (canAccess !== true) throw new _.Constant.Fatal('ACCESS_NOT_ALLOWED');
		return this._value;
	};
	
	var _generateValue = function(type)
	{
		if (type == 'string') {
			var string = '';
			var chars = [
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
				'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
				'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
				'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
			];
			for (var i = 0; i < 32; i++) {
				var randomIndex = Math.floor(Math.random() * 26);
				string = string + chars[randomIndex];
			}
			return string;
		} else if (type == 'number') {
			return Math.floor(Math.random() * 9007199254740992);
		}
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {}
);
