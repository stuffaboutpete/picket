;(function(ClassyJS, Registry, _){
	
	var messages = {
		TYPE_REGISTRY_REQUIRED: 'Instance of ClassyJS.Registry.Type is required by constructor',
		TYPE_CHECKER_REQUIRED: 'Instance of ClassyJS.TypeChecker is required by constructor',
		NON_CLASS_INSTANCE_OR_CONSTRUCTOR_PROVIDED:
			'The provided call target was not an object instance or constructor',
		NON_STRING_METHOD_NAME_PROVIDED: 'The provided method name is not a string',
		NON_ARRAY_METHOD_ARGUMENTS_PROVIDED: 'The provided method arguments are not an array',
		TARGET_NOT_CLASS_OR_INTERFACE:
			'Object provided must be Type.Class or Type.Interface',
		PROPERTY_NOT_REGISTERED:
			'No property with the given name has been registered against the given type',
		PROPERTY_ALREADY_REGISTERED:
			'A property with the same name has already been registered against the given type',
		METHOD_NOT_REGISTERED:
			'No method with the given name and argument signature has been ' +
			'registered against the given type',
		METHOD_ALREADY_REGISTERED:
			'A method with the same name, argument signature and static setting has already ' +
			'been registered against the given type',
		EVENT_NOT_REGISTERED:
			'No event with the given name has been registered against the given type',
		EVENT_ALREADY_REGISTERED:
			'An event with the same name has already been registered against the given type',
		EVENT_TARGET_METHOD_NOT_REGISTERED:
			'The provided event target method does not exist',
		EVENT_BIND_NOT_PERMITTED: 'The event object did not indicate that the bind can be made',
		CONSTANT_NOT_REGISTERED:
			'No constant with the given name has been registered against the given type',
		CONSTANT_ALREADY_REGISTERED:
			'A constant with the same name has already been registered against the given type',
		CONSTANT_RETRIEVED_AGAINST_CLASS_INSTANCE:
			'A constant was requested using an instance of a class instead of its constructor'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Registry.Member.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Registry = window.ClassyJS.Registry || {},
	window.ClassyJS.Registry.Member = window.ClassyJS.Registry.Member || {}
);
