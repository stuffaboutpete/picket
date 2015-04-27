describe('Reflection.Property', function(){
	
	var mocker;
	var originalInstantiator;
	var reflectionFactory;
	var namespaceManager;
	var typeRegistry;
	var memberRegistry;
	var classObject;
	var propertyObject;
	var classConstructor;
	var reflectionType;
	
	beforeEach(function(){
		mocker = new ClassyJS.Mocker();
		originalInstantiator = ClassyJS._instantiator;
		ClassyJS._instantiator = mocker.getMock(ClassyJS.Instantiator);
		reflectionFactory = mocker.getMock(ClassyJS.Reflection.Factory);
		namespaceManager = mocker.getMock(ClassyJS.NamespaceManager);
		typeRegistry = mocker.getMock(ClassyJS.Registry.Type);
		memberRegistry = mocker.getMock(ClassyJS.Registry.Member);
		classObject = mocker.getMock(ClassyJS.Type.Class);
		propertyObject = mocker.getMock(ClassyJS.Member.Property);
		classConstructor = function(){};
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(classConstructor);
		spyOn(typeRegistry, 'getClass').and.returnValue(classObject);
		spyOn(ClassyJS._instantiator, 'getTypeRegistry').and.returnValue(typeRegistry);
		spyOn(ClassyJS._instantiator, 'getMemberRegistry').and.returnValue(memberRegistry);
		spyOn(ClassyJS._instantiator, 'getReflectionFactory').and.returnValue(reflectionFactory);
		spyOn(ClassyJS._instantiator, 'getNamespaceManager').and.returnValue(namespaceManager);
	});
	
	afterEach(function(){
		ClassyJS._instantiator = originalInstantiator;
	});
	
	it('instantiation with a string class looks up namespace and gets class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		new Reflection.Property('Example', 'propertyName');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('Example');
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a constructor function gets class object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		new Reflection.Property(classConstructor, 'propertyName');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(classConstructor);
	});
	
	it('instantiation with a class instance gets class object', function(){
		var instance = new classConstructor();
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		new Reflection.Property(instance, 'propertyName');
		expect(namespaceManager.getNamespaceObject).not.toHaveBeenCalled();
		expect(typeRegistry.getClass).toHaveBeenCalledWith(instance);
	});
	
	it('throws error if type registry indicates class does not exist', function(){
		var expectedFatal = new ClassyJS.Reflection.Property.Fatal('CLASS_DOES_NOT_EXIST');
		spyOn(typeRegistry, 'classExists').and.returnValue(false);
		expect(function(){
			new Reflection.Property('NonClass', 'propertyName');
		}).toThrow(expectedFatal);
	});
	
	it('throws error if non string, object or function is provided', function(){
		var expectedFatal = new ClassyJS.Reflection.Property.Fatal(
			'INVALID_IDENTIFIER_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Property(123, 'propertyName'); }).toThrow(expectedFatal);
	});
	
	it('throws error if non-string property name is provided', function(){
		var expectedFatal = new ClassyJS.Reflection.Property.Fatal(
			'NON_STRING_PROPERTY_NAME_PROVIDED',
			'Provided type: number'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		expect(function(){ new Reflection.Property('Example', 123); }).toThrow(expectedFatal);
	});
	
	it('throws error if no property of given name is found', function(){
		var expectedFatal = new ClassyJS.Reflection.Property.Fatal(
			'PROPERTY_DOES_NOT_EXIST',
			'Property name: propertyName'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([
			propertyObject,
			propertyObject
		]);
		var propertyNameCall = -1;
		spyOn(propertyObject, 'getName').and.callFake(function(){
			propertyNameCall++;
			if (propertyNameCall == 0) {
				return 'otherPropertyName';
			} else if (propertyNameCall == 1) {
				return 'differentPropertyName';
			}
		});
		expect(function(){
			new Reflection.Property('Example', 'propertyName');
		}).toThrow(expectedFatal);
		expect(memberRegistry.getMembers).toHaveBeenCalledWith(classObject);
	});
	
	it('returns name from property object', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		expect(reflectionProperty.getName()).toBe('propertyName');
	});
	
	it('returns type object via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		spyOn(propertyObject, 'getTypeIdentifier').and.returnValue('string');
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		var reflectionType = mocker.getMock(Reflection.Type);
		spyOn(reflectionFactory, 'buildType').and.returnValue(reflectionType);
		expect(reflectionProperty.getType()).toBe(reflectionType);
		expect(reflectionFactory.buildType).toHaveBeenCalledWith('string');
	});
	
	it('returns access type object via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		spyOn(propertyObject, 'getAccessTypeIdentifier').and.returnValue('public');
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		var reflectionAccessType = new Reflection.AccessType();
		spyOn(reflectionFactory, 'buildAccessType').and.returnValue(reflectionAccessType);
		expect(reflectionProperty.getAccessType()).toBe(reflectionAccessType);
		expect(reflectionFactory.buildAccessType).toHaveBeenCalledWith('public');
	});
	
	it('indicates when property has default value', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		spyOn(propertyObject, 'getDefaultValue').and.returnValue('default value');
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		expect(reflectionProperty.hasDefaultValue()).toBe(true);
	});
	
	it('indicates when property has no default value', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		spyOn(propertyObject, 'getDefaultValue').and.returnValue(null);
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		expect(reflectionProperty.hasDefaultValue()).toBe(false);
	});
	
	it('returns default value', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		spyOn(propertyObject, 'getDefaultValue').and.returnValue('default value');
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		expect(reflectionProperty.getDefaultValue()).toBe('default value');
	});
	
	it('throws error if default value is requested when it does not exist', function(){
		var expectedFatal = new ClassyJS.Reflection.Property.Fatal(
			'UNDEFINED_DEFAULT_VALUE_REQUESTED'
		);
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		spyOn(propertyObject, 'getDefaultValue').and.returnValue(null);
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		expect(function(){
			reflectionProperty.getDefaultValue()
		}).toThrow(expectedFatal);
	});
	
	it('returns reflection class via factory', function(){
		spyOn(typeRegistry, 'classExists').and.returnValue(true);
		spyOn(memberRegistry, 'getMembers').and.returnValue([propertyObject]);
		spyOn(propertyObject, 'getName').and.returnValue('propertyName');
		spyOn(classObject, 'getName').and.returnValue('My.Class');
		var reflectionProperty = new Reflection.Property('My.Class', 'propertyName');
		var reflectionType = mocker.getMock(Reflection.Type);
		var reflectionClass = {};
		spyOn(reflectionFactory, 'buildClass').and.returnValue(reflectionClass);
		expect(reflectionProperty.getClass()).toBe(reflectionClass);
		expect(reflectionFactory.buildClass).toHaveBeenCalledWith('My.Class');
		expect(classObject.getName).toHaveBeenCalled();
	});
	
});
