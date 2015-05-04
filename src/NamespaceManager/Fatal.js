;(function(Picket, _){
	
	var messages = {
		NAMESPACE_OBJECT_DOES_NOT_EXIST: 'No object exists at the requested namespace location'
	};
	
	_.Fatal = Picket.Fatal.getFatal('NamespaceManager.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.NamespaceManager = window.Picket.NamespaceManager || {}
);
