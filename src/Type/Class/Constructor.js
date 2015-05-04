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
