;(function(ClassyJS, Reflection, _){
	
	var messages = {
		CLASS_DOES_NOT_EXIST: 'Provided object is not an instance of a valid class',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be an object instance'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.ClassInstance.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.ClassInstance = window.ClassyJS.Reflection.ClassInstance || {}
);
