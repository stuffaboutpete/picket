;(function(Picket, Member, Event, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = Picket.Fatal.getFatal('Member.Event.Definition.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {},
	window.Picket.Member.Event.Definition = window.Picket.Member.Event.Definition || {}
);
