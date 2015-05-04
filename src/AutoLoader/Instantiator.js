(function(Picket, _){
	
	_.Instantiator = function(){};
	
	_.Instantiator.prototype.instantiate = function(constructor)
	{
		return new constructor();
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.AutoLoader = window.Picket.AutoLoader || {}
);
