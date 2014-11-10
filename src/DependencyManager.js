var Calc = function(initialValue){
	this.value = initialValue || 0;
};

Calc.prototype.out = function(){
	return this.value;
};

Calc.prototype.add = function(number){
	this.value = this.value + number;
	return this;
};

Calc.prototype.minus = function(number){
	this.value = this.value - number;
	return this;
};
