describe('Member.Property', function(){
	
	// @todo Anything to do with complex properties (defined as object)
	
	var property;
	var definition;
	var typeChecker;
	var accessController;
	var targetInstance;
	var accessInstance;
	
	beforeEach(function(){
		definition = new Picket.Member.Property.Definition('public myProperty (string)');
		typeChecker = new Picket.TypeChecker(new Picket.TypeChecker.ReflectionFactory());
		accessController = new Picket.Access.Controller(
			new Picket.Registry.Type(
				new Picket.NamespaceManager()
			)
		);
		property = new Picket.Member.Property(
			definition,
			false,
			'Default value',
			typeChecker,
			accessController
		);
		targetInstance = {};
		accessInstance = {};
	});
	
	it('can be instantiated', function(){
		var property = new Picket.Member.Property(
			definition,
			false,
			null,
			typeChecker,
			accessController
		);
		expect(property instanceof Picket.Member.Property).toBe(true);
	});
	
	it('throws error if no definition is provided', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'NO_DEFINITION_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Property(
				undefined,
				false,
				null,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if it is indicated that this was defined in an interface', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'PROPERTY_CANNOT_BE_DEFINED_BY_INTERFACE'
		);
		expect(function(){
			new Picket.Member.Property(definition, true);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no type checker is provided', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'NO_TYPE_CHECKER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Property(
				definition,
				false,
				null,
				undefined,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no access controller is provided', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'NO_ACCESS_CONTROLLER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Property(
				definition,
				false,
				null,
				typeChecker
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if default value is not of declared type', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'INVALID_DEFAULT_VALUE',
			'Provided type: string; Expected type: number'
		);
		spyOn(definition, 'getTypeIdentifier').and.returnValue('number');
		spyOn(typeChecker, 'isValidType').and.returnValue(false);
		expect(function(){
			new Picket.Member.Property(
				definition,
				false,
				'Example',
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
		expect(typeChecker.isValidType).toHaveBeenCalledWith('Example', 'number');
	});
	
	it('throws error if default value is undefined', function(){
		var expectedFatal = new Picket.Member.Property.Fatal('NO_DEFAULT_VALUE_PROVIDED');
		spyOn(typeChecker, 'isValidType');
		expect(function(){
			new Picket.Member.Property(
				definition,
				false,
				undefined,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
		expect(typeChecker.isValidType).not.toHaveBeenCalled();
	});
	
	it('does not throw error if default value is null', function(){
		spyOn(typeChecker, 'isValidType');
		new Picket.Member.Property(
			definition,
			false,
			null,
			typeChecker,
			accessController
		);
		expect(typeChecker.isValidType).not.toHaveBeenCalled();
	});
	
	it('returns name from definition', function(){
		spyOn(definition, 'getName').and.returnValue('myProperty');
		expect(property.getName()).toBe('myProperty');
		expect(definition.getName).toHaveBeenCalled();
	});
	
	it('checks with access controller before returning default value', function(){
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		expect(property.getDefaultValue(targetInstance, accessInstance)).toBe('Default value');
		expect(accessController.canAccess).toHaveBeenCalledWith(
			targetInstance,
			accessInstance,
			'public'
		);
	});
	
	xit('throws error if default value is requested with non-object target instance', function(){
		// Note that this is disabled due to
		// a hack. Read the comment inside
		// the related method.
		var expectedFatal = new Picket.Member.Property.Fatal(
			'NON_OBJECT_TARGET_INSTANCE_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			property.getDefaultValue(undefined, accessInstance);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if access controller does not permit access to default value', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: protected'
		);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('protected');
		spyOn(accessController, 'canAccess').and.returnValue(false);
		expect(function(){
			property.getDefaultValue(targetInstance, accessInstance);
		}).toThrow(expectedFatal);
	});
	
	it('returns copy of array if provided as default value', function(){
		var defaultArray = [];
		var property = new Picket.Member.Property(
			new Picket.Member.Property.Definition('public myProperty (array)'),
			false,
			defaultArray,
			typeChecker,
			accessController
		);
		expect(property.getDefaultValue(targetInstance, accessInstance)).not.toBe(defaultArray);
		expect(property.getDefaultValue(targetInstance, accessInstance)).toEqual(defaultArray);
	});
	
	it('returns array copy containing original objects if provided as default value', function(){
		var defaultContent = {};
		var defaultArray = [defaultContent];
		var property = new Picket.Member.Property(
			new Picket.Member.Property.Definition('public myProperty (array)'),
			false,
			defaultArray,
			typeChecker,
			accessController
		);
		expect(property.getDefaultValue(targetInstance, accessInstance)[0]).toBe(defaultContent);
	});
	
	it('checks with access controller and type checker before allowing value to be set', function(){
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('protected');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(property.set(targetInstance, accessInstance, 'Setting value')).toBe('Setting value');
		expect(accessController.canAccess).toHaveBeenCalledWith(
			targetInstance,
			accessInstance,
			'protected'
		);
		expect(typeChecker.isValidType).toHaveBeenCalledWith('Setting value', 'string');
	});
	
	it('throws error if value is set with non-object target instance', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'NON_OBJECT_TARGET_INSTANCE_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			property.set(undefined, accessInstance, 'Value');
		}).toThrow(expectedFatal);
	});
	
	it('allows value to be set to undefined', function(){
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('protected');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(property.set(targetInstance, accessInstance)).toBe(undefined);
	});
	
	it('throws error if access controller does not permit access whilst setting value', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: private'
		);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('private');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		spyOn(accessController, 'canAccess').and.returnValue(false);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(function(){
			property.set(targetInstance, accessInstance, 'Value');
		}).toThrow(expectedFatal);
	});
	
	it('throws error if type checker does not allow type whilst setting value', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'INVALID_TYPE',
			'Allowed type: number; Provided type: object'
		);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('private');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('number');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(false);
		expect(function(){
			property.set(targetInstance, accessInstance, {});
		}).toThrow(expectedFatal);
	});
	
	it('checks with access controller and type checker before getting value', function(){
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(property.get(targetInstance, accessInstance, 'Getting value')).toBe('Getting value');
		expect(accessController.canAccess).toHaveBeenCalledWith(
			targetInstance,
			accessInstance,
			'public'
		);
		expect(typeChecker.isValidType).toHaveBeenCalledWith('Getting value', 'string');
	});
	
	it('throws error if get value is requested with non-object target instance', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'NON_OBJECT_TARGET_INSTANCE_PROVIDED',
			'Provided type: function'
		);
		expect(function(){
			property.get(function(){}, accessInstance, 'Value');
		}).toThrow(expectedFatal);
	});
	
	it('allows getting of undefined value', function(){
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('protected');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(property.get(targetInstance, accessInstance)).toBe(undefined);
	});
	
	it('throws error if access controller does not permit access to getting value', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: protected'
		);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('protected');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		spyOn(accessController, 'canAccess').and.returnValue(false);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(function(){
			property.get(targetInstance, accessInstance, 'Value');
		}).toThrow(expectedFatal);
	});
	
	it('throws error if type checker does not allow type whilst getting value', function(){
		var expectedFatal = new Picket.Member.Property.Fatal(
			'INVALID_TYPE',
			'Allowed type: [number]; Provided type: number'
		);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('protected');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('[number]');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(false);
		expect(function(){
			property.get(targetInstance, accessInstance, 123);
		}).toThrow(expectedFatal);
	});
	
});
