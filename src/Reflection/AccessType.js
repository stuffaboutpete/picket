(function(ClassyJS, _){
	
	_.AccessType = function(identifier)
	{
		// @todo Everything
		this._identifier = identifier;
	};
	
	_.AccessType.prototype.getIdentifier = function()
	{
		return this._identifier;
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.AccessType = _.AccessType;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
