(function(Picket, _){
	
	_.Argument = function(typeIdentifier, isOptional, defaultValue, owner)
	{
		
		// @todo Possibly check the caller is a
		// member of the Reflection API as, as far
		// as I can imagine, it does not make sense
		// for client code to instantiate this class. 
		
		if (typeof typeIdentifier != 'string') {
			throw new _.Argument.Fatal(
				'NON_STRING_TYPE_IDENTIFIER_SUPPLIED',
				'Provided type: ' + typeof typeIdentifier
			);
		}
		
		if (typeof isOptional != 'boolean') {
			throw new _.Argument.Fatal(
				'NON_BOOLEAN_OPTIONAL_FLAG_SUPPLIED',
				'Provided type: ' + typeof isOptional
			);
		}
		
		if (!isOptional && typeof defaultValue != 'undefined') {
			throw new _.Argument.Fatal('UNEXPECTED_DEFAULT_PROVIDED');
		}
		
		if (['string', 'object', 'function'].indexOf(typeof owner) == -1) {
			throw new _.Argument.Fatal(
				'INVALID_OWNER_TYPE_PROVIDED',
				'Provided type: ' + typeof owner
			);
		}
		
		this._typeIdentifier = typeIdentifier;
		this._isOptional = isOptional;
		this._defaultValue = defaultValue;
		this._owner = owner;
		
	};
	
	_.Argument.prototype.getType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildType(this._typeIdentifier);
	};
	
	_.Argument.prototype.isOptional = function()
	{
		return this._isOptional;
	};
	
	_.Argument.prototype.hasDefaultValue = function()
	{
		return (this._defaultValue === undefined) ? false : true;
	};
	
	_.Argument.prototype.getDefaultValue = function()
	{
		if (this._defaultValue === undefined) throw new _.Argument.Fatal('NON_DEFAULT_RETRIEVED');
		return this._defaultValue;
	};
	
	_.Argument.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(this._owner);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Argument = _.Argument;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
