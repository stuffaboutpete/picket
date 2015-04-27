;(function(ClassyJS, Reflection, _){
	
	var messages = {
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Class.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Class = window.ClassyJS.Reflection.Class || {}
);
