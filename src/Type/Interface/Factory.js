(function(ClassyJS, Type, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(definition)
	{
		return new _(definition);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Interface = window.ClassyJS.Type.Interface || {}
);
