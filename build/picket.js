if (!Object.create) {
	Object.create = (function(){
		function F(){}
		return function(o){
			if (arguments.length != 1) {
				throw new Error('Object.create implementation only accepts one parameter.');
			}
			F.prototype = o;
			return new F()
		}
	})()
}
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError(
				'Function.prototype.bind - what is trying to be bound is not callable'
			);
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP    = function() {},
			fBound  = function() {
				return fToBind.apply(this instanceof fNOP
							 ? this
							 : oThis,
							 aArgs.concat(Array.prototype.slice.call(arguments)));
			};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}

(function(_){
	
	_.Mocker = function(){};
	
	_.Mocker.prototype.getMock = function(constructor)
	{
		
		var Mock = function(){};
		Mock.prototype = constructor.prototype;
		
		return new Mock();
		
	};
	
})(window.Picket = window.Picket || {});

(function(_){
	
	_.Inheritance = function(){};
	
	_.Inheritance.makeChild = function(child, parent)
	{
		child.prototype = _createObject(parent.prototype);
		child.prototype.constructor = child;
	};
	
	_createObject = function(prototype)
	{
		function F(){};
		F.prototype = prototype;
		return new F();
	};
	
})(window.Picket = window.Picket || {});

(function(_){
	
	_.Fatal = {};
	
	_.Fatal.getFatal = function(name, messages){
		
		var fatal = function(messageKey, detailMessage){
			this.code = messageKey;
			this.message = messages[messageKey];
			if (detailMessage) this.message = this.message + ' (' + detailMessage + ')';
			this.stack = Error().stack;
		};
		
		fatal.prototype = Object.create(Error.prototype);
		fatal.prototype.name = 'Fatal Error: ' + name;
		
		return fatal;
		
	};
	
})(window.Picket = window.Picket || {});

(function(_){
	
	_.NamespaceManager = function(){};
	
	_.NamespaceManager.prototype.getNamespaceObject = function(name)
	{
		// @todo Verify name is string
		return getObjectFromString(name);
	};
	
	_.NamespaceManager.prototype.registerClassFunction = function(name, constructor)
	{
		// @todo Check constructor is function
		var namespaceParts = name.split('.');
		var className = namespaceParts.pop();
		var namespace = namespaceParts.join('.');
		if (namespace != '') ensureNamespaceExists(namespace);
		namespace = getObjectFromString(namespace);
		// @todo Check namespace[className] isn't some other type
		if (typeof namespace[className] == 'object') {
			var downstreamProperties = {};
			for (var i in namespace[className]) {
				downstreamProperties[i] = namespace[className][i];
			}
		}
		namespace[className] = constructor;
		if (typeof downstreamProperties) {
			for (var i in downstreamProperties) {
				namespace[className][i] = downstreamProperties[i];
			}
		}
	};
	
	var getObjectFromString = function(name)
	{
		if (name == '') return window;
		var nameParts = name.split('.');
		var namespace = window;
		for (var i = 0; i < nameParts.length; i++) {
			if (typeof namespace[nameParts[i]] == 'undefined') {
				throw new _.NamespaceManager.Fatal('NAMESPACE_OBJECT_DOES_NOT_EXIST');
			}
			namespace = namespace[nameParts[i]];
			if (i == nameParts.length - 1) return namespace;
		}
	};
	
	var ensureNamespaceExists = function(name)
	{
		var nameParts = name.split('.');
		var namespace = window;
		for (var i in nameParts) {
			if (typeof namespace[nameParts[i]] == 'undefined') {
				namespace[nameParts[i]] = {};
			}
			namespace = namespace[nameParts[i]];
		}
	};
	
})(window.Picket = window.Picket || {});

;(function(Picket, _){
	
	var messages = {
		NAMESPACE_OBJECT_DOES_NOT_EXIST: 'No object exists at the requested namespace location'
	};
	
	_.Fatal = Picket.Fatal.getFatal('NamespaceManager.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.NamespaceManager = window.Picket.NamespaceManager || {}
);

(function(_){
	
	_.TypeChecker = function(reflectionFactory)
	{
		if (!(reflectionFactory instanceof Picket.TypeChecker.ReflectionFactory)) {
			throw new _.TypeChecker.Fatal(
				'NO_REFLECTION_FACTORY_PROVIDED',
				'Provided type: ' + typeof reflectionFactory
			);
		}
		this._reflectionFactory = reflectionFactory;
	};
	
	_.TypeChecker.prototype.isValidType = function(value, type, optionalThis)
	{
		if (typeof type != 'string') {
			throw new _.TypeChecker.Fatal('NON_STRING_TYPE_IDENTIFIER');
		}
		if (type.match(/\|(?![^\[]*\])/)) {
			var types = type.split(/\|(?![^\[]*\])/);
			for (var i = 0; i < types.length; i++) {
				if (this.isValidType(value, types[i]) === true) return true;
			}
			return false;
		}
		if (Object.prototype.toString.call(value) == '[object Array]') {
			var match = type.match(/^(.+)\[\]$/);
			if (match) {
				for (var i in value) if (!this.isValidType(value[i], match[1])) return false;
				return true;
			}
			return (type == 'array' || type == 'mixed');
		}
		if (type === 'mixed') return true;
		if (type === 'this') return (value === optionalThis) ? true : false;
		if (value === null) return (type == 'null');
		if (typeof value == type) return true;
		if (typeof value == 'object') {
			try {
				var reflectionClass = this._reflectionFactory.buildClass(value);
				if (reflectionClass.implementsInterface(type)) return true;
			} catch (error) {
				if (!(error instanceof Reflection.Class.Fatal)
				||  error.code != 'CLASS_DOES_NOT_EXIST') {
					throw error;
				}
			}
		}
		var typeParts = type.split('.');
		var namespace = window;
		do {
			var nextTypePart = typeParts.shift();
			if (typeof namespace[nextTypePart] == 'undefined') return false;
			namespace = namespace[nextTypePart];
		} while (typeParts.length);
		return value instanceof namespace;
	};
	
	_.TypeChecker.prototype.areValidTypes = function(values, types)
	{
		if (Object.prototype.toString.call(values) != '[object Array]') {
			throw new _.TypeChecker.Fatal(
				'NON_ARRAY_VALUES',
				'Provided type: ' + typeof values
			);
		}
		if (Object.prototype.toString.call(types) != '[object Array]') {
			throw new _.TypeChecker.Fatal(
				'NON_ARRAY_TYPES',
				'Provided type: ' + typeof types
			);
		}
		if (values.length != types.length) {
			throw new _.TypeChecker.Fatal(
				'VALUE_TYPE_MISMATCH',
				'Values length: ' + values.length + ', Types length: ' + types.length
			);
		}
		for (var i = 0; i < values.length; i++) {
			if (!this.isValidType(values[i], types[i])) return false;
		}
		return true;
	};
	
})(window.Picket = window.Picket || {});

(function(Picket, _){
	
	_.ReflectionFactory = function(){};
	
	_.ReflectionFactory.prototype.buildClass = function(classInstance)
	{
		return new Reflection.Class(classInstance);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.TypeChecker = window.Picket.TypeChecker || {}
);

;(function(Picket, _){
	
	var messages = {
		NO_REFLECTION_FACTORY_PROVIDED:
			'An instance of Picket.TypeChecker.ReflectionFactory must be provided',
		NON_STRING_TYPE_IDENTIFIER: 'Provided type identifier must be a string',
		NON_ARRAY_VALUES: 'Provided values must be within an array',
		NON_ARRAY_TYPES: 'Provided type identifiers must be within an array',
		VALUE_TYPE_MISMATCH: 'Provided values must match length of provided type identifiers'
	};
	
	_.Fatal = Picket.Fatal.getFatal('TypeChecker.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.TypeChecker = window.Picket.TypeChecker || {}
);

;(function(Picket, _){
	
	_.Controller = function(typeRegistry)
	{
		if (!(typeRegistry instanceof Picket.Registry.Type)) {
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
		if (typeof accessObject != 'object'
		&&	typeof accessObject != 'function'
		&&	accessObject !== undefined) {
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
		// @todo The following line is untested
		if (typeof target == 'function' && typeof accessObject == 'object') {
			accessObject = accessObject.constructor;
		}
		if (identifier == 'public') return true;
		if (!accessObject) return false;
		if (target === accessObject) return true;
		if (identifier == 'private') return false;
		return this._typeRegistry.isSameObject(target, accessObject);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Access = window.Picket.Access || {}
);

;(function(Picket, Access, _){
	
	var messages = {
		NO_TYPE_REGISTRY_PROVIDED:
			'An instance of Picket.Registry.Type must be provided to the constructor',
		TARGET_NOT_INSTANCE_OR_CONSTRUCTOR:
			'Provided target object should either be an object instance or constructor function',
		ACCESS_OBJECT_NOT_INSTANCE_OR_CONSTRUCTOR_OR_UNDEFINED:
			'Provided access object must be a class instance or constructor or undefined',
		ACCESS_IDENTIFIER_NOT_STRING: 'Provided access identifier must be a string',
		ACCESS_IDENTIFIER_NOT_VALID_STRING:
			'Provided access identifier must be one of the ' +
			'strings \'public\', \'private\' or \'protected\''
	};
	
	_.Fatal = Picket.Fatal.getFatal('Access.Controller.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Access = window.Picket.Access || {},
	window.Picket.Access.Controller = window.Picket.Access.Controller || {}
);

(function(Picket, _){
	
	_.Class = function(definition, typeRegistry, memberRegistry, namespaceManager)
	{
		if (!(definition instanceof Picket.Type.Class.Definition)) {
			throw new _.Class.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (!(typeRegistry instanceof Picket.Registry.Type)) {
			throw new _.Class.Fatal(
				'NO_TYPE_REGISTRY_PROVIDED',
				'Provided type: ' + typeof typeRegistry
			);
		}
		if (!(memberRegistry instanceof Picket.Registry.Member)) {
			throw new _.Class.Fatal(
				'NO_MEMBER_REGISTRY_PROVIDED',
				'Provided type: ' + typeof memberRegistry
			);
		}
		if (!(namespaceManager instanceof Picket.NamespaceManager)) {
			throw new _.Class.Fatal(
				'NO_NAMESPACE_MANAGER_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		this._definition = definition;
		this._typeRegistry = typeRegistry;
		this._memberRegistry = memberRegistry;
		this._namespaceManager = namespaceManager;
	};
	
	_.Class.prototype.getName = function()
	{
		return this._definition.getName();
	};
	
	_.Class.prototype.isExtension = function()
	{
		return this._definition.isExtension();
	};
	
	_.Class.prototype.getParentClass = function()
	{
		if (!this.isExtension()) throw new _.Class.Fatal('NO_PARENT_CLASS_RELATIONSHIP');
		return this._definition.getParentClass();
	};
	
	_.Class.prototype.getInterfaces = function()
	{
		// @todo Not tested method
		return this._definition.getInterfaces();
	};
	
	_.Class.prototype.requestInstantiation = function()
	{
		if (this._definition.isAbstract()) {
			throw new Picket.Type.Class.Fatal('CANNOT_INSTANTIATE_ABSTRACT_CLASS');
		}
		if (this._memberRegistry.hasAbstractMembers(this)) {
			throw new Picket.Type.Class.Fatal('CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS');
		}
		if (this._memberRegistry.hasUnimplementedInterfaceMembers(this)) {
			throw new Picket.Type.Class.Fatal(
				'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
			);
		}
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {}
);

;(function(Picket, Type, _){
	
	_.Constructor = function(typeRegistry, memberRegistry, fullClassName)
	{
		
		// @todo Type check class registry
		
		var classNameParts = fullClassName.split('.');
		var className = classNameParts.pop();
		var namespace = {};
		
		for (var i in classNameParts) {
			if (typeof namespace[classNameParts[i]] == 'undefined') {
				namespace[classNameParts[i]] = {};
			}
			namespace = namespace[classNameParts[i]];
			if (typeof rootNamespaceName == 'undefined') {
				var rootNamespaceName = classNameParts[i];
				var rootNamespaceValue = namespace;
			}
		}
		
		namespace[className] = function()
		{
			
			if (arguments.callee.caller.toString() == arguments.callee.toString()) {
				var isInstantiatedObject = false;
			} else {
				var isInstantiatedObject = true;
			}
			
			var classObject = typeRegistry.getClass(this)
			
			if (isInstantiatedObject) classObject.requestInstantiation();
			
			var properties = [];
			var methods = [];
			
			_appendMemberNames(properties, methods, classObject);
			
			if (isInstantiatedObject && typeRegistry.hasParent(classObject)) {
				
				var parentConstructors = [];
				var childObject = classObject;
				var childConstructor = namespace[className];
				
				while (typeRegistry.hasParent(childObject)) {
					childObject = typeRegistry.getParent(childObject);
					childConstructor = typeRegistry.getParent(childConstructor);
					parentConstructors.push(childConstructor);
					_appendMemberNames(properties, methods, childObject);
				}
				
				var parentObjects = [];
				
				for (var i = 0; i < parentConstructors.length; i++) {
					parentObjects[i] = new parentConstructors[i]();
				}
				
				parentObjects.unshift(this);
				
				typeRegistry.registerClassInstance(parentObjects);
				
			}
			
			for (var i in properties) {
				var name = properties[i].getName();
				this[name] = (function(name, property){
					return function(value){
						// @todo All this magic stuff should probably be elsewhere
						var type = property.getTypeIdentifier();
						if (type == 'string' && arguments.length == 2) {
							if (value === '+=') {
								return _set(name, _get(name, this) + arguments[1], this);
							} else if (value === '=+') {
								return _set(name, arguments[1] + _get(name, this), this);
							}
						} else if (type == 'number' && typeof value == 'string') {
							var match = value.match(/^(\+|-)((?:\+|-)|[0-9]+)$/);
							if (match) {
								if (match[1] == '+' && match[2] == '+') {
									return _set(name, _get(name, this) + 1, this);
								} else if (match[1] == '-' && match[2] == '-') {
									return _set(name, _get(name, this) - 1, this);
								} else {
									value = _get(name, this);
									value = (match[1] == '+')
										? value + parseInt(match[2])
										: value - parseInt(match[2]);
									return _set(name, value, this);
								}
							}
						} else if (typeof value == 'string'
						&& (type == 'array' || type.match(/^(.+)\[\]$/))) {
							var match = value.match(/push|pop|shift|unshift/);
							if (match) {
								return _get(name, this)[match[0]].call(
									_get(name, this),
									arguments[1]
								);
							}
						}
						if (typeof value != 'undefined') {
							return _set(name, value, this);
						} else {
							return _get(name, this);
						}
					};
				})(name, properties[i]);
			}
			
			for (var i in methods) {
				var name = methods[i].getName();
				this[name] = (function(name){
					return function(){
						return memberRegistry.callMethod(
							this,
							arguments.callee.caller.$$localOwner,
							name,
							Array.prototype.slice.call(arguments, 0)
						);
					};
				})(name);
			}
			
			if (isInstantiatedObject && this.construct) {
				this.construct.apply(this, Array.prototype.slice.call(arguments, 0));
			}
			
		};
		
		namespace[className].prototype.bind = function(name, targetMethod)
		{
			memberRegistry.bindEvent(this, name, arguments.callee.caller.$$owner, targetMethod);
		};
		
		namespace[className].prototype.trigger = function(name)
		{
			var args = [this, name, Array.prototype.slice.call(arguments, 1)];
			memberRegistry.triggerEvent.apply(memberRegistry, args);
		};
		
		namespace[className].prototype.proxyMethod = function(proxyFunction)
		{
			var parentMethod = arguments.callee.caller;
			return (function(proxyFunction, $$owner, $$localOwner){
				return function(){
					proxyFunction.$$owner = $$owner;
					proxyFunction.$$localOwner = $$localOwner;
					return proxyFunction.apply($$owner, arguments);
				}
			})(proxyFunction, parentMethod.$$owner, parentMethod.$$localOwner);
		};
		
		var _get = function(name, object)
		{
			// Note that the '|| {}' below is due
			// to a hack in Picket.Member.Property.
			// It should go if possible.
			return memberRegistry.getPropertyValue(
				object,
				arguments.callee.caller.caller.$$localOwner || {},
				name
			);
		};
		
		var _set = function(name, value, object)
		{
			memberRegistry.setPropertyValue(
				object,
				arguments.callee.caller.caller.$$localOwner,
				name,
				value
			);
		};
		
		var _appendMemberNames = function(properties, methods, classObject)
		{
			var members = memberRegistry.getMembers(classObject);
			for (var i in members) {
				if (members[i] instanceof Picket.Member.Property) {
					properties.push(members[i]);
				} else if (members[i] instanceof Picket.Member.Method) {
					methods.push(members[i]);
				}
			}
		};
		
		return namespace[className];
		
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {}
);

;(function(Picket, Type, Class, _){
	
	var messages = {
		ABSTRACT_CLASS_CANNOT_BE_INSTANTIATED: 'Abstract class cannot be instantiated'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Class.Constructor.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {},
	window.Picket.Type.Class.Constructor = window.Picket.Type.Class.Constructor || {}
);

;(function(Picket, Type, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		if (!signature.match(/\bclass\b/)) throw new _.Definition.Fatal('MISSING_KEYWORD_CLASS');
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(?:(abstract)\\s+)?class\\s+([A-Z][A-Za-z0-9.]*)' +
			'(?:\\s+extends\\s+([A-Z][A-Za-z0-9.]*))?' +
			'(?:\\s+implements\\s+([A-Z][A-Za-z0-9., \\t]*))?(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal('SIGNATURE_NOT_RECOGNISED');
		}
		this._isAbstract = (signatureMatch[1]) ? true : false;
		this._name = signatureMatch[2];
		this._parent = signatureMatch[3];
		this._interfaces = (signatureMatch[4]) ? signatureMatch[4].replace(/\s+/g, '').split(',') : [];
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.isAbstract = function()
	{
		return this._isAbstract;
	};
	
	_.Definition.prototype.isExtension = function()
	{
		return (this._parent) ? true : false;
	};
	
	_.Definition.prototype.getParentClass = function()
	{
		return this._parent;
	};
	
	_.Definition.prototype.getInterfaces = function()
	{
		return this._interfaces;
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {}
);

;(function(Picket, Type, Class, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		MISSING_KEYWORD_CLASS:		'Signature does not contain keywork \'class\'',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Class.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {},
	window.Picket.Type.Class.Definition = window.Picket.Type.Class.Definition || {}
);

;(function(Picket, Type, Class, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {},
	window.Picket.Type.Class.Definition = window.Picket.Type.Class.Definition || {}
);

(function(Picket, Type, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(definition, typeRegistry, memberRegistry, namespaceManager)
	{
		return new _(definition, typeRegistry, memberRegistry, namespaceManager);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {}
);

;(function(Picket, Type, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED:
			'An instance of Picket.Type.Class.Definition must be provided to the constructor',
		NO_TYPE_REGISTRY_PROVIDED:
			'An instance of Picket.Registry.Type must be provided to the constructor',
		NO_MEMBER_REGISTRY_PROVIDED:
			'An instance of Picket.Registry.Member must be provided to the constructor',
		NO_NAMESPACE_MANAGER_PROVIDED:
			'An instance of Picket.NamespaceManager must be provided to the constructor',
		NO_PARENT_CLASS_RELATIONSHIP:
			'Parent class was requested when no parent relationship exists',
		CANNOT_INSTANTIATE_ABSTRACT_CLASS:
			'Cannot instantiate a class marked explicitly as abstract',
		CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS:
			'Cannot instantiate a class which contains abstract members',
		CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS:
			'Cannot instantiate a class with unimplemented interface members'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Class.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {}
);

(function(Picket, _){
	
	_.Interface = function(definition)
	{
		this._definition = definition;
	};
	
	_.Interface.prototype.getName = function()
	{
		return this._definition.getName();
	}
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {}
);

;(function(TypeDefinition, Type, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		if (!signature.match(/\binterface\b/)) {
			throw new _.Definition.Fatal('MISSING_KEYWORD_INTERFACE');
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?interface(?:\\s+)?([A-Z](?:[A-Za-z0-9.]*)?)(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal('SIGNATURE_NOT_RECOGNISED');
		}
		this._name = signatureMatch[1];
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Interface = window.Picket.Type.Interface || {}
);

;(function(Picket, Type, Interface, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		MISSING_KEYWORD_INTERFACE:	'Signature does not contain keywork \'interface\'',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Interface.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Interface = window.Picket.Type.Interface || {},
	window.Picket.Type.Interface.Definition = window.Picket.Type.Interface.Definition || {}
);

;(function(Picket, Type, Interface, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Interface = window.Picket.Type.Interface || {},
	window.Picket.Type.Interface.Definition = window.Picket.Type.Interface.Definition || {}
);

(function(Picket, Type, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(definition)
	{
		return new _(definition);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Interface = window.Picket.Type.Interface || {}
);

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

;(function(Picket, Type, _){
	
	var messages = {
		NO_DEFINITION_FACTORY_PROVIDED:
			'No instance of Picket.Type.DefinitionFactory was provided to the constructor',
		NO_CLASS_FACTORY_PROVIDED:
			'No instance of Picket.Type.Class.Factory was provided to the constructor',
		NO_INTERFACE_FACTORY_PROVIDED:
			'No instance of Picket.Type.Interface.Factory was provided to the constructor',
		NO_TYPE_REGISTRY_PROVIDED:
			'No instance of Picket.Registry.Type was provided to the constructor',
		NO_MEMBER_REGISTRY_PROVIDED:
			'No instance of Picket.Registry.Member was provided to the constructor',
		NO_NAMESPACE_MANAGER_PROVIDED:
			'No instance of Picket.NamespaceManager was provided to the constructor',
		NON_STRING_SIGNATURE_PROVIDED: 'Provided signature must be a string',
		EMPTY_STRING_SIGNATURE_PROVIDED: 'Provided signature must not be an empty string',
		NON_DEFINITION_RETURNED_FROM_FACTORY:
			'Provided definition factory did not return an instance of ' +
			'Picket.Type.Class.Definition or Picket.Type.Interface.Definition',
		NON_CLASS_RETURNED_FROM_FACTORY:
			'Provided class factory did not return an instance of Picket.Type.Class',
		NON_INTERFACE_RETURNED_FROM_FACTORY:
			'Provided interface factory did not return an instance of Picket.Type.Interface'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Factory.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Factory = window.Picket.Type.Factory || {}
);

;(function(Picket, _){
	
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
			throw new _.DefinitionFactory.Fatal(
				'AMBIGUOUS_SIGNATURE',
				'Signature: ' + signature
			);
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
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {}
);

;(function(Picket, Type, _){
	
	var messages = {
		CLASS_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Type.Class.Definition.Factory must be provided to the constructor',
		INTERFACE_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Type.Interface.Definition.Factory must be provided to the constructor',
		NON_STRING_SIGNATURE:			'Provided signature must be a string',
		AMBIGUOUS_SIGNATURE:			'Signature could not be identified as class or interface',
		FACTORY_RETURNED_NON_OBJECT:	'The selected downstream factory did not return an object'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.DefinitionFactory.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.DefinitionFactory = window.Picket.Type.DefinitionFactory || {}
);

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

;(function(Picket, Member, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(public|protected|private)\\s+([A-Za-z][A-Za-z0-9.]*)\\s+' +
			'\\((?:\\s+)?([A-Za-z][A-Za-z0-9.\\[\\]|]*)(?:\\s+)?\\)(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal(
				'SIGNATURE_NOT_RECOGNISED',
				'Provided signature: ' + signature
			);
		}
		this._name = signatureMatch[2];
		this._accessTypeIdentifier = signatureMatch[1];
		this._typeIdentifier = signatureMatch[3];
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.getAccessTypeIdentifier = function()
	{
		return this._accessTypeIdentifier;
	};
	
	_.Definition.prototype.getTypeIdentifier = function()
	{
		return this._typeIdentifier;
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {}
);

;(function(Picket, Member, Property, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Property.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {},
	window.Picket.Member.Property.Definition = window.Picket.Member.Property.Definition || {}
);

;(function(Picket, Member, Property, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {},
	window.Picket.Member.Property.Definition = window.Picket.Member.Property.Definition || {}
);

(function(Picket, Member, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(
		definition,
		isFromInterface,
		defaultValue,
		typeChecker,
		accessController
	)
	{
		return new _(definition, isFromInterface, defaultValue, typeChecker, accessController);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {}
);

;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of Picket.Member.Property.Definition must be provided',
		PROPERTY_CANNOT_BE_DEFINED_BY_INTERFACE:
			'Constructor argument indicated that this property was defined ' +
			'within an interface. Properties cannot be defined within interfaces',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of Picket.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of Picket.Access.Controller must be provided',
		INVALID_DEFAULT_VALUE:
			'Value provided as default does not match type specified in the property signature',
		NO_DEFAULT_VALUE_PROVIDED:
			'Valid default value or null must be provided',
		NON_OBJECT_TARGET_INSTANCE_PROVIDED:
			'Instance provided as property owner must be an object',
		NON_OBJECT_ACCESS_INSTANCE_PROVIDED:
			'Instance provided as accessing property must be an object',
		ACCESS_NOT_ALLOWED:
			'Provided object instance is not permitted to execute the requested behaviour',
		INVALID_TYPE: 'Property cannot be set to the provided type'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Property.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {}
);

(function(Picket, _){
	
	_.Method = function(definition, isFromInterface, value, typeChecker, accessController)
	{
		if (!(definition instanceof Picket.Member.Method.Definition)) {
			throw new _.Method.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (!(typeChecker instanceof Picket.TypeChecker)) {
			throw new _.Method.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof Picket.Access.Controller)) {
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
			if (!definition.hasArgumentTypes()) {
				throw new _.Method.Fatal('NON_ABSTRACT_METHOD_DECLARED_WITH_NO_ARGUMENT_TYPES');
			}
			this._isAbstract = false;
		}
		if (definition.hasArgumentTypes()) {
			var types = definition.getArgumentTypeIdentifiers();
			for (var i = 0; i < types.length; i++) {
				if (types[i] === 'undefined') throw new _.Method.Fatal('UNDEFINED_ARGUMENT_TYPE');
				if (types[i] === 'null') throw new _.Method.Fatal('NULL_ARGUMENT_TYPE');
			}
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
	
	_.Method.prototype.hasArgumentTypes = function()
	{
		// @todo Untested method
		return (this._definition.hasArgumentTypes()) ? true : false;
	};
	
	_.Method.prototype.getArgumentTypeIdentifiers = function()
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
	
	// @todo This method not tested
	_.Method.prototype.argumentIsOptional = function(index)
	{
		return this._definition.argumentIsOptional(index);
	};
	
	// @todo This method not tested
	_.Method.prototype.getDefaultArgumentValue = function(index)
	{
		return this._definition.getDefaultArgumentValue(index);
	};
	
	_.Method.prototype.getAccessTypeIdentifier = function()
	{
		return this._definition.getAccessTypeIdentifier();
	};
	
	_.Method.prototype.call = function(target, localTarget, accessInstance, args, scopeVariables)
	{
		if (this._isAbstract) throw new _.Method.Fatal('INTERACTION_WITH_ABSTRACT');
		if (typeof target != 'object' && typeof target != 'function') {
			throw new _.Method.Fatal(
				'NON_OBJECT_OR_CONSTRUCTOR_TARGET_PROVIDED',
				'Provided type: ' + typeof target
			);
		}
		if (typeof localTarget != 'object' && typeof localTarget != 'function') {
			throw new _.Method.Fatal(
				'NON_OBJECT_OR_CONSTRUCTOR_LOCAL_TARGET_PROVIDED',
				'Provided type: ' + typeof localTarget
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
			localTarget,
			accessInstance,
			this._definition.getAccessTypeIdentifier()
		);
		if (canAccess !== true) throw new _.Method.Fatal('ACCESS_NOT_ALLOWED');
		var areValidTypes = this._typeChecker.areValidTypes(
			args,
			this.getArgumentTypeIdentifiers()
		);
		if (scopeVariables) {
			var originalScopeVariables = {};
			for (var i in scopeVariables) {
				if (typeof window[i] != 'undefined') {
					originalScopeVariables[i] = window[i];
				}
				window[i] = scopeVariables[i];
			}
		}
		var currentOwner = this._value.$$owner;
		var currentLocalOwner = this._value.$$localOwner;
		this._value.$$owner = target;
		this._value.$$localOwner = localTarget;
		var returnValue = this._value.apply(target, args);
		this._value.$$owner = currentOwner;
		this._value.$$localOwner = currentLocalOwner;
		if (scopeVariables) {
			for (var i in scopeVariables) {
				if (originalScopeVariables[i]) {
					window[i] = originalScopeVariables[i];
				} else {
					delete window[i];
				}
			}
		}
		var isValidType = this._typeChecker.isValidType(
			returnValue,
			this._definition.getReturnTypeIdentifier(),
			target
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
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {}
);

;(function(Picket, Member, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(?:(static|abstract)(?:\\s+))?(?:(static|abstract)(?:\\s+))?' +
			'(public|protected|private)\\s+(?:(static|abstract)(?:\\s+))?' +
			'(?:(static|abstract)(?:\\s+))?([a-z][A-Za-z0-9.]*)(?:\\s+)?' +
			'(\\(([A-Za-z0-9,:.\\s\\[\\]{}?=|]*)\\))?(?:\\s+->\\s+([A-Za-z0-9.[\\]|]+))?(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal(
				'SIGNATURE_NOT_RECOGNISED',
				'Provided signature: ' + signature
			);
		}
		this._name = signatureMatch[6];
		this._accessTypeIdentifier = signatureMatch[3];
		this._returnTypeIdentifier = signatureMatch[9] || 'undefined';
		var staticAbstracts = [
			signatureMatch[1],
			signatureMatch[2],
			signatureMatch[4],
			signatureMatch[5]
		];
		this._isStatic = staticAbstracts.indexOf('static') > -1 ? true : false;
		this._isAbstract = staticAbstracts.indexOf('abstract') > -1 ? true : false;
		if (signatureMatch[8] === undefined) {
			this._argumentTypeIdentifiers = null;
			this._argumentDefaultValues = null;
		} else if (signatureMatch[8] == '') {
			this._argumentTypeIdentifiers = [];
			this._argumentDefaultValues = [];
		} else {
			var arguments = signatureMatch[8].replace(/\s+/g, '').split(',');
			this._argumentTypeIdentifiers = [];
			this._argumentDefaultValues = [];
			var optionalArgumentRegex = new RegExp(
				'^(?:[A-Za-z0-9.\\[\\]]*(\\?)|(string|number|boolean|object|' +
				'array|[A-Za-z0-9.]+\\[\\])\\s*=\\s*([A-Za-z0-9.{}\\[\\]]+))$'
			);
			var foundOptionalArgument = false;
			for (var i = 0; i < arguments.length; i++) {
				var optionalArgumentMatch = optionalArgumentRegex.exec(arguments[i]);
				if (optionalArgumentMatch === null) {
					if (foundOptionalArgument) {
						throw new _.Definition.Fatal(
							'INVALID_ARGUMENT_ORDER',
							'Provided signature: ' + signature
						);
					}
					this._argumentTypeIdentifiers.push(arguments[i]);
					this._argumentDefaultValues.push(undefined);
				} else if (optionalArgumentMatch[1]) {
					foundOptionalArgument = true;
					this._argumentTypeIdentifiers.push(
						arguments[i].substr(0, arguments[i].length-1)
					);
					this._argumentDefaultValues.push(null);
				} else if (optionalArgumentMatch[2] && optionalArgumentMatch[3]) {
					foundOptionalArgument = true;
					var type = optionalArgumentMatch[2];
					var value = optionalArgumentMatch[3];
					if (type == 'string') {
						this._argumentTypeIdentifiers.push(type);
						this._argumentDefaultValues.push(value);
					} else if (type == 'number') {
						if (parseFloat(value) + '' !== value) {
							var throwInvalidArgumentDefault = true;
						}
						this._argumentTypeIdentifiers.push(type);
						this._argumentDefaultValues.push(parseFloat(value));
					} else if (type == 'boolean') {
						this._argumentTypeIdentifiers.push(type);
						if (value == 'true') {
							this._argumentDefaultValues.push(true);
						} else if (value == 'false') {
							this._argumentDefaultValues.push(false);
						} else {
							var throwInvalidArgumentDefault = true;
						}
					} else if (type == 'array' || type.match(/^[A-Za-z0-9.]+\[\]$/)) {
						if (value == '[]') {
							this._argumentTypeIdentifiers.push(type);
							this._argumentDefaultValues.push([]);
						} else {
							var throwInvalidArgumentDefault = true;
						}
					} else if (type == 'object') {
						if (value == '{}') {
							this._argumentTypeIdentifiers.push(type);
							this._argumentDefaultValues.push({});
						} else {
							var throwInvalidArgumentDefault = true;
						}
					} else {
						var throwInvalidArgumentDefault = true;
					}
					if (throwInvalidArgumentDefault) {
						throw new _.Definition.Fatal(
							'INVALID_ARGUMENT_DEFAULT',
							'Argument type: ' + type + '; Provided value: ' + value
						);
					}
				}
			}
		}
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.getAccessTypeIdentifier = function()
	{
		return this._accessTypeIdentifier;
	};
	
	_.Definition.prototype.isStatic = function()
	{
		return this._isStatic;
	};
	
	_.Definition.prototype.isAbstract = function()
	{
		return this._isAbstract;
	};
	
	_.Definition.prototype.hasArgumentTypes = function()
	{
		return (this._argumentTypeIdentifiers === null) ? false : true;
	};
	
	_.Definition.prototype.getArgumentTypeIdentifiers = function()
	{
		if (this._argumentTypeIdentifiers === null) {
			throw new _.Definition.Fatal('UNDECLARED_ARGUMENT_TYPES_REQUESTED');
		}
		return this._argumentTypeIdentifiers;
	};
	
	_.Definition.prototype.getReturnTypeIdentifier = function()
	{
		return this._returnTypeIdentifier;
	};
	
	_.Definition.prototype.argumentIsOptional = function(index)
	{
		return this._argumentDefaultValues[index] !== undefined;
	};
	
	_.Definition.prototype.getDefaultArgumentValue = function(index)
	{
		return this._argumentDefaultValues[index];
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {}
);

;(function(Picket, Member, Method, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood',
		INVALID_ARGUMENT_ORDER:
			'Optional method arguments must be defined after non-optional arguments',
		INVALID_ARGUMENT_DEFAULT:
			'The provided default value for an optional argument is not valid',
		UNDECLARED_ARGUMENT_TYPES_REQUESTED: 'No argument types have been provided'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Method.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {},
	window.Picket.Member.Method.Definition = window.Picket.Member.Method.Definition || {}
);

;(function(Picket, Member, Method, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {},
	window.Picket.Member.Method.Definition = window.Picket.Member.Method.Definition || {}
);

(function(Picket, Member, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(
		definition,
		isFromInterface,
		value,
		typeChecker,
		accessController
	)
	{
		return new _(definition, isFromInterface, value, typeChecker, accessController);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {}
);

;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of Picket.Member.Method.Definition must be provided',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of Picket.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of Picket.Access.Controller must be provided',
		UNDEFINED_ARGUMENT_TYPE: 'Arguments cannot be defined as type undefined',
		NULL_ARGUMENT_TYPE: 'Arguments cannot be defined as type null',
		NON_OBJECT_OR_CONSTRUCTOR_TARGET_PROVIDED:
			'Argument provided as property owner must be an object or constructor',
		NON_OBJECT_OR_CONSTRUCTOR_LOCAL_TARGET_PROVIDED:
			'Argument provided as property local owner must be an object or constructor',
		NON_ARRAY_ARGUMENTS_PROVIDED:
			'Provided arguments must be within array',
		ACCESS_NOT_ALLOWED:
			'Provided object instance is not permitted to call method',
		INVALID_ARGUMENTS: 'Provided arguments are not valid',
		INVALID_RETURN_VALUE: 'Returned value is not valid',
		UNEXPECTED_IMPLEMENTATION:
			'Abstract or interface method should not provide an implementation',
		NON_FUNCTION_IMPLEMENTATION: 'implementation must be provided as a function',
		INTERACTION_WITH_ABSTRACT: 'This instance cannot be called as it is abstract',
		NON_OBJECT_SCOPE_VARIABLES: 'Provided scope variables must be object',
		NON_ABSTRACT_METHOD_DECLARED_WITH_NO_ARGUMENT_TYPES:
			'Any method declared without argument types must be abstract'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Method.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {}
);

(function(Picket, _){
	
	_.Event = function(definition, isFromInterface, value, typeChecker, accessController)
	{
		if (!(definition instanceof Picket.Member.Event.Definition)) {
			throw new _.Event.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (!(typeChecker instanceof Picket.TypeChecker)) {
			throw new _.Event.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof Picket.Access.Controller)) {
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
			if (!(callbacks[i][1] instanceof Picket.Member.Method)) {
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
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {}
);

;(function(Picket, Member, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(public|protected)\\s+event\\s+([a-z][A-Za-z0-9]*)(?:\\s+)?' +
			'\\(([A-Za-z0-9,.\\s\\[\\]|]*)\\)(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal(
					'SIGNATURE_NOT_RECOGNISED',
					'Provided signature: ' + signature
				);
		}
		this._name = signatureMatch[2];
		this._accessTypeIdentifier = signatureMatch[1];
		this._argumentTypeIdentifiers = [];
		if (signatureMatch[3] == '') return;
		var argumentTypeIdentifiers = signatureMatch[3].replace(/\s+/g, '').split(',');
		for (var i in argumentTypeIdentifiers) {
			if (!argumentTypeIdentifiers[i].match(/^[A-Za-z0-9.\[\]|]+$/)) {
				throw new _.Definition.Fatal(
					'SIGNATURE_NOT_RECOGNISED',
					'Provided signature: ' + signature
				);
			}
			this._argumentTypeIdentifiers.push(argumentTypeIdentifiers[i]);
		}
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.getAccessTypeIdentifier = function()
	{
		return this._accessTypeIdentifier;
	};
	
	_.Definition.prototype.getArgumentTypeIdentifiers = function()
	{
		return this._argumentTypeIdentifiers;
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {}
);

;(function(Picket, Member, Event, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Event.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {},
	window.Picket.Member.Event.Definition = window.Picket.Member.Event.Definition || {}
);

;(function(Picket, Member, Event, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {},
	window.Picket.Member.Event.Definition = window.Picket.Member.Event.Definition || {}
);

(function(Picket, Member, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(
		definition,
		isFromInterface,
		value,
		typeChecker,
		accessController
	)
	{
		return new _(definition, isFromInterface, value, typeChecker, accessController);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {}
);

;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of Picket.Member.Event.Definition must be provided',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of Picket.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of Picket.Access.Controller must be provided',
		INVALID_VALUE_PROVIDED: 'Event value must be undefined, null or empty string',
		UNDEFINED_ARGUMENT_TYPE: 'Arguments cannot be defined as type undefined',
		NULL_ARGUMENT_TYPE: 'Arguments cannot be defined as type null',
		NON_OBJECT_TARGET_INSTANCE_PROVIDED:
			'Instance provided as property owner must be an object',
		NON_OBJECT_ACCESS_INSTANCE_PROVIDED:
			'Instance provided as accessing property must be an object',
		ACCESS_NOT_ALLOWED:
			'Provided object instance is not permitted to execute the requested behaviour',
		NON_ARRAY_CALLBACKS_PROVIDED: 'Provided method callbacks are not provided within an array',
		NON_ARRAY_CALLBACK_PROVIDED: 'Provided method callback is not provided as an array',
		NON_OBJECT_CALLBACK_INSTANCE: 'Provided callback object instance is not an object',
		INVALID_CALLBACK_METHOD:
			'Provided callback method is not instance of Picket.Member.Method',
		NON_ARRAY_ARGUMENTS_PROVIDED: 'Provided arguments are not provided within an array',
		INVALID_ARGUMENTS: 'The method arguments provided to trigger are not valid',
		INTERACTION_WITH_ABSTRACT: 'This instance cannot be bound or triggered as it is abstract'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Event.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {}
);

(function(Picket, _){
	
	_.Constant = function(definition, isFromInterface, value, typeChecker, accessController)
	{
		if (!(definition instanceof Picket.Member.Constant.Definition)) {
			throw new _.Constant.Fatal(
				'NO_DEFINITION_PROVIDED',
				'Provided type: ' + typeof definition
			);
		}
		if (isFromInterface !== false) {
			throw new _.Constant.Fatal('IS_FROM_INTERFACE');
		}
		if (!(typeChecker instanceof Picket.TypeChecker)) {
			throw new _.Constant.Fatal(
				'NO_TYPE_CHECKER_PROVIDED',
				'Provided type: ' + typeof typeChecker
			);
		}
		if (!(accessController instanceof Picket.Access.Controller)) {
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
			this._isAutoGenerated = false;
		} else {
			value = _generateValue(definition.getTypeIdentifier());
			this._isAutoGenerated = true;
		}
		this._value = value;
		this._definition = definition;
		this._accessController = accessController;
	};
	
	_.Constant.prototype.getName = function()
	{
		return this._definition.getName();
	};
	
	_.Constant.prototype.getAccessTypeIdentifier = function()
	{
		// @todo Method untested
		return this._definition.getAccessTypeIdentifier();
	};
	
	_.Constant.prototype.getTypeIdentifier = function()
	{
		// @todo Method untested
		return this._definition.getTypeIdentifier();
	};
	
	_.Constant.prototype.isAutoGenerated = function()
	{
		// @todo Method untested
		return this._isAutoGenerated;
	};
	
	_.Constant.prototype.get = function(targetConstructor, accessInstance)
	{
		// @todo This if statment is a hack. This
		// class should not control access and it
		// causes an issue for Reflection.Constant.
		// Originally all access checking was done,
		// not just when the arguments are provided.
		// Also, note that the related test is disabled.
		if (targetConstructor && accessInstance) {
			if (typeof targetConstructor != 'function') {
				throw new _.Constant.Fatal(
					'NON_FUNCTION_TARGET_CONSTRUCTOR_PROVIDED',
					'Provided type: ' + typeof targetConstructor
				);
			}
			var canAccess = this._accessController.canAccess(
				targetConstructor,
				accessInstance,
				this._definition.getAccessTypeIdentifier()
			);
			if (canAccess !== true) throw new _.Constant.Fatal('ACCESS_NOT_ALLOWED');
		}
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
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {}
);

;(function(Picket, Member, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(public|protected|private)\\s+constant\\s+([A-Z][A-Z_]*)' +
			'(?:\\s+\\((?:\\s+)?([A-Za-z0-9.-\\[\\]]+)(?:\\s+)?\\))?(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal(
				'SIGNATURE_NOT_RECOGNISED',
				'Provided signature: ' + signature
			);
		}
		this._name = signatureMatch[2];
		this._accessTypeIdentifier = signatureMatch[1];
		this._typeIdentifier = signatureMatch[3];
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.getAccessTypeIdentifier = function()
	{
		return this._accessTypeIdentifier;
	};
	
	_.Definition.prototype.getTypeIdentifier = function()
	{
		return this._typeIdentifier;
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {}
);

;(function(Picket, Member, Constant, _){
	
	var messages = {
		// NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		// SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Constant.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {},
	window.Picket.Member.Constant.Definition = window.Picket.Member.Constant.Definition || {}
);

;(function(Picket, Member, Constant, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {},
	window.Picket.Member.Constant.Definition = window.Picket.Member.Constant.Definition || {}
);

(function(Picket, Member, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(
		definition,
		isFromInterface,
		value,
		typeChecker,
		accessController
	)
	{
		return new _(definition, isFromInterface, value, typeChecker, accessController);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {}
);

;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of Picket.Member.Constant.Definition must be provided',
		IS_FROM_INTERFACE:
			'Constants cannot be abstract and therefore cannot be declared within an interface',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of Picket.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of Picket.Access.Controller must be provided',
		INVALID_VALUE_TYPE: 'Value must be string, number or undefined',
		INVALID_VALUE: 'Provided value did not match constant type',
		NON_FUNCTION_TARGET_CONSTRUCTOR_PROVIDED:
			'Constructor provided as property owner must be a function',
		NON_OBJECT_ACCESS_INSTANCE_PROVIDED:
			'Instance provided as accessing property must be an object',
		INVALID_TYPE: 'Constant cannot be set to the provided type',
		ACCESS_NOT_ALLOWED: 'Provided object instance is not permitted to access the constant value'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Constant.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {}
);

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

;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_FACTORY_PROVIDED:
			'No instance of Picket.Member.DefinitionFactory was provided to the constructor',
		NO_PROPERTY_FACTORY_PROVIDED:
			'No instance of Picket.Member.Property.Factory was provided to the constructor',
		NO_METHOD_FACTORY_PROVIDED:
			'No instance of Picket.Member.Method.Factory was provided to the constructor',
		NO_EVENT_FACTORY_PROVIDED:
			'No instance of Picket.Member.Event.Factory was provided to the constructor',
		NO_CONSTANT_FACTORY_PROVIDED:
			'No instance of Picket.Member.Constant.Factory was provided to the constructor',
		NO_TYPE_CHECKER_PROVIDED:
			'No instance of Picket.TypeChecker was provided to the constructor',
		NO_ACCESS_CONTROLLER_PROVIDED:
			'No instance of Picket.Access.Controller was provided to the constructor',
		NON_STRING_SIGNATURE_PROVIDED: 'Provided signature must be a string',
		EMPTY_STRING_SIGNATURE_PROVIDED: 'Provided signature must not be an empty string',
		NON_BOOLEAN_INTERFACE_INDICATOR_PROVIDED:
			'Argument provided to indicate whether the member is defined ' +
			'within an interface must be a boolean',
		NON_DEFINITION_RETURNED_FROM_FACTORY:
			'Provided definition factory did not return a member definition object',
		NON_PROPERTY_RETURNED_FROM_FACTORY:
			'Provided property factory did not return an instance of Picket.Member.Property',
		NON_METHOD_RETURNED_FROM_FACTORY:
			'Provided method factory did not return an instance of Picket.Member.Method',
		NON_EVENT_RETURNED_FROM_FACTORY:
			'Provided event factory did not return an instance of Picket.Member.Event',
		NON_CONSTANT_RETURNED_FROM_FACTORY:
			'Provided constant factory did not return an instance of Picket.Member.Constant'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Factory.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Factory = window.Picket.Member.Factory || {}
);

;(function(Picket, _){
	
	_.DefinitionFactory = function(
		propertyDefinitionFactory,
		methodDefinitionFactory,
		eventDefinitionFactory,
		constantDefinitionFactory
	)
	{
		if (!(propertyDefinitionFactory instanceof _.Property.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('PROPERTY_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		if (!(methodDefinitionFactory instanceof _.Method.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('METHOD_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		if (!(eventDefinitionFactory instanceof _.Event.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('EVENT_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		if (!(constantDefinitionFactory instanceof _.Constant.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('CONSTANT_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		this._propertyDefinitionFactory = propertyDefinitionFactory;
		this._methodDefinitionFactory = methodDefinitionFactory;
		this._eventDefinitionFactory = eventDefinitionFactory;
		this._constantDefinitionFactory = constantDefinitionFactory;
	};
	
	_.DefinitionFactory.prototype.build = function(signature, isFunction)
	{
		isFunction = (isFunction === true) ? true : false;
		if (typeof signature != 'string') {
			throw new _.DefinitionFactory.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var factories = ['Property', 'Method', 'Event', 'Constant'];
		for (var i in factories) {
			if (factories[i] == 'Property' && isFunction) continue;
			try {
				var factory = this['_' + factories[i].toLowerCase() + 'DefinitionFactory'];
				var returnObject = factory.build(signature);
				if (typeof returnObject != 'object') {
					throw new _.DefinitionFactory.Fatal(
						'FACTORY_RETURNED_NON_OBJECT',
						'Returned type: ' + typeof returnObject
					);
				}
				break;
			} catch (error) {
				if (!(error instanceof Picket.Member[factories[i]].Definition.Fatal)
				||	error.code != 'SIGNATURE_NOT_RECOGNISED') {
					throw error;
				}
			}
		}
		if (typeof returnObject == 'undefined') {
			throw new _.DefinitionFactory.Fatal(
				'INVALID_SIGNATURE',
				'Provided signature: ' + signature
			);
		}
		return returnObject;
	};
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {}
);

;(function(Picket, Member, _){
	
	var messages = {
		PROPERTY_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Property.Definition.Factory must be provided to the constructor',
		METHOD_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Method.Definition.Factory must be provided to the constructor',
		EVENT_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Event.Definition.Factory must be provided to the constructor',
		CONSTANT_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Constant.Definition.Factory must be provided to the constructor',
		NON_STRING_SIGNATURE: 'Signature must be provided as a string',
		INVALID_SIGNATURE:
			'Provided signature could not be understood by any of ' +
			'the available member definition classes' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.DefinitionFactory.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.DefinitionFactory = window.Picket.Member.DefinitionFactory || {}
);

;(function(Picket, _){
	
	_.Type = function(namespaceManager)
	{
		if (!(namespaceManager instanceof Picket.NamespaceManager)) {
			throw new _.Type.Fatal(
				'NON_NAMESPACE_MANAGER_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		this._classes = [];
		this._instances = [];
		this._interfaces = {};
		this._mocks = [];
		this._namespaceManager = namespaceManager;
	};
	
	_.Type.prototype.registerClass = function(classObject, classConstructor)
	{
		if (!(classObject instanceof Picket.Type.Class)) {
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
		if (!(childClassObject instanceof Picket.Type.Class)) {
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
		if (!(classObject instanceof Picket.Type.Class)) {
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
	
	_.Type.prototype.registerMock = function(instance, classObject)
	{
		// @todo Type check both arguments
		this._mocks.push({
			instance:		instance,
			classObject:	classObject
		});
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
		if (typeof classIdentifier == 'object') {
			var originalClassIdentifier = classIdentifier;
			classIdentifier = classIdentifier.constructor;
		}
		var classData = _getClassData(this, classIdentifier);
		if (classData) {
			return classData.classObject;
		} else {
			for (var i = 0; i < this._mocks.length; i++) {
				if (this._mocks[i].instance === originalClassIdentifier) {
					return this._mocks[i].classObject;
				}
			}
		}
		throw new _.Type.Fatal('CLASS_NOT_REGISTERED');
	};
	
	_.Type.prototype.interfaceExists = function(name)
	{
		// @todo Method untested
		var interfaceObject = this.getInterface(name);
		return (interfaceObject === undefined) ? false : true;
	};
	
	_.Type.prototype.getInterface = function(name)
	{
		return this._interfaces[name];
	}
	
	_.Type.prototype.getInterfacesFromClass = function(classObject)
	{
		if (!(classObject instanceof Picket.Type.Class)) {
			throw new _.Type.Fatal(
				'NON_CLASS_OBJECT_PROVIDED',
				'Provided type: ' + typeof classObject
			);
		}
		if (!_classObjectIsRegistered(this, classObject)) {
			for (var i = 0; i < this._mocks.length; i++) {
				if (this._mocks[i].classObject !== classObject) continue;
				return this._mocks[i].classObject.getInterfaces();
			}
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
			? ((classObject instanceof Picket.Type.Class) ? 'classObject' : 'instance')
			: 'constructor';
		if (typeof classObject == 'object' && !(classObject instanceof Picket.Type.Class)) {
			classObject = classObject.constructor;
		}
		if (typeof classObject == 'function') classObject = this.getClass(classObject);
		if (!(classObject instanceof Picket.Type.Class)) {
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
	
	_.Type.prototype.isSameObject = function(object1, object2)
	{
		// @todo If not both instances and not both constructors, throw
		if (typeof object1 == 'object') {
			for (var i = 0; i < this._instances.length; i++) {
				for (var j = 0; j < this._instances[i].length; j++) {
					if (this._instances[i][j] !== object1) continue;
					for (var k = 0; k < this._instances[i].length; k++) {
						if (j == k) continue;
						if (this._instances[i][k] === object2) return true;
					}
					return false;
				}
			}
			return false;
		} else {
			for (var i = 0; i < this._classes.length; i++) {
				if (!this._classes[i].parentClassName) continue;
				if (this._classes[i].constructor === object1) {
					var childObject = object1;
					var parentObject = object2;
				} else if (this._classes[i].constructor === object2) {
					var childObject = object2;
					var parentObject = object1;
				}
				if (!childObject) continue;
				var parentClassData = _getClassData(this, this._namespaceManager.getNamespaceObject(
					this._classes[i].parentClassName
				));
				if (parentClassData.constructor === parentObject) return true;
			}
			return false;
		}
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
	
	var _isMock = function(_this, instance)
	{
		for (var i = 0; i < _this._mocks.length; i++) {
			if (_this._mocks[i].instance === instance) return true;
		}
		return false;
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Registry = window.Picket.Registry || {}
);

;(function(Picket, Registry, _){
	
	var messages = {
		NON_NAMESPACE_MANAGER_PROVIDED:
			'Instance of Picket.NamespaceManager must be provided to the constructor',
		NON_CLASS_OBJECT_PROVIDED:
			'Provided class object is not an instance of Picket.Type.Class',
		NON_STRING_INTERFACE_NAME_PROVIDED: 'Provided interface name is not a string',
		NON_CLASS_CONSTRUCTOR_PROVIDED: 'Provided class constructor is not a function',
		INVALID_CLASS_LOOKUP: 'Class object was looked up using a non instance or constructor',
		CLASS_ALREADY_REGISTERED: 'Provided class object is already registered',
		CLASS_NOT_REGISTERED: 'No class object could be found matching ' +
			'the provided constructor or instance',
		CHILD_CLASS_NOT_REGISTERED: 'No class object could be found matching ' +
			'the provided child class object',
		NON_EXISTENT_PARENT_REQUESTED:
			'A parent object, constructor or instance was requested where no association exists',
		NON_ARRAY_CLASS_INSTANCE_PROVIDED:
			'Class instance must be provided as array of parentally related instances',
		CLASS_INSTANCE_ALREADY_REGISTERED: 'The provided class instance is already registered',
		SINGLE_CLASS_INSTANCE_PROVIDED:
			'Class instance provided as single object instance; if there is no ' +
			'parental relationship, there is no need to register the instance.',
		NON_OBJECT_CLASS_INSTANCE_PROVIDED:
			'Provided class instance contains an entry that is not an object instance',
		INVALID_CLASS_HIERARCHY_INSTANCE_REGISTERED:
			'Provided class instance does not follow the class ' +
			'hierarchy already defined in the registry',
		INCOMPLETE_CLASS_HIERARCHY_INSTANCE_REGISTERED:
			'Provided class instance does not complete the class ' +
			'hierarchy already defined in the registry',
		NON_CLASS_CONSTRUCTOR_OR_INSTANCE_PROVIDED:
			'An argument which was neither class object, class ' +
			'constructor or class instance was provided',
		NON_CLASS_INSTANCE_PROVIDED: 'Provided argument is not a class instance',
		NON_STRING_PARENT_PROVIDED: 'The provided parent class name must be a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Registry.Type.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Registry = window.Picket.Registry || {},
	window.Picket.Registry.Type = window.Picket.Registry.Type || {}
);

;(function(Picket, _){
	
	// @todo Ensure all public method args are type checked
	
	_.Member = function(typeRegistry, typeChecker)
	{
		if (!(typeRegistry instanceof _.Type)) {
			throw new _.Member.Fatal(
				'TYPE_REGISTRY_REQUIRED',
				'Provided type: ' + typeof typeRegistry
			);
		}
		if (!(typeChecker instanceof Picket.TypeChecker)) {
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
		if (!(typeObject instanceof Picket.Type.Class)
		&&	!(typeObject instanceof Picket.Type.Interface)) {
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
		if (!(typeObject instanceof Picket.Type.Class)
		&&	!(typeObject instanceof Picket.Type.Interface)) {
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
		value = property.set(classInstance, accessInstance, value);
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
				classInstance,
				accessInstance,
				classInstanceData.properties[name]
			);
		}
		var defaultValue = property.getDefaultValue(classInstance, accessInstance);
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
		toInspectMethods:
		for (var i = 0; i < methods.length; i++) {
			var argumentTypes = methods[i].getArgumentTypeIdentifiers();
			if (shouldBeStatic != methods[i].isStatic()) continue;
			if (args.length > argumentTypes.length) continue;
			if (args.length < argumentTypes.length) {
				if (!this._typeChecker.areValidTypes(args, argumentTypes.slice(0, args.length))) {
					continue toInspectMethods;
				}
				for (var j = args.length; j < argumentTypes.length; j++) {
					if (!methods[i].argumentIsOptional(j)) continue toInspectMethods;
					var defaultValue = methods[i].getDefaultArgumentValue(j);
					if (defaultValue !== null) {
						if (!this._typeChecker.isValidType(defaultValue, argumentTypes[j])) {
							continue toInspectMethods;
						}
					}
					args.push(defaultValue);
				}
			} else {
				if (!this._typeChecker.areValidTypes(args, argumentTypes)) continue;
			}
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
				eventObject.getArgumentTypeIdentifiers(),
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
		if (memberObject instanceof Picket.Member.Property) {
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
		} else if (memberObject instanceof Picket.Member.Method) {
			var methodExists = true;
			try {
				_getMethodByNameArgumentTypesAndStaticState(
					_this,
					typeObject,
					memberName,
					memberObject.hasArgumentTypes()
						? memberObject.getArgumentTypeIdentifiers()
						: ['none'],
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
					'Argument types: ' + (memberObject.getArgumentTypeIdentifiers().join(', ') || '(none)') +
					'; ' +
					'Is static: ' + (memberObject.isStatic() ? 'true' : 'false')
				);
			}
			var typeMemberData = _getTypeMemberDataFromTypeObject(
				_this,
				typeObject
			);
			typeMemberData.members.methods.push(memberObject);
		} else if (memberObject instanceof Picket.Member.Event) {
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
		} else if (memberObject instanceof Picket.Member.Constant) {
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
				&&	argumentTypes.length == methods[i].getArgumentTypeIdentifiers().length
				&&	isStatic === methods[i].isStatic()) {
					for (var j = 0; j < argumentTypes.length; j++) {
						if (argumentTypes[j] != methods[i].getArgumentTypeIdentifiers()[j]) {
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
		// @todo Check return is instance of Picket.Type.Class
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
					&&	abstractMember.getReturnType() === allMembers[i-1].getReturnType()) {
						if (!abstractMember.hasArgumentTypes() || _arraysEqual(
							abstractMember.getArgumentTypeIdentifiers(),
							allMembers[i-1].getArgumentTypeIdentifiers()
						)) {
							abstractMembers.splice(j, 1);
						}
					}
				}
			}
		}
		return (abstractMembers.length > 0) ? false : true;
	};
	
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Registry = window.Picket.Registry || {}
);

;(function(Picket, Registry, _){
	
	var messages = {
		TYPE_REGISTRY_REQUIRED: 'Instance of Picket.Registry.Type is required by constructor',
		TYPE_CHECKER_REQUIRED: 'Instance of Picket.TypeChecker is required by constructor',
		NON_CLASS_INSTANCE_OR_CONSTRUCTOR_PROVIDED:
			'The provided call target was not an object instance or constructor',
		NON_STRING_METHOD_NAME_PROVIDED: 'The provided method name is not a string',
		NON_ARRAY_METHOD_ARGUMENTS_PROVIDED: 'The provided method arguments are not an array',
		TARGET_NOT_CLASS_OR_INTERFACE:
			'Object provided must be Type.Class or Type.Interface',
		PROPERTY_NOT_REGISTERED:
			'No property with the given name has been registered against the given type',
		PROPERTY_ALREADY_REGISTERED:
			'A property with the same name has already been registered against the given type',
		METHOD_NOT_REGISTERED:
			'No method with the given name and argument signature has been ' +
			'registered against the given type',
		METHOD_ALREADY_REGISTERED:
			'A method with the same name, argument signature and static setting has already ' +
			'been registered against the given type',
		EVENT_NOT_REGISTERED:
			'No event with the given name has been registered against the given type',
		EVENT_ALREADY_REGISTERED:
			'An event with the same name has already been registered against the given type',
		EVENT_TARGET_METHOD_NOT_REGISTERED:
			'The provided event target method does not exist',
		EVENT_BIND_NOT_PERMITTED: 'The event object did not indicate that the bind can be made',
		CONSTANT_NOT_REGISTERED:
			'No constant with the given name has been registered against the given type',
		CONSTANT_ALREADY_REGISTERED:
			'A constant with the same name has already been registered against the given type',
		CONSTANT_RETRIEVED_AGAINST_CLASS_INSTANCE:
			'A constant was requested using an instance of a class instead of its constructor'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Registry.Member.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Registry = window.Picket.Registry || {},
	window.Picket.Registry.Member = window.Picket.Registry.Member || {}
);

(function(_){
	
	_.Instantiator = function()
	{
		this._typeFactory;
		this._classFactory;
		this._interfaceFactory;
		this._typeDefinitionFactory;
		this._classDefinitionFactory;
		this._interfaceDefinitionFactory;
		this._memberFactory;
		this._propertyFactory;
		this._methodFactory;
		this._eventFactory;
		this._constantFactory;
		this._memberDefinitionFactory;
		this._propertyDefinitionFactory;
		this._methodDefinitionFactory;
		this._eventDefinitionFactory;
		this._constantDefinitionFactory;
		this._namespaceManager;
		this._typeRegistry;
		this._memberRegistry;
		this._typeChecker;
		this._accessController;
		this._autoLoader;
		this._includer;
		this._autoLoadInstantiator;
		this._reflectionFactory;
	};
	
	_.Instantiator.prototype.getTypeFactory = function()
	{
		if (!this._typeFactory) {
			this._typeFactory = new Picket.Type.Factory(
				this.getTypeDefinitionFactory(),
				this.getClassFactory(),
				this.getInterfaceFactory(),
				this.getTypeRegistry(),
				this.getMemberRegistry(),
				this.getNamespaceManager()
			);
		}
		return this._typeFactory;
	};
	
	_.Instantiator.prototype.getClassFactory = function()
	{
		if (!this._classFactory) {
			this._classFactory = new Picket.Type.Class.Factory();
		}
		return this._classFactory;
	};
	
	_.Instantiator.prototype.getInterfaceFactory = function()
	{
		if (!this._interfaceFactory) {
			this._interfaceFactory = new Picket.Type.Interface.Factory();
		}
		return this._interfaceFactory;
	};
	
	_.Instantiator.prototype.getTypeDefinitionFactory = function()
	{
		if (!this._typeDefinitionFactory) {
			this._typeDefinitionFactory = new Picket.Type.DefinitionFactory(
				this.getClassDefinitionFactory(),
				this.getInterfaceDefinitionFactory()
			);
		}
		return this._typeDefinitionFactory;
	};
	
	_.Instantiator.prototype.getClassDefinitionFactory = function()
	{
		if (!this._classDefinitionFactory) {
			this._classDefinitionFactory = new Picket.Type.Class.Definition.Factory();
		}
		return this._classDefinitionFactory;
	};
	
	_.Instantiator.prototype.getInterfaceDefinitionFactory = function()
	{
		if (!this._interfaceDefinitionFactory) {
			this._interfaceDefinitionFactory = new Picket.Type.Interface.Definition.Factory();
		}
		return this._interfaceDefinitionFactory;
	};
	
	_.Instantiator.prototype.getMemberFactory = function()
	{
		if (!this._memberFactory) {
			this._memberFactory = new Picket.Member.Factory(
				this.getMemberDefinitionFactory(),
				this.getPropertyFactory(),
				this.getMethodFactory(),
				this.getEventFactory(),
				this.getConstantFactory(),
				this.getTypeChecker(),
				this.getAccessController()
			);
		}
		return this._memberFactory;
	};
	
	_.Instantiator.prototype.getPropertyFactory = function()
	{
		if (!this._propertyFactory) {
			this._propertyFactory = new Picket.Member.Property.Factory();
		}
		return this._propertyFactory;
	};
	
	_.Instantiator.prototype.getMethodFactory = function()
	{
		if (!this._methodFactory) {
			this._methodFactory = new Picket.Member.Method.Factory();
		}
		return this._methodFactory;
	};
	
	_.Instantiator.prototype.getEventFactory = function()
	{
		if (!this._eventFactory) {
			this._eventFactory = new Picket.Member.Event.Factory();
		}
		return this._eventFactory;
	};
	
	_.Instantiator.prototype.getConstantFactory = function()
	{
		if (!this._constantFactory) {
			this._constantFactory = new Picket.Member.Constant.Factory();
		}
		return this._constantFactory;
	};
	
	_.Instantiator.prototype.getMemberDefinitionFactory = function()
	{
		if (!this._memberDefinitionFactory) {
			this._memberDefinitionFactory = new Picket.Member.DefinitionFactory(
				this.getPropertyDefinitionFactory(),
				this.getMethodDefinitionFactory(),
				this.getEventDefinitionFactory(),
				this.getConstantDefinitionFactory()
			);
		}
		return this._memberDefinitionFactory;
	};
	
	_.Instantiator.prototype.getPropertyDefinitionFactory = function()
	{
		if (!this._propertyDefinitionFactory) {
			this._propertyDefinitionFactory = new Picket.Member.Property.Definition.Factory();
		}
		return this._propertyDefinitionFactory;
	};
	
	_.Instantiator.prototype.getMethodDefinitionFactory = function()
	{
		if (!this._methodDefinitionFactory) {
			this._methodDefinitionFactory = new Picket.Member.Method.Definition.Factory();
		}
		return this._methodDefinitionFactory;
	};
	
	_.Instantiator.prototype.getEventDefinitionFactory = function()
	{
		if (!this._eventDefinitionFactory) {
			this._eventDefinitionFactory = new Picket.Member.Event.Definition.Factory();
		}
		return this._eventDefinitionFactory;
	};
	
	_.Instantiator.prototype.getConstantDefinitionFactory = function()
	{
		if (!this._constantDefinitionFactory) {
			this._constantDefinitionFactory = new Picket.Member.Constant.Definition.Factory();
		}
		return this._constantDefinitionFactory;
	};
	
	_.Instantiator.prototype.getNamespaceManager = function()
	{
		if (!this._namespaceManager) {
			this._namespaceManager = new Picket.NamespaceManager();
		}
		return this._namespaceManager;
	};
	
	_.Instantiator.prototype.getTypeRegistry = function()
	{
		if (!this._typeRegistry) {
			this._typeRegistry = new Picket.Registry.Type(
				this.getNamespaceManager()
			);
		}
		return this._typeRegistry;
	};
	
	_.Instantiator.prototype.getMemberRegistry = function()
	{
		if (!this._memberRegistry) {
			this._memberRegistry = new Picket.Registry.Member(
				this.getTypeRegistry(),
				this.getTypeChecker()
			);
		}
		return this._memberRegistry;
	};
	
	_.Instantiator.prototype.getTypeChecker = function()
	{
		if (!this._typeChecker) {
			this._typeChecker = new Picket.TypeChecker(
				new Picket.TypeChecker.ReflectionFactory()
			);
		}
		return this._typeChecker;
	};
	
	_.Instantiator.prototype.getAccessController = function()
	{
		if (!this._accessController) {
			this._accessController = new Picket.Access.Controller(
				this.getTypeRegistry()
			);
		}
		return this._accessController;
	};
	
	_.Instantiator.prototype.getAutoLoader = function()
	{
		if (!this._autoLoader) {
			this._autoLoader = new Picket.AutoLoader(
				this.getIncluder(),
				this.getAutoLoadInstantiator(),
				this.getNamespaceManager(),
				this.getMemberRegistry()
			);
		}
		return this._autoLoader;
	};
	
	_.Instantiator.prototype.getIncluder = function()
	{
		if (!this._includer) {
			this._includer = new Picket.AutoLoader.Includer.Script();
		}
		return this._includer;
	};
	
	_.Instantiator.prototype.getAutoLoadInstantiator = function()
	{
		if (!this._autoLoadInstantiator) {
			this._autoLoadInstantiator = new Picket.AutoLoader.Instantiator();
		}
		return this._autoLoadInstantiator;
	};
	
	_.Instantiator.prototype.getReflectionFactory = function()
	{
		if (!this._reflectionFactory) {
			this._reflectionFactory = new Picket.Reflection.Factory();
		}
		return this._reflectionFactory;
	};
	
})(window.Picket = window.Picket || {});

(function(_){
	
	_.AutoLoader = function(includer, instantiator, namespaceManager, memberRegistry)
	{
		if (!(includer instanceof Picket.AutoLoader.Includer.Script)) {
			throw new _.AutoLoader.Fatal(
				'INCLUDER_NOT_PROVIDED',
				'Provided type: ' + typeof includer
			);
		}
		if (!(instantiator instanceof Picket.AutoLoader.Instantiator)) {
			throw new _.AutoLoader.Fatal(
				'INSTANTIATOR_NOT_PROVIDED',
				'Provided type: ' + typeof instantiator
			);
		}
		if (!(namespaceManager instanceof Picket.NamespaceManager)) {
			throw new _.AutoLoader.Fatal(
				'NAMESPACE_MANAGER_NOT_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		if (!(memberRegistry instanceof Picket.Registry.Member)) {
			throw new _.AutoLoader.Fatal(
				'MEMBER_REGISTRY_NOT_PROVIDED',
				'Provided type: ' + typeof memberRegistry
			);
		}
		this._includer = includer;
		this._instantiator = instantiator;
		this._namespaceManager = namespaceManager;
		this._memberRegistry = memberRegistry;
		this._stacks = [];
		this._continueBuffer = [];
		this._classMaps = [];
		this._requestedScripts = [];
		this._loadedScripts = [];
		this._classCallbacks = {};
		this._resourcesDeclaredAvailable = [];
	};
	
	_.AutoLoader.prototype.isRunning = function()
	{
		return (this._stacks.length > 0) ? true : false;
	};
	
	_.AutoLoader.prototype.start = function(className, classMap)
	{
		// @todo Ensure classMap is object containing only strings
		if (typeof className != 'string') {
			throw new _.AutoLoader.Fatal(
				'NON_STRING_CLASS_NAME',
				'Provided type: ' + typeof className
			);
		}
		var stack = {
			className:        className,
			classConstructor: undefined,
			loadingScripts:   []
		};
		this._stacks.push(stack);
		_addClassAutoloadPatterns(this, classMap);
		if (_classExists(this, className)) {
			stack.classConstructor = _getClassConstructor(this, className);
			_attemptFinish(this);
		} else {
			_load(this, className, stack);
		}
	};
	
	_.AutoLoader.prototype.require = function(className, targetObject, accessObject, methodName)
	{
		// @todo Check className and methodName are strings
		// @todo Check targetObject is object and has method
		// @todo Check access object is object
		var stack = {
			className:        className,
			targetInstance:   targetObject,
			accessObject:     accessObject,
			targetMethodName: methodName,
			loadingScripts:   []
		};
		this._stacks.push(stack);
		if (_classExists(this, className)) {
			_attemptFinish(this);
		} else {
			_load(this, className, stack);
		}
	};
	
	_.AutoLoader.prototype.continue = function(className, callback)
	{
		if (typeof className != 'string') {
			throw new _.AutoLoader.Fatal(
				'NON_STRING_CLASS_NAME',
				'Provided type: ' + typeof className
			);
		}
		if (!this.isRunning()) throw new _.AutoLoader.Fatal('NOT_RUNNING');
		if (!_resourceDeclaredAvailable(this, className)) {
			this._continueBuffer.push(_getScriptLocation(this, className));
		}
		if (typeof callback == 'function') {
			if (typeof this._classCallbacks[className] == 'undefined') {
				this._classCallbacks[className] = [];
			}
			this._classCallbacks[className].push(callback);
		}
		_load(this, className);
	};
	
	_.AutoLoader.prototype.declareAssemblyResources = function(resources)
	{
		// @todo Throw if resources is not an array
		for (var i = 0; i < resources.length; i++) {
			this._resourcesDeclaredAvailable.push(resources[i]);
		}
	};
	
	var _addClassAutoloadPatterns = function(_this, map)
	{
		for (var pattern in map) {
			if (!map.hasOwnProperty(pattern)) continue;
			_this._classMaps.push({
				pattern: pattern,
				target:  map[pattern]
			});
		}
		_this._classMaps.sort(function(a, b){
			return b.pattern.length - a.pattern.length;
		});
	};
	
	var _load = function(_this, className, stack)
	{
		if (_classExists(_this, className) || _resourceDeclaredAvailable(_this, className)) {
			_attemptFinish(_this);
		} else {
			var scriptLocation = _getScriptLocation(_this, className);
			if (_this._loadedScripts.indexOf(scriptLocation) > -1) {
				_attemptFinish(_this);
			} else {
				if (_this._requestedScripts.indexOf(scriptLocation) == -1) {
					_this._includer.include(
						scriptLocation,
						_getScriptLoadedCallback(_this, className, scriptLocation),
						_getScriptFailedCallback(_this, className, scriptLocation)
					);
					_this._requestedScripts.push(scriptLocation);
				}
				if (stack) stack.loadingScripts.push(scriptLocation);
			}
		}
	};
	
	var _classExists = function(_this, className)
	{
		try {
			_getClassConstructor(_this, className);
			return true;
		} catch (error) {
			if (!(error instanceof Picket.NamespaceManager.Fatal)
			||	error.code != 'NAMESPACE_OBJECT_DOES_NOT_EXIST') {
				throw error;
			}
			return false;
		}
	};
	
	var _getClassConstructor = function(_this, className)
	{
		return constructor = _this._namespaceManager.getNamespaceObject(className);
	};
	
	var _attemptFinish = function(_this)
	{
		var index = _this._stacks.length;
		while (index--) {
			var stack = _this._stacks[index];
			// @todo Check constructor is () -> undefined
			if (stack.loadingScripts.length > 0) continue;
			_this._stacks.splice(index, 1);
			if (typeof stack.classConstructor != 'undefined') {
				var instance = _this._instantiator.instantiate(stack.classConstructor);
			} else {
				// @todo Check method is (string) -> undefined
				_this._memberRegistry.callMethod(
					stack.targetInstance,
					stack.accessObject,
					stack.targetMethodName,
					[stack.className]
				);
			}
		}
	};
	
	var _getScriptLocation = function(_this, className)
	{
		var prependPath = '';
		for (var i in _this._classMaps) {
			var pattern = _this._classMaps[i].pattern;
			if (className.substr(0, pattern.length) == pattern) {
				prependPath = _this._classMaps[i].target;
				className = className.substr(pattern.length);
				break;
			}
		}
		if (!prependPath.match(/(https?:\/)?\//)) prependPath = '/' + prependPath;
		return prependPath + className.replace(/\./g, '/') + '.js';
	};
	
	var _getScriptLoadedCallback = function(_this, className, scriptLocation)
	{
		return (function(_this, className, scriptLocation){
			return function(){
				_handleLoadedScript(_this, className, scriptLocation);
			};
		})(_this, className, scriptLocation);
	};
	
	var _getScriptFailedCallback = function(_this, className, scriptLocation)
	{
		return (function(className, scriptLocation){
			return function(){
				throw new _.AutoLoader.Fatal(
					'SCRIPT_NOT_LOADED',
					'Provided class name: ' + className + '; ' +
					'Included script: ' + scriptLocation
				);
			};
		})(className, scriptLocation);
	};
	
	var _handleLoadedScript = function(_this, className, scriptLocation)
	{
		if (typeof _this._classCallbacks[className] != 'undefined') {
			for (var i in _this._classCallbacks[className]) {
				_this._classCallbacks[className][i]();
			};
			delete _this._classCallbacks[className];
		}
		var index = _this._stacks.length;
		while (index--) {
			var stack = _this._stacks[index];
			if (className == stack.className
			&&	typeof stack.targetInstance == 'undefined') {
				// @todo Catch error?
				stack.classConstructor = _getClassConstructor(
					_this,
					className
				);
			}
			var scriptIndex = stack.loadingScripts.indexOf(scriptLocation);
			if (scriptIndex > -1) {
				stack.loadingScripts.splice(scriptIndex, 1);
				for (var j in _this._continueBuffer) {
					if (_this._loadedScripts.indexOf(_this._continueBuffer[j]) == -1
					&&	stack.loadingScripts.indexOf(_this._continueBuffer[j]) == -1) {
						stack.loadingScripts.push(_this._continueBuffer[j]);
					}
				}
			}
			if (stack.loadingScripts.length == 0) {
				_attemptFinish(_this);
			}
			
		}
		_this._loadedScripts.push(scriptLocation);
		_this._continueBuffer = [];
	};
	
	var _resourceDeclaredAvailable = function(_this, resourceName)
	{
		return (_this._resourcesDeclaredAvailable.indexOf(resourceName) == -1) ? false : true;
	};
	
})(window.Picket = window.Picket || {});

;(function(Picket, _){
	
	var messages = {
		INCLUDER_NOT_PROVIDED: 'An includer must be provided',
		INSTANTIATOR_NOT_PROVIDED:
			'Instance of Picket.AutoLoader.Instantiator must be provided',
		NAMESPACE_MANAGER_NOT_PROVIDED: 'Instance of Picket.NamespaceManager must be provided',
		MEMBER_REGISTRY_NOT_PROVIDED: 'Instance of Picket.Registry.Member must be provided',
		ALREADY_RUNNING: 'Cannot start a new loading session whilst one is already running',
		NOT_RUNNING: 'Cannot continue a loading session whilst not running',
		SCRIPT_NOT_LOADED: 'A required script could not be loaded',
		CLASS_NOT_FOUND: 'An identified class script did not contain the expected class',
		NON_STRING_CLASS_NAME: 'A provided class name was not a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('AutoLoader.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.AutoLoader = window.Picket.AutoLoader || {}
);

(function(Picket, _){
	
	_.Instantiator = function(){};
	
	_.Instantiator.prototype.instantiate = function(constructor)
	{
		return new constructor();
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.AutoLoader = window.Picket.AutoLoader || {}
);

(function(Picket, AutoLoader, _){
	
	_.Script = function(){};
	
	_.Script.prototype.include = function(scriptLocation, successCallback, errorCallback)
	{
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptLocation;
		script.async = false; // @todo I don't know exactly what this does. Experiment.
		script.onreadystatechange = script.onload = function(){
			// http://stackoverflow.com/questions/6725272/dynamic-cross-browser-script-loading
			var state = script.readyState;
			if (!state || /loaded|complete/.test(state)) {
				successCallback();
			} else {
				errorCallback();
			}
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.AutoLoader = window.Picket.AutoLoader || {},
	window.Picket.AutoLoader.Includer = window.Picket.AutoLoader.Includer || {}
);


(function(Picket, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.buildClass = function(identifier)
	{
		return new Picket.Reflection.Class(identifier);
	};
	
	_.Factory.prototype.buildClassInstance = function(instance)
	{
		return new Picket.Reflection.ClassInstance(instance);
	};
	
	_.Factory.prototype.buildInterface = function(instance)
	{
		return new Picket.Reflection.Interface(instance);
	};
	
	_.Factory.prototype.buildProperty = function(className, propertyName)
	{
		return new Picket.Reflection.Property(className, propertyName);
	};
	
	_.Factory.prototype.buildMethod = function(className, methodName)
	{
		return new Picket.Reflection.Method(className, methodName);
	};
	
	_.Factory.prototype.buildEvent = function(className, eventName)
	{
		return new Picket.Reflection.Event(className, eventName);
	};
	
	_.Factory.prototype.buildConstant = function(className, constantName)
	{
		return new Picket.Reflection.Constant(className, constantName);
	};
	
	_.Factory.prototype.buildPropertyInstance = function(objectInstance, propertyName)
	{
		return new Picket.Reflection.PropertyInstance(objectInstance, propertyName);
	};
	
	_.Factory.prototype.buildMethodInstance = function(objectInstance, methodName)
	{
		return new Picket.Reflection.MethodInstance(objectInstance, methodName);
	};
	
	_.Factory.prototype.buildEventInstance = function(objectInstance, eventName)
	{
		return new Picket.Reflection.EventInstance(objectInstance, eventName);
	};
	
	_.Factory.prototype.buildArgument = function(identifier, isOptional, defaultValue, owner)
	{
		return new Picket.Reflection.Argument(identifier, isOptional, defaultValue, owner);
	};
	
	_.Factory.prototype.buildType = function(identifier)
	{
		return new Picket.Reflection.Type(identifier);
	};
	
	_.Factory.prototype.buildAccessType = function(identifier)
	{
		return new Picket.Reflection.AccessType(identifier);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

(function(Picket, _){
	
	// @todo propertyExists, methodExists, etc
	
	_.Class = function(identifier)
	{
		
		if (typeof identifier == 'string') {
			identifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				identifier
			);
		}
		
		if (typeof identifier != 'function' && typeof identifier != 'object') {
			throw new _.Class.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof identifier
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(identifier)) {
			throw new _.Class.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(identifier);
		
	};
	
	_.Class.prototype.getName = function()
	{
		return this._classObject.getName();
	};
	
	_.Class.prototype.hasParent = function()
	{
		return this._classObject.isExtension();
	};
	
	_.Class.prototype.getParent = function()
	{
		var parentClassName = this._classObject.getParentClass();
		return Picket._instantiator.getReflectionFactory().buildClass(parentClassName);
	};
	
	_.Class.prototype.getInterfaces = function()
	{
		var interfaceNames = this._classObject.getInterfaces();
		var reflectionInterfaces = [];
		for (var i = 0; i < interfaceNames.length; i++) {
			reflectionInterfaces.push(
				Picket._instantiator.getReflectionFactory().buildInterface(interfaceNames[i])
			);
		}
		return reflectionInterfaces;
	};
	
	_.Class.prototype.implementsInterface = function(interfaceName)
	{
		var interfaces = Picket._instantiator.getTypeRegistry().getInterfacesFromClass(
			this._classObject
		);
		for (var i = 0; i < interfaces.length; i++) {
			if (interfaces[i] === interfaceName || interfaces[i].getName() === interfaceName) {
				return true;
			}
		}
		return false;
	};
	
	_.Class.prototype.getMembers = function()
	{
		return _convertToReflectionMembers(this, _getMembers(this));
	};
	
	_.Class.prototype.getProperties = function()
	{
		return _getFilteredMembers(this, Picket.Member.Property);
	};
	
	_.Class.prototype.getProperty = function(name)
	{
		// @todo Ensure name is a string or undefined
		var propertiesArray = _getFilteredMembers(this, Picket.Member.Property, name);
		// @todo Throw if length is not 1
		return propertiesArray[0];
	};
	
	_.Class.prototype.getMethods = function(name)
	{
		// @todo Ensure name is a string or undefined
		return _getFilteredMembers(this, Picket.Member.Method, name);
	};
	
	_.Class.prototype.getEvents = function(name)
	{
		// @todo Ensure name is a string or undefined
		return _getFilteredMembers(this, Picket.Member.Event, name);
	};
	
	_.Class.prototype.getEvent = function(name)
	{
		// @todo Ensure name is a string or undefined
		var eventsArray = _getFilteredMembers(this, Picket.Member.Event, name);
		// @todo Throw if length is not 1
		return eventsArray[0];
	};
	
	_.Class.prototype.getConstants = function(name)
	{
		// @todo Ensure name is a string or undefined
		return _getFilteredMembers(this, Picket.Member.Constant, name);
	};
	
	_.Class.prototype.getConstant = function(name)
	{
		// @todo Ensure name is a string or undefined
		var constantsArray = _getFilteredMembers(this, Picket.Member.Constant, name);
		// @todo Throw if length is not 1
		return constantsArray[0];
	};
	
	_.Class.prototype.isAbstract = function()
	{
		return (_getAbstractType(this) == 'none') ? false : true;
	};
	
	_.Class.prototype.isExplicitAbstract = function()
	{
		return (_getAbstractType(this) == 'explicit') ? true : false;
	};
	
	_.Class.prototype.isImplicitAbstract = function()
	{
		return (_getAbstractType(this) == 'implicit') ? true : false;
	};
	
	_.Class.prototype.createNew = function()
	{
		var args = Array.prototype.splice.call(arguments, 0);
		args.unshift(null);
		var constructor = Picket._instantiator.getNamespaceManager().getNamespaceObject(
			this._classObject.getName()
		);
		var F = constructor.bind.apply(constructor, args);
		return new F();
	};
	
	_.Class.prototype.getMock = function()
	{
		
		// Get the real constructor function
		// for the class and ensure it is a function
		var constructor = Picket._instantiator.getNamespaceManager().getNamespaceObject(
			this.getName()
		);
		
		// Create a proxy class, assigning
		// the target class's prototype to it
		var Mock = function(){};
		Mock.prototype = constructor.prototype;
		
		// Create an instance of the proxy
		var mock = new Mock();
		
		var properties = _filterByType(this, Picket.Member.Property, _getMembers(this));
		var methods = _filterByType(this, Picket.Member.Method, _getMembers(this));
		
		for (var i = 0; i < properties.length; i++) mock[properties[i].getName()] = function(){};
		for (var i = 0; i < methods.length; i++) mock[methods[i].getName()] = function(){};
		
		// @todo Test this line
		Picket._instantiator.getTypeRegistry().registerMock(mock, this._classObject);
		
		// Return the finished mock
		return mock;
		
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._classObject);
	};
	
	var _getFilteredMembers = function(_this, type, name)
	{
		return _convertToReflectionMembers(
			_this,
			_filterByName(
				_this,
				name,
				_filterByType(
					_this,
					type,
					_getMembers(_this)
				)
			)
		);
	};
	
	var _filterByType = function(_this, type, members)
	{
		if (!type) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof type) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	_filterByName = function(_this, name, members)
	{
		if (!name) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i].getName() == name) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	var _convertToReflectionMembers = function(_this, members)
	{
		var reflectionMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof Picket.Member.Property) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildProperty(
						_this.getName(),
						members[i].getName()
					)
				);
			} else if (members[i] instanceof Picket.Member.Method) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildMethod(
						_this.getName(),
						members[i].getName()
					)
				);
			} else if (members[i] instanceof Picket.Member.Event) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildEvent(
						_this.getName(),
						members[i].getName()
					)
				);
			} else if (members[i] instanceof Picket.Member.Constant) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildConstant(
						_this.getName(),
						members[i].getName()
					)
				);
			}
		}
		return reflectionMembers;
	};
	
	var _getAbstractType = function(_this)
	{
		try {
			_this._classObject.requestInstantiation();
		} catch (error) {
			if (!(error instanceof Picket.Type.Class.Fatal)) throw error;
			if (error.code == 'CANNOT_INSTANTIATE_ABSTRACT_CLASS') return 'explicit';
			if (error.code == 'CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS') return 'implicit';
			if (error.code == 'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS') {
				return 'implicit';
			}
			// @todo Throw new error - we shouldn't get here
		}
		return 'none';
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Class = _.Class;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Class.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Class = window.Picket.Reflection.Class || {}
);

(function(Picket, _){
	
	_.ClassInstance = function(instance)
	{
		
		if (typeof instance != 'object') {
			throw new _.ClassInstance.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof instance
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(instance)) {
			throw new _.ClassInstance.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._instance = instance;
		
	};
	
	_.ClassInstance.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(this._instance);
	};
	
	_.ClassInstance.prototype.getMemberInstances = function()
	{
		return _convertToReflectionMembers(this, _getMembers(this));
	};
	
	_.ClassInstance.prototype.getPropertyInstances = function()
	{
		return _getFilteredMembers(this, Picket.Member.Property);
	};
	
	_.ClassInstance.prototype.getPropertyInstance = function(name)
	{
		// @todo Ensure name is a string or undefined
		var propertiesArray = _getFilteredMembers(this, Picket.Member.Property, name);
		// @todo Throw if length is not 1
		return propertiesArray[0];
	};
	
	_.ClassInstance.prototype.getMethodInstances = function(name)
	{
		return _getFilteredMembers(this, Picket.Member.Method, name);
	};
	
	_.ClassInstance.prototype.getEventInstances = function()
	{
		return _getFilteredMembers(this, Picket.Member.Event);
	};
	
	_.ClassInstance.prototype.getEventInstance = function(name)
	{
		// @todo Ensure name is a string or undefined
		var eventsArray =  _getFilteredMembers(this, Picket.Member.Event, name);
		// @todo Throw if length is not 1
		return eventsArray[0];
	};
	
	var _getMembers = function(_this)
	{
		var classObject = Picket._instantiator.getTypeRegistry().getClass(_this._instance);
		return Picket._instantiator.getMemberRegistry().getMembers(classObject);
	};
	
	var _getFilteredMembers = function(_this, type, name)
	{
		return _convertToReflectionMembers(
			_this,
			_filterByName(
				_this,
				name,
				_filterByType(
					_this,
					type,
					_getMembers(_this)
				)
			)
		);
	};
	
	var _filterByType = function(_this, type, members)
	{
		if (!type) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof type) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	_filterByName = function(_this, name, members)
	{
		if (!name) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i].getName() == name) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	var _convertToReflectionMembers = function(_this, members)
	{
		var reflectionMembers = [];
		var factory = Picket._instantiator.getReflectionFactory();
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof Picket.Member.Property) {
				reflectionMembers.push(factory.buildPropertyInstance(
					_this._instance,
					members[i].getName()
				));
			} else if (members[i] instanceof Picket.Member.Method) {
				reflectionMembers.push(factory.buildMethodInstance(
					_this._instance,
					members[i].getName()
				));
			} else if (members[i] instanceof Picket.Member.Event) {
				reflectionMembers.push(factory.buildEventInstance(
					_this._instance,
					members[i].getName()
				));
			} else {
				continue;
			}
		}
		return reflectionMembers;
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.ClassInstance = _.ClassInstance;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		CLASS_DOES_NOT_EXIST: 'Provided object is not an instance of a valid class',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be an object instance'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.ClassInstance.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.ClassInstance = window.Picket.Reflection.ClassInstance || {}
);

(function(Picket, _){
	
	_.Interface = function(name)
	{
		
		if (typeof name != 'string') {
			throw new _.Interface.Fatal(
				'NON_STRING_INTERFACE_NAME_PROVIDED',
				'Provided type: ' +  typeof name
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().interfaceExists(name)) {
			throw new _.Interface.Fatal(
				'INTERFACE_DOES_NOT_EXIST',
				'Provided name: ' + name
			);
		}
		
		this._interfaceObject = Picket._instantiator.getTypeRegistry().getInterface(name);
		
	};
	
	_.Interface.prototype.getName = function()
	{
		return this._interfaceObject.getName();
	};
	
	_.Interface.prototype.getMembers = function()
	{
		return _convertToReflectionMembers(this, _getMembers(this));
	};
	
	_.Interface.prototype.getMethods = function(name)
	{
		return _getFilteredMembers(this, Picket.Member.Method, name);
	};
	
	_.Interface.prototype.getEvents = function()
	{
		return _getFilteredMembers(this, Picket.Member.Event);
	};
	
	_.Interface.prototype.getEvent = function(name)
	{
		return _getFilteredMembers(this, Picket.Member.Event, name);
	};
	
	_.Interface.prototype.getMock = function()
	{
		
		var Mock = function(){};
		
		var mock = new Mock();
		
		var properties = _filterByType(this, Picket.Member.Property, _getMembers(this));
		var methods = _filterByType(this, Picket.Member.Method, _getMembers(this));
		
		for (var i = 0; i < properties.length; i++) mock[properties[i].getName()] = function(){};
		for (var i = 0; i < methods.length; i++) mock[methods[i].getName()] = function(){};
		
		mock.bind = function(){};
		
		Picket._instantiator.getTypeRegistry().registerMock(mock, new Picket.Type.Class(
			new Picket.Type.Class.Definition(
				'class Picket.Mock' + Math.floor(Math.random() * 999999) + ' implements ' + this._interfaceObject.getName()
			),
			Picket._instantiator.getTypeRegistry(),
			Picket._instantiator.getMemberRegistry(),
			Picket._instantiator.getNamespaceManager()
		));
		
		return mock;
		
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._interfaceObject);
	};
	
	var _getFilteredMembers = function(_this, type, name)
	{
		return _convertToReflectionMembers(
			_this,
			_filterByName(
				_this,
				name,
				_filterByType(
					_this,
					type,
					_getMembers(_this)
				)
			)
		);
	};
	
	var _filterByType = function(_this, type, members)
	{
		if (!type) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof type) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	_filterByName = function(_this, name, members)
	{
		if (!name) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i].getName() == name) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	var _convertToReflectionMembers = function(_this, members)
	{
		var reflectionMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof Picket.Member.Method) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildMethod(members[i])
				);
			} else if (members[i] instanceof Picket.Member.Event) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildEvent(members[i])
				);
			}
		}
		return reflectionMembers;
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Interface = _.Interface;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		INTERFACE_DOES_NOT_EXIST: 'Provided name does not describe a valid interface',
		NON_STRING_INTERFACE_NAME_PROVIDED: 'The provided name must be a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Interface.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Interface = window.Picket.Reflection.Interface || {}
);

(function(Picket, _){
	
	_.Property = function(classIdentifier, propertyName)
	{
		
		if (typeof classIdentifier == 'string') {
			classIdentifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				classIdentifier
			);
		}
		
		if (typeof classIdentifier != 'function' && typeof classIdentifier != 'object') {
			throw new _.Property.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof classIdentifier
			);
		}
		
		if (typeof propertyName != 'string') {
			throw new _.Property.Fatal(
				'NON_STRING_PROPERTY_NAME_PROVIDED',
				'Provided type: ' + typeof propertyName
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(classIdentifier)) {
			throw new _.Property.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(classIdentifier);
		
		var members = _getMembers(this);
		
		for (var i = 0; i < members.length; i++) {
			
			if (members[i] instanceof Picket.Member.Property
			&&  members[i].getName() == propertyName) {
				this._propertyObject = members[i];
				return;
			}
			
		}
		
		throw new _.Property.Fatal(
			'PROPERTY_DOES_NOT_EXIST',
			'Property name: ' + propertyName
		);
		
	};
	
	_.Property.prototype.getName = function()
	{
		return this._propertyObject.getName();
	};
	
	_.Property.prototype.getType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildType(
			this._propertyObject.getTypeIdentifier()
		);
	};
	
	_.Property.prototype.getAccessType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildAccessType(
			this._propertyObject.getAccessTypeIdentifier()
		);
	};
	
	_.Property.prototype.hasDefaultValue = function()
	{
		try {
			this.getDefaultValue();
		} catch (error) {
			if (!(error instanceof _.Property.Fatal)
			||  error.code != 'UNDEFINED_DEFAULT_VALUE_REQUESTED') {
				throw error;
			}
			return false;
		}
		return true;
	};
	
	_.Property.prototype.getDefaultValue = function()
	{
		var defaultValue = this._propertyObject.getDefaultValue();
		if (defaultValue === null) throw new _.Property.Fatal('UNDEFINED_DEFAULT_VALUE_REQUESTED');
		return defaultValue;
	};
	
	_.Property.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(
			this._classObject.getName()
		);
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._classObject);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Property = _.Property;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_PROPERTY_NAME_PROVIDED: 'Provided property name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		PROPERTY_DOES_NOT_EXIST:
			'Provided property name and class identifier do not describe a valid property',
		UNDEFINED_DEFAULT_VALUE_REQUESTED:
			'A call was made to \'getDefaultValue\' when no default value exists'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Property.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Property = window.Picket.Reflection.Property || {}
);

(function(Picket, _){
	
	_.PropertyInstance = function(objectInstance, propertyName)
	{
		
		// Force an error if the
		// property is not valid
		Picket._instantiator.getMemberRegistry().getPropertyValue(
			objectInstance,
			objectInstance,
			propertyName
		);
		
		this._objectInstance = objectInstance;
		this._name = propertyName;
		
	};
	
	_.PropertyInstance.prototype.getProperty = function()
	{
		return Picket._instantiator.getReflectionFactory().buildProperty(
			this._objectInstance,
			this._name
		);
	};
	
	_.PropertyInstance.prototype.getValue = function()
	{
		return Picket._instantiator.getMemberRegistry().getPropertyValue(
			this._objectInstance,
			this._objectInstance,
			this._name
		);
	};
	
	_.PropertyInstance.prototype.setValue = function(value)
	{
		Picket._instantiator.getMemberRegistry().setPropertyValue(
			this._objectInstance,
			this._objectInstance,
			this._name,
			value
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.PropertyInstance = _.PropertyInstance;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.PropertyInstance.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.PropertyInstance = window.Picket.Reflection.PropertyInstance || {}
);

(function(Picket, _){
	
	_.Method = function(classIdentifier, methodName)
	{
		
		if (typeof classIdentifier == 'string') {
			classIdentifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				classIdentifier
			);
		}
		
		if (typeof classIdentifier != 'function' && typeof classIdentifier != 'object') {
			throw new _.Method.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof classIdentifier
			);
		}
		
		if (typeof methodName != 'string') {
			throw new _.Method.Fatal(
				'NON_STRING_METHOD_NAME_PROVIDED',
				'Provided type: ' + typeof methodName
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(classIdentifier)) {
			throw new _.Method.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(classIdentifier);
		
		var members = _getMembers(this);
		
		for (var i = 0; i < members.length; i++) {
			
			if (members[i] instanceof Picket.Member.Method
			&&  members[i].getName() == methodName) {
				this._methodObject = members[i];
				return;
			}
			
		}
		
		throw new _.Method.Fatal(
			'METHOD_DOES_NOT_EXIST',
			'Method name: ' + methodName
		);
		
	};
	
	_.Method.prototype.getName = function()
	{
		return this._methodObject.getName();
	};
	
	_.Method.prototype.getAccessType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildAccessType(
			this._methodObject.getAccessTypeIdentifier()
		);
	};
	
	_.Method.prototype.getArguments = function()
	{
		var types = this._methodObject.getArgumentTypeIdentifiers();
		var reflectionArguments = [];
		for (var i = 0; i < types.length; i++) {
			var isOptional = this._methodObject.argumentIsOptional(i);
			reflectionArguments.push(Picket._instantiator.getReflectionFactory().buildArgument(
				types[i],
				isOptional,
				isOptional ? this._methodObject.getDefaultArgumentValue(i) : undefined,
				this
			));
		}
		return reflectionArguments;
	};
	
	_.Method.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(
			this._classObject.getName()
		);
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._classObject);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Method = _.Method;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		INSTANTIATION_BEFORE_DEPENDENCIES_INJECTED:
			'Class dependencies must be provided via \'acceptClassDependencies\' ' +
			'before any instance can be created',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_METHOD_NAME_PROVIDED: 'Provided method name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		METHOD_DOES_NOT_EXIST:
			'Provided method name and class identifier do not describe a valid method'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Method.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Method = window.Picket.Reflection.Method || {}
);

(function(Picket, _){
	
	_.MethodInstance = function(objectInstance, methodName)
	{
		
		// @todo Check class exists (typeRegistry.classExists(objectInstance))
		
		var classObject = Picket._instantiator.getTypeRegistry().getClass(objectInstance);
		
		var members = Picket._instantiator.getMemberRegistry().getMembers(classObject);
		
		var methodExists = false;
		
		for (var i = 0; i < members.length; i++) {
			if (!(members[i] instanceof Picket.Member.Method)) continue;
			if (members[i].getName() == methodName) {
				methodExists = true;
				break;
			}
		}
		
		if (!methodExists) {
			throw new _.MethodInstance.Fatal(
				'METHOD_DOES_NOT_EXIST',
				'Method name: ' + methodName
			);
		}
		
		this._objectInstance = objectInstance;
		this._name = methodName;
		
	};
	
	_.MethodInstance.prototype.getMethod = function()
	{
		return Picket._instantiator.getReflectionFactory().buildMethod(
			this._objectInstance,
			this._name
		);
	};
	
	_.MethodInstance.prototype.call = function()
	{
		return Picket._instantiator.getMemberRegistry().callMethod(
			this._objectInstance,
			this._objectInstance,
			this._name,
			Array.prototype.splice.call(arguments, 0, arguments.length)
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.MethodInstance = _.MethodInstance;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		METHOD_DOES_NOT_EXIST:
			'Provided method name and class instance do not describe a valid method'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.MethodInstance.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.MethodInstance = window.Picket.Reflection.MethodInstance || {}
);

(function(Picket, _){
	
	_.Event = function(classIdentifier, eventName)
	{
		
		if (typeof classIdentifier == 'string') {
			classIdentifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				classIdentifier
			);
		}
		
		if (typeof classIdentifier != 'function' && typeof classIdentifier != 'object') {
			throw new _.Event.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof classIdentifier
			);
		}
		
		if (typeof eventName != 'string') {
			throw new _.Event.Fatal(
				'NON_STRING_EVENT_NAME_PROVIDED',
				'Provided type: ' + typeof eventName
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(classIdentifier)) {
			throw new _.Event.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(classIdentifier);
		
		var members = _getMembers(this);
		
		for (var i = 0; i < members.length; i++) {
			
			if (members[i] instanceof Picket.Member.Event
			&&  members[i].getName() == eventName) {
				this._eventObject = members[i];
				return;
			}
			
		}
		
		throw new _.Event.Fatal(
			'EVENT_DOES_NOT_EXIST',
			'Event name: ' + eventName
		);
		
	};
	
	_.Event.prototype.getName = function()
	{
		return this._eventObject.getName();
	};
	
	_.Event.prototype.getArguments = function()
	{
		var types = this._eventObject.getArgumentTypeIdentifiers();
		var reflectionArguments = [];
		for (var i = 0; i < types.length; i++) {
			reflectionArguments.push(Picket._instantiator.getReflectionFactory().buildArgument(
				types[i],
				false,
				undefined,
				this
			));
		}
		return reflectionArguments;
	};
	
	_.Event.prototype.getAccessType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildAccessType(
			this._eventObject.getAccessTypeIdentifier()
		);
	};
	
	_.Event.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(
			this._classObject.getName()
		);
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._classObject);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Event = _.Event;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		INSTANTIATION_BEFORE_DEPENDENCIES_INJECTED:
			'Class dependencies must be provided via \'acceptClassDependencies\' ' +
			'before any instance can be created',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_EVENT_NAME_PROVIDED: 'Provided event name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		EVENT_DOES_NOT_EXIST:
			'Provided event name and class identifier do not describe a valid event'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Event.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Event = window.Picket.Reflection.Event || {}
);

(function(Picket, _){
	
	_.EventInstance = function(objectInstance, eventName)
	{
		
		// @todo Check class exists (typeRegistry.classExists(objectInstance))
		
		var classObject = Picket._instantiator.getTypeRegistry().getClass(objectInstance);
		
		var members = Picket._instantiator.getMemberRegistry().getMembers(classObject);
		
		var eventExists = false;
		
		for (var i = 0; i < members.length; i++) {
			if (!(members[i] instanceof Picket.Member.Event)) continue;
			if (members[i].getName() == eventName) {
				eventExists = true;
				break;
			}
		}
		
		if (!eventExists) {
			throw new _.EventInstance.Fatal(
				'EVENT_DOES_NOT_EXIST',
				'Event name: ' + eventName
			);
		}
		
		this._objectInstance = objectInstance;
		this._name = eventName;
		
	};
	
	_.EventInstance.prototype.getEvent = function()
	{
		return Picket._instantiator.getReflectionFactory().buildEvent(
			this._objectInstance,
			this._name
		);
	};
	
	_.EventInstance.prototype.trigger = function()
	{
		Picket._instantiator.getMemberRegistry().triggerEvent(
			this._objectInstance,
			this._name,
			Array.prototype.splice.call(arguments, 0, arguments.length)
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.EventInstance = _.EventInstance;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		EVENT_DOES_NOT_EXIST:
			'Provided event name and class instance do not describe a valid event'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.EventInstance.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.EventInstance = window.Picket.Reflection.EventInstance || {}
);

(function(Picket, _){
	
	_.Constant = function(classIdentifier, constantName)
	{
		
		if (typeof classIdentifier == 'string') {
			classIdentifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				classIdentifier
			);
		}
		
		if (typeof classIdentifier != 'function' && typeof classIdentifier != 'object') {
			throw new _.Constant.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof classIdentifier
			);
		}
		
		if (typeof constantName != 'string') {
			throw new _.Constant.Fatal(
				'NON_STRING_CONSTANT_NAME_PROVIDED',
				'Provided type: ' + typeof constantName
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(classIdentifier)) {
			throw new _.Constant.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(classIdentifier);
		
		var members = _getMembers(this);
		
		for (var i = 0; i < members.length; i++) {
			
			if (members[i] instanceof Picket.Member.Constant
			&&  members[i].getName() == constantName) {
				this._constantObject = members[i];
				return;
			}
			
		}
		
		throw new _.Constant.Fatal(
			'CONSTANT_DOES_NOT_EXIST',
			'Constant name: ' + constantName
		);
		
	};
	
	_.Constant.prototype.getName = function()
	{
		return this._constantObject.getName();
	};
	
	_.Constant.prototype.getType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildType(
			this._constantObject.getTypeIdentifier()
		);
	};
	
	_.Constant.prototype.getAccessType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildAccessType(
			this._constantObject.getAccessTypeIdentifier()
		);
	};
	
	_.Constant.prototype.getValue = function()
	{
		return this._constantObject.get();
	};
	
	_.Constant.prototype.isAutoGenerated = function()
	{
		return this._constantObject.isAutoGenerated();
	};
	
	_.Constant.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(
			this._classObject.getName()
		);
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._classObject);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Constant = _.Constant;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		INSTANTIATION_BEFORE_DEPENDENCIES_INJECTED:
			'Class dependencies must be provided via \'acceptClassDependencies\' ' +
			'before any instance can be created',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_CONSTANT_NAME_PROVIDED: 'Provided constant name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		CONSTANT_DOES_NOT_EXIST:
			'Provided constant name and class identifier do not describe a valid constant',
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Constant.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Constant = window.Picket.Reflection.Constant || {}
);

(function(Picket, _){
	
	_.Argument = function(typeIdentifier, isOptional, defaultValue, owner)
	{
		
		// @todo Possibly check the caller is a
		// member of the Reflection API as, as far
		// as I can imagine, it does not make sense
		// for client code to instantiate this class. 
		
		if (typeof typeIdentifier != 'string') {
			throw new _.Argument.Fatal(
				'NON_STRING_TYPE_IDENTIFIER_SUPPLIED',
				'Provided type: ' + typeof typeIdentifier
			);
		}
		
		if (typeof isOptional != 'boolean') {
			throw new _.Argument.Fatal(
				'NON_BOOLEAN_OPTIONAL_FLAG_SUPPLIED',
				'Provided type: ' + typeof isOptional
			);
		}
		
		if (!isOptional && typeof defaultValue != 'undefined') {
			throw new _.Argument.Fatal('UNEXPECTED_DEFAULT_PROVIDED');
		}
		
		if (['string', 'object', 'function'].indexOf(typeof owner) == -1) {
			throw new _.Argument.Fatal(
				'INVALID_OWNER_TYPE_PROVIDED',
				'Provided type: ' + typeof owner
			);
		}
		
		this._typeIdentifier = typeIdentifier;
		this._isOptional = isOptional;
		this._defaultValue = defaultValue;
		this._owner = owner;
		
	};
	
	_.Argument.prototype.getType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildType(this._typeIdentifier);
	};
	
	_.Argument.prototype.isOptional = function()
	{
		return this._isOptional;
	};
	
	_.Argument.prototype.hasDefaultValue = function()
	{
		return (this._defaultValue === undefined) ? false : true;
	};
	
	_.Argument.prototype.getDefaultValue = function()
	{
		if (this._defaultValue === undefined) throw new _.Argument.Fatal('NON_DEFAULT_RETRIEVED');
		return this._defaultValue;
	};
	
	_.Argument.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(this._owner);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Argument = _.Argument;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		NON_STRING_TYPE_IDENTIFIER_SUPPLIED: 'The provided type identifier must be a string',
		NON_BOOLEAN_OPTIONAL_FLAG_SUPPLIED:
			'The provided flag indicating whether the argument is optional must be a boolean',
		UNEXPECTED_DEFAULT_PROVIDED:
			'A default value was provided even though it was ' +
			'indicated that the argument is not optional',
		INVALID_OWNER_TYPE_PROVIDED: 'The provided owner must be an object, function or string',
		NON_DEFAULT_RETRIEVED: 'A call was made to getDefaultValue when no default exists'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Argument.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Argument = window.Picket.Reflection.Argument || {}
);

(function(Picket, _){
	
	_.AccessType = function(identifier)
	{
		// @todo Everything
		this._identifier = identifier;
	};
	
	_.AccessType.prototype.getIdentifier = function()
	{
		return this._identifier;
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.AccessType = _.AccessType;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

(function(Picket, _){
	
	_.Type = function(identifier)
	{
		
		if (typeof identifier != 'string') {
			throw new _.Type.Fatal(
				'NON_STRING_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof identifier
			);
		}
		
		this._identifier = identifier;
		
	};
	
	_.Type.prototype.getIdentifier = function()
	{
		return this._identifier;
	};
	
	_.Type.prototype.isValidValue = function(value)
	{
		return Picket._instantiator.getTypeChecker().isValidType(value, this._identifier);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Type = _.Type;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);

;(function(Picket, Reflection, _){
	
	var messages = {
		NON_STRING_IDENTIFIER_PROVIDED: 'The provided type identifier must be a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Type.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Type = window.Picket.Reflection.Type || {}
);

(function(){
	
	// Allow us to create basic objects
	// somewhere else and also ensure we
	// are creating single instances of
	// said classes
	var instantiator = new Picket.Instantiator();
	
	// We'll make this available to the
	// various reflection classes by
	// storing it 'globally'
	Picket._instantiator = instantiator;
	
	var namespaceManager = instantiator.getNamespaceManager();
	
	// Create one global function which
	// is used to declare all types
	window.define = function(){
		
		var metaStatements = [];
		
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == 'string') {
				metaStatements.push(arguments[i]);
			} else {
				if (arguments.length != i + 1) {
					// @todo Throw better
					throw new Error('Bad args to define');
				}
				var members = arguments[i];
			}
		}
		
		var signature = metaStatements.pop();
		
		var typeObject = instantiator.getTypeFactory().build(signature);
		
		// Ensure members is provided as the relevant
		// format for the identified type
		_typeCheckMembers(members, typeObject);
		
		// If we are dealing with a class...
		if (typeObject instanceof Picket.Type.Class) {
			
			// Create a new class constructor
			// providing it the class registry
			var constructor = new Picket.Type.Class.Constructor(
				instantiator.getTypeRegistry(),
				instantiator.getMemberRegistry(),
				typeObject.getName()
			);
			
			// Register the class definition against
			// the class constructor in the class registry
			instantiator.getTypeRegistry().registerClass(typeObject, constructor);
			
			var staticMethods = [];
			var constants = [];
			
			if (typeObject.isExtension()) {
				var autoloader = instantiator.getAutoLoader();
				try {
					var parentConstructor = namespaceManager.getNamespaceObject(
						typeObject.getParentClass()
					);
				} catch (error) {
					if ((!error instanceof Picket.NamespaceManager.Fatal)
					||	error.code != 'NAMESPACE_OBJECT_DOES_NOT_EXIST') {
						throw error;
					}
				}
				var createAssociationCallback = (function(childConstructor, parentClassName){
					return function(){
						if (typeof parentConstructor == 'undefined') {
							parentConstructor = namespaceManager.getNamespaceObject(
								parentClassName
							);
						}
						var parentClass = instantiator.getTypeRegistry().getClass(
							parentConstructor
						);
						instantiator.getTypeRegistry().registerClassChild(
							typeObject.getParentClass(),
							typeObject
						);
						constructor.prototype = _createObject(parentConstructor.prototype);
						constructor.prototype.constructor = constructor;
						_appendMemberNames(staticMethods, constants, parentClass);
					};
				})(constructor, typeObject.getParentClass());
				if (typeof parentConstructor == 'undefined' && autoloader.isRunning()) {
					autoloader.continue(typeObject.getParentClass(), createAssociationCallback);
				} else {
					createAssociationCallback();
				}
			}
			
			if (instantiator.getAutoLoader().isRunning()) {
				var interfaces = typeObject.getInterfaces();
				for (var i = 0; i < interfaces.length; i++) {
					var interfaceObject = instantiator.getTypeRegistry();
					if (interfaceObject === undefined) continue;
					instantiator.getAutoLoader().continue(interfaces[i]);
				}
			}
			
			constructor.prototype.toString = function(){
				return '[object ' + typeObject.getName() + ']'
			};
			
			// Place the constructor into the relevant
			// namespace location based on the name
			// identified in the class definition
			namespaceManager.registerClassFunction(
				typeObject.getName(),
				constructor
			);
			
			var interfaces = typeObject.getInterfaces();
			for (var i in interfaces) {
				instantiator.getTypeRegistry().registerInterfaceAgainstClass(
					interfaces[i],
					typeObject
				);
			}
			
		} else if (typeObject instanceof Picket.Type.Interface) {
			
			instantiator.getTypeRegistry().registerInterface(typeObject);
			
		}
		
		for (var i in members) {
			
			if (Object.prototype.toString.call(members) == '[object Array]') {
				var member = instantiator.getMemberFactory().build(members[i], true);
			} else {
				var member = instantiator.getMemberFactory().build(i, false, members[i]);
			}
			
			instantiator.getMemberRegistry().register(member, typeObject);
			
			if (member instanceof Picket.Member.Method && member.isStatic()) {
				
				staticMethods.push(member.getName());
				
			} else if (member instanceof Picket.Member.Constant) {
				
				constants.push(member.getName());
				
			}
			
		}
		
		if (typeObject instanceof Picket.Type.Class) {
			
			for (var i in staticMethods) {
				
				constructor[staticMethods[i]] = (function(name){
					return function(){
						return instantiator.getMemberRegistry().callMethod(
							constructor,
							{},
							name,
							Array.prototype.slice.call(arguments, 0)
						);
					};
				})(staticMethods[i]);
				
			}
			
			for (var i in constants) {
				
				constructor[constants[i]] = (function(name){
					return function(){
						// Note that the '|| {}' below is due
						// to a hack in Picket.Member.Constant.
						// It should go if possible.
						return instantiator.getMemberRegistry().getConstant(
							constructor,
							arguments.callee.caller.$$localOwner || {},
							name
						);
					};
				})(constants[i]);
			}
			
		}
		
		if (instantiator.getAutoLoader().isRunning()) {
			
			for (var i in metaStatements) {
				// @todo Throw if incorrect format
				var match = metaStatements[i].match(/^(?:\s+)?require\s+([A-Za-z0-9.]+)(?:\s+)?$/);
				instantiator.getAutoLoader().continue(match[1]);
			}
			
		}
		
	};
	
	window.start = function(className, methodName)
	{
		instantiator.getAutoLoader().start(className, methodName);
	};
	
	window.require = function(className, targetMethod)
	{
		instantiator.getAutoLoader().require(
			className,
			arguments.callee.caller.$$owner,
			arguments.callee.caller.$$localOwner,
			targetMethod
		);
	};
	
	Picket.declareAssemblyResources = function(resources)
	{
		instantiator.getAutoLoader().declareAssemblyResources(resources);
	};
	
	var _typeCheckMembers = function(members, definition)
	{
		if (definition instanceof Picket.Type.Class) {
			if (typeof members != 'undefined') {
				if (Object.prototype.toString.call(members) == '[object Array]') {
					throw new Picket.Main.Fatal(
						'NON_OBJECT_CLASS_MEMBERS',
						'Provided type: array'
					);
				}
				if (typeof members != 'object') {
					throw new Picket.Main.Fatal(
						'NON_OBJECT_CLASS_MEMBERS',
						'Provided type: ' + typeof members
					);
				}
			}
		} else if (definition instanceof Picket.Type.Interface) {
			if (typeof members != 'undefined') {
				if (Object.prototype.toString.call(members) != '[object Array]') {
					throw new Picket.Main.Fatal(
						'NON_ARRAY_INTERFACE_MEMBERS',
						'Provided type: ' + typeof members
					);
				}
			}
		}
	};
	
	var _createObject = function(prototype)
	{
		function F(){};
		F.prototype = prototype;
		return new F();
	};
	
	var _appendMemberNames = function(staticMethods, constants, classObject)
	{
		var members = instantiator.getMemberRegistry().getMembers(classObject);
		for (var i in members) {
			if (members[i] instanceof Picket.Member.Method && members[i].isStatic()) {
				staticMethods.push(members[i].getName());
			} else if (members[i] instanceof Picket.Member.Constant) {
				constants.push(members[i].getName());
			}
		}
	};
	
})();

;(function(Picket, _){
	
	var messages = {
		NON_OBJECT_CLASS_MEMBERS:		'Provided class members must be defined as object',
		NON_ARRAY_INTERFACE_MEMBERS:	'Provided interface members must be defined as array'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Main.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Main = window.Picket.Main || {}
);
