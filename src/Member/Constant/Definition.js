;(function(Picket, Member, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(public|protected|private)\\s+constant\\s+([A-Z][A-Z_]*)' +
			'(?:\\s+\\((?:\\s+)?([A-Za-z0-9.-\\[\\]]+)(?:\\s+)?\\))?(?:\\s+)?$'
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
	window.Picket = window.Picket || {},
	window.Picket.Member = window.Picket.Member || {},
	window.Picket.Member.Constant = window.Picket.Member.Constant || {}
);
