;(function(Picket, Type, Class, _){
	
	var messages = {
		ABSTRACT_CLASS_CANNOT_BE_INSTANTIATED: 'Abstract class cannot be instantiated'
	};
	
	_.Fatal = Picket.Fatal.getFatal('Type.Class.Constructor.Fatal', messages);
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {},
	window.Picket.Type.Class.Constructor = window.Picket.Type.Class.Constructor || {}
);
