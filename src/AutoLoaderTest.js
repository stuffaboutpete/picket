describe('AutoLoader', function(){
	
	/**
	 * @todo
	 * 
	 * Error if constructor or method are not () -> undefined
	 * Can include non-blocking dependencies
	 */
	
	var autoloader;
	var includer;
	var instantiator;
	var namespaceManager;
	var namespaceObjectDoesNotExistError;
	
	beforeEach(function(){
		delete window.My;
		includer = new ClassyJS.AutoLoader.Includer.Script();
		instantiator = new ClassyJS.AutoLoader.Instantiator();
		namespaceManager = new ClassyJS.NamespaceManager();
		autoloader = new ClassyJS.AutoLoader(
			includer,
			instantiator,
			namespaceManager
		);
		namespaceObjectDoesNotExistError = new ClassyJS.NamespaceManager.Fatal(
			'NAMESPACE_OBJECT_DOES_NOT_EXIST'
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
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.start('Example.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/Example/Class.js');
		expect(typeof includer.include.calls.argsFor(0)[1]).toBe('function');
		expect(typeof includer.include.calls.argsFor(0)[2]).toBe('function');
	});
	
	it('creates object via instantiator after being loaded', function(){
		var targetObject = { startMethod: function(){} };
		var successCallback;
		var namespaceObjectExists = false;
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(){
			if (namespaceObjectExists) {
				return function(){};
			} else {
				throw namespaceObjectDoesNotExistError;
			}
		});
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallback = success;
		});
		spyOn(instantiator, 'instantiate').and.returnValue(targetObject);
		spyOn(targetObject, 'startMethod');
		autoloader.start('Example.Class', 'startMethod');
		namespaceObjectExists = true;
		successCallback();
		expect(instantiator.instantiate).toHaveBeenCalledWith(constructor);
		expect(targetObject.startMethod).toHaveBeenCalledWith();
	});
	
	it('indicates running whilst loading a file', function(){
		var successCallback;
		var namespaceObjectExists = false;
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(){
			if (namespaceObjectExists) {
				return function(){};
			} else {
				throw namespaceObjectDoesNotExistError;
			}
		});
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallback = success;
		});
		spyOn(instantiator, 'instantiate').and.returnValue({});
		expect(autoloader.isRunning()).toBe(false);
		autoloader.start('Example.Class');
		expect(autoloader.isRunning()).toBe(true);
		namespaceObjectExists = true;
		successCallback();
		expect(autoloader.isRunning()).toBe(false);
	});
	
	it('can load further class before instantiating target class', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
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
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.start('Example.Class');
		expect(function(){ autoloader.continue(); }).toThrow(expectedFatal);
	});
	
	it('throws error if continue is called whilst not running', function(){
		var expectedFatal = new ClassyJS.AutoLoader.Fatal('NOT_RUNNING');
		expect(function(){ autoloader.continue('Example.Class'); }).toThrow(expectedFatal);
	});
	
	it('instantiates target class after all scripts have been loaded', function(){
		var successCallbacks = {};
		var returnNamespaceObjects = false;
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(){
			if (returnNamespaceObjects) {
				return function(){};
			} else {
				throw namespaceObjectDoesNotExistError;
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
		var errorCallback;
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			if (this.include.calls.count() == 2) errorCallback = error;
		});
		autoloader.start('Example.Class');
		autoloader.continue('Other.Class');
		expect(function(){ errorCallback(); }).toThrow(expectedFatal);
	});
	
	it('allows class loading pattern to be registered', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('Example', 'subfolder');
		autoloader.start('Example.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/subfolder/Class.js');
	});
	
	it('allows multiple class loading patterns to be registered', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('Example', 'subfolder');
		autoloader.addClassAutoloadPattern('Other', 'otherSubfolder');
		autoloader.addClassAutoloadPattern('Third', 'thirdSubfolder');
		autoloader.start('Other.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/otherSubfolder/Class.js');
	});
	
	it('allows nested class loading patterns to be registered', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('Example.My', 'my');
		autoloader.start('Example.My.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/my/Class.js');
	});
	
	it('uses longest available class name matching pattern', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('My', 'subfolder');
		autoloader.addClassAutoloadPattern('My.Test.Something', 'otherSubfolder');
		autoloader.addClassAutoloadPattern('My.Test', 'thirdSubfolder');
		autoloader.start('My.Test.Something.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('/otherSubfolder/Class.js');
	});
	
	it('allows class matching patterns using different domain', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('DomainTest', 'http://some.other.domain');
		autoloader.start('DomainTest.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe('http://some.other.domain/Class.js');
	});
	
	it('allows class matching patterns using subfolder on different domain', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include');
		autoloader.addClassAutoloadPattern('SubDomainTest', 'http://some.other.domain/subfolder');
		autoloader.start('SubDomainTest.Class');
		expect(includer.include.calls.argsFor(0)[0]).toBe(
			'http://some.other.domain/subfolder/Class.js'
		);
	});
	
	it('allows two independent stacks to load simultaneously', function(){
		
		var namespaceObjectsAvailable = {};
		var exampleClassConstructor = function(){};
		var otherClassConstructor = function(){};
		var successCallbacks = {};
		
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(name){
			if (typeof namespaceObjectsAvailable[name] === 'function') {
				return namespaceObjectsAvailable[name];
			} else if (namespaceObjectsAvailable[name] === true) {
				return function(){};
			} else {
				throw namespaceObjectDoesNotExistError;
			}
		});
		
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallbacks[script] = success;
		});
		
		spyOn(instantiator, 'instantiate');
		
		autoloader.start('Example.Class');
		autoloader.start('Other.Class');
		
		// All triggered by Other.Class loading
		autoloader.continue('FromOther.One');
		autoloader.continue('FromOther.Two');
		namespaceObjectsAvailable['Other.Class'] = otherClassConstructor;
		successCallbacks['/Other/Class.js']();
		
		expect(instantiator.instantiate.calls.count()).toBe(0);
		
		// Triggered by FromOther.Two loading
		namespaceObjectsAvailable['FromOther.Two'] = true;
		successCallbacks['/FromOther/Two.js']();
		
		expect(instantiator.instantiate.calls.count()).toBe(0);
		
		// Triggered by Example.Class loading
		autoloader.continue('FromExample.One');
		autoloader.continue('FromExample.Two');
		namespaceObjectsAvailable['Example.Class'] = exampleClassConstructor;
		successCallbacks['/Example/Class.js']();
		
		expect(instantiator.instantiate.calls.count()).toBe(0);
		
		// Triggered by FromOther.One loading
		namespaceObjectsAvailable['FromOther.One'] = true;
		successCallbacks['/FromOther/One.js']();
		
		expect(instantiator.instantiate.calls.count()).toBe(1);
		expect(instantiator.instantiate.calls.mostRecent().args[0]).toBe(otherClassConstructor);
		
		namespaceObjectsAvailable['FromExample.One'] = true;
		successCallbacks['/FromExample/One.js']();
		
		expect(instantiator.instantiate.calls.count()).toBe(1);
		
		namespaceObjectsAvailable['FromExample.Two'] = true;
		successCallbacks['/FromExample/Two.js']();
		
		expect(instantiator.instantiate.calls.count()).toBe(2);
		expect(instantiator.instantiate.calls.mostRecent().args[0]).toBe(exampleClassConstructor);
		
	});
	
	it('allows class to be required and method be called if already loaded', function(){
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(name){
			return function(){};
		});
		define('class My.Class', {
			'public targetMethod (string) -> undefined': function(className){}
		});
		var myObject = new My.Class();
		spyOn(myObject, 'targetMethod');
		autoloader.require('Example.Class', myObject, 'targetMethod');
		expect(myObject.targetMethod).toHaveBeenCalledWith('Example.Class');
		expect(namespaceManager.getNamespaceObject).toHaveBeenCalledWith('Example.Class');
	});
	
	it('allows class to be required and method be called when loaded', function(){
		var namespaceObjectExists = false;
		var successCallbacks = {};
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(name){
			if (namespaceObjectExists) {
				return function(){};
			} else {
				throw namespaceObjectDoesNotExistError;
			}
		});
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallbacks[script] = success;
		});
		define('class My.Class', {
			'public targetMethod (string) -> undefined': function(className){}
		});
		var myObject = new My.Class();
		spyOn(myObject, 'targetMethod');
		autoloader.require('Example.Class', myObject, 'targetMethod');
		autoloader.continue('Other.Class');
		autoloader.continue('Third.Class');
		namespaceObjectExists = true;
		expect(myObject.targetMethod).not.toHaveBeenCalled();
		successCallbacks['/Example/Class.js']();
		successCallbacks['/Other/Class.js']();
		expect(myObject.targetMethod).not.toHaveBeenCalled();
		successCallbacks['/Third/Class.js']();
		expect(myObject.targetMethod).toHaveBeenCalledWith('Example.Class');
	});
	
	it('does not load same script twice', function(){
		var successCallbacks = {};
		var namespaceObjectsAvailable = {};
		spyOn(namespaceManager, 'getNamespaceObject').and.callFake(function(name){
			if (typeof namespaceObjectsAvailable[name] === 'function') {
				return namespaceObjectsAvailable[name];
			} else if (namespaceObjectsAvailable[name] === true) {
				return function(){};
			} else {
				throw namespaceObjectDoesNotExistError;
			}
		});
		spyOn(includer, 'include').and.callFake(function(script, success, error){
			successCallbacks[script] = success;
		});
		spyOn(instantiator, 'instantiate').and.returnValue({});
		autoloader.start('Example.Class');
		autoloader.continue('Other.Class');
		autoloader.continue('MultiDependency.Class');
		namespaceObjectsAvailable['Example.Class'] = true;
		successCallbacks['/Example/Class.js']();
		autoloader.continue('MultiDependency.Class');
		successCallbacks['/Other/Class.js']();
		successCallbacks['/MultiDependency/Class.js']();
		var includerCalls = includer.include.calls.allArgs();
		expect(includerCalls.length).toBe(3);
		expect(includerCalls[0][0]).toBe('/Example/Class.js');
		expect(includerCalls[1][0]).toBe('/Other/Class.js');
		expect(includerCalls[2][0]).toBe('/MultiDependency/Class.js');
	});
	
	it('runs continue callback when certain class is loaded', function(){
		var callback = jasmine.createSpy('callback');
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include').and.callFake(function(script, success){
			if (script === '/Other/Class.js') success();
		});
		autoloader.start('Example.Class');
		autoloader.continue('Other.Class', callback);
		expect(callback).toHaveBeenCalled();
	});
	
	it('allows class to be required multiple times and run correct number of times', function(){
		var successCallback;
		spyOn(namespaceManager, 'getNamespaceObject').and.throwError(
			namespaceObjectDoesNotExistError
		);
		spyOn(includer, 'include').and.callFake(function(script, success){
			successCallback = success;
		});
		define('class My.Class', {
			'public numberOfCalls (number)': 0,
			'public targetMethod (string) -> undefined': function(className){
				this.numberOfCalls('++');
			}
		});
		var myObject = new My.Class();
		autoloader.require('Example.Class', myObject, 'targetMethod');
		autoloader.require('Example.Class', myObject, 'targetMethod');
		expect(myObject.numberOfCalls()).toBe(0);
		successCallback();
		expect(myObject.numberOfCalls()).toBe(2);
	});
	
});
