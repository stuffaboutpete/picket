(function(Picket, _){
	
	_.Property = function(classIdentifier, propertyName)
	{
		
		if (typeof classIdentifier == 'string') {
			classIdentifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				classIdentifier
			);
		}
		
		if (typeof classIdentifier != 'function' && typeof classIdentifier != 'object') {
			throw new _.Property.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof classIdentifier
			);
		}
		
		if (typeof propertyName != 'string') {
			throw new _.Property.Fatal(
				'NON_STRING_PROPERTY_NAME_PROVIDED',
				'Provided type: ' + typeof propertyName
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(classIdentifier)) {
			throw new _.Property.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(classIdentifier);
		
		var members = _getMembers(this);
		
		for (var i = 0; i < members.length; i++) {
			
			if (members[i] instanceof Picket.Member.Property
			&&  members[i].getName() == propertyName) {
				this._propertyObject = members[i];
				return;
			}
			
		}
		
		throw new _.Property.Fatal(
			'PROPERTY_DOES_NOT_EXIST',
			'Property name: ' + propertyName
		);
		
	};
	
	_.Property.prototype.getName = function()
	{
		return this._propertyObject.getName();
	};
	
	_.Property.prototype.getType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildType(
			this._propertyObject.getTypeIdentifier()
		);
	};
	
	_.Property.prototype.getAccessType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildAccessType(
			this._propertyObject.getAccessTypeIdentifier()
		);
	};
	
	_.Property.prototype.hasDefaultValue = function()
	{
		try {
			this.getDefaultValue();
		} catch (error) {
			if (!(error instanceof _.Property.Fatal)
			||  error.code != 'UNDEFINED_DEFAULT_VALUE_REQUESTED') {
				throw error;
			}
			return false;
		}
		return true;
	};
	
	_.Property.prototype.getDefaultValue = function()
	{
		var defaultValue = this._propertyObject.getDefaultValue();
		if (defaultValue === null) throw new _.Property.Fatal('UNDEFINED_DEFAULT_VALUE_REQUESTED');
		return defaultValue;
	};
	
	_.Property.prototype.getClass = function()
	{
		return Picket._instantiator.getReflectionFactory().buildClass(
			this._classObject.getName()
		);
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._classObject);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Property = _.Property;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
