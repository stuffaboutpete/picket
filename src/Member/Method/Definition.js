;(function(ClassyJS, Member, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(?:(static|abstract)(?:\\s+))?(?:(static|abstract)(?:\\s+))?' +
			'(public|protected|private)\\s+(?:(static|abstract)(?:\\s+))?' +
			'(?:(static|abstract)(?:\\s+))?([a-z][A-Za-z0-9.]*)(?:\\s+)?' +
			'\\(([A-Za-z0-9,:.\\s\\[\\]{}?=]*)\\)\\s+->\\s+([A-Za-z0-9.[\\]]+)(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal(
				'SIGNATURE_NOT_RECOGNISED',
				'Provided signature: ' + signature
			);
		}
		this._name = signatureMatch[6];
		this._accessTypeIdentifier = signatureMatch[3];
		this._returnTypeIdentifier = signatureMatch[8];
		var staticAbstracts = [
			signatureMatch[1],
			signatureMatch[2],
			signatureMatch[4],
			signatureMatch[5]
		];
		this._isStatic = staticAbstracts.indexOf('static') > -1 ? true : false;
		this._isAbstract = staticAbstracts.indexOf('abstract') > -1 ? true : false;
		if (signatureMatch[7] == '') {
			this._argumentTypeIdentifiers = [];
			this._argumentDefaultValues = [];
		} else {
			var arguments = signatureMatch[7].replace(/\s+/g, '').split(',');
			this._argumentTypeIdentifiers = [];
			this._argumentDefaultValues = [];
			var optionalArgumentRegex = new RegExp(
				'^(?:[A-Za-z0-9.\\[\\]]*(\\?)|(string|number|boolean|object|' +
				'array|\\[[A-Za-z0-9.]+\\])\\s*=\\s*([A-Za-z0-9.{}\\[\\]]+))$'
			);
			var foundOptionalArgument = false;
			for (var i = 0; i < arguments.length; i++) {
				var optionalArgumentMatch = optionalArgumentRegex.exec(arguments[i]);
				if (optionalArgumentMatch === null) {
					if (foundOptionalArgument) {
						throw new _.Definition.Fatal(
							'INVALID_ARGUMENT_ORDER',
							'Provided signature: ' + signature
						);
					}
					this._argumentTypeIdentifiers.push(arguments[i]);
					this._argumentDefaultValues.push(undefined);
				} else if (optionalArgumentMatch[1]) {
					foundOptionalArgument = true;
					this._argumentTypeIdentifiers.push(
						arguments[i].substr(0, arguments[i].length-1)
					);
					this._argumentDefaultValues.push(null);
				} else if (optionalArgumentMatch[2] && optionalArgumentMatch[3]) {
					foundOptionalArgument = true;
					var type = optionalArgumentMatch[2];
					var value = optionalArgumentMatch[3];
					if (type == 'string') {
						this._argumentTypeIdentifiers.push(type);
						this._argumentDefaultValues.push(value);
					} else if (type == 'number') {
						if (parseFloat(value) + '' !== value) {
							var throwInvalidArgumentDefault = true;
						}
						this._argumentTypeIdentifiers.push(type);
						this._argumentDefaultValues.push(parseFloat(value));
					} else if (type == 'boolean') {
						this._argumentTypeIdentifiers.push(type);
						if (value == 'true') {
							this._argumentDefaultValues.push(true);
						} else if (value == 'false') {
							this._argumentDefaultValues.push(false);
						} else {
							var throwInvalidArgumentDefault = true;
						}
					} else if (type == 'array' || type.match(/^\[[A-Za-z0-9.]+\]$/)) {
						if (value == '[]') {
							this._argumentTypeIdentifiers.push(type);
							this._argumentDefaultValues.push([]);
						} else {
							var throwInvalidArgumentDefault = true;
						}
					} else if (type == 'object') {
						if (value == '{}') {
							this._argumentTypeIdentifiers.push(type);
							this._argumentDefaultValues.push({});
						} else {
							var throwInvalidArgumentDefault = true;
						}
					} else {
						var throwInvalidArgumentDefault = true;
					}
					if (throwInvalidArgumentDefault) {
						throw new _.Definition.Fatal(
							'INVALID_ARGUMENT_DEFAULT',
							'Argument type: ' + type + '; Provided value: ' + value
						);
					}
				}
			}
		}
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.getAccessTypeIdentifier = function()
	{
		return this._accessTypeIdentifier;
	};
	
	_.Definition.prototype.isStatic = function()
	{
		return this._isStatic;
	};
	
	_.Definition.prototype.isAbstract = function()
	{
		return this._isAbstract;
	};
	
	_.Definition.prototype.getArgumentTypeIdentifiers = function()
	{
		return this._argumentTypeIdentifiers;
	};
	
	_.Definition.prototype.getReturnTypeIdentifier = function()
	{
		return this._returnTypeIdentifier;
	};
	
	_.Definition.prototype.argumentIsOptional = function(index)
	{
		return this._argumentDefaultValues[index] !== undefined;
	};
	
	_.Definition.prototype.getDefaultArgumentValue = function(index)
	{
		return this._argumentDefaultValues[index];
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Method = window.ClassyJS.Member.Method || {}
);
