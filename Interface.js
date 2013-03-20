;(function(undefined){
	
	Interface = function(){};
	
	Interface.define = function(name, methods){
		
		var definitionError = false;
		var methodList = {};
		for (var i in methods) {
			if (methods[i].split('(').length-1 != 1) {
				definitionError = true;
				break;
			}
			if (methods[i].split(')').length-1 != 1) {
				definitionError = true;
				break;
			}
			if (methods[i].slice(-1) != ')') {
				definitionError = true;
				break;
			}
			var args = methods[i].substring(
				methods[i].indexOf('(')+1,
				methods[i].length-1
			);
			args.replace(' ', '');
			args = (args == '') ? [] : args.split(',');
			methodList[methods[i].substring(0, methods[i].indexOf('('))] = args;
			//delete methods[i];
		}
		
		if (definitionError) {
			throw new InterfaceIncorrectlyDefinedFatal();
		}
		
		var namespaceTree = name.split('.');
		var interfaceName = namespaceTree.pop();
		var namespace = window;
		
		for (var i in namespaceTree) {
			namespace[namespaceTree[i]] = namespace[namespaceTree[i]] || {};
			namespace = namespace[namespaceTree[i]];
		}
		
		namespace[interfaceName] = function(){
			throw new CannotInstantiateInterfaceFatal();
		};
		
		namespace[interfaceName].methods = methodList;
		
	};
	
})();