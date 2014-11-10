describe('Member.Event.Definition', function(){
	
	it('can be instantiated with a signature', function(){
		var eventDefinition = new ClassyJS.Member.Event.Definition('public event myEvent()');
		expect(eventDefinition instanceof ClassyJS.Member.Event.Definition).toBe(true);
	});
	
	it('throws error if instantiated with no signature', function(){
		var expectedFatal = new ClassyJS.Member.Event.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: undefined'
		);
		expect(function(){ new ClassyJS.Member.Event.Definition(); }).toThrow(expectedFatal);
	});
	
	it('throws error if instantiated with non string signature', function(){
		var expectedFatal = new ClassyJS.Member.Event.Definition.Fatal(
			'NON_STRING_SIGNATURE',
			'Provided type: object'
		);
		expect(function(){ new ClassyJS.Member.Event.Definition({}); }).toThrow(expectedFatal);
	});
	
	it('throws error if signature is not recognised', function(){
		var expectedFatal = new ClassyJS.Member.Event.Definition.Fatal(
			'SIGNATURE_NOT_RECOGNISED',
			'Provided signature: gibberish'
		);
		expect(function(){
			new ClassyJS.Member.Event.Definition('gibberish');
		}).toThrow(expectedFatal);
	});
	
	it('can return name from signature', function(){
		var eventDefinition = new ClassyJS.Member.Event.Definition('public event myEvent()');
		expect(eventDefinition.getName()).toBe('myEvent');
	});
	
	it('can return access type identifier from signature', function(){
		var eventDefinition = new ClassyJS.Member.Event.Definition('protected event myEvent()');
		expect(eventDefinition.getAccessTypeIdentifier()).toBe('protected');
	});
	
	it('can return return type identifier from signature', function(){
		var eventDefinition = new ClassyJS.Member.Event.Definition(
			'public event myEvent ([string], number)'
		);
		expect(eventDefinition.getArgumentTypeIdentifiers()).toEqual(['[string]', 'number']);
	});
	
	it('can parse signature with irregular whitespace', function(){
		var eventDefinition = new ClassyJS.Member.Event.Definition(
			' 	public	 	event	 myEvent 	(	 [HTMLElement] ,	 [number] 	)	'
		);
		expect(eventDefinition.getName()).toEqual('myEvent');
		expect(eventDefinition.getAccessTypeIdentifier()).toEqual('public');
		expect(eventDefinition.getArgumentTypeIdentifiers()).toEqual(['[HTMLElement]', '[number]']);
	});
	
});
