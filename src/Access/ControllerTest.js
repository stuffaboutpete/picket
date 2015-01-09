describe('Access.Controller', function(){
	
	var namespaceManager;
	var typeRegistry;
	var accessController;
	
	beforeEach(function(){
		namespaceManager = new ClassyJS.NamespaceManager();
		typeRegistry = new ClassyJS.Registry.Type(namespaceManager);
		accessController = new ClassyJS.Access.Controller(typeRegistry);
	});
	
	it('requires type registry', function(){
		var expectedFatal = new ClassyJS.Access.Controller.Fatal(
			'NO_TYPE_REGISTRY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Access.Controller();
		}).toThrow(expectedFatal);
	});
	
	it('throws error if target is non-instance and non-constructor', function(){
		var expectedFatal = new ClassyJS.Access.Controller.Fatal(
			'TARGET_NOT_INSTANCE_OR_CONSTRUCTOR',
			'Provided type: string'
		);
		expect(function(){
			accessController.canAccess(
				'string',
				{},
				'public'
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if accesser is non-instance and non-constructor and not undefined', function(){
		var expectedFatal = new ClassyJS.Access.Controller.Fatal(
			'ACCESS_OBJECT_NOT_INSTANCE_OR_CONSTRUCTOR_OR_UNDEFINED',
			'Provided type: string'
		);
		expect(function(){
			accessController.canAccess(
				function(){},
				'string',
				'public'
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if access instance is not a string', function(){
		var expectedFatal = new ClassyJS.Access.Controller.Fatal(
			'ACCESS_IDENTIFIER_NOT_STRING',
			'Provided type: number'
		);
		expect(function(){
			accessController.canAccess(
				function(){},
				undefined,
				123
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if access instance is public, private or protected', function(){
		var expectedFatal = new ClassyJS.Access.Controller.Fatal(
			'ACCESS_IDENTIFIER_NOT_VALID_STRING',
			'Provided identifier: invalid'
		);
		expect(function(){
			accessController.canAccess(
				function(){},
				{},
				'invalid'
			);
		}).toThrow(expectedFatal);
	});
	
	it('grants public access to undefined access instance', function(){
		expect(accessController.canAccess(
			{},
			undefined,
			'public'
		)).toBe(true);
	});
	
	it('grants public access to self', function(){
		var instance = {};
		expect(accessController.canAccess(
			instance,
			instance,
			'public'
		)).toBe(true);
	});
	
	it('grants public access to other object', function(){
		expect(accessController.canAccess(
			{},
			{},
			'public'
		)).toBe(true);
	});
	
	it('denies private access to undefined access instance', function(){
		expect(accessController.canAccess(
			{},
			undefined,
			'private'
		)).toBe(false);
	});
	
	it('grants private access to self', function(){
		var instance = {};
		expect(accessController.canAccess(
			instance,
			instance,
			'private'
		)).toBe(true);
	});
	
	it('denies private access to other instance of class', function(){
		var constructor = function(){};
		expect(accessController.canAccess(
			new constructor(),
			new constructor(),
			'private'
		)).toBe(false);
	});
	
	it('denies private access to child instance', function(){
		var childInstance = {};
		var parentInstance = {};
		expect(accessController.canAccess(
			parentInstance,
			childInstance,
			'private'
		)).toBe(false);
	});
	
	it('denies private access to parent instance', function(){
		var childInstance = {};
		var parentInstance = {};
		expect(accessController.canAccess(
			childInstance,
			parentInstance,
			'private'
		)).toBe(false);
	});
	
	it('denies protected access to undefined access instance', function(){
		expect(accessController.canAccess(
			{},
			undefined,
			'protected'
		)).toBe(false);
	});
	
	it('grants protected access to self', function(){
		var instance = {};
		expect(accessController.canAccess(
			instance,
			instance,
			'protected'
		)).toBe(true);
	});
	
	it('denies protected access to other instance of class', function(){
		var constructor = function(){};
		var targetInstance = new constructor();
		var accessInstance = new constructor();
		spyOn(typeRegistry, 'isSameObject').and.returnValue(false);
		expect(accessController.canAccess(
			targetInstance,
			accessInstance,
			'protected'
		)).toBe(false);
		expect(typeRegistry.isSameObject).toHaveBeenCalledWith(targetInstance, accessInstance);
	});
	
	it('allows protected access to child instance', function(){
		var childInstance = {};
		var parentInstance = {};
		spyOn(typeRegistry, 'isSameObject').and.returnValue(true);
		expect(accessController.canAccess(
			parentInstance,
			childInstance,
			'protected'
		)).toBe(true);
		expect(typeRegistry.isSameObject).toHaveBeenCalledWith(parentInstance, childInstance);
	});
	
	it('allows protected access to parent instance', function(){
		var childInstance = {};
		var parentInstance = {};
		spyOn(typeRegistry, 'isSameObject').and.returnValue(true);
		expect(accessController.canAccess(
			childInstance,
			parentInstance,
			'protected'
		)).toBe(true);
		expect(typeRegistry.isSameObject).toHaveBeenCalledWith(childInstance, parentInstance);
	});
	
});
