;(function(ClassyJS, Reflection, _){
	
	var messages = {
		INSTANTIATION_BEFORE_DEPENDENCIES_INJECTED:
			'Class dependencies must be provided via \'acceptClassDependencies\' ' +
			'before any instance can be created',
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_EVENT_NAME_PROVIDED: 'Provided event name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		EVENT_DOES_NOT_EXIST:
			'Provided event name and class identifier do not describe a valid event'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Event.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Event = window.ClassyJS.Reflection.Event || {}
);
