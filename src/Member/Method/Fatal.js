;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of Picket.Member.Method.Definition must be provided',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of Picket.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of Picket.Access.Controller must be provided',
		UNDEFINED_ARGUMENT_TYPE: 'Arguments cannot be defined as type undefined',
		NULL_ARGUMENT_TYPE: 'Arguments cannot be defined as type null',
		NON_OBJECT_OR_CONSTRUCTOR_TARGET_PROVIDED:
			'Argument provided as property owner must be an object or constructor',
		NON_OBJECT_OR_CONSTRUCTOR_LOCAL_TARGET_PROVIDED:
			'Argument provided as property local owner must be an object or constructor',
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
		NON_OBJECT_SCOPE_VARIABLES: 'Provided scope variables must be object',
		NON_ABSTRACT_METHOD_DECLARED_WITH_NO_ARGUMENT_TYPES:
			'Any method declared without argument types must be abstract'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Method.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {}
);
