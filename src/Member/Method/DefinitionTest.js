describe('Member.Method.Definition', function(){
	
	it('can be instantiated with a signature', function(){
		var property = new ClassyJS.Member.Method.Definition('public myMethod () -> undefined');
		expect(property instanceof ClassyJS.Member.Method.Definition).toBe(true);
	});
	
	it('throws error if instantiated with no signature', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ new ClassyJS.Member.Method.Definition(); }).toThrow(expectedFatal);
	});
	
	it('throws error if instantiated with non string signature', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: object'
		);
		expect(function(){ new ClassyJS.Member.Method.Definition({}); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature is not recognised', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'SIGNATURE_NOT_RECOGNISED',
			'Provided signature: gibberish'
		);
		expect(function(){
			new ClassyJS.Member.Method.Definition('gibberish');
		}).toThrow(expectedFatal);
	});
	
	it('can return name from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'public myMethod () -> undefined'
		);
		expect(propertyDefinition.getName()).toBe('myMethod');
	});
	
	it('can return access type identifier from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod () -> undefined'
		);
		expect(propertyDefinition.getAccessTypeIdentifier()).toBe('protected');
	});
	
	it('can return true abstract status from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'abstract protected myMethod () -> undefined'
		);
		expect(propertyDefinition.isAbstract()).toBe(true);
	});
	
	it('can return false abstract status from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod () -> undefined'
		);
		expect(propertyDefinition.isAbstract()).toBe(false);
	});
	
	it('can return true static status from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'static protected myMethod () -> undefined'
		);
		expect(propertyDefinition.isStatic()).toBe(true);
	});
	
	it('can return false static status from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod () -> undefined'
		);
		expect(propertyDefinition.isStatic()).toBe(false);
	});
	
	it('can identify static, abstract and access type keywords in any order', function(){
		var signatures = [
			'static abstract public',
			'static public abstract',
			'abstract static public',
			'abstract public static',
			'public static abstract',
			'public abstract static'
		];
		for (var i in signatures) {
			var propertyDefinition = new ClassyJS.Member.Method.Definition(
				signatures[i] + ' myMethod () -> undefined'
			);
			expect(propertyDefinition.isStatic()).toBe(true);
			expect(propertyDefinition.isAbstract()).toBe(true);
			expect(propertyDefinition.getAccessTypeIdentifier()).toBe('public');
		}
	});
	
	it('can return single argument type identifier from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (number) -> undefined'
		);
		expect(propertyDefinition.getArgumentTypeIdentifiers()).toEqual(['number']);
	});
	
	it('can return multiple argument type identifiers from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod ([number], object, string) -> undefined'
		);
		expect(propertyDefinition.getArgumentTypeIdentifiers()).toEqual([
			'[number]',
			'object',
			'string'
		]);
	});
	
	it('can return return argument type identifier from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod () -> string'
		);
		expect(propertyDefinition.getReturnTypeIdentifier()).toBe('string');
	});
	
	it('can parse complex signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'abstract static protected myMethod (number, string, null) -> [string]'
		);
		expect(propertyDefinition.isAbstract()).toBe(true);
		expect(propertyDefinition.isStatic()).toBe(true);
		expect(propertyDefinition.getAccessTypeIdentifier()).toBe('protected');
		expect(propertyDefinition.getName()).toBe('myMethod');
		expect(propertyDefinition.getArgumentTypeIdentifiers()).toEqual([
			'number',
			'string',
			'null'
		]);
		expect(propertyDefinition.getReturnTypeIdentifier()).toBe('[string]');
	});
	
	it('can parse signature with irregular whitespace', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			' 	abstract 	 static 	 	public 	' +
			' someMethod( 	object,	  number,  	[string] 	)	 -> 	HTMLElement 	'
		);
		expect(propertyDefinition.isAbstract()).toBe(true);
		expect(propertyDefinition.isStatic()).toBe(true);
		expect(propertyDefinition.getAccessTypeIdentifier()).toBe('public');
		expect(propertyDefinition.getName()).toBe('someMethod');
		expect(propertyDefinition.getArgumentTypeIdentifiers()).toEqual([
			'object',
			'number',
			'[string]'
		]);
		expect(propertyDefinition.getReturnTypeIdentifier()).toBe('HTMLElement');
	});
	
});
