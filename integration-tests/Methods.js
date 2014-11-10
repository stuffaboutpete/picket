describe('Methods', function(){
	
	beforeEach(function(){
		window.My = undefined;
	});
	
	it('can be called and value is returned', function(){
		define('class My.Class', {
			'public myMethod () -> string': function(){ return 'Method value'; }
		});
		var myObject = new My.Class();
		expect(myObject.myMethod()).toBe('Method value');
	});
	
	it('can be passed arguments', function(){
		define('class My.Class', {
			'public myMethod (number, number) -> [number]': function(num1, num2){
				return [num1, num2];
			}
		});
		var myObject = new My.Class();
		expect(myObject.myMethod(123, 321)).toEqual([123, 321]);
	});
	
	it('will type check arguments', function(){
		var expectedFatal = new ClassyJS.Registry.Member.Fatal(
			'METHOD_NOT_REGISTERED',
			'Provided name: myMethod'
		);
		define('class My.Class', {
			'public myMethod (string) -> undefined': function(string){}
		});
		var myObject = new My.Class();
		expect(function(){ myObject.myMethod(123); }).toThrow(expectedFatal);
	});
	
	it('will type check return value', function(){
		var expectedFatal = new ClassyJS.Member.Method.Fatal(
			'INVALID_RETURN_VALUE',
			'Returned type: string; Expected type: undefined'
		);
		define('class My.Class', {
			'public myMethod (string) -> undefined': function(string){ return string; }
		});
		var myObject = new My.Class();
		expect(function(){ myObject.myMethod('Example'); }).toThrow(expectedFatal);
	});
	
	it('can access self as \'this\'', function(){
		define('class My.Class', {
			'public myMethod () -> My.Class': function(){ return this; }
		});
		var myObject = new My.Class();
		expect(myObject.myMethod()).toBe(myObject);
	});
	
	it('can access own properties', function(){
		define('class My.Class', {
			'public myProperty (number)': 123,
			'public myMethod () -> number': function(){ return this.myProperty(); }
		});
		var myObject = new My.Class();
		expect(myObject.myMethod()).toBe(123);
	});
	
	it('can be overloaded', function(){
		define('class My.Class', {
			'public myMethod (string) -> string': function(string){
				return 'You gave a string';
			},
			'public myMethod (number) -> string': function(number){
				return 'You gave a number';
			}
		});
		var myObject = new My.Class();
		expect(myObject.myMethod('string')).toBe('You gave a string');
		expect(myObject.myMethod(123)).toBe('You gave a number');
	});
	
	it('can access overloaded methods', function(){
		define('class My.Class', {
			'public myMethod (number) -> string': function(number){
				return 'Number: ' + number;
			},
			'public myMethod () -> string': function(){
				return this.myMethod(10);
			}
		});
		var myObject = new My.Class();
		expect(myObject.myMethod(99)).toBe('Number: 99');
		expect(myObject.myMethod()).toBe('Number: 10');
	});
	
	it('constructor is called on object instantiation', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public construct (string) -> undefined': function(string){ this.myProperty(string); }
		});
		var myObject = new My.Class('Example');
		expect(myObject.myProperty()).toBe('Example');
	});
	
	it('constructor can be overloaded', function(){
		define('class My.Class', {
			'public name (string)': null,
			'public age (number)': null,
			'public construct (string) -> undefined': function(name){
				this.name(name);
			},
			'public construct (string, number) -> undefined': function(name, age){
				this.construct(name);
				this.age(age);
			}
		});
		var myObject = new My.Class('Pete');
		var myObject2 = new My.Class('Pete', 29);
		expect(myObject.name()).toBe('Pete');
		expect(myObject.age()).toBe(null);
		expect(myObject2.name()).toBe('Pete');
		expect(myObject2.age()).toBe(29);
	});
	
	it('a constructor must be used if at least one is defined', function(){
		var expectedFatal = new ClassyJS.Registry.Member.Fatal(
			'METHOD_NOT_REGISTERED',
			'Provided name: construct'
		);
		define('class My.Class', {
			'public construct (string) -> undefined': function(){}
		});
		expect(function(){ new My.Class(); }).toThrow(expectedFatal);
	});
	
	it('can be static and called against class', function(){
		define('class My.Class', {
			'public static myMethod () -> string': function(){
				return 'From static method';
			}
		});
		expect(My.Class.myMethod()).toBe('From static method');
	});
	
	it('can be static but not called against class instance', function(){
		var expectedFatal = new ClassyJS.Registry.Member.Fatal(
			'METHOD_NOT_REGISTERED',
			'Provided name: myMethod'
		);
		define('class My.Class', {
			'public static myMethod () -> string': function(){
				return 'From static method';
			}
		});
		var myObject = new My.Class();
		expect(function(){ myObject.myMethod(); }).toThrow(expectedFatal);
	});
	
	it('use class constructor as \'this\' within static method', function(){
		define('class My.Class', {
			'public static myMethod () -> function': function(){
				return this;
			}
		});
		expect(My.Class.myMethod()).toBe(My.Class);
	});
	
});