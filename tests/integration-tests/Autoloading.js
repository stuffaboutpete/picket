describe('Autoloading', function(){
	
	var classMap;
	
	beforeEach(function(){
		delete window.My;
		classMap = { 'AutoLoad': '/base/tests/integration-tests/Autoloading' };
	});
	
	it('can include external class file', function(done){
		define('class My.AutoloadComplete', {
			'public static complete () -> undefined': function(){
				expect(typeof AutoLoad.Classg7H6th).toBe('function');
				done();
			}
		});
		start('AutoLoad.Classg7H6th', classMap);
	});
	
	it('will process all downstream dependencies before instantiating target class', function(done){
		define('class My.AutoloadComplete', {
			'public static complete () -> undefined': function(){
				expect(typeof AutoLoad.ClassU6gh0h).toBe('function');
				expect(typeof AutoLoad.Class7oYdR4).toBe('function');
				expect(typeof AutoLoad.ClassuYU9dD).toBe('function');
				expect(typeof AutoLoad.ClassUhJG65).toBe('function');
				done();
			}
		});
		start('AutoLoad.ClassU6gh0h', classMap);
	});
	
	it('allows inline class loading', function(done){
		define('class My.Class', {
			'public construct () -> undefined': function(){
				expect(typeof AutoLoad.ClassT6hGhj).toBe('undefined');
				require('AutoLoad.ClassT6hGhj', 'targetMethod');
			},
			'public targetMethod (string) -> undefined': function(className){
				expect(className).toBe('AutoLoad.ClassT6hGhj');
				expect(typeof AutoLoad.ClassT6hGhj).toBe('function');
				done();
			}
		});
		new My.Class();
	});
	
	it('allows class to call own private method after require', function(done){
		define('class My.Class', {
			'public construct () -> undefined': function(){
				expect(typeof AutoLoad.ClassTgc8cH).toBe('undefined');
				require('AutoLoad.ClassTgc8cH', 'targetMethod');
			},
			'private targetMethod (string) -> undefined': function(className){
				expect(className).toBe('AutoLoad.ClassTgc8cH');
				expect(typeof AutoLoad.ClassTgc8cH).toBe('function');
				done();
			}
		});
		new My.Class();
	});
	
	it('allows parent class to be loaded and relationship is intact', function(done){
		define('class My.AutoloadComplete', {
			'public static complete (AutoLoad.ClassS9yhHw) -> undefined': function(child){
				expect(child instanceof AutoLoad.ClassS9yhHw).toBe(true);
				expect(child instanceof AutoLoad.ClassHJ4Vxs).toBe(true);
				expect(child.myMethod('String')).toBe('Edited: String');
				done();
			}
		});
		start('AutoLoad.ClassS9yhHw', classMap);
	});
	
	it('allows interface to be loaded and relationship is intact', function(done){
		define('class My.AutoloadComplete', {
			'public static complete (AutoLoad.Class7dgMw9) -> undefined': function(object){
				expect(object.conformsTo('AutoLoad.Interface7F4dCu')).toBe(true);
				done();
			}
		});
		start('AutoLoad.Class7dgMw9', classMap);
	});
	
});
