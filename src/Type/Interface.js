(function(Picket, _){
	
	_.Interface = function(definition)
	{
		this._definition = definition;
	};
	
	_.Interface.prototype.getName = function()
	{
		return this._definition.getName();
	}
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {}
);
