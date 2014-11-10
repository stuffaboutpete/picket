(function(ClassyJS, Member, _){
	
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
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Event = window.ClassyJS.Member.Event || {}
);
