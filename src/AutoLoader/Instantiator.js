(function(ClassyJS, _){
	
	_.Instantiator = function(){};
	
	_.Instantiator.prototype.instantiate = function(constructor)
	{
		return new constructor();
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.AutoLoader = window.ClassyJS.AutoLoader || {}
);
