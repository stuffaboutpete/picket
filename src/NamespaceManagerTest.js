describe('NamespaceManager', function(){
	
	beforeEach(function(){
		window.MyClass = undefined;
		window.My = undefined;
	});
	
	it('will return namespace object from name', function(){
		window.My = {};
		window.My.CustomNamespace = {};
		var manager = new ClassyJS.NamespaceManager();
		expect(manager.getNamespaceObject('My.CustomNamespace')).toBe(window.My.CustomNamespace);
	});
	
	it('will return namespace class from name', function(){
		var constructor = function(){};
		window.My = {};
		window.My.CustomNamespace = {};
		window.My.CustomNamespace.MyClass = constructor;
		var manager = new ClassyJS.NamespaceManager();
		expect(manager.getNamespaceObject('My.CustomNamespace.MyClass')).toBe(constructor);
	});
	
	it('will throw error if namespace class does not exist', function(){
		var expectedFatal = new ClassyJS.NamespaceManager.Fatal('NAMESPACE_OBJECT_DOES_NOT_EXIST');
		window.My = {};
		window.My.CustomNamespace = {};
		var manager = new ClassyJS.NamespaceManager();
		expect(function(){
			manager.getNamespaceObject('My.CustomNamespace.MyClass');
		}).toThrow(expectedFatal);
	});
	
	it('can register simple class in global namespace', function(){
		var constructor = function(){};
		var manager = new ClassyJS.NamespaceManager();
		manager.registerClassFunction('MyClass', constructor);
		expect(manager.getNamespaceObject('MyClass')).toBe(constructor);
	});
	
	it('can register new class in existing namespace', function(){
		var constructor = function(){};
		window.My = {};
		window.My.CustomNamespace = {};
		var manager = new ClassyJS.NamespaceManager();
		manager.registerClassFunction('My.CustomNamespace.RegisteredClass', constructor);
		expect(manager.getNamespaceObject('My.CustomNamespace.RegisteredClass')).toBe(constructor);
	});
	
	it('can register new class in new namespace', function(){
		var constructor = function(){};
		var manager = new ClassyJS.NamespaceManager();
		expect(typeof window.My).toBe('undefined');
		manager.registerClassFunction('My.CustomNamespace.RegisteredClass', constructor);
		expect(manager.getNamespaceObject('My.CustomNamespace.RegisteredClass')).toBe(constructor);
	});
	
	it('can preserve function whilst using as namespace object', function(){
		var constructor = function(){};
		window.My = {};
		window.My.SomeClass = function(){};
		window.My.SomeClass.someProperty = 'Value';
		var manager = new ClassyJS.NamespaceManager();
		manager.registerClassFunction('My.SomeClass.OtherClass', constructor);
		expect(manager.getNamespaceObject('My.SomeClass.OtherClass')).toBe(constructor);
		expect(window.My.SomeClass.someProperty).toEqual('Value');
	});
	
	it('can preserve downstream namespace objects when registering class', function(){
		var constructor = function(){};
		var otherClassConstructor = function(){};
		window.My = {};
		window.My.MyClass = {};
		window.My.MyClass.OtherClass = otherClassConstructor;
		window.My.MyClass.OtherClass.someProperty = 'Value';
		var manager = new ClassyJS.NamespaceManager();
		manager.registerClassFunction('My.MyClass', constructor);
		expect(manager.getNamespaceObject('My.MyClass')).toBe(constructor);
		expect(manager.getNamespaceObject('My.MyClass.OtherClass')).toBe(otherClassConstructor);
		expect(window.My.MyClass.OtherClass.someProperty).toEqual('Value');
	});
	
});
