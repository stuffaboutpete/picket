describe('Mocks', function(){
	
	var mocker;
	
	beforeEach(function(){
		delete window.My;
		mocker = new ClassyJS.Mocker(
			new ClassyJS.NamespaceManager(),
			new ClassyJS.Mocker.ReflectionClassFactory()
		);
	});
	
	it('can mock classy class', function(){
		define('class My.Class');
		var mock = mocker.getMock('My.Class');
		expect(mock instanceof My.Class).toBe(true);
	});
	
	it('do not call class constructor', function(){
		define('class My.Class', {
			'public construct () -> undefined': function(){
				// Force a fail
				expect(true).toBe(false);
			}
		});
		var mock = mocker.getMock('My.Class');
	});
	
	it('contain class methods when mocked', function(){
		define('class My.Class', {
			'public myMethod () -> undefined': function(){}
		});
		var mock = mocker.getMock('My.Class');
		expect(typeof mock.myMethod).toBe('function');
	});
	
	it('can mock non-classy objects', function(){
		var mock = mocker.getMock('Date');
		expect(mock instanceof Date).toBe(true);
	});
	
});
