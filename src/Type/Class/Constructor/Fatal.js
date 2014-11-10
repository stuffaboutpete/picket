;(function(ClassyJS, Type, Class, _){
	
	var messages = {
		ABSTRACT_CLASS_CANNOT_BE_INSTANTIATED: 'Abstract class cannot be instantiated'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Type.Class.Constructor.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Class = window.ClassyJS.Type.Class || {},
	window.ClassyJS.Type.Class.Constructor = window.ClassyJS.Type.Class.Constructor || {}
);
