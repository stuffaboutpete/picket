(function(ClassyJS, _){
	
	_.ReflectionFactory = function(){};
	
	_.ReflectionFactory.prototype.buildClass = function(classInstance)
	{
		return new Reflection.Class(classInstance);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.TypeChecker = window.ClassyJS.TypeChecker || {}
);
