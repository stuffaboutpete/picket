describe('Constants', function(){
	
	beforeEach(function(){
		window.My = undefined;
	});
	
	it('can be defined and accessed', function(){
		define('class My.Class', {
			'public constant MY_CONSTANT (string)': 'Constant value'
		});
		expect(My.Class.MY_CONSTANT()).toBe('Constant value');
	});
	
	it('cannot be changed', function(){
		define('class My.Class', {
			'public constant MY_CONSTANT (string)': 'Constant value'
		});
		My.Class.MY_CONSTANT('New value');
		expect(My.Class.MY_CONSTANT()).toBe('Constant value');
	});
	
	it('can be generated', function(){
		define('class My.Class', {
			'public constant MY_CONSTANT (number)': undefined
		});
		expect(typeof My.Class.MY_CONSTANT()).toBe('number');
	});
	
	it('are consistent across calls', function(){
		define('class My.Class', {
			'public constant MY_CONSTANT (number)': undefined
		});
		var constantValue = My.Class.MY_CONSTANT();
		expect(My.Class.MY_CONSTANT()).toBe(constantValue);
	});
	
	it('hold different values', function(){
		define('class My.Class', {
			'public constant MY_CONSTANT_ONE (number)': undefined,
			'public constant MY_CONSTANT_TWO (number)': undefined
		});
		expect(My.Class.MY_CONSTANT_ONE() == My.Class.MY_CONSTANT_ONE()).toBe(true);
		expect(My.Class.MY_CONSTANT_TWO() == My.Class.MY_CONSTANT_TWO()).toBe(true);
		expect(My.Class.MY_CONSTANT_ONE() == My.Class.MY_CONSTANT_TWO()).toBe(false);
	});
	
});
