;(function(Picket, Member, Property, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Property.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {},
	window.Picket.Member.Property.Definition = window.Picket.Member.Property.Definition || {}
);
