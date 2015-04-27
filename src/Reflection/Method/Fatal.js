;(function(ClassyJS, Reflection, _){
	
	var messages = {
		INSTANTIATION_BEFORE_DEPENDENCIES_INJECTED:
			'Class dependencies must be provided via \'acceptClassDependencies\' ' +
			'before any instance can be created',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_METHOD_NAME_PROVIDED: 'Provided method name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		METHOD_DOES_NOT_EXIST:
			'Provided method name and class identifier do not describe a valid method'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Method.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Method = window.ClassyJS.Reflection.Method || {}
);
