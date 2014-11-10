(function(ClassyJS, _){
	
	_.Interface = function(definition)
	{
		this._definition = definition;
	};
	
	_.Interface.prototype.getName = function()
	{
		return this._definition.getName();
	}
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {}
);
