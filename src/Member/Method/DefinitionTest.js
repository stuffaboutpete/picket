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
	
	it('can identify optional single argument from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (string?) -> undefined'
		);
		expect(propertyDefinition.argumentIsOptional(0)).toBe(true);
	});
	
	it('can identify non-optional single argument from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (string) -> undefined'
		);
		expect(propertyDefinition.argumentIsOptional(0)).toBe(false);
	});
	
	it('can identify multiple optional arguments', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (string, number?, array?) -> undefined'
		);
		expect(propertyDefinition.argumentIsOptional(0)).toBe(false);
		expect(propertyDefinition.argumentIsOptional(1)).toBe(true);
		expect(propertyDefinition.argumentIsOptional(2)).toBe(true);
	});
	
	it('throws error if optional argument appears before non-optional argument', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'INVALID_ARGUMENT_ORDER',
			'Provided signature: protected myMethod (string?, number) -> undefined'
		);
		expect(function(){
			new ClassyJS.Member.Method.Definition(
				'protected myMethod (string?, number) -> undefined'
			);
		}).toThrow(expectedFatal);
	});
	
	it('identifies argument with default value as optional', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (number = 30) -> undefined'
		);
		expect(propertyDefinition.argumentIsOptional(0)).toBe(true);
	});
	
	it('returns default string value for argument', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (string = example) -> undefined'
		);
		expect(propertyDefinition.getDefaultArgumentValue(0)).toBe('example');
		expect(typeof propertyDefinition.getDefaultArgumentValue(0)).toBe('string');
	});
	
	// @todo Identify illegal string args by defining what characters can be included
	
	it('returns default integer value for argument', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (number = 30) -> undefined'
		);
		expect(propertyDefinition.getDefaultArgumentValue(0)).toBe(30);
		expect(typeof propertyDefinition.getDefaultArgumentValue(0)).toBe('number');
	});
	
	it('returns default float value for argument', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (number = 3.2) -> undefined'
		);
		expect(propertyDefinition.getDefaultArgumentValue(0)).toBe(3.2);
		expect(typeof propertyDefinition.getDefaultArgumentValue(0)).toBe('number');
	});
	
	it('throws error when invalid number is provided as default for argument', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'INVALID_ARGUMENT_DEFAULT',
			'Argument type: number; Provided value: example'
		);
		expect(function(){
			new ClassyJS.Member.Method.Definition(
				'protected myMethod (number = example) -> undefined'
			);
		}).toThrow(expectedFatal);
	});
	
	it('returns default boolean value for argument', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (boolean = true) -> undefined'
		);
		expect(propertyDefinition.getDefaultArgumentValue(0)).toBe(true);
		expect(typeof propertyDefinition.getDefaultArgumentValue(0)).toBe('boolean');
	});
	
	it('throws error when invalid boolean is provided as default for argument', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'INVALID_ARGUMENT_DEFAULT',
			'Argument type: boolean; Provided value: example'
		);
		expect(function(){
			new ClassyJS.Member.Method.Definition(
				'protected myMethod (boolean = example) -> undefined'
			);
		}).toThrow(expectedFatal);
	});
	
	it('returns empty array value for optional array argument', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (array = []) -> undefined'
		);
		var defaultValue = propertyDefinition.getDefaultArgumentValue(0);
		expect(defaultValue).toEqual([]);
		expect(Object.prototype.toString.call(defaultValue)).toBe('[object Array]');
		expect(defaultValue.length).toBe(0);
	});
	
	it('throws error when invalid array is provided as default for argument', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'INVALID_ARGUMENT_DEFAULT',
			'Argument type: array; Provided value: example'
		);
		expect(function(){
			new ClassyJS.Member.Method.Definition(
				'protected myMethod (array = example) -> undefined'
			);
		}).toThrow(expectedFatal);
	});
	
	it('returns empty array value for optional typed array argument', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (string[] = []) -> undefined'
		);
		var defaultValue = propertyDefinition.getDefaultArgumentValue(0);
		expect(defaultValue).toEqual([]);
		expect(Object.prototype.toString.call(defaultValue)).toBe('[object Array]');
		expect(defaultValue.length).toBe(0);
	});
	
	it('throws error when invalid typed array is provided as default for argument', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'INVALID_ARGUMENT_DEFAULT',
			'Argument type: string[]; Provided value: example'
		);
		expect(function(){
			new ClassyJS.Member.Method.Definition(
				'protected myMethod (string[] = example) -> undefined'
			);
		}).toThrow(expectedFatal);
	});
	
	it('returns empty object value for optional object argument', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod (object = {}) -> undefined'
		);
		var defaultValue = propertyDefinition.getDefaultArgumentValue(0);
		expect(defaultValue).toEqual({});
	});
	
	it('throws error when invalid object is provided as default for argument', function(){
		var expectedFatal = new ClassyJS.Member.Method.Definition.Fatal(
			'INVALID_ARGUMENT_DEFAULT',
			'Argument type: object; Provided value: example'
		);
		expect(function(){
			new ClassyJS.Member.Method.Definition(
				'protected myMethod (object = example) -> undefined'
			);
		}).toThrow(expectedFatal);
	});
	
	it('can return return argument type identifier from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod () -> string'
		);
		expect(propertyDefinition.getReturnTypeIdentifier()).toBe('string');
	});
	
	it('can return implicit undefined return type from signature', function(){
		var propertyDefinition = new ClassyJS.Member.Method.Definition(
			'protected myMethod ()'
		);
		expect(propertyDefinition.getReturnTypeIdentifier()).toBe('undefined');
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
