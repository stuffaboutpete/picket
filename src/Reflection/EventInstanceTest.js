describe('Reflection.EventInstance', function(){
	
	var mocker;
	var originalInstantiator;
	var eventObject;
	var typeRegistry;
	var memberRegistry;
	var reflectionEvent;
	var reflectionFactory;
	var eventObject;
	var eventObject2;
	var classObject;
	
	beforeEach(function(){
		define('class My.Class');
		objectInstance = new My.Class();
		mocker = new Picket.Mocker();
		originalInstantiator = Picket._instantiator;
		Picket._instantiator = mocker.getMock(Picket.Instantiator);
		typeRegistry = mocker.getMock(Picket.Registry.Type);
		memberRegistry = mocker.getMock(Picket.Registry.Member);
		reflectionEvent = mocker.getMock(Reflection.Event);
		reflectionFactory = mocker.getMock(Picket.Reflection.Factory);
		eventObject = mocker.getMock(Picket.Member.Event);
		eventObject2 = mocker.getMock(Picket.Member.Event);
		classObject = mocker.getMock(Picket.Type.Class);
		spyOn(Picket._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(Picket._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(Picket._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
	});
	
	afterEach(function(){
		Picket._instantiator = originalInstantiator;
	});
	
	it('can be instantiated with an object instance and event name', function(){
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('myEvent');
		var event = new Reflection.EventInstance(objectInstance, 'myEvent');
		expect(event instanceof Reflection.EventInstance).toBe(true);
	});
	
	it('gets name if event object is provided', function(){
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('myEvent');
		new Reflection.EventInstance(objectInstance, 'myEvent');
		expect(eventObject.getName).toHaveBeenCalledWith();
	});
	
	it('throws error if event does not exist', function(){
		var expectedFatal = new Picket.Reflection.EventInstance.Fatal(
			'EVENT_DOES_NOT_EXIST',
			'Event name: myEvent'
		);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			eventObject,
			{},
			eventObject2
		]);
		spyOn(eventObject, 'getName').and.returnValue('notMyEvent');
		spyOn(eventObject2, 'getName').and.returnValue('alsoNotMyEvent');
		expect(function(){
			new Reflection.EventInstance(objectInstance, 'myEvent');
		}).toThrow(expectedFatal);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(eventObject.getName).toHaveBeenCalledWith();
		expect(eventObject2.getName).toHaveBeenCalledWith();
	});
	
	it('returns reflection event via factory', function(){
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('myEvent');
		var event = new Reflection.EventInstance(objectInstance, 'myEvent');
		spyOn(reflectionFactory, 'buildEvent').and.returnValue(reflectionEvent);
		expect(event.getEvent()).toBe(reflectionEvent);
		expect(reflectionFactory.buildEvent).toHaveBeenCalledWith(objectInstance, 'myEvent');
	});
	
	it('triggers the event', function(){
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([eventObject]);
		spyOn(eventObject, 'getName').and.returnValue('myEvent');
		var event = new Reflection.EventInstance(objectInstance, 'myEvent');
		spyOn(memberRegistry, 'triggerEvent');
		event.trigger('ArgumentOne', 'ArgumentTwo');
		expect(memberRegistry.triggerEvent).toHaveBeenCalledWith(
			objectInstance,
			'myEvent',
			['ArgumentOne', 'ArgumentTwo']
		);
	});
	
});
