describe('AutoLoader', function(){
	
	var autoloader;
	var includer;
	var instantiator;
	var namespaceManager;
	
	beforeEach(function(){
		includer = new ClassyJS.AutoLoader.Includer.Script();
		instantiator = new ClassyJS.AutoLoader.Instantiator();
		namespaceManager = new ClassyJS.NamespaceManager();
		autoloader = new ClassyJS.AutoLoader(
			includer,
			instantiator,
			namespaceManager
		);
	});
	
	it('can be instantiated', function(){
		var loader = new ClassyJS.AutoLoader(
			includer,
			instantiator,
			namespaceManager
		);
		expect(loader instanceof ClassyJS.AutoLoader).toBe(true);
	});
	
	it('throws error if script includer is not provided', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal(
			'INCLUDER_NOT_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.AutoLoader(
				undefined,
				instantiator,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if instantiator is not provided', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal(
			'INSTANTIATOR_NOT_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.AutoLoader(
				includer,
				undefined,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if namespace manager is not provided', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal(
			'NAMESPACE_MANAGER_NOT_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			new ClassyJS.AutoLoader(
				includer,
				instantiator,
				{}
			);
		}).toThrow(expectedFatal);
	});
	
	it('checks for class existence with type registry on start', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(function(){});
		autoloader.start('Example.Class');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('Example.Class');
	});
	
	it('throws error if starting class name is not string', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal(
			'NON_STRING_CLASS_NAME',
			'Provided type: undefined'
		);
		expect(function(){ autoloader.start(); }).toThrow(expectedFatal);
	});
	
	it('creates object via instantiator if start class exists', function(){
		var constructor = function(){};
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(constructor);
		spyOn(instantiator, 'instantiate').and.callFake(function(constructor){
			return new constructor();
		});
		autoloader.start('Example.Class');
		expect(instantiator.instantiate).toHaveBeenCalledWith(constructor);
	});
	
	it('calls provided object method if start class exists', function(){
		var targetObject = { startMethod: function(){} };
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(function(){});
		spyOn(instantiator, 'instantiate').and.returnValue(targetObject);
		spyOn(targetObject, 'startMethod');
		autoloader.start('Example.Class', 'startMethod');
		expect(targetObject.startMethod).toHaveBeenCalledWith();
	});
	
	it('indicates not running before and after starting a pre-loaded class', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.returnValue(function(){});
		spyOn(instantiator, 'instantiate').and.returnValue({});
		expect(autoloader.isRunning()).toBe(false);
		autoloader.start('Example.Class');
		expect(autoloader.isRunning()).toBe(false);
	});
	
	it('passes script location, callbacks to includer if class does not exist', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.start('Example.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/Example/Class.js');
		expect(typeof includer.include.calls.argsFor(0)[1]).toBe('function');
		expect(typeof includer.include.calls.argsFor(0)[2]).toBe('function');
	});
	
	it('creates object via instantiator after being loaded', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		var targetObject = { startMethod: function(){} };
		var successCallback;
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(){
			if (this.getNamespaceObject.calls.count() == 1) throw namespaceManagerError;
			return function(){};
		});
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallback = success;
		});
		spyOn(instantiator, 'instantiate').and.returnValue(targetObject);
		spyOn(targetObject, 'startMethod');
		autoloader.start('Example.Class', 'startMethod');
		successCallback();
		expect(instantiator.instantiate).toHaveBeenCalledWith(constructor);
		expect(targetObject.startMethod).toHaveBeenCalledWith();
	});
	
	it('indicates running whilst loading a file', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		var successCallback;
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(){
			if (this.getNamespaceObject.calls.count() == 1) throw namespaceManagerError;
			return function(){};
		});
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallback = success;
		});
		spyOn(instantiator, 'instantiate').and.returnValue({});
		expect(autoloader.isRunning()).toBe(false);
		autoloader.start('Example.Class');
		expect(autoloader.isRunning()).toBe(true);
		successCallback();
		expect(autoloader.isRunning()).toBe(false);
	});
	
	it('throws error on call to start whilst running', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal('ALREADY_RUNNING');
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(){
			if (this.getNamespaceObject.calls.count() == 1) throw namespaceManagerError;
			return function(){};
		});
		spyOn(includer, 'include');
		spyOn(instantiator, 'instantiate').and.returnValue({});
		autoloader.start('Example.Class');
		expect(function(){ autoloader.start('Other.Class'); }).toThrow(expectedFatal);
	});
	
	it('can load further class before instantiating target class', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		spyOn(instantiator, 'instantiate');
		autoloader.start('Example.Class');
		autoloader.continue('Other.Class');
		expect(includer.include.calls.count()).toEqual(2);
		expect(includer.include.calls.argsFor(0)[0]).toEqual('/Example/Class.js');
		expect(includer.include.calls.argsFor(1)[0]).toEqual('/Other/Class.js');
	});
	
	it('throws error if continuing class name is not string', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal(
			'NON_STRING_CLASS_NAME',
			'Provided type: undefined'
		);
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.start('Example.Class');
		expect(function(){ autoloader.continue(); }).toThrow(expectedFatal);
	});
	
	it('throws error if continue is called whilst not running', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal('NOT_RUNNING');
		expect(function(){ autoloader.continue('Example.Class'); }).toThrow(expectedFatal);
	});
	
	it('instantiates target class after all scripts have been loaded', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		var targetObject = { startMethod: function(){} };
		var successCallbacks = {};
		var returnNamespaceObjects = false;
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(){
			if (returnNamespaceObjects) {
				return function(){};
			} else {
				throw namespaceManagerError;
			}
		});
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallbacks[script] = success;
		});
		spyOn(instantiator, 'instantiate').and.returnValue({});
		autoloader.start('Example.Class');
		autoloader.continue('Other.Class');
		autoloader.continue('Third.Class');
		returnNamespaceObjects = true;
		expect(instantiator.instantiate).not.toHaveBeenCalled();
		successCallbacks['/Example/Class.js']();
		successCallbacks['/Other/Class.js']();
		expect(instantiator.instantiate).not.toHaveBeenCalled();
		successCallbacks['/Third/Class.js']();
		expect(instantiator.instantiate).toHaveBeenCalled();
	});
	
	it('throws error if any script is not loaded', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal(
			'SCRIPT_NOT_LOADED',
			'Provided class name: Other.Class; ' +
			'Included script: /Other/Class.js'
		);
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		var errorCallback;
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			if (this.include.calls.count() == 2) errorCallback = error;
		});
		autoloader.start('Example.Class');
		autoloader.continue('Other.Class');
		expect(function(){ errorCallback(); }).toThrow(expectedFatal);
	});
	
	it('allows class loading pattern to be registered', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('Example', 'subfolder');
		autoloader.start('Example.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/subfolder/Class.js');
	});
	
	it('allows multiple class loading patterns to be registered', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('Example', 'subfolder');
		autoloader.addClassAutoloadPattern('Other', 'otherSubfolder');
		autoloader.addClassAutoloadPattern('Third', 'thirdSubfolder');
		autoloader.start('Other.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/otherSubfolder/Class.js');
	});
	
	it('allows nested class loading patterns to be registered', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('Example.My', 'my');
		autoloader.start('Example.My.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/my/Class.js');
	});
	
	it('uses longest available class name matching pattern', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('My', 'subfolder');
		autoloader.addClassAutoloadPattern('My.Test.Something', 'otherSubfolder');
		autoloader.addClassAutoloadPattern('My.Test', 'thirdSubfolder');
		autoloader.start('My.Test.Something.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/otherSubfolder/Class.js');
	});
	
	it('allows class matching patterns using different domain', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('DomainTest', 'http://some.other.domain');
		autoloader.start('DomainTest.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('http://some.other.domain/Class.js');
	});
	
	it('allows class matching patterns using subfolder on different domain', function(){
		var namespaceManagerError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
		);
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(namespaceManagerError);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('SubDomainTest', 'http://some.other.domain/subfolder');
		autoloader.start('SubDomainTest.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe(
			'http://some.other.domain/subfolder/Class.js'
		);
	});
	
	/**
	 *	Require includer
	 *	Require type registry
	 *	Allow passing of file patterns
	 *	Allow passing of class name - will require
	 * Keep track of what has been loaded - dont load same class twice
	 * When using file patterns, dont include same script location twice
	 *	Asks type registry if class exists before loading
	 *	Passes callback to includer to call on completion - then checks for all completeness
	 *	Make first call with start(className, methodCall)
	 *	On all completed, instantiate and call methodName in class
	 *	Actually, method is optional - just construct if not
	 * Error if constructor or method are not () -> undefined
	 *	Further calls are to continue(className)
	 *	Error if continue called whilst not loading
	 *	Cannot start whilst already started
	 *	Pass error callback to includer
	 * Can include non-blocking dependencies
	 *	Throw if included script does not create class
	 */
	
});