;(function(Picket, Member, Method, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Method = window.Picket.Member.Method || {},
	window.Picket.Member.Method.Definition = window.Picket.Member.Method.Definition || {}
);
