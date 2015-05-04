describe('Reflection.PropertyInstance', function(){
	
	var mocker;
	var originalInstantiator;
	var propertyObject;
	var memberRegistry;
	var reflectionProperty;
	var reflectionFactory;
	
	beforeEach(function(){
		define('class My.Class');
		objectInstance = new My.Class();
		mocker = new Picket.Mocker();
		originalInstantiator = Picket._instantiator;
		Picket._instantiator = mocker.getMock(Picket.Instantiator);
		propertyObject = mocker.getMock(Picket.Member.Property);
		memberRegistry = mocker.getMock(Picket.Registry.Member);
		reflectionProperty = mocker.getMock(Reflection.Property);
		reflectionFactory = mocker.getMock(Picket.Reflection.Factory);
		spyOn(Picket._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(Picket._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
	});
	
	afterEach(function(){
		Picket._instantiator = originalInstantiator;
	});
	
	it('throws error if member registry indicates property does not exist', function(){
		var expectedFatal = new Picket.Registry.Member.Fatal(
			'PROPERTY_NOT_REGISTERED',
			'Provided name: nonExistentProperty'
		);
		spyOn(memberRegistry, 'getPropertyValue').and.throwError(expectedFatal);
		expect(function(){
			new Reflection.PropertyInstance(objectInstance, 'nonExistentProperty');
		}).toThrow(expectedFatal);
		expect(memberRegistry.getPropertyValue.calls.count()).toBe(1);
		expect(memberRegistry.getPropertyValue.calls.argsFor(0)).toEqual([
			objectInstance,
			objectInstance,
			'nonExistentProperty'
		]);
	});
	
	it('returns reflection property via factory', function(){
		spyOn(memberRegistry, 'getPropertyValue').and.returnValue(null);
		var property = new Reflection.PropertyInstance(objectInstance, 'myProperty');
		spyOn(reflectionFactory, 'buildProperty').and.returnValue(reflectionProperty);
		expect(property.getProperty()).toBe(reflectionProperty);
		expect(reflectionFactory.buildProperty).toHaveBeenCalledWith(objectInstance, 'myProperty');
	});
	
	it('returns the value of the property value', function(){
		spyOn(memberRegistry, 'getPropertyValue').and.returnValue('Value');
		var property = new Reflection.PropertyInstance(objectInstance, 'myProperty');
		expect(property.getValue()).toBe('Value');
		expect(memberRegistry.getPropertyValue.calls.count()).toBe(2);
		expect(memberRegistry.getPropertyValue.calls.mostRecent().args).toEqual([
			objectInstance,
			objectInstance,
			'myProperty'
		]);
	});
	
	it('will change the value of a property', function(){
		spyOn(memberRegistry, 'getPropertyValue');
		spyOn(memberRegistry, 'setPropertyValue');
		var property = new Reflection.PropertyInstance(objectInstance, 'myProperty');
		property.setValue('Example');
		expect(memberRegistry.setPropertyValue.calls.mostRecent().args).toEqual([
			objectInstance,
			objectInstance,
			'myProperty',
			'Example'
		]);
	});
	
});
