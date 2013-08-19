module('Class Tests');

QUnit.testStart(function(){
	window.MyClass = undefined;
	window.MyParent = undefined;
	window.MyChild = undefined;
	window.OtherClass = undefined;
	window.My = undefined;
	window.MyInterface = undefined;
});

test('Root \'Class\' can be instantiated', function(){
	
	// Create instance of Class
	var myObject = new Class();
	
	// Test it is an instance of Class
	ok(myObject instanceof Class);
	
});

// @todo Collect custom error
test('Defining class without name throws error', function(){
	
	// Test defining with no name
	// parameter errors
	raises(function(){
		Class.define();
	}, InvalidClassDeclarationFatal);
	
});

test('Class can be defined with name and instantiated', function(){
	
	// Define a new class
	Class.define('MyClass');
	
	// Test the class has been created
	ok(typeof MyClass == 'function');
	
	// Create an instance of new class
	var myObject = new MyClass();
	
	// Test is is an instance of new class
	ok(myObject instanceof MyClass);
	
});

test('Declared class property exists in object', function(){
	Class.define('MyClass', {
		myProperty: 'Value'
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'Value');
});

test('Class property can be set', function(){
	Class.define('MyClass', {
		myProperty: null
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'My String')
	ok(myObject.get('myProperty') == 'My String');
});

test('Class method can be called', function(){
	Class.define('MyClass', {
		myMethod: function(){return 'Return Value';}
	});
	var myObject = new MyClass();
	ok(myObject.call('myMethod') == 'Return Value');
});

test('Object method can be called magically by name', function(){
	Class.define('MyClass', {
		myMethod: function(){
			return 'My Value';
		}
	});
	var myObject = new MyClass();
	ok(myObject.myMethod() === 'My Value');
});

test('Single argument is passed to class method', function(){
	Class.define('MyClass', {
		myMethod: function(arg){
			return 'Your arg: ' + arg;
		}
	});
	var myObject = new MyClass();
	ok(myObject.myMethod('Something') == 'Your arg: Something');
});

test('Multiple arguments are passed to class method', function(){
	Class.define('MyClass', {
		myMethod: function(arg1, arg2, arg3){
			return [arg1, arg2, arg3];
		}
	});
	var myObject = new MyClass();
	var returnValue = myObject.myMethod('One', 'Two', 'Three');
	ok(returnValue[0] === 'One');
	ok(returnValue[1] === 'Two');
	ok(returnValue[2] === 'Three');
});

test('\'this\' keyword is bound to object within class method', function(){
	Class.define('MyClass', {
		myProperty: 'myValue',
		myMethod: function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok(myObject.myMethod() == 'myValue');
});

test('New namespace is created if class name requires it', function(){
	Class.define('My.TestClass');
	ok(typeof My == 'object');
	ok(typeof My.TestClass == 'function');
});

test('Class is created within namespace if it already exists', function(){
	window.My = {};
	Class.define('My.TestClass');
	ok(typeof My == 'object');
	ok(typeof My.TestClass == 'function');
});

test('Classes can be subclassed using the Extends keyword', function(){
	Class.define('MyParent', {
		parentMethod: function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myChild = new MyChild();
	ok(myChild.parentMethod() == 'Returned from Parent');
});

test('Child methods override parent methods', function(){
	Class.define('MyParent', {
		myMethod: function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		myMethod: function(){return 'Returned from Child';}
	});
	var myChild = new MyChild();
	ok(myChild.myMethod() == 'Returned from Child');
});

test('Child methods can call overridden parent methods', function(){
	Class.define('MyParent', {
		myMethod: function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		myMethod: function(){
			return this.parent.myMethod();
		}
	});
	var myChild = new MyChild();
	ok(myChild.myMethod() == 'Returned from Parent');
});

test('Child methods can call non overridden parent methods', function(){
	Class.define('MyParent', {
		myMethod: function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		myOtherMethod: function(){
			return this.parent.myMethod();
		}
	});
	var myChild = new MyChild();
	ok(myChild.myOtherMethod() == 'Returned from Parent');
});

test('Child methods can call parent construct method', function(){
	Class.define('MyParent', {
		myProperty: null,
		construct: function(myProperty){
			this.set('myProperty', myProperty);
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		construct: function(myProperty){
			this.parent.construct(myProperty);
		}
	});
	var myChild = new MyChild('My Value');
	ok(myChild.get('myProperty') == 'My Value');
});

test('Abstract classes cannot be instantiated', function(){
	Class.define('MyClass', {
		Abstract: true
	});
	raises(function(){
		var myObject = new MyClass();
	}, AbstractClassFatal);
});

test('Extending classes can implement abstract classes', function(){
	Class.define('MyParent', {
		Abstract: true,
		myProperty: 'myValue'
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myChild = new MyChild();
	ok(myChild.get('myProperty') == 'myValue');
});

test('Constructor method is called on instantiation', function(){
	Class.define('MyClass', {
		myProperty: undefined,
		construct: function(){
			this.set('myProperty', 'Some String');
		}
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'Some String');
});

test('Constructor arguments are passed to constuctor method', function(){
	Class.define('MyClass', {
		myProperty: undefined,
		construct: function(arg1, arg2, arg3){
			this.set('myProperty', [arg1, arg2, arg3]);
		}
	});
	var myObject = new MyClass('One', 'Two', 'Three');
	var returnValue = myObject.get('myProperty');
	ok(returnValue[0] == 'One');
	ok(returnValue[1] == 'Two');
	ok(returnValue[2] == 'Three');
});

test('Public properties can be accessed from inside of object', function(){
	Class.define('MyClass', {
		'public:myProperty': 'myValue',
		'public:myMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.myMethod());
});

test('Public properties can be accessed from subclasses', function(){
	Class.define('MyParent', {
		'public:myProperty': 'myValue'
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myMethod': function(){
			return this.get('myProperty');
		}
	});
	var myChild = new MyChild();
	ok('myValue' == myChild.myMethod());
});

test('Public properties can be accessed from outside of object', function(){
	Class.define('MyClass', {
		'public:myProperty': 'myValue'
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.get('myProperty'));
});

test('Protected properties can be accessed from inside of object', function(){
	Class.define('MyClass', {
		'protected:myProperty': 'myValue',
		'public:myMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.myMethod());
});

test('Protected properties can be accessed from subclasses', function(){
	Class.define('MyClass', {
		'protected:myProperty': 'myValue'
	});
	Class.define('MySubClass', {
		Extends: MyClass,
		'public:myMethod': function(){
			return this.get('myProperty');
		}
	});
	var mySubObject = new MySubClass();
	ok('myValue' == mySubObject.myMethod());
});

test('Protected properties cannot be accessed from outside of object', function(){
	Class.define('MyClass', {
		'protected:myProperty': 'myValue'
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.get('myProperty');
	}, ScopeFatal);
});

test('Private properties can be accessed from inside class', function(){
	Class.define('MyClass', {
		'private:myProperty': 'myValue',
		'public:myMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.myMethod());
});

test('Private properties cannot be accessed from subclasses', function(){
	Class.define('MyParent', {
		'private:myProperty': 'myValue'
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myMethod': function(){
			return this.get('myProperty');
		}
	});
	var myChild = new MyChild();
	raises(function(){
		myChild.myMethod();
	}, ScopeFatal);
});

test('Private properties cannot be accessed from outside of object', function(){
	Class.define('MyClass', {
		'private:myProperty': 'myValue'
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.get('myProperty');
	}, ScopeFatal);
});

test('Public methods can be accessed from inside of object', function(){
	Class.define('MyClass', {
		'public:myValueMethod': function(){
			return 'myValue';
		},
		'public:myAccessMethod': function(){
			return this.myValueMethod();
		}
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.myAccessMethod());
});

test('Public methods can be accessed from subclasses', function(){
	Class.define('MyParent', {
		'public:myValueMethod': function(){
			return 'myValue';
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myAccessMethod': function(){
			return this.myValueMethod();
		}
	});
	var myChild = new MyChild();
	ok('myValue' == myChild.myAccessMethod());
});

test('Public methods can be accessed from outside of object', function(){
	Class.define('MyClass', {
		'public:myValueMethod': function(){
			return 'myValue';
		}
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.myValueMethod());
});

test('Protected methods can be accessed from inside of object', function(){
	Class.define('MyClass', {
		'protected:myValueMethod': function(){
			return 'myValue';
		},
		'public:myAccessMethod': function(){
			return this.myValueMethod();
		}
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.myAccessMethod());
});

test('Protected methods can be accessed from subclasses', function(){
	Class.define('MyParent', {
		'protected:myValueMethod': function(){
			return 'myValue';
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myAccessMethod': function(){
			return this.myValueMethod();
		}
	});
	var myChild = new MyChild();
	ok('myValue' == myChild.myAccessMethod());
});

test('Protected methods cannot be accessed from outside of object', function(){
	Class.define('MyClass', {
		'protected:myValueMethod': function(){
			return 'myValue';
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myValueMethod();
	}, ScopeFatal);
});

test('Private methods can be accessed from inside class', function(){
	Class.define('MyClass', {
		'private:myValueMethod': function(){
			return 'myValue';
		},
		'public:myAccessMethod': function(){
			return this.myValueMethod();
		}
	});
	var myObject = new MyClass();
	ok('myValue' == myObject.myAccessMethod());
});

test('Private methods cannot be accessed from subclasses', function(){
	Class.define('MyParent', {
		'private:myValueMethod': function(){
			return 'myValue';
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myAccessMethod': function(){
			return this.myValueMethod();
		}
	});
	var myChild = new MyChild();
	raises(function(){
		myChild.myAccessMethod();
	}, ScopeFatal);
});

test('Private methods cannot be accessed from outside of object', function(){
	Class.define('MyClass', {
		'private:myValueMethod': function(){
			return 'myValue';
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myValueMethod();
	}, ScopeFatal);
});

test('Interface can be defined', function(){
	Interface.define('MyInterface');
	ok(typeof MyInterface != 'undefined');
});

test('Interface cannot be instantiated', function(){
	Interface.define('MyInterface');
	raises(function(){
		var myInterface = new MyInterface();
	}, CannotInstantiateInterfaceFatal);
});

test('Class can implement interface using keyword Implements', function(){
	Interface.define('MyInterface');
	Class.define('MyClass', {
		Implements: MyInterface
	});
	var myObject = new MyClass();
	ok(myObject instanceof MyClass);
});

test('Interface definition can specify array of methods', function(){
	Interface.define('MyInterface', [
		'myMethod()',
		'myOtherMethod(myArgument)'
	]);
	ok(typeof MyInterface != 'undefined');
});

test('Interface must have brackets after method name', function(){
	raises(function(){
		Interface.define('MyInterface', [
			'myMethod'
		]);
	}, InterfaceIncorrectlyDefinedFatal);
});

test('Class cannot be instantiated without interface methods', function(){
	Interface.define('MyInterface', [
		'myMethod()',
		'myOtherMethod()'
	]);
	Class.define('MyClass', {
		Implements: MyInterface
	});
	raises(function(){
		var myObject = new MyClass();
	}, InterfaceMethodNotImplementedFatal);
});

test('Class can be instantiated with interface methods', function(){
	Interface.define('MyInterface', [
		'myMethod()',
		'myOtherMethod()'
	]);
	Class.define('MyClass', {
		Implements: MyInterface,
		myMethod: function(){},
		myOtherMethod: function(){}
	});
	var myObject = new MyClass();
	ok(myObject instanceof MyClass);
});

test('Class must have arguments which match interface arguments', function(){
	Interface.define('MyInterface', [
		'myMethod(myArgument)',
		'myOtherMethod(arg1, arg2)'
	]);
	Class.define('MyClass', {
		Implements: MyInterface,
		myMethod: function(){},
		myOtherMethod: function(){}
	});
	Class.define('OtherClass', {
		Implements: MyInterface,
		myMethod: function(myArgument){},
		myOtherMethod: function(arg1, arg2){}
	});
	raises(function(){
		var myObject = new MyClass();
	}, InterfaceMethodNotImplementedFatal);
	var otherObject = new OtherClass();
	ok(otherObject instanceof OtherClass);
});

test('Object is instanceof interface', function(){
	Interface.define('MyInterface');
	Class.define('MyClass', {
		Implements: MyInterface
	});
	var myObject = new MyClass();
	ok(myObject.instanceOf(MyInterface));
});

test('Object is not instanceOf interface if not implemented', function(){
	Interface.define('MyInterface');
	Class.define('MyClass');
	var myObject = new MyClass();
	ok(!myObject.instanceOf(MyInterface));
});

test('Object is instanceof class', function(){
	Class.define('MyClass');
	var myObject = new MyClass();
	ok(myObject.instanceOf(MyClass));
});

test('Object is instanceof root Class', function(){
	Class.define('MyClass');
	var myObject = new MyClass();
	ok(myObject.instanceOf(Class));
});

test('Object is not instanceof other class', function(){
	Class.define('MyClass');
	Class.define('OtherClass');
	var myObject = new MyClass();
	ok(!myObject.instanceOf(OtherClass));
});

test('Object is instanceof parent class', function(){
	Class.define('MyParent');
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myObject = new MyChild();
	ok(myObject.instanceOf(MyChild));
	ok(myObject.instanceOf(MyParent));
});

test('Call to unknown method is dispatched to call if present', function(){
	Class.define('MyClass', {
		'call': function(){
			return 'From Call';
		}
	})
	var myObject = new MyClass();
	ok('From Call' == myObject.call('invalidMethod'));
});

test('Call to overload method passes method name as first argument', function(){
	Class.define('MyClass', {
		'call': function(method){
			return method;
		}
	})
	var myObject = new MyClass();
	ok('invalidMethod' == myObject.call('invalidMethod'));
});

test('Call to overload method passes other arguments as array', function(){
	Class.define('MyClass', {
		'call': function(method, arguments){
			return arguments;
		}
	})
	var myObject = new MyClass();
	var returnValue = myObject.call('invalidMethod', 'One', 'Two', 'Three');
	ok(returnValue[0] === 'One');
	ok(returnValue[1] === 'Two');
	ok(returnValue[2] === 'Three');
});

test('Parent object methods can be called magically on child', function(){
	Class.define('MyParent', {
		'myMethod': function(){ return 'Returned from parent class'; }
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myObject = new MyChild();
	ok('Returned from parent class' === myObject.myMethod());
});

test('Instances of same class can have different property values', function(){
	Class.define('MyClass', {
		myProperty: null
	});
	var myObject1 = new MyClass();
	var myObject2 = new MyClass();
	ok(myObject1.get('myProperty') === null);
	ok(myObject2.get('myProperty') === null);
	myObject1.set('myProperty', 'My Value');
	ok(myObject1.get('myProperty') === 'My Value');
	ok(myObject2.get('myProperty') === null);
	myObject2.set('myProperty', 'My Other Value');
	ok(myObject1.get('myProperty') === 'My Value');
	ok(myObject2.get('myProperty') === 'My Other Value');
});

test('Object properties are not persisted between instantiations', function(){
	Class.define('MyClass', {
		myProperty: {}
	});
	var myObject = new MyClass();
	var myProperty = myObject.get('myProperty');
	myProperty.key = 'value';
	myObject = null;
	myObject = new MyClass();
	ok(typeof myObject.get('myProperty').key == 'undefined');
});

test('Object can be cloned and values can be set independently', function(){
	Class.define('MyClass', {
		myProperty: null
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'My Value');
	var otherObject = myObject.clone();
	otherObject.set('myProperty', 'Other Value');
	ok(myObject.get('myProperty') === 'My Value');
	ok(otherObject.get('myProperty') === 'Other Value');
});

test('Cloned object has higher ID', function(){
	Class.define('MyClass', {
		myProperty: null
	});
	var myObject = new MyClass();
	var otherObject = myObject.clone();
	ok(myObject.id < otherObject.id);
});

test('Objects can implement toString method', function(){
	Class.define('MyClass', {
		toString: function(){
			return 'Instance of MyClass';
		}
	});
	var myObject = new MyClass();
	ok(myObject.toString() === 'Instance of MyClass');
});

test('Objects that do not implement toString behave normally', function(){
	Class.define('MyClass');
	var myObject = new MyClass();
	ok(myObject.toString() === '[object Object]');
});

test('Child objects inherit parent toString method', function(){
	Class.define('MyParent', {
		toString: function(){return '[object MyObject]';}
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myChild = new MyChild();
	ok(myChild.toString() == '[object MyObject]');
});

test('Class can define an array of event names', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent',
			'myOtherEvent'
		]
	});
	ok(true);
});

test('Events must be declared in an array', function(){
	raises(function(){
		Class.define('MyClass', {
			Events: 'myEvent'
		});
	}, InvalidSyntaxFatal);
});

test('Events must be declared as an array of strings', function(){
	raises(function(){
		Class.define('MyClass', {
			Events: [1, 2]
		});
	}, InvalidSyntaxFatal);
});

test('Object can trigger its own event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent');
		}
	});
	new MyClass().triggerEvent();
	ok(true);
});

test('Event must be declared in order to be triggered', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('invalidEvent');
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.triggerEvent();
	}, UnknownEventFatal);
});

test('Object cannot trigger event defined in another class', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		]
	});
	Class.define('MyOtherClass', {
		triggerEvent: function(){
			this.trigger('myEvent');
		}
	});
	var myObject = new MyOtherClass();
	raises(function(){
		myObject.triggerEvent();
	}, UnknownEventFatal);
});

test('Client object can bind to event in target class and target method is called', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
		},
		targetMethod: function(){
			ok(true);
		}
	});
	new MyOtherClass();
});

test('Object can trigger event in parent class', function(){
	Class.define('MyParent', {
		Events: [
			'myEvent'
		]
	});
	Class.define('MyChild', {
		Extends: MyParent,
		triggerEvent: function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		},
		targetMethod: function(){
			ok(true);
		}
	});
	new MyChild().triggerEvent();
});

test('Object can trigger event in child class', function(){
	Class.define('MyParent', {
		triggerEvent: function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		},
		targetMethod: function(){
			ok(true);
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		Events: [
			'myEvent'
		]
	});
	new MyChild().triggerEvent();
});

test('Bound event must exist in target class', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		]
	});
	Class.define('MyOtherClass', {
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('invalidEvent', 'targetMethod');
		},
		targetMethod: function(){}
	});
	raises(function(){
		new MyOtherClass();
	}, UnknownEventFatal);
});

test('Target method must exist in client class', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		]
	});
	Class.define('MyOtherClass', {
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'invalidMethod');
		},
		targetMethod: function(){}
	});
	raises(function(){
		new MyOtherClass();
	}, UnknownMethodFatal);
});

test('Class can bind to own event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		},
		targetMethod: function(){
			ok(true);
		}
	});
	new MyClass().triggerEvent();
});

test('Client cannot bind private method to event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		]
	});
	Class.define('MyOtherClass', {
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
		},
		'private:targetMethod': function(){}
	});
	raises(function(){
		new MyOtherClass();
	}, ScopeFatal);
});

test('Client cannot bind protected method to event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		]
	});
	Class.define('MyOtherClass', {
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
		},
		'protected:targetMethod': function(){}
	});
	raises(function(){
		new MyOtherClass();
	}, ScopeFatal);
});

test('Client can bind protected method to event if target is parent', function(){
	Class.define('MyParent', {
		'protected:targetMethod': function(){
			ok(true);
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		}
	});
	new MyChild().triggerEvent();
});

test('Client can bind protected method to event if target is child', function(){
	Class.define('MyParent', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'protected:targetMethod': function(){
			ok(true);
		}
	});
	new MyChild().triggerEvent();
});

test('Client cannot bind private method to event if target is parent', function(){
	Class.define('MyParent', {
		'private:targetMethod': function(){}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.bind('myEvent', 'targetMethod');
		}
	});
	raises(function(){
		new MyChild().triggerEvent();
	}, ScopeFatal);
});

test('Client cannot bind private method to event if target is child', function(){
	Class.define('MyParent', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.bind('myEvent', 'targetMethod');
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'private:targetMethod': function(){}
	});
	raises(function(){
		new MyChild().triggerEvent();
	}, ScopeFatal);
});

test('Single argument is passed to client method on event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent', 'single argument');
		}
	});
	Class.define('MyOtherClass', {
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
		},
		targetMethod: function(arg){
			ok(arg == 'single argument');
		}
	});
	new MyOtherClass();
});

test('Multiple arguments are passed to client method on event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent', 'first argument', 'second argument');
		}
	});
	Class.define('MyOtherClass', {
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
		},
		targetMethod: function(arg1, arg2){
			ok(arg1 == 'first argument');
			ok(arg2 == 'second argument');
		}
	});
	new MyOtherClass();
});

test('Client method is called multiple times if triggererd multiple times', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.triggerEvent();
			myObject.triggerEvent();
			ok(this.get('count') == 3);
		},
		targetMethod: function(){
			this.set('count', this.get('count') + 1);
		}
	});
	new MyOtherClass();
});

test('Client method is not called again if unbound', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.unbind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			ok(this.get('count') == 1);
		},
		targetMethod: function(){
			this.set('count', this.get('count') + 1);
		}
	});
	new MyOtherClass();
});

test('Client method can rebind to event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.unbind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			ok(this.get('count') == 2);
		},
		targetMethod: function(){
			this.set('count', this.get('count') + 1);
		}
	});
	new MyOtherClass();
});

test('Client method is only called once if bound twice', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		triggerEvent: function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		construct: function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			ok(this.get('count') == 1);
		},
		targetMethod: function(){
			this.set('count', this.get('count') + 1);
		}
	});
	new MyOtherClass();
});

test('Event cannot be triggered from class constructor', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		construct: function(){
			this.trigger('myEvent');
		}
	});
	raises(function(){
		new MyClass();
	}, RuntimeFatal);
});
