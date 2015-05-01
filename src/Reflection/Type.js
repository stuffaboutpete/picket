(function(ClassyJS, _){
	
	_.Type = function(identifier)
	{
		
		if (typeof identifier != 'string') {
			throw new _.Type.Fatal(
				'NON_STRING_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof identifier
			);
		}
		
		this._identifier = identifier;
		
	};
	
	_.Type.prototype.getIdentifier = function()
	{
		return this._identifier;
	};
	
	_.Type.prototype.isValidValue = function(value)
	{
		return ClassyJS._instantiator.getTypeChecker().isValidType(value, this._identifier);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Type = _.Type;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
