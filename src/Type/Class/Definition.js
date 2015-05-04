;(function(Picket, Type, _){
	
	_.Definition = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.Definition.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		if (!signature.match(/\bclass\b/)) throw new _.Definition.Fatal('MISSING_KEYWORD_CLASS');
		var signatureRegex = new RegExp(
			'^(?:\\s+)?(?:(abstract)\\s+)?class\\s+([A-Z][A-Za-z0-9.]*)' +
			'(?:\\s+extends\\s+([A-Z][A-Za-z0-9.]*))?' +
			'(?:\\s+implements\\s+([A-Z][A-Za-z0-9., \\t]*))?(?:\\s+)?$'
		);
		var signatureMatch = signatureRegex.exec(signature);
		if (!signatureMatch) {
			throw new _.Definition.Fatal('SIGNATURE_NOT_RECOGNISED');
		}
		this._isAbstract = (signatureMatch[1]) ? true : false;
		this._name = signatureMatch[2];
		this._parent = signatureMatch[3];
		this._interfaces = (signatureMatch[4]) ? signatureMatch[4].replace(/\s+/g, '').split(',') : [];
	};
	
	_.Definition.prototype.getName = function()
	{
		return this._name;
	};
	
	_.Definition.prototype.isAbstract = function()
	{
		return this._isAbstract;
	};
	
	_.Definition.prototype.isExtension = function()
	{
		return (this._parent) ? true : false;
	};
	
	_.Definition.prototype.getParentClass = function()
	{
		return this._parent;
	};
	
	_.Definition.prototype.getInterfaces = function()
	{
		return this._interfaces;
	};
	
})(
	window.Picket = window.Picket || {},
	window.Picket.Type = window.Picket.Type || {},
	window.Picket.Type.Class = window.Picket.Type.Class || {}
);
