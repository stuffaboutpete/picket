;(function(ClassyJS, _){
	
	var messages = {
		NON_OBJECT_CLASS_MEMBERS:		'Provided class members must be defined as object',
		NON_ARRAY_INTERFACE_MEMBERS:	'Provided interface members must be defined as array'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Main.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Main = window.ClassyJS.Main || {}
);
