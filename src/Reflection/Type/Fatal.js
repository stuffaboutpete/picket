;(function(ClassyJS, Reflection, _){
	
	var messages = {
		NON_STRING_IDENTIFIER_PROVIDED: 'The provided type identifier must be a string'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Type.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Type = window.ClassyJS.Reflection.Type || {}
);
