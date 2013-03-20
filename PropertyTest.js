module('Property Tests');

test('Property requires key to be set', function(){
	raises(function(){
		var myProperty = new Property();
	}, 'Property raises exception with no key');
	var myProperty = new Property('myKey');
	ok(myProperty instanceof Property, 'Property can be created with key');
});

test('Property key can be recalled', function(){
	var myProperty = new Property('myKey');
	ok(myProperty.getKey() == 'myKey');
});

test('Property requires scope to be set', function(){
	
	raises(function(){
		var myProperty = new Property('myKey', new Scope('public'));
	});
});