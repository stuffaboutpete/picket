;(function(ClassyJS, Reflection, _){
	
	var messages = {
		INTERFACE_DOES_NOT_EXIST: 'Provided name does not describe a valid interface',
		NON_STRING_INTERFACE_NAME_PROVIDED: 'The provided name must be a string'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Interface.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Interface = window.ClassyJS.Reflection.Interface || {}
);
