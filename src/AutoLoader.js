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
		this._requestedScripts = [];
		this._loadedScripts = [];
		this._classCallbacks = {};
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
			_load(this, className, stack);
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
			_load(this, className, stack);
		}
	};
	
	_.AutoLoader.prototype.continue = function(className, callback)
	{
		if (typeof className != 'string') {
			throw new _.AutoLoader.Fatal(
				'NON_STRING_CLASS_NAME',
				'Provided type: ' + typeof className
			);
		}
		if (!this.isRunning()) throw new _.AutoLoader.Fatal('NOT_RUNNING');
		this._continueBuffer.push(_getScriptLocation(this, className));
		if (typeof callback == 'function') {
			if (typeof this._classCallbacks[className] == 'undefined') {
				this._classCallbacks[className] = [];
			}
			this._classCallbacks[className].push(callback);
		}
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
	
	var _load = function(_this, className, stack)
	{
		if (_classExists(_this, className)) {
			_attemptFinish(_this);
		} else {
			var scriptLocation = _getScriptLocation(_this, className);
			if (_this._loadedScripts.indexOf(scriptLocation) > -1) {
				_attemptFinish(_this);
			} else {
				if (_this._requestedScripts.indexOf(scriptLocation) == -1) {
					_this._includer.include(
						scriptLocation,
						_getScriptLoadedCallback(_this, className, scriptLocation),
						_getScriptFailedCallback(_this, className, scriptLocation)
					);
					_this._requestedScripts.push(scriptLocation);
				}
				if (stack) stack.loadingScripts.push(scriptLocation);
			}
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
			_this._stacks.splice(index, 1);
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
		if (typeof _this._classCallbacks[className] != 'undefined') {
			for (var i in _this._classCallbacks[className]) {
				_this._classCallbacks[className][i]();
			};
			delete _this._classCallbacks[className];
		}
		var index = _this._stacks.length;
		while (index--) {
			var stack = _this._stacks[index];
			if (className == stack.className
			&&	typeof stack.targetInstance == 'undefined') {
				// @todo Catch error?
				stack.classConstructor = _getClassConstructor(
					_this,
					className
				);
			}
			var scriptIndex = stack.loadingScripts.indexOf(scriptLocation);
			if (scriptIndex > -1) {
				stack.loadingScripts.splice(scriptIndex, 1);
				for (var j in _this._continueBuffer) {
					if (_this._loadedScripts.indexOf(_this._continueBuffer[j]) == -1
					&&	stack.loadingScripts.indexOf(_this._continueBuffer[j]) == -1) {
						stack.loadingScripts.push(_this._continueBuffer[j]);
					}
				}
			}
			if (stack.loadingScripts.length == 0) {
				_attemptFinish(_this);
			}
			
		}
		_this._loadedScripts.push(scriptLocation);
		_this._continueBuffer = [];
	};
	
})(window.ClassyJS = window.ClassyJS || {});
