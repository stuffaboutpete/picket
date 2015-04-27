;(function(ClassyJS, Reflection, _){
	
	var messages = {
		METHOD_DOES_NOT_EXIST:
			'Provided method name and class instance do not describe a valid method'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.MethodInstance.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.MethodInstance = window.ClassyJS.Reflection.MethodInstance || {}
);
