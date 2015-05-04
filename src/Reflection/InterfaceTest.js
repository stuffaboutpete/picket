describe('Reflection.Interface', function(){
	
	var mocker;
	var originalInstantiator;
	var typeRegistry;
	var interfaceObject;
	var memberRegistry;
	var methodObject;
	var eventObject;
	var reflectionFactory;
	var reflectionMethod;
	var reflectionEvent;
	
	beforeEach(function(){
		mocker = new Picket.Mocker();
		originalInstantiator = Picket._instantiator;
		Picket._instantiator = mocker.getMock(Picket.Instantiator);
		typeRegistry = mocker.getMock(Picket.Registry.Type);
		interfaceObject = mocker.getMock(Picket.Type.Interface);
		memberRegistry = mocker.getMock(Picket.Registry.Member);
		methodObject = mocker.getMock(Picket.Member.Method);
		eventObject = mocker.getMock(Picket.Member.Event);
		reflectionFactory = mocker.getMock(Picket.Reflection.Factory);
		reflectionMethod = mocker.getMock(Picket.Reflection.Method);
		reflectionEvent = mocker.getMock(Picket.Reflection.Event);
		spyOn(Picket._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(Picket._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(Picket._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
	});
	
	afterEach(function(){
		Picket._instantiator = originalInstantiator;
	});
	
	it('throws error if interface is instantiated with a non string', function(){
		var expectedFatal = new Picket.Reflection.Interface.Fatal(
			'NON_STRING_INTERFACE_NAME_PROVIDED',
			'Provided type: number'
		);
		expect(function(){ new Reflection.Interface(123); }).toThrow(expectedFatal);
	});
	
	it('instantiation looks up whether interface exists in type registry from name', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface');
		new Reflection.Interface('My.IInterface');
		expect(typeRegistry.interfaceExists).toHaveBeenCalledWith('My.IInterface');
	});
	
	it('throws error if type registry suggests interface does not exist', function(){
		var expectedFatal = new Picket.Reflection.Interface.Fatal(
			'INTERFACE_DOES_NOT_EXIST',
			'Provided name: My.IInterface'
		);
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(false);
		expect(function(){ new Reflection.Interface('My.IInterface'); }).toThrow(expectedFatal);
	});
	
	it('instantiation looks up interface object in type registry from name', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface');
		new Reflection.Interface('My.IInterface');
		expect(typeRegistry.getInterface).toHaveBeenCalledWith('My.IInterface');
	});
	
	it('returns name of interface from interface object', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		spyOn(interfaceObject, 'getName').and.returnValue('Interface name')
		expect(reflectionInterface.getName()).toBe('Interface name');
	});
	
	it('will return an array of class members from member registry via factory', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			eventObject,
			methodObject
		]);
		spyOn(reflectionFactory, 'buildMethod').and.returnValue(reflectionMethod);
		spyOn(reflectionFactory, 'buildEvent').and.returnValue(reflectionEvent);
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		var members = reflectionInterface.getMembers();
		expect(members.length).toBe(3);
		expect(members[0]).toBe(reflectionMethod);
		expect(members[1]).toBe(reflectionEvent);
		expect(members[2]).toBe(reflectionMethod);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(interfaceObject);
		expect(reflectionFactory.buildMethod.calls.count()).toBe(2);
		expect(reflectionFactory.buildMethod.calls.argsFor(0)).toEqual([methodObject]);
		expect(reflectionFactory.buildMethod.calls.argsFor(1)).toEqual([methodObject]);
		expect(reflectionFactory.buildEvent.calls.count()).toBe(1);
		expect(reflectionFactory.buildEvent).toHaveBeenCalledWith(eventObject);
	});
	
	it('will return an array of methods', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			eventObject,
			methodObject
		]);
		spyOn(reflectionFactory, 'buildMethod').and.returnValue(reflectionMethod);
		spyOn(reflectionFactory, 'buildEvent');
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		var members = reflectionInterface.getMethods();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionMethod);
		expect(members[1]).toBe(reflectionMethod);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(interfaceObject);
		expect(reflectionFactory.buildMethod.calls.count()).toBe(2);
		expect(reflectionFactory.buildMethod.calls.argsFor(0)).toEqual([methodObject]);
		expect(reflectionFactory.buildMethod.calls.argsFor(1)).toEqual([methodObject]);
		expect(reflectionFactory.buildEvent).not.toHaveBeenCalled();
	});
	
	it('will return an array of events', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			eventObject,
			eventObject,
			methodObject
		]);
		spyOn(reflectionFactory, 'buildEvent').and.returnValue(reflectionEvent);
		spyOn(reflectionFactory, 'buildMethod');
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		var members = reflectionInterface.getEvents();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionEvent);
		expect(members[1]).toBe(reflectionEvent);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(interfaceObject);
		expect(reflectionFactory.buildEvent.calls.count()).toBe(2);
		expect(reflectionFactory.buildEvent.calls.argsFor(0)).toEqual([eventObject]);
		expect(reflectionFactory.buildEvent.calls.argsFor(1)).toEqual([eventObject]);
		expect(reflectionFactory.buildMethod).not.toHaveBeenCalled();
	});
	
	it('will return an array of named methods', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			methodObject,
			methodObject
		]);
		var methodCallIndex = -1;
		spyOn(methodObject, 'getName').and.callFake(function(){
			methodCallIndex++;
			if (methodCallIndex == 0 || methodCallIndex == 2) {
				return 'myMethod';
			} else {
				return 'notMyMethod';
			}
		});
		spyOn(reflectionFactory, 'buildMethod').and.returnValue(reflectionMethod);
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		var members = reflectionInterface.getMethods('myMethod');
		expect(members.length).toBe(2);
	});
	
	it('will return a named event', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			eventObject,
			eventObject,
			eventObject
		]);
		var eventCallIndex = -1;
		spyOn(eventObject, 'getName').and.callFake(function(){
			eventCallIndex++;
			if (eventCallIndex == 0 || eventCallIndex == 2) {
				return 'myEvent';
			} else {
				return 'notMyEvent';
			}
		});
		spyOn(reflectionFactory, 'buildEvent').and.returnValue(reflectionEvent);
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		var members = reflectionInterface.getEvent('myEvent');
		expect(members.length).toBe(2);
	});
	
	it('returns mock object', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		spyOn(memberRegistry, 'getMembers').and.returnValue([]);
		spyOn(interfaceObject, 'getName').and.returnValue('My.IInterface');
		spyOn(typeRegistry, 'registerMock');
		var mock = reflectionInterface.getMock();
		expect(typeof mock).toBe('object');
	});
	
	it('ensures that methods exist on mocked interface but do nothing', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			{},
			methodObject
		]);
		var methodCallIndex = -1;
		spyOn(methodObject, 'getName').and.callFake(function(){
			methodCallIndex++;
			if (methodCallIndex == 0) {
				return 'myMethod';
			} else {
				return 'myOtherMethod';
			}
		});
		spyOn(interfaceObject, 'getName').and.returnValue('My.IInterface');
		spyOn(typeRegistry, 'registerMock');
		var mock = reflectionInterface.getMock();
		expect(typeof mock.myMethod).toBe('function');
		expect(typeof mock.myOtherMethod).toBe('function');
		expect(mock.myMethod()).toBe(undefined);
		expect(mock.myOtherMethod()).toBe(undefined);
	});
	
	it('ensures that bind method exists on mock', function(){
		spyOn(typeRegistry, 'interfaceExists').and.returnValue(true);
		spyOn(typeRegistry, 'getInterface').and.returnValue(interfaceObject);
		var reflectionInterface = new Reflection.Interface('My.IInterface');
		spyOn(memberRegistry, 'getMembers').and.returnValue([]);
		spyOn(interfaceObject, 'getName').and.returnValue('My.IInterface');
		spyOn(typeRegistry, 'registerMock');
		var mock = reflectionInterface.getMock();
		expect(typeof mock.bind).toBe('function');
		expect(mock.bind()).toBe(undefined);
	});
	
});
