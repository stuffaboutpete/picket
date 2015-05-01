describe('Reflection.Class', function(){
	
	// @todo Allow getting of static methods
	
	var mocker;
	var originalInstantiator;
	var reflectionFactory;
	var namespaceManager;
	var typeRegistry;
	var memberRegistry;
	var classObject;
	var classConstructor;
	var propertyObject;
	var methodObject;
	var eventObject;
	var constantObject;
	var reflectionProperty;
	var reflectionMethod;
	var reflectionEvent;
	var reflectionConstant;
	var reflectionProperty2;
	var reflectionMethod2;
	var reflectionEvent2;
	var reflectionConstant2;
	var interfaceObject;
	
	beforeEach(function(){
		mocker = new ClassyJS.Mocker();
		originalInstantiator = ClassyJS._instantiator;
		ClassyJS._instantiator = mocker.getMock(ClassyJS.Instantiator);
		reflectionFactory = mocker.getMock(ClassyJS.Reflection.Factory);
		namespaceManager = mocker.getMock(ClassyJS.NamespaceManager);
		typeRegistry = mocker.getMock(ClassyJS.Registry.Type);
		memberRegistry = mocker.getMock(ClassyJS.Registry.Member);
		classObject = mocker.getMock(ClassyJS.Type.Class);
		classConstructor = function(){ this.arguments = arguments; };
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(classConstructor);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		propertyObject = mocker.getMock(ClassyJS.Member.Property);
		methodObject = mocker.getMock(ClassyJS.Member.Method);
		eventObject = mocker.getMock(ClassyJS.Member.Event);
		constantObject = mocker.getMock(ClassyJS.Member.Constant);
		reflectionProperty = mocker.getMock(Reflection.Property);
		reflectionMethod = mocker.getMock(Reflection.Method);
		reflectionEvent = mocker.getMock(Reflection.Event);
		reflectionConstant = mocker.getMock(Reflection.Constant);
		reflectionProperty2 = mocker.getMock(Reflection.Property);
		reflectionMethod2 = mocker.getMock(Reflection.Method);
		reflectionEvent2 = mocker.getMock(Reflection.Event);
		reflectionConstant2 = mocker.getMock(Reflection.Constant);
		interfaceObject = mocker.getMock(ClassyJS.Type.Interface);
		spyOn(ClassyJS._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(ClassyJS._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(ClassyJS._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
		spyOn(ClassyJS._instantiator, 'getNamespaceManager').and.returnValue(namespaceManager);
	});
	
	afterEach(function(){
		ClassyJS._instantiator = originalInstantiator;
	});
	
	it('instantiation with a string looks up namespace and gets class object', function(){
		new Reflection.Class('Example');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('Example');
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a constructor function gets class object', function(){
		new Reflection.Class(classConstructor);
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a class instance gets class object', function(){
		var instance = new classConstructor();
		new Reflection.Class(instance);
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(instance);
	});
	
	it('throws error if type registry indicates class does not exist', function(){
		var expectedFatal = new ClassyJS.Reflection.Class.Fatal('CLASS_DOES_NOT_EXIST');
		spyOn(typeRegistry, 'classExists').and.returnValue(false);
		expect(function(){ new Reflection.Class('NonClass'); }).toThrow(expectedFatal);
	});
	
	it('throws error if non string, object or function is provided', function(){
		var expectedFatal = new ClassyJS.Reflection.Class.Fatal(
			'INVALID_IDENTIFIER_PROVIDED',
			'Provided type: number'
		);
		expect(function(){ new Reflection.Class(123); }).toThrow(expectedFatal);
	});
	
	it('will return class name from class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		expect(reflectionClass.getName()).toBe('My.Class');
		expect(classObject.getName).toHaveBeenCalledWith();
	});
	
	it('will indicate if class has a parent class', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'isExtension').and.returnValue(true);
		expect(reflectionClass.hasParent()).toBe(true);
		expect(classObject.isExtension).toHaveBeenCalledWith();
	});
	
	it('will return parent reflection class', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		var reflectionClass2 = new Reflection.Class('Parent.Class');
		spyOn(classObject, 'isExtension').and.returnValue(true);
		spyOn(classObject, 'getParentClass').and.returnValue('Parent.Class');
		spyOn(reflectionFactory, 'buildClass').and.returnValue(reflectionClass2);
		expect(reflectionClass.getParent()).toBe(reflectionClass2);
		expect(classObject.getParentClass).toHaveBeenCalledWith();
		expect(reflectionFactory.buildClass).toHaveBeenCalledWith('Parent.Class');
	});
	
	it('will return an array of class members from member registry via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			constantObject
		]);
		spyOn(propertyObject, 'getName').and.returnValue('myProperty');
		spyOn(methodObject, 'getName').and.returnValue('myMethod');
		spyOn(eventObject, 'getName').and.returnValue('myEvent');
		spyOn(constantObject, 'getName').and.returnValue('myConstant');
		spyOn(reflectionFactory, 'buildProperty').and.returnValue(reflectionProperty);
		spyOn(reflectionFactory, 'buildMethod').and.returnValue(reflectionMethod);
		spyOn(reflectionFactory, 'buildEvent').and.returnValue(reflectionEvent);
		spyOn(reflectionFactory, 'buildConstant').and.returnValue(reflectionConstant);
		var members = reflectionClass.getMembers();
		expect(members.length).toBe(4);
		expect(members[0]).toBe(reflectionProperty);
		expect(members[1]).toBe(reflectionMethod);
		expect(members[2]).toBe(reflectionEvent);
		expect(members[3]).toBe(reflectionConstant);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(reflectionFactory.buildProperty).toHaveBeenCalledWith(
			'My.Class',
			'myProperty'
		);
		expect(reflectionFactory.buildMethod).toHaveBeenCalledWith(
			'My.Class',
			'myMethod'
		);
		expect(reflectionFactory.buildEvent).toHaveBeenCalledWith(
			'My.Class',
			'myEvent'
		);
		expect(reflectionFactory.buildConstant).toHaveBeenCalledWith(
			'My.Class',
			'myConstant'
		);
	});
	
	it('will return an array of class properties from member registry via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			constantObject,
			propertyObject
		]);
		var propertyNameCall = -1;
		spyOn(propertyObject, 'getName').and.callFake(function(){
			propertyNameCall++;
			if (propertyNameCall == 0) {
				return 'myProperty';
			} else if (propertyNameCall == 1) {
				return 'myOtherProperty';
			}
		});
		var buildPropertyCall = -1;
		spyOn(reflectionFactory, 'buildProperty').and.callFake(function(){
			buildPropertyCall++;
			if (buildPropertyCall == 0) {
				return reflectionProperty;
			} else if (buildPropertyCall == 1) {
				return reflectionProperty2;
			}
		});
		spyOn(reflectionFactory, 'buildMethod');
		spyOn(reflectionFactory, 'buildEvent');
		spyOn(reflectionFactory, 'buildConstant');
		var properties = reflectionClass.getProperties();
		expect(properties.length).toBe(2);
		expect(properties[0]).toBe(reflectionProperty);
		expect(properties[1]).toBe(reflectionProperty2);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(reflectionFactory.buildProperty.calls.count()).toBe(2);
		expect(reflectionFactory.buildProperty.calls.argsFor(0)).toEqual([
			'My.Class',
			'myProperty']);
		expect(reflectionFactory.buildProperty.calls.argsFor(1)).toEqual([
			'My.Class',
			'myOtherProperty']);
		expect(reflectionFactory.buildMethod).not.toHaveBeenCalled();
		expect(reflectionFactory.buildEvent).not.toHaveBeenCalled();
		expect(reflectionFactory.buildConstant).not.toHaveBeenCalled();
	});
	
	it('will return an array of class methods from member registry via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			constantObject,
			methodObject
		]);
		var methodNameCall = -1;
		spyOn(methodObject, 'getName').and.callFake(function(){
			methodNameCall++;
			if (methodNameCall == 0) {
				return 'myMethod';
			} else if (methodNameCall == 1) {
				return 'myOtherMethod';
			}
		});
		var buildMethodCall = -1;
		spyOn(reflectionFactory, 'buildMethod').and.callFake(function(){
			buildMethodCall++;
			if (buildMethodCall == 0) {
				return reflectionMethod;
			} else if (buildMethodCall == 1) {
				return reflectionMethod2;
			}
		});
		spyOn(reflectionFactory, 'buildProperty');
		spyOn(reflectionFactory, 'buildEvent');
		spyOn(reflectionFactory, 'buildConstant');
		var members = reflectionClass.getMethods();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionMethod);
		expect(members[1]).toBe(reflectionMethod2);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(reflectionFactory.buildMethod.calls.count()).toBe(2);
		expect(reflectionFactory.buildMethod.calls.argsFor(0)).toEqual([
			'My.Class',
			'myMethod'
		]);
		expect(reflectionFactory.buildMethod.calls.argsFor(1)).toEqual([
			'My.Class',
			'myOtherMethod'
		]);
		expect(reflectionFactory.buildProperty).not.toHaveBeenCalled();
		expect(reflectionFactory.buildEvent).not.toHaveBeenCalled();
		expect(reflectionFactory.buildConstant).not.toHaveBeenCalled();
	});
	
	it('will return an array of class events from member registry via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			constantObject,
			eventObject
		]);
		var eventNameCall = -1;
		spyOn(eventObject, 'getName').and.callFake(function(){
			eventNameCall++;
			if (eventNameCall == 0) {
				return 'myEvent';
			} else if (eventNameCall == 1) {
				return 'myOtherEvent';
			}
		});
		var buildEventCall = -1;
		spyOn(reflectionFactory, 'buildEvent').and.callFake(function(){
			buildEventCall++;
			if (buildEventCall == 0) {
				return reflectionEvent;
			} else if (buildEventCall == 1) {
				return reflectionEvent2;
			}
		});
		spyOn(reflectionFactory, 'buildProperty');
		spyOn(reflectionFactory, 'buildMethod');
		spyOn(reflectionFactory, 'buildConstant');
		var members = reflectionClass.getEvents();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionEvent);
		expect(members[1]).toBe(reflectionEvent2);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(reflectionFactory.buildEvent.calls.count()).toBe(2);
		expect(reflectionFactory.buildEvent.calls.argsFor(0)).toEqual([
			'My.Class',
			'myEvent'
		]);
		expect(reflectionFactory.buildEvent.calls.argsFor(1)).toEqual([
			'My.Class',
			'myOtherEvent'
		]);
		expect(reflectionFactory.buildProperty).not.toHaveBeenCalled();
		expect(reflectionFactory.buildMethod).not.toHaveBeenCalled();
		expect(reflectionFactory.buildConstant).not.toHaveBeenCalled();
	});
	
	it('will return an array of class constants from member registry via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			constantObject,
			constantObject
		]);
		var constantNameCall = -1;
		spyOn(constantObject, 'getName').and.callFake(function(){
			constantNameCall++;
			if (constantNameCall == 0) {
				return 'myConstant';
			} else if (constantNameCall == 1) {
				return 'myOtherConstant';
			}
		});
		var buildConstantCall = -1;
		spyOn(reflectionFactory, 'buildConstant').and.callFake(function(){
			buildConstantCall++;
			if (buildConstantCall == 0) {
				return reflectionConstant;
			} else if (buildConstantCall == 1) {
				return reflectionConstant2;
			}
		});
		spyOn(reflectionFactory, 'buildProperty');
		spyOn(reflectionFactory, 'buildMethod');
		spyOn(reflectionFactory, 'buildEvent');
		var members = reflectionClass.getConstants();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionConstant);
		expect(members[1]).toBe(reflectionConstant2);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(reflectionFactory.buildConstant.calls.count()).toBe(2);
		expect(reflectionFactory.buildConstant.calls.argsFor(0)).toEqual([
			'My.Class',
			'myConstant'
		]);
		expect(reflectionFactory.buildConstant.calls.argsFor(1)).toEqual([
			'My.Class',
			'myOtherConstant'
		]);
		expect(reflectionFactory.buildProperty).not.toHaveBeenCalled();
		expect(reflectionFactory.buildMethod).not.toHaveBeenCalled();
		expect(reflectionFactory.buildEvent).not.toHaveBeenCalled();
	});
	
	it('will return a named reflection property', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			propertyObject
		]);
		spyOn(reflectionFactory, 'buildProperty').and.returnValue(reflectionProperty);
		var propertyNameCall = -1;
		spyOn(propertyObject, 'getName').and.callFake(function(){
			propertyNameCall++;
			if (propertyNameCall == 0 || propertyNameCall == 2) {
				return 'example';
			} else if (propertyNameCall == 1) {
				return 'notExample';
			}
		});
		var property = reflectionClass.getProperty('example');
		expect(property).toBe(reflectionProperty);
		expect(propertyObject.getName.calls.count()).toBe(3);
		expect(reflectionFactory.buildProperty.calls.count()).toBe(1);
	});
	
	it('will return named reflection methods', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			methodObject
		]);
		spyOn(reflectionFactory, 'buildMethod').and.returnValue(reflectionMethod);
		var methodNameCall = -1;
		spyOn(methodObject, 'getName').and.callFake(function(){
			methodNameCall++;
			if (methodNameCall == 0 || methodNameCall == 2) {
				return 'example';
			} else if (methodNameCall == 1) {
				return 'notExample';
			}
		});
		var members = reflectionClass.getMethods('example');
		expect(members.length).toBe(1);
		expect(members[0]).toBe(reflectionMethod);
		expect(methodObject.getName.calls.count()).toBe(3);
		expect(reflectionFactory.buildMethod.calls.count()).toBe(1);
	});
	
	it('will return a named reflection event', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			eventObject,
			eventObject
		]);
		spyOn(reflectionFactory, 'buildEvent').and.returnValue(reflectionEvent);
		var eventNameCall = -1;
		spyOn(eventObject, 'getName').and.callFake(function(){
			eventNameCall++;
			if (eventNameCall == 0 || eventNameCall == 2) {
				return 'example';
			} else if (eventNameCall == 1) {
				return 'notExample';
			}
		});
		var event = reflectionClass.getEvent('example');
		expect(event).toBe(reflectionEvent);
		expect(eventObject.getName.calls.count()).toBe(3);
		expect(reflectionFactory.buildEvent.calls.count()).toBe(1);
	});
	
	it('will return a named reflection constant', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			constantObject,
			constantObject
		]);
		spyOn(reflectionFactory, 'buildConstant').and.returnValue(reflectionConstant);
		var constantNameCall = -1;
		spyOn(constantObject, 'getName').and.callFake(function(){
			constantNameCall++;
			if (constantNameCall == 0 || constantNameCall == 2) {
				return 'example';
			} else if (constantNameCall == 1) {
				return 'notExample';
			}
		});
		var constant = reflectionClass.getConstant('example');
		expect(constant).toBe(reflectionConstant);
		expect(constantObject.getName.calls.count()).toBe(3);
		expect(reflectionFactory.buildConstant.calls.count()).toBe(1);
	});
	
	it('will return array of interfaces via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		var reflectionInterface = mocker.getMock(Reflection.Interface);
		var reflectionInterface2 = new mocker.getMock(Reflection.Interface);
		spyOn(classObject, 'getInterfaces').and.returnValue(['IInterfaceOne', 'IInterfaceTwo']);
		var buildInterfaceCall = -1;
		spyOn(reflectionFactory, 'buildInterface').and.callFake(function(){
			buildInterfaceCall++;
			if (buildInterfaceCall == 0) {
				return reflectionInterface;
			} else if (buildInterfaceCall == 1) {
				return reflectionInterface2;
			}
		});
		expect(reflectionClass.getInterfaces()).toEqual([
			reflectionInterface,
			reflectionInterface2
		]);
		expect(classObject.getInterfaces).toHaveBeenCalledWith();
		expect(reflectionFactory.buildInterface.calls.count()).toBe(2);
		expect(reflectionFactory.buildInterface.calls.argsFor(0)).toEqual(['IInterfaceOne']);
		expect(reflectionFactory.buildInterface.calls.argsFor(1)).toEqual(['IInterfaceTwo']);
	});
	
	it('determines if a class implements an interface', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var interfaceObject1 = mocker.getMock(ClassyJS.Type.Interface);
		var interfaceObject2 = mocker.getMock(ClassyJS.Type.Interface);
		spyOn(typeRegistry, 'getInterfacesFromClass').and.returnValue([
			interfaceObject1,
			interfaceObject2
		]);
		spyOn(interfaceObject1, 'getName').and.returnValue('My.IInterfaceOne');
		spyOn(interfaceObject2, 'getName').and.returnValue('My.IInterfaceTwo');
		var reflectionClass = new Reflection.Class('My.Class');
		expect(reflectionClass.implementsInterface('My.IInterfaceOne')).toBe(true);
		expect(reflectionClass.implementsInterface('My.IInterfaceTwo')).toBe(true);
		expect(reflectionClass.implementsInterface('My.IInterfaceThree˙')).toBe(false);
		expect(typeRegistry.getInterfacesFromClass).toHaveBeenCalledWith(classObject);
	});
	
	it('will indicate if class is explicitly abstract', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'requestInstantiation').and.throwError(
			new ClassyJS.Type.Class.Fatal('CANNOT_INSTANTIATE_ABSTRACT_CLASS')
		);
		expect(reflectionClass.isAbstract()).toBe(true);
		expect(reflectionClass.isExplicitAbstract()).toBe(true);
		expect(reflectionClass.isImplicitAbstract()).toBe(false);
	});
	
	it('will indicate if class is implicitly abstract', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'requestInstantiation').and.throwError(
			new ClassyJS.Type.Class.Fatal('CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS')
		);
		expect(reflectionClass.isAbstract()).toBe(true);
		expect(reflectionClass.isExplicitAbstract()).toBe(false);
		expect(reflectionClass.isImplicitAbstract()).toBe(true);
	});
	
	it('will indicate if class is not abstract', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'requestInstantiation').and.callFake(function(){});
		expect(reflectionClass.isAbstract()).toBe(false);
		expect(reflectionClass.isExplicitAbstract()).toBe(false);
		expect(reflectionClass.isImplicitAbstract()).toBe(false);
	});
	
	it('allows a new instance to be created', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var instance = reflectionClass.createNew();
		expect(instance instanceof classConstructor).toBe(true);
		expect(namespaceManager.getNamespaceObject.calls.mostRecent().args[0]).toBe('My.Class');
	});
	
	it('allows a new instance to be created with arguments', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var firstArg = {};
		var secondArg = {};
		var instance = reflectionClass.createNew(firstArg, secondArg);
		expect(instance.arguments.length).toBe(2);
		expect(instance.arguments[0]).toBe(firstArg);
		expect(instance.arguments[1]).toBe(secondArg);
	});
	
	it('allows mock to be created using constructor from namespace manager', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([]);
		spyOn(typeRegistry, 'registerMock');
		var mock = reflectionClass.getMock();
		expect(mock instanceof classConstructor).toBe(true);
		expect(namespaceManager.getNamespaceObject.calls.mostRecent().args[0]).toBe('My.Class');
		expect(typeRegistry.registerMock).toHaveBeenCalledWith(mock, classObject);
	});
	
	it('ensures that methods and properties exist on mocked class but do nothing', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClass = new Reflection.Class('My.Class');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject
		]);
		spyOn(propertyObject, 'getName').and.returnValue('myProperty');
		spyOn(methodObject, 'getName').and.returnValue('myMethod');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		spyOn(typeRegistry, 'registerMock');
		var mock = reflectionClass.getMock();
		expect(typeof mock.myProperty).toBe('function');
		expect(typeof mock.myMethod).toBe('function');
		expect(mock.myProperty()).toBe(undefined);
		expect(mock.myMethod()).toBe(undefined);
	});
	
});
