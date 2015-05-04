;(function(Picket, Reflection, _){
	
	var messages = {
		INVALID_IDENTIFIER_PROVIDED: 'Class identifier must be a string, function or object',
		NON_STRING_PROPERTY_NAME_PROVIDED: 'Provided property name must be a string',
		CLASS_DOES_NOT_EXIST: 'Provided identifier does not describe a valid class',
		PROPERTY_DOES_NOT_EXIST:
			'Provided property name and class identifier do not describe a valid property',
		UNDEFINED_DEFAULT_VALUE_REQUESTED:
			'A call was made to \'getDefaultValue\' when no default value exists'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.Property.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.Property = window.Picket.Reflection.Property || {}
);
