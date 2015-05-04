;(function(Picket, Reflection, _){
	
	var messages = {
		NON_STRING_IDENTIFIER_PROVIDED: 'The provided type identifier must be a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Type.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Type = window.Picket.Reflection.Type || {}
);
