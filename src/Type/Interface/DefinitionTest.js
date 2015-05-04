describe('Type.Interface.Definition', function(){
	
	it('can be instantiated with a signature', function(){
		var interfaceDefinition = new Picket.Type.Interface.Definition('interface IMyInterface');
		expect(interfaceDefinition instanceof Picket.Type.Interface.Definition).toBe(true);
	});
	
	it('throws error if instantiated with no signature', function(){
		var expectedFatal = new Picket.Type.Interface.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ new Picket.Type.Interface.Definition(); }).toThrow(expectedFatal);
	});
	
	it('throws error if instantiated with non string signature', function(){
		var expectedFatal = new Picket.Type.Interface.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: number'
		);
		expect(function(){ new Picket.Type.Interface.Definition(123); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature does not contain \'interface\' keyword', function(){
		var expectedFatal = new Picket.Type.Interface.Definition.Fatal(
			'MISSING_KEYWORD_INTERFACE'
		);
		expect(function(){
			new Picket.Type.Interface.Definition('IMyInterface');
		}).toThrow(expectedFatal);
	});
	
	it('throws error if signature is not recognised', function(){
		var expectedFatal = new Picket.Type.Interface.Definition.Fatal(
			'SIGNATURE_NOT_RECOGNISED'
		);
		expect(function(){
			new Picket.Type.Interface.Definition('Something interface Something');
		}).toThrow(expectedFatal);
	});
	
	it('can return name from signature', function(){
		var interfaceDefinition = new Picket.Type.Interface.Definition('interface IMyInterface');
		expect(interfaceDefinition.getName()).toBe('IMyInterface');
	});
	
	it('can parse signature with irregular whitespace', function(){
		var interfaceDefinition = new Picket.Type.Interface.Definition(
			'	 interface 	 IMyInterface 	'
		);
		expect(interfaceDefinition.getName()).toBe('IMyInterface');
	});
	
});
