(function(ClassyJS, Member, _){
	
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
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Property = window.ClassyJS.Member.Property || {}
);
