;(function(undefined){
	
	Interface = function(){};
	
	Interface.define = function(name, methods){
		
		var methodList = {};
		
		for (var i in methods) {
			if (!methods.hasOwnProperty(i)) continue;
			var definitionParts = methods[i].split(':');
			if (definitionParts.length == 2) {
				var argTypes = definitionParts.pop().trim().split(' ');
			} else {
				var argTypes = null;
			}
			definitionParts = definitionParts[0].trim().split(' ');
			if (definitionParts.length == 2) {
				var returnType = definitionParts.shift();
			}
			if (definitionParts.length > 1) {
				// @todo Throw! (invalid definition)
			}
			methodList[definitionParts[0]] = {
				argTypes: argTypes,
				returnType: returnType
			};
		}
		
		var namespaceTree = name.split('.');
		var interfaceName = namespaceTree.pop();
		var namespace = window;
		
		for (var i in namespaceTree) {
			if (!namespaceTree.hasOwnProperty(i)) continue;
			namespace[namespaceTree[i]] = namespace[namespaceTree[i]] || {};
			namespace = namespace[namespaceTree[i]];
		}
		
		namespace[interfaceName] = function(){
			throw new CannotInstantiateInterfaceFatal();
		};
		
		namespace[interfaceName].methods = methodList;
		
	};
	
})();