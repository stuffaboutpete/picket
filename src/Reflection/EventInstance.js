(function(ClassyJS, _){
	
	_.EventInstance = function(objectInstance, eventName)
	{
		
		// @todo Check class exists (typeRegistry.classExists(objectInstance))
		
		var classObject = ClassyJS._instantiator.getTypeRegistry().getClass(objectInstance);
		
		var members = ClassyJS._instantiator.getMemberRegistry().getMembers(classObject);
		
		var eventExists = false;
		
		for (var i = 0; i < members.length; i++) {
			if (!(members[i] instanceof ClassyJS.Member.Event)) continue;
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
		return ClassyJS._instantiator.getReflectionFactory().buildEvent(
			this._objectInstance,
			this._name
		);
	};
	
	_.EventInstance.prototype.trigger = function()
	{
		ClassyJS._instantiator.getMemberRegistry().triggerEvent(
			this._objectInstance,
			this._name,
			Array.prototype.splice.call(arguments, 0, arguments.length)
		);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.EventInstance = _.EventInstance;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
