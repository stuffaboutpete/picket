;(function(undefined){
	
	Class = function(){};
	
	var nextObjectId = 0;
	
	Class.define = function(name, definition){
		
		if (typeof name != 'string' || name == '') {
			throw new InvalidClassDeclarationFatal('Class name is required');
		}
		
		// Type checking and converting
		
		if (typeof definition != 'undefined' && typeof definition != 'object') {
			throw new InvalidClassDeclarationFatal('Class definition must be object or undefined');
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
							throw new InterfaceMethodNotImplementedFatal(
								'Class \'' + name + '\' must define interface ' +
								'method \'' + method + '\''
							);
						}
						if (this.type.methods[method].scope.level != Class.Scope.PUBLIC) {
							throw new InterfaceMethodNotImplementedFatal(
								'Interface method \'' + method + '\' must be declared public'
							);
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
							throw new InterfaceMethodNotImplementedFatal(
								'Method arguments must match arguments declared by ' +
								'interface in \'' + name + '.' + method + '\''
							);
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
			
			this.eventCallbacks = {};
			for (var i in this.type.Events) {
				if (!this.type.Events.hasOwnProperty(i)) continue;
				this.eventCallbacks[i] = [];
			}
			
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
					throw new AbstractClassFatal('Abstract class cannot be instantiated');
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
		if (definition.Require) {
			if (Object.prototype.toString.apply(definition.Require) != '[object Array]') {
				definition.Require = [definition.Require];
			}
			processDependencies(definition.Require);
			delete definition.Require;
		}
		if (definition.Abstract) {
			if (Object.prototype.toString.apply(
				definition.Abstract
			) == '[object Array]') {
				var abstractMethods = {};
				for (var i in definition.Abstract) {
					if (!definition.Abstract.hasOwnProperty(i)) continue;
					if (typeof definition.Abstract[i] != 'string') {
						throw new InvalidSyntaxFatal(
							'Abstract method names must be specified as strings'
						);
					}
					abstractMethods[definition.Abstract[i]] = undefined;
				}
				definition.Abstract = abstractMethods;
			}
			if (typeof definition.Abstract == 'object') {
				for (var i in definition.Abstract) {
					if (!definition.Abstract.hasOwnProperty(i)) continue;
					if (i.split('(').length-1 != 1) {
						throw new InvalidSyntaxFatal(
							'Abstract method declarations must contain brackets even ' +
							'if they expect no argument'
						);
					}
					if (i.substring(0, 7) != 'public:'
					&&	i.substring(0, 10) != 'protected:') {
						throw new InvalidSyntaxFatal(
							'Abstract methods must be specified public or protected'
						);
					}
				}
				namespace[className].AbstractMethods = definition.Abstract;
			}
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
		if (definition.Events) {
			if (Object.prototype.toString.apply(definition.Events) == '[object Array]') {
				var eventsTemp = {};
				for (var i in definition.Events) {
					if (!definition.Events.hasOwnProperty(i)) continue;
					if (typeof definition.Events[i] != 'string') {
						throw new InvalidSyntaxFatal(
							'Events must be declared as an array of strings'
						);
					}
					eventsTemp[definition.Events[i]] = undefined;
				}
				definition.Events = eventsTemp;
			}
			if (typeof definition.Events != 'object') {
				throw new InvalidSyntaxFatal('Events must be declared in an array');
			}
			namespace[className].Events = definition.Events;
			delete definition.Events;
		}
		// namespace[className].interfaces = ...
		// 
		
		namespace[className].properties = {}; // []?
		namespace[className].methods = {}; // []?
		namespace[className].staticProperties = {};
		namespace[className].staticMethods = {};
		
		// Put properties in from definition
		// Put methods in from definition
		toInspectDefinition:
		for (var i in definition) {
			
			if (!definition.hasOwnProperty(i)) continue;
			
			var propName = i;
			var scope;
			var isStatic = false;
			
			if (propName.substring(0, 7) == 'static:') {
				propName = propName.substring(7);
				isStatic = true;
			}
			
			if (typeof definition[i] == 'object') {
				
				for (var j in definition[i]) {
					
					if (!definition[i].hasOwnProperty(j)) continue;
					
					if (j != 'getter' && j != 'setter' && j != 'value') break;
					
					if (typeof definition[i].getter == 'undefined'
					&&	typeof definition[i].setter == 'undefined') break;
					
					if (i.substring(0, 8) == 'private:'
					||	i.substring(0, 10) == 'protected:'
					||	i.substring(0, 7) == 'public:') {
						throw new InvalidSyntaxFatal('Cannot declare access level on properties');
					}
					
					if (Object.prototype.toString.apply(definition[i].getter) != '[object Array]') {
						definition[i].getter = [undefined, definition[i].getter, true, true];
					} else {
						if (definition[i].getter.length == 1) {
							definition[i].getter = [
								undefined,
								definition[i].getter[0],
								true,
								true
							];
						} else if (definition[i].getter.length == 2) {
							var firstArg = definition[i].getter[0];
							if (typeof firstArg == 'boolean' || typeof firstArg == 'function') {
								definition[i].getter = [
									undefined,
									definition[i].getter[0],
									definition[i].getter[1],
									definition[i].getter[1]
								];
							} else {
								definition[i].getter = [
									definition[i].getter[0],
									definition[i].getter[1],
									true,
									true
								];
							}
						} else if (definition[i].getter.length == 3) {
							var firstArg = definition[i].getter[0];
							if (typeof firstArg == 'boolean' || typeof firstArg == 'function') {
								definition[i].getter = [
									undefined,
									definition[i].getter[0],
									definition[i].getter[1],
									definition[i].getter[2]
								];
							} else {
								definition[i].getter = [
									definition[i].getter[0],
									definition[i].getter[1],
									definition[i].getter[2],
									definition[i].getter[2]
								];
							}
						}
					}
					
					if (Object.prototype.toString.apply(definition[i].setter) != '[object Array]') {
						definition[i].setter = [undefined, definition[i].setter, true, true];
					} else {
						if (definition[i].setter.length == 1) {
							definition[i].setter = [
								undefined,
								definition[i].setter[0],
								true,
								true
							];
						} else if (definition[i].setter.length == 2) {
							var firstArg = definition[i].setter[0];
							if (typeof firstArg == 'boolean' || typeof firstArg == 'function') {
								definition[i].setter = [
									undefined,
									definition[i].setter[0],
									definition[i].setter[1],
									definition[i].setter[1]
								];
							} else {
								definition[i].setter = [
									definition[i].setter[0],
									definition[i].setter[1],
									true,
									true
								];
							}
						} else if (definition[i].setter.length == 3) {
							var firstArg = definition[i].setter[0];
							if (typeof firstArg == 'boolean' || typeof firstArg == 'function') {
								definition[i].setter = [
									undefined,
									definition[i].setter[0],
									definition[i].setter[1],
									definition[i].setter[2]
								];
							} else {
								definition[i].setter = [
									definition[i].setter[0],
									definition[i].setter[1],
									definition[i].setter[2],
									definition[i].setter[2]
								];
							}
						}
					}
					
					if (typeof definition[i].getter[1] != 'boolean'
					&&	typeof definition[i].getter[1] != 'function'
					&&	typeof definition[i].getter[1] != 'undefined') {
						throw new InvalidSyntaxFatal(
							'Property getter should specify a function or boolean'
						);
					}
					
					if (typeof definition[i].setter[1] != 'boolean'
					&&	typeof definition[i].setter[1] != 'function'
					&&	typeof definition[i].setter[1] != 'undefined') {
						throw new InvalidSyntaxFatal(
							'Property setter should specify a function or boolean'
						);
					}
					
					scope = new Class.Scope(Class.Scope.PRIVATE)
					
					namespace[className].properties[propName] = new Class.Property(
						propName,
						definition[i].value,
						scope,
						(typeof definition[i].getter[1] == 'undefined'
						|| definition[i].getter[1] === true)
							? function(value){ return value }
							: definition[i].getter[1],
						(typeof definition[i].setter[1] == 'undefined'
						|| definition[i].setter[1] === true)
							? function(value){ return value }
							: definition[i].setter[1],
						definition[i].getter[2],
						definition[i].getter[3],
						definition[i].setter[2],
						definition[i].setter[3],
						definition[i].getter[0],
						definition[i].setter[0]
					);
					
					scope.parent = namespace[className].properties[propName];
					namespace[className].properties[propName].originalValue = definition[i].value;
					
					continue toInspectDefinition;
					
				}
				
			}
			
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
				scope = new Class.Scope(Class.Scope.PRIVATE);
			}
			
			if (!isStatic) {
				
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
				} else if (Object.prototype.toString.call(definition[i]) == '[object Array]'
				&& typeof definition[i][definition[i].length-1] == 'function'
				&& (definition[i].length == definition[i][definition[i].length-1].length+2
				|| definition[i].length == definition[i][definition[i].length-1].length+1)) {
					
					var method = definition[i].pop();
					
					if (definition[i].length == method.length+1) {
						var returnType = definition[i].splice(0, 1)[0];
					}
					
					namespace[className].methods[propName] = new Class.Method(
						propName,
						method,
						scope,
						null,
						returnType,
						definition[i]
					);
					scope.parent = namespace[className].methods[propName];
					namespace[className].methods[propName].parentType
						= namespace[className];
					namespace[className].methods[propName].method.parentType
						= namespace[className];
					
				}
				
			} else {
				
				if (typeof definition[i] == 'function') {
					
					namespace[className].staticMethods[propName] = new Class.Method(
						propName,
						definition[i],
						scope,
						true
					);
					var method = namespace[className].staticMethods[propName];
					scope.parent = method;
					method.parentType = namespace[className];
					method.method.parentType = namespace[className];
					namespace[className][propName] = function(){
						return callStatic(namespace[className], arguments.callee.methodName);
					};
					
					namespace[className][propName].methodName = propName;
					
				} else {
					
					namespace[className].staticProperties[propName] = new Class.Property(
						propName,
						definition[i],
						scope
					);
					var property = namespace[className].staticProperties[propName];
					property.parentType = namespace[className];
					scope.parent = namespace[className].staticProperties[propName];
					
				}
				
			}
			
		}
		
		var parentMethods = getListOfParentStaticMethods(namespace[className]);
		
		for (var i in parentMethods) {
			if (!parentMethods.hasOwnProperty(i)) continue;
			namespace[className][parentMethods[i]] = function(){
				return callStatic(namespace[className], arguments.callee.methodName);
			}
			namespace[className][parentMethods[i]].methodName = parentMethods[i];
		}
		
		namespace[className].get = function(propertyName)
		{
			var object = this;
			var property = object.staticProperties[propertyName];
			while (!property && object.Extends) {
				object = object.Extends;
				property = object.staticProperties[propertyName];
			}
			if (!property) {
				throw new UnknownPropertyFatal(propertyName);
			}
			namespace[className].staticProperties[propertyName].scope.checkCallingFunction(
				arguments.callee.caller
			);
			return namespace[className].staticProperties[propertyName].value;
		};
		
		namespace[className].set = function(propertyName, value)
		{
			if (typeof namespace[className].staticProperties[propertyName] == 'undefined') {
				throw new UnknownPropertyFatal(propertyName);
			}
			namespace[className].staticProperties[propertyName].value = value;
		};
		
		// If the class is not abstract
		// and it does extend another class
		// we need to ensure it implements
		// all abstract methods
		if (!namespace[className].Abstract && namespace[className].Extends) {
			
			// Loop through all ancestors and
			// gather a list of all abstract methods
			var parent = namespace[className].Extends;
			var methods = {};
			var methodsFound = false;
			while (parent) {
				for (var i in parent.AbstractMethods) {
					if (!parent.AbstractMethods.hasOwnProperty(i)) continue;
					methods[i] = parent.AbstractMethods[i];
					methodsFound = true;
				}
				parent = parent.Extends || false;
			}
			
			for (var i in methods) {
				if (!methods.hasOwnProperty(i)) continue;
				var args = i.substring(
					i.indexOf('(')+1,
					i.length-1
				);
				args = args.replace(' ', '');
				args = (args == '') ? [] : args.split(',');
				var methodName = i.substring(0, i.indexOf('('));
				if (methodName.substring(0, 10) == 'protected:') {
					methodName = methodName.substring(10);
					var scope = Class.Scope.PROTECTED;
				} else if (methodName.substring(0, 7) == 'public:') {
					methodName = methodName.substring(7);
					var scope = Class.Scope.PUBLIC;
				} else {
					methodName = methodName.substring(10);
					var scope = Class.Scope.PROTECTED;
				}
				methods[methodName] = {
					scope: scope,
					args: args,
					implemented: false,
					types: methods[i]
				};
				delete methods[i];
			}
			
			// Loop through all ancesters again
			// and mark all the methods that
			// have been implemented
			if (methodsFound) {
				parent = namespace[className];
				while (parent) {
					for (var i in parent.methods) {
						var methodMatches = false;
						if (!parent.methods.hasOwnProperty(i)) continue;
						if (typeof methods[i] == 'undefined') continue;
						var methodAsString = parent.methods[i].method.toString();
						var methodArgs = methodAsString.substring(
							'function ('.length,
							methodAsString.indexOf(')')
						);
						methodArgs = methodArgs.replace(' ', '');
						methodArgs = methodArgs.split(',');
						if (methods[i].args.join('') == methodArgs.join('')
						&&	methods[i].scope == parent.methods[i].scope.level) {
							methodMatches = true;
						}
						var methodTypes = methods[i].types;
						if (typeof methodTypes != 'undefined') {
							if (typeof parent.methods[i].argTypes == 'undefined') {
								methodMatches = false;
							} else {
								if (methodTypes.length != parent.methods[i].argTypes.length
								&&	methodTypes.length != parent.methods[i].argTypes.length+1) {
									methodMatches = false;
								}
								if (methodTypes.length == parent.methods[i].argTypes.length) {
									for (var j in methodTypes) {
										if (!methodTypes.hasOwnProperty(j)) continue;
										if (parent.methods[i].argTypes[j] !== methodTypes[j]) {
											methodMatches = false;
											break;
										}
									}
								}
								if (methodTypes.length == parent.methods[i].argTypes.length+1) {
									if (parent.methods[i].returnType != methodTypes[0]) {
										methodMatches = false;
									}
									for (var j in methodTypes) {
										var implementedTypes = parent.methods[i].argTypes[j];
										if (!methodTypes.hasOwnProperty(j)) continue;
										if (implementedTypes !== methodTypes[parseInt(j)+1]) {
											methodMatches = false;
											break;
										}
									}
								}
							}
						}
						if (methodMatches) methods[i].implemented = true;
					}
					parent = parent.Extends || false;
				}
				
				// If any methods are still marked
				// as missing, throw a fatal
				for (var i in methods) {
					if (!methods.hasOwnProperty(i)) continue;
					if (methods[i].implemented === false) {
						throw new AbstractMethodNotImplementedFatal(i);
					}
				}
				
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
		if (typeof property.getter == 'function'
		||	typeof property.getter == 'boolean') {
			if (arguments.callee.caller.parentType == this.type) {
				if (property.parent.type == this.type && !property.ownerUsesGetter) {
					return property.value;
				}
				if (property.parent.type != this.type && !property.childUsesGetter) {
					return property.value;
				}
			}
			if (property.getter === false) throw new ScopeFatal(
				'Cannot access restricted property'
			);
			var value = property.getter(property.value);
			if (property.getterType && validateType(value, property.getterType) === false) {
				throw new InvalidReturnTypeFatal();
			}
			return value;
		} else {
			property.scope.checkCallingFunction(arguments.callee.caller);
		}
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
		if (typeof property.setter == 'function'
		||	typeof property.setter == 'boolean') {
			if (arguments.callee.caller.parentType == this.type) {
				if (property.parent.type == this.type && !property.ownerUsesSetter) {
					property.value = value;
					this.propertyValues[propertyName] = property.value;
					return;
				}
				if (property.parent.type != this.type && !property.childUsesSetter) {
					property.value = value;
					this.propertyValues[propertyName] = property.value;
					return;
				}
			}
			if (property.setter === false) throw new ScopeFatal('Cannot access private property');
			if (property.setterType && validateType(value, property.setterType) === false) {
				throw new InvalidArgumentTypeFatal();
			}
			property.value = property.setter(value, property.value);
			this.propertyValues[propertyName] = property.value;
		} else {
			property.value = value;
			this.propertyValues[propertyName] = property.value;
		}
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
		for (var property in method) {
			if (method.hasOwnProperty(property) && property != 'prototype') {
				copiedMethod[property] = method[property];
			}
		}
		copiedMethod.method.parent = this;
		copiedMethod.parentType.id = object.id;
		// @todo next line should have one less 'caller' if
		// the method is called directly using object.call('methodName');
		copiedMethod.scope.checkCallingFunction(arguments.callee.caller.caller);
		var args = [];
		for (var a = 1; a < arguments.length; a++) {
			args.push(arguments[a]);
		}
		if (typeof copiedMethod.argTypes != 'undefined') {
			for (var i in copiedMethod.argTypes) {
				if (!copiedMethod.argTypes.hasOwnProperty(i)) continue;
				if (validateType(args[i], copiedMethod.argTypes[i]) === false) {
					throw new InvalidArgumentTypeFatal();
				}
			}
		}
		if (isLoadingDependencies()) {
			registerWaitingCallback(copiedMethod.method, object, args, methodName);
			return;
		}
		if (overloaded === false) {
			var returnVal = copiedMethod.method.apply(object, args);
		} else {
			var returnVal = copiedMethod.method.call(object, methodName, args);
		}
		if (typeof copiedMethod.returnType == 'undefined') return returnVal;
		if (validateType(returnVal, copiedMethod.returnType) === false) {
			throw new InvalidReturnTypeFatal();
		}
		return returnVal;
	}
	
	Class.prototype.trigger = function()
	{
		var caller = arguments.callee.caller;
		if (caller.parent.type.methods.construct
		&&	caller == caller.parent.type.methods.construct.method) {
			throw new RuntimeFatal('Cannot trigger an event from a constructor');
		}
		var eventName = arguments[0];
		var target = getInstantiatedObject(this);
		while (target) {
			if (typeof target.eventCallbacks != 'undefined'
			&&	typeof target.eventCallbacks[eventName] != 'undefined') {
				var events = target.eventCallbacks;
				break;
			}
			target = (target.parent) ? target.parent : false;
		}
		if (!events) throw new UnknownEventFatal(eventName);
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		for (var i in events[eventName]) {
			if (!events[eventName].hasOwnProperty(i)) continue;
			var callback = events[eventName][i];
			callback.method.method.apply(callback.object, args);
		}
	}
	
	Class.prototype.bind = function(eventName, methodName)
	{
		var target = getInstantiatedObject(this);
		while (target) {
			if (typeof target.eventCallbacks != 'undefined'
			&&	typeof target.eventCallbacks[eventName] != 'undefined') {
				var events = target.eventCallbacks;
				break;
			}
			target = (target.parent) ? target.parent : false;
		}
		if (!events) throw new UnknownEventFatal(eventName);
		var object = getInstantiatedObject(this);
		var targetObject = arguments.callee.caller.parent;
		var method = lookup(
			'method',
			methodName,
			targetObject,
			this,
			arguments.callee.caller
		);
		var copiedMethod = {};
		for (property in method) {
			if (method.hasOwnProperty(property) && property != 'prototype') {
				copiedMethod[property] = method[property];
			}
		}
		copiedMethod.method.parent = this;
		copiedMethod.parentType.id = targetObject.id;
		copiedMethod.scope.checkCallingObject(object);
		if (typeof copiedMethod.argTypes != 'undefined') {
			for (var i in target.type.Events[eventName]) {
				if (!target.type.Events[eventName].hasOwnProperty(i)) continue;
				if (copiedMethod.argTypes[i] !== target.type.Events[eventName][i]) {
					throw new InvalidArgumentTypeFatal(
						'Method argument types must match target event argument types'
					);
				}
			}
		}
		for (var i in this.eventCallbacks[eventName]) {
			if (!this.eventCallbacks[eventName].hasOwnProperty(i)) continue;
			if (this.eventCallbacks[eventName][i].method.name == methodName
			&&	this.eventCallbacks[eventName][i].object == arguments.callee.caller.parent) {
				return;
			}
		}
		var events = events || this.eventCallbacks;
		events[eventName].push({
			object:	targetObject,
			method:	method
		});
	}
	
	Class.prototype.unbind = function(eventName, method)
	{
		var target = getInstantiatedObject(this);
		while (target) {
			if (typeof target.eventCallbacks != 'undefined'
			&&	typeof target.eventCallbacks[eventName] != 'undefined') {
				var events = target.eventCallbacks;
				break;
			}
			target = (target.parent) ? target.parent : false;
		}
		if (!events) throw new UnknownEventFatal(eventName);
		for (var i in events[eventName]) {
			if (!events[eventName].hasOwnProperty(i)) continue;
			if (events[eventName][i].method.name == method
			&&	events[eventName][i].object == arguments.callee.caller.parent) {
				events[eventName].splice(i, 1);
				return;
			}
		}
	}
	
	var callStatic = function(object, methodName)
	{
		var method = object.staticMethods[methodName];
		while (!method && object.Extends) {
			object = object.Extends;
			method = object.staticMethods[methodName];
		}
		if (!method) {
			throw new UnknownMethodFatal(methodName);
		}
		method.scope.checkCallingFunction(arguments.callee.caller.caller);
		return method.method.call();
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
		
		throw new CloneFatal('Unable to copy object argument of type ' + typeof object);
		
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
				throw new UnknownPropertyFatal(name);
			} else {
				throw new UnknownMethodFatal(name);
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
	
	function getListOfParentStaticMethods(object)
	{
		var methods = [];
		if (object.Extends) {
			var parent = object.Extends;
			while (parent) {
				for (var i in parent.staticMethods) {
					if (!parent.staticMethods.hasOwnProperty(i)) continue;
					methods.push(i);
				}
				parent = parent.Extends || false;
			}
		}
		return methods;
	}
	
	function validateType(argument, targetType)
	{
		if (Object.prototype.toString.call(argument) == '[object Array]') {
			if (Object.prototype.toString.call(targetType) == '[object Array]') {
				var returnType = targetType[0];
				for (var i in argument) {
					if (!argument.hasOwnProperty(i)) continue;
					if (validateType(argument[i], returnType) === false) return false;
				}
			} else if (targetType != 'array') return false;
		} else if (argument === null) {
			if (targetType !== null) return false;
		} else if (typeof targetType == 'function'
		&& typeof argument.instanceOf != 'undefined') {
			if (!argument.instanceOf(targetType)) {
				return false;
			}
		} else if (targetType != typeof argument) {
			return false;
		}
	}
	
	function processDependencies(dependencies)
	{
		
		toProcessDependencies:
		for (var i in dependencies) {
			
			if (!dependencies.hasOwnProperty(i)) continue;
			
			var dependency = dependencies[i];
			
			for (var j in loadedClasses) {
				if (!loadedClasses.hasOwnProperty(j)) continue;
				if (loadedClasses[j] == dependency) {
					continue toProcessDependencies;
				}
			}
			
			var extension = dependency.split('.').pop();
			
			// If the dependency does not contain
			// any forward slashes and it does not
			// end with a handled extension, we can
			// consider it a class name
			var isClass = (dependency.split('/').pop() == dependency
			&&	['js' /* other file types link css or jpg? */].indexOf(extension) == -1);
			
			var map = (isClass) ? classMap : folderMap;
			
			var filename = undefined;
			
			for (var i in map) {
				if (!map.hasOwnProperty(i)) continue;
				var pattern = map[i].pattern;
				if (dependency.substr(0, pattern.length) == pattern) {
					var filename = map[i].target + dependency.substr(pattern.length);
					break;
				}
			}
			
			if (typeof filename == 'undefined') filename = dependency;
			
			if (isClass) {
				filename = filename.split('.').join('/') + '.js';
				extension = 'js';
			}
			
			if (includedDependencies.indexOf(filename) > -1) continue;
			
			registerLoadingDependency(filename);
			
			switch (extension) {
				
				case 'js':
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = filename;
					script.onreadystatechange = script.onload = function(){
						// Could check for ready state other than success
						// http://stackoverflow.com/questions/6725272/dynamic-cross-browser-script-loading
						registerLoadedDependency(filename);
					};
					document.head.appendChild(script);
					includedDependencies.push(filename);
				break;
				
				// Other file types like css or jpg?
				
			}
			
		}
		
	}
	
	var classMap = [];
	var folderMap = [];
	
	Class.addClassAutoloadPattern = function(pattern, target)
	{
		classMap.push({
			pattern: pattern,
			target: target
		});
		classMap.sort(function(a, b){
			return b.pattern.length - a.pattern.length;
		});
	};
	
	Class.addFolderAutoloadPattern = function(pattern, target)
	{
		folderMap.push({
			pattern: pattern,
			target: target
		});
		folderMap.sort(function(a, b){
			return b.pattern.length - a.pattern.length;
		});
	};
	
	var loadedClasses = [];
	var loadingDependencies = [];
	var includedDependencies = [];
	var waitingCallbacks = [];
	
	function isLoadingDependencies()
	{
		return (loadingDependencies.length);
	}
	
	function registerLoadingDependency(filename)
	{
		loadingDependencies.push(filename);
	}
	
	function registerLoadedDependency(filename)
	{
		var i = loadingDependencies.length;
		while (i--) {
			if (loadingDependencies[i] == filename) {
				loadingDependencies.splice(i, 1);
			}
		}
		if (loadingDependencies.length == 0) {
			for (var i in waitingCallbacks) {
				if (!waitingCallbacks.hasOwnProperty(i)) continue;
				var c = waitingCallbacks[i];
				if (c.methodName) {
					c.callback.call(c.object, c.methodName, c.args);
				} else {
					c.callback.apply(c.object, c.args);
				}
			}
		}
	}
	
	function registerWaitingCallback(callback, object, args, methodName)
	{
		waitingCallbacks.push({
			callback:	callback,
			object:		object,
			args:		args,
			methodName:	methodName
		});
	}
	
	Class.registerLoadedClass = function(classnames)
	{
		if (Object.prototype.toString.apply(classnames) != '[object Array]') {
			classnames = [classnames];
		}
		for (var i in classnames) {
			if (!classnames.hasOwnProperty(i)) continue;
			loadedClasses.push(classnames[i]);
		}
	}
	
})();
