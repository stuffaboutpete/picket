describe('Access control', function(){
	
	beforeEach(function(){
		delete window.My;
	});
	
	it('allows object to get all own properties', function(){
		define('class My.Class', {
			'public myPublic (string)': 'public',
			'protected myProtected (string)': 'protected',
			'private myPrivate (string)': 'private',
			'public getValues () -> [string]': function(){
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
			'public getValues () -> [string]': function(){
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
	
	it('denies external class access to get private and protected properties', function(){
		define('class My.Class', {
			'public myPublic (string)': 'public',
			'protected myProtected (string)': 'protected',
			'private myPrivate (string)': 'private'
		});
		define('class My.AccessingClass', {
			'private myObject (My.Class)': null,
			'public construct (My.Class) -> undefined': function(myObject){
				this.myObject(myObject);
			},
			'public getPublic () -> string': function(){
				return this.myObject().myPublic();
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
		expect(myAccessingObject.getPublic()).toBe('public');
		var expectedFatal = new ClassyJS.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: protected'
		);
		expect(function(){
			myAccessingObject.getProtected();
		}).toThrow(expectedFatal);
		var expectedFatal = new ClassyJS.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: private'
		);
		expect(function(){
			myAccessingObject.getPrivate();
		}).toThrow(expectedFatal);
	});
	
	it('denies non-class access to get private and protected properties', function(){
		define('class My.Class', {
			'public myPublic (string)': 'public',
			'protected myProtected (string)': 'protected',
			'private myPrivate (string)': 'private'
		});
		var myObject = new My.Class();
		expect(myObject.myPublic()).toBe('public');
		var expectedFatal = new ClassyJS.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: protected'
		);
		expect(function(){ myObject.myProtected(); }).toThrow(expectedFatal);
		var expectedFatal = new ClassyJS.Member.Property.Fatal(
			'ACCESS_NOT_ALLOWED',
			'Access type: private'
		);
		expect(function(){ myObject.myPrivate(); }).toThrow(expectedFatal);
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
		expect(myObject.getValueViaParent()).toBe('private');
		expect(myObject.getValueViaChild()).toBe('private');
	});
	
});
