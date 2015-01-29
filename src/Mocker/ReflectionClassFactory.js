(function(ClassyJS, _){
	
	_.ReflectionClassFactory = function(){};
	
	_.ReflectionClassFactory.prototype.build = function(className)
	{
		return new Reflection.Class(className);
	};
	
})(window.ClassyJS = window.ClassyJS || {}, window.ClassyJS.Mocker = window.ClassyJS.Mocker || {});
