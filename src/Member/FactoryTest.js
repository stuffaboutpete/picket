describe('Member.Factory', function(){
	
	var factory;
	var definitionFactory;
	var propertyFactory;
	var methodFactory;
	var eventFactory;
	var constantFactory;
	var propertyDefinition;
	var methodDefinition;
	var eventDefinition;
	var constantDefinition;
	var propertyObject;
	var methodObject;
	var eventObject;
	var constantObject;
	var typeChecker;
	var accessController;
	
	beforeEach(function(){
		definitionFactory = new Picket.Member.DefinitionFactory(
			new Picket.Member.Property.Definition.Factory(),
			new Picket.Member.Method.Definition.Factory(),
			new Picket.Member.Event.Definition.Factory(),
			new Picket.Member.Constant.Definition.Factory()
		);
		propertyFactory = new Picket.Member.Property.Factory();
		methodFactory = new Picket.Member.Method.Factory();
		eventFactory = new Picket.Member.Event.Factory();
		constantFactory = new Picket.Member.Constant.Factory();
		propertyDefinition = new Picket.Member.Property.Definition('public myProperty (string)');
		methodDefinition = new Picket.Member.Method.Definition('public myMethod () -> undefined');
		eventDefinition = new Picket.Member.Event.Definition('public event myEvent()');
		constantDefinition = new Picket.Member.Constant.Definition('public constant MY_CONSTANT');
		typeChecker = new Picket.TypeChecker(new Picket.TypeChecker.ReflectionFactory());
		accessController = new Picket.Access.Controller(
			new Picket.Registry.Type(
				new Picket.NamespaceManager()
			)
		);
		factory = new Picket.Member.Factory(
			definitionFactory,
			propertyFactory,
			methodFactory,
			eventFactory,
			constantFactory,
			typeChecker,
			accessController
		);
		propertyObject = new Picket.Member.Property(
			propertyDefinition,
			false,
			null,
			typeChecker,
			accessController
		);
		methodObject = new Picket.Member.Method(
			new Picket.Member.Method.Definition('public myMethod () -> undefined'),
			false,
			function(){},
			typeChecker,
			accessController
		);
		eventObject = new Picket.Member.Event(
			new Picket.Member.Event.Definition('public event myEvent ()'),
			false,
			undefined,
			typeChecker,
			accessController
		);
		constantObject = new Picket.Member.Constant(
			new Picket.Member.Constant.Definition('public constant MY_CONSTANT'),
			false,
			undefined,
			typeChecker,
			accessController
		);
	});
	
	it('can be instantiated', function(){
		var factory = new Picket.Member.Factory(
			definitionFactory,
			propertyFactory,
			methodFactory,
			eventFactory,
			constantFactory,
			typeChecker,
			accessController
		);
		expect(factory instanceof Picket.Member.Factory).toBe(true);
	});
	
	it('throws error if no member definition factory is provided', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NO_DEFINITION_FACTORY_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			new Picket.Member.Factory(
				{},
				propertyFactory,
				methodFactory,
				eventFactory,
				constantFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no property factory is provided', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NO_PROPERTY_FACTORY_PROVIDED',
			'Provided type: string'
		);
		expect(function(){
			new Picket.Member.Factory(
				definitionFactory,
				'string',
				methodFactory,
				eventFactory,
				constantFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no method factory is provided', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NO_METHOD_FACTORY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Factory(
				definitionFactory,
				propertyFactory,
				undefined,
				eventFactory,
				constantFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no event factory is provided', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NO_EVENT_FACTORY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Factory(
				definitionFactory,
				propertyFactory,
				methodFactory,
				undefined,
				constantFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no constant factory is provided', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NO_CONSTANT_FACTORY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Factory(
				definitionFactory,
				propertyFactory,
				methodFactory,
				eventFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no type checker is provided', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NO_TYPE_CHECKER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Factory(
				definitionFactory,
				propertyFactory,
				methodFactory,
				eventFactory,
				constantFactory,
				undefined,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no access controller is provided', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NO_ACCESS_CONTROLLER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Factory(
				definitionFactory,
				propertyFactory,
				methodFactory,
				eventFactory,
				constantFactory,
				typeChecker
			);
		}).toThrow(expectedFatal);
	});
	
	it('accepts call to build method', function(){
		spyOn(definitionFactory, 'build').and.returnValue(propertyDefinition);
		spyOn(propertyFactory, 'build').and.returnValue(propertyObject);
		factory.build('example signature', false);
	});
	
	it('throws error if build is called with non string argument', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NON_STRING_SIGNATURE_PROVIDED',
			'Provided type: number'
		);
		expect(function(){ factory.build(123, false) }).toThrow(expectedFatal);
	});
	
	it('throws error if build is called with empty string argument', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal('EMPTY_STRING_SIGNATURE_PROVIDED');
		expect(function(){ factory.build('', false) }).toThrow(expectedFatal);
	});
	
	it('throws error if build is called with non boolean interface indicator', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NON_BOOLEAN_INTERFACE_INDICATOR_PROVIDED',
			'Provided type: number'
		);
		expect(function(){ factory.build('example signature', 123) }).toThrow(expectedFatal);
	});
	
	it('passes signature to definition factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(propertyDefinition);
		spyOn(propertyFactory, 'build').and.returnValue(propertyObject);
		factory.build('example signature', false);
		expect(definitionFactory.build).toHaveBeenCalledWith('example signature', false);
	});
	
	it('passes boolean to definition factory to describe if value is a function', function(){
		spyOn(definitionFactory, 'build').and.returnValue(propertyDefinition);
		spyOn(propertyFactory, 'build').and.returnValue(propertyObject);
		factory.build('example signature', false, 123);
		factory.build('example signature', false, function(){});
		expect(definitionFactory.build.calls.count()).toBe(2);
		expect(definitionFactory.build.calls.argsFor(0)[1]).toBe(false);
		expect(definitionFactory.build.calls.argsFor(1)[1]).toBe(true);
	});
	
	it('will pass relevent arguments to property factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(propertyDefinition);
		spyOn(propertyFactory, 'build').and.returnValue(propertyObject);
		factory.build('example signature', false, 'Value');
		expect(propertyFactory.build).toHaveBeenCalledWith(
			propertyDefinition,
			false,
			'Value',
			typeChecker,
			accessController
		);
	});
	
	it('will pass relevent arguments to method factory', function(){
		var methodImplementation = function(){};
		spyOn(definitionFactory, 'build').and.returnValue(methodDefinition);
		spyOn(methodFactory, 'build').and.returnValue(methodObject);
		factory.build('example signature', false, methodImplementation);
		expect(methodFactory.build).toHaveBeenCalledWith(
			methodDefinition,
			false,
			methodImplementation,
			typeChecker,
			accessController
		);
	});
	
	it('will pass relevent arguments to event factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(eventDefinition);
		spyOn(eventFactory, 'build').and.returnValue(eventObject);
		factory.build('example signature', true, 0);
		expect(eventFactory.build).toHaveBeenCalledWith(
			eventDefinition,
			true,
			undefined,
			typeChecker,
			accessController
		);
	});
	
	it('will pass relevent arguments to constant factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(constantDefinition);
		spyOn(constantFactory, 'build').and.returnValue(constantObject);
		factory.build('example signature', false, 'Value');
		expect(constantFactory.build).toHaveBeenCalledWith(
			constantDefinition,
			false,
			'Value',
			typeChecker,
			accessController
		);
	});
	
	it('will return property returned from property factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(propertyDefinition);
		spyOn(propertyFactory, 'build').and.returnValue(propertyObject);
		expect(factory.build('example signature', false)).toBe(propertyObject);
	});
	
	it('will return method returned from method factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(methodDefinition);
		spyOn(methodFactory, 'build').and.returnValue(methodObject);
		expect(factory.build('example signature', false)).toBe(methodObject);
	});
	
	it('will return event returned from event factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(eventDefinition);
		spyOn(eventFactory, 'build').and.returnValue(eventObject);
		expect(factory.build('example signature', false)).toBe(eventObject);
	});
	
	it('will return constant returned from constant factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(constantDefinition);
		spyOn(constantFactory, 'build').and.returnValue(constantObject);
		expect(factory.build('example signature', false)).toBe(constantObject);
	});
	
	it('will throw error if definition factory returns non definition', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NON_DEFINITION_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature', false); }).toThrow(expectedFatal);
	});
	
	it('will throw error if property factory returns non property', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NON_PROPERTY_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue(propertyDefinition);
		spyOn(propertyFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature', false); }).toThrow(expectedFatal);
	});
	
	it('will throw error if method factory returns non method', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NON_METHOD_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue(methodDefinition);
		spyOn(methodFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature', false); }).toThrow(expectedFatal);
	});
	
	it('will throw error if event factory returns non event', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NON_EVENT_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue(eventDefinition);
		spyOn(eventFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature', false); }).toThrow(expectedFatal);
	});
	
	it('will throw error if constant factory returns non constant', function(){
		var expectedFatal = new Picket.Member.Factory.Fatal(
			'NON_CONSTANT_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue(constantDefinition);
		spyOn(constantFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature', false); }).toThrow(expectedFatal);
	});
	
});
