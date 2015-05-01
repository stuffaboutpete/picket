(function(_){
	
	_.TypeChecker = function(reflectionFactory)
	{
		if (!(reflectionFactory instanceof ClassyJS.TypeChecker.ReflectionFactory)) {
			throw new _.TypeChecker.Fatal(
				'NO_REFLECTION_FACTORY_PROVIDED',
				'Provided type: ' + typeof reflectionFactory
			);
		}
		this._reflectionFactory = reflectionFactory;
	};
	
	_.TypeChecker.prototype.isValidType = function(value, type)
	{
		if (typeof type != 'string') {
			throw new _.TypeChecker.Fatal('NON_STRING_TYPE_IDENTIFIER');
		}
		if (type.match(/\|(?![^\[]*\])/)) {
			var types = type.split(/\|(?![^\[]*\])/);
			for (var i = 0; i < types.length; i++) {
				if (this.isValidType(value, types[i]) === true) return true;
			}
			return false;
		}
		if (Object.prototype.toString.call(value) == '[object Array]') {
			var match = type.match(/^\[(.+)\]$/);
			if (match) {
				for (var i in value) if (!this.isValidType(value[i], match[1])) return false;
				return true;
			}
			return (type == 'array' || type == 'mixed');
		}
		if (type === 'mixed') return true;
		if (value === null) return (type == 'null');
		if (typeof value == type) return true;
		if (typeof value == 'object') {
			try {
				var reflectionClass = this._reflectionFactory.buildClass(value);
				if (reflectionClass.implementsInterface(type)) return true;
			} catch (error) {
				if (!(error instanceof Reflection.Class.Fatal)
				||  error.code != 'CLASS_DOES_NOT_EXIST') {
					throw error;
				}
			}
		}
		var typeParts = type.split('.');
		var namespace = window;
		do {
			var nextTypePart = typeParts.shift();
			if (typeof namespace[nextTypePart] == 'undefined') return false;
			namespace = namespace[nextTypePart];
		} while (typeParts.length);
		return value instanceof namespace;
	};
	
	_.TypeChecker.prototype.areValidTypes = function(values, types)
	{
		if (Object.prototype.toString.call(values) != '[object Array]') {
			throw new _.TypeChecker.Fatal(
				'NON_ARRAY_VALUES',
				'Provided type: ' + typeof values
			);
		}
		if (Object.prototype.toString.call(types) != '[object Array]') {
			throw new _.TypeChecker.Fatal(
				'NON_ARRAY_TYPES',
				'Provided type: ' + typeof types
			);
		}
		if (values.length != types.length) {
			throw new _.TypeChecker.Fatal(
				'VALUE_TYPE_MISMATCH',
				'Values length: ' + values.length + ', Types length: ' + types.length
			);
		}
		for (var i = 0; i < values.length; i++) {
			if (!this.isValidType(values[i], types[i])) return false;
		}
		return true;
	};
	
})(window.ClassyJS = window.ClassyJS || {});
