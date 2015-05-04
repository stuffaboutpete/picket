;(function(Picket, Member, Constant, _){
	
	var messages = {
		// NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		// SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Constant.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {},
	window.Picket.Member.Constant.Definition = window.Picket.Member.Constant.Definition || {}
);
