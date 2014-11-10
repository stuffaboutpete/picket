;(function(ClassyJS, Member, Property, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Member.Property.Definition.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Property = window.ClassyJS.Member.Property || {},
	window.ClassyJS.Member.Property.Definition = window.ClassyJS.Member.Property.Definition || {}
);
