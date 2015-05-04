;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED: 'Instance of Picket.Member.Constant.Definition must be provided',
		IS_FROM_INTERFACE:
			'Constants cannot be abstract and therefore cannot be declared within an interface',
		NO_TYPE_CHECKER_PROVIDED: 'Instance of Picket.TypeChecker must be provided',
		NO_ACCESS_CONTROLLER_PROVIDED: 'Instance of Picket.Access.Controller must be provided',
		INVALID_VALUE_TYPE: 'Value must be string, number or undefined',
		INVALID_VALUE: 'Provided value did not match constant type',
		NON_FUNCTION_TARGET_CONSTRUCTOR_PROVIDED:
			'Constructor provided as property owner must be a function',
		NON_OBJECT_ACCESS_INSTANCE_PROVIDED:
			'Instance provided as accessing property must be an object',
		INVALID_TYPE: 'Constant cannot be set to the provided type',
		ACCESS_NOT_ALLOWED: 'Provided object instance is not permitted to access the constant value'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Constant.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {}
);
