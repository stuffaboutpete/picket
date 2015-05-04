describe('Reflection.Argument', function(){
	
	var mocker;
	var originalInstantiator;
	var reflectionFactory;
	var reflectionType;
	var reflectionClass;
	
	beforeEach(function(){
		mocker = new Picket.Mocker();
		originalInstantiator = Picket._instantiator;
		Picket._instantiator = mocker.getMock(Picket.Instantiator);
		reflectionFactory = mocker.getMock(Picket.Reflection.Factory);
		reflectionType = mocker.getMock(Picket.Reflection.Type);
		reflectionClass = mocker.getMock(Picket.Reflection.Class);
		spyOn(Picket._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
	});
	
	afterEach(function(){
		Picket._instantiator = originalInstantiator;
	});
	
	it('throws error if type identifier is not a string', function(){
		var expectedFatal = new Picket.Reflection.Argument.Fatal(
			'NON_STRING_TYPE_IDENTIFIER_SUPPLIED',
			'Provided type: number'
		);
		expect(function(){
			new Reflection.Argument(123, false, undefined, {});
		}).toThrow(expectedFatal);
	});
	
	it('throws error if optional flag is not a boolean', function(){
		var expectedFatal = new Picket.Reflection.Argument.Fatal(
			'NON_BOOLEAN_OPTIONAL_FLAG_SUPPLIED',
			'Provided type: string'
		);
		expect(function(){
			new Reflection.Argument('string', 'true', undefined, {});
		}).toThrow(expectedFatal);
	});
	
	it('throws error if not-optional but default value has been provided', function(){
		var expectedFatal = new Picket.Reflection.Argument.Fatal('UNEXPECTED_DEFAULT_PROVIDED');
		expect(function(){
			new Reflection.Argument('string', false, 'Example', {});
		}).toThrow(expectedFatal);
	});
	
	it('throws error if owner is not either an object, function or string', function(){
		var expectedFatal = new Picket.Reflection.Argument.Fatal(
			'INVALID_OWNER_TYPE_PROVIDED',
			'Provided type: number'
		);
		new Reflection.Argument('string', false, undefined, {});
		new Reflection.Argument('string', false, undefined, function(){});
		new Reflection.Argument('string', false, undefined, 'My.Class');
		expect(function(){
			new Reflection.Argument('string', false, undefined, 123);
		}).toThrow(expectedFatal);
	});
	
	it('will return reflection type object via factory', function(){
		spyOn(reflectionFactory, 'buildType').and.returnValue(reflectionType);
		var reflectionArgument = new Reflection.Argument('string[]', false, undefined, {});
		expect(reflectionArgument.getType()).toBe(reflectionType);
		expect(reflectionFactory.buildType).toHaveBeenCalledWith('string[]');
	});
	
	it('will indicate an argument is not optional', function(){
		var reflectionArgument = new Reflection.Argument('string', false, undefined, {});
		expect(reflectionArgument.isOptional()).toBe(false);
	});
	
	it('will indicate an argument is optional', function(){
		var reflectionArgument = new Reflection.Argument('string', true, undefined, {});
		expect(reflectionArgument.isOptional()).toBe(true);
	});
	
	it('will indicate if optional argument has no default value', function(){
		var reflectionArgument = new Reflection.Argument('string', true, undefined, {});
		expect(reflectionArgument.hasDefaultValue()).toBe(false);
	});
	
	it('will indicate if optional argument has a default value', function(){
		var reflectionArgument = new Reflection.Argument('string', true, 'Example', {});
		expect(reflectionArgument.hasDefaultValue()).toBe(true);
	});
	
	it('will return default value', function(){
		var reflectionArgument = new Reflection.Argument('string', true, 'Example', {});
		expect(reflectionArgument.getDefaultValue()).toBe('Example');
	});
	
	it('will throw error if default value is retrieved when it is undefined', function(){
		var expectedFatal = new Picket.Reflection.Argument.Fatal('NON_DEFAULT_RETRIEVED');
		var reflectionArgument = new Reflection.Argument('string', true, undefined, {});
		expect(function(){ reflectionArgument.getDefaultValue(); }).toThrow(expectedFatal);
	});
	
	it('will return reflection class object via factory', function(){
		var owner = {};
		spyOn(reflectionFactory, 'buildClass').and.returnValue(reflectionClass);
		var reflectionArgument = new Reflection.Argument('string', false, undefined, owner);
		expect(reflectionArgument.getClass()).toBe(reflectionClass);
		expect(reflectionFactory.buildClass).toHaveBeenCalledWith(owner);
	});
	
});
