;(function(Picket, Member, Method, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood',
		INVALID_ARGUMENT_ORDER:
			'Optional method arguments must be defined after non-optional arguments',
		INVALID_ARGUMENT_DEFAULT:
			'The provided default value for an optional argument is not valid',
		UNDECLARED_ARGUMENT_TYPES_REQUESTED: 'No argument types have been provided'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Method.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {},
	window.Picket.Member.Method.Definition = window.Picket.Member.Method.Definition || {}
);
