;(function(ClassyJS, Member, Method, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Member.Method.Definition.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Method = window.ClassyJS.Member.Method || {},
	window.ClassyJS.Member.Method.Definition = window.ClassyJS.Member.Method.Definition || {}
);
