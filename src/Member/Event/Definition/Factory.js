;(function(Picket, Member, Event, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {},
	window.Picket.Member.Event.Definition = window.Picket.Member.Event.Definition || {}
);
