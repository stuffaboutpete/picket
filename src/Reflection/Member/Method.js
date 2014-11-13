(function(ClassyJS, Reflection, _){
	
	_.Method = function(identifier)
	{
		return _.call(this, identifier);
	};
	
	ClassyJS.Inheritance.makeChild(_.Method, _);
	
	_.Method.prototype.getArguments = function()
	{
		var arguments = [];
		var argumentIdentifiers = this._memberObject.getArgumentTypes();
		for (var i in argumentIdentifiers) {
			arguments.push(new Reflection.Method.Argument(argumentIdentifiers[i]));
		}
		return arguments;
	};
	
	Reflection.Method = _.Method;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.Reflection = window.Reflection || {},
	window.Reflection.Member = window.Reflection.Member || {}
);
