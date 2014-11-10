;(function(ClassyJS, _){
	
	var messages = {
		NAMESPACE_OBJECT_DOES_NOT_EXIST: 'No object exists at the requested namespace location'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('NamespaceManager.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.NamespaceManager = window.ClassyJS.NamespaceManager || {}
);
