(function(_){
	
	_.Mocker = function(){};
	
	_.Mocker.prototype.getMock = function(constructor)
	{
		
		var Mock = function(){};
		Mock.prototype = constructor.prototype;
		
		return new Mock();
		
	};
	
})(window.ClassyJS = window.ClassyJS || {});
