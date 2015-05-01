describe('Reflection.Method', function(){
	
	var mocker;
	var originalInstantiator;
	var reflectionFactory;
	var namespaceManager;
	var typeRegistry;
	var memberRegistry;
	var classObject;
	var methodObject;
	var classConstructor;
	
	beforeEach(function(){
		mocker = new ClassyJS.Mocker();
		originalInstantiator = ClassyJS._instantiator;
		ClassyJS._instantiator = mocker.getMock(ClassyJS.Instantiator);
		reflectionFactory = mocker.getMock(ClassyJS.Reflection.Factory);
		namespaceManager = mocker.getMock(ClassyJS.NamespaceManager);
		typeRegistry = mocker.getMock(ClassyJS.Registry.Type);
		memberRegistry = mocker.getMock(ClassyJS.Registry.Member);
		classObject = mocker.getMock(ClassyJS.Type.Class);
		methodObject = mocker.getMock(ClassyJS.Member.Method);
		classConstructor = function(){};
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(classConstructor);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(ClassyJS._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(ClassyJS._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(ClassyJS._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
		spyOn(ClassyJS._instantiator, 'getNamespaceManager').and.returnValue(namespaceManager);
	});
	
	afterEach(function(){
		ClassyJS._instantiator = originalInstantiator;
	});
	
	it('instantiation with a string class looks up namespace and gets class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('methodName');
		new Reflection.Method('Example', 'methodName');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('Example');
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a constructor function gets class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('methodName');
		new Reflection.Method(classConstructor, 'methodName');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a class instance gets class object', function(){
		var instance = new classConstructor();
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('methodName');
		new Reflection.Method(instance, 'methodName');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(instance);
	});
	
	it('throws error if type registry indicates class does not exist', function(){
		var expectedFatal = new ClassyJS.Reflection.Method.Fatal('CLASS_DOES_NOT_EXIST');
		spyOn(typeRegistry, 'classExists').and.returnValue(false);
		expect(function(){
			new Reflection.Method('NonClass', 'methodName');
		}).toThrow(expectedFatal);
	});
	
	it('throws error if non string, object or function is provided', function(){
		var expectedFatal = new ClassyJS.Reflection.Method.Fatal(
			'INVALID_IDENTIFIER_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Method(123, 'methodName'); }).toThrow(expectedFatal);
	});
	
	it('throws error if non-string method name is provided', function(){
		var expectedFatal = new ClassyJS.Reflection.Method.Fatal(
			'NON_STRING_METHOD_NAME_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Method('Example', 123); }).toThrow(expectedFatal);
	});
	
	it('throws error if no method of given name is found', function(){
		var expectedFatal = new ClassyJS.Reflection.Method.Fatal(
			'METHOD_DOES_NOT_EXIST',
			'Method name: methodName'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			methodObject
		]);
		var methodNameCall = -1;
		spyOn(methodObject, 'getName').and.callFake(function(){
			methodNameCall++;
			if (methodNameCall == 0) {
				return 'otherMethodName';
			} else if (methodNameCall == 1) {
				return 'differentMethodName';
			}
		});
		expect(function(){
			new Reflection.Method('Example', 'methodName');
		}).toThrow(expectedFatal);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
	});
	
	it('returns name from method object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('methodName');
		var reflectionMethod = new Reflection.Method('My.Class', 'methodName');
		expect(reflectionMethod.getName()).toBe('methodName');
	});
	
	it('returns reflection argument objects via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('methodName');
		spyOn(methodObject, 'getArgumentTypeIdentifiers').and.returnValue(['string', 'number']);
		var reflectionMethod = new Reflection.Method('My.Class', 'methodName');
		var reflectionArgument = mocker.getMock(Reflection.Argument);
		var optionalCallIndex = -1;
		spyOn(methodObject, 'argumentIsOptional').and.callFake(function(){
			optionalCallIndex++;
			if (optionalCallIndex == 0) {
				return false;
			} else if (optionalCallIndex == 1) {
				return true;
			}
		});
		spyOn(methodObject, 'getDefaultArgumentValue').and.returnValue(10);
		spyOn(reflectionFactory, 'buildArgument').and.returnValue(reflectionArgument);
		expect(reflectionMethod.getArguments()).toEqual([reflectionArgument, reflectionArgument]);
		expect(reflectionFactory.buildArgument.calls.count()).toBe(2);
		expect(reflectionFactory.buildArgument.calls.argsFor(0)).toEqual([
			'string',
			false,
			undefined,
			reflectionMethod
		]);
		expect(reflectionFactory.buildArgument.calls.argsFor(1)).toEqual([
			'number',
			true,
			10,
			reflectionMethod
		]);
		expect(methodObject.argumentIsOptional.calls.count()).toBe(2);
		expect(methodObject.argumentIsOptional.calls.argsFor(0)).toEqual([0]);
		expect(methodObject.argumentIsOptional.calls.argsFor(1)).toEqual([1]);
		expect(methodObject.getDefaultArgumentValue.calls.count()).toBe(1);
		expect(methodObject.getDefaultArgumentValue.calls.argsFor(0)).toEqual([1]);
	});
	
	it('returns access type object via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('methodName');
		spyOn(methodObject, 'getAccessTypeIdentifier').and.returnValue('public');
		var reflectionMethod = new Reflection.Method('My.Class', 'methodName');
		var reflectionAccessType = new Reflection.AccessType();
		spyOn(reflectionFactory, 'buildAccessType').and.returnValue(reflectionAccessType);
		expect(reflectionMethod.getAccessType()).toBe(reflectionAccessType);
		expect(reflectionFactory.buildAccessType).toHaveBeenCalledWith('public');
	});
	
	it('returns reflection class via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('methodName');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionMethod = new Reflection.Method('My.Class', 'methodName');
		var reflectionType = mocker.getMock(Reflection.Type);
		var reflectionClass = {};
		spyOn(reflectionFactory, 'buildClass').and.returnValue(reflectionClass);
		expect(reflectionMethod.getClass()).toBe(reflectionClass);
		expect(reflectionFactory.buildClass).toHaveBeenCalledWith('My.Class');
		expect(classObject.getName).toHaveBeenCalled();
	});
	
});
