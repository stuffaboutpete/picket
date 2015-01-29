describe('Mocker', function(){
	
	// @todo Also should be able to mock interfaces and they should pass conformTo tests
	
	var namespaceManager;
	var reflectionClassFactory;
	var reflectionClass;
	var reflectionMethod;
	var mocker;
	
	beforeEach(function(){
		delete window.My;
		namespaceManager = new ClassyJS.NamespaceManager();
		reflectionClassFactory = new ClassyJS.Mocker.ReflectionClassFactory();
		reflectionClass = jasmine.createSpyObj('reflectionClass', ['getMethods']);
		reflectionMethod = jasmine.createSpyObj('reflectionMethod', ['getName']);
		mocker = new ClassyJS.Mocker(namespaceManager, reflectionClassFactory);
	});
	
	it('can be instantiated with dependencies', function(){
		var mocker = new ClassyJS.Mocker(namespaceManager, reflectionClassFactory);
		expect(mocker instanceof ClassyJS.Mocker).toBe(true);
	});
	
	it('throws error if instantiated with invalid namespace manager', function(){
		var expectedFatal = new ClassyJS.Mocker.Fatal(
			'NON_NAMESPACE_MANAGER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Mocker(undefined, reflectionClassFactory);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if instantiated with invalid reflection class factory', function(){
		var expectedFatal = new ClassyJS.Mocker.Fatal(
			'NON_REFLECTION_CLASS_FACTORY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Mocker(namespaceManager);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if getMock is called with non-string class name', function(){
		var expectedFatal = new ClassyJS.Mocker.Fatal(
			'NON_STRING_CLASS_NAME_PROVIDED',
			'Provided type: function'
		);
		expect(function(){
			mocker.getMock(function(){});
		}).toThrow(expectedFatal);
	});
	
	it('asks namespace manager for constructor of given class name', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(function(){});
		spyOn(reflectionClassFactory, 'build').and.returnValue(reflectionClass);
		reflectionClass.getMethods.and.returnValue([]);
		mocker.getMock('My.Class');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('My.Class');
	});
	
	it('throws error if non-function is returned from namespace manager', function(){
		var expectedFatal = new ClassyJS.Mocker.Fatal(
			'NON_FUNCTION_RETURNED_FROM_NAMESPACE_MANAGER',
			'Returned type: object; Provided identifier: My.Class'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue({});
		expect(function(){
			mocker.getMock('My.Class');
		}).toThrow(expectedFatal);
	});
	
	it('returns object when mocking class which passes instanceof test', function(){
		var TargetClass = function(){};
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(TargetClass);
		spyOn(reflectionClassFactory, 'build').and.returnValue(reflectionClass);
		reflectionClass.getMethods.and.returnValue([]);
		var mock = mocker.getMock('My.Class');
		expect(typeof mock).toBe('object');
		expect(mock instanceof TargetClass).toBe(true);
	});
	
	it('does not call class constructor whilst mocking', function(){
		var TargetClass = function(){
			// Force a fail
			expect(true).toBe(false);
		};
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(TargetClass);
		spyOn(reflectionClassFactory, 'build').and.returnValue(reflectionClass);
		reflectionClass.getMethods.and.returnValue([]);
		var mock = mocker.getMock('My.Class');
	});
	
	it('asks reflection class factory for reflection class instance', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(function(){});
		spyOn(reflectionClassFactory, 'build').and.returnValue(reflectionClass);
		reflectionClass.getMethods.and.returnValue([]);
		mocker.getMock('My.Class');
		expect(reflectionClassFactory.build).toHaveBeenCalledWith('My.Class');
	});
	
	it('asks reflection class for list of methods which then exist on the mock', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(function(){});
		spyOn(reflectionClassFactory, 'build').and.returnValue(reflectionClass);
		reflectionClass.getMethods.and.returnValue([reflectionMethod]);
		reflectionMethod.getName.and.returnValue('myMethod');
		var mock = mocker.getMock('My.Class');
		expect(typeof mock.myMethod).toBe('function');
	});
	
});
