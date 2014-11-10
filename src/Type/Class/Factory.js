(function(ClassyJS, Type, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(definition, typeRegistry, memberRegistry, namespaceManager)
	{
		return new _(definition, typeRegistry, memberRegistry, namespaceManager);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Class = window.ClassyJS.Type.Class || {}
);
