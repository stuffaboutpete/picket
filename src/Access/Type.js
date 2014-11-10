;(function(ClassyJS, _){
	
	_.Type = function(level)
	{
		if (typeof level != 'string') {
			throw new _.Type.Fatal('NON_STRING_IDENTIFIER');
		}
		if (['public', 'protected', 'private'].indexOf(level) == -1) {
			throw new _.Type.Fatal('INVALID_IDENTIFIER');
		}
		this._level = level;
	};
	
	_.Type.prototype.childAllowed = function()
	{
		return (this._level != 'private');
	};
	
	_.Type.prototype.allAllowed = function()
	{
		return (this._level == 'public');
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Access = window.ClassyJS.Access || {}
);
