;(function(ClassyJS, Reflection, _){
	
	var messages = {
		EVENT_DOES_NOT_EXIST:
			'Provided event name and class instance do not describe a valid event'
	};
	
	_.Fatal = ClassyJS.Fatal.getFatal('Reflection.EventInstance.Fatal', messages);
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {},
	window.ClassyJS.Reflection.EventInstance = window.ClassyJS.Reflection.EventInstance || {}
);
