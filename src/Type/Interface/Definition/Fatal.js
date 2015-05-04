;(function(Picket, Type, Interface, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		MISSING_KEYWORD_INTERFACE:	'Signature does not contain keywork \'interface\'',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Interface.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Interface = window.Picket.Type.Interface || {},
	window.Picket.Type.Interface.Definition = window.Picket.Type.Interface.Definition || {}
);
