;(function(Picket, _){
	
	var messages = {
		NO_REFLECTION_FACTORY_PROVIDED:
			'An instance of Picket.TypeChecker.ReflectionFactory must be provided',
		NON_STRING_TYPE_IDENTIFIER: 'Provided type identifier must be a string',
		NON_ARRAY_VALUES: 'Provided values must be within an array',
		NON_ARRAY_TYPES: 'Provided type identifiers must be within an array',
		VALUE_TYPE_MISMATCH: 'Provided values must match length of provided type identifiers'
	};
	
	_.Fatal = Picket.Fatal.getFatal('TypeChecker.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.TypeChecker = window.Picket.TypeChecker || {}
);
