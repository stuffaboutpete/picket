;(function(ClassyJS, _){
	
	var messages = {
		NON_FUNCTION_RETURNED_FROM_NAMESPACE_MANAGER:
			'Object returned from namespace manager was not a function as expected'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.Type.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.Type = window.ClassyJS.Reflection.Type || {}
);
