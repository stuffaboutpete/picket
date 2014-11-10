describe('Inheritance', function(){
	
	beforeEach(function(){
		window.My = undefined;
	});
	
	it('can be defined between two classes', function(){
		define('class My.Parent');
		define('class My.Child extends My.Parent');
		var myObject = new My.Child();
		expect(myObject instanceof My.Child).toBe(true);
		expect(myObject instanceof My.Parent).toBe(true);
	});
	
	it('can be defined between more classes', function(){
		define('class My.GreatGrandParent', {});
		define('class My.GrandParent extends My.GreatGrandParent', {});
		define('class My.Parent extends My.GrandParent', {});
		define('class My.Child extends My.Parent', {});
		define('class My.OtherChild extends My.Parent', {});
		var myObject = new My.Child();
		expect(myObject instanceof My.Child).toBe(true);
		expect(myObject instanceof My.OtherChild).toBe(false);
		expect(myObject instanceof My.Parent).toBe(true);
		expect(myObject instanceof My.GrandParent).toBe(true);
		expect(myObject instanceof My.GreatGrandParent).toBe(true);
	});
	
	it('toString method returns instantiated class name', function(){
		define('class My.Parent');
		define('class My.Child extends My.Parent');
		expect((new My.Parent()).toString()).toBe('[object My.Parent]');
		expect((new My.Child()).toString()).toBe('[object My.Child]');
	});
	
	it('makes parent property available in child object', function(){
		define('class My.Parent', {
			'public myProperty (string)': 'Example'
		});
		define('class My.Child extends My.Parent');
		var myObject = new My.Child();
		expect(myObject.myProperty()).toBe('Example');
	});
	
	it('allows child to access parent properties', function(){
		define('class My.Parent', {
			'public myProperty (string)': 'Example'
		});
		define('class My.Child extends My.Parent', {
			'public getProperty () -> string': function(){
				return this.myProperty();
			}
		});
		var myObject = new My.Child();
		expect(myObject.getProperty()).toBe('Example');
	});
	
	it('allows child to set and change parent properties', function(){
		define('class My.Parent', {
			'public myProperty (string)': null
		});
		define('class My.Child extends My.Parent', {
			'public setProperty () -> undefined': function(){
				this.myProperty('First value');
			},
			'public changeProperty () -> undefined': function(){
				this.myProperty('Second value');
			}
		});
		var myObject = new My.Child();
		expect(myObject.myProperty()).toBe(null);
		myObject.setProperty();
		expect(myObject.myProperty()).toBe('First value');
		myObject.changeProperty();
		expect(myObject.myProperty()).toBe('Second value');
	});
	
	it('child properties override parent properties', function(){
		define('class My.Parent', {
			'public myProperty (string)': 'Parent value',
			'public getMyProperty () -> array': function(){
				return [this.myProperty()];
			}
		});
		define('class My.Child extends My.Parent', {
			'public myProperty (number)': 123
		});
		var myParent = new My.Parent();
		var myChild = new My.Child();
		expect(myParent.myProperty()).toBe('Parent value');
		expect(myChild.myProperty()).toBe(123);
		expect(myParent.getMyProperty()).toEqual(['Parent value']);
		expect(myChild.getMyProperty()).toEqual([123]);
	});
	
	it('makes parent method available in child object', function(){
		define('class My.Parent', {
			'public myMethod (number) -> string': function(number){
				return '' + number;
			}
		});
		define('class My.Child extends My.Parent');
		var myObject = new My.Child();
		expect(myObject.myMethod(7.8)).toBe('7.8');
	});
	
	it('allows child object to call parent method', function(){
		define('class My.Parent', {
			'public parentMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent', {
			'public callParentMethod () -> string': function(){
				return this.parentMethod();
			}
		});
		var myObject = new My.Child();
		expect(myObject.callParentMethod()).toBe('From Parent');
	});
	
	it('allows child method to override parent method', function(){
		define('class My.Parent', {
			'public myMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent', {
			'public myMethod () -> string': function(){
				return 'From Child';
			}
		});
		var myObject = new My.Child();
		expect(myObject.myMethod()).toBe('From Child');
	});
	
	xit('allows child method to call parent method', function(){
		define('class My.Parent', {
			'public myMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent', {
			'public myMethod () -> string': function(){
				return parent.myMethod();
			}
		});
		var myObject = new My.Child();
		expect(myObject.myMethod()).toBe('From Parent');
	});
	
	it('allows child method to overload parent method and both are available', function(){
		define('class My.Parent', {
			'public myMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent', {
			'public myMethod (boolean) -> string': function(){
				return 'From Child';
			}
		});
		var myObject = new My.Child();
		expect(myObject.myMethod()).toBe('From Parent');
		expect(myObject.myMethod(true)).toBe('From Child');
	});
	
	it('makes static parent method available in child class', function(){
		define('class My.Parent', {
			'public static myMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent');
		expect(My.Child.myMethod()).toBe('From Parent');
	});
	
	it('allows static child method to call static parent method', function(){
		define('class My.Parent', {
			'public static parentMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent', {
			'public static callParentMethod () -> string': function(){
				return this.parentMethod();
			}
		});
		expect(My.Child.callParentMethod()).toBe('From Parent');
	});
	
	it('allows child class to override static parent method', function(){
		define('class My.Parent', {
			'public static myMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent', {
			'public static myMethod () -> string': function(){
				return 'From Child';
			}
		});
		expect(My.Child.myMethod()).toBe('From Child');
	});
	
	it('allows static child method to overload parent method and both are available', function(){
		define('class My.Parent', {
			'public static myMethod () -> string': function(){
				return 'From Parent';
			}
		});
		define('class My.Child extends My.Parent', {
			'public static myMethod (boolean) -> string': function(){
				return 'From Child';
			}
		});
		expect(My.Child.myMethod()).toBe('From Parent');
		expect(My.Child.myMethod(true)).toBe('From Child');
	});
	
	it('makes parent event available in child object for binding and triggering', function(){
		define('class My.Parent', {
			'public event myEvent ()': undefined
		});
		define('class My.Child extends My.Parent', {
			'public triggerEvent () -> undefined': function(){
				this.trigger('myEvent', []);
			}
		});
		define('class My.Binder', {
			'public targetMethodCalled (boolean)': false,
			'public construct (My.Child) -> undefined': function(binder){
				binder.bind('myEvent', 'targetMethod');
			},
			'public targetMethod () -> undefined': function(){
				this.targetMethodCalled(true);
			}
		});
		var myChild = new My.Child();
		var myBinder = new My.Binder(myChild);
		myChild.triggerEvent();
		expect(myBinder.targetMethodCalled()).toBe(true);
	});
	
	it('allows child events to override parent events', function(){
		define('class My.Parent', {
			'public event myEvent (string)': undefined
		});
		define('class My.Child', {
			'public event myEvent (number)': undefined,
			'public triggerEvent () -> undefined': function(){
				this.trigger('myEvent', [123]);
			}
		});
		define('class My.Binder', {
			'public targetMethodCalled (boolean)': false,
			'public construct (My.Child) -> undefined': function(binder){
				binder.bind('myEvent', 'targetMethod');
			},
			'public targetMethod (number) -> undefined': function(number){
				this.targetMethodCalled(true);
			}
		});
		var myChild = new My.Child();
		var myBinder = new My.Binder(myChild);
		myChild.triggerEvent();
		expect(myBinder.targetMethodCalled()).toBe(true);
	});
	
	it('makes parent constant available in child class', function(){
		define('class My.Parent', {
			'public constant MY_CONSTANT (number)': 123
		});
		define('class My.Child extends My.Parent');
		expect(My.Child.MY_CONSTANT()).toBe(123);
	});
	
	it('allows child class to override parent constant', function(){
		define('class My.Parent', {
			'public constant MY_CONSTANT (string)': 'Parent constant'
		});
		define('class My.Child extends My.Parent', {
			'public constant MY_CONSTANT (string)': 'Child constant'
		});
		expect(My.Child.MY_CONSTANT()).toBe('Child constant');
	});
	
});
