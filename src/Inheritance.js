(function(_){
	
	_.Inheritance = function(){};
	
	_.Inheritance.makeChild = function(child, parent)
	{
		child.prototype = _createObject(parent.prototype);
		child.prototype.constructor = child;
	};
	
	_createObject = function(prototype)
	{
		function F(){};
		F.prototype = prototype;
		return new F();
	};
	
})(window.ClassyJS = window.ClassyJS || {});
