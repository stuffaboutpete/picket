describe('Access.Type', function(){
	
	it('can be instantiated with keyword', function(){
		var accessType = new ClassyJS.Access.Type('public');
		expect(accessType instanceof ClassyJS.Access.Type).toBe(true);
	});
	
	it('cannot be instantiated without keyword', function(){
		var expectedFatal = new ClassyJS.Access.Type.Fatal('NON_STRING_IDENTIFIER');
		expect(function(){ new ClassyJS.Access.Type(); }).toThrow(expectedFatal);
	});
	
	it('can be instantiated with public, private or protected', function(){
		new ClassyJS.Access.Type('public');
		new ClassyJS.Access.Type('private');
		new ClassyJS.Access.Type('protected');
	});
	
	it('cannot be instantiated with other keyword', function(){
		var expectedFatal = new ClassyJS.Access.Type.Fatal('INVALID_IDENTIFIER')
		expect(function(){ new ClassyJS.Access.Type('other'); }).toThrow(expectedFatal);
	});
	
	it('indicates public type can be accessed by child and all', function(){
		var type = new ClassyJS.Access.Type('public');
		expect(type.childAllowed()).toBe(true);
		expect(type.allAllowed()).toBe(true);
	});
	
	it('indicates protected type can be accessed by child but not all', function(){
		var type = new ClassyJS.Access.Type('protected');
		expect(type.childAllowed()).toBe(true);
		expect(type.allAllowed()).toBe(false);
	});
	
	it('indicates private type cannot be accessed by child or all', function(){
		var type = new ClassyJS.Access.Type('private');
		expect(type.childAllowed()).toBe(false);
		expect(type.allAllowed()).toBe(false);
	});
	
});
