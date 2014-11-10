;(function(ClassyJS, Type, Class, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Class = window.ClassyJS.Type.Class || {},
	window.ClassyJS.Type.Class.Definition = window.ClassyJS.Type.Class.Definition || {}
);
