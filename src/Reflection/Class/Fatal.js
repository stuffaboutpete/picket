;(function(Picket, Reflection, _){
	
	var messages = {
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Class.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Class = window.Picket.Reflection.Class || {}
);
