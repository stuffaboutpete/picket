describe('Reflection.MethodInstance', function(){
	
	var mocker;
	var originalInstantiator;
	var methodObject;
	var typeRegistry;
	var memberRegistry;
	var reflectionMethod;
	var reflectionFactory;
	var methodObject;
	var methodObject2;
	var classObject;
	
	beforeEach(function(){
		define('class My.Class');
		objectInstance = new My.Class();
		mocker = new ClassyJS.Mocker();
		originalInstantiator = ClassyJS._instantiator;
		ClassyJS._instantiator = mocker.getMock(ClassyJS.Instantiator);
		typeRegistry = mocker.getMock(ClassyJS.Registry.Type);
		memberRegistry = mocker.getMock(ClassyJS.Registry.Member);
		reflectionMethod = mocker.getMock(Reflection.Method);
		reflectionFactory = mocker.getMock(ClassyJS.Reflection.Factory);
		methodObject = mocker.getMock(ClassyJS.Member.Method);
		methodObject2 = mocker.getMock(ClassyJS.Member.Method);
		classObject = mocker.getMock(ClassyJS.Type.Class);
		spyOn(ClassyJS._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(ClassyJS._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(ClassyJS._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
	});
	
	afterEach(function(){
		ClassyJS._instantiator = originalInstantiator;
	});
	
	it('can be instantiated with an object instance and method name', function(){
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('myMethod');
		var method = new Reflection.MethodInstance(objectInstance, 'myMethod');
		expect(method instanceof Reflection.MethodInstance).toBe(true);
	});
	
	it('throws error if method does not exist', function(){
		var expectedFatal = new ClassyJS.Reflection.MethodInstance.Fatal(
			'METHOD_DOES_NOT_EXIST',
			'Method name: myMethod'
		);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			{},
			methodObject2
		]);
		spyOn(methodObject, 'getName').and.returnValue('notMyMethod');
		spyOn(methodObject2, 'getName').and.returnValue('alsoNotMyMethod');
		expect(function(){
			new Reflection.MethodInstance(objectInstance, 'myMethod');
		}).toThrow(expectedFatal);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(methodObject.getName).toHaveBeenCalledWith();
		expect(methodObject2.getName).toHaveBeenCalledWith();
	});
	
	it('returns reflection method via factory', function(){
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('myMethod');
		var method = new Reflection.MethodInstance(objectInstance, 'myMethod');
		spyOn(reflectionFactory, 'buildMethod').and.returnValue(reflectionMethod);
		expect(method.getMethod()).toBe(reflectionMethod);
		expect(reflectionFactory.buildMethod).toHaveBeenCalledWith(objectInstance, 'myMethod');
	});
	
	it('calls the method and returns it\'s value', function(){
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([methodObject]);
		spyOn(methodObject, 'getName').and.returnValue('myMethod');
		var method = new Reflection.MethodInstance(objectInstance, 'myMethod');
		spyOn(memberRegistry, 'callMethod').and.returnValue('Return');
		expect(method.call('ArgumentOne', 'ArgumentTwo')).toBe('Return');
		expect(memberRegistry.callMethod).toHaveBeenCalledWith(
			objectInstance,
			objectInstance,
			'myMethod',
			['ArgumentOne', 'ArgumentTwo']
		);
	});
	
});
