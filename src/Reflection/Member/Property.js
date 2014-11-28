(function(ClassyJS, Reflection, _){
	
	_.Property = function(identifier)
	{
		return _.call(this, identifier);
	};
	
	ClassyJS.Inheritance.makeChild(_.Property, _);
	
	Reflection.Property = _.Property;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.Reflection = window.Reflection || {},
	window.Reflection.Member = window.Reflection.Member || {}
);
