describe('Member.Event', function(){
	
	var eventObject;
	var definition;
	var typeChecker;
	var accessController;
	var eventOwnerInstance;
	var accessInstance;
	var eventBinderInstance;
	var eventBinderInstance2;
	var methodObject;
	var methodObject2;
	
	beforeEach(function(){
		definition = new Picket.Member.Event.Definition('public event myEvent ()');
		typeChecker = new Picket.TypeChecker(new Picket.TypeChecker.ReflectionFactory());
		accessController = new Picket.Access.Controller(
			new Picket.Registry.Type(
				new Picket.NamespaceManager()
			)
		);
		eventObject = new Picket.Member.Event(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		eventOwnerInstance = {};
		accessInstance = {};
		eventBinderInstance = {};
		eventBinderInstance2 = {};
		methodObject = new Picket.Member.Method(
			new Picket.Member.Method.Definition('public myMethod () -> undefined'),
			false,
			function(){},
			typeChecker,
			accessController
		);
		methodObject2 = new Picket.Member.Method(
			new Picket.Member.Method.Definition('public myMethod () -> undefined'),
			false,
			function(){},
			typeChecker,
			accessController
		);
	});
	
	it('can be instantiated', function(){
		var eventObject = new Picket.Member.Event(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(eventObject instanceof Picket.Member.Event).toBe(true);
	});
	
	it('throws error if no definition is provided', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NO_DEFINITION_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Event(
				undefined,
				false,
				undefined,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no type checker is provided', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NO_TYPE_CHECKER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Event(
				definition,
				false,
				undefined,
				undefined,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no access controller is provided', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NO_ACCESS_CONTROLLER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Event(
				definition,
				false,
				undefined,
				typeChecker
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if value is not null, undefined or empty string', function(){
		new Picket.Member.Event(
			definition,
			false,
			null,
			typeChecker,
			accessController
		);
		new Picket.Member.Event(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		new Picket.Member.Event(
			definition,
			false,
			'',
			typeChecker,
			accessController
		);
		var expectedFatal = new Picket.Member.Event.Fatal(
			'INVALID_VALUE_PROVIDED',
			'Provided type: number'
		);
		expect(function(){
			new Picket.Member.Event(
				definition,
				false,
				0,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
		var expectedFatal = new Picket.Member.Event.Fatal(
			'INVALID_VALUE_PROVIDED',
			'Provided type: boolean'
		);
		expect(function(){
			new Picket.Member.Event(
				definition,
				false,
				false,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
		var expectedFatal = new Picket.Member.Event.Fatal(
			'INVALID_VALUE_PROVIDED',
			'Provided type: string'
		);
		expect(function(){
			new Picket.Member.Event(
				definition,
				false,
				'string',
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if any argument type is undefined', function(){
		var expectedFatal = new Picket.Member.Event.Fatal('UNDEFINED_ARGUMENT_TYPE');
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue([
			'string',
			'number',
			'undefined'
		]);
		expect(function(){
			new Picket.Member.Event(
				definition,
				false,
				undefined,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if any argument type is undefined', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('NULL_ARGUMENT_TYPE');
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['string', 'null', 'string']);
		expect(function(){
			new Picket.Member.Event(
				definition,
				false,
				undefined,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('can return name from definition', function(){
		spyOn(definition, 'getName').and.returnValue('myEvent');
		expect(eventObject.getName()).toBe('myEvent');
	});
	
	it('can return argument types from definition', function(){
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['string', '[number]']);
		expect(eventObject.getArgumentTypeIdentifiers()).toEqual(['string', '[number]']);
	});
	
	it('will check with access controller when requestBind is called', function(){
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		expect(eventObject.requestBind(eventOwnerInstance, accessInstance)).toBe(true);
		expect(accessController.canAccess).toHaveBeenCalledWith(
			eventOwnerInstance,
			accessInstance,
			'public'
		);
	});
	
	it('throws error if bind is requested with non-object target instance', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NON_OBJECT_TARGET_INSTANCE_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			eventObject.requestBind(undefined, accessInstance);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if bind is requested with non-object access instance', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NON_OBJECT_ACCESS_INSTANCE_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			eventObject.requestBind(eventOwnerInstance);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if access controller does not permit binding', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: protected'
		);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('protected');
		spyOn(accessController, 'canAccess').and.returnValue(false);
		expect(function(){
			eventObject.requestBind(eventOwnerInstance, accessInstance);
		}).toThrow(expectedFatal);
	});
	
	it('checks with type checker when event is triggered', function(){
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['string', 'number']);
		spyOn(methodObject, 'call').and.callFake(function(){});
		eventObject.trigger([[eventBinderInstance, methodObject]], ['String argument', 123]);
		expect(typeChecker.areValidTypes).toHaveBeenCalledWith(
			['String argument', 123],
			['string', 'number']
		);
	});
	
	it('throws error if trigger is called with non array of callbacks', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NON_ARRAY_CALLBACKS_PROVIDED',
			'Provided type: object'
		);
		expect(function(){ eventObject.trigger({}, ['Argument']); }).toThrow(expectedFatal);
	});
	
	it('throws error if callback is non-array', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NON_ARRAY_CALLBACK_PROVIDED',
			'Provided type: object'
		);
		expect(function(){ eventObject.trigger([{}], ['Argument']); }).toThrow(expectedFatal);
	});
	
	it('throws error if callback instance is not object', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NON_OBJECT_CALLBACK_INSTANCE',
			'Provided type: string'
		);
		expect(function(){ eventObject.trigger([
			['string', methodObject]],
			['Argument']
		); }).toThrow(expectedFatal);
	});
	
	it('throws error if callback method is not method object', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'INVALID_CALLBACK_METHOD',
			'Provided type: number'
		);
		expect(function(){ eventObject.trigger([
			[eventBinderInstance, 123]],
			['Argument']
		); }).toThrow(expectedFatal);
	});
	
	it('throws error if trigger is called with non array of arguments', function(){
		var expectedFatal = new Picket.Member.Event.Fatal(
			'NON_ARRAY_ARGUMENTS_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			eventObject.trigger([[eventBinderInstance, methodObject]], {});
		}).toThrow(expectedFatal);
	});
	
	it('throws error if type checker indicates arguments are invalid', function(){
		var expectedFatal = new Picket.Member.Event.Fatal('INVALID_ARGUMENTS');
		spyOn(typeChecker, 'areValidTypes').and.returnValue(false);
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['string']);
		expect(function(){
			eventObject.trigger([[eventBinderInstance, methodObject]], ['String argument', 123]);
		}).toThrow(expectedFatal);
	});
	
	it('will call method callback on trigger', function(){
		var arguments = ['String argument', 123];
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['string', 'number']);
		spyOn(methodObject, 'call');
		eventObject.trigger([[eventBinderInstance, methodObject]], arguments);
		expect(methodObject.call).toHaveBeenCalledWith(
			eventBinderInstance,
			eventBinderInstance,
			eventBinderInstance,
			arguments
		);
	});
	
	it('will call multiple method callbacks on trigger', function(){
		var arguments = [123];
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['number']);
		spyOn(methodObject, 'call');
		spyOn(methodObject2, 'call');
		eventObject.trigger(
			[
				[eventBinderInstance, methodObject],
				[eventBinderInstance2, methodObject2]
			],
			arguments
		);
		expect(methodObject.call).toHaveBeenCalledWith(
			eventBinderInstance,
			eventBinderInstance,
			eventBinderInstance,
			arguments
		);
		expect(methodObject2.call).toHaveBeenCalledWith(
			eventBinderInstance2,
			eventBinderInstance2,
			eventBinderInstance2,
			arguments
		);
	});
	
	it('will throw error if bind requested when this is defined within interface', function(){
		var expectedFatal = new Picket.Member.Event.Fatal('INTERACTION_WITH_ABSTRACT');
		var eventObject = new Picket.Member.Event(
			definition,
			true,
			undefined,
			typeChecker,
			accessController
		);
		expect(function(){
			eventObject.requestBind(eventOwnerInstance, accessInstance);
		}).toThrow(expectedFatal);
	});
	
	it('will throw error if triggered when this is defined within interface', function(){
		var expectedFatal = new Picket.Member.Event.Fatal('INTERACTION_WITH_ABSTRACT');
		var eventObject = new Picket.Member.Event(
			definition,
			true,
			undefined,
			typeChecker,
			accessController
		);
		expect(function(){
			eventObject.trigger([[eventBinderInstance, methodObject]], ['String argument', 123]);
		}).toThrow(expectedFatal);
	});
	
});
