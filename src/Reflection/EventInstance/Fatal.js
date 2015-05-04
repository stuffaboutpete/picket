;(function(Picket, Reflection, _){
	
	var messages = {
		EVENT_DOES_NOT_EXIST:
			'Provided event name and class instance do not describe a valid event'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Reflection.EventInstance.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {},
	window.Picket.Reflection.EventInstance = window.Picket.Reflection.EventInstance || {}
);
