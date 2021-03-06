describe('Member.Method', function(){
	
	var method;
	var definition;
	var typeChecker;
	var accessController;
	var methodOwnerInstance;
	var methodLocalOwnerInstance;
	var accessInstance;
	
	beforeEach(function(){
		definition = new Picket.Member.Method.Definition('public myMethod () -> undefined');
		typeChecker = new Picket.TypeChecker(new Picket.TypeChecker.ReflectionFactory());
		accessController = new Picket.Access.Controller(
			new Picket.Registry.Type(
				new Picket.NamespaceManager()
			)
		);
		method = new Picket.Member.Method(
			definition,
			false,
			function(){},
			typeChecker,
			accessController
		);
		methodOwnerInstance = {};
		methodLocalOwnerInstance = {};
		accessInstance = {};
	});
	
	it('can be instantiated', function(){
		var method = new Picket.Member.Method(
			definition,
			false,
			function(){},
			typeChecker,
			accessController
		);
		expect(method instanceof Picket.Member.Method).toBe(true);
	});
	
	it('throws error if no definition is provided', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NO_DEFINITION_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Method(
				undefined,
				false,
				undefined,
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no type checker is provided', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NO_TYPE_CHECKER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Method(
				definition,
				false,
				undefined,
				undefined,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no access controller is provided', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NO_ACCESS_CONTROLLER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new Picket.Member.Method(
				definition,
				false,
				undefined,
				typeChecker
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if isFromInterface and value is not null, undefined or \'\'', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('UNEXPECTED_IMPLEMENTATION');
		expect(function(){
			new Picket.Member.Method(
				definition,
				true,
				function(){},
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if is abstract and value is not null, undefined or \'\'', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('UNEXPECTED_IMPLEMENTATION');
		spyOn(definition, 'isAbstract').and.returnValue(true);
		expect(function(){
			new Picket.Member.Method(
				definition,
				false,
				function(){},
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if implementation is not function', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NON_FUNCTION_IMPLEMENTATION',
			'Provided type: object'
		);
		spyOn(definition, 'isAbstract').and.returnValue(false);
		expect(function(){
			new Picket.Member.Method(
				definition,
				false,
				{},
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if any argument type is undefined', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('UNDEFINED_ARGUMENT_TYPE');
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue([
			'string',
			'number',
			'undefined'
		]);
		expect(function(){
			new Picket.Member.Method(
				definition,
				false,
				function(){},
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if any argument type is undefined', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('NULL_ARGUMENT_TYPE');
		spyOn(
			definition,
			'getArgumentTypeIdentifiers'
		).and.returnValue(['string', 'null', 'string']);
		expect(function(){
			new Picket.Member.Method(
				definition,
				false,
				function(){},
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
	});
	
	it('returns name from definition', function(){
		spyOn(definition, 'getName').and.returnValue('myMethod');
		expect(method.getName()).toBe('myMethod');
	});
	
	it('returns argument types from definition', function(){
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['string', 'number']);
		expect(method.getArgumentTypeIdentifiers()).toEqual(['string', 'number']);
	});
	
	it('returns isAbstract from definition', function(){
		spyOn(definition, 'isAbstract').and.returnValue(true);
		var method = new Picket.Member.Method(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(method.isAbstract()).toEqual(true);
	});
	
	it('returns isStatic from definition', function(){
		spyOn(definition, 'isStatic').and.returnValue(true);
		expect(method.isStatic()).toEqual(true);
	});
	
	it('throws error if called with non-object or function target', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NON_OBJECT_OR_CONSTRUCTOR_TARGET_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			method.call(undefined, methodLocalOwnerInstance, accessInstance, []);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if called with non-object or function local target', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NON_OBJECT_OR_CONSTRUCTOR_LOCAL_TARGET_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			method.call(methodOwnerInstance, undefined, accessInstance, []);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if called with non-array arguments', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NON_ARRAY_ARGUMENTS_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			method.call(methodOwnerInstance, methodLocalOwnerInstance, accessInstance);
		}).toThrow(expectedFatal);
	});
	
	it('checks with access controller on call', function(){
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		method.call(methodOwnerInstance, methodLocalOwnerInstance, accessInstance, []);
		expect(accessController.canAccess).toHaveBeenCalledWith(
			methodOwnerInstance,
			accessInstance,
			'public'
		);
		expect(definition.getAccessTypeIdentifier).toHaveBeenCalled();
	});
	
	it('throws error if access controller indicates method cannot be called', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('ACCESS_NOT_ALLOWED');
		spyOn(accessController, 'canAccess').and.returnValue(false);
		spyOn(definition, 'getAccessTypeIdentifier').and.returnValue('public');
		expect(function(){
			method.call(methodOwnerInstance, methodLocalOwnerInstance, accessInstance, []);
		}).toThrow(expectedFatal);
	});
	
	it('checks arguments on call', function(){
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(definition, 'getArgumentTypeIdentifiers').and.returnValue(['string', 'number']);
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		method.call(
			methodOwnerInstance,
			methodLocalOwnerInstance,
			accessInstance,
			['Example', 123]
		);
		expect(typeChecker.areValidTypes).toHaveBeenCalledWith(
			['Example', 123],
			['string', 'number']
		);
	});
	
	it('checks return argument from method implementation', function(){
		var method = new Picket.Member.Method(
			definition,
			false,
			function(){ return 'Return'; },
			typeChecker,
			accessController
		);
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		spyOn(definition, 'getReturnTypeIdentifier').and.returnValue('string');
		method.call(
			methodOwnerInstance,
			methodLocalOwnerInstance,
			accessInstance,
			['Example', 123]
		);
		expect(typeChecker.isValidType).toHaveBeenCalledWith(
			'Return',
			'string',
			methodLocalOwnerInstance
		);
	});
	
	it('throws error if type checker indicates return value is not valid', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'INVALID_RETURN_VALUE',
			'Returned type: string; Expected type: number'
		);
		var method = new Picket.Member.Method(
			definition,
			false,
			function(){ return 'Return'; },
			typeChecker,
			accessController
		);
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(false);
		spyOn(definition, 'getReturnTypeIdentifier').and.returnValue('number');
		expect(function(){
			method.call(methodOwnerInstance, methodLocalOwnerInstance, accessInstance, []);
		}).toThrow(expectedFatal);
	});
	
	it('returns implementation return argument', function(){
		var method = new Picket.Member.Method(
			definition,
			false,
			function(){ return 'Return'; },
			typeChecker,
			accessController
		);
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(method.call(
			methodOwnerInstance,
			methodLocalOwnerInstance,
			accessInstance,
			[]
		)).toBe('Return');
	});
	
	it('binds owner instance to this within method implementation', function(){
		var method = new Picket.Member.Method(
			definition,
			false,
			function(){ return this; },
			typeChecker,
			accessController
		);
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(method.call(
			methodOwnerInstance,
			methodLocalOwnerInstance,
			accessInstance,
			[]
		)).toBe(methodOwnerInstance);
	});
	
	it('passes arguments to method implementation', function(){
		var method = new Picket.Member.Method(
			definition,
			false,
			function(arg1, arg2, arg3){ return [arg1, arg2, arg3]; },
			typeChecker,
			accessController
		);
		spyOn(accessController, 'canAccess').and.returnValue(true);
		spyOn(typeChecker, 'areValidTypes').and.returnValue(true);
		spyOn(typeChecker, 'isValidType').and.returnValue(true);
		expect(method.call(
			methodOwnerInstance,
			methodLocalOwnerInstance,
			accessInstance,
			['One', 'Two', 'Three']
		)).toEqual(['One', 'Two', 'Three']);
	});
	
	it('throws error if method is called whilst abstract', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('INTERACTION_WITH_ABSTRACT');
		spyOn(definition, 'isAbstract').and.returnValue(true);
		var method = new Picket.Member.Method(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(function(){
			method.call(methodOwnerInstance, methodLocalOwnerInstance, accessInstance, []);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if interface defined method is called', function(){
		var expectedFatal = new Picket.Member.Method.Fatal('INTERACTION_WITH_ABSTRACT');
		var method = new Picket.Member.Method(
			definition,
			true,
			undefined,
			typeChecker,
			accessController
		);
		expect(function(){
			method.call(methodOwnerInstance, methodLocalOwnerInstance, accessInstance, []);
		}).toThrow(expectedFatal);
	});
	
	it('makes variables available within method when provided to call', function(){
		var methodImplementation = function(){
			expect(example1).toBe('Value 1');
			expect(example2).toBe('Value 2');
		};
		var method = new Picket.Member.Method(
			definition,
			false,
			methodImplementation,
			typeChecker,
			accessController
		);
		method.call(methodOwnerInstance, methodLocalOwnerInstance, accessInstance, [], {
			example1: 'Value 1',
			example2: 'Value 2'
		});
	});
	
	it('throws error if scope variables are not object', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NON_OBJECT_SCOPE_VARIABLES',
			'Provided type: string'
		);
		expect(function(){
			method.call(
				methodOwnerInstance,
				methodLocalOwnerInstance,
				accessInstance,
				[],
				'string'
			);
		}).toThrow(expectedFatal);
	});
	
	it('allows interface method to have no argument types', function(){
		spyOn(definition, 'hasArgumentTypes');
		spyOn(definition, 'getArgumentTypeIdentifiers');
		var method = new Picket.Member.Method(
			definition,
			true,
			undefined,
			typeChecker,
			accessController
		);
		expect(definition.getArgumentTypeIdentifiers).not.toHaveBeenCalled();
	});
	
	it('allows abstract method to have no argument types', function(){
		spyOn(definition, 'isAbstract').and.returnValue(true);
		spyOn(definition, 'hasArgumentTypes');
		spyOn(definition, 'getArgumentTypeIdentifiers');
		var method = new Picket.Member.Method(
			definition,
			false,
			undefined,
			typeChecker,
			accessController
		);
		expect(definition.getArgumentTypeIdentifiers).not.toHaveBeenCalled();
	});
	
	it('throws error if non-interface and non-abstract does not declare argument types', function(){
		var expectedFatal = new Picket.Member.Method.Fatal(
			'NON_ABSTRACT_METHOD_DECLARED_WITH_NO_ARGUMENT_TYPES'
		);
		spyOn(definition, 'isAbstract').and.returnValue(false);
		spyOn(definition, 'hasArgumentTypes').and.returnValue(false);
		expect(function(){
			var method = new Picket.Member.Method(
				definition,
				false,
				function(){},
				typeChecker,
				accessController
			);
		}).toThrow(expectedFatal);
		expect(definition.hasArgumentTypes).toHaveBeenCalledWith();
	});
	
});
