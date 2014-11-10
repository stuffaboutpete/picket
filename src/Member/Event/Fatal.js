;(function(ClassyJS, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of ClassyJS.Member.Event.Definition must be provided',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of ClassyJS.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of ClassyJS.Access.Controller must be provided',
		INVALID_VALUE_PROVIDED: 'Event value must be undefined, null or empty string',
		UNDEFINED_ARGUMENT_TYPE: 'Arguments cannot be defined as type undefined',
		NULL_ARGUMENT_TYPE: 'Arguments cannot be defined as type null',
		NON_OBJECT_TARGET_INSTANCE_PROVIDED:
			'Instance provided as property owner must be an object',
		NON_OBJECT_ACCESS_INSTANCE_PROVIDED:
			'Instance provided as accessing property must be an object',
		ACCESS_NOT_ALLOWED:
			'Provided object instance is not permitted to execute the requested behaviour',
		NON_ARRAY_CALLBACKS_PROVIDED: 'Provided method callbacks are not provided within an array',
		NON_ARRAY_CALLBACK_PROVIDED: 'Provided method callback is not provided as an array',
		NON_OBJECT_CALLBACK_INSTANCE: 'Provided callback object instance is not an object',
		INVALID_CALLBACK_METHOD:
			'Provided callback method is not instance of ClassyJS.Member.Method',
		NON_ARRAY_ARGUMENTS_PROVIDED: 'Provided arguments are not provided within an array',
		INVALID_ARGUMENTS: 'The method arguments provided to trigger are not valid',
		INTERACTION_WITH_ABSTRACT: 'This instance cannot be bound or triggered as it is abstract'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Member.Event.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Event = window.ClassyJS.Member.Event || {}
);
