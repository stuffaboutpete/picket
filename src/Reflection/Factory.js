(function(ClassyJS, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.buildClass = function(identifier)
	{
		return new ClassyJS.Reflection.Class(identifier);
	};
	
	_.Factory.prototype.buildClassInstance = function(instance)
	{
		return new ClassyJS.Reflection.ClassInstance(instance);
	};
	
	_.Factory.prototype.buildInterface = function(instance)
	{
		return new ClassyJS.Reflection.Interface(instance);
	};
	
	_.Factory.prototype.buildProperty = function(className, propertyName)
	{
		return new ClassyJS.Reflection.Property(className, propertyName);
	};
	
	_.Factory.prototype.buildMethod = function(className, methodName)
	{
		return new ClassyJS.Reflection.Method(className, methodName);
	};
	
	_.Factory.prototype.buildEvent = function(className, eventName)
	{
		return new ClassyJS.Reflection.Event(className, eventName);
	};
	
	_.Factory.prototype.buildConstant = function(className, constantName)
	{
		return new ClassyJS.Reflection.Constant(className, constantName);
	};
	
	_.Factory.prototype.buildPropertyInstance = function(objectInstance, propertyName)
	{
		return new ClassyJS.Reflection.PropertyInstance(objectInstance, propertyName);
	};
	
	_.Factory.prototype.buildMethodInstance = function(objectInstance, methodName)
	{
		return new ClassyJS.Reflection.MethodInstance(objectInstance, methodName);
	};
	
	_.Factory.prototype.buildEventInstance = function(objectInstance, eventName)
	{
		return new ClassyJS.Reflection.EventInstance(objectInstance, eventName);
	};
	
	_.Factory.prototype.buildArgument = function(identifier, isOptional, defaultValue, owner)
	{
		return new ClassyJS.Reflection.Argument(identifier, isOptional, defaultValue, owner);
	};
	
	_.Factory.prototype.buildType = function(identifier)
	{
		return new ClassyJS.Reflection.Type(identifier);
	};
	
	_.Factory.prototype.buildAccessType = function(identifier)
	{
		return new ClassyJS.Reflection.AccessType(identifier);
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Reflection = window.ClassyJS.Reflection || {}
);
