describe('Reflection.ClassInstance', function(){
	
	var mocker;
	var originalInstantiator;
	var objectInstance;
	var reflectionFactory;
	var typeRegistry;
	var memberRegistry;
	var classObject;
	var propertyObject;
	var methodObject;
	var eventObject;
	var reflectionPropertyInstance;
	var reflectionMethodInstance;
	var reflectionEventInstance;
	var reflectionPropertyInstance2;
	var reflectionMethodInstance2;
	var reflectionEventInstance2;
	
	beforeEach(function(){
		define('class My.Class');
		objectInstance = new My.Class();
		mocker = new Picket.Mocker();
		originalInstantiator = Picket._instantiator;
		reflectionFactory = mocker.getMock(Picket.Reflection.Factory);
		typeRegistry = mocker.getMock(Picket.Registry.Type);
		memberRegistry = mocker.getMock(Picket.Registry.Member);
		classObject = mocker.getMock(Picket.Type.Class);
		propertyObject = mocker.getMock(Picket.Member.Property);
		methodObject = mocker.getMock(Picket.Member.Method);
		eventObject = mocker.getMock(Picket.Member.Event);
		reflectionPropertyInstance = mocker.getMock(Reflection.PropertyInstance);
		reflectionMethodInstance = mocker.getMock(Reflection.MethodInstance);
		reflectionEventInstance = mocker.getMock(Reflection.EventInstance);
		spyOn(Picket._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(Picket._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(Picket._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
	});
	
	afterEach(function(){
		Picket._instantiator = originalInstantiator;
	});
	
	it('can be instantiated with an object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		new Reflection.ClassInstance(objectInstance);
	});
	
	it('throws error if provided instance is not an object', function(){
		var expectedFatal = new Picket.Reflection.ClassInstance.Fatal(
			'INVALID_IDENTIFIER_PROVIDED',
			'Provided type: function'
		);
		expect(function(){ new Reflection.ClassInstance(My.Class); }).toThrow(expectedFatal);
	});
	
	it('checks with type registry that class exists on instantiation', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		new Reflection.ClassInstance(objectInstance);
		expect(typeRegistry.classExists).toHaveBeenCalledWith(objectInstance);
	});
	
	it('throws error if type registry indicates a non-valid class', function(){
		var expectedFatal = new Picket.Reflection.ClassInstance.Fatal('CLASS_DOES_NOT_EXIST');
		spyOn(typeRegistry, 'classExists').and.returnValue(false);
		expect(function(){ new Reflection.ClassInstance({}); }).toThrow(expectedFatal);
		expect(typeRegistry.classExists).toHaveBeenCalled();
	});
	
	it('returns reflection class via reflection factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		var reflectionClass = {};
		spyOn(reflectionFactory, 'buildClass').and.returnValue(reflectionClass);
		expect(reflectionClassInstance.getClass()).toBe(reflectionClass);
		expect(reflectionFactory.buildClass).toHaveBeenCalledWith(objectInstance);
	});
	
	it('will return an array of all instance members', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject
		]);
		var factory = reflectionFactory;
		spyOn(factory, 'buildPropertyInstance').and.returnValue(reflectionPropertyInstance);
		spyOn(factory, 'buildMethodInstance').and.returnValue(reflectionMethodInstance);
		spyOn(factory, 'buildEventInstance').and.returnValue(reflectionEventInstance);
		spyOn(propertyObject, 'getName').and.returnValue('myProperty');
		spyOn(methodObject, 'getName').and.returnValue('myMethod');
		spyOn(eventObject, 'getName').and.returnValue('myEvent');
		var members = reflectionClassInstance.getMemberInstances();
		expect(members.length).toBe(3);
		expect(members[0]).toBe(reflectionPropertyInstance);
		expect(members[1]).toBe(reflectionMethodInstance);
		expect(members[2]).toBe(reflectionEventInstance);
		expect(typeRegistry.getClass).toHaveBeenCalledWith(objectInstance);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
		expect(factory.buildPropertyInstance).toHaveBeenCalledWith(objectInstance, 'myProperty');
		expect(factory.buildMethodInstance).toHaveBeenCalledWith(objectInstance, 'myMethod');
		expect(factory.buildEventInstance).toHaveBeenCalledWith(objectInstance, 'myEvent');
	});
	
	it('will return an array of only property types', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			propertyObject
		]);
		var factory = reflectionFactory;
		spyOn(factory, 'buildPropertyInstance').and.returnValue(reflectionPropertyInstance);
		spyOn(factory, 'buildMethodInstance');
		spyOn(factory, 'buildEventInstance');
		var propertyNameCall = -1;
		spyOn(propertyObject, 'getName').and.callFake(function(){
			propertyNameCall++;
			if (propertyNameCall == 0) {
				return 'myProperty';
			} else if (propertyNameCall == 1) {
				return 'myOtherProperty';
			}
		});
		var members = reflectionClassInstance.getPropertyInstances();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionPropertyInstance);
		expect(members[1]).toBe(reflectionPropertyInstance);
		expect(factory.buildPropertyInstance.calls.count()).toBe(2);
		expect(factory.buildPropertyInstance.calls.argsFor(0)).toEqual([
			objectInstance,
			'myProperty'
		]);
		expect(factory.buildPropertyInstance.calls.argsFor(1)).toEqual([
			objectInstance,
			'myOtherProperty'
		]);
		expect(factory.buildMethodInstance).not.toHaveBeenCalled();
		expect(factory.buildEventInstance).not.toHaveBeenCalled();
	});
	
	it('will return an array of only method types', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			methodObject
		]);
		var factory = reflectionFactory;
		spyOn(factory, 'buildMethodInstance').and.returnValue(reflectionMethodInstance);
		spyOn(factory, 'buildPropertyInstance');
		spyOn(factory, 'buildEventInstance');
		var methodNameCall = -1;
		spyOn(methodObject, 'getName').and.callFake(function(){
			methodNameCall++;
			if (methodNameCall == 0) {
				return 'myMethod';
			} else if (methodNameCall == 1) {
				return 'myOtherMethod';
			}
		});
		var members = reflectionClassInstance.getMethodInstances();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionMethodInstance);
		expect(members[1]).toBe(reflectionMethodInstance);
		expect(factory.buildMethodInstance.calls.count()).toBe(2);
		expect(factory.buildMethodInstance.calls.argsFor(0)).toEqual([
			objectInstance,
			'myMethod'
		]);
		expect(factory.buildMethodInstance.calls.argsFor(1)).toEqual([
			objectInstance,
			'myOtherMethod'
		]);
		expect(factory.buildPropertyInstance).not.toHaveBeenCalled();
		expect(factory.buildEventInstance).not.toHaveBeenCalled();
	});
	
	it('will return an array of only event types', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			eventObject,
			eventObject
		]);
		var factory = reflectionFactory;
		spyOn(factory, 'buildEventInstance').and.returnValue(reflectionEventInstance);
		spyOn(factory, 'buildPropertyInstance');
		spyOn(factory, 'buildMethodInstance');
		var eventNameCall = -1;
		spyOn(eventObject, 'getName').and.callFake(function(){
			eventNameCall++;
			if (eventNameCall == 0) {
				return 'myEvent';
			} else if (eventNameCall == 1) {
				return 'myOtherEvent';
			}
		});
		var members = reflectionClassInstance.getEventInstances();
		expect(members.length).toBe(2);
		expect(members[0]).toBe(reflectionEventInstance);
		expect(members[1]).toBe(reflectionEventInstance);
		expect(factory.buildEventInstance.calls.count()).toBe(2);
		expect(factory.buildEventInstance.calls.argsFor(0)).toEqual([
			objectInstance,
			'myEvent'
		]);
		expect(factory.buildEventInstance.calls.argsFor(1)).toEqual([
			objectInstance,
			'myOtherEvent'
		]);
		expect(factory.buildPropertyInstance).not.toHaveBeenCalled();
		expect(factory.buildMethodInstance).not.toHaveBeenCalled();
	});
	
	it('will return a named property instance', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			methodObject,
			propertyObject
		]);
		var propertyNameCall = -1;
		spyOn(propertyObject, 'getName').and.callFake(function(){
			propertyNameCall++;
			if (propertyNameCall == 0 || propertyNameCall == 2) {
				return 'myProperty';
			} else if (propertyNameCall == 1) {
				return 'notMyProperty';
			}
		});
		var factory = reflectionFactory;
		spyOn(factory, 'buildPropertyInstance').and.returnValue(reflectionPropertyInstance);
		spyOn(factory, 'buildMethodInstance');
		spyOn(factory, 'buildEventInstance');
		var members = reflectionClassInstance.getPropertyInstance('myProperty');
		expect(members).toBe(reflectionPropertyInstance);
		expect(factory.buildPropertyInstance.calls.count()).toBe(1);
		expect(factory.buildPropertyInstance.calls.argsFor(0)).toEqual([
			objectInstance,
			'myProperty'
		]);
		expect(factory.buildMethodInstance).not.toHaveBeenCalled();
		expect(factory.buildEventInstance).not.toHaveBeenCalled();
		expect(propertyObject.getName.calls.count()).toBe(3);
	});
	
	it('will return an array of named method instances', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			methodObject,
			methodObject,
			propertyObject,
			methodObject
		]);
		var methodNameCall = -1;
		spyOn(methodObject, 'getName').and.callFake(function(){
			methodNameCall++;
			if (methodNameCall == 1) {
				return 'notMyMethod';
			} else {
				return 'myMethod';
			}
		});
		var factory = reflectionFactory;
		spyOn(factory, 'buildMethodInstance').and.returnValue(reflectionMethodInstance);
		spyOn(factory, 'buildPropertyInstance');
		spyOn(factory, 'buildEventInstance');
		var members = reflectionClassInstance.getMethodInstances('myMethod');
		expect(members).toEqual([reflectionMethodInstance, reflectionMethodInstance]);
		expect(factory.buildMethodInstance.calls.count()).toBe(2);
		expect(factory.buildMethodInstance.calls.argsFor(0)).toEqual([
			objectInstance,
			'myMethod'
		]);
		expect(factory.buildMethodInstance.calls.argsFor(1)).toEqual([
			objectInstance,
			'myMethod'
		]);
		expect(factory.buildPropertyInstance).not.toHaveBeenCalled();
		expect(factory.buildEventInstance).not.toHaveBeenCalled();
		expect(methodObject.getName.calls.count()).toBe(5);
	});
	
	it('will return a named event instance', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		var reflectionClassInstance = new Reflection.ClassInstance(objectInstance);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			eventObject,
			methodObject,
			eventObject
		]);
		var eventNameCall = -1;
		spyOn(eventObject, 'getName').and.callFake(function(){
			eventNameCall++;
			if (eventNameCall == 0 || eventNameCall == 2) {
				return 'myEvent';
			} else if (eventNameCall == 1) {
				return 'notMyEvent';
			}
		});
		var factory = reflectionFactory;
		spyOn(factory, 'buildEventInstance').and.returnValue(reflectionEventInstance);
		spyOn(factory, 'buildPropertyInstance');
		spyOn(factory, 'buildMethodInstance');
		var members = reflectionClassInstance.getEventInstance('myEvent');
		expect(members).toBe(reflectionEventInstance);
		expect(factory.buildEventInstance.calls.count()).toBe(1);
		expect(factory.buildEventInstance.calls.argsFor(0)).toEqual([
			objectInstance,
			'myEvent'
		]);
		expect(factory.buildPropertyInstance).not.toHaveBeenCalled();
		expect(factory.buildMethodInstance).not.toHaveBeenCalled();
		expect(eventObject.getName.calls.count()).toBe(3);
	});
	
});
