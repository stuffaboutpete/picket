(function(_){
	
	_.TypeChecker = function(){};
	
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
			var match = type.match(/^(.+)\[\]$/);
			if (match) {
				for (var i in value) if (!this.isValidType(value[i], match[1])) return false;
				return true;
			}
			return (type == 'array' || type == 'mixed');
		}
		if (type === 'mixed') return true;
		if (value === null) return (type == 'null');
		if (typeof value == type) return true;
		if (typeof value == 'object'
		&&	typeof value.conformsTo == 'function'
		&&	value.conformsTo(type)) return true;
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
