(function(Picket, Type, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(definition, typeRegistry, memberRegistry, namespaceManager)
	{
		return new _(definition, typeRegistry, memberRegistry, namespaceManager);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {}
);
