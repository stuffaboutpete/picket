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
			'^(?:\\s+)?(public|protected|private)\\s+([A-Za-z][A-Za-z0-9.]*)\\s+' +
			'\\((?:\\s+)?([A-Za-z][A-Za-z0-9.\\[\\]|]*)(?:\\s+)?\\)(?:\\s+)?$'
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
		this._typeIdentifier = signatureMatch[3];
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.getAccessTypeIdentifier = function()
	{
		return this._accessTypeIdentifier;
	};
	
	_.Definition.prototype.getTypeIdentifier = function()
	{
		return this._typeIdentifier;
	};
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Property = window.ClassyJS.Member.Property || {}
);
