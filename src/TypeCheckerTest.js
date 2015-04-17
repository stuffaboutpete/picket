describe('TypeChecker', function(){
	
	// @todo Regex
	
	var checker;
	
	beforeEach(function(){
		checker = new ClassyJS.TypeChecker();
		window.My = {};
		window.My.Example = function(){};
		window.My.Example.Nested = function(){};
	});
	
	it('throws error if second argument to isValidType is not a string', function(){
		var expectedFatal = new ClassyJS.TypeChecker.Fatal('NON_STRING_TYPE_IDENTIFIER');
		expect(function(){ checker.isValidType('example'); }).toThrow(expectedFatal);
		expect(function(){ checker.isValidType('example', {}); }).toThrow(expectedFatal);
		expect(function(){ checker.isValidType('example', true); }).toThrow(expectedFatal);
	});
	
	it('will verify valid string type', function(){
		expect(checker.isValidType('example', 'string')).toBe(true);
	});
	
	it('will reject invalid string type', function(){
		expect(checker.isValidType(123, 'string')).toBe(false);
		expect(checker.isValidType(true, 'string')).toBe(false);
		expect(checker.isValidType(undefined, 'string')).toBe(false);
		expect(checker.isValidType(null, 'string')).toBe(false);
		expect(checker.isValidType(['string in array'], 'string')).toBe(false);
		expect(checker.isValidType({}, 'string')).toBe(false);
		expect(checker.isValidType(function(){}, 'string')).toBe(false);
	});
	
	it('will verify valid number type', function(){
		expect(checker.isValidType(123, 'number')).toBe(true);
		expect(checker.isValidType(1.23, 'number')).toBe(true);
		expect(checker.isValidType(-1.23, 'number')).toBe(true);
		expect(checker.isValidType(0, 'number')).toBe(true);
	});
	
	it('will reject invalid number type', function(){
		expect(checker.isValidType('example', 'number')).toBe(false);
		expect(checker.isValidType('123', 'number')).toBe(false);
		expect(checker.isValidType(true, 'number')).toBe(false);
		expect(checker.isValidType(undefined, 'number')).toBe(false);
		expect(checker.isValidType(null, 'number')).toBe(false);
		expect(checker.isValidType([0], 'number')).toBe(false);
		expect(checker.isValidType({}, 'number')).toBe(false);
		expect(checker.isValidType(function(){}, 'number')).toBe(false);
	});
	
	it('will verify valid boolean type', function(){
		expect(checker.isValidType(true, 'boolean')).toBe(true);
		expect(checker.isValidType(false, 'boolean')).toBe(true);
	});
	
	it('will reject invalid boolean type', function(){
		expect(checker.isValidType('example', 'boolean')).toBe(false);
		expect(checker.isValidType(123, 'boolean')).toBe(false);
		expect(checker.isValidType(undefined, 'boolean')).toBe(false);
		expect(checker.isValidType(null, 'boolean')).toBe(false);
		expect(checker.isValidType(['example'], 'boolean')).toBe(false);
		expect(checker.isValidType({}, 'boolean')).toBe(false);
		expect(checker.isValidType(function(){}, 'boolean')).toBe(false);
	});
	
	it('will verify valid undefined type', function(){
		expect(checker.isValidType(undefined, 'undefined')).toBe(true);
	});
	
	it('will reject invalid undefined type', function(){
		expect(checker.isValidType('example', 'undefined')).toBe(false);
		expect(checker.isValidType(123, 'undefined')).toBe(false);
		expect(checker.isValidType(true, 'undefined')).toBe(false);
		expect(checker.isValidType(null, 'undefined')).toBe(false);
		expect(checker.isValidType(['example'], 'undefined')).toBe(false);
		expect(checker.isValidType({}, 'undefined')).toBe(false);
		expect(checker.isValidType(function(){}, 'undefined')).toBe(false);
	});
	
	it('will verify valid null type', function(){
		expect(checker.isValidType(null, 'null')).toBe(true);
	});
	
	it('will reject invalid null type', function(){
		expect(checker.isValidType('example', 'null')).toBe(false);
		expect(checker.isValidType(123, 'null')).toBe(false);
		expect(checker.isValidType(true, 'null')).toBe(false);
		expect(checker.isValidType(undefined, 'null')).toBe(false);
		expect(checker.isValidType(['example'], 'null')).toBe(false);
		expect(checker.isValidType({}, 'null')).toBe(false);
		expect(checker.isValidType(function(){}, 'null')).toBe(false);
	});
	
	it('will verify valid array type', function(){
		expect(checker.isValidType([1, 2, 3], 'array')).toBe(true);
		expect(checker.isValidType([], 'array')).toBe(true);
		expect(checker.isValidType(new Array(), 'array')).toBe(true);
	});
	
	it('will reject invalid array type', function(){
		expect(checker.isValidType('example', 'array')).toBe(false);
		expect(checker.isValidType(123, 'array')).toBe(false);
		expect(checker.isValidType(true, 'array')).toBe(false);
		expect(checker.isValidType(undefined, 'array')).toBe(false);
		expect(checker.isValidType(null, 'array')).toBe(false);
		expect(checker.isValidType({}, 'array')).toBe(false);
		expect(checker.isValidType(function(){}, 'array')).toBe(false);
	});
	
	it('will verify valid function type', function(){
		expect(checker.isValidType(function(){}, 'function')).toBe(true);
		expect(checker.isValidType(new Function(), 'function')).toBe(true);
	});
	
	it('will reject invalid function type', function(){
		expect(checker.isValidType('example', 'function')).toBe(false);
		expect(checker.isValidType(123, 'function')).toBe(false);
		expect(checker.isValidType(true, 'function')).toBe(false);
		expect(checker.isValidType(undefined, 'function')).toBe(false);
		expect(checker.isValidType(null, 'function')).toBe(false);
		expect(checker.isValidType([0], 'function')).toBe(false);
		expect(checker.isValidType({}, 'function')).toBe(false);
	});
	
	it('will verify valid object type', function(){
		expect(checker.isValidType({}, 'object')).toBe(true);
		expect(checker.isValidType({ key: 'value' }, 'object')).toBe(true);
		expect(checker.isValidType(document.getElementsByTagName('head')[0], 'object')).toBe(true);
	});
	
	it('will reject invalid object type', function(){
		expect(checker.isValidType('example', 'object')).toBe(false);
		expect(checker.isValidType(123, 'object')).toBe(false);
		expect(checker.isValidType(true, 'object')).toBe(false);
		expect(checker.isValidType(undefined, 'object')).toBe(false);
		expect(checker.isValidType(null, 'object')).toBe(false);
		expect(checker.isValidType([0], 'object')).toBe(false);
		expect(checker.isValidType(function(){}, 'object')).toBe(false);
	});
	
	it('will verify valid specific object type', function(){
		expect(checker.isValidType(
			document.getElementsByTagName('head')[0],
			'HTMLElement'
		)).toBe(true);
	});
	
	it('will reject invalid object type', function(){
		expect(checker.isValidType('example', 'HTMLElement')).toBe(false);
		expect(checker.isValidType(123, 'HTMLElement')).toBe(false);
		expect(checker.isValidType(true, 'HTMLElement')).toBe(false);
		expect(checker.isValidType(undefined, 'HTMLElement')).toBe(false);
		expect(checker.isValidType(null, 'HTMLElement')).toBe(false);
		expect(checker.isValidType({}, 'HTMLElement')).toBe(false);
		expect(checker.isValidType([0], 'HTMLElement')).toBe(false);
		expect(checker.isValidType(function(){}, 'HTMLElement')).toBe(false);
	});
	
	it('will verify valid namespaced object', function(){
		expect(checker.isValidType(new My.Example(), 'My.Example')).toBe(true);
		expect(checker.isValidType(new My.Example.Nested(), 'My.Example.Nested')).toBe(true);
	});
	
	it('will reject invalid namespace object', function(){
		expect(checker.isValidType('example', 'My.Example')).toBe(false);
		expect(checker.isValidType(123, 'My.Example')).toBe(false);
		expect(checker.isValidType(true, 'My.Example')).toBe(false);
		expect(checker.isValidType(undefined, 'My.Example')).toBe(false);
		expect(checker.isValidType(null, 'My.Example')).toBe(false);
		expect(checker.isValidType({}, 'My.Example')).toBe(false);
		expect(checker.isValidType([0], 'My.Example')).toBe(false);
		expect(checker.isValidType(function(){}, 'My.Example')).toBe(false);
		expect(checker.isValidType(My, 'My.Example')).toBe(false);
		expect(checker.isValidType(My.Example, 'My.Example')).toBe(false);
		expect(checker.isValidType(My.Example.Nested, 'My.Example')).toBe(false);
		expect(checker.isValidType(new My.Example.Nested(), 'My.Example')).toBe(false);
		expect(checker.isValidType(new My.Example(), 'My.Example.Nested')).toBe(false);
	});
	
	it('will verify valid array of other types', function(){
		expect(checker.isValidType(['one', 'two'], 'string[]')).toBe(true);
		expect(checker.isValidType([1, 2, 3], 'number[]')).toBe(true);
		expect(checker.isValidType([true, false], 'boolean[]')).toBe(true);
		expect(checker.isValidType([undefined], 'undefined[]')).toBe(true);
		expect(checker.isValidType([null, null], 'null[]')).toBe(true);
		expect(checker.isValidType([[1, 2], [3, 4]], 'array[]')).toBe(true);
		expect(checker.isValidType([function(){}, function(){}], 'function[]')).toBe(true);
		expect(checker.isValidType([{}], 'object[]')).toBe(true);
		expect(checker.isValidType(
			[document.getElementsByTagName('*')[0]],
			'HTMLElement[]'
		)).toBe(true);
		expect(checker.isValidType(
			[new My.Example(), new My.Example()],
			'My.Example[]'
		)).toBe(true);
	});
	
	it('will reject invalid array of other types', function(){
		expect(checker.isValidType([1, 'two'], 'string[]')).toBe(false);
		expect(checker.isValidType([1, 'two'], 'number[]')).toBe(false);
		expect(checker.isValidType([1], 'boolean[]')).toBe(false);
		expect(checker.isValidType([null], 'undefined[]')).toBe(false);
		expect(checker.isValidType([undefined], 'null[]')).toBe(false);
		expect(checker.isValidType([{}, []], 'array[]')).toBe(false);
		expect(checker.isValidType([new RegExp()], 'function[]')).toBe(false);
		expect(checker.isValidType([[1, 2], [3, 4]], 'object[]')).toBe(false);
		expect(checker.isValidType(
			[1, document.getElementsByTagName('*')[0]],
			'HTMLElement[]'
		)).toBe(false);
		expect(checker.isValidType([My.Example, My.Example], 'My.Example[]')).toBe(false);
		expect(checker.isValidType(
			[new My.Example(), new My.Example.Nested()],
			'My.Example[]'
		)).toBe(false);
	});
	
	it('will verify empty arrays of specific types', function(){
		expect(checker.isValidType([], 'string[]')).toBe(true);
		expect(checker.isValidType([], 'number[]')).toBe(true);
		expect(checker.isValidType([], 'boolean[]')).toBe(true);
		expect(checker.isValidType([], 'undefined[]')).toBe(true);
		expect(checker.isValidType([], 'null[]')).toBe(true);
		expect(checker.isValidType([], 'array[]')).toBe(true);
		expect(checker.isValidType([], 'function[]')).toBe(true);
		expect(checker.isValidType([], 'object[]')).toBe(true);
		expect(checker.isValidType([], 'HTMLElement[]')).toBe(true);
	});
	
	it('will verify valid instance of interface', function(){
		var spy = jasmine.createSpyObj('spy', ['conformsTo']);
		spy.conformsTo.and.returnValue(true);
		expect(checker.isValidType(spy, 'My.IInterface')).toBe(true);
		expect(spy.conformsTo).toHaveBeenCalledWith('My.IInterface');
	});
	
	it('will reject non instance of interface', function(){
		var spy = jasmine.createSpyObj('spy', ['conformsTo']);
		spy.conformsTo.and.returnValue(false);
		expect(checker.isValidType(spy, 'My.IInterface')).toBe(false);
	});
	
	it('allows mixed type which ignores type checking', function(){
		expect(checker.isValidType('string', 'mixed')).toBe(true);
		expect(checker.isValidType(123, 'mixed')).toBe(true);
		expect(checker.isValidType(true, 'mixed')).toBe(true);
		expect(checker.isValidType(undefined, 'mixed')).toBe(true);
		expect(checker.isValidType(null, 'mixed')).toBe(true);
		expect(checker.isValidType([1, 2, 3], 'mixed')).toBe(true);
		expect(checker.isValidType(function(){}, 'mixed')).toBe(true);
		expect(checker.isValidType({}, 'mixed')).toBe(true);
	});
	
	it('will verify multi-typed argument', function(){
		expect(checker.isValidType('string', 'string|number')).toBe(true);
		expect(checker.isValidType(123, 'string|number')).toBe(true);
		expect(checker.isValidType({}, 'string|number|object')).toBe(true);
		expect(checker.isValidType(new My.Example(), 'My.Example|boolean')).toBe(true);
		expect(checker.isValidType(true, 'My.Example|boolean')).toBe(true);
		expect(checker.isValidType(['1', '2', '3'], 'string[]|number[]')).toBe(true);
		expect(checker.isValidType([1, 2, 3], 'string[]|number[]')).toBe(true);
	});
	
	it('will reject invalid multi-typed argument', function(){
		expect(checker.isValidType(true, 'string|number')).toBe(false);
		expect(checker.isValidType({}, 'boolean|number')).toBe(false);
		expect(checker.isValidType({}, 'My.Example|string')).toBe(false);
		expect(checker.isValidType([1, '2', 3], 'string[]|number[]')).toBe(false);
	});
	
	it('can accept multiple variables to type check in one call', function(){
		expect(checker.areValidTypes(
			['example', 123, { key: 'value' }, ['one', 'two']],
			['string', 'number', 'object', 'string[]']
		)).toBe(true);
	});
	
	it('will reject multiple variables if at least one is invalid', function(){
		expect(checker.areValidTypes(
			['example', 123, { key: 'value' }, ['one', 2]],
			['string', 'number', 'object', 'string[]']
		)).toBe(false);
	});
	
	it('throws error if non array values are provided for multi type checking', function(){
		var expectedFatal = new ClassyJS.TypeChecker.Fatal(
			'NON_ARRAY_VALUES',
			'Provided type: string'
		);
		expect(function(){ checker.areValidTypes('example', ['string']) }).toThrow(expectedFatal);
	});
	
	it('throws if non array type identifiers are provided for multi type checking', function(){
		var expectedFatal = new ClassyJS.TypeChecker.Fatal(
			'NON_ARRAY_TYPES',
			'Provided type: string'
		);
		expect(function(){ checker.areValidTypes([123], 'number') }).toThrow(expectedFatal);
	});
	
	it('throws if number of variables does not match type identifiers', function(){
		var expectedFatal = new ClassyJS.TypeChecker.Fatal(
			'VALUE_TYPE_MISMATCH',
			'Values length: 3, Types length: 2'
		);
		expect(function(){
			checker.areValidTypes([1, 2, 3], ['number', 'number']);
		}).toThrow(expectedFatal);
	});
	
});
