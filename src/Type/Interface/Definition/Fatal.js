;(function(ClassyJS, Type, Interface, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		MISSING_KEYWORD_INTERFACE:	'Signature does not contain keywork \'interface\'',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Type.Interface.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Interface = window.ClassyJS.Type.Interface || {},
	window.ClassyJS.Type.Interface.Definition = window.ClassyJS.Type.Interface.Definition || {}
);
