(function(ClassyJS, Reflection, _){
	
	_.Class = function(className)
	{
		return _.call(this, className);
	};
	
	ClassyJS.Inheritance.makeChild(_.Class, _);
	Reflection.Class = _.Class;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.Reflection = window.Reflection || {},
	window.Reflection.Type = window.Reflection.Type || {}
);
