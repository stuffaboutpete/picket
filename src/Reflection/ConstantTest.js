describe('Reflection.Constant', function(){
	
	var mocker;
	var originalInstantiator;
	var reflectionFactory;
	var namespaceManager;
	var typeRegistry;
	var memberRegistry;
	var classObject;
	var constantObject;
	var classConstructor;
	
	beforeEach(function(){
		mocker = new Picket.Mocker();
		originalInstantiator = Picket._instantiator;
		Picket._instantiator = mocker.getMock(Picket.Instantiator);
		reflectionFactory = mocker.getMock(Picket.Reflection.Factory);
		namespaceManager = mocker.getMock(Picket.NamespaceManager);
		typeRegistry = mocker.getMock(Picket.Registry.Type);
		memberRegistry = mocker.getMock(Picket.Registry.Member);
		classObject = mocker.getMock(Picket.Type.Class);
		constantObject = mocker.getMock(Picket.Member.Constant);
		classConstructor = function(){};
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(classConstructor);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(Picket._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(Picket._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(Picket._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
		spyOn(Picket._instantiator, 'getNamespaceManager').and.returnValue(namespaceManager);
	});
	
	afterEach(function(){
		Picket._instantiator = originalInstantiator;
	});
	
	it('instantiation with a string class looks up namespace and gets class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		new Reflection.Constant('Example', 'CONSTANT_NAME');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('Example');
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a constructor function gets class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		new Reflection.Constant(classConstructor, 'CONSTANT_NAME');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a class instance gets class object', function(){
		var instance = new classConstructor();
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		new Reflection.Constant(instance, 'CONSTANT_NAME');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(instance);
	});
	
	it('throws error if type registry indicates class does not exist', function(){
		var expectedFatal = new Picket.Reflection.Constant.Fatal('CLASS_DOES_NOT_EXIST');
		spyOn(typeRegistry, 'classExists').and.returnValue(false);
		expect(function(){
			new Reflection.Constant('NonClass', 'CONSTANT_NAME');
		}).toThrow(expectedFatal);
	});
	
	it('throws error if non string, object or function is provided', function(){
		var expectedFatal = new Picket.Reflection.Constant.Fatal(
			'INVALID_IDENTIFIER_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Constant(123, 'CONSTANT_NAME'); }).toThrow(expectedFatal);
	});
	
	it('throws error if non-string constant name is provided', function(){
		var expectedFatal = new Picket.Reflection.Constant.Fatal(
			'NON_STRING_CONSTANT_NAME_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Constant('Example', 123); }).toThrow(expectedFatal);
	});
	
	it('throws error if no constant of given name is found', function(){
		var expectedFatal = new Picket.Reflection.Constant.Fatal(
			'CONSTANT_DOES_NOT_EXIST',
			'Constant name: CONSTANT_NAME'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			constantObject,
			constantObject
		]);
		var constantNameCall = -1;
		spyOn(constantObject, 'getName').and.callFake(function(){
			constantNameCall++;
			if (constantNameCall == 0) {
				return 'OTHER_CONSTANT_NAME';
			} else if (constantNameCall == 1) {
				return 'DIFFERENT_CONSTANT_NAME';
			}
		});
		expect(function(){
			new Reflection.Constant('Example', 'CONSTANT_NAME');
		}).toThrow(expectedFatal);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
	});
	
	it('returns name from constant object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		var reflectionConstant = new Reflection.Constant('My.Class', 'CONSTANT_NAME');
		expect(reflectionConstant.getName()).toBe('CONSTANT_NAME');
	});
	
	it('returns type object via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		spyOn(constantObject, 'getTypeIdentifier').and.returnValue('string');
		var reflectionConstant = new Reflection.Constant('My.Class', 'CONSTANT_NAME');
		var reflectionType = mocker.getMock(Reflection.Type);
		spyOn(reflectionFactory, 'buildType').and.returnValue(reflectionType);
		expect(reflectionConstant.getType()).toBe(reflectionType);
		expect(reflectionFactory.buildType).toHaveBeenCalledWith('string');
	});
	
	it('returns access type object via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		spyOn(constantObject, 'getAccessTypeIdentifier').and.returnValue('public');
		var reflectionConstant = new Reflection.Constant('My.Class', 'CONSTANT_NAME');
		var reflectionAccessType = new Reflection.AccessType();
		spyOn(reflectionFactory, 'buildAccessType').and.returnValue(reflectionAccessType);
		expect(reflectionConstant.getAccessType()).toBe(reflectionAccessType);
		expect(reflectionFactory.buildAccessType).toHaveBeenCalledWith('public');
	});
	
	it('will return value from class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		spyOn(constantObject, 'get').and.returnValue('example value');
		var reflectionConstant = new Reflection.Constant('My.Class', 'CONSTANT_NAME');
		expect(reflectionConstant.getValue()).toBe('example value');
	});
	
	it('will indicate if constant value is auto-generated', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		spyOn(constantObject, 'isAutoGenerated').and.returnValue(true);
		var reflectionConstant = new Reflection.Constant('My.Class', 'CONSTANT_NAME');
		expect(reflectionConstant.isAutoGenerated()).toBe(true);
	});
	
	it('will indicate if constant value is not auto-generated', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		spyOn(constantObject, 'isAutoGenerated').and.returnValue(false);
		var reflectionConstant = new Reflection.Constant('My.Class', 'CONSTANT_NAME');
		expect(reflectionConstant.isAutoGenerated()).toBe(false);
	});
	
	it('returns reflection class via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([constantObject]);
		spyOn(constantObject, 'getName').and.returnValue('CONSTANT_NAME');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionConstant = new Reflection.Constant('My.Class', 'CONSTANT_NAME');
		var reflectionClass = {};
		spyOn(reflectionFactory, 'buildClass').and.returnValue(reflectionClass);
		expect(reflectionConstant.getClass()).toBe(reflectionClass);
		expect(reflectionFactory.buildClass).toHaveBeenCalledWith('My.Class');
		expect(classObject.getName).toHaveBeenCalled();
	});
	
});
