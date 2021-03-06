;(function(Picket, _){
	
	var messages = {
		INCLUDER_NOT_PROVIDED: 'An includer must be provided',
		INSTANTIATOR_NOT_PROVIDED:
			'Instance of Picket.AutoLoader.Instantiator must be provided',
		NAMESPACE_MANAGER_NOT_PROVIDED: 'Instance of Picket.NamespaceManager must be provided',
		MEMBER_REGISTRY_NOT_PROVIDED: 'Instance of Picket.Registry.Member must be provided',
		ALREADY_RUNNING: 'Cannot start a new loading session whilst one is already running',
		NOT_RUNNING: 'Cannot continue a loading session whilst not running',
		SCRIPT_NOT_LOADED: 'A required script could not be loaded',
		CLASS_NOT_FOUND: 'An identified class script did not contain the expected class',
		NON_STRING_CLASS_NAME: 'A provided class name was not a string'
	};
	
	_.Fatal = Picket.Fatal.getFatal('AutoLoader.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.AutoLoader = window.Picket.AutoLoader || {}
);
