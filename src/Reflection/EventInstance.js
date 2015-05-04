(function(Picket, _){
	
	_.EventInstance = function(objectInstance, eventName)
	{
		
		// @todo Check class exists (typeRegistry.classExists(objectInstance))
		
		var classObject = Picket._instantiator.getTypeRegistry().getClass(objectInstance);
		
		var members = Picket._instantiator.getMemberRegistry().getMembers(classObject);
		
		var eventExists = false;
		
		for (var i = 0; i < members.length; i++) {
			if (!(members[i] instanceof Picket.Member.Event)) continue;
			if (members[i].getName() == eventName) {
				eventExists = true;
				break;
			}
		}
		
		if (!eventExists) {
			throw new _.EventInstance.Fatal(
				'EVENT_DOES_NOT_EXIST',
				'Event name: ' + eventName
			);
		}
		
		this._objectInstance = objectInstance;
		this._name = eventName;
		
	};
	
	_.EventInstance.prototype.getEvent = function()
	{
		return Picket._instantiator.getReflectionFactory().buildEvent(
			this._objectInstance,
			this._name
		);
	};
	
	_.EventInstance.prototype.trigger = function()
	{
		Picket._instantiator.getMemberRegistry().triggerEvent(
			this._objectInstance,
			this._name,
			Array.prototype.splice.call(arguments, 0, arguments.length)
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.EventInstance = _.EventInstance;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
