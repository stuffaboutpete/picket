(function(){
	
	// Allow us to create basic objects
	// somewhere else and also ensure we
	// are creating single instances of
	// said classes
	var instantiator = new ClassyJS.Instantiator();
	var namespaceManager = instantiator.getNamespaceManager();
	
	// Create one global function which
	// is used to declare all types
	window.define = function(){
		
		/**
		 *	Read class/interface signature
		 *	Look for class vs interface
		 *	Get the constructor function
		 * Look for location so we can register the class/interface
		 * Register in directory with info about extensions and implementations and abstractiness
		 *	Loop through members and pass to front factory
		 *	Register each member against the class in a registry
		 *	Check members is array or object dependent on class/interface
		 */
		
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
		if (typeObject instanceof ClassyJS.Type.Class) {
			
			// Create a new class constructor
			// providing it the class registry
			var constructor = new ClassyJS.Type.Class.Constructor(
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
				var parentClass = typeObject.getParentClass();
				instantiator.getTypeRegistry().registerClassChild(parentClass, typeObject);
				var parentConstructor = instantiator.getTypeRegistry().getParent(constructor);
				constructor.prototype = _createObject(parentConstructor.prototype);
				constructor.prototype.constructor = constructor;
				_appendMemberNames(staticMethods, constants, parentClass);
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
			
		} else if (typeObject instanceof ClassyJS.Type.Interface) {
			
			instantiator.getTypeRegistry().registerInterface(typeObject);
			
		}
		
		for (var i in members) {
			
			if (Object.prototype.toString.call(members) == '[object Array]') {
				var member = instantiator.getMemberFactory().build(members[i], true);
			} else {
				var member = instantiator.getMemberFactory().build(i, false, members[i]);
			}
			
			instantiator.getMemberRegistry().register(member, typeObject);
			
			if (member instanceof ClassyJS.Member.Method && member.isStatic()) {
				
				staticMethods.push(member.getName());
				
			} else if (member instanceof ClassyJS.Member.Constant) {
				
				constants.push(member.getName());
				
			}
			
		}
		
		if (typeObject instanceof ClassyJS.Type.Class) {
			
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
						return instantiator.getMemberRegistry().getConstant(
							constructor,
							{},
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
	
	window.start.addAutoLoadPattern = function(pattern, target)
	{
		instantiator.getAutoLoader().addClassAutoloadPattern(pattern, target);
	};
	
	window.require = function(className, targetMethod)
	{
		instantiator.getAutoLoader().require(
			className,
			arguments.callee.caller.$$owner,
			targetMethod
		);
	};
	
	var _typeCheckMembers = function(members, definition)
	{
		if (definition instanceof ClassyJS.Type.Class) {
			if (typeof members != 'undefined') {
				if (Object.prototype.toString.call(members) == '[object Array]') {
					throw new ClassyJS.Main.Fatal(
						'NON_OBJECT_CLASS_MEMBERS',
						'Provided type: array'
					);
				}
				if (typeof members != 'object') {
					throw new ClassyJS.Main.Fatal(
						'NON_OBJECT_CLASS_MEMBERS',
						'Provided type: ' + typeof members
					);
				}
			}
		} else if (definition instanceof ClassyJS.Type.Interface) {
			if (typeof members != 'undefined') {
				if (Object.prototype.toString.call(members) != '[object Array]') {
					throw new ClassyJS.Main.Fatal(
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
			if (members[i] instanceof ClassyJS.Member.Method && members[i].isStatic()) {
				staticMethods.push(members[i].getName());
			} else if (members[i] instanceof ClassyJS.Member.Constant) {
				constants.push(members[i].getName());
			}
		}
	};
	
})();
