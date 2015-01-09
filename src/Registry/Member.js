;(function(ClassyJS, _){
	
	// @todo Ensure all public method args are type checked
	
	_.Member = function(typeRegistry, typeChecker)
	{
		if (!(typeRegistry instanceof _.Type)) {
			throw new _.Member.Fatal(
				'TYPE_REGISTRY_REQUIRED',
				'Provided type: ' + typeof typeRegistry
			);
		}
		if (!(typeChecker instanceof ClassyJS.TypeChecker)) {
			throw new _.Member.Fatal(
				'TYPE_CHECKER_REQUIRED',
				'Provided type: ' + typeof typeChecker
			);
		}
		this._typeRegistry = typeRegistry;
		this._typeChecker = typeChecker;
		this._typeMemberData = [];
		this._classInstanceData = [];
	};
	
	_.Member.prototype.register = function(memberObject, typeObject)
	{
		// @todo Type check first arg
		if (!(typeObject instanceof ClassyJS.Type.Class)
		&&	!(typeObject instanceof ClassyJS.Type.Interface)) {
			throw new _.Member.Fatal(
				'TARGET_NOT_CLASS_OR_INTERFACE',
				'Provided type: ' + typeof typeObject
			);
		}
		_ensureTypeIsInRegistry(this, typeObject);
		_storeMember(this, memberObject, typeObject);
	};
	
	_.Member.prototype.getMembers = function(typeObject)
	{
		if (!(typeObject instanceof ClassyJS.Type.Class)
		&&	!(typeObject instanceof ClassyJS.Type.Interface)) {
			throw new _.Member.Fatal(
				'TARGET_NOT_CLASS_OR_INTERFACE',
				'Provided type: ' + typeof typeObject
			);
		}
		var typeMemberData = _getTypeMemberDataFromTypeObject(this, typeObject);
		if (!typeMemberData) return [];
		var members = [];
		for (var i in typeMemberData.members.properties) {
			members.push(typeMemberData.members.properties[i]);
		}
		for (var i in typeMemberData.members.methods) {
			members.push(typeMemberData.members.methods[i]);
		}
		for (var i in typeMemberData.members.events) {
			members.push(typeMemberData.members.events[i]);
		}
		for (var i in typeMemberData.members.constants) {
			members.push(typeMemberData.members.constants[i]);
		}
		return members;
	};
	
	_.Member.prototype.hasAbstractMembers = function(classObject)
	{
		var members = _getAllMembers(this, classObject);
		return !_membersAreValid(members);
	};
	
	_.Member.prototype.hasUnimplementedInterfaceMembers = function(classObject)
	{
		// @todo Untested method
		var interfaces = this._typeRegistry.getInterfacesFromClass(classObject);
		var allMembers = [];
		var classMembers = _getAllMembers(this, classObject);
		for (var i in classMembers) {
			allMembers.push(classMembers[i]);
		}
		for (var i in interfaces) {
			var interfaceMembers = this.getMembers(interfaces[i]);
			for (var j in interfaceMembers) allMembers.push(interfaceMembers[j]);
		}
		return !_membersAreValid(allMembers);
	};
	
	_.Member.prototype.setPropertyValue = function(
		classInstance,
		accessInstance,
		name,
		value,
		originalClassInstance
	)
	{
		if (arguments.callee.caller != this.setPropertyValue) {
			return this.setPropertyValue(
				this._typeRegistry.getInstantiatedInstance(classInstance),
				accessInstance,
				name,
				value,
				originalClassInstance || classInstance
			);
		}
		var classObject = _getClassObjectFromInstanceOrConstructor(this, classInstance);
		try {
			var property = _getPropertyByName(this, classObject, name);
		} catch (error) {
			if (!(error instanceof _.Member.Fatal)
			||	error.code != 'PROPERTY_NOT_REGISTERED'
			||	!this._typeRegistry.hasParent(classInstance)) {
				throw error;
			}
			return this.setPropertyValue(
				this._typeRegistry.getParent(classInstance),
				accessInstance,
				name,
				value,
				originalClassInstance || classInstance
			);
		}
		value = property.set(originalClassInstance, accessInstance, value);
		_ensureClassInstanceIsInRegistry(this, classInstance);
		var classInstanceData = _getClassInstanceDataFromClassInstance(this, classInstance);
		classInstanceData.properties[name] = value;
	};
	
	_.Member.prototype.getPropertyValue = function(
		classInstance,
		accessInstance,
		name,
		originalClassInstance
	)
	{
		if (arguments.callee.caller != this.getPropertyValue) {
			return this.getPropertyValue(
				this._typeRegistry.getInstantiatedInstance(classInstance),
				accessInstance,
				name,
				originalClassInstance || classInstance
			);
		}
		_ensureClassInstanceIsInRegistry(this, classInstance);
		var classInstanceData = _getClassInstanceDataFromClassInstance(this, classInstance);
		var classObject = _getClassObjectFromInstanceOrConstructor(this, classInstance);
		try {
			var property = _getPropertyByName(this, classObject, name);
		} catch (error) {
			if (!(error instanceof _.Member.Fatal)
			||	error.code != 'PROPERTY_NOT_REGISTERED'
			||	!this._typeRegistry.hasParent(classInstance)) {
				throw error;
			}
			return this.getPropertyValue(
				this._typeRegistry.getParent(classInstance),
				accessInstance,
				name,
				originalClassInstance || classInstance
			);
		}
		if (classInstanceData && classInstanceData.properties.hasOwnProperty(name)) {
			return property.get(
				originalClassInstance,
				accessInstance,
				classInstanceData.properties[name]
			);
		}
		var defaultValue = property.getDefaultValue(originalClassInstance, accessInstance);
		classInstanceData.properties[name] = defaultValue;
		return defaultValue;
	};
	
	_.Member.prototype.callMethod = function(
		callTarget,
		accessInstance,
		name,
		args,
		finalCallTarget
	)
	{
		if (typeof callTarget != 'object' && typeof callTarget != 'function') {
			throw new _.Member.Fatal(
				'NON_CLASS_INSTANCE_OR_CONSTRUCTOR_PROVIDED',
				'Provided type: ' + typeof callTarget
			);
		}
		if (typeof name != 'string') {
			throw new _.Member.Fatal(
				'NON_STRING_METHOD_NAME_PROVIDED',
				'Provided type: ' + typeof name
			);
		}
		if (Object.prototype.toString.call(args) != '[object Array]') {
			throw new _.Member.Fatal(
				'NON_ARRAY_METHOD_ARGUMENTS_PROVIDED',
				'Provided type: ' + typeof args
			);
		}
		var shouldBeStatic = (typeof callTarget == 'function') ? true : false;
		var classObject = _getClassObjectFromInstanceOrConstructor(this, callTarget);
		var methods = _getAllMethodsByName(this, classObject, name);
		for (var i = 0; i < methods.length; i++) {
			var argumentTypes = methods[i].getArgumentTypes();
			if (args.length != argumentTypes.length) continue;
			if (shouldBeStatic != methods[i].isStatic()) continue;
			if (!this._typeChecker.areValidTypes(args, argumentTypes)) continue;
			if (this._typeRegistry.hasParent(finalCallTarget || callTarget)) {
				var scopeVariables = {
					parent: this._typeRegistry.getParent(finalCallTarget || callTarget)
				};
			}
			return methods[i].call(
				finalCallTarget || callTarget,
				callTarget,
				accessInstance,
				args,
				scopeVariables
			);
		}
		if (this._typeRegistry.hasParent(callTarget)) {
			return this.callMethod(
				this._typeRegistry.getParent(callTarget),
				accessInstance,
				name,
				args,
				finalCallTarget || callTarget
			);
		}
		throw new _.Member.Fatal(
			'METHOD_NOT_REGISTERED',
			'Provided name: ' + name
		);
	};
	
	_.Member.prototype.bindEvent = function(
		classInstance,
		name,
		targetObject,
		targetMethod,
		originalCallClassInstance
	)
	{
		if (arguments.callee.caller != this.bindEvent) {
			return this.bindEvent(
				this._typeRegistry.getInstantiatedInstance(classInstance),
				name,
				targetObject,
				targetMethod,
				originalCallClassInstance
			);
		}
		var classObject = _getClassObjectFromInstanceOrConstructor(this, classInstance);
		try {
			var eventObject = _getEventByName(this, classObject, name);
		} catch (error) {
			if (!(error instanceof _.Member.Fatal)
			||	error.code != 'EVENT_NOT_REGISTERED'
			||	!this._typeRegistry.hasParent(classInstance)) {
				throw error;
			}
			return this.bindEvent(
				this._typeRegistry.getParent(classInstance),
				name,
				targetObject,
				targetMethod,
				originalCallClassInstance || classInstance
			);
		}
		originalCallClassInstance = originalCallClassInstance || classInstance;
		classObject = _getClassObjectFromInstanceOrConstructor(this, targetObject);
		var bindAllowed = eventObject.requestBind(originalCallClassInstance, targetObject);
		if (bindAllowed !== true) throw new _.Member.Fatal('EVENT_BIND_NOT_PERMITTED');
		try {
			var methodObject = _getMethodByNameArgumentTypesAndStaticState(
				this,
				classObject,
				targetMethod,
				eventObject.getArgumentTypes(),
				false
			);
		} catch (error) {
			if (!(error instanceof _.Member.Fatal) || error.code != 'METHOD_NOT_REGISTERED') {
				throw error;
			} else if (this._typeRegistry.hasParent(targetObject)) {
				return this.bindEvent(
					classInstance,
					name,
					this._typeRegistry.getParent(targetObject),
					targetMethod,
					originalCallClassInstance
				);
			} else {
				throw new _.Member.Fatal(
					'EVENT_TARGET_METHOD_NOT_REGISTERED',
					'Event name: ' + name + '; ' +
					'Method name: ' + targetMethod
				);
			}
		}
		_ensureClassInstanceIsInRegistry(this, classInstance);
		var classInstanceData = _getClassInstanceDataFromClassInstance(this, classInstance);
		// @todo Check method isn't already registered (possibly before this point)
		if (typeof classInstanceData.eventCallbacks[name] == 'undefined') {
			classInstanceData.eventCallbacks[name] = [];
		}
		classInstanceData.eventCallbacks[name].push([targetObject, methodObject]);
	};
	
	_.Member.prototype.triggerEvent = function(classInstance, name, args)
	{
		if (arguments.callee.caller != this.triggerEvent) {
			return this.triggerEvent(
				this._typeRegistry.getInstantiatedInstance(classInstance),
				name,
				args
			);
		}
		_ensureClassInstanceIsInRegistry(this, classInstance);
		var classObject = _getClassObjectFromInstanceOrConstructor(this, classInstance);
		var classInstanceData = _getClassInstanceDataFromClassInstance(this, classInstance);
		try {
			var eventObject = _getEventByName(this, classObject, name);
		} catch (error) {
			if (!(error instanceof _.Member.Fatal)
			||	error.code != 'EVENT_NOT_REGISTERED'
			||	!this._typeRegistry.hasParent(classInstance)) {
				throw error;
			}
			return this.triggerEvent(
				this._typeRegistry.getParent(classInstance),
				name,
				args
			);
		}
		eventObject.trigger(classInstanceData.eventCallbacks[name] || [], args);
	};
	
	_.Member.prototype.getConstant = function(classConstructor, accessInstance, name)
	{
		if (typeof classConstructor != 'function') {
			throw new _.Member.Fatal('CONSTANT_RETRIEVED_AGAINST_CLASS_INSTANCE');
		}
		var classObject = _getClassObjectFromInstanceOrConstructor(this, classConstructor);
		try {
			var constantObject = _getConstantByName(this, classObject, name);
		} catch (error) {
			if (!(error instanceof _.Member.Fatal)
			||	error.code != 'CONSTANT_NOT_REGISTERED'
			||	!this._typeRegistry.hasParent(classConstructor)) {
				throw error;
			}
			return this.getConstant(
				this._typeRegistry.getParent(classConstructor),
				accessInstance,
				name
			);
		}
		return constantObject.get(classConstructor, accessInstance);
	};
	
	var _ensureTypeIsInRegistry = function(_this, typeObject)
	{
		for (var i = 0; i < _this._typeMemberData.length; i++) {
			if (_this._typeMemberData[i].typeObject === typeObject) return;
		}
		_this._typeMemberData.push({
			typeObject:	typeObject,
			members:		{
				properties:	[],
				methods:	[],
				events:		[],
				constants:	[],
			}
		});
	};
	
	var _ensureClassInstanceIsInRegistry = function(_this, classInstance)
	{
		for (var i = 0; i < _this._classInstanceData.length; i++) {
			if (_this._classInstanceData[i].classInstance === classInstance) return;
		}
		_this._classInstanceData.push({
			classInstance:	classInstance,
			properties:		{},
			eventCallbacks:	{}
		});
	};
	
	var _storeMember = function(_this, memberObject, typeObject)
	{
		var memberName = memberObject.getName();
		if (memberObject instanceof ClassyJS.Member.Property) {
			var propertyExists = true;
			try {
				_getPropertyByName(_this, typeObject, memberName);
			} catch (error) {
				if (error instanceof _.Member.Fatal && error.code == 'PROPERTY_NOT_REGISTERED') {
					propertyExists = false;
				} else {
					throw error;
				}
			}
			if (propertyExists) {
				throw new _.Member.Fatal(
					'PROPERTY_ALREADY_REGISTERED',
					'Property name: ' + memberName
				);
			}
			var typeMemberData = _getTypeMemberDataFromTypeObject(
				_this,
				typeObject
			);
			typeMemberData.members.properties.push(memberObject);
		} else if (memberObject instanceof ClassyJS.Member.Method) {
			var methodExists = true;
			try {
				_getMethodByNameArgumentTypesAndStaticState(
					_this,
					typeObject,
					memberName,
					memberObject.getArgumentTypes(),
					memberObject.isStatic()
				);
			} catch (error) {
				if (error instanceof _.Member.Fatal && error.code == 'METHOD_NOT_REGISTERED') {
					methodExists = false;
				} else {
					throw error;
				}
			}
			if (methodExists) {
				throw new _.Member.Fatal(
					'METHOD_ALREADY_REGISTERED',
					'Method name: ' + memberName + '; ' +
					'Argument types: ' + (memberObject.getArgumentTypes().join(', ') || '(none)') +
					'; ' +
					'Is static: ' + (memberObject.isStatic() ? 'true' : 'false')
				);
			}
			var typeMemberData = _getTypeMemberDataFromTypeObject(
				_this,
				typeObject
			);
			typeMemberData.members.methods.push(memberObject);
		} else if (memberObject instanceof ClassyJS.Member.Event) {
			var eventExists = true;
			try {
				_getEventByName(_this, typeObject, memberName);
			} catch (error) {
				if (error instanceof _.Member.Fatal && error.code == 'EVENT_NOT_REGISTERED') {
					eventExists = false;
				} else {
					throw error;
				}
			}
			if (eventExists) {
				throw new _.Member.Fatal(
					'EVENT_ALREADY_REGISTERED',
					'Event name: ' + memberName
				);
			}
			var typeMemberData = _getTypeMemberDataFromTypeObject(
				_this,
				typeObject
			);
			typeMemberData.members.events.push(memberObject);
		} else if (memberObject instanceof ClassyJS.Member.Constant) {
			var constantExists = true;
			try {
				_getConstantByName(_this, typeObject, memberName);
			} catch (error) {
				if (error instanceof _.Member.Fatal && error.code == 'CONSTANT_NOT_REGISTERED') {
					constantExists = false;
				} else {
					throw error;
				}
			}
			if (constantExists) {
				throw new _.Member.Fatal(
					'CONSTANT_ALREADY_REGISTERED',
					'Constant name: ' + memberName
				);
			}
			var typeMemberData = _getTypeMemberDataFromTypeObject(
				_this,
				typeObject
			);
			typeMemberData.members.constants.push(memberObject);
		}
	};
	
	var _getTypeMemberDataFromTypeObject = function(_this, typeObject)
	{
		for (var i = 0; i < _this._typeMemberData.length; i++) {
			if (_this._typeMemberData[i].typeObject === typeObject) return _this._typeMemberData[i];
		}
	};
	
	var _getClassInstanceDataFromClassInstance = function(_this, classInstance)
	{
		for (var i = 0; i < _this._classInstanceData.length; i++) {
			if (_this._classInstanceData[i].classInstance === classInstance) {
				return _this._classInstanceData[i];
			}
		}
	};
	
	var _getPropertyByName = function(_this, typeObject, propertyName)
	{
		var typeMemberData = _getTypeMemberDataFromTypeObject(_this, typeObject);
		if (typeMemberData) {
			var properties = typeMemberData.members.properties;
			for (var i = 0; i < properties.length; i++) {
				if (properties[i].getName() == propertyName) return properties[i];
			}
		}
		// @todo Unit test error
		throw new _.Member.Fatal(
			'PROPERTY_NOT_REGISTERED',
			'Provided name: ' + propertyName
		);
	};
	
	var _getMethodByNameArgumentTypesAndStaticState = function(
		_this,
		typeObject,
		methodName,
		argumentTypes,
		isStatic
	)
	{
		var typeMemberData = _getTypeMemberDataFromTypeObject(_this, typeObject);
		if (typeMemberData) {
			var methods = typeMemberData.members.methods;
			toLookThroughMethods:
			for (var i = 0; i < methods.length; i++) {
				if (methods[i].getName() == methodName
				&&	argumentTypes.length == methods[i].getArgumentTypes().length
				&&	isStatic === methods[i].isStatic()) {
					for (var j = 0; j < argumentTypes.length; j++) {
						if (argumentTypes[j] != methods[i].getArgumentTypes()[j]) {
							continue toLookThroughMethods;
						}
					}
					return methods[i];
				}
			}
		}
		throw new _.Member.Fatal(
			'METHOD_NOT_REGISTERED',
			'Provided name: ' + methodName
		);
	};
	
	var _getAllMethodsByName = function(_this, typeObject, methodName)
	{
		var returnMethods = [];
		var typeMemberData = _getTypeMemberDataFromTypeObject(_this, typeObject);
		if (!typeMemberData) return returnMethods;
		var methods = typeMemberData.members.methods;
		for (var i = 0; i < methods.length; i++) {
			if (methods[i].getName() == methodName) returnMethods.push(methods[i]);
		}
		return returnMethods;
	};
	
	var _getEventByName = function(_this, typeObject, eventName)
	{
		var typeMemberData = _getTypeMemberDataFromTypeObject(_this, typeObject);
		if (typeMemberData) {
			var events = typeMemberData.members.events;
			for (var i = 0; i < events.length; i++) {
				if (events[i].getName() == eventName) return events[i];
			}
		}
		throw new _.Member.Fatal(
			'EVENT_NOT_REGISTERED',
			'Provided name: ' + eventName
		);
	};
	
	var _getConstantByName = function(_this, typeObject, constantName)
	{
		var typeMemberData = _getTypeMemberDataFromTypeObject(_this, typeObject);
		if (typeMemberData) {
			var constants = typeMemberData.members.constants;
			for (var i = 0; i < constants.length; i++) {
				if (constants[i].getName() == constantName) return constants[i];
			}
		}
		throw new _.Member.Fatal(
			'CONSTANT_NOT_REGISTERED',
			'Provided name: ' + constantName
		);
	};
	
	var _getClassObjectFromInstanceOrConstructor = function(_this, instance)
	{
		// @todo Check instance is object
		var typeObject = _this._typeRegistry.getClass(instance);
		// @todo Check return is instance of ClassyJS.Type.Class
		return typeObject;
	};
	
	var _arraysEqual = function(array1, array2)
	{
		if (array1.length != array2.length) return false;
		for (var i = 0; i < array1.length; i++) if (array1[i] != array2[i]) return false;
		return true;
	};
	
	var _getAllMembers = function(_this, classObject)
	{
		var allMembers = [];
		var targetObject = classObject;
		var firstTime = true;
		do {
			if (firstTime) {
				firstTime = false;
			} else {
				targetObject = _this._typeRegistry.getParent(targetObject);
			}
			var members = _this.getMembers(targetObject);
			for (var i in members) allMembers.push(members[i]);
		} while (_this._typeRegistry.hasParent(targetObject));
		return allMembers;
	};
	
	var _membersAreValid = function(allMembers)
	{
		var abstractMembers = [];
		for (var i = allMembers.length; i > 0; i--) {
			if (typeof allMembers[i-1].isAbstract != 'undefined' && allMembers[i-1].isAbstract()) {
				abstractMembers.push(allMembers[i-1]);
			} else {
				for (var j in abstractMembers) {
					var abstractMember = abstractMembers[j];
					if (abstractMember.getName() === allMembers[i-1].getName()
					&&	abstractMember.isStatic() === allMembers[i-1].isStatic()
					&&	abstractMember.getReturnType() === allMembers[i-1].getReturnType()
					&&	_arraysEqual(
						abstractMember.getArgumentTypes(),
						allMembers[i-1].getArgumentTypes()
					)) {
						abstractMembers.splice(j, 1);
					}
				}
			}
		}
		return (abstractMembers.length > 0) ? false : true;
	};
	
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Registry = window.ClassyJS.Registry || {}
);
