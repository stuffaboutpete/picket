describe('Access control', function(){
	
	var protectedPropertyFatal;
	var privatePropertyFatal;
	var protectedMethodFatal;
	var privateMethodFatal;
	var protectedConstantFatal;
	var privateConstantFatal;
	var protectedEventFatal;
	
	beforeEach(function(){
		delete window.My;
		protectedPropertyFatal = new Picket.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: protected'
		);
		privatePropertyFatal = new Picket.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: private'
		);
		protectedMethodFatal = new Picket.Member.Method.Fatal('ACCESS_NOT_ALLOWED');
		privateMethodFatal = new Picket.Member.Method.Fatal('ACCESS_NOT_ALLOWED');
		protectedConstantFatal = new Picket.Member.Constant.Fatal('ACCESS_NOT_ALLOWED');
		privateConstantFatal = new Picket.Member.Constant.Fatal('ACCESS_NOT_ALLOWED');
		protectedEventFatal = new Picket.Member.Event.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: protected'
		);
	});
	
	it('allows object to get all own properties', function(){
		define('class My.Class', {
			'public myPublic (string)': 'public',
			'protected myProtected (string)': 'protected',
			'private myPrivate (string)': 'private',
			'public getValues () -> string[]': function(){
				return [
					this.myPublic(),
					this.myProtected(),
					this.myPrivate()
				];
			}
		});
		var myObject = new My.Class();
		expect(myObject.getValues()[0]).toBe('public');
		expect(myObject.getValues()[1]).toBe('protected');
		expect(myObject.getValues()[2]).toBe('private');
	});
	
	it('allows object to set all own properties', function(){
		define('class My.Class', {
			'public myPublic (string)': null,
			'protected myProtected (string)': null,
			'private myPrivate (string)': null,
			'public construct () -> undefined': function(){
				this.myPublic('public');
				this.myProtected('protected');
				this.myPrivate('private');
			},
			'public getValues () -> string[]': function(){
				return [
					this.myPublic(),
					this.myProtected(),
					this.myPrivate()
				];
			}
		});
		var myObject = new My.Class();
		expect(myObject.getValues()[0]).toBe('public');
		expect(myObject.getValues()[1]).toBe('protected');
		expect(myObject.getValues()[2]).toBe('private');
	});
	
	it('allows external class access to get public properties', function(){
		define('class My.Class', {
			'public myPublic (string)': 'public'
		});
		define('class My.AccessingClass', {
			'private myObject (My.Class)': null,
			'public construct (My.Class) -> undefined': function(myObject){
				this.myObject(myObject);
			},
			'public getPublic () -> string': function(){
				return this.myObject().myPublic();
			}
		});
		var myObject = new My.Class();
		var myAccessingObject = new My.AccessingClass(myObject);
		expect(myAccessingObject.getPublic()).toBe('public');
	});
	
	it('allows external class access to set public properties', function(){
		define('class My.Class', {
			'public myPublic (string)': null
		});
		define('class My.AccessingClass', {
			'private myObject (My.Class)': null,
			'public construct (My.Class) -> undefined': function(myObject){
				this.myObject(myObject);
			},
			'public setPublic () -> undefined': function(){
				this.myObject().myPublic('public');
			}
		});
		var myObject = new My.Class();
		var myAccessingObject = new My.AccessingClass(myObject);
		myAccessingObject.setPublic();
		expect(myObject.myPublic()).toBe('public');
	});
	
	it('denies external class access to get private and protected properties', function(){
		define('class My.Class', {
			'protected myProtected (string)': 'protected',
			'private myPrivate (string)': 'private'
		});
		define('class My.AccessingClass', {
			'private myObject (My.Class)': null,
			'public construct (My.Class) -> undefined': function(myObject){
				this.myObject(myObject);
			},
			'public getProtected () -> string': function(){
				return this.myObject().myProtected();
			},
			'public getPrivate () -> string': function(){
				return this.myObject().myPrivate();
			}
		});
		var myObject = new My.Class();
		var myAccessingObject = new My.AccessingClass(myObject);
		expect(function(){
			myAccessingObject.getProtected();
		}).toThrow(protectedPropertyFatal);
		expect(function(){
			myAccessingObject.getPrivate();
		}).toThrow(privatePropertyFatal);
	});
	
	it('denies external class access to set private and protected properties', function(){
		define('class My.Class', {
			'protected myProtected (string)': null,
			'private myPrivate (string)': null
		});
		define('class My.AccessingClass', {
			'private myObject (My.Class)': null,
			'public construct (My.Class) -> undefined': function(myObject){
				this.myObject(myObject);
			},
			'public setProtected () -> undefined': function(){
				this.myObject().myProtected('protected');
			},
			'public setPrivate () -> undefined': function(){
				this.myObject().myPrivate('private');
			}
		});
		var myObject = new My.Class();
		var myAccessingObject = new My.AccessingClass(myObject);
		expect(function(){
			myAccessingObject.setProtected();
		}).toThrow(protectedPropertyFatal);
		expect(function(){
			myAccessingObject.setPrivate();
		}).toThrow(privatePropertyFatal);
	});
	
	it('denies non-class access to get private and protected properties', function(){
		define('class My.Class', {
			'protected myProtected (string)': 'protected',
			'private myPrivate (string)': 'private'
		});
		var myObject = new My.Class();
		expect(function(){ myObject.myProtected(); }).toThrow(protectedPropertyFatal);
		expect(function(){ myObject.myPrivate(); }).toThrow(privatePropertyFatal);
	});
	
	it('denies non-class access to set private and protected properties', function(){
		define('class My.Class', {
			'protected myProtected (string)': null,
			'private myPrivate (string)': null
		});
		var myObject = new My.Class();
		expect(function(){ myObject.myProtected('protected'); }).toThrow(protectedPropertyFatal);
		expect(function(){ myObject.myPrivate('private'); }).toThrow(privatePropertyFatal);
	});
	
	it('allows protected get access to parent and child classes', function(){
		define('class My.ParentClass', {
			'public getValueViaParent () -> string': function(){
				return this.myProtected();
			}
		});
		define('class My.Class extends My.ParentClass', {
			'protected myProtected (string)': 'protected'
		});
		define('class My.ChildClass extends My.Class', {
			'public getValueViaChild () -> string': function(){
				return this.myProtected();
			}
		});
		var myObject = new My.ChildClass();
		expect(myObject.getValueViaParent()).toBe('protected');
		expect(myObject.getValueViaChild()).toBe('protected');
	});
	
	it('allows protected set access to parent and child classes', function(){
		define('class My.ParentClass', {
			'public setValueViaParent () -> undefined': function(){
				this.myProtected('from parent');
			}
		});
		define('class My.Class extends My.ParentClass', {
			'protected myProtected (string)': null,
			'public getValue () -> string': function(){
				return this.myProtected();
			}
		});
		define('class My.ChildClass extends My.Class', {
			'public setValueViaChild () -> undefined': function(){
				this.myProtected('from child');
			}
		});
		var myObject = new My.ChildClass();
		myObject.setValueViaParent();
		expect(myObject.getValue()).toBe('from parent');
		myObject.setValueViaChild();
		expect(myObject.getValue()).toBe('from child');
	});
	
	it('denies private get access to parent and child classes', function(){
		define('class My.ParentClass', {
			'public getValueViaParent () -> string': function(){
				return this.myPrivate();
			}
		});
		define('class My.Class extends My.ParentClass', {
			'private myPrivate (string)': 'private'
		});
		define('class My.ChildClass extends My.Class', {
			'public getValueViaChild () -> string': function(){
				return this.myPrivate();
			}
		});
		var myObject = new My.ChildClass();
		expect(function(){ myObject.getValueViaParent(); }).toThrow(privatePropertyFatal);
		expect(function(){ myObject.getValueViaChild(); }).toThrow(privatePropertyFatal);
	});
	
	it('denies private set access to parent and child classes', function(){
		define('class My.ParentClass', {
			'public setValueViaParent () -> undefined': function(){
				this.myPrivate('from parent');
			}
		});
		define('class My.Class extends My.ParentClass', {
			'private myPrivate (string)': 'private'
		});
		define('class My.ChildClass extends My.Class', {
			'public setValueViaChild () -> undefined': function(){
				this.myPrivate('from child');
			}
		});
		var myObject = new My.ChildClass();
		expect(function(){ myObject.setValueViaParent(); }).toThrow(privatePropertyFatal);
		expect(function(){ myObject.setValueViaChild(); }).toThrow(privatePropertyFatal);
	});
	
	it('allows object to call all own methods', function(){
		define('class My.Class', {
			'public publicMethod () -> string': function(){
				return 'public';
			},
			'protected protectedMethod () -> string': function(){
				return 'protected';
			},
			'private privateMethod () -> string': function(){
				return 'private';
			},
			'public callMethods () -> string[]': function(){
				return [
					this.publicMethod(),
					this.protectedMethod(),
					this.privateMethod()
				];
			}
		});
		var myObject = new My.Class();
		expect(myObject.callMethods()[0]).toBe('public');
		expect(myObject.callMethods()[1]).toBe('protected');
		expect(myObject.callMethods()[2]).toBe('private');
	});
	
	it('allows external class to call public method', function(){
		define('class My.Class', {
			'public publicMethod () -> string': function(){
				return 'public';
			}
		});
		define('class My.AccessingClass', {
			'public callPublicMethod (My.Class) -> string': function(myObject){
				return myObject.publicMethod();
			}
		});
		var myObject = new My.Class();
		var myAccessingObject = new My.AccessingClass();
		expect(myAccessingObject.callPublicMethod(myObject)).toBe('public');
	});
	
	it('allows non-object to call public method', function(){
		define('class My.Class', {
			'public publicMethod () -> string': function(){
				return 'public';
			}
		});
		var myObject = new My.Class();
		expect(myObject.publicMethod()).toBe('public');
	});
	
	it('denies external class access to private and protected methods', function(){
		define('class My.Class', {
			'private privateMethod () -> string': function(){
				return 'private';
			},
			'protected protectedMethod () -> string': function(){
				return 'protected';
			}
		});
		define('class My.AccessingClass', {
			'private myObject (My.Class)': null,
			'public construct (My.Class) -> undefined': function(myObject){
				this.myObject(myObject);
			},
			'public callPrivateMethod () -> string': function(){
				return this.myObject().privateMethod();
			},
			'public callProtectedMethod () -> string': function(){
				return this.myObject().protectedMethod();
			}
		});
		var myObject = new My.Class();
		var myAccessingObject = new My.AccessingClass(myObject);
		expect(function(){ myAccessingObject.callPrivateMethod(); }).toThrow(privateMethodFatal);
		expect(function(){
			myAccessingObject.callProtectedMethod();
		}).toThrow(protectedMethodFatal);
	});
	
	it('denies non-class access to private and protected methods', function(){
		define('class My.Class', {
			'private privateMethod () -> string': function(){
				return 'private';
			},
			'protected protectedMethod () -> string': function(){
				return 'protected';
			}
		});
		var myObject = new My.Class();
		expect(function(){ myObject.privateMethod(); }).toThrow(privateMethodFatal);
		expect(function(){ myObject.protectedMethod(); }).toThrow(protectedMethodFatal);
	});
	
	it('allows parent and child classes to call protected method', function(){
		define('class My.ParentClass', {
			'public callMethodViaParent () -> string': function(){
				return this.protectedMethod();
			}
		});
		define('class My.Class extends My.ParentClass', {
			'protected protectedMethod () -> string': function(){
				return 'protected';
			}
		});
		define('class My.ChildClass extends My.Class', {
			'public callMethodViaChild () -> string': function(){
				return this.protectedMethod();
			}
		});
		var myObject = new My.ChildClass();
		expect(myObject.callMethodViaParent()).toBe('protected');
		expect(myObject.callMethodViaChild()).toBe('protected');
	});
	
	it('denies parent and child classes calling private method', function(){
		define('class My.ParentClass', {
			'public callMethodViaParent () -> string': function(){
				return this.privateMethod();
			}
		});
		define('class My.Class extends My.ParentClass', {
			'private privateMethod () -> string': function(){
				return 'private';
			}
		});
		define('class My.ChildClass extends My.Class', {
			'public callMethodViaChild () -> string': function(){
				return this.privateMethod();
			}
		});
		var myObject = new My.ChildClass();
		expect(function(){ myObject.callMethodViaParent(); }).toThrow(privateMethodFatal);
		expect(function(){ myObject.callMethodViaChild(); }).toThrow(privateMethodFatal);
	});
	
	it('allows function to be proxied as containing method', function(){
		define('class My.Class', {
			'public privateMethodCalled (boolean)': false,
			'public callPrivateMethod () -> string': function(){
				return this.proxyMethod(function(){
					return this.privateMethod();
				})();
			},
			'private privateMethod () -> string': function(){
				this.privateMethodCalled(true);
				return 'From private method';
			}
		});
		var myObject = new My.Class();
		expect(myObject.callPrivateMethod()).toBe('From private method');
		expect(myObject.privateMethodCalled()).toBe(true);
	});
	
	it('allows class instance to access all own constants', function(){
		define('class My.Class', {
			'public constant PUBLIC_CONSTANT (string)': 'public',
			'private constant PRIVATE_CONSTANT (string)': 'private',
			'protected constant PROTECTED_CONSTANT (string)': 'protected',
			'public getValues () -> string[]': function(){
				return [
					My.Class.PUBLIC_CONSTANT(),
					My.Class.PRIVATE_CONSTANT(),
					My.Class.PROTECTED_CONSTANT()
				];
			}
		});
		var myObject = new My.Class();
		expect(myObject.getValues()[0]).toBe('public');
		expect(myObject.getValues()[1]).toBe('private');
		expect(myObject.getValues()[2]).toBe('protected');
	});
	
	it('allows external class instance to access public constants', function(){
		define('class My.Class', {
			'public constant PUBLIC_CONSTANT (string)': 'public'
		});
		define('class My.AccessingClass', {
			'public getValue () -> string': function(){
				return My.Class.PUBLIC_CONSTANT();
			}
		});
		var myAccessingObject = new My.AccessingClass();
		expect(myAccessingObject.getValue()).toBe('public');
	});
	
	it('allows non-class to access public constants', function(){
		define('class My.Class', {
			'public constant PUBLIC_CONSTANT (string)': 'public'
		});
		expect(My.Class.PUBLIC_CONSTANT()).toBe('public');
	});
	
	it('denies external class instance access to private and protected constants', function(){
		define('class My.Class', {
			'private constant PRIVATE_CONSTANT (string)': 'private',
			'protected constant PROTECTED_CONSTANT (string)': 'protected'
		});
		define('class My.AccessingClass', {
			'public getPrivateValue () -> string': function(){
				return My.Class.PRIVATE_CONSTANT();
			},
			'public getProtectedValue () -> string': function(){
				return My.Class.PROTECTED_CONSTANT();
			}
		});
		var myAccessingObject = new My.AccessingClass();
		expect(function(){ myAccessingObject.getPrivateValue(); }).toThrow(privateConstantFatal);
		expect(function(){
			myAccessingObject.getProtectedValue();
		}).toThrow(protectedConstantFatal);
	});
	
	it('denies non-object access to private and protected constants', function(){
		define('class My.Class', {
			'private constant PRIVATE_CONSTANT (string)': 'private',
			'protected constant PROTECTED_CONSTANT (string)': 'protected'
		});
		expect(function(){
			My.Class.PRIVATE_CONSTANT(); }).toThrow(privateConstantFatal);
		expect(function(){ My.Class.PROTECTED_CONSTANT(); }).toThrow(protectedConstantFatal);
	});
	
	it('allows parent and child classes access to protected constants', function(){
		define('class My.ParentClass', {
			'public getValueViaParent () -> string': function(){
				return My.Class.PROTECTED_CONSTANT();
			}
		});
		define('class My.Class extends My.ParentClass', {
			'protected constant PROTECTED_CONSTANT (string)': 'protected'
		});
		define('class My.ChildClass extends My.Class', {
			'public getValueViaChild () -> string': function(){
				return My.Class.PROTECTED_CONSTANT();
			}
		});
		var myObject = new My.ChildClass();
		expect(myObject.getValueViaParent()).toBe('protected');
		expect(myObject.getValueViaChild()).toBe('protected');
	});
	
	it('denies parent and child classes access to private constants', function(){
		define('class My.ParentClass', {
			'public getValueViaParent () -> string': function(){
				return My.Class.PRIVATE_CONSTANT();
			}
		});
		define('class My.Class extends My.ParentClass', {
			'private constant PRIVATE_CONSTANT (string)': 'private'
		});
		define('class My.ChildClass extends My.Class', {
			'public getValueViaChild () -> string': function(){
				return My.Class.PRIVATE_CONSTANT();
			}
		});
		var myObject = new My.ChildClass();
		expect(function(){ myObject.getValueViaParent(); }).toThrow(privateConstantFatal);
		expect(function(){ myObject.getValueViaChild(); }).toThrow(privateConstantFatal);
	});
	
	it('allows class instance to bind to and trigger own events', function(){
		define('class My.Class', {
			'public event publicEvent ()': undefined,
			'protected event protectedEvent ()': undefined,
			'public eventsHandled (number)': 0,
			'public bindAndTrigger () -> undefined': function(){
				this.bind('publicEvent', 'targetMethod');
				this.bind('protectedEvent', 'targetMethod');
				this.trigger('publicEvent');
				this.trigger('protectedEvent');
			},
			'private targetMethod () -> undefined': function(){
				this.eventsHandled('++');
			}
		});
		var myObject = new My.Class();
		myObject.bindAndTrigger();
		expect(myObject.eventsHandled()).toBe(2);
	});
	
	it('allows external class to bind to public event', function(){
		define('class My.Class', {
			'public event publicEvent ()': undefined,
			'public triggerEvent () -> undefined': function(){
				this.trigger('publicEvent');
			}
		});
		define('class My.BindClass', {
			'public eventHandled (boolean)': false,
			'public construct (My.Class) -> undefined': function(myObject){
				myObject.bind('publicEvent', 'targetMethod');
			},
			'private targetMethod () -> undefined': function(){
				this.eventHandled(true);
			}
		});
		var myObject = new My.Class();
		var binder = new My.BindClass(myObject);
		myObject.triggerEvent();
		expect(binder.eventHandled()).toBe(true);
	});
	
	// @todo
	xit('denies external class from triggering public event', function(){
		define('class My.Class', {
			'public event publicEvent ()': undefined,
			'public construct () -> undefined': function(){
				this.bind('publicEvent', 'targetMethod');
			},
			'private targetMethod () -> undefined': function(){}
		});
		var myObject = new My.Class();
		myObject.trigger('publicEvent', []);
		expect(function(){ myObject.trigger('publicEvent'); }).toThrow(expectedFatal);
	});
	
	it('denies external class from binding to protected event', function(){
		define('class My.Class', {
			'protected event protectedEvent ()': undefined
		});
		define('class My.BindClass', {
			'public bindEvent (My.Class) -> undefined': function(myObject){
				myObject.bind('protectedEvent', 'targetMethod');
			},
			'private targetMethod () -> undefined': function(){}
		});
		var myObject = new My.Class();
		var binder = new My.BindClass();
		expect(function(){ binder.bindEvent(myObject); }).toThrow(protectedEventFatal);
	});
	
	it('allows parent and child classes access to bind to protected event', function(){
		define('class My.ParentClass', {
			'public parentEventHandled (boolean)': false,
			'public construct () -> undefined': function(){
				this.bind('protectedEvent', 'parentTargetMethod');
			},
			'private parentTargetMethod () -> undefined': function(){
				this.parentEventHandled(true);
			}
		});
		define('class My.Class extends My.ParentClass', {
			'protected event protectedEvent ()': undefined,
			'public construct () -> undefined': function(){
				parent.construct();
			},
			'public triggerEvent () -> undefined': function(){
				this.trigger('protectedEvent');
			}
		});
		define('class My.ChildClass extends My.Class', {
			'public childEventHandled (boolean)': false,
			'public construct () -> undefined': function(){
				this.bind('protectedEvent', 'childTargetMethod');
				parent.construct();
			},
			'private childTargetMethod () -> undefined': function(){
				this.childEventHandled(true);
			}
		});
		var myObject = new My.ChildClass();
		myObject.triggerEvent();
		expect(myObject.parentEventHandled()).toBe(true);
		expect(myObject.childEventHandled()).toBe(true);
	});
	
	it('allows parent and child classes to trigger protected event', function(){
		define('class My.ParentClass', {
			'public triggerEventFromParent () -> undefined': function(){
				this.trigger('protectedEvent');
			}
		});
		define('class My.Class extends My.ParentClass', {
			'protected event protectedEvent ()': undefined,
			'public eventsHandled (number)': 0,
			'public construct () -> undefined': function(){
				this.bind('protectedEvent', 'targetMethod');
			},
			'public targetMethod () -> undefined': function(){
				this.eventsHandled('++');
			}
		});
		define('class My.ChildClass extends My.Class', {
			'public triggerEventFromChild () -> undefined': function(){
				this.trigger('protectedEvent');
			}
		});
		var myObject = new My.ChildClass();
		myObject.triggerEventFromParent();
		myObject.triggerEventFromChild();
		expect(myObject.eventsHandled()).toBe(2);
	});
	
});
