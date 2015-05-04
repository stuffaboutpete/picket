(function(Picket, _){
	
	_.ReflectionFactory = function(){};
	
	_.ReflectionFactory.prototype.buildClass = function(classInstance)
	{
		return new Reflection.Class(classInstance);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.TypeChecker = window.Picket.TypeChecker || {}
);
