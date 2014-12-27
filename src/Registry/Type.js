;(function(ClassyJS, _){
	
	_.Type = function(namespaceManager)
	{
		if (!(namespaceManager instanceof ClassyJS.NamespaceManager)) {
			throw new _.Type.Fatal(
				'NON_NAMESPACE_MANAGER_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		this._classes = [];
		this._instances = [];
		this._interfaces = {};
		this._namespaceManager = namespaceManager;
	};
	
	_.Type.prototype.registerClass = function(classObject, classConstructor)
	{
		if (!(classObject instanceof ClassyJS.Type.Class)) {
			throw new _.Type.Fatal(
				'NON_CLASS_OBJECT_PROVIDED',
				'Provided type: ' + typeof classObject
			);
		}
		if (typeof classConstructor != 'function') {
			throw new _.Type.Fatal(
				'NON_CLASS_CONSTRUCTOR_PROVIDED',
				'Provided type: ' + typeof classConstructor
			);
		}
		if (_classObjectIsRegistered(this, classObject)) {
			throw new _.Type.Fatal('CLASS_ALREADY_REGISTERED');
		}
		this._classes.push({
			classObject:		classObject,
			constructor:		classConstructor,
			interfaces:			[],
			parentClassName:	undefined
		});
	};
	
	_.Type.prototype.registerClassChild = function(parentClassName, childClassObject)
	{
		if (typeof parentClassName != 'string') {
			throw new _.Type.Fatal(
				'NON_STRING_PARENT_PROVIDED',
				'Provided type: ' + typeof parentClassName
			);
		}
		if (!(childClassObject instanceof ClassyJS.Type.Class)) {
			throw new _.Type.Fatal(
				'NON_CLASS_OBJECT_PROVIDED',
				'Provided type: ' + typeof childClassObject
			);
		}
		if (!_classObjectIsRegistered(this, childClassObject)) {
			throw new _.Type.Fatal('CHILD_CLASS_NOT_REGISTERED');
		}
		_getClassData(this, childClassObject).parentClassName = parentClassName;
	};
	
	_.Type.prototype.registerClassInstance = function(instanceObjects)
	{
		if (Object.prototype.toString.call(instanceObjects) != '[object Array]') {
			throw new _.Type.Fatal(
				'NON_ARRAY_CLASS_INSTANCE_PROVIDED',
				'Provided type: ' + typeof instanceObjects
			);
		}
		if (instanceObjects.length == 1 && typeof instanceObjects[0] == 'object') {
			throw new _.Type.Fatal('SINGLE_CLASS_INSTANCE_PROVIDED');
		}
		var expectedParent;
		for (var i = 0; i < instanceObjects.length; i++) {
			if (typeof instanceObjects[i] != 'object') {
				throw new _.Type.Fatal(
					'NON_OBJECT_CLASS_INSTANCE_PROVIDED',
					'Provided type: ' + typeof instanceObjects[i]
				);
			}
			var classObject = this.getClass(instanceObjects[i]);
			if (i > 0 && classObject !== expectedParent) {
				throw new _.Type.Fatal('INVALID_CLASS_HIERARCHY_INSTANCE_REGISTERED');
			}
			expectedParent = (this.hasParent(classObject))
				? this.getParent(classObject)
				: undefined;
		}
		if (expectedParent) {
			throw new _.Type.Fatal('INCOMPLETE_CLASS_HIERARCHY_INSTANCE_REGISTERED');
		}
		for (var i in this._instances) {
			if (this._instances[i][0] === instanceObjects[0]) {
				throw new _.Type.Fatal('CLASS_INSTANCE_ALREADY_REGISTERED');
			}
		}
		this._instances.push(instanceObjects);
	};
	
	_.Type.prototype.registerInterface = function(interfaceObject)
	{
		this._interfaces[interfaceObject.getName()] = interfaceObject;
	};
	
	_.Type.prototype.registerInterfaceAgainstClass = function(interfaceName, classObject)
	{
		if (typeof interfaceName != 'string') {
			throw new _.Type.Fatal(
				'NON_STRING_INTERFACE_NAME_PROVIDED',
				'Provided type: ' + typeof interfaceName
			);
		}
		if (!(classObject instanceof ClassyJS.Type.Class)) {
			throw new _.Type.Fatal(
				'NON_CLASS_OBJECT_PROVIDED',
				'Provided type: ' + typeof classObject
			);
		}
		if (!_classObjectIsRegistered(this, classObject)) {
			throw new _.Type.Fatal('CLASS_NOT_REGISTERED');
		}
		_getClassData(this, classObject).interfaces.push(interfaceName);
	};
	
	_.Type.prototype.classExists = function(classIdentifier)
	{
		// @todo Method untested
		try {
			this.getClass(classIdentifier);
		} catch (error) {
			if (error instanceof _.Type.Fatal && error.code == 'CLASS_NOT_REGISTERED') return false;
			throw error;
		}
		return true;
	};
	
	_.Type.prototype.getClass = function(classIdentifier)
	{
		if (typeof classIdentifier != 'object' && typeof classIdentifier != 'function') {
			throw new _.Type.Fatal(
				'INVALID_CLASS_LOOKUP',
				'Provided type: ' + typeof classIdentifier
			);
		}
		if (typeof classIdentifier == 'object') classIdentifier = classIdentifier.constructor;
		var classData = _getClassData(this, classIdentifier);
		if (classData) return classData.classObject;
		throw new _.Type.Fatal('CLASS_NOT_REGISTERED');
	};
	
	_.Type.prototype.getInterface = function(name)
	{
		return this._interfaces[name];
	}
	
	_.Type.prototype.getInterfacesFromClass = function(classObject)
	{
		if (!(classObject instanceof ClassyJS.Type.Class)) {
			throw new _.Type.Fatal(
				'NON_CLASS_OBJECT_PROVIDED',
				'Provided type: ' + typeof classObject
			);
		}
		if (!_classObjectIsRegistered(this, classObject)) {
			throw new _.Type.Fatal('CLASS_NOT_REGISTERED');
		}
		var interfaces = [];
		do {
			var interfaceNames = _getClassData(this, classObject).interfaces;
			for (var i in interfaceNames) {
				interfaces.push(this.getInterface(interfaceNames[i]));
			}
			var hasParent = this.hasParent(classObject);
			if (hasParent) classObject = this.getParent(classObject);
		} while (hasParent);
		return interfaces;
	};
	
	_.Type.prototype.hasParent = function(classObject)
	{
		try {
			this.getParent(classObject);
			return true;
		} catch (error) {
			if (error instanceof _.Type.Fatal && error.code == 'NON_EXISTENT_PARENT_REQUESTED') {
				return false;
			}
			throw error;
		}
	};
	
	_.Type.prototype.getParent = function(classObject)
	{
		var originalClassObject = classObject;
		var returnType = (typeof classObject == 'object')
			? ((classObject instanceof ClassyJS.Type.Class) ? 'classObject' : 'instance')
			: 'constructor';
		if (typeof classObject == 'object' && !(classObject instanceof ClassyJS.Type.Class)) {
			classObject = classObject.constructor;
		}
		if (typeof classObject == 'function') classObject = this.getClass(classObject);
		if (!(classObject instanceof ClassyJS.Type.Class)) {
			throw new _.Type.Fatal(
				'NON_CLASS_CONSTRUCTOR_OR_INSTANCE_PROVIDED',
				'Provided type: ' + typeof originalClassObject
			);
		}
		if (returnType == 'classObject' || returnType == 'constructor') {
			var classData = _getClassData(this, classObject);
			if (classData) {
				if (!classData.parentClassName) {
					throw new _.Type.Fatal('NON_EXISTENT_PARENT_REQUESTED');
				}
				var parentConstructor = this._namespaceManager.getNamespaceObject(
					classData.parentClassName
				);
				var parentClassObject = this.getClass(parentConstructor);
				if (returnType == 'classObject') return parentClassObject;
				if (returnType == 'constructor') {
					return _getClassData(this, parentClassObject).constructor;
				}
			}
		} else if (returnType == 'instance') {
			for (var i in this._instances) {
				for (var j in this._instances[i]) {
					j = parseInt(j);
					if (this._instances[i][j] === originalClassObject) {
						if (typeof this._instances[i][j+1] == 'undefined') {
							throw new _.Type.Fatal('NON_EXISTENT_PARENT_REQUESTED');
						}
						return this._instances[i][j+1];
					}
				}
			}
			throw new _.Type.Fatal('NON_EXISTENT_PARENT_REQUESTED');
		}
		throw new _.Type.Fatal('CLASS_NOT_REGISTERED');
	};
	
	_.Type.prototype.getInstantiatedInstance = function(classInstance)
	{
		if (typeof classInstance != 'object') {
			throw new _.Type.Fatal(
				'NON_CLASS_INSTANCE_PROVIDED',
				'Provided type: ' + typeof classInstance
			);
		}
		this.getClass(classInstance);
		for (var i in this._instances) {
			for (var j in this._instances[i]) {
				if (this._instances[i][j] === classInstance) return this._instances[i][0];
			}
		}
		return classInstance;
	};
	
	var _getClassData = function(_this, classIdentifier)
	{
		for (var i in _this._classes) {
			if (_this._classes[i].classObject === classIdentifier) return _this._classes[i];
			if (_this._classes[i].constructor === classIdentifier) return _this._classes[i];
		}
	};
	
	var _classObjectIsRegistered = function(_this, classObject)
	{
		return (_getClassData(_this, classObject)) ? true : false;
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Registry = window.ClassyJS.Registry || {}
);
