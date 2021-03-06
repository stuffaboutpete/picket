;(function(Picket, Registry, _){
	
	var messages = {
		NON_NAMESPACE_MANAGER_PROVIDED:
			'Instance of Picket.NamespaceManager must be provided to the constructor',
		NON_CLASS_OBJECT_PROVIDED:
			'Provided class object is not an instance of Picket.Type.Class',
		NON_STRING_INTERFACE_NAME_PROVIDED: 'Provided interface name is not a string',
		NON_CLASS_CONSTRUCTOR_PROVIDED: 'Provided class constructor is not a function',
		INVALID_CLASS_LOOKUP: 'Class object was looked up using a non instance or constructor',
		CLASS_ALREADY_REGISTERED: 'Provided class object is already registered',
		CLASS_NOT_REGISTERED: 'No class object could be found matching ' +
			'the provided constructor or instance',
		CHILD_CLASS_NOT_REGISTERED: 'No class object could be found matching ' +
			'the provided child class object',
		NON_EXISTENT_PARENT_REQUESTED:
			'A parent object, constructor or instance was requested where no association exists',
		NON_ARRAY_CLASS_INSTANCE_PROVIDED:
			'Class instance must be provided as array of parentally related instances',
		CLASS_INSTANCE_ALREADY_REGISTERED: 'The provided class instance is already registered',
		SINGLE_CLASS_INSTANCE_PROVIDED:
			'Class instance provided as single object instance; if there is no ' +
			'parental relationship, there is no need to register the instance.',
		NON_OBJECT_CLASS_INSTANCE_PROVIDED:
			'Provided class instance contains an entry that is not an object instance',
		INVALID_CLASS_HIERARCHY_INSTANCE_REGISTERED:
			'Provided class instance does not follow the class ' +
			'hierarchy already defined in the registry',
		INCOMPLETE_CLASS_HIERARCHY_INSTANCE_REGISTERED:
			'Provided class instance does not complete the class ' +
			'hierarchy already defined in the registry',
		NON_CLASS_CONSTRUCTOR_OR_INSTANCE_PROVIDED:
			'An argument which was neither class object, class ' +
			'constructor or class instance was provided',
		NON_CLASS_INSTANCE_PROVIDED: 'Provided argument is not a class instance',
		NON_STRING_PARENT_PROVIDED: 'The provided parent class name must be a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Registry.Type.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Registry = window.Picket.Registry || {},
	window.Picket.Registry.Type = window.Picket.Registry.Type || {}
);
