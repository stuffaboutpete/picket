;(function(Picket, Member, Property, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {},
	window.Picket.Member.Property.Definition = window.Picket.Member.Property.Definition || {}
);
