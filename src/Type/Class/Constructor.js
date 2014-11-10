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
			
			/**
			 * Check can be instantiated (here??)
			 * 		Note that isAbstract should tell us if it's either explicit
			 * 		or implicit abstract. We shouldn't worry about whether the
			 * 		created instance obeys interface / abstract member rules - if
			 * 		the class isn't abstract, its valid (I think).
			 * Create parent and all ancestors
			 * If this is the instantiated one, register all instances in type registry
			 * Create dummy methods for all methods, constants and poss properties
			 */
			
			var classObject = typeRegistry.getClass(this)
			
			classObject.requestInstantiation();
			
			var properties = [];
			var methods = [];
			
			_appendMemberNames(properties, methods, classObject);
			
			if (typeRegistry.hasParent(classObject)) {
				
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
				var name = properties[i];
				this[name] = (function(name){
					return function(value){
						if (typeof value != 'undefined') {
							return this.set(name, value);
						} else {
							return this.get(name);
						} 
					};
				})(name);
			}
			
			for (var i in methods) {
				var name = methods[i];
				this[name] = (function(name){
					return function(){
						return memberRegistry.callMethod(
							this,
							{},
							name,
							Array.prototype.slice.call(arguments, 0)
						);
					};
				})(name);
			}
			
			if (this.construct) {
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
			return memberRegistry.getPropertyValue(this, {}, name);
		};
		
		namespace[className].prototype.set = function(name, value)
		{
			memberRegistry.setPropertyValue(this, {}, name, value);
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
					properties.push(members[i].getName());
				} else if (members[i] instanceof ClassyJS.Member.Method) {
					methods.push(members[i].getName());
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
