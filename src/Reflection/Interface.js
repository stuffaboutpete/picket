(function(Picket, _){
	
	_.Interface = function(name)
	{
		
		if (typeof name != 'string') {
			throw new _.Interface.Fatal(
				'NON_STRING_INTERFACE_NAME_PROVIDED',
				'Provided type: ' +  typeof name
			);
		}
		
		if (!Picket._instantiator.getTypeRegistry().interfaceExists(name)) {
			throw new _.Interface.Fatal(
				'INTERFACE_DOES_NOT_EXIST',
				'Provided name: ' + name
			);
		}
		
		this._interfaceObject = Picket._instantiator.getTypeRegistry().getInterface(name);
		
	};
	
	_.Interface.prototype.getName = function()
	{
		return this._interfaceObject.getName();
	};
	
	_.Interface.prototype.getMembers = function()
	{
		return _convertToReflectionMembers(this, _getMembers(this));
	};
	
	_.Interface.prototype.getMethods = function(name)
	{
		return _getFilteredMembers(this, Picket.Member.Method, name);
	};
	
	_.Interface.prototype.getEvents = function()
	{
		return _getFilteredMembers(this, Picket.Member.Event);
	};
	
	_.Interface.prototype.getEvent = function(name)
	{
		return _getFilteredMembers(this, Picket.Member.Event, name);
	};
	
	_.Interface.prototype.getMock = function()
	{
		
		var Mock = function(){};
		
		var mock = new Mock();
		
		var properties = _filterByType(this, Picket.Member.Property, _getMembers(this));
		var methods = _filterByType(this, Picket.Member.Method, _getMembers(this));
		
		for (var i = 0; i < properties.length; i++) mock[properties[i].getName()] = function(){};
		for (var i = 0; i < methods.length; i++) mock[methods[i].getName()] = function(){};
		
		mock.bind = function(){};
		
		Picket._instantiator.getTypeRegistry().registerMock(mock, new Picket.Type.Class(
			new Picket.Type.Class.Definition(
				'class Picket.Mock' + Math.floor(Math.random() * 999999) + ' implements ' + this._interfaceObject.getName()
			),
			Picket._instantiator.getTypeRegistry(),
			Picket._instantiator.getMemberRegistry(),
			Picket._instantiator.getNamespaceManager()
		));
		
		return mock;
		
	};
	
	var _getMembers = function(_this)
	{
		return Picket._instantiator.getMemberRegistry().getMembers(_this._interfaceObject);
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
			if (members[i] instanceof Picket.Member.Method) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildMethod(members[i])
				);
			} else if (members[i] instanceof Picket.Member.Event) {
				reflectionMembers.push(
					Picket._instantiator.getReflectionFactory().buildEvent(members[i])
				);
			}
		}
		return reflectionMembers;
	};
	
	window.Reflection = window.Reflection || {};
	window.Reflection.Interface = _.Interface;
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
