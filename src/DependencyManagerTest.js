describe('Calculator', function(){
	
	it('can add numbers', function(){
		var calc = new Calc(10);
		expect(calc.add(7).minus(5).out()).toBe(12);
	});
	
});
