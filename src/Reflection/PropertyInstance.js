(function(ClassyJS, _){
	
	_.PropertyInstance = function(objectInstance, propertyName)
	{
		
		// Force an error if the
		// property is not valid
		ClassyJS._instantiator.getMemberRegistry().getPropertyValue(
			objectInstance,
			objectInstance,
			propertyName
		);
		
		this._objectInstance = objectInstance;
		this._name = propertyName;
		
	};
	
	_.PropertyInstance.prototype.getProperty = function()
	{
		return ClassyJS._instantiator.getReflectionFactory().buildProperty(
			this._objectInstance,
			this._name
		);
	};
	
	_.PropertyInstance.prototype.getValue = function()
	{
		return ClassyJS._instantiator.getMemberRegistry().getPropertyValue(
			this._objectInstance,
			this._objectInstance,
			this._name
		);
	};
	
	_.PropertyInstance.prototype.setValue = function(value)
	{
		ClassyJS._instantiator.getMemberRegistry().setPropertyValue(
			this._objectInstance,
			this._objectInstance,
			this._name,
			value
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.PropertyInstance = _.PropertyInstance;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
