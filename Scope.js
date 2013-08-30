;(function(undefined){
	
	Class.Scope = function(level){
		
		if (level != Class.Scope.PUBLIC
		&& level != Class.Scope.PROTECTED
		&& level != Class.Scope.PRIVATE) {
			throw new InvalidSyntaxFatal('Invalid scope declaration');
		}
		
		this.level = level;
		
	};
	
	// Declare our levels numerically
	Class.Scope.PUBLIC	  =  1;
	Class.Scope.PROTECTED =  0;
	Class.Scope.PRIVATE	  = -1;
	
	Class.Scope.prototype.checkCallingObject = function(object){
		switch (this.level) {
			case Class.Scope.PUBLIC:
				return true;
				break;
			case Class.Scope.PROTECTED:
				object = object || {};
				if (this.parent instanceof Class.Method) {
					if (this.parent.isStatic) {
						var type = object;
						while (type) {
							if (type == this.parent.parentType) return true;
							type = type.Extends || false;
						}
						throw new ScopeFatal(
							'Cannot access protected method \'' + this.parent.name + '\''
						);
					} else if (this.parent.parentType.id != object.id) {
						throw new ScopeFatal(
							'Cannot access protected method \'' + this.parent.name + '\''
						);
					}
				} else {
					if (this.parent.parentType) {
						var type = object;
						while (type) {
							if (this.parent.parentType == type) return true;
							type = type.Extends || false;
						}
						throw new ScopeFatal(
							'Cannot access protected property \'' + this.parent.name + '\''
						);
					} else if (this.parent.parent.id != object.id) {
						throw new ScopeFatal(
							'Cannot access protected property \'' + this.parent.name + '\''
						);
					}
				}
				break;
			case Class.Scope.PRIVATE:
				if (this.parent instanceof Class.Method) {
					if (this.parent.parentType != object) {
						throw new ScopeFatal(
							'Cannot access private method \'' + this.parent.name + '\''
						);
					}
				} else {
					var parentType = (this.parent.parentType)
						? this.parent.parentType
						: this.parent.parent.type;
					if (parentType != object) {
						throw new ScopeFatal(
							'Cannot access private property \'' + this.parent.name + '\''
						);
					}
				}
		} 
	}
	
	Class.Scope.prototype.checkCallingFunction = function(callingFunction){
		return this.checkCallingObject(callingFunction.parentType);
	}
	
})();