describe('Member.Property.Definition', function(){
	
	it('can be instantiated with a signature', function(){
		var property = new Picket.Member.Property.Definition('public myProperty (string)');
		expect(property instanceof Picket.Member.Property.Definition).toBe(true);
	});
	
	it('throws error if instantiated with no signature', function(){
		var expectedFatal = new Picket.Member.Property.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ new Picket.Member.Property.Definition(); }).toThrow(expectedFatal);
	});
	
	it('throws error if instantiated with non string signature', function(){
		var expectedFatal = new Picket.Member.Property.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: object'
		);
		expect(function(){ new Picket.Member.Property.Definition({}); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature is not recognised', function(){
		var expectedFatal = new Picket.Member.Property.Definition.Fatal(
			'SIGNATURE_NOT_RECOGNISED',
			'Provided signature: gibberish'
		);
		expect(function(){
			new Picket.Member.Property.Definition('gibberish');
		}).toThrow(expectedFatal);
	});
	
	it('can return name from signature', function(){
		var propertyDefinition = new Picket.Member.Property.Definition(
			'public myProperty (string)'
		);
		expect(propertyDefinition.getName()).toBe('myProperty');
	});
	
	it('can return access type identifier from signature', function(){
		var propertyDefinition = new Picket.Member.Property.Definition(
			'protected myProperty (string)'
		);
		expect(propertyDefinition.getAccessTypeIdentifier()).toBe('protected');
	});
	
	it('can return type identifier from signature', function(){
		var propertyDefinition = new Picket.Member.Property.Definition(
			'protected myProperty (number[])'
		);
		expect(propertyDefinition.getTypeIdentifier()).toBe('number[]');
	});
	
	it('can parse signature with irregular whitespace', function(){
		var propertyDefinition = new Picket.Member.Property.Definition(
			' 	public	 		   myProperty	 ( 		 object 	) 	 '
		);
		expect(propertyDefinition.getName()).toBe('myProperty');
		expect(propertyDefinition.getAccessTypeIdentifier()).toBe('public');
		expect(propertyDefinition.getTypeIdentifier()).toBe('object');
	});
	
});
