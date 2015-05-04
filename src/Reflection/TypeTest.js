describe('Reflection.Type', function(){
	
	var mocker;
	var originalInstantiator;
	var reflectionFactory;
	var reflectionType;
	var reflectionClass;
	
	beforeEach(function(){
		mocker = new Picket.Mocker();
		originalInstantiator = Picket._instantiator;
		Picket._instantiator = mocker.getMock(Picket.Instantiator);
		typeChecker = mocker.getMock(Picket.TypeChecker);
		spyOn(Picket._instantiator, 'getTypeChecker').and.returnValue(typeChecker);
	});
	
	afterEach(function(){
		Picket._instantiator = originalInstantiator;
	});
	
	it('throws error if non-string identifier is provided', function(){
		var expectedFatal = new Picket.Reflection.Type.Fatal(
			'NON_STRING_IDENTIFIER_PROVIDED',
			'Provided type: number'
		);
		expect(function(){ new Reflection.Type(123); }).toThrow(expectedFatal);
	});
	
	it('returns declared identifier', function(){
		var reflectionType = new Reflection.Type('string');
		expect(reflectionType.getIdentifier()).toBe('string');
	});
	
	it('indicates if a provided value matches the type', function(){
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		var reflectionType = new Reflection.Type('string');
		expect(reflectionType.isValidValue('Example')).toBe(true);
		expect(typeChecker.isValidType).toHaveBeenCalledWith('Example', 'string');
	});
	
});
