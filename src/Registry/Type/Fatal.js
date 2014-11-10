;(function(ClassyJS, Registry, _){
	
	var messages = {
		NON_CLASS_OBJECT_PROVIDED:
			'Provided class object is not an instance of ClassyJS.Type.Class',
		NON_INTERFACE_OBJECT_PROVIDED:
			'Provided interface object is not an instance of ClassyJS.Type.Interface',
		NON_CLASS_CONSTRUCTOR_PROVIDED: 'Provided class constructor is not a function',
		INVALID_CLASS_LOOKUP: 'Class object was looked up using a non instance or constructor',
		CLASS_ALREADY_REGISTERED: 'Provided class object is already registered',
		CLASS_NOT_REGISTERED: 'No class object could be found matching ' +
			'the provided constructor or instance',
		PARENT_CLASS_NOT_REGISTERED: 'No class object could be found matching ' +
			'the provided parent class object',
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
		NON_CLASS_INSTANCE_PROVIDED: 'Provided argument is not a class instance'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Registry.Type.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Registry = window.ClassyJS.Registry || {},
	window.ClassyJS.Registry.Type = window.ClassyJS.Registry.Type || {}
);
