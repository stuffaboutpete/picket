describe('Instantiation', function(){
	
	beforeEach(function(){
		delete window.MyClass;
		delete window.My;
	});
	
	it('can be done with very basic class', function(){
		define('class MyClass');
		var myObject = new MyClass();
		expect(myObject instanceof MyClass).toBe(true);
	});
	
	it('can return class name via toString method', function(){
		define('class MyClass');
		define('class My.More.Complex.Name');
		expect((new MyClass()).toString()).toBe('[object MyClass]');
		expect((new My.More.Complex.Name()).toString()).toBe('[object My.More.Complex.Name]');
	});
	
	it('cannot be done with explicitly abstract class', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal('CANNOT_INSTANTIATE_ABSTRACT_CLASS');
		define('abstract class MyClass');
		expect(function(){ new MyClass(); }).toThrow(expectedFatal);
	});
	
	it('cannot be done with class containing abstract method', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS'
		);
		define('class MyClass', {
			'public abstract myMethod () -> undefined': undefined
		});
		expect(function(){ new MyClass(); }).toThrow(expectedFatal);
	});
	
	it('cannot be done if parent class contains abstract members', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS'
		);
		define('class My.Parent', {
			'public abstract myMethod () -> undefined': undefined
		});
		define('class My.Child extends My.Parent');
		expect(function(){ new My.Child(); }).toThrow(expectedFatal);
	});
	
	it('can be done if abstract methods are overridden in child class', function(){
		define('class My.Parent', {
			'public abstract myMethod () -> string': undefined
		});
		define('class My.Child extends My.Parent', {
			'public myMethod () -> string': function(){
				return 'From Child';
			}
		});
		var myChild = new My.Child();
		expect(myChild.myMethod()).toBe('From Child');
	});
	
});
