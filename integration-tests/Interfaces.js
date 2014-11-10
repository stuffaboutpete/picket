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
		expect(new My.Class().conformsTo('My.IInterface')).toBe(true);
		expect(new My.OtherClass().conformsTo('My.IInterface')).toBe(false);
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
		expect(new My.ValidClass().conformsTo('My.IInterface')).toBe(true);
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
		expect(new My.ValidClass().conformsTo('My.IInterface')).toBe(true);
		expect(new My.ValidClass().conformsTo('My.IOtherInterface')).toBe(true);
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
	
});
