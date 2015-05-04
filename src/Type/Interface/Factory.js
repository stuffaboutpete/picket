(function(Picket, Type, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(definition)
	{
		return new _(definition);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Interface = window.Picket.Type.Interface || {}
);
