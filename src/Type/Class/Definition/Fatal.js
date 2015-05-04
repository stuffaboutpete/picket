;(function(Picket, Type, Class, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		MISSING_KEYWORD_CLASS:		'Signature does not contain keywork \'class\'',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Class.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {},
	window.Picket.Type.Class.Definition = window.Picket.Type.Class.Definition || {}
);
