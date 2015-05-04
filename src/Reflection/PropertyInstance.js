(function(Picket, _){
	
	_.PropertyInstance = function(objectInstance, propertyName)
	{
		
		// Force an error if the
		// property is not valid
		Picket._instantiator.getMemberRegistry().getPropertyValue(
			objectInstance,
			objectInstance,
			propertyName
		);
		
		this._objectInstance = objectInstance;
		this._name = propertyName;
		
	};
	
	_.PropertyInstance.prototype.getProperty = function()
	{
		return Picket._instantiator.getReflectionFactory().buildProperty(
			this._objectInstance,
			this._name
		);
	};
	
	_.PropertyInstance.prototype.getValue = function()
	{
		return Picket._instantiator.getMemberRegistry().getPropertyValue(
			this._objectInstance,
			this._objectInstance,
			this._name
		);
	};
	
	_.PropertyInstance.prototype.setValue = function(value)
	{
		Picket._instantiator.getMemberRegistry().setPropertyValue(
			this._objectInstance,
			this._objectInstance,
			this._name,
			value
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.PropertyInstance = _.PropertyInstance;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
