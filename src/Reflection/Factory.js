(function(Picket, _){
	
	_.Factory = function(){};
	
	_.Factory.prototype.buildClass = function(identifier)
	{
		return new Picket.Reflection.Class(identifier);
	};
	
	_.Factory.prototype.buildClassInstance = function(instance)
	{
		return new Picket.Reflection.ClassInstance(instance);
	};
	
	_.Factory.prototype.buildInterface = function(instance)
	{
		return new Picket.Reflection.Interface(instance);
	};
	
	_.Factory.prototype.buildProperty = function(className, propertyName)
	{
		return new Picket.Reflection.Property(className, propertyName);
	};
	
	_.Factory.prototype.buildMethod = function(className, methodName)
	{
		return new Picket.Reflection.Method(className, methodName);
	};
	
	_.Factory.prototype.buildEvent = function(className, eventName)
	{
		return new Picket.Reflection.Event(className, eventName);
	};
	
	_.Factory.prototype.buildConstant = function(className, constantName)
	{
		return new Picket.Reflection.Constant(className, constantName);
	};
	
	_.Factory.prototype.buildPropertyInstance = function(objectInstance, propertyName)
	{
		return new Picket.Reflection.PropertyInstance(objectInstance, propertyName);
	};
	
	_.Factory.prototype.buildMethodInstance = function(objectInstance, methodName)
	{
		return new Picket.Reflection.MethodInstance(objectInstance, methodName);
	};
	
	_.Factory.prototype.buildEventInstance = function(objectInstance, eventName)
	{
		return new Picket.Reflection.EventInstance(objectInstance, eventName);
	};
	
	_.Factory.prototype.buildArgument = function(identifier, isOptional, defaultValue, owner)
	{
		return new Picket.Reflection.Argument(identifier, isOptional, defaultValue, owner);
	};
	
	_.Factory.prototype.buildType = function(identifier)
	{
		return new Picket.Reflection.Type(identifier);
	};
	
	_.Factory.prototype.buildAccessType = function(identifier)
	{
		return new Picket.Reflection.AccessType(identifier);
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Reflection = window.Picket.Reflection || {}
);
