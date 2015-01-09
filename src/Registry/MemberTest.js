describe('Registry.Member', function(){
	
	/**
	 * Should (still to do...)
	 * 
	 * Be able to override class members on instances (for reflection)
	 * Type check all public interfaces
	 * Interface stuff (if there is anything other than getting members)
	 */
	
	var registry;
	var typeRegistry;
	var classObject;
	var propertyObject;
	var methodObject;
	var eventObject;
	var constantObject;
	var typeChecker;
	var accessController;
	var accessInstance;
	
	beforeEach(function(){
		typeRegistry = new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager());
		typeChecker = new ClassyJS.TypeChecker();
		accessController = new ClassyJS.Access.Controller(typeRegistry);
		registry = new ClassyJS.Registry.Member(typeRegistry, typeChecker);
		classObject = new ClassyJS.Type.Class(
			new ClassyJS.Type.Class.Definition('class MyClass'),
			new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
			new ClassyJS.Registry.Member(
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.TypeChecker()
			),
			new ClassyJS.NamespaceManager()
		);
		interfaceObject = new ClassyJS.Type.Interface();
		propertyObject = new ClassyJS.Member.Property(
			new ClassyJS.Member.Property.Definition('public myProperty (string)'),
			false,
			null,
			typeChecker,
			accessController
		);
		methodObject = new ClassyJS.Member.Method(
			new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
			false,
			function(){},
			typeChecker,
			accessController
		);
		eventObject = new ClassyJS.Member.Event(
			new ClassyJS.Member.Event.Definition('public event myEvent ()'),
			false,
			undefined,
			typeChecker,
			accessController
		);
		constantObject = new ClassyJS.Member.Constant(
			new ClassyJS.Member.Constant.Definition('public constant MY_CONSTANT'),
			false,
			undefined,
			typeChecker,
			accessController
		);
		accessInstance = {};
	});
	
	describe('instantiation', function(){
		
		it('can be done', function(){
			var registry = new ClassyJS.Registry.Member(typeRegistry, typeChecker);
			expect(registry instanceof ClassyJS.Registry.Member).toBe(true);
		});
		
		it('throws error if no type registry is supplied', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'TYPE_REGISTRY_REQUIRED',
				'Provided type: undefined'
			);
			expect(function(){
				new ClassyJS.Registry.Member(undefined, typeChecker);
			}).toThrow(expectedFatal);
		});
		
		it('throws error if no type checker is supplied', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'TYPE_CHECKER_REQUIRED',
				'Provided type: undefined'
			);
			expect(function(){
				new ClassyJS.Registry.Member(typeRegistry);
			}).toThrow(expectedFatal);
		});
		
	});
	
	describe('member registration', function(){
		
		beforeEach(function(){
			spyOn(propertyObject, 'getName').and.returnValue('myProperty');
		});
		
		it('can be done with property against class', function(){
			registry.register(propertyObject, classObject);
		});
		
		it('can be done with property against interface', function(){
			registry.register(propertyObject, interfaceObject);
		});
		
		it('throws error if property is registered against non class or interface', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'TARGET_NOT_CLASS_OR_INTERFACE',
				'Provided type: object'
			);
			expect(function(){
				registry.register(propertyObject, propertyObject);
			}).toThrow(expectedFatal);
		});
		
		it('can be done with method against class', function(){
			registry.register(methodObject, classObject);
		});
		
		it('can be done with method against interface', function(){
			registry.register(methodObject, interfaceObject);
		});
		
		it('throws error if method is registered against non class or interface', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'TARGET_NOT_CLASS_OR_INTERFACE',
				'Provided type: object'
			);
			expect(function(){
				registry.register(methodObject, methodObject);
			}).toThrow(expectedFatal);
		});
		
		it('can be done with event against class', function(){
			registry.register(eventObject, classObject);
		});
		
		it('can be done with event against interface', function(){
			registry.register(eventObject, interfaceObject);
		});
		
		it('throws error if event is registered against non class or interface', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'TARGET_NOT_CLASS_OR_INTERFACE',
				'Provided type: object'
			);
			expect(function(){
				registry.register(eventObject, methodObject);
			}).toThrow(expectedFatal);
		});
		
	});
	
	describe('member retrieval', function(){
		
		var methodObject2;
		var methodObject3;
		var parentClassObject;
		var grandParentClassObject;
		
		beforeEach(function(){
			spyOn(propertyObject, 'getName').and.returnValue('myProperty');
			methodObject2 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			methodObject3 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			parentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			grandParentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
		});
		
		it('will return all member objects for class', function(){
			registry.register(propertyObject, classObject);
			registry.register(methodObject, classObject);
			registry.register(eventObject, classObject);
			registry.register(constantObject, classObject);
			var members = registry.getMembers(classObject);
			expect(members.length).toBe(4);
			expect(members.indexOf(propertyObject) > -1).toBe(true);
			expect(members.indexOf(methodObject) > -1).toBe(true);
			expect(members.indexOf(eventObject) > -1).toBe(true);
			expect(members.indexOf(constantObject) > -1).toBe(true);
		});
		
		it('triggers error if non class or interface object is supplied', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'TARGET_NOT_CLASS_OR_INTERFACE',
				'Provided type: object'
			);
			registry.register(propertyObject, classObject);
			expect(function(){ registry.getMembers({}); }).toThrow(expectedFatal);
		});
		
		it('will return empty array if no members are registered', function(){
			var members = registry.getMembers(classObject);
			expect(Object.prototype.toString.call(members)).toBe('[object Array]');
			expect(members.length).toBe(0);
		});
		
		it('will return class object from method instance', function(){
			registry.register(methodObject, classObject);
		});
		
		it('indicates presence of no abstract members', function(){
			spyOn(methodObject, 'getName').and.returnValue('Method1');
			spyOn(methodObject2, 'getName').and.returnValue('Method2');
			spyOn(methodObject3, 'getName').and.returnValue('Method3');
			spyOn(methodObject, 'isAbstract').and.returnValue(false);
			spyOn(methodObject2, 'isAbstract').and.returnValue(false);
			spyOn(methodObject3, 'isAbstract').and.returnValue(false);
			spyOn(typeRegistry, 'hasParent').and.returnValue(false);
			registry.register(methodObject, classObject);
			registry.register(methodObject2, classObject);
			registry.register(methodObject3, classObject);
			expect(registry.hasAbstractMembers(classObject)).toBe(false);
		});
		
		it('indicates presence of abstract members', function(){
			spyOn(methodObject, 'getName').and.returnValue('Method1');
			spyOn(methodObject2, 'getName').and.returnValue('Method2');
			spyOn(methodObject3, 'getName').and.returnValue('Method3');
			spyOn(methodObject, 'isAbstract').and.returnValue(false);
			spyOn(methodObject2, 'isAbstract').and.returnValue(true);
			spyOn(methodObject3, 'isAbstract').and.returnValue(false);
			spyOn(typeRegistry, 'hasParent').and.returnValue(false);
			registry.register(methodObject, classObject);
			registry.register(methodObject2, classObject);
			registry.register(methodObject3, classObject);
			expect(registry.hasAbstractMembers(classObject)).toBe(true);
		});
		
		it('indicates presence of abstract member in parent class', function(){
			spyOn(methodObject, 'getName').and.returnValue('Method1');
			spyOn(methodObject2, 'getName').and.returnValue('Method2');
			spyOn(methodObject, 'isAbstract').and.returnValue(false);
			spyOn(methodObject2, 'isAbstract').and.returnValue(true);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(target){
				return (target === classObject) ? true : false;
			});
			spyOn(typeRegistry, 'getParent').and.returnValue(parentClassObject);
			registry.register(methodObject, classObject);
			registry.register(methodObject2, parentClassObject);
			expect(registry.hasAbstractMembers(classObject)).toBe(true);
		});
		
		it('indicates presence of abstract member in ancestor class', function(){
			spyOn(methodObject, 'getName').and.returnValue('Method1');
			spyOn(methodObject2, 'getName').and.returnValue('Method2');
			spyOn(methodObject, 'isAbstract').and.returnValue(false);
			spyOn(methodObject2, 'isAbstract').and.returnValue(true);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(target){
				if (target === classObject) return true;
				if (target === parentClassObject) return true;
				return false;
			});
			spyOn(typeRegistry, 'getParent').and.callFake(function(target){
				if (target === classObject) return parentClassObject;
				if (target === parentClassObject) return grandParentClassObject;
			});
			registry.register(methodObject, classObject);
			registry.register(methodObject2, grandParentClassObject);
			expect(registry.hasAbstractMembers(classObject)).toBe(true);
		});
		
		it('checks ancestors before indicating no abstract members', function(){
			spyOn(methodObject, 'getName').and.returnValue('Method1');
			spyOn(methodObject2, 'getName').and.returnValue('Method2');
			spyOn(methodObject, 'isAbstract').and.returnValue(false);
			spyOn(methodObject2, 'isAbstract').and.returnValue(false);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(target){
				if (target === classObject) return true;
				if (target === parentClassObject) return true;
				return false;
			});
			spyOn(typeRegistry, 'getParent').and.callFake(function(target){
				if (target === classObject) return parentClassObject;
				if (target === parentClassObject) return grandParentClassObject;
			});
			registry.register(methodObject, classObject);
			registry.register(methodObject2, grandParentClassObject);
			expect(registry.hasAbstractMembers(classObject)).toBe(false);
		});
		
		it('ignores overridden instances when looking for abstract members', function(){
			spyOn(methodObject, 'getName').and.returnValue('myMethod');
			spyOn(methodObject2, 'getName').and.returnValue('myMethod');
			spyOn(methodObject, 'isAbstract').and.returnValue(true);
			spyOn(methodObject2, 'isAbstract').and.returnValue(false);
			spyOn(methodObject, 'isStatic').and.returnValue(false);
			spyOn(methodObject2, 'isStatic').and.returnValue(false);
			spyOn(methodObject, 'getArgumentTypes').and.returnValue(['string']);
			spyOn(methodObject2, 'getArgumentTypes').and.returnValue(['string']);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(target){
				return (target === classObject) ? true : false;
			});
			spyOn(typeRegistry, 'getParent').and.returnValue(parentClassObject);
			registry.register(methodObject, parentClassObject);
			registry.register(methodObject2, classObject);
			expect(registry.hasAbstractMembers(classObject)).toBe(false);
		});
		
	});
	
	describe('property', function(){
		
		var classInstance;
		var classInstance2;
		var propertyObject2;
		
		beforeEach(function(){
			classInstance = {};
			classInstance2 = {};
			propertyObject2 = new ClassyJS.Member.Property(
				new ClassyJS.Member.Property.Definition('public myProperty (string)'),
				false,
				null,
				typeChecker,
				accessController
			);
			spyOn(propertyObject, 'getName').and.returnValue('myProperty');
			spyOn(propertyObject2, 'getName').and.returnValue('myProperty');
			spyOn(propertyObject, 'set').and.callFake(function(one, two, value){ return value; });
			spyOn(propertyObject, 'get').and.callFake(function(one, two, value){ return value; });
			spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
			spyOn(typeRegistry, 'getInstantiatedInstance').and.callFake(function(instance){
				return instance;
			});
			registry.register(propertyObject, classObject);
		});
		
		it('triggers error if two with same name are registered against same class', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'PROPERTY_ALREADY_REGISTERED',
				'Property name: myProperty'
			);
			expect(function(){
				registry.register(propertyObject2, classObject);
			}).toThrow(expectedFatal);
		});
		
		it('triggers look up of class from type registry when setting', function(){
			registry.setPropertyValue(classInstance, accessInstance, 'myProperty', 'Value');
			expect(typeRegistry.getClass).toHaveBeenCalledWith(classInstance);
		});
		
		it('is identified and passed value, target and access instance when setting', function(){
			registry.setPropertyValue(classInstance, accessInstance, 'myProperty', 'Value');
			expect(propertyObject.set).toHaveBeenCalledWith(classInstance, accessInstance, 'Value');
		});
		
		it('value is stored and can be retrieved using target and access instances', function(){
			spyOn(propertyObject, 'getDefaultValue').and.returnValue(undefined);
			expect(registry.getPropertyValue(
				classInstance,
				accessInstance,
				'myProperty'
			)).toBe(undefined);
			registry.setPropertyValue(classInstance, accessInstance, 'myProperty', 'Value');
			expect(registry.getPropertyValue(
				classInstance,
				accessInstance,
				'myProperty'
			)).toBe('Value');
			expect(propertyObject.getDefaultValue).toHaveBeenCalledWith(
				classInstance,
				accessInstance
			);
			expect(propertyObject.get).toHaveBeenCalledWith(classInstance, accessInstance, 'Value');
		});
		
		it('allows different class instances to have different property values', function(){
			spyOn(propertyObject, 'getDefaultValue').and.returnValue(undefined);
			expect(registry.getPropertyValue(
				classInstance,
				accessInstance,
				'myProperty'
			)).toBe(undefined);
			registry.setPropertyValue(classInstance, accessInstance, 'myProperty', 'Value 1');
			expect(registry.getPropertyValue(
				classInstance,
				accessInstance,
				'myProperty'
			)).toBe('Value 1');
			expect(registry.getPropertyValue(
				classInstance2,
				accessInstance,
				'myProperty'
			)).toBe(undefined);
			registry.setPropertyValue(
				classInstance2,
				accessInstance,
				'myProperty',
				'Value 2'
			);
			expect(registry.getPropertyValue(
				classInstance2,
				accessInstance,
				'myProperty'
			)).toBe('Value 2');
		});
		
		it('value is found from property object if non has yet been set', function(){
			spyOn(propertyObject, 'getDefaultValue').and.returnValue('Default value');
			expect(registry.getPropertyValue(
				classInstance,
				accessInstance,
				'myProperty'
			)).toBe('Default value');
			expect(propertyObject.getDefaultValue).toHaveBeenCalledWith(
				classInstance,
				accessInstance
			);
		});
		
	});
	
	describe('method', function(){
		
		var classInstance;
		var methodObject2;
		
		beforeEach(function(){
			classInstance = {};
			spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
			spyOn(typeRegistry, 'getInstantiatedInstance').and.callFake(function(instance){
				return instance;
			});
			registry.register(methodObject, classObject);
			methodObject2 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(methodObject, 'getName').and.returnValue('myMethod');
			spyOn(methodObject2, 'getName').and.returnValue('myMethod');
			spyOn(methodObject, 'isStatic').and.returnValue(false);
			spyOn(methodObject2, 'isStatic').and.returnValue(false);
		});
		
		it('can be registered with same name as previous against same class', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue(['string']);
			spyOn(methodObject2, 'getArgumentTypes').and.returnValue(['number']);
			registry.register(methodObject2, classObject);
		});
		
		it('triggers error if method with same name, arg types is registered', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'METHOD_ALREADY_REGISTERED',
				'Method name: myMethod; Argument types: string, number; Is static: false'
			);
			spyOn(methodObject, 'getArgumentTypes').and.returnValue(['string', 'number']);
			spyOn(methodObject2, 'getArgumentTypes').and.returnValue(['string', 'number']);
			expect(function(){
				registry.register(methodObject2, classObject);
			}).toThrow(expectedFatal);
		});
		
		it('triggers error if non class instance is supplied when calling', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'NON_CLASS_INSTANCE_OR_CONSTRUCTOR_PROVIDED',
				'Provided type: string'
			);
			expect(function(){
				registry.callMethod('non an object', {}, 'myMethod', []);
			}).toThrow(expectedFatal);
		});
		
		it('triggers error if non string method name is supplied when calling', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'NON_STRING_METHOD_NAME_PROVIDED',
				'Provided type: number'
			);
			expect(function(){
				registry.callMethod({}, {}, 123, []);
			}).toThrow(expectedFatal);
		});
		
		it('triggers error if non array method arguments are supplied when calling', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'NON_ARRAY_METHOD_ARGUMENTS_PROVIDED',
				'Provided type: object'
			);
			expect(function(){
				registry.callMethod({}, {}, 'myMethod', {});
			}).toThrow(expectedFatal);
		});
		
		it('triggers look up of class from type registry when calling', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject, 'call').and.callFake(function(){});
			registry.callMethod(classInstance, {}, 'myMethod', []);
			expect(typeRegistry.getClass).toHaveBeenCalledWith(classInstance);
		});
		
		it('is found and passed target, access instances and arguments when called', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue(['string', 'string']);
			spyOn(methodObject, 'call');
			registry.callMethod(classInstance, accessInstance, 'myMethod', ['arg1', 'arg2']);
			expect(methodObject.call).toHaveBeenCalledWith(
				classInstance,
				classInstance,
				accessInstance,
				['arg1', 'arg2'],
				undefined
			);
		});
		
		it('returns value from', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject, 'call').and.returnValue('Method return value');
			expect(registry.callMethod(
				classInstance,
				{},
				'myMethod',
				[]
			)).toBe('Method return value');
		});
		
		it('can be called when overloading other method', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue(['string']);
			spyOn(methodObject2, 'getArgumentTypes').and.returnValue(['number']);
			spyOn(methodObject, 'call').and.returnValue('Type: string');
			spyOn(methodObject2, 'call').and.returnValue('Type: number');
			registry.register(methodObject2, classObject);
			expect(registry.callMethod(
				classInstance,
				{},
				'myMethod',
				['example']
			)).toBe('Type: string');
			expect(registry.callMethod(
				classInstance,
				{},
				'myMethod',
				[123]
			)).toBe('Type: number');
		});
		
		it('will not call static method against class instance', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'METHOD_NOT_REGISTERED',
				'Provided name: myMethod'
			);
			var registry = new ClassyJS.Registry.Member(typeRegistry, typeChecker);
			var staticMethodObject = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(staticMethodObject, 'getName').and.returnValue('myMethod');
			spyOn(staticMethodObject, 'isStatic').and.returnValue(true);
			spyOn(staticMethodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(staticMethodObject, 'call');
			registry.register(staticMethodObject, classObject);
			expect(function(){
				registry.callMethod(classInstance, {}, 'myMethod', []);
			}).toThrow(expectedFatal);
			expect(staticMethodObject.call).not.toHaveBeenCalled();
		});
		
		// @todo Unrecognised method
		
	});
	
	describe('static method', function(){
		
		var classConstructor = function(){};
		var methodObject;
		var methodObject2;
		
		beforeEach(function(){
			methodObject = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			methodObject2 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(methodObject, 'getName').and.returnValue('myMethod');
			spyOn(methodObject, 'isStatic').and.returnValue(true);
			spyOn(methodObject2, 'getName').and.returnValue('myMethod');
			spyOn(methodObject2, 'isStatic').and.returnValue(true);
			spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
			spyOn(typeRegistry, 'getInstantiatedInstance').and.callFake(function(instance){
				return instance;
			});
			spyOn(typeRegistry, 'hasParent').and.returnValue(false);
			registry.register(methodObject, classObject);
		});
		
		it('can be called against class constructor', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject, 'call');
			registry.callMethod(classConstructor, {}, 'myMethod', []);
			expect(methodObject.call).toHaveBeenCalled();
		});
		
		it('will pass arguments on call', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue(['number', 'number', 'number']);
			spyOn(methodObject, 'call');
			registry.callMethod(classConstructor, accessInstance, 'myMethod', [1, 2, 3]);
			expect(methodObject.call).toHaveBeenCalledWith(
				classConstructor,
				classConstructor,
				accessInstance,
				[1, 2, 3],
				undefined
			);
		});
		
		it('returns value when called against class constructor', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject, 'call').and.returnValue('Return value');
			expect(registry.callMethod(classConstructor, {}, 'myMethod', [])).toBe('Return value');
		});
		
		it('can be called when overloading other static method', function(){
			spyOn(methodObject, 'getArgumentTypes').and.returnValue(['string']);
			spyOn(methodObject2, 'getArgumentTypes').and.returnValue(['number']);
			spyOn(methodObject, 'call').and.returnValue('Type: string');
			spyOn(methodObject2, 'call').and.returnValue('Type: number');
			registry.register(methodObject2, classObject);
			expect(registry.callMethod(
				classConstructor,
				{},
				'myMethod',
				['example']
			)).toBe('Type: string');
			expect(registry.callMethod(
				classConstructor,
				{},
				'myMethod',
				[123]
			)).toBe('Type: number');
		});
		
		it('will call static method against class constructor', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'METHOD_NOT_REGISTERED',
				'Provided name: myMethod'
			);
			var registry = new ClassyJS.Registry.Member(typeRegistry, typeChecker);
			var nonStaticMethodObject = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(nonStaticMethodObject, 'getName').and.returnValue('myMethod');
			spyOn(nonStaticMethodObject, 'isStatic').and.returnValue(false);
			spyOn(nonStaticMethodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(nonStaticMethodObject, 'call');
			registry.register(nonStaticMethodObject, classObject);
			expect(function(){
				registry.callMethod(classConstructor, {}, 'myMethod', []);
			}).toThrow(expectedFatal);
			expect(nonStaticMethodObject.call).not.toHaveBeenCalled();
		});
		
		// @todo Unrecognised method
		
	});
	
	describe('event', function(){
		
		var classInstance;
		var eventObject2;
		var targetObject;
		var targetObject2;
		var targetMethodObject;
		var targetMethodObject2;
		
		beforeEach(function(){
			classInstance = {};
			eventObject2 = new ClassyJS.Member.Event(
				new ClassyJS.Member.Event.Definition('public event myEvent ()'),
				false,
				undefined,
				typeChecker,
				accessController
			);
			targetObject = {};
			targetObject2 = {};
			targetMethodObject = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			targetMethodObject2 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(eventObject, 'getName').and.returnValue('myEvent');
			spyOn(eventObject2, 'getName').and.returnValue('myEvent');
			spyOn(eventObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(eventObject2, 'getArgumentTypes').and.returnValue([]);
			spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
			spyOn(targetMethodObject, 'getName').and.returnValue('targetMethod');
			spyOn(targetMethodObject, 'isStatic').and.returnValue(false);
			spyOn(targetMethodObject, 'getArgumentTypes').and.returnValue([]);
			registry.register(targetMethodObject, classObject);
			spyOn(targetMethodObject2, 'getName').and.returnValue('otherTargetMethod');
			spyOn(targetMethodObject2, 'isStatic').and.returnValue(false);
			spyOn(targetMethodObject2, 'getArgumentTypes').and.returnValue([]);
			registry.register(targetMethodObject2, classObject);
			registry.register(eventObject, classObject);
		});
		
		it('triggers error if event with same name is already registered against class', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'EVENT_ALREADY_REGISTERED',
				'Event name: myEvent'
			);
			expect(function(){
				registry.register(eventObject2, classObject);
			}).toThrow(expectedFatal);
		});
		
		it('triggers look up of class from type registry when binding', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			registry.bindEvent(classInstance, 'myEvent', targetObject, 'targetMethod');
			expect(typeRegistry.getClass).toHaveBeenCalledWith(classInstance);
		});
		
		it('requests bind from event object when binding', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			registry.bindEvent(classInstance, 'myEvent', targetObject, 'targetMethod');
			expect(eventObject.requestBind).toHaveBeenCalledWith(classInstance, targetObject);
		});
		
		it('throws error if event object does not permit bind', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal('EVENT_BIND_NOT_PERMITTED');
			spyOn(eventObject, 'requestBind').and.returnValue(false);
			expect(function(){ registry.bindEvent(
				classInstance,
				'myEvent',
				targetObject,
				'targetMethod'
			); }).toThrow(expectedFatal);
		});
		
		it('callback method is stored and passed to event on trigger', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			spyOn(eventObject, 'trigger');
			registry.bindEvent(classInstance, 'myEvent', targetObject, 'targetMethod');
			registry.triggerEvent(classInstance, 'myEvent', []);
			expect(eventObject.trigger).toHaveBeenCalledWith(
				[
					[targetObject, targetMethodObject]
				],
				[]
			);
		});
		
		it('arguments are passed to event object on trigger', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			spyOn(eventObject, 'trigger');
			registry.bindEvent(classInstance, 'myEvent', targetObject, 'targetMethod');
			registry.triggerEvent(classInstance, 'myEvent', ['example', 123]);
			expect(eventObject.trigger).toHaveBeenCalledWith(
				[
					[targetObject, targetMethodObject]
				],
				['example', 123]
			);
		});
		
		it('can be bound and triggered when other target is already bound', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			spyOn(eventObject, 'trigger');
			registry.bindEvent(classInstance, 'myEvent', targetObject, 'targetMethod');
			registry.bindEvent(classInstance, 'myEvent', targetObject2, 'otherTargetMethod');
			registry.triggerEvent(classInstance, 'myEvent', ['example']);
			expect(eventObject.trigger).toHaveBeenCalledWith(
				[
					[targetObject, targetMethodObject],
					[targetObject2, targetMethodObject2]
				],
				['example']
			);
		});
		
		it('triggers error if method argument types do not match event', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'EVENT_TARGET_METHOD_NOT_REGISTERED',
				'Event name: myEvent; Method name: differentArgsMethod'
			);
			var targetObject3 = {};
			var targetMethodObject3 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			spyOn(targetMethodObject3, 'getName').and.returnValue('differentArgsMethod');
			spyOn(targetMethodObject3, 'isStatic').and.returnValue(false);
			spyOn(targetMethodObject3, 'getArgumentTypes').and.returnValue(['number']);
			registry.register(targetMethodObject3, classObject);
			expect(function(){
				registry.bindEvent(classInstance, 'myEvent', targetObject3, 'differentArgsMethod');
			}).toThrow(expectedFatal);
		});
		
		// @todo Unrecognised event
		
	});
	
	describe('constant', function(){
		
		var classConstructor;
		var constantObject2;
		
		beforeEach(function(){
			classConstructor = function(){};
			constantObject2 = new ClassyJS.Member.Constant(
				new ClassyJS.Member.Constant.Definition('public constant MY_CONSTANT'),
				false,
				undefined,
				typeChecker,
				accessController
			);
			spyOn(constantObject, 'getName').and.returnValue('MY_CONSTANT');
			spyOn(constantObject2, 'getName').and.returnValue('MY_CONSTANT');
			spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
			registry.register(constantObject, classObject);
		});
		
		it('triggers error if two with same name are registered against same class', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'CONSTANT_ALREADY_REGISTERED',
				'Constant name: MY_CONSTANT'
			);
			expect(function(){
				registry.register(constantObject2, classObject);
			}).toThrow(expectedFatal);
		});
		
		it('triggers error if retrieved by providing class instance', function(){
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'CONSTANT_RETRIEVED_AGAINST_CLASS_INSTANCE'
			);
			expect(function(){
				registry.getConstant(new classConstructor(), accessInstance, 'MY_CONSTANT');
			}).toThrow(expectedFatal);
		});
		
		it('can be retrieved by providing class constructor', function(){
			spyOn(constantObject, 'get');
			registry.getConstant(classConstructor, accessInstance, 'MY_CONSTANT');
			expect(constantObject.get).toHaveBeenCalled();
		});
		
		it('will return value on get', function(){
			spyOn(constantObject, 'get').and.returnValue('Value');
			expect(registry.getConstant(
				classConstructor,
				accessInstance,
				'MY_CONSTANT'
			)).toBe('Value');
			expect(constantObject.get).toHaveBeenCalledWith(classConstructor, accessInstance);
		});
		
	});
	
	describe('inherited property', function(){
		
		var childClassInstance;
		var parentClassInstance;
		var parentClassObject;
		var grandParentClassInstance;
		var grandParentClassObject;
		var propertyObject2;
		
		beforeEach(function(){
			childClassInstance = {};
			parentClassInstance = {};
			grandParentClassInstance = {};
			parentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			grandParentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			propertyObject2 = new ClassyJS.Member.Property(
				new ClassyJS.Member.Property.Definition('public myProperty (string)'),
				false,
				null,
				typeChecker,
				accessController
			);
			spyOn(propertyObject, 'getName').and.returnValue('myProperty');
			spyOn(propertyObject2, 'getName').and.returnValue('myProperty');
			spyOn(typeRegistry, 'getClass').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return classObject;
				if (classInstance === parentClassInstance) return parentClassObject;
				if (classInstance === grandParentClassInstance) return grandParentClassObject;
			});
			spyOn(typeRegistry, 'getParent').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return parentClassInstance;
				if (classInstance === parentClassInstance) return grandParentClassInstance;
			});
			spyOn(typeRegistry, 'getInstantiatedInstance').and.callFake(function(){
				return childClassInstance;
			});
			spyOn(propertyObject, 'set').and.callFake(function(one, two, value){ return value; });
			spyOn(propertyObject2, 'set').and.callFake(function(one, two, value){ return value; });
			spyOn(propertyObject, 'get').and.callFake(function(one, two, value){ return value; });
		});
		
		it('will look up parent of object if no property is found', function(){
			spyOn(propertyObject, 'getDefaultValue').and.returnValue(true);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			registry.register(propertyObject, parentClassObject);
			registry.getPropertyValue(childClassInstance, accessInstance, 'myProperty');
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassInstance);
		});
		
		it('will trigger error if non exists on self or parent', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'PROPERTY_NOT_REGISTERED',
				'Provided name: myProperty'
			);
			expect(function(){
				registry.getPropertyValue(childClassInstance, accessInstance, 'myProperty');
			}).toThrow(expectedFatal);
		});
		
		it('will set and return value when requested', function(){
			spyOn(propertyObject, 'getDefaultValue').and.returnValue(undefined);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			registry.register(propertyObject, parentClassObject);
			expect(registry.getPropertyValue(
				childClassInstance,
				accessInstance,
				'myProperty'
			)).toBe(undefined);
			registry.setPropertyValue(childClassInstance, accessInstance, 'myProperty', 'Value');
			expect(registry.getPropertyValue(
				childClassInstance,
				accessInstance,
				'myProperty'
			)).toBe('Value');
		});
		
		it('will look further up parent chain if no property is found', function(){
			spyOn(propertyObject, 'getDefaultValue').and.returnValue(undefined);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return true;
				if (classInstance === parentClassInstance) return true;
				return false;
			});
			registry.register(propertyObject, grandParentClassObject);
			registry.getPropertyValue(childClassInstance, accessInstance, 'myProperty');
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(parentClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(parentClassInstance);
		});
		
		it('will look for child properties before self', function(){
			spyOn(propertyObject, 'getDefaultValue').and.returnValue(undefined);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return true;
				if (classInstance === parentClassInstance) return true;
				return false;
			});
			parentClassInstance.parent = true;
			childClassInstance.child = true;
			registry.register(propertyObject, classObject);
			registry.register(propertyObject2, parentClassObject);
			expect(registry.getPropertyValue(
				parentClassInstance,
				accessInstance,
				'myProperty'
			)).toBe(undefined);
			registry.setPropertyValue(
				parentClassInstance,
				accessInstance,
				'myProperty',
				'Value'
			);
			expect(registry.getPropertyValue(
				parentClassInstance,
				accessInstance,
				'myProperty'
			)).toBe('Value');
			expect(propertyObject.set).toHaveBeenCalledWith(
				parentClassInstance,
				accessInstance,
				'Value'
			);
			expect(propertyObject2.set).not.toHaveBeenCalled();
		});
		
	});
	
	describe('inherited method', function(){
		
		var childClassInstance;
		var parentClassInstance;
		var parentClassObject;
		var grandParentClassInstance;
		var grandParentClassObject;
		var methodObject2;
		
		beforeEach(function(){
			childClassInstance = {};
			parentClassInstance = {};
			grandParentClassInstance = {};
			parentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			grandParentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			methodObject2 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(methodObject, 'getName').and.returnValue('myMethod');
			spyOn(methodObject2, 'getName').and.returnValue('myMethod');
			spyOn(methodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject2, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject, 'isStatic').and.returnValue(false);
			spyOn(methodObject2, 'isStatic').and.returnValue(false);
			spyOn(typeRegistry, 'getClass').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return classObject;
				if (classInstance === parentClassInstance) return parentClassObject;
				if (classInstance === grandParentClassInstance) return grandParentClassObject;
			});
			spyOn(typeRegistry, 'getParent').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return parentClassInstance;
				if (classInstance === parentClassInstance) return grandParentClassInstance;
			});
			spyOn(typeRegistry, 'getInstantiatedInstance').and.callFake(function(){
				return childClassInstance;
			});
			spyOn(methodObject, 'call').and.returnValue('Method 1 return value');
			spyOn(methodObject2, 'call').and.returnValue('Method 2 return value');
		});
		
		it('will look up parent of object if no method is found', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			registry.register(methodObject, parentClassObject);
			registry.callMethod(childClassInstance, {}, 'myMethod', []);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassInstance);
		});
		
		it('will trigger error if non exists on self or parent', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'METHOD_NOT_REGISTERED',
				'Provided name: myMethod'
			);
			expect(function(){
				registry.callMethod(childClassInstance, {}, 'myMethod', []);
			}).toThrow(expectedFatal);
		});
		
		it('will return call value when requested', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			registry.register(methodObject, parentClassObject);
			expect(registry.callMethod(
				childClassInstance,
				{},
				'myMethod',
				[]
			)).toBe('Method 1 return value');
		});
		
		it('will look further up parent chain if no method is found', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return true;
				if (classInstance === parentClassInstance) return true;
				return false;
			});
			registry.register(methodObject, grandParentClassObject);
			registry.callMethod(childClassInstance, {}, 'myMethod', []);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(parentClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(parentClassInstance);
		});
		
		xit('will look for child methods before self', function(){
			registry.register(methodObject, classObject);
			registry.register(methodObject2, parentClassObject);
			expect(registry.callMethod(
				parentClassInstance,
				accessInstance,
				'myMethod',
				[]
			)).toBe('Method 1 return value');
			expect(methodObject.call).toHaveBeenCalledWith(
				parentClassInstance,
				childClassInstance, // ???????
				accessInstance,
				[],
				{ parent: grandParentClassInstance }
			);
			expect(methodObject2.call).not.toHaveBeenCalled();
		});
		
		it('retains child as call target when calling parent method', function(){
			methodObject = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			spyOn(methodObject, 'call').and.callFake(function(callTarget){
				expect(callTarget).toBe(childClassInstance);
			});
			registry.register(methodObject, parentClassObject);
			registry.callMethod(
				childClassInstance,
				{},
				'myMethod',
				[]
			);
		});
		
		it('passes parent object as scope variable when calling child method', function(){
			methodObject = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			registry.register(methodObject, parentClassObject);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			spyOn(methodObject, 'call');
			registry.callMethod(
				childClassInstance,
				{},
				'myMethod',
				[]
			);
			expect(methodObject.call).toHaveBeenCalledWith(
				childClassInstance,
				parentClassInstance,
				accessInstance,
				[],
				{ parent: parentClassInstance }
			);
		});
		
	});
	
	describe('inherited static method', function(){
		
		var childClassInstance;
		var parentClassInstance;
		var parentClassObject;
		var grandParentClassInstance;
		var grandParentClassObject;
		var methodObject2;
		
		beforeEach(function(){
			childClassConstructor = function(){};
			parentClassConstructor = function(){};
			grandParentClassConstructor = function(){};
			parentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			grandParentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			methodObject2 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(methodObject, 'getName').and.returnValue('myMethod');
			spyOn(methodObject2, 'getName').and.returnValue('myMethod');
			spyOn(methodObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject2, 'getArgumentTypes').and.returnValue([]);
			spyOn(methodObject, 'isStatic').and.returnValue(true);
			spyOn(methodObject2, 'isStatic').and.returnValue(true);
			spyOn(typeRegistry, 'getClass').and.callFake(function(classConstructor){
				if (classConstructor === childClassConstructor) return classObject;
				if (classConstructor === parentClassConstructor) return parentClassObject;
				if (classConstructor === grandParentClassConstructor) return grandParentClassObject;
			});
			spyOn(typeRegistry, 'getParent').and.callFake(function(classConstructor){
				if (classConstructor === childClassConstructor) return parentClassConstructor;
				if (classConstructor === parentClassConstructor) return grandParentClassConstructor;
			});
			spyOn(typeRegistry, 'getInstantiatedInstance');
			expect(typeRegistry.getInstantiatedInstance).not.toHaveBeenCalled();
			spyOn(methodObject, 'call').and.returnValue('Method 1 return value');
			spyOn(methodObject2, 'call').and.returnValue('Method 2 return value');
		});
		
		it('will look up parent of class if no method is found', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				return (classConstructor === childClassConstructor) ? true : false;
			});
			registry.register(methodObject, parentClassObject);
			registry.callMethod(childClassConstructor, {}, 'myMethod', []);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassConstructor);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassConstructor);
		});
		
		it('will trigger error if non exists on self or parent', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				return (classConstructor === childClassConstructor) ? true : false;
			});
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'METHOD_NOT_REGISTERED',
				'Provided name: myMethod'
			);
			expect(function(){
				registry.callMethod(childClassConstructor, {}, 'myMethod', []);
			}).toThrow(expectedFatal);
		});
		
		it('will return call value when requested', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				return (classConstructor === childClassConstructor) ? true : false;
			});
			registry.register(methodObject, parentClassObject);
			expect(registry.callMethod(
				childClassConstructor,
				{},
				'myMethod',
				[]
			)).toBe('Method 1 return value');
		});
		
		it('will look further up parent chain if no method is found', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				if (classConstructor === childClassConstructor) return true;
				if (classConstructor === parentClassConstructor) return true;
				return false;
			});
			registry.register(methodObject, grandParentClassObject);
			registry.callMethod(childClassConstructor, {}, 'myMethod', []);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassConstructor);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassConstructor);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(parentClassConstructor);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(parentClassConstructor);
		});
		
		it('will not look for child methods before self', function(){
			registry.register(methodObject, classObject);
			registry.register(methodObject2, parentClassObject);
			expect(registry.callMethod(
				parentClassConstructor,
				accessInstance,
				'myMethod',
				[]
			)).toBe('Method 2 return value');
			expect(methodObject.call).not.toHaveBeenCalled();
			expect(methodObject2.call).toHaveBeenCalledWith(
				parentClassConstructor,
				parentClassConstructor,
				accessInstance,
				[],
				{ parent: grandParentClassConstructor }
			);
		});
		
	});
	
	describe('inherited event', function(){
		
		var childClassInstance;
		var parentClassInstance;
		var parentClassObject;
		var grandParentClassInstance;
		var grandParentClassObject;
		var eventObject2;
		var targetObject;
		var targetMethodObject;
		var targetMethodObject2;
		
		beforeEach(function(){
			childClassInstance = {};
			parentClassInstance = {};
			grandParentClassInstance = {};
			parentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			grandParentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			eventObject2 = new ClassyJS.Member.Event(
				new ClassyJS.Member.Event.Definition('public event myEvent ()'),
				false,
				undefined,
				typeChecker,
				accessController
			);
			targetObject = {};
			targetMethodObject = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			targetMethodObject2 = new ClassyJS.Member.Method(
				new ClassyJS.Member.Method.Definition('public myMethod () -> undefined'),
				false,
				function(){},
				typeChecker,
				accessController
			);
			spyOn(eventObject, 'getName').and.returnValue('myEvent');
			spyOn(eventObject2, 'getName').and.returnValue('myEvent');
			spyOn(eventObject, 'getArgumentTypes').and.returnValue([]);
			spyOn(eventObject2, 'getArgumentTypes').and.returnValue(['string']);
			spyOn(targetMethodObject, 'getName').and.returnValue('targetMethod');
			spyOn(targetMethodObject, 'isStatic').and.returnValue(false);
			spyOn(targetMethodObject, 'getArgumentTypes').and.returnValue([]);
			registry.register(targetMethodObject, classObject);
			spyOn(targetMethodObject2, 'getName').and.returnValue('targetMethod');
			spyOn(targetMethodObject2, 'isStatic').and.returnValue(false);
			spyOn(targetMethodObject2, 'getArgumentTypes').and.returnValue(['string']);
			registry.register(targetMethodObject2, classObject);
			spyOn(typeRegistry, 'getClass').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return classObject;
				if (classInstance === parentClassInstance) return parentClassObject;
				if (classInstance === grandParentClassInstance) return grandParentClassObject;
				if (classInstance === targetObject) return classObject;
			});
			spyOn(typeRegistry, 'getParent').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return parentClassInstance;
				if (classInstance === parentClassInstance) return grandParentClassInstance;
			});
			spyOn(typeRegistry, 'getInstantiatedInstance').and.callFake(function(){
				return childClassInstance;
			});
		});
		
		it('will look up parent of object if no event is found', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			registry.register(eventObject, parentClassObject);
			registry.bindEvent(childClassInstance, 'myEvent', targetObject, 'targetMethod');
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassInstance);
		});
		
		it('will trigger error if non exists on self or parent', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'EVENT_NOT_REGISTERED',
				'Provided name: myEvent'
			);
			expect(function(){
				registry.bindEvent(childClassInstance, 'myEvent', targetObject, 'targetMethod');
			}).toThrow(expectedFatal);
		});
		
		it('will call event object when triggered with callbacks', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				return (classInstance === childClassInstance) ? true : false;
			});
			registry.register(eventObject, parentClassObject);
			registry.bindEvent(childClassInstance, 'myEvent', targetObject, 'targetMethod');
			spyOn(eventObject, 'trigger');
			registry.triggerEvent(childClassInstance, 'myEvent', []);
			expect(eventObject.trigger).toHaveBeenCalledWith(
				[
					[targetObject, targetMethodObject]
				],
				[]
			);
		});
		
		it('will look further up parent chain if no event is found', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classInstance){
				if (classInstance === childClassInstance) return true;
				if (classInstance === parentClassInstance) return true;
				return false;
			});
			registry.register(eventObject, grandParentClassObject);
			registry.bindEvent(childClassInstance, 'myEvent', targetObject, 'targetMethod');
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassInstance);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(parentClassInstance);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(parentClassInstance);
		});
		
		it('will look for child events before self on trigger', function(){
			spyOn(eventObject, 'requestBind').and.returnValue(true);
			registry.register(eventObject, classObject);
			registry.register(eventObject2, parentClassObject);
			registry.bindEvent(parentClassInstance, 'myEvent', targetObject, 'targetMethod');
			spyOn(eventObject, 'trigger');
			registry.triggerEvent(parentClassInstance, 'myEvent', []);
			expect(eventObject.trigger).toHaveBeenCalledWith(
				[
					[targetObject, targetMethodObject]
				],
				[]
			);
		});
		
	});
	
	describe('inherited constant', function(){
		
		var childClassInstance;
		var parentClassInstance;
		var parentClassObject;
		var grandParentClassInstance;
		var grandParentClassObject;
		var constantObject2;
		
		beforeEach(function(){
			childClassConstructor = function(){};
			parentClassConstructor = function(){};
			grandParentClassConstructor = function(){};
			parentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			grandParentClassObject = new ClassyJS.Type.Class(
				new ClassyJS.Type.Class.Definition('class MyClass'),
				new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
				new ClassyJS.Registry.Member(
					new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager()),
					new ClassyJS.TypeChecker()
				),
				new ClassyJS.NamespaceManager()
			);
			constantObject2 = new ClassyJS.Member.Constant(
				new ClassyJS.Member.Constant.Definition('public constant MY_CONSTANT'),
				false,
				undefined,
				typeChecker,
				accessController
			);
			spyOn(constantObject, 'getName').and.returnValue('MY_CONSTANT');
			spyOn(constantObject2, 'getName').and.returnValue('MY_CONSTANT');
			spyOn(typeRegistry, 'getClass').and.callFake(function(classConstructor){
				if (classConstructor === childClassConstructor) return classObject;
				if (classConstructor === parentClassConstructor) return parentClassObject;
				if (classConstructor === grandParentClassConstructor) return grandParentClassObject;
			});
			spyOn(typeRegistry, 'getParent').and.callFake(function(classConstructor){
				if (classConstructor === childClassConstructor) return parentClassConstructor;
				if (classConstructor === parentClassConstructor) return grandParentClassConstructor;
			});
			spyOn(typeRegistry, 'getInstantiatedInstance');
			expect(typeRegistry.getInstantiatedInstance).not.toHaveBeenCalled();
			spyOn(constantObject, 'get').and.returnValue('Constant 1 value');
			spyOn(constantObject2, 'get').and.returnValue('Constant 2 value');
		});
		
		it('will look up parent of class if no constant is found', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				return (classConstructor === childClassConstructor) ? true : false;
			});
			registry.register(constantObject, parentClassObject);
			registry.getConstant(childClassConstructor, accessInstance, 'MY_CONSTANT');
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassConstructor);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassConstructor);
		});
		
		it('will trigger error if non exists on self or parent', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				return (classConstructor === childClassConstructor) ? true : false;
			});
			var expectedFatal = new ClassyJS.Registry.Member.Fatal(
				'CONSTANT_NOT_REGISTERED',
				'Provided name: MY_CONSTANT'
			);
			expect(function(){
				registry.getConstant(childClassConstructor, accessInstance, 'MY_CONSTANT');
			}).toThrow(expectedFatal);
		});
		
		it('will return call value when requested', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				return (classConstructor === childClassConstructor) ? true : false;
			});
			registry.register(constantObject, parentClassObject);
			expect(registry.getConstant(
				childClassConstructor,
				accessInstance,
				'MY_CONSTANT'
			)).toBe('Constant 1 value');
		});
		
		it('will look further up parent chain if no constant is found', function(){
			spyOn(typeRegistry, 'hasParent').and.callFake(function(classConstructor){
				if (classConstructor === childClassConstructor) return true;
				if (classConstructor === parentClassConstructor) return true;
				return false;
			});
			registry.register(constantObject, grandParentClassObject);
			registry.getConstant(childClassConstructor, accessInstance, 'MY_CONSTANT');
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(childClassConstructor);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(childClassConstructor);
			expect(typeRegistry.hasParent).toHaveBeenCalledWith(parentClassConstructor);
			expect(typeRegistry.getParent).toHaveBeenCalledWith(parentClassConstructor);
		});
		
		it('will not look for child constants before self', function(){
			registry.register(constantObject, classObject);
			registry.register(constantObject2, parentClassObject);
			expect(registry.getConstant(
				parentClassConstructor,
				accessInstance,
				'MY_CONSTANT'
			)).toBe('Constant 2 value');
			expect(constantObject.get).not.toHaveBeenCalled();
			expect(constantObject2.get).toHaveBeenCalledWith(
				parentClassConstructor,
				accessInstance
			);
		});
		
	});
	
});
