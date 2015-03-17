(function(ClassyJS, Reflection, _){
	
	_.Interface = function(interfaceName)
	{
		return _.call(this, interfaceName, 'interface');
	};
	
	ClassyJS.Inheritance.makeChild(_.Interface, _);
	
	_.Interface.prototype.getMock = function()
	{
		
		var Mock = function(){};
		
		Mock.prototype.conformsTo = (function(name){
			return function(interfaceName){
				return (interfaceName === name);
			}
		})(this._name);
		
		var mock = new Mock();
		
		var methods = this.getMethods();
		for (var i = 0; i < methods.length; i++) mock[methods[i].getName()] = function(){};
		
		return mock;
		
	}
	
	Reflection.Interface = _.Interface;
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.Reflection = window.Reflection || {},
	window.Reflection.Type = window.Reflection.Type || {}
);
