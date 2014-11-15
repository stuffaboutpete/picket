(function(_){
	
	_.AutoLoader = function(includer, instantiator, namespaceManager)
	{
		if (!(includer instanceof ClassyJS.AutoLoader.Includer.Script)) {
			throw new _.AutoLoader.Fatal(
				'INCLUDER_NOT_PROVIDED',
				'Provided type: ' + typeof includer
			);
		}
		if (!(instantiator instanceof ClassyJS.AutoLoader.Instantiator)) {
			throw new _.AutoLoader.Fatal(
				'INSTANTIATOR_NOT_PROVIDED',
				'Provided type: ' + typeof instantiator
			);
		}
		if (!(namespaceManager instanceof ClassyJS.NamespaceManager)) {
			throw new _.AutoLoader.Fatal(
				'NAMESPACE_MANAGER_NOT_PROVIDED',
				'Provided type: ' + typeof namespaceManager
			);
		}
		this._includer = includer;
		this._instantiator = instantiator;
		this._namespaceManager = namespaceManager;
		this._stacks = [];
		this._continueBuffer = [];
		this._classMaps = [];
	};
	
	_.AutoLoader.prototype.isRunning = function()
	{
		return (this._stacks.length > 0) ? true : false;
	};
	
	_.AutoLoader.prototype.start = function(className, methodName)
	{
		// @todo Check methodName is string
		if (typeof className != 'string') {
			throw new _.AutoLoader.Fatal(
				'NON_STRING_CLASS_NAME',
				'Provided type: ' + typeof className
			);
		}
		var stack = {
			className:        className,
			methodName:       methodName,
			classConstructor: undefined,
			loadingScripts:   []
		};
		this._stacks.push(stack);
		if (_classExists(this, className)) {
			stack.classConstructor = _getClassConstructor(this, className);
			_attemptFinish(this);
		} else {
			stack.loadingScripts.push(_getScriptLocation(this, className));
			_load(this, className);
		}
	};
	
	_.AutoLoader.prototype.require = function(className, targetObject, methodName)
	{
		// @todo Check className and methodName are strings
		// @todo Check targetObject is object and has method
		var stack = {
			className:        className,
			targetInstance:   targetObject,
			targetMethodName: methodName,
			loadingScripts:   []
		};
		this._stacks.push(stack);
		if (_classExists(this, className)) {
			_attemptFinish(this);
		} else {
			stack.loadingScripts.push(_getScriptLocation(this, className));
			_load(this, className);
		}
	};
	
	_.AutoLoader.prototype.continue = function(className)
	{
		if (typeof className != 'string') {
			throw new _.AutoLoader.Fatal(
				'NON_STRING_CLASS_NAME',
				'Provided type: ' + typeof className
			);
		}
		if (!this.isRunning()) throw new _.AutoLoader.Fatal('NOT_RUNNING');
		this._continueBuffer.push(_getScriptLocation(this, className));
		_load(this, className);
	};
	
	_.AutoLoader.prototype.addClassAutoloadPattern = function(pattern, target)
	{
		this._classMaps.push({
			pattern: pattern,
			target:  target
		});
		this._classMaps.sort(function(a, b){
			return b.pattern.length - a.pattern.length;
		});
	};
	
	var _load = function(_this, className)
	{
		if (_classExists(_this, className)) {
			_attemptFinish(_this);
		} else {
			var scriptLocation = _getScriptLocation(_this, className);
			_this._includer.include(
				scriptLocation,
				_getScriptLoadedCallback(_this, className, scriptLocation),
				_getScriptFailedCallback(_this, className, scriptLocation)
			);
		}
	};
	
	var _classExists = function(_this, className)
	{
		try {
			_getClassConstructor(_this, className);
			return true;
		} catch (error) {
			if (!(error instanceof ClassyJS.NamespaceManager.Fatal)
			||	error.code != 'NAMESPACE_OBJECT_DOES_NOT_EXIST') {
				throw error;
			}
			return false;
		}
	};
	
	var _getClassConstructor = function(_this, className)
	{
		return constructor = _this._namespaceManager.getNamespaceObject(className);
	};
	
	var _attemptFinish = function(_this)
	{
		var index = _this._stacks.length;
		while (index--) {
			var stack = _this._stacks[index];
			// @todo Check constructor is () -> undefined
			if (stack.loadingScripts.length > 0) continue;
			if (typeof stack.classConstructor != 'undefined') {
				var instance = _this._instantiator.instantiate(stack.classConstructor);
				if (stack.methodName) instance[stack.methodName].call(instance);
			} else {
				// @todo Check method is (string) -> undefined
				stack.targetInstance[stack.targetMethodName].call(
					stack.targetInstance,
					stack.className
				);
			}
			_this._stacks.splice(index, 1);
		}
	};
	
	var _getScriptLocation = function(_this, className)
	{
		var prependPath = '';
		for (var i in _this._classMaps) {
			var pattern = _this._classMaps[i].pattern;
			if (className.substr(0, pattern.length) == pattern) {
				prependPath = _this._classMaps[i].target;
				className = className.substr(pattern.length);
				break;
			}
		}
		if (!prependPath.match(/(https?:\/)?\//)) prependPath = '/' + prependPath;
		return prependPath + className.replace(/\./g, '/') + '.js';
	};
	
	var _getScriptLoadedCallback = function(_this, className, scriptLocation)
	{
		return (function(_this, className, scriptLocation){
			return function(){
				_handleLoadedScript(_this, className, scriptLocation);
			};
		})(_this, className, scriptLocation);
	};
	
	var _getScriptFailedCallback = function(_this, className, scriptLocation)
	{
		return (function(className, scriptLocation){
			return function(){
				throw new _.AutoLoader.Fatal(
					'SCRIPT_NOT_LOADED',
					'Provided class name: ' + className + '; ' +
					'Included script: ' + scriptLocation
				);
			};
		})(className, scriptLocation);
	};
	
	var _handleLoadedScript = function(_this, className, scriptLocation)
	{
		var index = _this._stacks.length;
		while (index--) {
			if (className == _this._stacks[index].className
			&&	typeof _this._stacks[index].targetInstance == 'undefined') {
				// @todo Catch error?
				_this._stacks[index].classConstructor = _getClassConstructor(
					_this,
					className
				);
			}
			var scriptIndex = _this._stacks[index].loadingScripts.indexOf(scriptLocation);
			if (scriptIndex > -1) {
				_this._stacks[index].loadingScripts.splice(scriptIndex, 1);
				for (var j in _this._continueBuffer) {
					_this._stacks[index].loadingScripts.push(_this._continueBuffer[j]);
				}
			}
			if (_this._stacks[index].loadingScripts.length == 0) {
				_attemptFinish(_this);
			}
			
		}
		_this._continueBuffer = [];
	};
	
})(window.ClassyJS = window.ClassyJS || {});
