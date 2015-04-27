(function(ClassyJS, _){
	
	_.Event = function(classIdentifier, eventName)
	{
		
		if (typeof classIdentifier == 'string') {
			classIdentifier = ClassyJS._instantiator.getNamespaceManager().getNamespaceObject(
				classIdentifier
			);
		}
		
		if (typeof classIdentifier != 'function' && typeof classIdentifier != 'object') {
			throw new _.Event.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof classIdentifier
			);
		}
		
		if (typeof eventName != 'string') {
			throw new _.Event.Fatal(
				'NON_STRING_EVENT_NAME_PROVIDED',
				'Provided type: ' + typeof eventName
			);
		}
		
		if (!ClassyJS._instantiator.getTypeRegistry().classExists(classIdentifier)) {
			throw new _.Event.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = ClassyJS._instantiator.getTypeRegistry().getClass(classIdentifier);
		
		var members = _getMembers(this);
		
		for (var i = 0; i < members.length; i++) {
			
			if (members[i] instanceof ClassyJS.Member.Event
			&&  members[i].getName() == eventName) {
				this._eventObject = members[i];
				return;
			}
			
		}
		
		throw new _.Event.Fatal(
			'EVENT_DOES_NOT_EXIST',
			'Event name: ' + eventName
		);
		
	};
	
	_.Event.prototype.getName = function()
	{
		return this._eventObject.getName();
	};
	
	_.Event.prototype.getArguments = function()
	{
		var types = this._eventObject.getArgumentTypeIdentifiers();
		var reflectionArguments = [];
		for (var i = 0; i < types.length; i++) {
			reflectionArguments.push(ClassyJS._instantiator.getReflectionFactory().buildArgument(
				types[i],
				false,
				undefined,
				this
			));
		}
		return reflectionArguments;
	};
	
	_.Event.prototype.getAccessType = function()
	{
		return ClassyJS._instantiator.getReflectionFactory().buildAccessType(
			this._eventObject.getAccessTypeIdentifier()
		);
	};
	
	_.Event.prototype.getClass = function()
	{
		return ClassyJS._instantiator.getReflectionFactory().buildClass(
			this._classObject.getName()
		);
	};
	
	var _getMembers = function(_this)
	{
		return ClassyJS._instantiator.getMemberRegistry().getMembers(_this._classObject);
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Event = _.Event;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
