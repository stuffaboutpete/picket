;(function(Picket, Reflection, _){
	
	var messages = {
		INTERFACE_DOES_NOT_EXIST: 'Provided name does not describe a valid interface',
		NON_STRING_INTERFACE_NAME_PROVIDED: 'The provided name must be a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Interface.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Interface = window.Picket.Reflection.Interface || {}
);
