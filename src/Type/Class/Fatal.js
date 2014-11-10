;(function(ClassyJS, Type, _){
	
	var messages = {
		NO_DEFINITION_PROVIDED:
			'An instance of ClassyJS.Type.Class.Definition must be provided to the constructor',
		NO_TYPE_REGISTRY_PROVIDED:
			'An instance of ClassyJS.Registry.Type must be provided to the constructor',
		NO_MEMBER_REGISTRY_PROVIDED:
			'An instance of ClassyJS.Registry.Member must be provided to the constructor',
		NO_NAMESPACE_MANAGER_PROVIDED:
			'An instance of ClassyJS.NamespaceManager must be provided to the constructor',
		NO_PARENT_CLASS_RELATIONSHIP:
			'Parent class was requested when no parent relationship exists',
		CANNOT_INSTANTIATE_ABSTRACT_CLASS:
			'Cannot instantiate a class marked explicitly as abstract',
		CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS:
			'Cannot instantiate a class which contains abstract members',
		CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS:
			'Cannot instantiate a class with unimplemented interface members'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Type.Class.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Class = window.ClassyJS.Type.Class || {}
);
