describe('Type.DefinitionFactory', function(){
	
	var factory;
	var classFactory;
	var interfaceFactory;
	
	beforeEach(function(){
		classFactory = new Picket.Type.Class.Definition.Factory();
		interfaceFactory = new Picket.Type.Interface.Definition.Factory();
		factory = new Picket.Type.DefinitionFactory(classFactory, interfaceFactory);
	});
	
	it('can be instantiated with class and interface factories', function(){
		var factory = new Picket.Type.DefinitionFactory(
			classFactory,
			interfaceFactory
		);
		expect(factory instanceof Picket.Type.DefinitionFactory).toBe(true);
	});
	
	it('throws error if class factory is not provided', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'CLASS_DEFINITION_FACTORY_NOT_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			new Picket.Type.DefinitionFactory({}, interfaceFactory);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if interface factory is not provided', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'INTERFACE_DEFINITION_FACTORY_NOT_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Type.DefinitionFactory(classFactory);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if build is called with no signature', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ factory.build(); }).toThrow(expectedFatal);
	});
	
	it('throws error if build is called with non string signature', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: number'
		);
		expect(function(){ factory.build(10); }).toThrow(expectedFatal);
	});
	
	it('calls class factory with signature if signature contains keyword \'class\'', function(){
		var signature = 'class MyClass';
		spyOn(classFactory, 'build').and.returnValue({});
		spyOn(interfaceFactory, 'build');
		factory.build(signature);
		expect(classFactory.build).toHaveBeenCalledWith(signature);
		expect(interfaceFactory.build).not.toHaveBeenCalled();
	});
	
	it('calls interface factory with signature if contains keyword \'interface\'', function(){
		var signature = 'interface IMyInterface';
		spyOn(classFactory, 'build');
		spyOn(interfaceFactory, 'build').and.returnValue({});
		factory.build(signature);
		expect(interfaceFactory.build).toHaveBeenCalledWith(signature);
		expect(classFactory.build).not.toHaveBeenCalled();
	});
	
	it('throws error if signature contains both \'class\' and \'interface\'', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'AMBIGUOUS_SIGNATURE',
			'Signature: class interface MySomething'
		);
		expect(function(){ factory.build('class interface MySomething'); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature contains neither \'class\' or \'interface\'', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'AMBIGUOUS_SIGNATURE',
			'Signature: MySomething'
		);
		expect(function(){ factory.build('MySomething'); }).toThrow(expectedFatal);
	});
	
	it('returns object returned from class factory on build', function(){
		var classObject = {};
		spyOn(classFactory, 'build').and.returnValue(classObject);
		expect(factory.build('class MyClass')).toBe(classObject);
	});
	
	it('returns object returned from interface factory on build', function(){
		var interfaceObject = {};
		spyOn(interfaceFactory, 'build').and.returnValue(interfaceObject);
		expect(factory.build('interface IMyInterface')).toBe(interfaceObject);
	});
	
	it('throws error if class factory does not return an object', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'FACTORY_RETURNED_NON_OBJECT',
			'Returned type: undefined'
		);
		spyOn(classFactory, 'build').and.returnValue();
		expect(function(){ factory.build('class MyClass'); }).toThrow(expectedFatal);
	});
	
	it('throws error if interface factory does not return an object', function(){
		var expectedFatal = new Picket.Type.DefinitionFactory.Fatal(
			'FACTORY_RETURNED_NON_OBJECT',
			'Returned type: undefined'
		);
		spyOn(interfaceFactory, 'build').and.returnValue();
		expect(function(){ factory.build('interface IMyInterface'); }).toThrow(expectedFatal);
	});
	
});
