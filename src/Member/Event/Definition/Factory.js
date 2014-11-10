;(function(ClassyJS, Member, Event, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.build = function(signature)
	{
		return new _(signature);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Event = window.ClassyJS.Member.Event || {},
	window.ClassyJS.Member.Event.Definition = window.ClassyJS.Member.Event.Definition || {}
);
