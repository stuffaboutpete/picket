describe('Type.Class.Definition', function(){
	
	it('can be instantiated with a signature', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition('class MyClass');
		expect(classDefinition instanceof ClassyJS.Type.Class.Definition).toBe(true);
	});
	
	it('throws error if instantiated with no signature', function(){
		var expectedFatal = new ClassyJS.Type.Class.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ new ClassyJS.Type.Class.Definition(); }).toThrow(expectedFatal);
	});
	
	it('throws error if instantiated with non string signature', function(){
		var expectedFatal = new ClassyJS.Type.Class.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: object'
		);
		expect(function(){ new ClassyJS.Type.Class.Definition({}); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature does not contain \'class\' keyword', function(){
		var expectedFatal = new ClassyJS.Type.Class.Definition.Fatal('MISSING_KEYWORD_CLASS');
		expect(function(){ new ClassyJS.Type.Class.Definition('MyClass'); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature is not recognised', function(){
		var expectedFatal = new ClassyJS.Type.Class.Definition.Fatal('SIGNATURE_NOT_RECOGNISED');
		expect(function(){
			new ClassyJS.Type.Class.Definition('Something class Something');
		}).toThrow(expectedFatal);
	});
	
	it('can return name from signature', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition('class MyClass');
		expect(classDefinition.getName()).toBe('MyClass');
	});
	
	it('can indicate whether class is explicitly abstract', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition('class MyClass');
		expect(classDefinition.isAbstract()).toBe(false);
		classDefinition = new ClassyJS.Type.Class.Definition('abstract class MyClass');
		expect(classDefinition.isAbstract()).toBe(true);
	});
	
	it('can indicate whether class extends another', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition('class MyClass');
		expect(classDefinition.isExtension()).toBe(false);
		classDefinition = new ClassyJS.Type.Class.Definition('class MyClass extends ParentClass');
		expect(classDefinition.isExtension()).toBe(true);
	});
	
	it('can indicate parent class', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition('class MyClass');
		expect(classDefinition.getParentClass()).toBe(undefined);
		classDefinition = new ClassyJS.Type.Class.Definition('class MyClass extends ParentClass');
		expect(classDefinition.getParentClass()).toBe('ParentClass');
	});
	
	it('can indicate interfaces as an array', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition('class MyClass');
		expect(classDefinition.getInterfaces()).toEqual([]);
		classDefinition = new ClassyJS.Type.Class.Definition(
			'class MyClass implements IMyInterface'
		);
		expect(classDefinition.getInterfaces()).toEqual(['IMyInterface']);
		classDefinition = new ClassyJS.Type.Class.Definition(
			'class MyClass implements IMyInterface, IMyOtherInterface'
		);
		expect(classDefinition.getInterfaces()).toEqual(['IMyInterface', 'IMyOtherInterface']);
	});
	
	it('can parse complex signature', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition(
			'abstract class MyClass extends ParentClass implements IMyInterface, IMyOtherInterface'
		);
		expect(classDefinition.isAbstract()).toBe(true);
		expect(classDefinition.getName()).toBe('MyClass');
		expect(classDefinition.isExtension()).toBe(true);
		expect(classDefinition.getParentClass()).toBe('ParentClass');
		expect(classDefinition.getInterfaces()).toEqual(['IMyInterface', 'IMyOtherInterface']);
	});
	
	it('can parse signature with irregular whitespace', function(){
		var classDefinition = new ClassyJS.Type.Class.Definition(
			'	 abstract	class  MyClass   extends	ParentClass ' +
			'	implements	IMyInterface	 , 	IMyOtherInterface'
		);
		expect(classDefinition.isAbstract()).toBe(true);
		expect(classDefinition.getName()).toBe('MyClass');
		expect(classDefinition.isExtension()).toBe(true);
		expect(classDefinition.getParentClass()).toBe('ParentClass');
		expect(classDefinition.getInterfaces()).toEqual(['IMyInterface', 'IMyOtherInterface']);
	});
	
});
