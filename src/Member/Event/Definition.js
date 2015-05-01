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
			'^(?:\\s+)?(public|protected)\\s+event\\s+([a-z][A-Za-z0-9]*)(?:\\s+)?' +
			'\\(([A-Za-z0-9,.\\s\\[\\]|]*)\\)(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal(
					'SIGNATURE_NOT_RECOGNISED',
					'Provided signature: ' + signature
				);
		}
		this._name = signatureMatch[2];
		this._accessTypeIdentifier = signatureMatch[1];
		this._argumentTypeIdentifiers = [];
		if (signatureMatch[3] == '') return;
		var argumentTypeIdentifiers = signatureMatch[3].replace(/\s+/g, '').split(',');
		for (var i in argumentTypeIdentifiers) {
			if (!argumentTypeIdentifiers[i].match(/^[A-Za-z0-9.\[\]|]+$/)) {
				throw new _.Definition.Fatal(
					'SIGNATURE_NOT_RECOGNISED',
					'Provided signature: ' + signature
				);
			}
			this._argumentTypeIdentifiers.push(argumentTypeIdentifiers[i]);
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
	
	_.Definition.prototype.getArgumentTypeIdentifiers = function()
	{
		return this._argumentTypeIdentifiers;
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Event = window.ClassyJS.Member.Event || {}
);
