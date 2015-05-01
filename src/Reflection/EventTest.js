describe('Reflection.Event', function(){
	
	var mocker;
	var originalInstantiator;
	var reflectionFactory;
	var namespaceManager;
	var typeRegistry;
	var memberRegistry;
	var classObject;
	var eventObject;
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
		eventObject = mocker.getMock(ClassyJS.Member.Event);
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
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('eventName');
		new Reflection.Event('Example', 'eventName');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('Example');
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a constructor function gets class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('eventName');
		new Reflection.Event(classConstructor, 'eventName');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a class instance gets class object', function(){
		var instance = new classConstructor();
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('eventName');
		new Reflection.Event(instance, 'eventName');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(instance);
	});
	
	it('throws error if type registry indicates class does not exist', function(){
		var expectedFatal = new ClassyJS.Reflection.Event.Fatal('CLASS_DOES_NOT_EXIST');
		spyOn(typeRegistry, 'classExists').and.returnValue(false);
		expect(function(){
			new Reflection.Event('NonClass', 'eventName');
		}).toThrow(expectedFatal);
	});
	
	it('throws error if non string, object or function is provided', function(){
		var expectedFatal = new ClassyJS.Reflection.Event.Fatal(
			'INVALID_IDENTIFIER_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Event(123, 'eventName'); }).toThrow(expectedFatal);
	});
	
	it('throws error if non-string event name is provided', function(){
		var expectedFatal = new ClassyJS.Reflection.Event.Fatal(
			'NON_STRING_EVENT_NAME_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Event('Example', 123); }).toThrow(expectedFatal);
	});
	
	it('throws error if no event of given name is found', function(){
		var expectedFatal = new ClassyJS.Reflection.Event.Fatal(
			'EVENT_DOES_NOT_EXIST',
			'Event name: eventName'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			eventObject,
			eventObject
		]);
		var eventNameCall = -1;
		spyOn(eventObject, 'getName').and.callFake(function(){
			eventNameCall++;
			if (eventNameCall == 0) {
				return 'otherEventName';
			} else if (eventNameCall == 1) {
				return 'differentEventName';
			}
		});
		expect(function(){
			new Reflection.Event('Example', 'eventName');
		}).toThrow(expectedFatal);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
	});
	
	it('returns name from event object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('eventName');
		var reflectionProperty = new Reflection.Event('My.Class', 'eventName');
		expect(reflectionProperty.getName()).toBe('eventName');
	});
	
	it('returns access type object via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('eventName');
		spyOn(eventObject, 'getAccessTypeIdentifier').and.returnValue('public');
		var reflectionProperty = new Reflection.Event('My.Class', 'eventName');
		var reflectionAccessType = new Reflection.AccessType();
		spyOn(reflectionFactory, 'buildAccessType').and.returnValue(reflectionAccessType);
		expect(reflectionProperty.getAccessType()).toBe(reflectionAccessType);
		expect(reflectionFactory.buildAccessType).toHaveBeenCalledWith('public');
	});
	
	it('returns reflection argument objects via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('eventName');
		spyOn(eventObject, 'getArgumentTypeIdentifiers').and.returnValue(['string', 'number']);
		var reflectionEvent = new Reflection.Event('My.Class', 'eventName');
		var reflectionArgument = mocker.getMock(Reflection.Argument);
		spyOn(reflectionFactory, 'buildArgument').and.returnValue(reflectionArgument);
		expect(reflectionEvent.getArguments()).toEqual([reflectionArgument, reflectionArgument]);
		expect(reflectionFactory.buildArgument.calls.count()).toBe(2);
		expect(reflectionFactory.buildArgument.calls.argsFor(0)).toEqual([
			'string',
			false,
			undefined,
			reflectionEvent
		]);
		expect(reflectionFactory.buildArgument.calls.argsFor(1)).toEqual([
			'number',
			false,
			undefined,
			reflectionEvent
		]);
	});
	
	it('returns reflection class via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('eventName');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionProperty = new Reflection.Event('My.Class', 'eventName');
		var reflectionType = mocker.getMock(Reflection.Type);
		var reflectionClass = {};
		spyOn(reflectionFactory, 'buildClass').and.returnValue(reflectionClass);
		expect(reflectionProperty.getClass()).toBe(reflectionClass);
		expect(reflectionFactory.buildClass).toHaveBeenCalledWith('My.Class');
		expect(classObject.getName).toHaveBeenCalled();
	});
	
});
