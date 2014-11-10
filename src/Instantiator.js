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
	};
	
	_.Instantiator.prototype.getTypeFactory = function()
	{
		if (!this._typeFactory) {
			this._typeFactory = new ClassyJS.Type.Factory(
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
			this._classFactory = new ClassyJS.Type.Class.Factory();
		}
		return this._classFactory;
	};
	
	_.Instantiator.prototype.getInterfaceFactory = function()
	{
		if (!this._interfaceFactory) {
			this._interfaceFactory = new ClassyJS.Type.Interface.Factory();
		}
		return this._interfaceFactory;
	};
	
	_.Instantiator.prototype.getTypeDefinitionFactory = function()
	{
		if (!this._typeDefinitionFactory) {
			this._typeDefinitionFactory = new ClassyJS.Type.DefinitionFactory(
				this.getClassDefinitionFactory(),
				this.getInterfaceDefinitionFactory()
			);
		}
		return this._typeDefinitionFactory;
	};
	
	_.Instantiator.prototype.getClassDefinitionFactory = function()
	{
		if (!this._classDefinitionFactory) {
			this._classDefinitionFactory = new ClassyJS.Type.Class.Definition.Factory();
		}
		return this._classDefinitionFactory;
	};
	
	_.Instantiator.prototype.getInterfaceDefinitionFactory = function()
	{
		if (!this._interfaceDefinitionFactory) {
			this._interfaceDefinitionFactory = new ClassyJS.Type.Interface.Definition.Factory();
		}
		return this._interfaceDefinitionFactory;
	};
	
	_.Instantiator.prototype.getMemberFactory = function()
	{
		if (!this._memberFactory) {
			this._memberFactory = new ClassyJS.Member.Factory(
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
			this._propertyFactory = new ClassyJS.Member.Property.Factory();
		}
		return this._propertyFactory;
	};
	
	_.Instantiator.prototype.getMethodFactory = function()
	{
		if (!this._methodFactory) {
			this._methodFactory = new ClassyJS.Member.Method.Factory();
		}
		return this._methodFactory;
	};
	
	_.Instantiator.prototype.getEventFactory = function()
	{
		if (!this._eventFactory) {
			this._eventFactory = new ClassyJS.Member.Event.Factory();
		}
		return this._eventFactory;
	};
	
	_.Instantiator.prototype.getConstantFactory = function()
	{
		if (!this._constantFactory) {
			this._constantFactory = new ClassyJS.Member.Constant.Factory();
		}
		return this._constantFactory;
	};
	
	_.Instantiator.prototype.getMemberDefinitionFactory = function()
	{
		if (!this._memberDefinitionFactory) {
			this._memberDefinitionFactory = new ClassyJS.Member.DefinitionFactory(
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
			this._propertyDefinitionFactory = new ClassyJS.Member.Property.Definition.Factory();
		}
		return this._propertyDefinitionFactory;
	};
	
	_.Instantiator.prototype.getMethodDefinitionFactory = function()
	{
		if (!this._methodDefinitionFactory) {
			this._methodDefinitionFactory = new ClassyJS.Member.Method.Definition.Factory();
		}
		return this._methodDefinitionFactory;
	};
	
	_.Instantiator.prototype.getEventDefinitionFactory = function()
	{
		if (!this._eventDefinitionFactory) {
			this._eventDefinitionFactory = new ClassyJS.Member.Event.Definition.Factory();
		}
		return this._eventDefinitionFactory;
	};
	
	_.Instantiator.prototype.getConstantDefinitionFactory = function()
	{
		if (!this._constantDefinitionFactory) {
			this._constantDefinitionFactory = new ClassyJS.Member.Constant.Definition.Factory();
		}
		return this._constantDefinitionFactory;
	};
	
	_.Instantiator.prototype.getNamespaceManager = function()
	{
		if (!this._namespaceManager) {
			this._namespaceManager = new ClassyJS.NamespaceManager();
		}
		return this._namespaceManager;
	};
	
	_.Instantiator.prototype.getTypeRegistry = function()
	{
		if (!this._typeRegistry) {
			this._typeRegistry = new ClassyJS.Registry.Type();
		}
		return this._typeRegistry;
	};
	
	_.Instantiator.prototype.getMemberRegistry = function()
	{
		if (!this._memberRegistry) {
			this._memberRegistry = new ClassyJS.Registry.Member(
				this.getTypeRegistry(),
				this.getTypeChecker()
			);
		}
		return this._memberRegistry;
	};
	
	_.Instantiator.prototype.getTypeChecker = function()
	{
		if (!this._typeChecker) {
			this._typeChecker = new ClassyJS.TypeChecker();
		}
		return this._typeChecker;
	};
	
	_.Instantiator.prototype.getAccessController = function()
	{
		if (!this._accessController) {
			this._accessController = new ClassyJS.Access.Controller();
		}
		return this._accessController;
	};
	
})(window.ClassyJS = window.ClassyJS || {});
