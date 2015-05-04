describe('Member.Constant.Definition', function(){
	
	it('can be instantiated with a signature', function(){
		var constantDefinition = new Picket.Member.Constant.Definition(
			'public constant MY_CONSTANT'
		);
		expect(constantDefinition instanceof Picket.Member.Constant.Definition).toBe(true);
	});
	
	it('throws error if instantiated with no signature', function(){
		var expectedFatal = new Picket.Member.Constant.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ new Picket.Member.Constant.Definition(); }).toThrow(expectedFatal);
	});
	
	it('throws error if instantiated with non string signature', function(){
		var expectedFatal = new Picket.Member.Constant.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: object'
		);
		expect(function(){ new Picket.Member.Constant.Definition({}); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature is not recognised', function(){
		var expectedFatal = new Picket.Member.Constant.Definition.Fatal(
			'SIGNATURE_NOT_RECOGNISED',
			'Provided signature: gibberish'
		);
		expect(function(){
			new Picket.Member.Constant.Definition('gibberish');
		}).toThrow(expectedFatal);
	});
	
	it('can return name from signature', function(){
		var constantDefinition = new Picket.Member.Constant.Definition(
			'public constant MY_CONSTANT'
		);
		expect(constantDefinition.getName()).toBe('MY_CONSTANT');
	});
	
	it('only recognises capitalized names', function(){
		var expectedFatal = new Picket.Member.Constant.Definition.Fatal(
			'SIGNATURE_NOT_RECOGNISED',
			'Provided signature: public constant myConstant'
		);
		expect(function(){
			new Picket.Member.Constant.Definition('public constant myConstant');
		}).toThrow(expectedFatal);
	});
	
	it('can return access type identifier from signature', function(){
		var constantDefinition = new Picket.Member.Constant.Definition(
			'protected constant MY_CONSTANT'
		);
		expect(constantDefinition.getAccessTypeIdentifier()).toBe('protected');
	});
	
	it('can return type identifier from signature', function(){
		var constantDefinition = new Picket.Member.Constant.Definition(
			'public constant MY_CONSTANT (string)'
		);
		expect(constantDefinition.getTypeIdentifier()).toBe('string');
	});
	
	it('can parse signature with irregular whitespace', function(){
		var constantDefinition = new Picket.Member.Constant.Definition(
			' 	public	 	 constant 	 MY_CONSTANT  	( 	string	 )		'
		);
		expect(constantDefinition.getName()).toBe('MY_CONSTANT');
		expect(constantDefinition.getAccessTypeIdentifier()).toBe('public');
		expect(constantDefinition.getTypeIdentifier()).toBe('string');
	});
	
});
