describe('Type declaration', function(){
	
	beforeEach(function(){
		window.MyClass = undefined;
		window.My = undefined;
	});
	
	it('results in error if class members are provided as array', function(){
		var expectedFatal = new ClassyJS.Main.Fatal(
			'NON_OBJECT_CLASS_MEMBERS',
			'Provided type: array'
		);
		expect(function(){ define('class MyClass', []); }).toThrow(expectedFatal);
	});
	
	it('results in error if class members are provided as non object', function(){
		var expectedFatal = new ClassyJS.Main.Fatal(
			'NON_OBJECT_CLASS_MEMBERS',
			'Provided type: number'
		);
		expect(function(){ define('class MyClass', 123); }).toThrow(expectedFatal);
	});
	
	it('results in error if interface members are provided as object', function(){
		var expectedFatal = new ClassyJS.Main.Fatal(
			'NON_ARRAY_INTERFACE_MEMBERS',
			'Provided type: object'
		);
		expect(function(){ define('interface IMyInterface', {}); }).toThrow(expectedFatal);
	});
	
	it('results in error if interface members are provided as non object', function(){
		var expectedFatal = new ClassyJS.Main.Fatal(
			'NON_ARRAY_INTERFACE_MEMBERS',
			'Provided type: number'
		);
		expect(function(){ define('interface IMyInterface', 123); }).toThrow(expectedFatal);
	});
	
});
