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
	
});
