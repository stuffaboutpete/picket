(function(Picket, Member, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(
		definition,
		isFromInterface,
		value,
		typeChecker,
		accessController
	)
	{
		return new _(definition, isFromInterface, value, typeChecker, accessController);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Event = window.Picket.Member.Event || {}
);
