;(function(ClassyJS, Reflection, _){
	
	var messages = {
		NON_STRING_TYPE_IDENTIFIER_SUPPLIED: 'The provided type identifier must be a string',
		NON_BOOLEAN_OPTIONAL_FLAG_SUPPLIED:
			'The provided flag indicating whether the argument is optional must be a boolean',
		UNEXPECTED_DEFAULT_PROVIDED:
			'A default value was provided even though it was ' +
			'indicated that the argument is not optional',
		INVALID_OWNER_TYPE_PROVIDED: 'The provided owner must be an object, function or string',
		NON_DEFAULT_RETRIEVED: 'A call was made to getDefaultValue when no default exists'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Argument.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Argument = window.ClassyJS.Reflection.Argument || {}
);
