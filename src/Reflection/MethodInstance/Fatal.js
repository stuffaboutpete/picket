;(function(Picket, Reflection, _){
	
	var messages = {
		METHOD_DOES_NOT_EXIST:
			'Provided method name and class instance do not describe a valid method'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.MethodInstance.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.MethodInstance = window.Picket.Reflection.MethodInstance || {}
);
