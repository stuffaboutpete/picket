;(function(Picket, _){
	
	var messages = {
		NON_OBJECT_CLASS_MEMBERS:		'Provided class members must be defined as object',
		NON_ARRAY_INTERFACE_MEMBERS:	'Provided interface members must be defined as array'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Main.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Main = window.Picket.Main || {}
);
