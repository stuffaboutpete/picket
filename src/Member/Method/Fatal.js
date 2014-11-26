;(function(ClassyJS, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of ClassyJS.Member.Method.Definition must be provided',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of ClassyJS.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of ClassyJS.Access.Controller must be provided',
		UNDEFINED_ARGUMENT_TYPE: 'Arguments cannot be defined as type undefined',
		NULL_ARGUMENT_TYPE: 'Arguments cannot be defined as type null',
		NON_OBJECT_OR_CONSTRUCTOR_TARGET_PROVIDED:
			'Argument provided as property owner must be an object or constructor',
		NON_OBJECT_ACCESS_INSTANCE_PROVIDED:
			'Instance provided as accessing property must be an object',
		NON_ARRAY_ARGUMENTS_PROVIDED:
			'Provided arguments must be within array',
		ACCESS_NOT_ALLOWED:
			'Provided object instance is not permitted to call method',
		INVALID_ARGUMENTS: 'Provided arguments are not valid',
		INVALID_RETURN_VALUE: 'Returned value is not valid',
		UNEXPECTED_IMPLEMENTATION:
			'Abstract or interface method should not provide an implementation',
		NON_FUNCTION_IMPLEMENTATION: 'implementation must be provided as a function',
		INTERACTION_WITH_ABSTRACT: 'This instance cannot be called as it is abstract',
		NON_OBJECT_SCOPE_VARIABLES: 'Provided scope variables must be object'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Member.Method.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Method = window.ClassyJS.Member.Method || {}
);
