;(function(Picket, Type, Interface, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Interface = window.Picket.Type.Interface || {},
	window.Picket.Type.Interface.Definition = window.Picket.Type.Interface.Definition || {}
);
