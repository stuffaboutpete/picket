describe('Member.Constant', function(){
	
	var constant;
	var definition;
	var typeChecker;
	var accessController;
	var constantOwnerConstructor;
	var accessInstance;
	
	beforeEach(function(){
		definition = new ClassyJS.Member.Constant.Definition('public constant MY_CONSTANT');
		typeChecker = new ClassyJS.TypeChecker();
		accessController = new ClassyJS.Access.Controller(
			new ClassyJS.Registry.Type(
				new ClassyJS.NamespaceManager()
			)
		);
		constant = new ClassyJS.Member.Constant(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		constantOwnerConstructor = function(){};
		accessInstance = {};
	});
	
	it('can be instantiated', function(){
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(constant instanceof ClassyJS.Member.Constant).toBe(true);
	});
	
	it('throws error if no definition is provided', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'NO_DEFINITION_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Member.Constant(
				undefined,
				false,
				undefined,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if isFromInterface is not false', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal('IS_FROM_INTERFACE');
		expect(function(){
			new ClassyJS.Member.Constant(
				definition,
				true,
				undefined,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no type checker is provided', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'NO_TYPE_CHECKER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Member.Constant(
				definition,
				false,
				undefined,
				undefined,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no access controller is provided', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'NO_ACCESS_CONTROLLER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Member.Constant(
				definition,
				false,
				undefined,
				typeChecker
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if value is not string or number', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'INVALID_VALUE_TYPE',
			'Provided type: object'
		);
		expect(function(){
			new ClassyJS.Member.Constant(
				definition,
				false,
				{},
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'INVALID_VALUE_TYPE',
			'Provided type: object'
		);
		expect(function(){
			new ClassyJS.Member.Constant(
				definition,
				false,
				['string'],
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'INVALID_VALUE_TYPE',
			'Provided type: boolean'
		);
		expect(function(){
			new ClassyJS.Member.Constant(
				definition,
				false,
				true,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('will allow undefined value', function(){
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(constant instanceof ClassyJS.Member.Constant).toBe(true);
	});
	
	it('can return name from definition', function(){
		spyOn(definition, 'getName').and.returnValue('MY_CONSTANT');
		expect(constant.getName()).toBe('MY_CONSTANT');
	});
	
	it('will check string type with type checker', function(){
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			'Example',
			typeChecker,
			accessController
		);
		expect(typeChecker.isValidType).toHaveBeenCalledWith('Example', 'string');
	});
	
	it('will check number type with type checker', function(){
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		spyOn(definition, 'getTypeIdentifier').and.returnValue('number');
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			123,
			typeChecker,
			accessController
		);
		expect(typeChecker.isValidType).toHaveBeenCalledWith(123, 'number');
	});
	
	it('will not call type checker if value is undefined', function(){
		spyOn(typeChecker, 'isValidType');
		spyOn(definition, 'getTypeIdentifier');
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(typeChecker.isValidType).not.toHaveBeenCalled();
	});
	
	it('throws error if type checker indicates value is not valid', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'INVALID_VALUE',
			'Constant type: number'
		);
		spyOn(typeChecker, 'isValidType').and.returnValue(false);
		spyOn(definition, 'getTypeIdentifier').and.returnValue('number');
		expect(function(){
			new ClassyJS.Member.Constant(
				definition,
				false,
				'Example',
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('checks with access controller when value is requested', function(){
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		constant.get(constantOwnerConstructor, accessInstance);
		expect(accessController.canAccess).toHaveBeenCalledWith(
			constantOwnerConstructor,
			accessInstance,
			'public'
		);
		expect(definition.getAccessTypeIdentifier).toHaveBeenCalled();
	});
	
	it('throws error if value is requested with non-object target instance', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'NON_FUNCTION_TARGET_CONSTRUCTOR_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){ constant.get(undefined, accessInstance); }).toThrow(expectedFatal);
	});
	
	it('throws error if value is requested with non-object access instance', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal(
			'NON_OBJECT_ACCESS_INSTANCE_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){ constant.get(constantOwnerConstructor); }).toThrow(expectedFatal);
	});
	
	it('throws error if access controller does not allow access to value', function(){
		var expectedFatal = new ClassyJS.Member.Constant.Fatal('ACCESS_NOT_ALLOWED');
		spyOn(accessController, 'canAccess').and.returnValue(false);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		expect(function(){
			constant.get(constantOwnerConstructor, accessInstance);
		}).toThrow(expectedFatal);
	});
	
	it('will return provided string value', function(){
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			'Example value',
			typeChecker,
			accessController
		);
		expect(constant.get(constantOwnerConstructor, accessInstance)).toBe('Example value');
	});
	
	it('will return provided number value', function(){
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			321,
			typeChecker,
			accessController
		);
		expect(constant.get(constantOwnerConstructor, accessInstance)).toBe(321);
	});
	
	it('will return generated string', function(){
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		constant.get(constantOwnerConstructor, accessInstance);
		expect(typeof constant.get(constantOwnerConstructor, accessInstance)).toBe('string');
		expect(constant.get(constantOwnerConstructor, accessInstance)).toMatch(/^[A-Za-z0-9]{32}$/);
	});
	
	it('will return generated number', function(){
		spyOn(definition, 'getTypeIdentifier').and.returnValue('number');
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(typeof constant.get(constantOwnerConstructor, accessInstance)).toBe('number');
	});
	
	it('will return same generated value on consecutive calls', function(){
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		spyOn(definition, 'getTypeIdentifier').and.returnValue('string');
		var constant = new ClassyJS.Member.Constant(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		var firstCall = constant.get(constantOwnerConstructor, accessInstance);
		var secondCall = constant.get(constantOwnerConstructor, accessInstance);
		expect(firstCall === secondCall).toBe(true);
	});
	
});
