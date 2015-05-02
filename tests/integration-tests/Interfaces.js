describe('Interfaces', function(){
	
	beforeEach(function(){
		window.My = undefined;
	});
	
	it('can be defined', function(){
		define('interface My.IInterface');
	});
	
	it('can be implemented by class', function(){
		define('interface My.IInterface');
		define('class My.Class implements My.IInterface');
		define('class My.OtherClass');
		expect(new Reflection.Class(My.Class).implementsInterface('My.IInterface')).toBe(true);
		expect(
			new Reflection.Class(My.OtherClass).implementsInterface('My.IInterface')
		).toBe(false);
	});
	
	it('can define abstract members which must be implemented before instantiation', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
		);
		define('interface My.IInterface', [
			'public myMethod () -> undefined'
		]);
		define('class My.InvalidClass implements My.IInterface');
		define('class My.ValidClass implements My.IInterface', {
			'public myMethod () -> undefined': function(){}
		});
		var reflectionClass = new Reflection.Class(My.ValidClass);
		expect(reflectionClass.implementsInterface('My.IInterface')).toBe(true);
		expect(function(){ new My.InvalidClass(); }).toThrow(expectedFatal);
	});
	
	it('multiple can be assigned to class', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
		);
		define('interface My.IInterface', [
			'public firstMethod () -> undefined'
		]);
		define('interface My.IOtherInterface', [
			'public otherMethod (number) -> string'
		]);
		define('class My.InvalidClass implements My.IInterface, My.IOtherInterface', {
			'public firstMethod () -> undefined': function(){}
		});
		define('class My.ValidClass implements My.IInterface, My.IOtherInterface', {
			'public firstMethod () -> undefined': function(){},
			'public otherMethod (number) -> string': function(){}
		});
		var reflectionClass = new Reflection.Class(My.ValidClass);
		expect(reflectionClass.implementsInterface('My.IInterface')).toBe(true);
		expect(reflectionClass.implementsInterface('My.IOtherInterface')).toBe(true);
		expect(function(){ new My.InvalidClass(); }).toThrow(expectedFatal);
	});
	
	it('are deemed not implemented if method name is wrong', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
		);
		define('interface My.IInterface', [
			'public myMethod (number) -> [string]'
		]);
		define('class My.Class implements My.IInterface', {
			'public notMyMethod (number) -> [string]': function(){}
		});
		expect(function(){ new My.Class(); }).toThrow(expectedFatal);
	});
	
	it('are deemed not implemented if argument type is wrong', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
		);
		define('interface My.IInterface', [
			'public myMethod (number) -> object'
		]);
		define('class My.Class implements My.IInterface', {
			'public myMethod (string) -> object': function(){}
		});
		expect(function(){ new My.Class(); }).toThrow(expectedFatal);
	});
	
	it('are deemed not implemented if any argument type is wrong', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
		);
		define('interface My.IInterface', [
			'public myMethod (number, string, [object]) -> object'
		]);
		define('class My.Class implements My.IInterface', {
			'public myMethod (number, string, number) -> object': function(){}
		});
		expect(function(){ new My.Class(); }).toThrow(expectedFatal);
	});
	
	it('are deemed not implemented if return type is wrong', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS'
		);
		define('interface My.IInterface', [
			'public myMethod (number) -> object'
		]);
		define('class My.Class implements My.IInterface', {
			'public myMethod (number) -> string': function(){}
		});
		expect(function(){ new My.Class(); }).toThrow(expectedFatal);
	});
	
	it('is deemed implemented if parent class implements', function(){
		define('interface My.IInterface', [
			'public myMethod (object) -> array'
		]);
		define('class My.ParentClass implements My.IInterface', {
			'public myMethod (object) -> array': function(){}
		});
		define('class My.ChildClass extends My.ParentClass');
		var reflectionClass = new Reflection.Class(My.ChildClass);
		expect(reflectionClass.implementsInterface('My.IInterface')).toBe(true);
	});
	
	it('can be used to type check method calls', function(){
		var expectedFatal = new ClassyJS.Registry.Member.Fatal(
			'METHOD_NOT_REGISTERED',
			'Provided name: myMethod'
		);
		define('interface My.IInterface');
		define('class My.Implementation implements My.IInterface');
		define('class My.Class', {
			'public myMethod (My.IInterface) -> undefined': function(string){}
		});
		var myObject = new My.Class();
		expect(function(){ myObject.myMethod(123); }).toThrow(expectedFatal);
		myObject.myMethod(new My.Implementation());
	});
	
	it('can omit argument types and allow implementing class to choose', function(){
		// The reason for this may not be clear; in
		// practise the class which insists on the
		// interface will have to use reflection (or
		// some other technique) to determine what
		// arguments to supply - this is very useful
		// for dependency injection.
		define('interface My.IInterface', [
			'public myMethod -> undefined'
		]);
		define('class My.Class implements My.IInterface', {
			'public myMethod (string, number) -> undefined': function(){}
		});
		var reflectionClass = new Reflection.Class(new My.Class());
		expect(reflectionClass.implementsInterface('My.IInterface')).toBe(true);
	});
	
});
