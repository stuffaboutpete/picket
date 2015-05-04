;(function(Picket, Member, _){
	
	var messages = {
		PROPERTY_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Property.Definition.Factory must be provided to the constructor',
		METHOD_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Method.Definition.Factory must be provided to the constructor',
		EVENT_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Event.Definition.Factory must be provided to the constructor',
		CONSTANT_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Member.Constant.Definition.Factory must be provided to the constructor',
		NON_STRING_SIGNATURE: 'Signature must be provided as a string',
		INVALID_SIGNATURE:
			'Provided signature could not be understood by any of ' +
			'the available member definition classes' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.DefinitionFactory.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.DefinitionFactory = window.Picket.Member.DefinitionFactory || {}
);
