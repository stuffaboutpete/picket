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
	
	Class.Scope.prototype.checkCallingFunction = function(callingFunction){
		switch (this.level) {
			case Class.Scope.PUBLIC:
				return true;
				break;
			case Class.Scope.PROTECTED:
				callingFunction.parentType = callingFunction.parentType || {};
				if (this.parent instanceof Class.Method) {
					if (this.parent.parentType.id != callingFunction.parentType.id) {
						throw new ScopeFatal(
							'Cannot access protected method \'' + this.parent.name + '\''
						);
					}
				} else {
					if (this.parent.parent.id != callingFunction.parentType.id) {
						throw new ScopeFatal(
							'Cannot access protected property \'' + this.parent.name + '\''
						);
					}
				}
				break;
			case Class.Scope.PRIVATE:
				if (this.parent instanceof Class.Method) {
					if (this.parent.parentType != callingFunction.parentType) {
						throw new ScopeFatal(
							'Cannot access private property \'' + this.parent.name + '\''
						);
					}
				} else {
					if (this.parent.parent.type != callingFunction.parentType) {
						throw new ScopeFatal(
							'Cannot access private property \'' + this.parent.name + '\''
						);
					}
				}
		} 
	}
	
})();