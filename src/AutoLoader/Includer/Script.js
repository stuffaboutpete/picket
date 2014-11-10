(function(ClassyJS, AutoLoader, _){
	
	_.Script = function(){};
	
	_.Script.prototype.include = function(scriptLocation, successCallback, errorCallback)
	{
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptLocation;
		script.async = false; // @todo I don't know exactly what this does. Experiment.
		script.onreadystatechange = script.onload = function(){
			// http://stackoverflow.com/questions/6725272/dynamic-cross-browser-script-loading
			var state = script.readyState;
			if (!state || /loaded|complete/.test(state)) {
				successCallback();
			} else {
				errorCallback();
			}
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.AutoLoader = window.ClassyJS.AutoLoader || {},
	window.ClassyJS.AutoLoader.Includer = window.ClassyJS.AutoLoader.Includer || {}
);
