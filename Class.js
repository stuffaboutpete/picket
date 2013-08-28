;(function(undefined){
	
	Class = function(){};
	
	var nextObjectId = 0;
	
	Class.define = function(name, definition){
		
		if (typeof name != 'string' || name == '') {
			throw new InvalidClassDeclarationFatal();
		}
		
		// Type checking and converting
		
		if (typeof definition != 'undefined' && typeof definition != 'object') {
			throw new Error('Definition must be object or undefined');
		}
		
		definition = definition || {};
		
		var namespaceTree = name.split('.');
		var className = namespaceTree.pop();
		var namespace = window;
		
		for (var i in namespaceTree) {
			if (!namespaceTree.hasOwnProperty(i)) continue;
			namespace[namespaceTree[i]] = namespace[namespaceTree[i]] || {};
			namespace = namespace[namespaceTree[i]];
		}
		
		var namespaceProperties = [];
		
		for (var i in namespace[className]) {
			if (namespace[className].hasOwnProperty(i)) {
				namespaceProperties[i] = namespace[className][i];
			}
		}
		
		namespace[className] = function(){
			
			// Associate the instance of the class
			// with the real js constructor
			this.type = namespace[className];
			
			if (namespace[className].Implements) {
				for (var i in namespace[className].Implements) {
					if (!namespace[className].Implements.hasOwnProperty(i)) continue;
					var currentInterface = namespace[className].Implements[i];
					for (var method in currentInterface.methods) {
						if (!currentInterface.methods.hasOwnProperty(method)) continue;
						var args = currentInterface.methods[method];
						if (typeof this.type.methods[method] == 'undefined') {
							throw new InterfaceMethodNotImplementedFatal();
						}
						var methodAsString = this.type.methods[method].method.toString();
						var methodArgs = methodAsString.substring(
							'function ('.length,
							methodAsString.indexOf(')')
						);
						methodArgs.replace(' ', '');
						methodArgs = (methodArgs == '') ? [] : methodArgs.split(',');
						var interfaceArgs = currentInterface.methods[method];
						if (methodArgs<interfaceArgs || interfaceArgs<methodArgs) {
							throw new InterfaceMethodNotImplementedFatal();
						}
					}
				}
			}
			
			// Create instance versions of properties
			this.properties = namespace[className].properties;
			this.propertyValues = {};
			
			for (var i in this.properties) {
				if (!this.properties.hasOwnProperty(i)) continue;
				this.properties[i].parent = this;
				this.propertyValues[i] = cloneObject(
					this.properties[i].originalValue
				);
			}
			
			// Set values of properties
			
			// If this class extends another,
			// we must instantiate it
			if (this.type.Extends) {
				this.parent = new this.type.Extends();
				
			// Otherwise, assume that it extends
			// the class 'Class'. Because this is
			// the root element, we can assign an
			// object ID at this point.
			} else {
				this.parent = new Class();
				this.parent.type = Class;
				this.parent.id = nextObjectId++;
			}
			
			// Associate this object as the child
			// of the newly created parent
			this.parent.child = this;
			
			// Set the ID of this object to be
			// the same as the parent
			this.id = this.parent.id;
			
			var allAccessibleMethods = getListOfMethods(this);
			
			// Create dummy methods so that
			// method names can be called
			// directly. Loop through each
			// method for this type...
			for (var i in allAccessibleMethods) {
				
				if (!allAccessibleMethods.hasOwnProperty(i)) continue;
				
				var methodName = allAccessibleMethods[i];
				
				// If there is not already a
				// method of this name (eg call),
				// then we can create it
				if (typeof this[methodName] != 'function') {
					
					// Create a real js method with
					// the relevant name
					this[methodName] = function(){
						
						// Create an array of args starting
						// with the name of the method to
						// match the api of the 'call' mathod
						var args = [arguments.callee.methodName];
						
						// Append all other function
						// arguments to this array
						for (var arg in arguments) {
							if (!arguments.hasOwnProperty(arg)) continue;
							args.push(arguments[arg]);
						}
						
						// Do the real method call
						return this.call.apply(this, args);
						
					}
					
					// Ensure that the method name
					// is stored against the dummy
					// method so that it knows which
					// real method to call
					this[methodName].methodName = methodName;
					
				}
				
			}
			
			// If this is the instantiated class,
			// ie not being extended, we can do
			// some further checks
			if (arguments.callee.caller != namespace[className].toString()) {
				
				// If the class is marked as
				// abstract throw an error
				if (namespace[className].Abstract) {
					throw new AbstractClassFatal(); 
				}
				
				// If the method 'construct' exists and
				// the object is not being cloned
				if (methodExists('construct', this)
				&& arguments.callee.caller !== cloneObject) {
					
					// Create an array in the format:
					// ['construct', arg1, arg2, ...]
					var args = ['construct'];
					for (var i = 0; i < arguments.length; i++) {
						args.push(arguments[i]);
					}
					
					// Call the constructor
					this.call.apply(this, args);
					
				}
				
			}
			
		};
		
		namespace[className].className = name;
		
		for (var i in namespaceProperties) {
			if (!namespaceProperties.hasOwnProperty(i)) continue;
			namespace[className][i] = namespaceProperties[i];
		}
		
		namespace[className].prototype = Class.prototype;
		
		// Work through keywords... (Also deleting from definition)
		if (definition.Abstract) {
			namespace[className].Abstract = true;
			delete definition.Abstract;
		}
		if (definition.Extends) {
			namespace[className].Extends = definition.Extends;
			delete definition.Extends;
		}
		if (definition.Implements) {
			if (Object.prototype.toString.apply(
				definition.Implements
			) != '[object Array]') {
				definition.Implements = [definition.Implements];
			}
			namespace[className].Implements = definition.Implements;
			delete definition.Implements;
		}
		// namespace[className].interfaces = ...
		// 
		
		namespace[className].properties = {}; // []?
		namespace[className].methods = {}; // []?
		
		// Put properties in from definition
		// Put methods in from definition
		for (var i in definition) {
			
			if (!definition.hasOwnProperty(i)) continue;
			
			var propName = i;
			var scope;
			
			if (propName.substring(0, 8) == 'private:') {
				propName = propName.substring(8);
				scope = new Class.Scope(Class.Scope.PRIVATE);
			} else if (propName.substring(0, 10) == 'protected:') {
				propName = propName.substring(10);
				scope = new Class.Scope(Class.Scope.PROTECTED);
			} else if (propName.substring(0, 7) == 'public:') {
				propName = propName.substring(7);
				scope = new Class.Scope(Class.Scope.PUBLIC);
			} else {
				propName = i;
				scope = new Class.Scope(Class.Scope.PUBLIC);
			}
			
			if (typeof definition[i] == 'function') {
				namespace[className].methods[propName] = new Class.Method(
					propName,
					definition[i],
					scope
				);
				scope.parent = namespace[className].methods[propName];
				namespace[className].methods[propName].parentType
					= namespace[className];
				namespace[className].methods[propName].method.parentType
					= namespace[className];
			} else {
				namespace[className].properties[propName] = new Class.Property(
					propName,
					definition[i],
					scope
				);
				scope.parent = namespace[className].properties[propName];
				namespace[className].properties[propName].originalValue = definition[i];
			}
			
		}
		
	}
	
	Class.prototype.get = function(propertyName)
	{
		var property = lookup(
			'property',
			propertyName,
			this,
			this,
			arguments.callee.caller
		);
		property.scope.checkCallingFunction(arguments.callee.caller);
		return property.value;
	}
	
	Class.prototype.set = function(propertyName, value)
	{
		var property = lookup(
			'property',
			propertyName,
			this,
			this,
			arguments.callee.caller
		);
		property.value = value;
		this.propertyValues[propertyName] = value;
	}
	
	Class.prototype.call = function(methodName)
	{
		var object = getInstantiatedObject(this);
		var overloaded = false;
		try {
			var method = lookup(
				'method',
				methodName,
				object,
				this,
				arguments.callee.caller
			);
		} catch (error) {
			if (error instanceof UnknownMethodFatal) {
				if (methodExists('call', object)) {
					var method = lookup(
						'method',
						'call',
						object,
						this,
						arguments.callee.caller
					);
					overloaded = true;
				} else {
					throw error;
				}
			} else {
				throw error;
			}
		}
		var copiedMethod = {};
		for (property in method) {
			if (method.hasOwnProperty(property) && property != 'prototype') {
				copiedMethod[property] = method[property];
			}
		}
		copiedMethod.parentType.id = object.id;
		// @todo next line should have one less 'caller' if
		// the method is called directly using object.call('methodName');
		copiedMethod.scope.checkCallingFunction(arguments.callee.caller.caller);
		var args = [];
		for (var a = 1; a < arguments.length; a++) {
			args.push(arguments[a]);
		}
		if (overloaded === false) {
			return copiedMethod.method.apply(object, args);
		} else {
			return copiedMethod.method.call(object, methodName, args);
		}
	}
	
	Object.prototype.instanceOf = function(type)
	{
		if (this.type === type) return true;
		if (this.type && this.type.Implements) {
			for (var i in this.type.Implements) {
				if (!this.type.Implements.hasOwnProperty(i)) continue;
				if (type === this.type.Implements[i]) return true;
			}
		}
		if (this.parent) {
			return this.parent.instanceOf(type);
		}
		return false;
	}
	
	Class.prototype.clone = function()
	{
		return cloneObject(this);
		/*var newObject = new this.type();
		for (var i in this.propertyValues) {
			if (!this.propertyValues.hasOwnProperty(i)) continue;
			if (typeof this.propertyValues[i].instanceOf == 'function'
			&&	this.propertyValues[i].instanceOf(Class)) {
				newObject.propertyValues[i] = this.propertyValues[i].clone();
			} else {
				newObject.propertyValues[i] = cloneObject(
					this.propertyValues[i]
				);
			}
		}
		return newObject;*/
	}
	
	Class.prototype.toString = function()
	{
		if (this.type
		&&	this.type.methods
		&&	typeof this.type.methods.toString == 'object') {
			return this.call('toString');
		}
		if (this.parent) {
			return this.parent.toString();
		}
		return '[object ' + getInstantiatedObject(this).type.className + ']';
		return Object.prototype.toString.call(this);
	}
	
	function cloneObject(object)
	{
		
		// http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
		
		// Handle the 3 simple types, and null or undefined
		if (null == object || "object" != typeof object) return object;
		
		// Handle Date
		if (object instanceof Date) {
			var copy = new Date();
			copy.setTime(object.getTime());
			return copy;
		}
		
		// Handle Array
		if (object instanceof Array) {
			var copy = [];
			for (var i = 0, len = object.length; i < len; i++) {
				copy[i] = cloneObject(object[i]);
			}
			return copy;
		}
		
		// Handle instances of this library
		if (typeof object.instanceOf == 'function'
		&&	object.instanceOf(Class)) {
			var copy = new object.type();
			copy.propertyValues = cloneObject(object.propertyValues);
			return copy;
		}
		
		// Handle standard objects
		if (object instanceof Object) {
			var copy = {};
			for (var attr in object) {
				if (object.hasOwnProperty(attr)) {
					copy[attr] = cloneObject(object[attr]);
				}
			}
			return copy;
		}
		
		throw new Error("Unable to copy object! Its type isn't supported.");
		
	}
	
	function getInstantiatedObject(object)
	{
		if (object.child) {
			return getInstantiatedObject(object.child);
		}
		return object;
	}
	
	function lookup(type, name, object, calledObject, callingFunction)
	{
		if (arguments.callee.caller != lookup) {
			object = getInstantiatedObject(object);
		}
		if (object.parent == calledObject
		&&	callingFunction.caller.parentType
		&&	callingFunction.caller.parentType.id == object.parent.id) {
			object = calledObject;
		}
		if (type == 'property') {
			if (object.properties && object.properties[name]) {
				var target = object.properties[name];
			}
		} else {
			if (object.type && object.type.methods
			&&	typeof object.type.methods[name] == 'object') {
				var target = object.type.methods[name];
			}
		}
		if (target) {
			target.value = object.propertyValues[name];
			return target;
		} else if (object.parent) {
			var target = lookup(
				type,
				name,
				object.parent,
				calledObject,
				callingFunction
			);
			if (typeof object.propertyValues[name] != 'undefined') {
				target.value = object.propertyValues[name];
			}
			return target;
		} else {
			if (type == 'property') {
				throw new UnknownPropertyFatal();
			} else {
				throw new UnknownMethodFatal();
			}
		}
	}
	
	function methodExists(name, object)
	{
		try {
			lookup('method', name, object);
		} catch (error) {
			return false;
		}
		return true;
	}
	
	function getListOfMethods(object)
	{
		var methods = [];
		if (typeof object.type == 'undefined') return methods;
		for (var i in object.type.methods) {
			if (!object.type.methods.hasOwnProperty(i)) continue;
			methods.push(i); 
		}
		if (object.parent) {
			var parentMethods = getListOfMethods(object.parent);
			for (var i in parentMethods) {
				if (!parentMethods.hasOwnProperty(i)) continue;
				methods.push(parentMethods[i]);
			}
		}
		return methods;
	}
	
})();