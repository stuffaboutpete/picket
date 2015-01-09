;(function(ClassyJS, _){
	
	_.Controller = function(typeRegistry)
	{
		if (!(typeRegistry instanceof ClassyJS.Registry.Type)) {
			throw new _.Controller.Fatal(
				'NO_TYPE_REGISTRY_PROVIDED',
				'Provided type: ' + typeof typeRegistry
			);
		}
		this._typeRegistry = typeRegistry;
	};
	
	_.Controller.prototype.canAccess = function(target, accessObject, identifier)
	{
		if (typeof target != 'object' && typeof target != 'function') {
			throw new _.Controller.Fatal(
				'TARGET_NOT_INSTANCE_OR_CONSTRUCTOR',
				'Provided type: ' + typeof target
			);
		}
		if (typeof accessObject != 'object' && typeof accessObject != 'function' && accessObject !== undefined) {
			throw new _.Controller.Fatal(
				'ACCESS_OBJECT_NOT_INSTANCE_OR_CONSTRUCTOR_OR_UNDEFINED',
				'Provided type: ' + typeof accessObject
			);
		}
		if (typeof identifier != 'string') {
			throw new _.Controller.Fatal(
				'ACCESS_IDENTIFIER_NOT_STRING',
				'Provided type: ' + typeof identifier
			);
		}
		if (['public', 'private', 'protected'].indexOf(identifier) < 0) {
			throw new _.Controller.Fatal(
				'ACCESS_IDENTIFIER_NOT_VALID_STRING',
				'Provided identifier: ' + identifier
			);
		}
		if (identifier == 'public') return true;
		if (!accessObject) return false;
		if (target === accessObject) return true;
		if (identifier == 'private') return false;
		return this._typeRegistry.isSameObject(target, accessObject);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Access = window.ClassyJS.Access || {}
);
