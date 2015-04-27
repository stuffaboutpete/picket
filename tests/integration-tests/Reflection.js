describe('Reflection', function(){
	
	beforeEach(function(){
		window.My = undefined;
	});
	
	it('can create reflection class from string', function(){
		define('class My.Class');
		expect(new Reflection.Class('My.Class').getName()).toBe('My.Class');
	});
	
	it('can create reflection class from constructor', function(){
		define('class My.Class');
		expect(new Reflection.Class(My.Class).getName()).toBe('My.Class');
	});
	
	it('can create reflection class from instance', function(){
		define('class My.Class');
		var instance = new My.Class();
		expect(new Reflection.Class(instance).getName()).toBe('My.Class');
	});
	
	it('indicates if class has parent and returns parent reflection class', function(){
		define('class My.Parent');
		define('class My.Child extends My.Parent');
		expect(new Reflection.Class('My.Child').hasParent()).toBe(true);
		expect(new Reflection.Class('My.Child').getParent() instanceof Reflection.Class).toBe(true);
		expect(new Reflection.Class('My.Child').getParent().getName()).toBe('My.Parent');
		expect(new Reflection.Class('My.Child').getParent().hasParent()).toBe(false);
	});
	
	it('returns an array of reflection interfaces which are implemented', function(){
		define('interface My.IInterfaceOne');
		define('interface My.IInterfaceTwo');
		define('class My.Class implements My.IInterfaceOne, My.IInterfaceTwo');
		var reflectionInterfaces = new Reflection.Class('My.Class').getInterfaces();
		expect(reflectionInterfaces.length).toBe(2);
		expect(reflectionInterfaces[0] instanceof Reflection.Interface).toBe(true);
		expect(reflectionInterfaces[1] instanceof Reflection.Interface).toBe(true);
		expect(reflectionInterfaces[0].getName()).toBe('My.IInterfaceOne');
		expect(reflectionInterfaces[1].getName()).toBe('My.IInterfaceTwo');
	});
	
	it('indicates if a class implements an interface', function(){
		define('interface My.IInterfaceOne');
		define('interface My.IInterfaceTwo');
		define('interface My.IInterfaceThree');
		define('class My.Class implements My.IInterfaceOne, My.IInterfaceTwo');
		var reflectionClass = new Reflection.Class('My.Class');
		expect(reflectionClass.implementsInterface('My.IInterfaceOne')).toBe(true);
		expect(reflectionClass.implementsInterface('My.IInterfaceTwo')).toBe(true);
		expect(reflectionClass.implementsInterface('My.IInterfaceThree')).toBe(false);
	});
	
	it('will return an array of class reflection members', function(){
		define('class My.Class', {
			'private myProperty (string)': null,
			'public myMethod () -> undefined': function(){},
			'public event myEvent ()': undefined,
			'public constant MY_CONSTANT (string)': undefined
		});
		var reflectionMembers = new Reflection.Class('My.Class').getMembers();
		expect(reflectionMembers.length).toBe(4);
		expect(reflectionMembers[0] instanceof Reflection.Property).toBe(true);
		expect(reflectionMembers[1] instanceof Reflection.Method).toBe(true);
		expect(reflectionMembers[2] instanceof Reflection.Event).toBe(true);
		expect(reflectionMembers[3] instanceof Reflection.Constant).toBe(true);
		expect(reflectionMembers[0].getName()).toBe('myProperty');
		expect(reflectionMembers[1].getName()).toBe('myMethod');
		expect(reflectionMembers[2].getName()).toBe('myEvent');
		expect(reflectionMembers[3].getName()).toBe('MY_CONSTANT');
	});
	
	it('will return an array of class reflection properties', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public myOtherProperty (number)': null,
			'public myMethod () -> undefined': function(){}
		});
		var reflectionProperties = new Reflection.Class('My.Class').getProperties();
		expect(reflectionProperties.length).toBe(2);
		expect(reflectionProperties[0] instanceof Reflection.Property).toBe(true);
		expect(reflectionProperties[1] instanceof Reflection.Property).toBe(true);
		expect(reflectionProperties[0].getName()).toBe('myProperty');
		expect(reflectionProperties[1].getName()).toBe('myOtherProperty');
	});
	
	it('will return a single named reflection property', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public myOtherProperty (number)': null
		});
		var reflectionProperty = new Reflection.Class('My.Class').getProperty('myOtherProperty');
		expect(reflectionProperty instanceof Reflection.Property).toBe(true);
		expect(reflectionProperty.getName()).toBe('myOtherProperty');
	});
	
	it('will return an array of class reflection methods', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public myMethod () -> undefined': function(){},
			'public myOtherMethod () -> undefined': function(){}
		});
		var reflectionMethods = new Reflection.Class('My.Class').getMethods();
		expect(reflectionMethods.length).toBe(2);
		expect(reflectionMethods[0] instanceof Reflection.Method).toBe(true);
		expect(reflectionMethods[1] instanceof Reflection.Method).toBe(true);
		expect(reflectionMethods[0].getName()).toBe('myMethod');
		expect(reflectionMethods[1].getName()).toBe('myOtherMethod');
	});
	
	xit('will return an array of named class reflection methods', function(){
		define('class My.Class', {
			'public myMethod (string) -> undefined': function(){},
			'public myMethod (number) -> undefined': function(){},
			'public myOtherMethod () -> undefined': function(){}
		});
		var reflectionMethods = new Reflection.Class('My.Class').getMethods('myMethod');
		expect(reflectionMethods.length).toBe(2);
		expect(reflectionMethods[0] instanceof Reflection.Method).toBe(true);
		expect(reflectionMethods[1] instanceof Reflection.Method).toBe(true);
		expect(reflectionMethods[0].getName()).toBe('myMethod');
		expect(reflectionMethods[0].getArguments()[0].getType().getIdentifier()).toBe('string');
		expect(reflectionMethods[1].getName()).toBe('myMethod');
		expect(reflectionMethods[1].getArguments()[0].getType().getIdentifier()).toBe('number');
	});
	
	it('will return an array of class reflection events', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public event myEvent ()': undefined,
			'public event myOtherEvent ()': undefined
		});
		var reflectionEvents = new Reflection.Class('My.Class').getEvents();
		expect(reflectionEvents.length).toBe(2);
		expect(reflectionEvents[0] instanceof Reflection.Event).toBe(true);
		expect(reflectionEvents[1] instanceof Reflection.Event).toBe(true);
		expect(reflectionEvents[0].getName()).toBe('myEvent');
		expect(reflectionEvents[1].getName()).toBe('myOtherEvent');
	});
	
	it('will return a single named reflection event', function(){
		define('class My.Class', {
			'public event myEvent ()': undefined,
			'public event myOtherEvent ()': undefined
		});
		var reflectionEvent = new Reflection.Class('My.Class').getEvent('myOtherEvent');
		expect(reflectionEvent instanceof Reflection.Event).toBe(true);
		expect(reflectionEvent.getName()).toBe('myOtherEvent');
	});
	
	it('will return an array of class reflection constants', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public constant MY_CONSTANT (string)': undefined,
			'public constant MY_OTHER_CONSTANT (string)': undefined
		});
		var reflectionConstants = new Reflection.Class('My.Class').getConstants();
		expect(reflectionConstants.length).toBe(2);
		expect(reflectionConstants[0] instanceof Reflection.Constant).toBe(true);
		expect(reflectionConstants[1] instanceof Reflection.Constant).toBe(true);
		expect(reflectionConstants[0].getName()).toBe('MY_CONSTANT');
		expect(reflectionConstants[1].getName()).toBe('MY_OTHER_CONSTANT');
	});
	
	it('will return a single named reflection constant', function(){
		define('class My.Class', {
			'public constant MY_CONSTANT (string)': undefined,
			'public constant MY_OTHER_CONSTANT (string)': undefined
		});
		var reflectionConstant = new Reflection.Class('My.Class').getConstant('MY_OTHER_CONSTANT');
		expect(reflectionConstant instanceof Reflection.Constant).toBe(true);
		expect(reflectionConstant.getName()).toBe('MY_OTHER_CONSTANT');
	});
	
	it('will indicate whether class is explicitly abstract', function(){
		define('class My.Class');
		define('abstract class My.AbstractClass');
		expect(new Reflection.Class('My.Class').isExplicitAbstract()).toBe(false);
		expect(new Reflection.Class('My.AbstractClass').isExplicitAbstract()).toBe(true);
	});
	
	it('will indicate whether class is implicitly abstract', function(){
		define('class My.Class');
		define('class My.ClassWithAbstracts', {
			'abstract public myMethod () -> undefined': undefined
		});
		expect(new Reflection.Class('My.Class').isImplicitAbstract()).toBe(false);
		expect(new Reflection.Class('My.ClassWithAbstracts').isImplicitAbstract()).toBe(true);
	});
	
	it('will indicate if class is either explicitly or implicitly abstract', function(){
		define('class My.Class');
		define('abstract class My.AbstractClass');
		define('class My.ClassWithAbstracts', {
			'abstract public myMethod () -> undefined': undefined
		});
		expect(new Reflection.Class('My.Class').isAbstract()).toBe(false);
		expect(new Reflection.Class('My.AbstractClass').isAbstract()).toBe(true);
		expect(new Reflection.Class('My.ClassWithAbstracts').isAbstract()).toBe(true);
	});
	
	it('allows new class instance to be created from reflection class', function(){
		define('class My.Class');
		var instance = new Reflection.Class('My.Class').createNew();
		expect(instance instanceof My.Class).toBe(true);
	});
	
	it('passes arguments to newly created class instance', function(){
		define('class My.Class', {
			'public constructorArguments (array)': null,
			'public construct (string, number) -> undefined': function(string, number){
				this.constructorArguments([string, number]);
			}
		});
		var instance = new Reflection.Class('My.Class').createNew('One', 1);
		expect(instance.constructorArguments()).toEqual(['One', 1]);
	});
	
	it('allows reflection class instance to be created', function(){
		define('class My.Class');
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		expect(reflectionClassInstance instanceof Reflection.ClassInstance).toBe(true);
	});
	
	it('allows reflection class to be returned from reflection class instance', function(){
		define('class My.Class');
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		expect(reflectionClassInstance.getClass() instanceof Reflection.Class).toBe(true);
		expect(reflectionClassInstance.getClass().getName()).toBe('My.Class');
	});
	
	it('will return an array of member instances from class instance', function(){
		define('class My.Class', {
			'private myProperty (string)': null,
			'public myMethod () -> undefined': function(){},
			'public event myEvent ()': undefined
		});
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		var memberInstances = reflectionClassInstance.getMemberInstances();
		expect(memberInstances.length).toBe(3);
		expect(memberInstances[0] instanceof Reflection.PropertyInstance).toBe(true);
		expect(memberInstances[1] instanceof Reflection.MethodInstance).toBe(true);
		expect(memberInstances[2] instanceof Reflection.EventInstance).toBe(true);
		expect(memberInstances[0].getProperty().getName()).toBe('myProperty');
		expect(memberInstances[1].getMethod().getName()).toBe('myMethod');
		expect(memberInstances[2].getEvent().getName()).toBe('myEvent');
	});
	
	it('will return an array of property instances from class instance', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public myOtherProperty (number)': null,
			'public myMethod () -> undefined': function(){}
		});
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		var propertyInstances = reflectionClassInstance.getPropertyInstances();
		expect(propertyInstances.length).toBe(2);
		expect(propertyInstances[0] instanceof Reflection.PropertyInstance).toBe(true);
		expect(propertyInstances[1] instanceof Reflection.PropertyInstance).toBe(true);
		expect(propertyInstances[0].getProperty().getName()).toBe('myProperty');
		expect(propertyInstances[1].getProperty().getName()).toBe('myOtherProperty');
	});
	
	it('will return a single named property instance', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public myOtherProperty (number)': null
		});
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		var reflectionProperty = reflectionClassInstance.getPropertyInstance('myOtherProperty');
		expect(reflectionProperty instanceof Reflection.PropertyInstance).toBe(true);
		expect(reflectionProperty.getProperty().getName()).toBe('myOtherProperty');
	});
	
	it('will return an array of method instances', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public myMethod () -> undefined': function(){},
			'public myOtherMethod () -> undefined': function(){}
		});
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		var reflectionMethods = reflectionClassInstance.getMethodInstances();
		expect(reflectionMethods.length).toBe(2);
		expect(reflectionMethods[0] instanceof Reflection.MethodInstance).toBe(true);
		expect(reflectionMethods[1] instanceof Reflection.MethodInstance).toBe(true);
		expect(reflectionMethods[0].getMethod().getName()).toBe('myMethod');
		expect(reflectionMethods[1].getMethod().getName()).toBe('myOtherMethod');
	});
	
	xit('will return an array of named method instances', function(){
		define('class My.Class', {
			'public myMethod (string) -> undefined': function(){},
			'public myMethod (number) -> undefined': function(){},
			'public myOtherMethod () -> undefined': function(){}
		});
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		var reflectionMethodInstances = reflectionClassInstance.getMethodInstances('myMethod');
		expect(reflectionMethodInstances.length).toBe(2);
		expect(reflectionMethodInstances[0] instanceof Reflection.MethodInstance).toBe(true);
		expect(reflectionMethodInstances[1] instanceof Reflection.MethodInstance).toBe(true);
		var reflectionMethod = reflectionMethodInstances[0].getMethod();
		expect(reflectionMethod.getName()).toBe('myMethod');
		expect(reflectionMethod.getArguments()[0].getType().getIdentifier()).toBe('string');
		reflectionMethod = reflectionMethodInstances[1].getMethod();
		expect(reflectionMethod.getName()).toBe('myMethod');
		expect(reflectionMethod.getArguments()[0].getType().getIdentifier()).toBe('number');
	});
	
	it('will return an array of event instances', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public event myEvent ()': undefined,
			'public event myOtherEvent ()': undefined
		});
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		var reflectionEvents = reflectionClassInstance.getEventInstances();
		expect(reflectionEvents.length).toBe(2);
		expect(reflectionEvents[0] instanceof Reflection.EventInstance).toBe(true);
		expect(reflectionEvents[1] instanceof Reflection.EventInstance).toBe(true);
		expect(reflectionEvents[0].getEvent().getName()).toBe('myEvent');
		expect(reflectionEvents[1].getEvent().getName()).toBe('myOtherEvent');
	});
	
	it('will return a single named event instance', function(){
		define('class My.Class', {
			'public event myEvent ()': undefined,
			'public event myOtherEvent ()': undefined
		});
		var instance = new My.Class();
		var reflectionClassInstance = new Reflection.ClassInstance(instance);
		var reflectionEvent = reflectionClassInstance.getEventInstance('myOtherEvent');
		expect(reflectionEvent instanceof Reflection.EventInstance).toBe(true);
		expect(reflectionEvent.getEvent().getName()).toBe('myOtherEvent');
	});
	
	it('reveals property information', function(){
		define('class My.Class', {
			'protected myProperty (string)': 'Example'
		});
		var reflectionProperty = new Reflection.Property('My.Class', 'myProperty');
		expect(reflectionProperty.getName()).toBe('myProperty');
		expect(reflectionProperty.getType().getIdentifier()).toBe('string');
		expect(reflectionProperty.getAccessType().getIdentifier()).toBe('protected');
		expect(reflectionProperty.hasDefaultValue()).toBe(true);
		expect(reflectionProperty.getDefaultValue()).toBe('Example');
		expect(reflectionProperty.getClass().getName()).toBe('My.Class');
	});
	
	it('reveals method information', function(){
		define('class My.Class', {
			'private myMethod (number) -> string': function(){}
		});
		var reflectionMethod = new Reflection.Method('My.Class', 'myMethod');
		expect(reflectionMethod.getName()).toBe('myMethod');
		expect(reflectionMethod.getAccessType().getIdentifier()).toBe('private');
		expect(reflectionMethod.getArguments()[0].getType().getIdentifier()).toBe('number');
		expect(reflectionMethod.getClass().getName()).toBe('My.Class');
		// @todo Erm, return type??
	});
	
	it('reveals event information', function(){
		define('class My.Class', {
			'public event myEvent (boolean)': undefined
		});
		var reflectionEvent = new Reflection.Event('My.Class', 'myEvent');
		expect(reflectionEvent.getName()).toBe('myEvent');
		expect(reflectionEvent.getAccessType().getIdentifier()).toBe('public');
		expect(reflectionEvent.getArguments()[0].getType().getIdentifier()).toBe('boolean');
		expect(reflectionEvent.getClass().getName()).toBe('My.Class');
	});
	
	it('reveals constant information', function(){
		define('class My.Class', {
			'public constant MY_CONSTANT (number)': 123
		});
		var reflectionConstant = new Reflection.Constant('My.Class', 'MY_CONSTANT');
		expect(reflectionConstant.getName()).toBe('MY_CONSTANT');
		expect(reflectionConstant.getAccessType().getIdentifier()).toBe('public');
		expect(reflectionConstant.getType().getIdentifier()).toBe('number');
		expect(reflectionConstant.getValue()).toBe(123);
		expect(reflectionConstant.isAutoGenerated()).toBe(false);
		expect(reflectionConstant.getClass().getName()).toBe('My.Class');
	});
	
	it('allows a property instance to be manipulated', function(){
		define('class My.Class', {
			'private myProperty (string)': 'Example'
		});
		var instance = new My.Class();
		var reflectionProperty = new Reflection.PropertyInstance(instance, 'myProperty');
		expect(reflectionProperty.getProperty().getName()).toBe('myProperty');
		expect(reflectionProperty.getValue()).toBe('Example');
		reflectionProperty.setValue('New value');
		expect(reflectionProperty.getValue()).toBe('New value');
	});
	
	it('allows a method instance to be manipulated', function(){
		define('class My.Class', {
			'private myMethod (string) -> string': function(string){ return string; }
		});
		var instance = new My.Class();
		var reflectionMethod = new Reflection.MethodInstance(instance, 'myMethod');
		expect(reflectionMethod.getMethod().getName()).toBe('myMethod');
		expect(reflectionMethod.call('Example')).toBe('Example');
	});
	
	it('allows an event instance to be manipulated', function(){
		define('class My.Class', {
			'public event myEvent (string)': undefined
		});
		define('class My.Binder', {
			'public eventArgument (string)': null,
			'public construct (My.Class) -> undefined': function(object){
				object.bind('myEvent', 'handleMyEvent');
			},
			'private handleMyEvent (string) -> undefined': function(string){
				this.eventArgument(string);
			}
		});
		var instance = new My.Class();
		var binder = new My.Binder(instance);
		var reflectionEvent = new Reflection.EventInstance(instance, 'myEvent');
		expect(reflectionEvent.getEvent().getName()).toBe('myEvent');
		reflectionEvent.trigger('Example');
		expect(binder.eventArgument()).toBe('Example');
	});
	
	it('allows a class to be mocked and all its member functions be present', function(){
		define('class My.Class', {
			'public myProperty (string)': null,
			'public myMethod () -> undefined': function(){}
		});
		var mock = new Reflection.Class('My.Class').getMock();
		expect(mock instanceof My.Class).toBe(true);
		expect(typeof mock.myProperty).toBe('function');
		expect(typeof mock.myMethod).toBe('function');
		expect(typeof mock.bind).toBe('function');
	});
	
	it('allows an interface to be mocked and all its member functions be present', function(){
		define('interface My.IInterface', [
			'public myMethod () -> undefined'
		]);
		var mock = new Reflection.Interface('My.IInterface').getMock();
		expect(new Reflection.Class(mock).implementsInterface('My.IInterface')).toBe(true);
	});
	
});
