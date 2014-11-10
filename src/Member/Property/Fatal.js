;(function(ClassyJS, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of ClassyJS.Member.Property.Definition must be provided',
		PROPERTY_CANNOT_BE_DEFINED_BY_INTERFACE:
			'Constructor argument indicated that this property was defined ' +
			'within an interface. Properties cannot be defined within interfaces',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of ClassyJS.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of ClassyJS.Access.Controller must be provided',
		INVALID_DEFAULT_VALUE:
			'Value provided as default does not match type specified in the property signature',
		NO_DEFAULT_VALUE_PROVIDED:
			'Valid default value or null must be provided',
		NON_OBJECT_TARGET_INSTANCE_PROVIDED:
			'Instance provided as property owner must be an object',
		NON_OBJECT_ACCESS_INSTANCE_PROVIDED:
			'Instance provided as accessing property must be an object',
		ACCESS_NOT_ALLOWED:
			'Provided object instance is not permitted to execute the requested behaviour',
		INVALID_TYPE: 'Property cannot be set to the provided type'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Member.Property.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Property = window.ClassyJS.Member.Property || {}
);
