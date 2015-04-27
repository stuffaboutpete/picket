;(function(ClassyJS, Reflection, _){
	
	var messages = {
		INSTANTIATION_BEFORE_DEPENDENCIES_INJECTED:
			'Class dependencies must be provided via \'acceptClassDependencies\' ' +
			'before any instance can be created',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_CONSTANT_NAME_PROVIDED: 'Provided constant name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		CONSTANT_DOES_NOT_EXIST:
			'Provided constant name and class identifier do not describe a valid constant',
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Constant.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Constant = window.ClassyJS.Reflection.Constant || {}
);
