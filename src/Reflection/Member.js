(function(_){
	
	_.Member = function(identifier)
	{
		this._memberObject = identifier;
	};
	
	_.Member.acceptClassDependencies = function(memberRegistry)
	{
		_.Member._memberRegistry = memberRegistry;
	};
	
	
	_.Member.prototype.getName = function()
	{
		return this._memberObject.getName();
	};
	
})(window.Reflection = window.Reflection || {});
