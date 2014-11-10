;(function(ClassyJS, Access, _){
	
	var messages = {
		NON_STRING_IDENTIFIER:	'Provided identifier must be a string',
		INVALID_IDENTIFIER:		'Provided identifier must be one of ' +
			'\'public\', \'protected\' or \'private\''
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Access.Type.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Access = window.ClassyJS.Access || {},
	window.ClassyJS.Access.Type = window.ClassyJS.Access.Type || {}
);
