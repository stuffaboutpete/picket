;(function(ClassyJS, Member, Constant, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Constant = window.ClassyJS.Member.Constant || {},
	window.ClassyJS.Member.Constant.Definition = window.ClassyJS.Member.Constant.Definition || {}
);
