;(function(undefined){
	
	Class.Scope = function(level){
		
		if (level != Class.Scope.PUBLIC
		&& level != Class.Scope.PROTECTED
		&& level != Class.Scope.PRIVATE) {
			throw new Error('Invalid scope declaration');
		}
		
		this.level = level;
		
	};
	
	// Declare our levels numerically
	Class.Scope.PUBLIC	  =  1;
	Class.Scope.PROTECTED =  0;
	Class.Scope.PRIVATE	  = -1;
	
	Class.Scope.prototype.checkCallingFunction = function(callingFunction){
		switch (this.level) {
			case Class.Scope.PUBLIC:
				return true;
				break;
			case Class.Scope.PROTECTED:
				callingFunction.parentType = callingFunction.parentType || {};
				if (this.parent instanceof Class.Method) {
					if (this.parent.isStatic) {
						var something = callingFunction.parentType;
						while (something) {
							if (something == this.parent.parentType) return true;
							something = something.Extends || false;
						}
						throw new ScopeFatal('Cannot access protected method');
					} else if (this.parent.parentType.id != callingFunction.parentType.id) {
						throw new ScopeFatal('Cannot access protected method');
					}
				} else {
					if (this.parent.parentType) {
						var type = callingFunction.parentType;
						while (type) {
							if (this.parent.parentType == type) return true;
							type = type.Extends || false;
						}
						throw new ScopeFatal('Cannot access protected property');
					} else if (this.parent.parent.id != callingFunction.parentType.id) {
						throw new ScopeFatal('Cannot access protected property');
					}
				}
				break;
			case Class.Scope.PRIVATE:
				if (this.parent instanceof Class.Method) {
					if (this.parent.parentType != callingFunction.parentType) {
						throw new ScopeFatal('Cannot access private property');
					}
				} else {
					var parentType = (this.parent.parentType)
						? this.parent.parentType
						: this.parent.parent.type;
					if (parentType != callingFunction.parentType) {
						throw new ScopeFatal('Cannot access private property');
					}
				}
		} 
	}
	
})();