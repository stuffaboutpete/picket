;(function(ClassyJS, _){
	
	var messages = {
		NON_NAMESPACE_MANAGER_PROVIDED:
			'Instance of ClassyJS.NamespaceManager must be provided to the constructor',
		NON_REFLECTION_CLASS_FACTORY_PROVIDED:
			'Instance of ClassyJS.Mocker.ReflectionClassFactory ' +
			'must be provided to the constructor',
		NON_STRING_CLASS_NAME_PROVIDED: 'Class name provided must be a string',
		NON_FUNCTION_RETURNED_FROM_NAMESPACE_MANAGER:
			'Object returned from namespace manager was not a function as expected'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Mocker.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Mocker = window.ClassyJS.Mocker || {}
);
