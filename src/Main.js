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
