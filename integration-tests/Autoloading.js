describe('Autoloading', function(){
	
	start.addAutoLoadPattern(
		'AutoLoad',
		'/absolute/classyjs/integration-tests/Autoloading'
	);
	
	// @todo We have an issue running multiple starts at the same time.
	// it('can include external class file', function(done){
	// 	define('class AutoloadComplete', {
	// 		'public static complete () -> undefined': function(){
	// 			expect(typeof AutoLoad.Classg7H6th).toBe('function');
	// 			done();
	// 		}
	// 	});
	// 	start('AutoLoad.Classg7H6th');
	// });
	
	it('will process all downstream dependencies before instantiating target class', function(done){
		define('class AutoloadComplete', {
			'public static complete () -> undefined': function(){
				debugger;
				expect(typeof AutoLoad.ClassU6gh0h).toBe('function');
				expect(typeof AutoLoad.Class7oYdR4).toBe('function');
				expect(typeof AutoLoad.ClassuYU9dD).toBe('function');
				expect(typeof AutoLoad.ClassUhJG65).toBe('function');
				done();
			}
		});
		start('AutoLoad.ClassU6gh0h');
	});
	
});
