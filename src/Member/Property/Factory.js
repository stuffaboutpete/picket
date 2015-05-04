(function(Picket, Member, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(
		definition,
		isFromInterface,
		defaultValue,
		typeChecker,
		accessController
	)
	{
		return new _(definition, isFromInterface, defaultValue, typeChecker, accessController);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Property = window.Picket.Member.Property || {}
);
