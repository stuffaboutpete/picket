module('Mock Tests');

QUnit.testStart(function(){
	
	window.MyClass = undefined;
	window.My = undefined;
	window.IMyInterface = undefined;
	
	Class.define('MyClass', {
		myMethod: function(){}
	});
	Class.define('My.Namespaced.Class');
	Interface.define('IMyInterface', [
		'myMethod()'
	]);
	
});

test('Mock can be instantiated with string class name', function(){
	var myMock = new Mock('MyClass');
	ok(myMock instanceof Mock);
});

test('Mock require string class name', function(){
	raises(function(){
		var myMock = new Mock();
	}, Error);
});

test('Mock requires that class name is a registered class', function(){
	raises(function(){
		var myMock = new Mock('NonClass');
	}, Error);
});

test('Class name can be dot namespaced', function(){
	var myMock = new Mock('My.Namespaced.Class');
	ok(myMock instanceof Mock);
});

test('Mock can be instantiated with string interface name', function(){
	var myMock = new Mock('IMyInterface');
	ok(myMock instanceof Mock);
});

test('Mock has \'method\' method', function(){
	var myMock = new Mock('MyClass');
	ok(typeof myMock.method == 'function');
});

test('\'method\' requires string value', function(){
	var myMock = new Mock('MyClass');
	raises(function(){
		myMock.method();
	}, Error);
	raises(function(){
		myMock.method([]);
	}, Error);
	raises(function(){
		myMock.method({});
	}, Error);
	raises(function(){
		myMock.method(1);
	}, Error);
	myMock.method('myMethod');
});

test('\'method\' argument must match an existing method', function(){
	var myMock = new Mock('MyClass');
	raises(function(){
		myMock.method('nonMethod');
	}, Error);
});

test('\'method\' argument must match interface method', function(){
	var myMock = new Mock('IMyInterface');
	raises(function(){
		myMock.method('nonMethod');
	});
});

test('Call to \'method\' returns expectation object', function(){
	var myMock = new Mock('MyClass');
	var expectation = myMock.method('myMethod');
	ok(expectation instanceof Mock.Expectation);
});

test('Call to \'method\' returns expectation object from interface', function(){
	var myMock = new Mock('IMyInterface');
	var expectation = myMock.method('myMethod');
	ok(expectation instanceof Mock.Expectation);
});

test('Expectation has \'at\' method', function(){
	var myMock = new Mock('MyClass');
	var expectation = myMock.method('myMethod');
	ok(typeof expectation.at == 'function');
});

test('At method requires value', function(){
	var myMock = new Mock('MyClass');
	raises(function(){
		myMock.method('myMethod').at();
	}, Error);
});

test('At method rejects negative number', function(){
	var myMock = new Mock('MyClass');
	raises(function(){
		myMock.method('myMethod').at(-1);
	}, Error);
});

test('At method accepts non negative number', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at(0);
	myMock.method('myMethod').at(1);
	expect(0);
});

test('At method accepts string \'any\'', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any');
	expect(0);
});

test('At method accepts string \'none\'', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('none');
	expect(0);
});

test('At method rejects other strings', function(){
	var myMock = new Mock('MyClass');
	raises(function(){
		myMock.method('myMethod').at('some string');
	}, Error);
});

test('Expectation has \'atLeast\' method', function(){
	var myMock = new Mock('MyClass');
	var expectation = myMock.method('myMethod');
	ok(typeof expectation.atLeast == 'function');
});

test('AtLeast method requires value', function(){
	var myMock = new Mock('MyClass');
	raises(function(){
		myMock.method('myMethod').atLeast();
	}, Error);
});

test('AtLeast method rejects non positive number', function(){
	var myMock = new Mock('MyClass');
	var expectation = myMock.method('myMethod');
	raises(function(){
		expectation.atLeast(0);
	}, Error);
	raises(function(){
		expectation.atLeast(-1);
	}, Error);
});

test('AtLeast method accepts positive number', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atLeast(1);
	expect(0);
});

test('Expectation has \'atMost\' method', function(){
	var myMock = new Mock('MyClass');
	var expectation = myMock.method('myMethod');
	ok(typeof expectation.atMost == 'function');
});

test('AtMost method requires value', function(){
	var myMock = new Mock('MyClass');
	raises(function(){
		myMock.method('myMethod').atMost();
	}, Error);
});

test('AtMost method rejects non positive number', function(){
	var myMock = new Mock('MyClass');
	var expectation = myMock.method('myMethod');
	raises(function(){
		expectation.atMost(0);
	}, Error);
	raises(function(){
		expectation.atMost(-1);
	}, Error);
});

test('AtMost method accepts positive number', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atMost(1);
	expect(0);
});

test('At method returns Method object', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').at('any');
	ok(method instanceof Mock.Method);
});

test('AtLeast method returns Method object', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').atLeast(1);
	ok(method instanceof Mock.Method);
});

test('AtMost method returns Method object', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').atMost(1);
	ok(method instanceof Mock.Method);
});

test('Method has with method', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').at(0);
	ok(typeof method.with == 'function');
});

test('With method returns same method', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').at(0);
	ok(method === method.with('argument'));
});

test('Method has will method', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').at(0);
	ok(typeof method.will == 'function');
});

test('Will method requires a function as the only argument', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').at(0);
	raises(function(){
		method.will();
	}, Error);
	raises(function(){
		method.will('string');
	}, Error);
	method.will(function(){});
});

test('Will method returns same method', function(){
	var myMock = new Mock('MyClass');
	var method = myMock.method('myMethod').at(0);
	ok(method === method.will(function(){}));
});

test('Mock has \'resolve\' method', function(){
	var myMock = new Mock('MyClass');
	ok(typeof myMock.resolve == 'function');
});

test('Resolve method will throw if expectations not met', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atLeast(1);
	raises(function(){
		myMock.resolve();
	}, Error);
});

test('Resolve method will not throw if expectations are met', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any');
	myMock.myMethod();
	myMock.resolve();
	expect(0);
});

test('At expectations are ok if index has been set', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at(0);
	myMock.method('myMethod').at(1);
	myMock.myMethod();
	myMock.myMethod();
	myMock.resolve();
	expect(0);
});

test('At expectations are not ok if index has not been set', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at(1);
	raises(function(){
		myMock.myMethod();
	}, Error);
});

test('At expectations are ok if set to any and call count is zero', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any');
	myMock.resolve();
	expect(0);
});

test('At expectations are ok if set to any and call count is one', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any');
	myMock.myMethod();
	myMock.resolve();
	expect(0);
});

test('At expectations are ok if set to none and call count is zero', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('none');
	myMock.resolve();
	expect(0);
});

test('At expectations are not ok if set to none and call count is one', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('none');
	raises(function(){
		myMock.myMethod();
	}, Error);
});

test('AtLeast expectations are ok if call count is equal to', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atLeast(1);
	myMock.myMethod();
	myMock.resolve();
	expect(0);
});

test('AtLeast expectations are ok if call count is greater than', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atLeast(1);
	myMock.myMethod();
	myMock.myMethod();
	myMock.resolve();
	expect(0);
});

test('AtLeast expectations are not ok if call count is less than', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atLeast(2);
	myMock.myMethod();
	raises(function(){
		myMock.resolve();
	}, Error);
});

test('AtLeast expectations are not ok if call count is zero', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atLeast(1);
	raises(function(){
		myMock.resolve();
	}, Error);
});

test('AtMost expectations are ok if call count is equal to', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atMost(1);
	myMock.myMethod();
	myMock.resolve();
	expect(0);
});

test('AtMost expectations are ok if call count is less than', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atMost(2);
	myMock.myMethod();
	myMock.resolve();
	expect(0);
});

test('AtMost expectations are ok if call count is zero', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atMost(1);
	myMock.resolve();
	expect(0);
});

test('AtMost expectations are not ok if call count is greater than', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').atMost(1);
	myMock.myMethod();
	raises(function(){
		myMock.myMethod();
	}, Error);
});

test('Method can be called with required single argument', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any').with('string');
	myMock.myMethod('string');
	expect(0);
});

test('Method requires that single argument is supplied', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any').with('string');
	raises(function(){
		myMock.myMethod();
	}, Error);
});

test('Method requires that single argument matches supplied', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any').with('string');
	raises(function(){
		myMock.myMethod('other string');
	}, Error);
});

test('Method can be called with required multiple arguments', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any').with('string', 'other string');
	myMock.myMethod('string', 'other string');
	expect(0);
});

test('Method requires that multiple arguments are supplied', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any').with('string', 'other string');
	raises(function(){
		myMock.myMethod('string');
	}, Error);
});

test('Method accepts different arguments at different calls', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at(0).with('first string');
	myMock.method('myMethod').at(1).with('second string');
	myMock.myMethod('first string');
	myMock.myMethod('second string');
	expect(0);
});

test('Method requires different arguments at different calls', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at(0).with('first string');
	myMock.method('myMethod').at(1).with('second string');
	myMock.myMethod('first string');
	raises(function(){
		myMock.myMethod('first string');
	}, Error);
});

test('Method will run supplied callback and return value', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any').will(function(){ return 'string'; });
	ok(myMock.myMethod() === 'string');
});

test('Method callback can access arguments supplied on method call', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at('any').will(function(firstNum, secondNum){
		return firstNum + secondNum;
	});
	ok(myMock.myMethod(1, 2) === 3);
});

test('Method accepts different callbacks at different calls', function(){
	var myMock = new Mock('MyClass');
	myMock.method('myMethod').at(0).will(function(){ return 'first string'; });
	myMock.method('myMethod').at(1).will(function(){ return 'second string'; });
	ok(myMock.myMethod() === 'first string');
	ok(myMock.myMethod() === 'second string');
});

test('Mock object passes instanceOf test for target class', function(){
	var myMock = new Mock('MyClass');
	ok(myMock.instanceOf(MyClass));
});

test('Mock object fails instanceOf test for other', function(){
	var myMock = new Mock('MyClass');
	ok(!myMock.instanceOf(My.Namespaced.Class));
});

test('Mock interface passes instanceOf test for target', function(){
	var myMock = new Mock('IMyInterface');
	ok(myMock.instanceOf(IMyInterface));
});

test('Mock interface fails instanceOf test for other', function(){
	var myMock = new Mock('IMyInterface');
	ok(!myMock.instanceOf(My.Namespaced.Class));
});

test('Mock object passes instanceOf test for Class', function(){
	var myMock = new Mock('MyClass');
	ok(myMock.instanceOf(Class));
});

test('Mock interface passes instanceOf test for Class', function(){
	var myMock = new Mock('IMyInterface');
	ok(myMock.instanceOf(Class));
});