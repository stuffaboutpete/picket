;(function(ClassyJS, Type, Class, _){
	
	var messages = {
		NON_STRING_SIGNATURE:		'Signature must be provided as a string',
		MISSING_KEYWORD_CLASS:		'Signature does not contain keywork \'class\'',
		SIGNATURE_NOT_RECOGNISED:	'Provided signature could not be understood'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Type.Class.Definition.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Class = window.ClassyJS.Type.Class || {},
	window.ClassyJS.Type.Class.Definition = window.ClassyJS.Type.Class.Definition || {}
);
