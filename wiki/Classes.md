## Declaring and instantiating

A class is defined as a name and any number of properties, methods, events and constants. Specifically, a class can be declared by passing `class SomeName` and an object literal to the global `define` function.

```javascript
define(

'class MyClass',
{
    
    // ... class members
    
});
```

Instances of this class can then be created, or *instantiated*, by using the JavaScript keyword `new`.

```javascript
var myClassInstance = new MyClass();
console.log(myClassInstance instanceof MyClass); // true
```

> *By convention, class names should begin with a capital letter and be PascalCased. Class instances, or indeed any variable, should begin with a lower-case letter and be camelCased.*

## Under the covers

If you were to run the above class declaration in your browser, and use a developer toolkit to inspect what was going on, you would see that a new function has been created, named MyClass, in the global object (`window`, in the case of web browsers).

This class, as it has no functionality so far, is the same as the following vanilla JavaScript snippet; it creates a function in the global namespace which can be instantiated using the `new` keyword.

```javascript
MyClass = function(){};
// Or specifically...
window.MyClass = function(){};
```

> *You won't want to create all your classes in the global object and there is a simple way around this. See [[Namespacing]].*

## Members

Of course, classes are completely useless without one or many members; that is, properties, methods, events and constants.

The object you created when declaring the class will define these. Each object key is the signature for that member and the corresponding value is a relevant value for that type of member:

```javascript
define(

'class MyClass', {
    
    'member signature': 'Some member value (can be different types based on the member type)'
    
});
```

Picket will determine the type of member that you are declaring based on the format of the signature, like in the examples below.

```javascript
define(

'class MyClass', {
    
    // Picket knows this is a property because
    // of the formatting of the signature
    'public favouriteNumber (number)': 10,
    
    // Picket recognises this as a method.
    // It will error if the value is
    // anything except a function.
    'public doSomethingGreat () -> undefined': function(){},
    
    // Event signatures contain the word
    // 'event'. Note that even though no
    // value is needed by Picket, one
    // is provided as this needs to be a
    // valid JavaScript object
    'public event somethingGreatHappened ()': undefined,
    
    // Constants are declared
    // with the keyword 'constant'
    'public constant TAU (number)': 6.28

});
```

> *As we are providing a valid JavaScript literal object to the define function, remember to put a comma between each member.*

For specific details on each member type, see the documentation for [[Properties]], [[Methods]], [[Events]] and [[Constants]].

## Further information

For more information on declaring classes, see the documentation for the following sections:

* [[Namespacing]]
* [[Constructors]]
* [[Inheritance]]
* [[Abstract classes]]