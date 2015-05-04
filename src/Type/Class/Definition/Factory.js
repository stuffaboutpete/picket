;(function(Picket, Type, Class, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {},
	window.Picket.Type.Class.Definition = window.Picket.Type.Class.Definition || {}
);
