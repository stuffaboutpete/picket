;(function(Picket, Member, _){
	
	var messages = {
		NO_DEFINITION_FACTORY_PROVIDED:
			'No instance of Picket.Member.DefinitionFactory was provided to the constructor',
		NO_PROPERTY_FACTORY_PROVIDED:
			'No instance of Picket.Member.Property.Factory was provided to the constructor',
		NO_METHOD_FACTORY_PROVIDED:
			'No instance of Picket.Member.Method.Factory was provided to the constructor',
		NO_EVENT_FACTORY_PROVIDED:
			'No instance of Picket.Member.Event.Factory was provided to the constructor',
		NO_CONSTANT_FACTORY_PROVIDED:
			'No instance of Picket.Member.Constant.Factory was provided to the constructor',
		NO_TYPE_CHECKER_PROVIDED:
			'No instance of Picket.TypeChecker was provided to the constructor',
		NO_ACCESS_CONTROLLER_PROVIDED:
			'No instance of Picket.Access.Controller was provided to the constructor',
		NON_STRING_SIGNATURE_PROVIDED: 'Provided signature must be a string',
		EMPTY_STRING_SIGNATURE_PROVIDED: 'Provided signature must not be an empty string',
		NON_BOOLEAN_INTERFACE_INDICATOR_PROVIDED:
			'Argument provided to indicate whether the member is defined ' +
			'within an interface must be a boolean',
		NON_DEFINITION_RETURNED_FROM_FACTORY:
			'Provided definition factory did not return a member definition object',
		NON_PROPERTY_RETURNED_FROM_FACTORY:
			'Provided property factory did not return an instance of Picket.Member.Property',
		NON_METHOD_RETURNED_FROM_FACTORY:
			'Provided method factory did not return an instance of Picket.Member.Method',
		NON_EVENT_RETURNED_FROM_FACTORY:
			'Provided event factory did not return an instance of Picket.Member.Event',
		NON_CONSTANT_RETURNED_FROM_FACTORY:
			'Provided constant factory did not return an instance of Picket.Member.Constant'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Factory.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Factory = window.Picket.Member.Factory || {}
);
