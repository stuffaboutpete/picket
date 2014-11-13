(function(ClassyJS, Reflection, Member, _){
	
	_.Argument = function(identifier)
	{
		this._identifier = identifier;
	};
	
	_.Argument.prototype.getIdentifier = function()
	{
		return this._identifier;
	};
	
	Reflection.Method.Argument = _.Argument;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.Reflection = window.Reflection || {},
	window.Reflection.Member = window.Reflection.Member || {},
	window.Reflection.Member.Method = window.Reflection.Member.Method || {}
);
