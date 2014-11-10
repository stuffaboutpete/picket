describe('Properties', function(){
	
	beforeEach(function(){
		window.My = undefined;
	});
	
	it('can be defined and accessed', function(){
		define('class My.Class', {
			'public myProperty (string)': 'Example'
		});
		var myObject = new My.Class();
		expect(myObject.get('myProperty')).toBe('Example');
	});
	
	it('can be accessed using property name method', function(){
		define('class My.Class', {
			'public myProperty (string)': 'Example'
		});
		var myObject = new My.Class();
		expect(myObject.myProperty()).toBe('Example');
	});
	
	it('can be set', function(){
		define('class My.Class', {
			'public myProperty (string)': 'Example'
		});
		var myObject = new My.Class();
		myObject.set('myProperty', 'New value');
		expect(myObject.myProperty()).toBe('New value');
	});
	
	it('can be set using property name method', function(){
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
	
});
