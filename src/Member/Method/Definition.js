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
			'\\(([A-Za-z0-9,:.\\s\\[\\]]*)\\)\\s+->\\s+([A-Za-z0-9.[\\]]+)(?:\\s+)?$'
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
		} else {
			this._argumentTypeIdentifiers = signatureMatch[7].replace(/\s+/g, '').split(',');
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
	
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {},
	window.ClassyJS.Member.Method = window.ClassyJS.Member.Method || {}
);
