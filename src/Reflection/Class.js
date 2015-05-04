(function(Picket, _){
	
	// @todo propertyExists, methodExists, etc
	
	_.Class = function(identifier)
	{
		
		if (typeof identifier == 'string') {
			identifier = Picket._instantiator.getNamespaceManager().getNamespaceObject(
				identifier
			);
		}
		
		if (typeof identifier != 'function' && typeof identifier != 'object') {
			throw new _.Class.Fatal(
				'INVALID_IDENTIFIER_PROVIDED',
				'Provided type: ' + typeof identifier
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().classExists(identifier)) {
			throw new _.Class.Fatal('CLASS_DOES_NOT_EXIST');
		}
		
		this._classObject = Picket._instantiator.getTypeRegistry().getClass(identifier);
		
	};
	
	_.Class.prototype.getName = function()
	{
		return this._classObject.getName();
	};
	
	_.Class.prototype.hasParent = function()
	{
		return this._classObject.isExtension();
	};
	
	_.Class.prototype.getParent = function()
	{
		var parentClassName = this._classObject.getParentClass();
		return Picket._instantiator.getReflectionFactory().buildClass(parentClassName);
	};
	
	_.Class.prototype.getInterfaces = function()
	{
		var interfaceNames = this._classObject.getInterfaces();
		var reflectionInterfaces = [];
		for (var i = 0; i < interfaceNames.length; i++) {
			reflectionInterfaces.push(
				Picket._instantiator.getReflectionFactory().buildInterface(interfaceNames[i])
			);
		}
		return reflectionInterfaces;
	};
	
	_.Class.prototype.implementsInterface = function(interfaceName)
	{
		var interfaces = Picket._instantiator.getTypeRegistry().getInterfacesFromClass(
			this._classObject
		);
		for (var i = 0; i < interfaces.length; i++) {
			if (interfaces[i] === interfaceName || interfaces[i].getName() === interfaceName) {
				return true;
			}
		}
		return false;
	};
	
	_.Class.prototype.getMembers = function()
	{
		return _convertToReflectionMembers(this, _getMembers(this));
	};
	
	_.Class.prototype.getProperties = function()
	{
		return _getFilteredMembers(this, Picket.Member.Property);
	};
	
	_.Class.prototype.getProperty = function(name)
	{
		// @todo Ensure name is a string or undefined
		var propertiesArray = _getFilteredMembers(this, Picket.Member.Property, name);
		// @todo Throw if length is not 1
		return propertiesArray[0];
	};
	
	_.Class.prototype.getMethods = function(name)
	{
		// @todo Ensure name is a string or undefined
		return _getFilteredMembers(this, Picket.Member.Method, name);
	};
	
	_.Class.prototype.getEvents = function(name)
	{
		// @todo Ensure name is a string or undefined
		return _getFilteredMembers(this, Picket.Member.Event, name);
	};
	
	_.Class.prototype.getEvent = function(name)
	{
		// @todo Ensure name is a string or undefined
		var eventsArray = _getFilteredMembers(this, Picket.Member.Event, name);
		// @todo Throw if length is not 1
		return eventsArray[0];
	};
	
	_.Class.prototype.getConstants = function(name)
	{
		// @todo Ensure name is a string or undefined
		return _getFilteredMembers(this, Picket.Member.Constant, name);
	};
	
	_.Class.prototype.getConstant = function(name)
	{
		// @todo Ensure name is a string or undefined
		var constantsArray = _getFilteredMembers(this, Picket.Member.Constant, name);
		// @todo Throw if length is not 1
		return constantsArray[0];
	};
	
	_.Class.prototype.isAbstract = function()
	{
		return (_getAbstractType(this) == 'none') ? false : true;
	};
	
	_.Class.prototype.isExplicitAbstract = function()
	{
		return (_getAbstractType(this) == 'explicit') ? true : false;
	};
	
	_.Class.prototype.isImplicitAbstract = function()
	{
		return (_getAbstractType(this) == 'implicit') ? true : false;
	};
	
	_.Class.prototype.createNew = function()
	{
		var args = Array.prototype.splice.call(arguments, 0);
		args.unshift(null);
		var constructor = Picket._instantiator.getNamespaceManager().getNamespaceObject(
			this._classObject.getName()
		);
		var F = constructor.bind.apply(constructor, args);
		return new F();
	};
	
	_.Class.prototype.getMock = function()
	{
		
		// Get the real constructor function
		// for the class and ensure it is a function
		var constructor = Picket._instantiator.getNamespaceManager().getNamespaceObject(
			this.getName()
		);
		
		// Create a proxy class, assigning
		// the target class's prototype to it
		var Mock = function(){};
		Mock.prototype = constructor.prototype;
		
		// Create an instance of the proxy
		var mock = new Mock();
		
		var properties = _filterByType(this, Picket.Member.Property, _getMembers(this));
		var methods = _filterByType(this, Picket.Member.Method, _getMembers(this));
		
		for (var i = 0; i < properties.length; i++) mock[properties[i].getName()] = function(){};
		for (var i = 0; i < methods.length; i++) mock[methods[i].getName()] = function(){};
		
		// @todo Test this line
		Picket._instantiator.getTypeRegistry().registerMock(mock, this._classObject);
		
		// Return the finished mock
		return mock;
		
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._classObject);
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
		for (var i = 0; i < members.length; i++) {
			if (members[i] instanceof Picket.Member.Property) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildProperty(
						_this.getName(),
						members[i].getName()
					)
				);
			} else if (members[i] instanceof Picket.Member.Method) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildMethod(
						_this.getName(),
						members[i].getName()
					)
				);
			} else if (members[i] instanceof Picket.Member.Event) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildEvent(
						_this.getName(),
						members[i].getName()
					)
				);
			} else if (members[i] instanceof Picket.Member.Constant) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildConstant(
						_this.getName(),
						members[i].getName()
					)
				);
			}
		}
		return reflectionMembers;
	};
	
	var _getAbstractType = function(_this)
	{
		try {
			_this._classObject.requestInstantiation();
		} catch (error) {
			if (!(error instanceof Picket.Type.Class.Fatal)) throw error;
			if (error.code == 'CANNOT_INSTANTIATE_ABSTRACT_CLASS') return 'explicit';
			if (error.code == 'CANNOT_INSTANTIATE_CLASS_WITH_ABSTRACT_MEMBERS') return 'implicit';
			if (error.code == 'CANNOT_INSTANTIATE_CLASS_WITH_UNIMPLEMENTED_INTERFACE_MEMBERS') {
				return 'implicit';
			}
			// @todo Throw new error - we shouldn't get here
		}
		return 'none';
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Class = _.Class;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
