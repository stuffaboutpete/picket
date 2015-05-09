A class's methods are what allow it to 'do' things; they define all the behaviour that a class can exhibit. They are defined as a method signature and JavaScript function provided as a key/value pair in a class's definition object.

```javascript
define(

'class MyClass',
{

    'public doSomething () -> undefined': function()
    {
        // Do something!
    }
    
});
```

## Signature format

Picket will recognise a method from its signature if it matches the following format:

```
'accessModifier name (comma, separated, argument, types) -> returnType'
```

The access modifier must be one of `public`, `private` or `protected`. There is more on this below.

The name is simply an identifier used to call the method later.

The argument types, as described below, define what kind of variables can be passed into the method, whilst the return type describes what kind of variable can be passed back out again.

### Implied `undefined` return type

A method can omit the return type and the proceeding arrow (`->`) to imply that the return type is `undefined`.

```javascript
'public myMethod ()': function(){}
```

In order for Picket to distinguish between methods with an implied return type and properties (as their signatures are very similar), implied return types can only be specified when a function body is supplied. This means that you cannot use an implicit return type inside an [interface](Interfaces) or as part of an [abstract member](Abstract classes).

## Calling methods

Methods are called in the same way as native JavaScript methods, simpy refering to them by the name specified in the method signature:

```javascript
var myObject = new MyClass();
myObject.doSomething();
```

## Passing arguments

If a method specifies one or more argument types in its signature, they can be provided, again, as you would with native JavaScript objects:

```javascript
define(

'class MyClass',
{

    'public doSomething (number, string)': function(numberArg, stringArg)
    {
        // Do something!
    }
    
});
```

```javascript
var myObject = new MyClass();
myObject.doSomething(10, 'ten');
```

## Returning values

As with any native JavaScript method, a value can be returned using the `return` keyword. This value is passed to the line which invoked the method so that it can be saved or further processed.

```javascript
define(

'class MyClass',
{

    'public getString () -> string': function()
    {
        return 'A string';
    }
    
});
```

```javascript
var myObject = new MyClass();
var myString = myObject.getString();
console.log(myString); // A string
```

## Type hinting

You may have noticed in the examples above mentions of `string`s, `number`s and `undefined`s in the method signatures. These are type hints and declare strict rules about what type of variables can be passed into and out of a method.

There are two types of hint in method signatures; argument type hints and return type hints. Argument types appear as a comma-separated list inside the parentheses and match the number of arguments the method is expected to accept. There is only one return type and it appears after the right arrow, `->`. This specifies what type of variable can be after the `return` keyword within the method function.

There are a number of types that can be hinted at and more information can be found [here](Type hinting).

```javascript
define(

'class MyClass',
{

    'public swapNumberForString (number) -> string': function(numberArg)
    {
        // This method accepts a number
        // and returns a string...
        return 'A string';
    }
    
});
```

If either the wrong series of arguments are supplied, or if the method returns the wrong type of variable, Picket will throw an error.

An argument type error will be triggered from the example below.

```javascript
var myObject = new MyClass();
myObject.swapNumberForString('string'); // ERROR - Method expects a number
```

## Access modifiers

As with all class members in Picket, `public`, `private` and `protected` access modifiers define which code can utilise methods.

Simply put, public methods can be called by any code, private methods can only be called by code within the same class and protected methods can be called by any class related to the method by inheritance.

```javascript
define(

'class MyParent',
{

    'public publicMethod () -> string': function()
    {
        return 'Public method';
    },
    
    'protected protectedMethod () -> string': function()
    {
        return 'Protected method';
    },
    
    'private privateMethod () -> string': function()
    {
        return 'Private method';
    },
    
    'public construct ()': function()
    {
        this.publicMethod(); // Public method
        this.protectedMethod(); // Protected method
        this.privateMethod(); // Private method
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{

   'public accessMethods ()': function()
    {
        this.publicMethod(); // Public method
        this.protectedMethod(); // Protected method
        this.privateMethod(); // ERROR
    }
    
});
```

```javascript
var myChild = new MyChild();
myChild.publicMethod(); // Public method
myChild.protectedMethod(); // ERROR
myChild.privateMethod(); // ERROR
```

## Further information

For more information on methods, see the following articles:

* [[Overloading]]
* [[Optional arguments]]
* [[Static methods]]
* [[Method proxying]]