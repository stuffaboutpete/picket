A class's properties are what hold its 'state'. This essentially means they hold the difference between two or more instances of the same class. For example, all `Person`s have properties such as name, age and height which describes the differences between them. Methods can also change the way they work based on the current property values of the object.

> *Think of properties as adjectives and methods as verbs.*

```javascript
define(

'class Person',
{

    'public name (string)': null,
    'public age (number)': null,
    'public height (number)': null,
    // ...

});
```

```javascript
var pete = new Person();
pete.name('Pete');
pete.age(30);
pete.height(175);

var lucy = new Person();
lucy.name('Lucy');
lucy.age(30);
lucy.height(172);
```

## Setting and getting values

Setting and getting values in Picket is done by calling a simple function of the same name as the property. The function takes either one or zero arguments depending on whether the value is being set or retrieved; to set the value of a property, provide a value, to get the value of a property, provide no value.

```javascript
var pete = new Person();
pete.age(30);
console.log(pete.age()); // 30
```

## Property types

A property is defined as a certain type and the value it holds must match the specified type. This is checked when the value is set and providing a non-matching type will trigger an error.

```javascript
define(

'class Person',
{

    'public name (string)': null

});
```

```javascript
var pete = new Person();
pete.name('Pete'); // No problem
pete.name(007); // ERROR
```

Rules on what can be specified as a property's type are the same as any other place where type hinting exists. Details can be found [here](Type hinting).

## Signature format

In order for Picket to identify a class member as a property, it must have a recognisable signature. The format for this is shown below:

```
'accessModifier name (type)'
```

The access modifier must be one of `public`, `private` or `protected`. There is more on this below.

The name is simply the name of the property and is used to identify it when setting or getting the value.

The type limits what sorts of values can be set and is covered above.

## Initial value

A property can have an optional initial value which is written as the corresponding value in the class declaration object. The initial value must be **either** a valid value for the type specified **or** `null`.

```javascript
define(

'class Square',
{

    'public sideLength (number)': 10

});
```

In this case, when no value is set for the `sideLength`, its value would be the initial value.

```javascript
var square = new Square();
console.log(square.sideLength()); // 10
```

As it may not make sense for a property to have an initial value (e.g. the name of a `Person`), `null` can be provided. This is the only value that a property can have that does not match its specified type. It is also the only time a property can be set to null as specifically setting a value to `null` after object creation is not valid and will result in an error.

This means that when considering type safety in your code, you only need to check that a value is not `null` before you can be confident it is of the declared property type. If a non-`null` value is used as the initial value then you can always assume the property is of the declared type and it can never be `null`.

```javascript
define(

'class Person',
{

    'public name (string)': null

});
```

```javascript
var pete = new Person();
console.log(pete.name()); // null
pete.name('Pete');
pete.name(null); // ERROR
```

## Access modifiers

A class property can specify its access modifier as `public`, `private` or `unprotected`. This affects what code is allowed to set and get its value.

If a property is specified as `public`, any code which has access to an instance of the class can set and get the value. This means, the class the property is declared in, any ancestor or descendant classes and any code outside of the class.

If a property is specified as `private`, only code within the declaring class is able to set and get the property. Classes related by inheritance or code outside of the class will trigger an error if they attempt to manipulate the property.

If a property is specified as `protected`, code within the declaring class or classes related by inheritance can set and get the property. Any code outside of the class cannot manipulate the property and attempting to do so would trigger an error.

```javascript
define(

'class MyParent',
{

    'public publicProperty (string)': 'Public property',
    'protected protectedProperty (string)': 'Protected property',
    'private privateProperty (string)': 'Private property',
    
    'public construct () -> undefined': function()
    {
        this.publicProperty(); // Public property
        this.protectedProperty(); // Protected property
        this.privateProperty(); // Private property
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{

   'public accessProperties () -> undefined': function()
    {
        this.publicProperty(); // Public property
        this.protectedProperty(); // Protected property
        this.privateProperty(); // ERROR
    }
    
});
```

```javascript
var myChild = new MyChild();
myChild.publicProperty(); // Public property
myChild.protectedProperty(); // ERROR
myChild.privateProperty(); // ERROR
```