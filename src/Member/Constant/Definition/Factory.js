;(function(Picket, Member, Constant, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {},
	window.Picket.Member.Constant.Definition = window.Picket.Member.Constant.Definition || {}
);
