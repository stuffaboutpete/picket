describe('Reflection', function(){
	
	it('TEMP - allows getting class and then methods and types', function(){
		define('class My.Class', {
			'public myMethod ([string], number) -> string': function(array, number){
				return array.splice(0, number).join(', ');
			},
			'public otherMethod (number) -> number': function(number){ return number; }
		});
		var reflectionClass = new Reflection.Class('My.Class');
		expect(reflectionClass instanceof Reflection.Class).toBe(true);
		var reflectionMethods = reflectionClass.getMethods();
		expect(Object.prototype.toString.call(reflectionMethods)).toBe('[object Array]');
		expect(reflectionMethods.length).toBe(2);
		expect(reflectionMethods[0] instanceof Reflection.Method).toBe(true);
		expect(reflectionMethods[1] instanceof Reflection.Method).toBe(true);
		expect(reflectionMethods[0].getName()).toBe('myMethod');
		expect(reflectionMethods[1].getName()).toBe('otherMethod');
		var methodArguments = reflectionMethods[0].getArguments();
		expect(methodArguments.length).toBe(2);
		expect(methodArguments[0] instanceof Reflection.Method.Argument).toBe(true);
		expect(methodArguments[1] instanceof Reflection.Method.Argument).toBe(true);
		expect(methodArguments[0].getIdentifier()).toBe('[string]');
		expect(methodArguments[1].getIdentifier()).toBe('number');
		var methodArguments = reflectionMethods[1].getArguments();
		expect(methodArguments.length).toBe(1);
		expect(methodArguments[0] instanceof Reflection.Method.Argument).toBe(true);
		expect(methodArguments[0].getIdentifier()).toBe('number');
	});
	
	it('TEMP - allows getting class properties and their names', function(){
		define('class My.Class', {
			'public myPropertyOne (string)': null,
			'public myPropertyTwo (number)': 123
		});
		var reflectionClass = new Reflection.Class('My.Class');
		var reflectionProperties = reflectionClass.getProperties();
		expect(reflectionProperties.length).toBe(2);
		expect(reflectionProperties[0].getName()).toBe('myPropertyOne');
		expect(reflectionProperties[1].getName()).toBe('myPropertyTwo');
	});
	
	describe('mocks', function(){
		
		it('can mock classy class', function(){
			define('class My.Class');
			var mock = new Reflection.Class('My.Class').getMock();
			expect(mock instanceof My.Class).toBe(true);
		});
		
		it('do not call class constructor', function(){
			define('class My.Class', {
				'public construct () -> undefined': function(){
					// Force a fail
					expect(true).toBe(false);
				}
			});
			var mock = new Reflection.Class('My.Class').getMock();
		});
		
		it('contain class methods when mocked', function(){
			define('class My.Class', {
				'public myMethod () -> undefined': function(){}
			});
			var mock = new Reflection.Class('My.Class').getMock();
			expect(typeof mock.myMethod).toBe('function');
		});
		
		it('can mock non-classy objects', function(){
			var mock = new Reflection.Class('Date').getMock();
			expect(mock instanceof Date).toBe(true);
		});
		
		it('can mock interface', function(){
			define('interface My.IInterface');
			var mock = new Reflection.Interface('My.IInterface').getMock();
			expect(mock.conformsTo('My.IInterface')).toBe(true);
		});
		
		it('contains interface methods when mocked', function(){
			define('interface My.IInterface', [
				'public myMethod () -> undefined'
			]);
			var mock = new Reflection.Interface('My.IInterface').getMock();
			expect(typeof mock.myMethod).toBe('function');
		});
		
	});
	
});
