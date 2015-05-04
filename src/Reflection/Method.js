(function(Picket, _){
	
	_.Method = function(classIdentifier, methodName)
	{
		
		if (typeof classIdentifier == 'string') {
			classIdentifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				classIdentifier
			);
		}
		
		if (typeof classIdentifier != 'function' && typeof classIdentifier != 'object') {
			throw new _.Method.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof classIdentifier
			);
		}
		
		if (typeof methodName != 'string') {
			throw new _.Method.Fatal(
				'NON_STRING_METHOD_NAME_PROVIDED',
				'Provided type: ' + typeof methodName
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(classIdentifier)) {
			throw new _.Method.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(classIdentifier);
		
		var members = _getMembers(this);
		
		for (var i = 0; i < members.length; i++) {
			
			if (members[i] instanceof Picket.Member.Method
			&&  members[i].getName() == methodName) {
				this._methodObject = members[i];
				return;
			}
			
		}
		
		throw new _.Method.Fatal(
			'METHOD_DOES_NOT_EXIST',
			'Method name: ' + methodName
		);
		
	};
	
	_.Method.prototype.getName = function()
	{
		return this._methodObject.getName();
	};
	
	_.Method.prototype.getAccessType = function()
	{
		return Picket._instantiator.getReflectionFactory().buildAccessType(
			this._methodObject.getAccessTypeIdentifier()
		);
	};
	
	_.Method.prototype.getArguments = function()
	{
		var types = this._methodObject.getArgumentTypeIdentifiers();
		var reflectionArguments = [];
		for (var i = 0; i < types.length; i++) {
			var isOptional = this._methodObject.argumentIsOptional(i);
			reflectionArguments.push(Picket._instantiator.getReflectionFactory().buildArgument(
				types[i],
				isOptional,
				isOptional ? this._methodObject.getDefaultArgumentValue(i) : undefined,
				this
			));
		}
		return reflectionArguments;
	};
	
	_.Method.prototype.getClass = function()
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
	window.Reflection.Method = _.Method;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
