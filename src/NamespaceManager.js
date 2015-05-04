(function(_){
	
	_.NamespaceManager = function(){};
	
	_.NamespaceManager.prototype.getNamespaceObject = function(name)
	{
		// @todo Verify name is string
		return getObjectFromString(name);
	};
	
	_.NamespaceManager.prototype.registerClassFunction = function(name, constructor)
	{
		// @todo Check constructor is function
		var namespaceParts = name.split('.');
		var className = namespaceParts.pop();
		var namespace = namespaceParts.join('.');
		if (namespace != '') ensureNamespaceExists(namespace);
		namespace = getObjectFromString(namespace);
		// @todo Check namespace[className] isn't some other type
		if (typeof namespace[className] == 'object') {
			var downstreamProperties = {};
			for (var i in namespace[className]) {
				downstreamProperties[i] = namespace[className][i];
			}
		}
		namespace[className] = constructor;
		if (typeof downstreamProperties) {
			for (var i in downstreamProperties) {
				namespace[className][i] = downstreamProperties[i];
			}
		}
	};
	
	var getObjectFromString = function(name)
	{
		if (name == '') return window;
		var nameParts = name.split('.');
		var namespace = window;
		for (var i = 0; i < nameParts.length; i++) {
			if (typeof namespace[nameParts[i]] == 'undefined') {
				throw new _.NamespaceManager.Fatal('NAMESPACE_OBJECT_DOES_NOT_EXIST');
			}
			namespace = namespace[nameParts[i]];
			if (i == nameParts.length - 1) return namespace;
		}
	};
	
	var ensureNamespaceExists = function(name)
	{
		var nameParts = name.split('.');
		var namespace = window;
		for (var i in nameParts) {
			if (typeof namespace[nameParts[i]] == 'undefined') {
				namespace[nameParts[i]] = {};
			}
			namespace = namespace[nameParts[i]];
		}
	};
	
})(window.Picket = window.Picket || {});
