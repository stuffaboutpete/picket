;(function(ClassyJS, Member, Constant, _){
	
	var messages = {
		// NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		// SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood' 
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Member.Constant.Definition.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Constant = window.ClassyJS.Member.Constant || {},
	window.ClassyJS.Member.Constant.Definition = window.ClassyJS.Member.Constant.Definition || {}
);
