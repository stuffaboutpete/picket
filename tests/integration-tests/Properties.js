describe('Properties', function(){
	
	beforeEach(function(){
		window.My = undefined;
	});
	
	it('can be defined and accessed', function(){
		define('class My.Class', {
			'public myProperty (string)': 'Example'
		});
		var myObject = new My.Class();
		myObject.myProperty();
		expect(myObject.myProperty()).toBe('Example');
	});
	
	it('can be set', function(){
		define('class My.Class', {
			'public myProperty (string)': 'Example'
		});
		var myObject = new My.Class();
		myObject.myProperty('New value');
		expect(myObject.myProperty()).toBe('New value');
	});
	
	it('cannot be set to incorrect type', function(){
		define('class My.Class', {
			'public myProperty (number)': 123
		});
		var expectedFatal = new ClassyJS.Member.Property.Fatal(
			'INVALID_TYPE',
			'Allowed type: number; Provided type: string'
		);
		var myObject = new My.Class();
		expect(function(){ myObject.myProperty('String value'); }).toThrow(expectedFatal);
	});
	
	it('can be set to null by default', function(){
		define('class My.Class', {
			'public myProperty (number)': null
		});
		var myObject = new My.Class();
		expect(myObject.myProperty()).toBe(null);
		myObject.myProperty(123);
		expect(myObject.myProperty()).toBe(123);
	});
	
	it('work independently in different instances', function(){
		define('class My.Class', {
			'public myProperty (string)': 'Example'
		});
		var myObject1 = new My.Class();
		var myObject2 = new My.Class();
		expect(myObject1.myProperty()).toBe('Example');
		expect(myObject2.myProperty()).toBe('Example');
		myObject1.myProperty('Object 1 value');
		myObject2.myProperty('Object 2 value');
		expect(myObject1.myProperty()).toBe('Object 1 value');
		expect(myObject2.myProperty()).toBe('Object 2 value');
	});
	
	it('have different array instances when declared as default value', function(){
		define('class My.Class', {
			'public array (array)': []
		});
		expect(new My.Class().array()).not.toBe(new My.Class().array());
	});
	
	it('have different arrays containing same objects when declared as default', function(){
		define('class My.Class', {
			'public array (array)': [{}]
		});
		expect(new My.Class().array()).not.toBe(new My.Class().array());
		expect(new My.Class().array()[0]).toBe(new My.Class().array()[0]);
	});
	
	it('have same object instances when declared as default', function(){
		define('class My.Class', {
			'public object (object)': {}
		});
		expect(new My.Class().object()).toBe(new My.Class().object());
	});
	
	it('can be concatenated when strings', function(){
		define('class My.Class', {
			'public myProperty (string)': 'start'
		});
		var myObject = new My.Class();
		myObject.myProperty('+=', ' after');
		expect(myObject.myProperty()).toBe('start after');
		myObject.myProperty('=+', 'before ');
		expect(myObject.myProperty()).toBe('before start after');
	});
	
	it('can be incremented and decremented when numbers', function(){
		define('class My.Class', {
			'public myProperty (number)': 98
		});
		var myObject = new My.Class();
		myObject.myProperty('++');
		expect(myObject.myProperty()).toBe(99);
		myObject.myProperty('--');
		expect(myObject.myProperty()).toBe(98);
		myObject.myProperty('+3');
		expect(myObject.myProperty()).toBe(101);
		myObject.myProperty('-6');
		expect(myObject.myProperty()).toBe(95);
	});
	
	it('can be manipulated when arrays', function(){
		define('class My.Class', {
			'public myProperty (array)': ['one', 'two', 'three']
		});
		var myObject = new My.Class();
		expect(myObject.myProperty('pop')).toBe('three');
		expect(myObject.myProperty().length).toBe(2);
		expect(myObject.myProperty('shift')).toBe('one');
		expect(myObject.myProperty().length).toBe(1);
		myObject.myProperty('push', 'dog');
		myObject.myProperty('unshift', 'cat');
		expect(myObject.myProperty()).toEqual(['cat', 'two', 'dog']);
	});
	
});
