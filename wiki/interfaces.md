An interface is a description of a class. More specifically, it lists the method signatures a class must implement in order for that class to be considered an instance of the interface. In this way, one class can rely on another even before the second class has been written.

It is an important object-oriented programming principle to [program to interfaces instead of implementations](https://www.google.co.uk/search?q=program%20to%20interfaces%20not%20implementations&rct=j). Any class which has dependencies should define its dependencies as interfaces and allow other classes to implement the interfaces. *Any class that implements a dependency interface will behave as is expected by the parent class.*

## Defining an interface

Interfaces are defined by passing a name and an array of signatures to the global `define` function.

```javascript
define(

'interface IMyInterface',
[
    
    'public doSomething () -> undefined',
    'public doSomethingElse (string) -> number'
    
]);
```

In this example, IMyInterface specifies that implementing classes must have at least two methods; one named `doSomething` which takes no arguments and returns `undefined`, and another named `doSomethingElse` which takes a string and returns a number.

> *By convention, interface names should begin with an uppercase 'I' followed by a PascalCased name. However, this is not strictly enforced.*

## Implementing an interface

A class can declare its intention to implement an interface by specifying so in the class signature.

```javascript
define(

'class MyClass implements IMyInterface',
{
    
    // ... class members
    
});
```

When a class which claims to implement an interface is instantiated, Picket will check that it does indeed do what it says it does; it will verify that each method exists on the class with a matching signature. If the class does not implement the interface correctly, instantiation will result in an error.

```javascript
define(

'interface IMyInterface',
[
    
    'public doSomething () -> undefined'
    
]);
```

```javascript
define(

'class MyClass implements IMyInterface',
{
    
    // No implementation of 'doSomething'
    
});
```

```javascript
new MyClass(); // ERROR
```

## Type hinting

Any member which utilises type hinting can depend on an interface type instead of either a class type or primitive type. This means for example that a constructor could specify a single argument type which is an interface name. Any time an instance of this class is created, an instance of the interface must be provided. Failure to do so would result in an error, just as if the constructor had wanted a string and had not been provided with one.

This is where the power of an interface becomes apparent; the class constructor now knows how it can interact with its single argument because that behaviour is defined in the interface it implements. If the interface states that there is a method called `convertNumberToString` which accepts a number and returns a string, then the class can be sure that it is safe to call that method with a number and that the value it retrieves back is a string. More accurately, it can be sure that an error will be triggered if anything is not doing what it should be.

```javascript
define(

'interface INumberConverter',
[
    
    'public convertNumberToString (number) -> string'
    
]);
```

```javascript
define(

'class MyNumberConverter implements INumberConverter',
{
    
    'public convertNumberToString (number) -> string': function(number)
    {
        // This implementation could be more useful
        return 'Four';
    }
    
});
```

```javascript
define(

'class MyController',
{
    
    'public construct (INumberConverter) -> undefined': function(numberConverter)
    {
        
        // Here, we can be confident that the
        // numberConverter argument has a method
        // named convertNumberToString that will
        // accept a number and return a string
        
        numberConverter.convertNumberToString(4); // Four
        
    }
    
});
```

```javascript
// This number converter could be any
// class that implements INumberConverter
var numberConverter = new MyNumberConverter();
new MyController(numberConverter);
```

## Namespacing

Just like classes, interfaces can be namespaced by including one or more dots in the name. Unlike classes, this has no effect on the global object or any of its descendants so there is no risk of clashes with other libraries. However, this is useful for your own organisation and for implying assocations between classes and interfaces.

```javascript
define(

'interface MyNamespace.Application.Controller.Api.IEndpoint',
[

    // ... interface members

]);
```

```javascript
define(

'class MyNamespace.Application.Controller.Api.SimpleEndpoint implements MyNamespace.Application.Controller.Api.IEndpoint',
{

    // ... class members including interface members

});
```