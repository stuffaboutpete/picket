;(function(ClassyJS, Type, _){
	
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
		
		var Class = function()
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
						var objectChanged = false;
						var type = property.getTypeIdentifier();
						if (type == 'string' && arguments.length == 2) {
							if (value === '+=') {
								var returnValue = this.set(name, this.get(name) + arguments[1]);
								objectChanged = true;
							} else if (value === '=+') {
								var returnValue = this.set(name, arguments[1] + this.get(name));
								objectChanged = true;
							}
						} else if (type == 'number' && typeof value == 'string') {
							var match = value.match(/^(\+|-)((?:\+|-)|[0-9]+)$/);
							if (match) {
								if (match[1] == '+' && match[2] == '+') {
									var returnValue = this.set(name, this.get(name) + 1);
								} else if (match[1] == '-' && match[2] == '-') {
									var returnValue = this.set(name, this.get(name) - 1);
								} else {
									value = this.get(name);
									value = (match[1] == '+')
										? value + parseInt(match[2])
										: value - parseInt(match[2]);
									var returnValue = this.set(name, value);
								}
								objectChanged = true;
							}
						} else if (typeof value == 'string'
						&& (type == 'array' || type.match(/^\[(.+)\]$/))) {
							var match = value.match(/push|pop|shift|unshift/);
							if (match) {
								var returnValue = this.get(name)[match[0]].call(
									this.get(name),
									arguments[1]
								);
								objectChanged = true;
							}
						}
						if (!objectChanged) {
							if (typeof value != 'undefined') {
								var returnValue = this.set(name, value);
							} else {
								return this.get(name);
							}
						}
						this.trigger('change', [name, this]);
						return returnValue;
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
		
		if (typeof rootNamespaceName != 'undefined') {
			eval('var ' + rootNamespaceName + ' = rootNamespaceValue');
			eval(fullClassName + ' = ' + Class.toString());
		} else {
			eval('var ' + className + ' = ' + Class.toString());
			namespace[className] = eval(className);
		}
		
		namespace[className].prototype.get = function(name)
		{
			return memberRegistry.getPropertyValue(
				this,
				arguments.callee.caller.caller.$$localOwner,
				name
			);
		};
		
		namespace[className].prototype.set = function(name, value)
		{
			memberRegistry.setPropertyValue(
				this,
				arguments.callee.caller.caller.$$localOwner,
				name,
				value
			);
		};
		
		namespace[className].prototype.bind = function(name, targetMethod)
		{
			memberRegistry.bindEvent(this, name, arguments.callee.caller.$$owner, targetMethod);
		};
		
		namespace[className].prototype.trigger = function(name, arguments)
		{
			memberRegistry.triggerEvent(this, name, arguments);
		};
		
		namespace[className].prototype.conformsTo = function(interfaceName)
		{
			var interfaces = typeRegistry.getInterfacesFromClass(typeRegistry.getClass(this));
			for (var i in interfaces) if (interfaces[i].getName() == interfaceName) return true;
			return false;
		};
		
		var _appendMemberNames = function(properties, methods, classObject)
		{
			var members = memberRegistry.getMembers(classObject);
			for (var i in members) {
				if (members[i] instanceof ClassyJS.Member.Property) {
					properties.push(members[i]);
				} else if (members[i] instanceof ClassyJS.Member.Method) {
					methods.push(members[i]);
				}
			}
		};
		
		return namespace[className];
		
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Class = window.ClassyJS.Type.Class || {}
);
