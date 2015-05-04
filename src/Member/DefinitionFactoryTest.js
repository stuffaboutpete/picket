describe('Member.DefinitionFactory', function(){
	
	var factory;
	var propertyDefinitionFactory;
	var methodDefinitionFactory;
	var eventDefinitionFactory;
	var constantDefinitionFactory;
	
	beforeEach(function(){
		propertyDefinitionFactory = new Picket.Member.Property.Definition.Factory();
		methodDefinitionFactory = new Picket.Member.Method.Definition.Factory();
		eventDefinitionFactory = new Picket.Member.Event.Definition.Factory();
		constantDefinitionFactory = new Picket.Member.Constant.Definition.Factory();
		factory = new Picket.Member.DefinitionFactory(
			propertyDefinitionFactory,
			methodDefinitionFactory,
			eventDefinitionFactory,
			constantDefinitionFactory
		);
	});
	
	var getInvalidMemberFatal = function(memberType, signature){
		return new Picket.Member[memberType].Definition(
			'SIGNATURE_NOT_RECOGNISED',
			'Provided signature: ' + signature
		);
	};
	
	it('can be instantiated with property, method, event and constant factories', function(){
		var factory = new Picket.Member.DefinitionFactory(
			propertyDefinitionFactory,
			methodDefinitionFactory,
			eventDefinitionFactory,
			constantDefinitionFactory
		);
		expect(factory instanceof Picket.Member.DefinitionFactory).toBe(true);
	});
	
	it('throws error if property factory is not provided', function(){
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'PROPERTY_DEFINITION_FACTORY_NOT_PROVIDED'
		);
		expect(function(){
			new Picket.Member.DefinitionFactory(
				undefined,
				methodDefinitionFactory,
				eventDefinitionFactory,
				constantDefinitionFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if method factory is not provided', function(){
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'METHOD_DEFINITION_FACTORY_NOT_PROVIDED'
		);
		expect(function(){
			new Picket.Member.DefinitionFactory(
				propertyDefinitionFactory,
				undefined,
				eventDefinitionFactory,
				constantDefinitionFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if event factory is not provided', function(){
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'EVENT_DEFINITION_FACTORY_NOT_PROVIDED'
		);
		expect(function(){
			new Picket.Member.DefinitionFactory(
				propertyDefinitionFactory,
				methodDefinitionFactory,
				undefined,
				constantDefinitionFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if constant factory is not provided', function(){
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'CONSTANT_DEFINITION_FACTORY_NOT_PROVIDED'
		);
		expect(function(){
			new Picket.Member.DefinitionFactory(
				propertyDefinitionFactory,
				methodDefinitionFactory,
				eventDefinitionFactory
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if build is called with no signature', function(){
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ factory.build(); }).toThrow(expectedFatal);
	});
	
	it('throws error if build is called with non string signature', function(){
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: object'
		);
		expect(function(){ factory.build([1]); }).toThrow(expectedFatal);
	});
	
	it('throws error error if no factory can recognise signature', function(){
		var signature = 'example signature';
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'INVALID_SIGNATURE',
			'Provided signature: ' + signature
		);
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Method',
				signature
			);
		});
		spyOn(eventDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Event',
				signature
			);
		});
		spyOn(constantDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Constant',
				signature
			);
		});
		expect(function(){ factory.build(signature); }).toThrow(expectedFatal);
		expect(eventDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(propertyDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(methodDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(constantDefinitionFactory.build).toHaveBeenCalledWith(signature);
	});
	
	it('calls property factory initially and no other if successful', function(){
		var signature = 'example signature';
		spyOn(propertyDefinitionFactory, 'build').and.returnValue({});
		spyOn(methodDefinitionFactory, 'build');
		spyOn(eventDefinitionFactory, 'build');
		spyOn(constantDefinitionFactory, 'build');
		factory.build(signature);
		expect(propertyDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(methodDefinitionFactory.build).not.toHaveBeenCalled();
		expect(eventDefinitionFactory.build).not.toHaveBeenCalled();
		expect(constantDefinitionFactory.build).not.toHaveBeenCalled();
	});
	
	it('calls method factory if property factory throws error', function(){
		var signature = 'example signature';
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.returnValue({});
		spyOn(eventDefinitionFactory, 'build');
		spyOn(constantDefinitionFactory, 'build');
		factory.build(signature);
		expect(propertyDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(methodDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(eventDefinitionFactory.build).not.toHaveBeenCalled();
		expect(constantDefinitionFactory.build).not.toHaveBeenCalled();
	});
	
	it('calls event factory if property and method factories throw error', function(){
		var signature = 'example signature';
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Method',
				signature
			);
		});
		spyOn(eventDefinitionFactory, 'build').and.returnValue({});
		spyOn(constantDefinitionFactory, 'build');
		factory.build(signature);
		expect(propertyDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(methodDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(eventDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(constantDefinitionFactory.build).not.toHaveBeenCalled();
	});
	
	it('calls constant factory if property, method and event factories throw error', function(){
		var signature = 'example signature';
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Method',
				signature
			);
		});
		spyOn(eventDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Event',
				signature
			);
		});
		spyOn(constantDefinitionFactory, 'build').and.returnValue({});
		factory.build(signature);
		expect(propertyDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(methodDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(eventDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(constantDefinitionFactory.build).toHaveBeenCalledWith(signature);
	});
	
	it('returns object returned from property factory on build', function(){
		var propertyDefinitionObject = {};
		spyOn(propertyDefinitionFactory, 'build').and.returnValue(propertyDefinitionObject);
		expect(factory.build('example signature')).toBe(propertyDefinitionObject);
	});
	
	it('returns object returned from method factory on build', function(){
		var signature = 'example signature';
		var methodDefinitionObject = {};
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.returnValue(methodDefinitionObject);
		expect(factory.build(signature)).toBe(methodDefinitionObject);
	});
	
	it('returns object returned from event factory on build', function(){
		var signature = 'example signature';
		var eventDefinitionObject = {};
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Method',
				signature
			);
		});
		spyOn(eventDefinitionFactory, 'build').and.returnValue(eventDefinitionObject);
		expect(factory.build(signature)).toBe(eventDefinitionObject);
	});
	
	it('returns object returned from constant factory on build', function(){
		var signature = 'example signature';
		var constantDefinitionObject = {};
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Method',
				signature
			);
		});
		spyOn(eventDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Event',
				signature
			);
		});
		spyOn(constantDefinitionFactory, 'build').and.returnValue(constantDefinitionObject);
		expect(factory.build(signature)).toBe(constantDefinitionObject);
	});
	
	it('throws error if property factory does not return an object', function(){
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'FACTORY_RETURNED_NON_OBJECT',
			'Returned type: undefined'
		);
		spyOn(propertyDefinitionFactory, 'build').and.returnValue();
		expect(function(){ factory.build('example signature'); }).toThrow(expectedFatal);
	});
	
	it('throws error if method factory does not return an object', function(){
		var signature = 'example signature';
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'FACTORY_RETURNED_NON_OBJECT',
			'Returned type: number'
		);
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.returnValue(123);
		expect(function(){ factory.build(signature); }).toThrow(expectedFatal);
	});
	
	it('throws error if event factory does not return an object', function(){
		var signature = 'example signature';
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'FACTORY_RETURNED_NON_OBJECT',
			'Returned type: undefined'
		);
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Method',
				signature
			);
		});
		spyOn(eventDefinitionFactory, 'build').and.returnValue();
		expect(function(){ factory.build(signature); }).toThrow(expectedFatal);
	});
	
	it('throws error if constant factory does not return an object', function(){
		var signature = 'example signature';
		var expectedFatal = new Picket.Member.DefinitionFactory.Fatal(
			'FACTORY_RETURNED_NON_OBJECT',
			'Returned type: string'
		);
		spyOn(propertyDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Property',
				signature
			);
		});
		spyOn(methodDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Method',
				signature
			);
		});
		spyOn(eventDefinitionFactory, 'build').and.callFake(function(){
			throw new getInvalidMemberFatal(
				'Event',
				signature
			);
		});
		spyOn(constantDefinitionFactory, 'build').and.returnValue('');
		expect(function(){ factory.build(signature); }).toThrow(expectedFatal);
	});
	
	it('does not call property factory if isFunction argument is true', function(){
		var signature = 'example signature';
		spyOn(propertyDefinitionFactory, 'build');
		spyOn(methodDefinitionFactory, 'build').and.returnValue({});
		spyOn(eventDefinitionFactory, 'build');
		spyOn(constantDefinitionFactory, 'build');
		factory.build(signature, true);
		expect(propertyDefinitionFactory.build).not.toHaveBeenCalled();
		expect(methodDefinitionFactory.build).toHaveBeenCalledWith(signature);
		expect(eventDefinitionFactory.build).not.toHaveBeenCalled();
		expect(constantDefinitionFactory.build).not.toHaveBeenCalled();
	});
	
});
