;(function(ClassyJS, Type, _){
	
	var messages = {
		NO_DEFINITION_FACTORY_PROVIDED:
			'No instance of ClassyJS.Type.DefinitionFactory was provided to the constructor',
		NO_CLASS_FACTORY_PROVIDED:
			'No instance of ClassyJS.Type.Class.Factory was provided to the constructor',
		NO_INTERFACE_FACTORY_PROVIDED:
			'No instance of ClassyJS.Type.Interface.Factory was provided to the constructor',
		NO_TYPE_REGISTRY_PROVIDED:
			'No instance of ClassyJS.Registry.Type was provided to the constructor',
		NO_MEMBER_REGISTRY_PROVIDED:
			'No instance of ClassyJS.Registry.Member was provided to the constructor',
		NO_NAMESPACE_MANAGER_PROVIDED:
			'No instance of ClassyJS.NamespaceManager was provided to the constructor',
		NON_STRING_SIGNATURE_PROVIDED: 'Provided signature must be a string',
		EMPTY_STRING_SIGNATURE_PROVIDED: 'Provided signature must not be an empty string',
		NON_DEFINITION_RETURNED_FROM_FACTORY:
			'Provided definition factory did not return an instance of ' +
			'ClassyJS.Type.Class.Definition or ClassyJS.Type.Interface.Definition',
		NON_CLASS_RETURNED_FROM_FACTORY:
			'Provided class factory did not return an instance of ClassyJS.Type.Class',
		NON_INTERFACE_RETURNED_FROM_FACTORY:
			'Provided interface factory did not return an instance of ClassyJS.Type.Interface'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Type.Factory.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Factory = window.ClassyJS.Type.Factory || {}
);
