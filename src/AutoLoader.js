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
		this._isRunning = false;
		this._classMaps = [];
	};
	_.AutoLoader.prototype.isRunning = function()
	{
		return this._isRunning;
	};
	
	_.AutoLoader.prototype.start = function(className, methodName)
	{
		if (this._isRunning) throw new _.AutoLoader.Fatal('ALREADY_RUNNING');
		this._targetClassName = className;
		this._targetMethod = methodName;
		this._isRunning = true;
		this._loadingScripts = 0;
		this.continue(className);
	};
	
	_.AutoLoader.prototype.continue = function(className)
	{
		if (typeof className != 'string') {
			throw new _.AutoLoader.Fatal(
				'NON_STRING_CLASS_NAME',
				'Provided type: ' + typeof className
			);
		}
		if (!this._isRunning) throw new _.AutoLoader.Fatal('NOT_RUNNING');
		if (_classExists(this, className)) {
			this._targetConstructor = _getClassConstructor(this, className);
			_attemptFinish(this);
		} else {
			var scriptLocation = _getScriptLocation(this, className);
			this._includer.include(
				scriptLocation,
				_getScriptLoadedCallback(this, className, scriptLocation),
				_getScriptFailedCallback(this, className, scriptLocation)
			);
			this._loadingScripts++;
		}
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
		// @todo Check constructor is () -> undefined
		if (_this._loadingScripts > 0) return;
		var instance = _this._instantiator.instantiate(_this._targetConstructor);
		if (_this._targetMethod) {
			// @todo Check exists. And is () -> undefined
			instance[_this._targetMethod].call(instance);
		}
		_this._isRunning = false;
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
				if (!_classExists(_this, className)) {
					throw new _.AutoLoader.Fatal(
						'CLASS_NOT_FOUND',
						'Provided class name: ' + className + '; ' +
						'Included script: ' + scriptLocation
					);
				}
				if (className == _this._targetClassName) {
					_this._targetConstructor = _getClassConstructor(_this, className);
				}
				_this._loadingScripts--;
				_attemptFinish(_this);
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
	
})(window.ClassyJS = window.ClassyJS || {});
