(function(_){
	
	_.Instantiator = function()
	{
		this._typeFactory;
		this._classFactory;
		this._interfaceFactory;
		this._typeDefinitionFactory;
		this._classDefinitionFactory;
		this._interfaceDefinitionFactory;
		this._memberFactory;
		this._propertyFactory;
		this._methodFactory;
		this._eventFactory;
		this._constantFactory;
		this._memberDefinitionFactory;
		this._propertyDefinitionFactory;
		this._methodDefinitionFactory;
		this._eventDefinitionFactory;
		this._constantDefinitionFactory;
		this._namespaceManager;
		this._typeRegistry;
		this._memberRegistry;
		this._typeChecker;
		this._accessController;
		this._autoLoader;
		this._includer;
		this._autoLoadInstantiator;
		this._reflectionFactory;
	};
	
	_.Instantiator.prototype.getTypeFactory = function()
	{
		if (!this._typeFactory) {
			this._typeFactory = new Picket.Type.Factory(
				this.getTypeDefinitionFactory(),
				this.getClassFactory(),
				this.getInterfaceFactory(),
				this.getTypeRegistry(),
				this.getMemberRegistry(),
				this.getNamespaceManager()
			);
		}
		return this._typeFactory;
	};
	
	_.Instantiator.prototype.getClassFactory = function()
	{
		if (!this._classFactory) {
			this._classFactory = new Picket.Type.Class.Factory();
		}
		return this._classFactory;
	};
	
	_.Instantiator.prototype.getInterfaceFactory = function()
	{
		if (!this._interfaceFactory) {
			this._interfaceFactory = new Picket.Type.Interface.Factory();
		}
		return this._interfaceFactory;
	};
	
	_.Instantiator.prototype.getTypeDefinitionFactory = function()
	{
		if (!this._typeDefinitionFactory) {
			this._typeDefinitionFactory = new Picket.Type.DefinitionFactory(
				this.getClassDefinitionFactory(),
				this.getInterfaceDefinitionFactory()
			);
		}
		return this._typeDefinitionFactory;
	};
	
	_.Instantiator.prototype.getClassDefinitionFactory = function()
	{
		if (!this._classDefinitionFactory) {
			this._classDefinitionFactory = new Picket.Type.Class.Definition.Factory();
		}
		return this._classDefinitionFactory;
	};
	
	_.Instantiator.prototype.getInterfaceDefinitionFactory = function()
	{
		if (!this._interfaceDefinitionFactory) {
			this._interfaceDefinitionFactory = new Picket.Type.Interface.Definition.Factory();
		}
		return this._interfaceDefinitionFactory;
	};
	
	_.Instantiator.prototype.getMemberFactory = function()
	{
		if (!this._memberFactory) {
			this._memberFactory = new Picket.Member.Factory(
				this.getMemberDefinitionFactory(),
				this.getPropertyFactory(),
				this.getMethodFactory(),
				this.getEventFactory(),
				this.getConstantFactory(),
				this.getTypeChecker(),
				this.getAccessController()
			);
		}
		return this._memberFactory;
	};
	
	_.Instantiator.prototype.getPropertyFactory = function()
	{
		if (!this._propertyFactory) {
			this._propertyFactory = new Picket.Member.Property.Factory();
		}
		return this._propertyFactory;
	};
	
	_.Instantiator.prototype.getMethodFactory = function()
	{
		if (!this._methodFactory) {
			this._methodFactory = new Picket.Member.Method.Factory();
		}
		return this._methodFactory;
	};
	
	_.Instantiator.prototype.getEventFactory = function()
	{
		if (!this._eventFactory) {
			this._eventFactory = new Picket.Member.Event.Factory();
		}
		return this._eventFactory;
	};
	
	_.Instantiator.prototype.getConstantFactory = function()
	{
		if (!this._constantFactory) {
			this._constantFactory = new Picket.Member.Constant.Factory();
		}
		return this._constantFactory;
	};
	
	_.Instantiator.prototype.getMemberDefinitionFactory = function()
	{
		if (!this._memberDefinitionFactory) {
			this._memberDefinitionFactory = new Picket.Member.DefinitionFactory(
				this.getPropertyDefinitionFactory(),
				this.getMethodDefinitionFactory(),
				this.getEventDefinitionFactory(),
				this.getConstantDefinitionFactory()
			);
		}
		return this._memberDefinitionFactory;
	};
	
	_.Instantiator.prototype.getPropertyDefinitionFactory = function()
	{
		if (!this._propertyDefinitionFactory) {
			this._propertyDefinitionFactory = new Picket.Member.Property.Definition.Factory();
		}
		return this._propertyDefinitionFactory;
	};
	
	_.Instantiator.prototype.getMethodDefinitionFactory = function()
	{
		if (!this._methodDefinitionFactory) {
			this._methodDefinitionFactory = new Picket.Member.Method.Definition.Factory();
		}
		return this._methodDefinitionFactory;
	};
	
	_.Instantiator.prototype.getEventDefinitionFactory = function()
	{
		if (!this._eventDefinitionFactory) {
			this._eventDefinitionFactory = new Picket.Member.Event.Definition.Factory();
		}
		return this._eventDefinitionFactory;
	};
	
	_.Instantiator.prototype.getConstantDefinitionFactory = function()
	{
		if (!this._constantDefinitionFactory) {
			this._constantDefinitionFactory = new Picket.Member.Constant.Definition.Factory();
		}
		return this._constantDefinitionFactory;
	};
	
	_.Instantiator.prototype.getNamespaceManager = function()
	{
		if (!this._namespaceManager) {
			this._namespaceManager = new Picket.NamespaceManager();
		}
		return this._namespaceManager;
	};
	
	_.Instantiator.prototype.getTypeRegistry = function()
	{
		if (!this._typeRegistry) {
			this._typeRegistry = new Picket.Registry.Type(
				this.getNamespaceManager()
			);
		}
		return this._typeRegistry;
	};
	
	_.Instantiator.prototype.getMemberRegistry = function()
	{
		if (!this._memberRegistry) {
			this._memberRegistry = new Picket.Registry.Member(
				this.getTypeRegistry(),
				this.getTypeChecker()
			);
		}
		return this._memberRegistry;
	};
	
	_.Instantiator.prototype.getTypeChecker = function()
	{
		if (!this._typeChecker) {
			this._typeChecker = new Picket.TypeChecker(
				new Picket.TypeChecker.ReflectionFactory()
			);
		}
		return this._typeChecker;
	};
	
	_.Instantiator.prototype.getAccessController = function()
	{
		if (!this._accessController) {
			this._accessController = new Picket.Access.Controller(
				this.getTypeRegistry()
			);
		}
		return this._accessController;
	};
	
	_.Instantiator.prototype.getAutoLoader = function()
	{
		if (!this._autoLoader) {
			this._autoLoader = new Picket.AutoLoader(
				this.getIncluder(),
				this.getAutoLoadInstantiator(),
				this.getNamespaceManager(),
				this.getMemberRegistry()
			);
		}
		return this._autoLoader;
	};
	
	_.Instantiator.prototype.getIncluder = function()
	{
		if (!this._includer) {
			this._includer = new Picket.AutoLoader.Includer.Script();
		}
		return this._includer;
	};
	
	_.Instantiator.prototype.getAutoLoadInstantiator = function()
	{
		if (!this._autoLoadInstantiator) {
			this._autoLoadInstantiator = new Picket.AutoLoader.Instantiator();
		}
		return this._autoLoadInstantiator;
	};
	
	_.Instantiator.prototype.getReflectionFactory = function()
	{
		if (!this._reflectionFactory) {
			this._reflectionFactory = new Picket.Reflection.Factory();
		}
		return this._reflectionFactory;
	};
	
})(window.Picket = window.Picket || {});
