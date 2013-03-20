module('Scope Tests');

test('Scope requires value argument', function(){
	raises(function(){
		var myScope = new Scope();
	}, 'Scope constructor requires value');
	var myScope = new Scope('public');
	ok(myScope instanceof Scope, 'Scope can be created with value');
});

test('Value must be valid string', function(){
	
	var myScope = new Scope('public');
	ok(myScope instanceof Scope, 'Value can be \'public\'');
	
	var myScope = new Scope('protected');
	ok(myScope instanceof Scope, 'Value can be \'protected\'');
	
	var myScope = new Scope('private');
	ok(myScope instanceof Scope, 'Value can be \'private\'');
	
	raises(function(){
		var myScope = new Scope('otherString');
	}, 'Value cannot be other string');
	
	raises(function(){
		var myScope = new Scope(1);
	}, 'Value cannot be number');
	
	raises(function(){
		var myScope = new Scope(['public']);
	}, 'Value cannot be array');
	
	raises(function(){
		var myScope = new Scope({public:true});
	}, 'Value cannot be object');
	
	raises(function(){
		var myScope = new Scope(true);
	}, 'Value cannot be true');
	
	raises(function(){
		var myScope = new Scope(false);
	}, 'Value cannot be false');
	
});