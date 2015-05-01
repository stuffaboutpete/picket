(function(ClassyJS, _){
	
	_.ClassInstance = function(instance)
	{
		
		if (typeof instance != 'object') {
			throw new _.ClassInstance.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof instance
			);
		}
		
		if (!ClassyJS._instantiator.getTypeRegistry().classExists(instance)) {
			throw new _.ClassInstance.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._instance = instance;
		
	};
	
	_.ClassInstance.prototype.getClass = function()
	{
		return ClassyJS._instantiator.getReflectionFactory().buildClass(this._instance);
	};
	
	_.ClassInstance.prototype.getMemberInstances = function()
	{
		return _convertToReflectionMembers(this, _getMembers(this));
	};
	
	_.ClassInstance.prototype.getPropertyInstances = function()
	{
		return _getFilteredMembers(this, ClassyJS.Member.Property);
	};
	
	_.ClassInstance.prototype.getPropertyInstance = function(name)
	{
		// @todo Ensure name is a string or undefined
		var propertiesArray = _getFilteredMembers(this, ClassyJS.Member.Property, name);
		// @todo Throw if length is not 1
		return propertiesArray[0];
	};
	
	_.ClassInstance.prototype.getMethodInstances = function(name)
	{
		return _getFilteredMembers(this, ClassyJS.Member.Method, name);
	};
	
	_.ClassInstance.prototype.getEventInstances = function()
	{
		return _getFilteredMembers(this, ClassyJS.Member.Event);
	};
	
	_.ClassInstance.prototype.getEventInstance = function(name)
	{
		// @todo Ensure name is a string or undefined
		var eventsArray =  _getFilteredMembers(this, ClassyJS.Member.Event, name);
		// @todo Throw if length is not 1
		return eventsArray[0];
	};
	
	var _getMembers = function(_this)
	{
		var classObject = ClassyJS._instantiator.getTypeRegistry().getClass(_this._instance);
		return ClassyJS._instantiator.getMemberRegistry().getMembers(classObject);
	};
	
	var _getFilteredMembers = function(_this, type, name)
	{
		return _convertToReflectionMembers(
			_this,
			_filterByName(
				_this,
				name,
				_filterByType(
					_this,
					type,
					_getMembers(_this)
				)
			)
		);
	};
	
	var _filterByType = function(_this, type, members)
	{
		if (!type) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof type) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	_filterByName = function(_this, name, members)
	{
		if (!name) return members;
		var filteredMembers = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i].getName() == name) filteredMembers.push(members[i]);
		}
		return filteredMembers;
	};
	
	var _convertToReflectionMembers = function(_this, members)
	{
		var reflectionMembers = [];
		var factory = ClassyJS._instantiator.getReflectionFactory();
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof ClassyJS.Member.Property) {
				reflectionMembers.push(factory.buildPropertyInstance(
					_this._instance,
					members[i].getName()
				));
			} else if (members[i] instanceof ClassyJS.Member.Method) {
				reflectionMembers.push(factory.buildMethodInstance(
					_this._instance,
					members[i].getName()
				));
			} else if (members[i] instanceof ClassyJS.Member.Event) {
				reflectionMembers.push(factory.buildEventInstance(
					_this._instance,
					members[i].getName()
				));
			} else {
				continue;
			}
		}
		return reflectionMembers;
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.ClassInstance = _.ClassInstance;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
