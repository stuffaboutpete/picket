module('Class Tests');

QUnit.testStart(function(){
	window.MyClass = undefined;
	window.MyParent = undefined;
	window.MyChild = undefined;
	window.MyGrandChild = undefined;
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
		'public:myProperty': 'Value'
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'Value');
});

test('Class property can be set', function(){
	Class.define('MyClass', {
		'public:myProperty': null
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'My String')
	ok(myObject.get('myProperty') == 'My String');
});

test('Class method can be called', function(){
	Class.define('MyClass', {
		'public:myMethod': function(){return 'Return Value';}
	});
	var myObject = new MyClass();
	ok(myObject.call('myMethod') == 'Return Value');
});

test('Object method can be called magically by name', function(){
	Class.define('MyClass', {
		'public:myMethod': function(){
			return 'My Value';
		}
	});
	var myObject = new MyClass();
	ok(myObject.myMethod() === 'My Value');
});

test('Single argument is passed to class method', function(){
	Class.define('MyClass', {
		'public:myMethod': function(arg){
			return 'Your arg: ' + arg;
		}
	});
	var myObject = new MyClass();
	ok(myObject.myMethod('Something') == 'Your arg: Something');
});

test('Multiple arguments are passed to class method', function(){
	Class.define('MyClass', {
		'public:myMethod': function(arg1, arg2, arg3){
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
		'public:myProperty': 'myValue',
		'public:myMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok(myObject.myMethod() == 'myValue');
});

test('Properties are declared private if not specified', function(){
	Class.define('MyParent', {
		myProperty: 'myValue',
		'public:myParentMethod': function(){
			return this.get('myProperty');
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myChildMethod': function(){
			return this.get('myProperty');
		}
	});
	var myChild = new MyChild();
	raises(function(){
		myChild.get('myProperty');
	}, ScopeFatal);
	raises(function(){
		myChild.myChildMethod();
	}, ScopeFatal);
	ok(myChild.myParentMethod() == 'myValue');
});

test('Methods are declared private if not specified', function(){
	Class.define('MyParent', {
		myValueMethod: function(){
			return 'myValue';
		},
		'public:myAccessMethod': function(){
			return this.myValueMethod();
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myChildMethod': function(){
			return this.myValueMethod();
		}
	});
	var myChild = new MyChild();
	raises(function(){
		myChild.myValueMethod();
	}, ScopeFatal);
	raises(function(){
		myChild.myChildMethod();
	}, ScopeFatal);
	ok(myChild.myAccessMethod() == 'myValue');
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
		'public:parentMethod': function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myChild = new MyChild();
	ok(myChild.parentMethod() == 'Returned from Parent');
});

test('Child methods override parent methods', function(){
	Class.define('MyParent', {
		'public:myMethod': function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myMethod': function(){return 'Returned from Child';}
	});
	var myChild = new MyChild();
	ok(myChild.myMethod() == 'Returned from Child');
});

test('Child methods can call overridden parent methods', function(){
	Class.define('MyParent', {
		'public:myMethod': function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myMethod': function(){
			return this.parent.myMethod();
		}
	});
	var myChild = new MyChild();
	ok(myChild.myMethod() == 'Returned from Parent');
});

test('Child methods can call non overridden parent methods', function(){
	Class.define('MyParent', {
		'public:myMethod': function(){return 'Returned from Parent';}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myOtherMethod': function(){
			return this.parent.myMethod();
		}
	});
	var myChild = new MyChild();
	ok(myChild.myOtherMethod() == 'Returned from Parent');
});

test('Child methods can call parent construct method', function(){
	Class.define('MyParent', {
		'public:myProperty': null,
		'public:construct': function(myProperty){
			this.set('myProperty', myProperty);
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:construct': function(myProperty){
			this.parent.construct(myProperty);
		}
	});
	var myChild = new MyChild('My Value');
	ok(myChild.get('myProperty') == 'My Value');
});

test('Constructor method is called on instantiation', function(){
	Class.define('MyClass', {
		'public:myProperty': undefined,
		'public:construct': function(){
			this.set('myProperty', 'Some String');
		}
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'Some String');
});

test('Constructor arguments are passed to constuctor method', function(){
	Class.define('MyClass', {
		'public:myProperty': undefined,
		'public:construct': function(arg1, arg2, arg3){
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
	Class.define('MyParent', {
		'protected:myProperty': 'myValue'
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

test('Class can be defined as abstract and it cannot be instantiated', function(){
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
		'public:myProperty': 'myValue'
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myChild = new MyChild();
	ok(myChild.get('myProperty') == 'myValue');
});

test('Abstract class can define an abstract method', function(){
	Class.define('MyClass', {
		Abstract: [
			'myMethod'
		]
	});
	ok(true);
});

test('Abstract method can be implemented in child and called', function(){
	Class.define('MyParent', {
		Abstract: [
			'myMethod'
		]
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myMethod': function(){
			ok(true);
		}
	});
	new MyChild().myMethod();
});

test('Abstract class can define multiple abstract methods', function(){
	Class.define('MyParent', {
		Abstract: [
			'myMethod',
			'myOtherMethod'
		]
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:myMethod': function(){
			return 'first value';
		},
		'public:myOtherMethod': function(){
			return 'second value'
		}
	});
	var myChild = new MyChild();
	ok(myChild.myMethod() == 'first value' && myChild.myOtherMethod() == 'second value');
});

test('Abstract methods must be identified by strings', function(){
	raises(function(){
		Class.define('MyClass', {
			Abstract: [
				1
			]
		});
	}, InvalidSyntaxFatal);
});

test('Extending class must implement abstract method', function(){
	Class.define('MyParent', {
		Abstract: [
			'myMethod'
		]
	});
	raises(function(){
		Class.define('MyChild', {
			Extends: MyParent
		});
	}, AbstractMethodNotImplementedFatal);
});

test('Extending class must implement multiple abstract methods', function(){
	Class.define('MyParent', {
		Abstract: [
			'myMethod',
			'myOtherMethod'
		]
	});
	raises(function(){
		Class.define('MyChild', {
			Extends: MyParent,
			'public:myMethod': function(){}
		});
	}, AbstractMethodNotImplementedFatal); // Fatal?
});

test('Extending class may not implement abstract methods if it is also abstract', function(){
	Class.define('MyParent', {
		Abstract: [
			'myMethod'
		]
	});
	Class.define('MyChild', {
		Extends: MyParent,
		Abstract: true
	});
	ok(true);
});

test('Extending class may implement some abstract methods and not others', function(){
	Class.define('MyParent', {
		Abstract: [
			'myMethod',
			'myOtherMethod'
		]
	});
	Class.define('MyChild', {
		Extends: MyParent,
		Abstract: true,
		'public:myMethod': function(){}
	});
	Class.define('MyGrandChild', {
		Extends: MyChild,
		'public:myOtherMethod': function(){}
	});
	ok(true);
});

test('Abstract child class can list extra abstract methods that must be implemented', function(){
	Class.define('MyParent', {
		Abstract: [
			'myMethod',
			'myOtherMethod'
		]
	});
	Class.define('MyChild', {
		Extends: MyParent,
		Abstract: [
			'myThirdMethod'
		],
		'public:myMethod': function(){}
	});
	raises(function(){
		Class.define('MyGrandChild', {
			Extends: MyChild,
			'public:myOtherMethod': function(){}
		});
	}, AbstractMethodNotImplementedFatal);
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
		'public:myMethod': function(){},
		'public:myOtherMethod': function(){}
	});
	var myObject = new MyClass();
	ok(myObject instanceof MyClass);
});

test('Implemented interface methods must be declared public', function(){
	Interface.define('MyInterface', [
		'myMethod()'
	]);
	Class.define('MyClass', {
		Implements: MyInterface,
		myMethod: function(){}
	});
	raises(function(){
		var myObject = new MyClass();
	}, InterfaceMethodNotImplementedFatal);
});

test('Class must have arguments which match interface arguments', function(){
	Interface.define('MyInterface', [
		'myMethod(myArgument)',
		'myOtherMethod(arg1, arg2)'
	]);
	Class.define('MyClass', {
		Implements: MyInterface,
		'public:myMethod': function(){},
		'public:myOtherMethod': function(){}
	});
	Class.define('OtherClass', {
		Implements: MyInterface,
		'public:myMethod': function(myArgument){},
		'public:myOtherMethod': function(arg1, arg2){}
	});
	raises(function(){
		var myObject = new MyClass();
	}, InterfaceMethodNotImplementedFatal);
	var otherObject = new OtherClass();
	ok(otherObject instanceof OtherClass);
});

test('Object is instanceOf interface', function(){
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

test('Object is instanceOf class', function(){
	Class.define('MyClass');
	var myObject = new MyClass();
	ok(myObject.instanceOf(MyClass));
});

test('Object is instanceOf root Class', function(){
	Class.define('MyClass');
	var myObject = new MyClass();
	ok(myObject.instanceOf(Class));
});

test('Object is not instanceOf other class', function(){
	Class.define('MyClass');
	Class.define('OtherClass');
	var myObject = new MyClass();
	ok(!myObject.instanceOf(OtherClass));
});

test('Object is instanceOf parent class', function(){
	Class.define('MyParent');
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myObject = new MyChild();
	ok(myObject.instanceOf(MyChild));
	ok(myObject.instanceOf(MyParent));
});

test('All objects have instanceOf method', function(){
	var myString = 'string';
	var myNumber = 10;
	var myObject = {};
	var myArray = [];
	var myBoolean = true;
	ok(myString.instanceOf(Class) === false);
	ok(myNumber.instanceOf(Class) === false);
	ok(myObject.instanceOf(Class) === false);
	ok(myArray.instanceOf(Class) === false);
	ok(myBoolean.instanceOf(Class) === false);
});

test('Call to unknown method is dispatched to call if present', function(){
	Class.define('MyClass', {
		'public:call': function(){
			return 'From Call';
		}
	})
	var myObject = new MyClass();
	ok('From Call' == myObject.call('invalidMethod'));
});

test('Call to overload method passes method name as first argument', function(){
	Class.define('MyClass', {
		'public:call': function(method){
			return method;
		}
	})
	var myObject = new MyClass();
	ok('invalidMethod' == myObject.call('invalidMethod'));
});

test('Call to overload method passes other arguments as array', function(){
	Class.define('MyClass', {
		'public:call': function(method, arguments){
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
		'public:myMethod': function(){ return 'Returned from parent class'; }
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myObject = new MyChild();
	ok('Returned from parent class' === myObject.myMethod());
});

test('Instances of same class can have different property values', function(){
	Class.define('MyClass', {
		'public:myProperty': null
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
		'public:myProperty': {}
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
		'public:myProperty': null
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
		'public:myProperty': null
	});
	var myObject = new MyClass();
	var otherObject = myObject.clone();
	ok(myObject.id < otherObject.id);
});

test('Objects can implement toString method', function(){
	Class.define('MyClass', {
		'public:toString': function(){
			return 'Instance of MyClass';
		}
	});
	var myObject = new MyClass();
	ok(myObject.toString() === 'Instance of MyClass');
});

test('Objects that do not implement toString show class name', function(){
	Class.define('MyClass');
	var myObject = new MyClass();
	ok(myObject.toString() === '[object MyClass]');
});

test('Namespaced objects show full class name when converted to string', function(){
	Class.define('My.TestClass');
	var myObject = new My.TestClass();
	ok(myObject.toString() === '[object My.TestClass]');
});

test('Child objects inherit parent toString method', function(){
	Class.define('MyParent', {
		'public:toString': function(){return '[object MyObject]';}
	});
	Class.define('MyChild', {
		Extends: MyParent
	});
	var myChild = new MyChild();
	ok(myChild.toString() == '[object MyObject]');
});

test('Method can be defined with null return type', function(){
	Class.define('MyClass', {
		'public:myMethod': [null, function(){
			return null;
		}]
	});
	var myObject = new MyClass();
	ok(null === myObject.myMethod());
});

test('Method must implement null return type', function(){
	Class.define('MyClass', {
		'public:myMethod': [null, function(){
			return undefined;
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with undefined return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['undefined', function(){
			return;
		}]
	});
	var myObject = new MyClass();
	ok(typeof myObject.myMethod() == 'undefined');
});

test('Method must implement undefined return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['undefined', function(){
			return 'string';
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with string return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['string', function(){
			return 'string';
		}]
	});
	var myObject = new MyClass();
	ok(typeof myObject.myMethod() == 'string');
});

test('Method must implement string return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['string', function(){
			return 1;
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with number return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['number', function(){
			return 10;
		}]
	});
	var myObject = new MyClass();
	ok(typeof myObject.myMethod() == 'number');
});

test('Method must implement number return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['number', function(){
			return false;
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with boolean return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['boolean', function(){
			return true;
		}]
	});
	var myObject = new MyClass();
	ok(typeof myObject.myMethod() == 'boolean');
});

test('Method must implement boolean return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['boolean', function(){
			return {};
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with object return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['object', function(){
			return {};
		}]
	});
	var myObject = new MyClass();
	ok(typeof myObject.myMethod() == 'object');
});

test('Method must implement object return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['object', function(){
			return 'string';
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with class instance return type', function(){
	Class.define('TargetClass');
	Class.define('MyClass', {
		'public:myMethod': [TargetClass, function(){
			return new TargetClass();
		}]
	});
	var myObject = new MyClass();
	ok(myObject.myMethod().instanceOf(TargetClass));
});

test('Method must implement class instance return type', function(){
	Class.define('TargetClass');
	Class.define('MyClass', {
		'public:myMethod': [TargetClass, function(){
			return null;
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with array return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['array', function(){
			return [1, 2, 3];
		}]
	});
	var myObject = new MyClass();
	ok(Object.prototype.toString.call(myObject.myMethod()) == '[object Array]');
});

test('Method must implement array return type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['array', function(){
			return 'string';
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with array of type return type', function(){
	Class.define('MyClass', {
		'public:myMethod': [['string'], function(){
			return ['string 1', 'string 2', 'string 3'];
		}]
	});
	var myObject = new MyClass();
	var returnValue = myObject.myMethod();
	for (var i in returnValue) {
		if (!returnValue.hasOwnProperty(i)) continue;
		if (typeof returnValue[i] != 'string') {
			ok(false);
			return;
		}
	}
	ok(true);
});

test('Method must implement array of type return type', function(){
	Class.define('MyClass', {
		'public:myMethod': [['boolean'], function(){
			return [true, false, 'true'];
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with null argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': [null, function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod(null);
	ok('true');
});

test('Method must implement null argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': [null, function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod('string');
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with string argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['string', function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod('string');
	ok('true');
});

test('Method must implement string argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['string', function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod(1);
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with number argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['number', function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod(10);
	ok('true');
});

test('Method must implement number argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['number', function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod(true);
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with boolean argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['boolean', function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod(false);
	ok('true');
});

test('Method must implement boolean argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['boolean', function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod({});
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with object argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['object', function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod({});
	ok('true');
});

test('Method must implement object argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['object', function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod('string');
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with class instance argument type', function(){
	Class.define('TargetClass');
	Class.define('MyClass', {
		'public:myMethod': [TargetClass, function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod(new TargetClass());
	ok('true');
});

test('Method must implement class instance argument type', function(){
	Class.define('TargetClass');
	Class.define('MyClass', {
		'public:myMethod': [TargetClass, function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod(null);
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with array argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['array', function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod([]);
	ok('true');
});

test('Method must implement array argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['array', function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod('string');
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with array of type argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': [['number'], function(arg){}]
	});
	var myObject = new MyClass();
	myObject.myMethod([1, 2, 100]);
	ok('true');
});

test('Method must implement array of type argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': [['string'], function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod(['string 1', 'string 2', 3]);
	}, InvalidArgumentTypeFatal);
});

test('Method will not accept undefined if argument is typed', function(){
	Class.define('MyClass', {
		'public:myMethod': ['boolean', function(arg){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod();
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with multiple argument types', function(){
	Class.define('TargetClass');
	Class.define('MyClass', {
		'public:myMethod': ['number', 'string', TargetClass, function(arg1, arg2, arg3){}]
	});
	var myObject = new MyClass();
	myObject.myMethod(10, 'ten', new TargetClass());
	ok(true);
});

test('Method must implement multiple argument types', function(){
	Class.define('TargetClass');
	Class.define('MyClass', {
		'public:myMethod': ['number', 'string', TargetClass, function(arg1, arg2, arg3){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod('ten', 'ten', new TargetClass());
	}, InvalidArgumentTypeFatal);
	raises(function(){
		myObject.myMethod(10, true, new TargetClass());
	}, InvalidArgumentTypeFatal);
	raises(function(){
		myObject.myMethod(10, 'ten', { target: new TargetClass() });
	}, InvalidArgumentTypeFatal);
});

test('All arguments must be supplied if typed', function(){
	Class.define('MyClass', {
		'public:myMethod': ['number', 'string', 'boolean', function(arg1, arg2, arg3){}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod(10, 'ten');
	}, InvalidArgumentTypeFatal);
});

test('Method can be defined with return and argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['number', 'number', function(arg){
			return arg;
		}]
	});
	var myObject = new MyClass();
	myObject.myMethod(1);
	ok(true);
});

test('Method must implement return and argument type', function(){
	Class.define('MyClass', {
		'public:myMethod': ['string', 'number', function(arg){
			return arg;
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod('string');
	}, InvalidArgumentTypeFatal);
	raises(function(){
		myObject.myMethod(1);
	}, InvalidReturnTypeFatal);
});

test('Method can be defined with return type and multiple argument types', function(){
	Class.define('MyClass', {
		'public:myMethod': ['array', 'number', 'string', function(arg1, arg2){
			return [arg1, arg2];
		}]
	});
	var myObject = new MyClass();
	myObject.myMethod(1, 'one');
	ok(true);
});

test('Method must implement return and and multiple argument types', function(){
	Class.define('MyClass', {
		'public:myMethod': ['boolean', 'string', 'number', function(arg1, arg2){
			return arg1 + arg2;
		}]
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.myMethod('string', 'string');
	}, InvalidArgumentTypeFatal);
	raises(function(){
		myObject.myMethod('string', 1);
	}, InvalidReturnTypeFatal);
});

test('Property can be defined with getter method', function(){
	Class.define('MyClass', {
		myProperty: {
			getter: function(){
				return 'My Value';
			}
		}
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property can be defined with getter method and default value', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'My Value',
			getter: function(currentValue){
				return currentValue;
			}
		}
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property getter can be set to true', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'My Value',
			getter: true
		}
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property value cannot be accessed if getter set to false', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'My Value',
			getter: false
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.get('myProperty');
	}, ScopeFatal);
});

test('Property getter defaults to true', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'My Value',
			setter: function(){}
		}
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property can be defined with setter method', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: function(value){
				return value;
			}
		}
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'My Value');
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property setter can be set to true', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: true
		}
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'My Value');
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property value cannot be set if setter set to false', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: false
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.set('myProperty', 'My Value');
	}, ScopeFatal);
});

test('Property setter defaults to true', function(){
	Class.define('MyClass', {
		myProperty: {
			getter: true
		}
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'My Value');
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property setter can access current value', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: function(newValue, currentValue){
				if (!currentValue) return newValue;
				return currentValue + ', ' + newValue;
			}
		}
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'first');
	myObject.set('myProperty', 'second');
	ok(myObject.get('myProperty') == 'first, second');
});

test('Property can be defined with getter and setter methods', function(){
	Class.define('MyClass', {
		myProperty: {
			getter: function(currentValue){
				return currentValue;
			},
			setter: function(newValue, currentValue){
				return newValue + ' - edited';
			}
		}
	});
	var myObject = new MyClass();
	myObject.set('myProperty', 'My Value');
	ok(myObject.get('myProperty') == 'My Value - edited');
});

test('Object not treated as property if no getter or setter are supplied', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'My Value'
		},
		'public:myAccessMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.get('myProperty');
	}, ScopeFatal);
	ok('My Value' === myObject.myAccessMethod().value);
});

test('Non boolean or function getter raises error', function(){
	raises(function(){
		Class.define('MyClass', {
			myProperty: {
				getter: 'Invalid'
			}
		});
	}, InvalidSyntaxFatal);
});

test('Non boolean or function setter raises error', function(){
	raises(function(){
		Class.define('MyClass', {
			myProperty: {
				setter: 'Invalid'
			}
		});
	}, InvalidSyntaxFatal);
});

test('Specifying scope on property raises error', function(){
	raises(function(){
		Class.define('MyClass', {
			'public:myProperty': {
				getter: true
			}
		});
	}, InvalidSyntaxFatal);
	raises(function(){
		Class.define('MyClass', {
			'protected:myProperty': {
				getter: true
			}
		});
	}, InvalidSyntaxFatal);
	raises(function(){
		Class.define('MyClass', {
			'private:myProperty': {
				getter: true
			}
		});
	}, InvalidSyntaxFatal);
});

test('Property getter can specify a return type', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 10,
			getter: ['string', true]
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.get('myProperty');
	}, InvalidReturnTypeFatal);
	myObject.set('myProperty', 'My Value');
	ok(myObject.get('myProperty') == 'My Value');
});

test('Property setter can specify an argument type', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: ['number', true]
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.set('myProperty', 'ten');
	}, InvalidArgumentTypeFatal);
	myObject.set('myProperty', 10);
	ok(myObject.get('myProperty') === 10);
});

test('Parent object can get property without using getter', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'My Value',
			getter: [function(){
				return null;
			}, false]
		},
		'public:getterMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok(myObject.getterMethod() == 'My Value');
});

test('Parent object can get property when getter is false', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'My Value',
			getter: [false, false]
		},
		'public:getterMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok(myObject.getterMethod() == 'My Value');
});

test('Inheriting object can get property without using getter', function(){
	Class.define('MyParent', {
		myProperty: {
			value: 'My Value',
			getter: [function(){
				return null;
			}, false]
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:getterMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyChild();
	ok(myObject.getterMethod() == 'My Value');
});

test('Inheriting object can use getter whilst parent object does not', function(){
	Class.define('MyParent', {
		myProperty: {
			value: 'Direct Value',
			getter: [function(){
				return 'Getter Value';
			}, false, true]
		},
		'public:parentGetterMethod': function(){
			return this.get('myProperty');
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:childGetterMethod': function(){
			return this.get('myProperty');
		}
	});
	var myParent = new MyParent();
	ok(myParent.parentGetterMethod() == 'Direct Value');
	var myChild = new MyChild();
	ok(myChild.childGetterMethod() == 'Getter Value');
});

test('Parent object can use getter whilst inheriting object does not', function(){
	Class.define('MyParent', {
		myProperty: {
			value: 'Direct Value',
			getter: [function(){
				return 'Getter Value';
			}, true, false]
		},
		'public:parentGetterMethod': function(){
			return this.get('myProperty');
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:childGetterMethod': function(){
			return this.get('myProperty');
		}
	});
	var myParent = new MyParent();
	ok(myParent.parentGetterMethod() == 'Getter Value');
	var myChild = new MyChild();
	ok(myChild.childGetterMethod() == 'Direct Value');
});

test('Parent object can set property without using setter', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: [function(){
				return null;
			}, false]
		},
		'public:setterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	var myObject = new MyClass();
	myObject.setterMethod('My Value');
	ok(myObject.get('myProperty') == 'My Value');
});

test('Parent object can set property when setter is false', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: [false, false]
		},
		'public:setterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	var myObject = new MyClass();
	myObject.setterMethod('My Value');
	ok(myObject.get('myProperty') == 'My Value');
});

test('Inheriting object can set property without using setter', function(){
	Class.define('MyParent', {
		myProperty: {
			setter: [function(){
				return null;
			}, false]
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:setterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	var myObject = new MyChild();
	myObject.setterMethod('My Value');
	ok(myObject.get('myProperty') == 'My Value');
});

test('Inheriting object can use setter whilst parent object does not', function(){
	Class.define('MyParent', {
		myProperty: {
			setter: [function(){
				return 'Setter Value';
			}, false, true]
		},
		'public:parentSetterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:childSetterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	var myParent = new MyParent();
	myParent.parentSetterMethod('Parent Value');
	ok(myParent.get('myProperty') == 'Parent Value');
	var myChild = new MyChild();
	myChild.childSetterMethod('Child Value');
	ok(myChild.get('myProperty') == 'Setter Value');
});

test('Parent object can use setter whilst inheriting object does not', function(){
	Class.define('MyParent', {
		myProperty: {
			setter: [function(){
				return 'Setter Value';
			}, true, false]
		},
		'public:parentSetterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	Class.define('MyChild', {
		Extends: MyParent,
		'public:childSetterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	var myParent = new MyParent();
	myParent.parentSetterMethod('Parent Value');
	ok(myParent.get('myProperty') == 'Setter Value');
	var myChild = new MyChild();
	myChild.childSetterMethod('Child Value');
	ok(myChild.get('myProperty') == 'Child Value');
});

test('Property getter can type hint and specify getter usage', function(){
	Class.define('MyClass', {
		myProperty: {
			value: 'string',
			getter: ['boolean', function(value){
				return (value) ? true : false;
			}, false]
		},
		'public:myGetterMethod': function(){
			return this.get('myProperty');
		}
	});
	var myObject = new MyClass();
	ok(myObject.get('myProperty') === true);
	ok(myObject.myGetterMethod() === 'string');
});

test('Property setter can type hint and specify setter usage', function(){
	Class.define('MyClass', {
		myProperty: {
			setter: ['string', true, false]
		},
		'public:mySetterMethod': function(value){
			this.set('myProperty', value);
		}
	});
	var myObject = new MyClass();
	raises(function(){
		myObject.set('myProperty', 10);
	}, InvalidArgumentTypeFatal);
	myObject.mySetterMethod(10);
	ok(myObject.get('myProperty') === 10);
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

test('Events must be declared in an array or object', function(){
	raises(function(){
		Class.define('MyClass', {
			Events: 'myEvent'
		});
	}, InvalidSyntaxFatal);
});

test('Events must be declared as strings', function(){
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
		'public:triggerEvent': function(){
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
		'public:triggerEvent': function(){
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
		'public:triggerEvent': function(){
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
		'public:triggerEvent': function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
		},
		'public:targetMethod': function(){
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
		'public:triggerEvent': function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		},
		'public:targetMethod': function(){
			ok(true);
		}
	});
	new MyChild().triggerEvent();
});

test('Object can trigger event in child class', function(){
	Class.define('MyParent', {
		'public:triggerEvent': function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		},
		'public:targetMethod': function(){
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
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('invalidEvent', 'targetMethod');
		},
		'public:targetMethod': function(){}
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
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'invalidMethod');
		},
		'public:targetMethod': function(){}
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
		'public:triggerEvent': function(){
			this.bind('myEvent', 'targetMethod');
			this.trigger('myEvent');
		},
		'public:targetMethod': function(){
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
		'public:construct': function(){
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
		'public:construct': function(){
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
		'public:triggerEvent': function(){
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
		'public:triggerEvent': function(){
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
		'public:triggerEvent': function(){
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
		'public:triggerEvent': function(){
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
		'public:triggerEvent': function(){
			this.trigger('myEvent', 'single argument');
		}
	});
	Class.define('MyOtherClass', {
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
		},
		'public:targetMethod': function(arg){
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
		'public:triggerEvent': function(){
			this.trigger('myEvent', 'first argument', 'second argument');
		}
	});
	Class.define('MyOtherClass', {
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
		},
		'public:targetMethod': function(arg1, arg2){
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
		'public:triggerEvent': function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.triggerEvent();
			myObject.triggerEvent();
			ok(this.get('count') == 3);
		},
		'public:targetMethod': function(){
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
		'public:triggerEvent': function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.unbind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			ok(this.get('count') == 1);
		},
		'public:targetMethod': function(){
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
		'public:triggerEvent': function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.unbind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			ok(this.get('count') == 2);
		},
		'public:targetMethod': function(){
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
		'public:triggerEvent': function(){
			this.trigger('myEvent');
		}
	});
	Class.define('MyOtherClass', {
		count: 0,
		'public:construct': function(){
			var myObject = new MyClass();
			myObject.bind('myEvent', 'targetMethod');
			myObject.bind('myEvent', 'targetMethod');
			myObject.triggerEvent();
			ok(this.get('count') == 1);
		},
		'public:targetMethod': function(){
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
		'public:construct': function(){
			this.trigger('myEvent');
		}
	});
	raises(function(){
		new MyClass();
	}, RuntimeFatal);
});

test('Event can specify argument types', function(){
	Class.define('MyClass', {
		Events: {
			'myEvent': ['number', 'string']
		}
	});
	ok(true);
});

test('Method can be bound if it has a matching type signature', function(){
	Class.define('MyClass', {
		Events: {
			'myEvent': ['number', 'string']
		},
		'public:bindEvent': function(){
			this.bind('myEvent', 'targetMethod');
		},
		'public:targetMethod': ['number', 'string', function(arg1, arg2){}]
	});
	new MyClass().bindEvent();
	ok(true);
});

test('Method cannot be bound if it does not have a matching type signature', function(){
	Class.define('MyClass', {
		Events: {
			'myEvent': ['number', 'string']
		},
		'public:bindEvent': function(){
			this.bind('myEvent', 'targetMethod');
		},
		'public:targetMethod': ['string', 'string', function(arg1, arg2){}]
	});
	raises(function(){
		new MyClass().bindEvent();
	}, InvalidArgumentTypeFatal);
});

test('Method cannot be bound if it does not have a matching argument count', function(){
	Class.define('MyClass', {
		Events: {
			'myEvent': ['number', 'string']
		},
		'public:bindEvent': function(){
			this.bind('myEvent', 'targetMethod');
		},
		'public:targetMethod': ['number', function(arg){}]
	});
	raises(function(){
		new MyClass().bindEvent();
	}, InvalidArgumentTypeFatal);
});

test('Target method return type is ignored when binding to typed event', function(){
	Class.define('MyClass', {
		Events: {
			'myEvent': ['boolean']
		},
		'public:bindEvent': function(){
			this.bind('myEvent', 'targetMethod');
		},
		'public:targetMethod': ['string', 'boolean', function(arg){}]
	});
	new MyClass().bindEvent();
	ok(true);
});

test('Typed target method can be bound to a non typed event', function(){
	Class.define('MyClass', {
		Events: [
			'myEvent'
		],
		'public:bindEvent': function(){
			this.bind('myEvent', 'targetMethod');
		},
		'public:targetMethod': ['string', function(arg){}]
	});
	new MyClass().bindEvent();
	ok(true);
});

test('Non typed target method can be bound to a typed event', function(){
	Class.define('MyClass', {
		Events: {
			'myEvent': ['string']
		},
		'public:bindEvent': function(){
			this.bind('myEvent', 'targetMethod');
		},
		'public:targetMethod': function(){}
	});
	new MyClass().bindEvent();
	ok(true);
});

test('Typed events can be declared alongside non typed events', function(){
	Class.define('MyClass', {
		Events: {
			'firstEvent': ['string', 'object'],
			'secondEvent': undefined
		}
	});
	ok(true);
});

test('Class can require a file', function(){
	Class.define('MyClass', {
		Require: 'includes/File-5ft78s.js'
	});
	ok(true);
});

test('Required file is included in the DOM on class declaration', function(){
	Class.define('MyClass', {
		Require: 'includes/File-7dgh20.js'
	});
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 14) == 'File-7dgh20.js') {
			ok(true);
			return;
		}
	}
});

asyncTest('Required file is included before class is instantiated', function(){
	Class.define('MyClass', {
		Require: 'includes/File-s8ay12.js',
		'public:construct': function(){
			ok(typeof s8ay12 != 'undefined');
			start();
		}
	});
	var myObject = new MyClass();
});

test('File will not be re-included if required multiple times', function(){
	Class.define('MyClass', {
		Require: 'includes/File-3fb5gb.js'
	});
	Class.define('MyOtherClass', {
		Require: 'includes/File-3fb5gb.js'
	});
	var count = 0;
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 14) == 'File-3fb5gb.js') {
			count++
		}
	}
	ok(count == 1);
});

test('Multiple required files are included in the DOM on class declaration', function(){
	Class.define('MyClass', {
		Require: [
			'includes/File-p9s8ch.js',
			'includes/File-vdf5v8.js'
		]
	});
	var p9s8chExists = false;
	var vdf5v8Exists = false;
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 14) == 'File-p9s8ch.js') {
			p9s8chExists = true;
		}
		if (script.substr(script.length - 14) == 'File-vdf5v8.js') {
			vdf5v8Exists = true;
		}
	}
	ok(p9s8chExists && vdf5v8Exists);
});

/*test('CSS file is included in the DOM on class declaration', function(){
	Class.define('MyClass', {
		Require: 'includes/File-cd7hsa.css'
	});
	var links = document.getElementsByTagName('link');
	delete links.length;
	for (var i in links) {
		if (!links.hasOwnProperty(i)) continue;
		if (links[i].rel != 'stylesheet') continue;
		var link = links[i].href;
		if (link.substr(link.length - 15) == 'File-cd7hsa.css') {
			ok(true);
			return;
		}
	}
});

test('JPEG file is included in the DOM on class declaration', function(){
	Class.define('MyClass', {
		Require: 'includes/File-asedi8.jpg'
	});
	var images = document.getElementsByTagName('img');
	delete images.length;
	for (var i in images) {
		if (!images.hasOwnProperty(i)) continue;
		var image = images[i].src;
		if (image.substr(image.length - 15) == 'File-asedi8.jpg') {
			ok(true);
			return;
		}
	}
});*/

test('Class can be required', function(){
	Class.define('MyClass', {
		Require: 'My.Test.sd8uds'
	});
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 17) == 'My/Test/sd8uds.js') {
			ok(true);
			return;
		}
	}
});

test('Folder pattern matching can be set up for required classes', function(){
	Class.addClassAutoloadPattern('Test', 'subfolder');
	Class.define('MyClass', {
		Require: 'Test.p9c88c'
	});
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 19) == 'subfolder/p9c88c.js') {
			ok(true);
			return;
		}
	}
});

test('Multiple folder patterns can be set up for required classes', function(){
	Class.addClassAutoloadPattern('Test', 'subfolder');
	Class.addClassAutoloadPattern('Test.OtherTest', 'other/subfolder');
	Class.define('MyClass', {
		Require: [
			'Test.d46fvb',
			'Test.OtherTest.Example.ch732m'
		]
	});
	var d46fvbExists = false;
	var ch732mExists = false;
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 19) == 'subfolder/d46fvb.js') {
			d46fvbExists = true;
		}
		if (script.substr(script.length - 33) == 'other/subfolder/Example/ch732m.js') {
			ch732mExists = true;
		}
	}
	ok(d46fvbExists && ch732mExists);
});

test('Longest matching pattern is used to include class', function(){
	Class.addClassAutoloadPattern('My', 'folder1');
	Class.addClassAutoloadPattern('My.Test.Class', 'folder2');
	Class.addClassAutoloadPattern('My.Test', 'folder3');
	Class.define('MyClass', {
		Require: 'My.Test.Class.4rfc8u'
	});
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 17) == 'folder2/4rfc8u.js') {
			ok(true);
			return;
		}
	}
});

test('Folder pattern matching can be set up for required files', function(){
	Class.addFolderAutoloadPattern('Test', 'subfolder');
	Class.define('MyClass', {
		Require: 'Test/4fcf9a.js'
	});
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 19) == 'subfolder/4fcf9a.js') {
			ok(true);
			return;
		}
	}
});

test('Multiple folder patterns can be set up for required files', function(){
	Class.addFolderAutoloadPattern('Test', 'subfolder');
	Class.addFolderAutoloadPattern('Test/OtherTest', 'other/subfolder');
	Class.define('MyClass', {
		Require: [
			'Test/f54dh4.js',
			'Test/OtherTest/Example/gpodlk.js'
		]
	});
	var f54dh4Exists = false;
	var gpodlkExists = false;
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 19) == 'subfolder/f54dh4.js') {
			f54dh4Exists = true;
		}
		if (script.substr(script.length - 33) == 'other/subfolder/Example/gpodlk.js') {
			gpodlkExists = true;
		}
	}
	ok(f54dh4Exists && gpodlkExists);
});

test('Longest matching pattern is used to include file', function(){
	Class.addFolderAutoloadPattern('My', 'folder1');
	Class.addFolderAutoloadPattern('My/Test/Script', 'folder2');
	Class.addFolderAutoloadPattern('My/Test', 'folder3');
	Class.define('MyClass', {
		Require: 'My/Test/Script/ftr56h.js'
	});
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 17) == 'folder2/ftr56h.js') {
			ok(true);
			return;
		}
	}
});

test('Loaded classes can be declared and will not be auto loaded in future', function(){
	Class.registerLoadedClass('Pre.Loaded.Class.3fg9xh');
	Class.define('MyClass', {
		Require: 'Pre.Loaded.Class.3fg9xh'
	});
	var scripts = document.getElementsByTagName('script');
	delete scripts.length;
	for (var i in scripts) {
		if (!scripts.hasOwnProperty(i)) continue;
		var script = scripts[i].src;
		if (script.substr(script.length - 14) == 'Pre/Loaded/Class/3fg9xh.js') {
			ok(false);
			return;
		}
	}
	ok(true);
});
