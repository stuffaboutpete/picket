;(function(ClassyJS, Access, _){
	
	var messages = {
		NO_TYPE_REGISTRY_PROVIDED:
			'An instance of ClassyJS.Registry.Type must be provided to the constructor',
		TARGET_NOT_INSTANCE_OR_CONSTRUCTOR:
			'Provided target object should either be an object instance or constructor function',
		ACCESS_OBJECT_NOT_INSTANCE_OR_CONSTRUCTOR_OR_UNDEFINED:
			'Provided access object must be a class instance or constructor or undefined',
		ACCESS_IDENTIFIER_NOT_STRING: 'Provided access identifier must be a string',
		ACCESS_IDENTIFIER_NOT_VALID_STRING:
			'Provided access identifier must be one of the ' +
			'strings \'public\', \'private\' or \'protected\''
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Access.Controller.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Access = window.ClassyJS.Access || {},
	window.ClassyJS.Access.Controller = window.ClassyJS.Access.Controller || {}
);
