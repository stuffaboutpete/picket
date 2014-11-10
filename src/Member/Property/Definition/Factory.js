;(function(ClassyJS, Member, Property, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Property = window.ClassyJS.Member.Property || {},
	window.ClassyJS.Member.Property.Definition = window.ClassyJS.Member.Property.Definition || {}
);
