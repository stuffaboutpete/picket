describe('Type.Class', function(){
	
	// @todo Return interface objects from type registry
	
	var classObject;
	var definition;
	var typeRegistry;
	var memberRegistry;
	var accessController;
	var namespaceManager;
	var parentConstructor;
	var parentClass;
	
	beforeEach(function(){
		definition = new ClassyJS.Type.Class.Definition('class MyClass');
		typeRegistry = new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager());
		memberRegistry = new ClassyJS.Registry.Member(
			typeRegistry,
			new ClassyJS.TypeChecker(new ClassyJS.TypeChecker.ReflectionFactory())
		);
		namespaceManager = new ClassyJS.NamespaceManager();
		classObject = new ClassyJS.Type.Class(
			definition,
			typeRegistry,
			memberRegistry,
			namespaceManager
		);
		parentConstructor = function(){};
		parentClass = new ClassyJS.Type.Class(
			definition,
			typeRegistry,
			memberRegistry,
			namespaceManager
		);
	});
	
	it('can be instantiated', function(){
		var classObject = new ClassyJS.Type.Class(
			definition,
			typeRegistry,
			memberRegistry,
			namespaceManager
		);
		expect(classObject instanceof ClassyJS.Type.Class).toBe(true);
	});
	
	it('throws error if no definition is provided', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'NO_DEFINITION_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Class(
				undefined,
				typeRegistry,
				memberRegistry,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no type registry is provided', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'NO_TYPE_REGISTRY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Class(
				definition,
				undefined,
				memberRegistry,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no member registry is provided', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'NO_MEMBER_REGISTRY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Class(
				definition,
				typeRegistry,
				undefined,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no namespace manager is provided', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'NO_NAMESPACE_MANAGER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Class(
				definition,
				typeRegistry,
				memberRegistry
			);
		}).toThrow(expectedFatal);
	});
	
	it('returns name from definition', function(){
		spyOn(definition, 'getName').and.returnValue('MyClass');
		expect(classObject.getName()).toBe('MyClass');
	});
	
	it('indicates if class is extension of other class from definition', function(){
		spyOn(definition, 'isExtension').and.returnValue(true);
		expect(classObject.isExtension()).toBe(true);
	});
	
	it('indicates if class is not extension of other class from definition', function(){
		spyOn(definition, 'isExtension').and.returnValue(false);
		expect(classObject.isExtension()).toBe(false);
	});
	
	it('returns parent name', function(){
		spyOn(definition, 'isExtension').and.returnValue(true);
		spyOn(definition, 'getParentClass').and.returnValue('My.Parent');
		expect(classObject.getParentClass()).toBe('My.Parent');
	});
	
	it('throws error if parent class is requested when isExtension is false', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal('NO_PARENT_CLASS_RELATIONSHIP');
		spyOn(definition, 'isExtension').and.returnValue(false);
		expect(function(){ classObject.getParentClass(); }).toThrow(expectedFatal);
	});
	
	it('allows instantiation', function(){
		spyOn(definition, 'isAbstract').and.returnValue(false);
		spyOn(memberRegistry, 'hasAbstractMembers').and.returnValue(false);
		spyOn(memberRegistry, 'hasUnimplementedInterfaceMembers').and.returnValue(false);
		classObject.requestInstantiation();
		expect(definition.isAbstract).toHaveBeenCalled();
		expect(memberRegistry.hasAbstractMembers).toHaveBeenCalledWith(classObject);
	});
	
	it('throws error if instantiation is requested on explicitly abstract class', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal('CANNOT_INSTANTIATE_ABSTRACT_CLASS');
		spyOn(definition, 'isAbstract').and.returnValue(true);
		expect(function(){ classObject.requestInstantiation(); }).toThrow(expectedFatal);
	});
	
	it('throws error if instantiation is requested on class with abstract members', function(){
		var expectedFatal = new ClassyJS.Type.Class.Fatal(
			'CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS'
		);
		spyOn(memberRegistry, 'hasAbstractMembers').and.returnValue(true);
		expect(function(){ classObject.requestInstantiation(); }).toThrow(expectedFatal);
	});
	
});
