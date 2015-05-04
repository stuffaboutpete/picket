;(function(Picket, Reflection, _){
	
	var messages = {
		CLASS_DOES_NOT_EXIST: 'Provided object is not an instance of a valid class',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be an object instance'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.ClassInstance.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.ClassInstance = window.Picket.Reflection.ClassInstance || {}
);
