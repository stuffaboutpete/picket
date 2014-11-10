;(function(ClassyJS, Type, _){
	
	var messages = {
		CLASS_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Type.Class.Definition.Factory must be provided to the constructor',
		INTERFACE_DEFINITION_FACTORY_NOT_PROVIDED:
			'Instance of Type.Interface.Definition.Factory must be provided to the constructor',
		NON_STRING_SIGNATURE:			'Provided signature must be a string',
		AMBIGUOUS_SIGNATURE:			'Signature could not be identified as class or interface',
		FACTORY_RETURNED_NON_OBJECT:	'The selected downstream factory did not return an object'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Type.DefinitionFactory.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.DefinitionFactory = window.ClassyJS.Type.DefinitionFactory || {}
);
