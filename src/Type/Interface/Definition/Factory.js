;(function(ClassyJS, Type, Interface, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Interface = window.ClassyJS.Type.Interface || {},
	window.ClassyJS.Type.Interface.Definition = window.ClassyJS.Type.Interface.Definition || {}
);
