;(function(TypeDefinition, Type, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		if (!signature.match(/\binterface\b/)) {
			throw new _.Definition.Fatal('MISSING_KEYWORD_INTERFACE');
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?interface(?:\\s+)?([A-Z](?:[A-Za-z0-9.]*)?)(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal('SIGNATURE_NOT_RECOGNISED');
		}
		this._name = signatureMatch[1];
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Type = window.ClassyJS.Type || {},
	window.ClassyJS.Type.Interface = window.ClassyJS.Type.Interface || {}
);
