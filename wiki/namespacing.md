## Global objects

A simple class declaration like the following will create an object in the global namespace object (`window` in the case of browsers).

```javascript
define(

'class MyClass',
{
    
    // ... class members
    
});
```

## Namespacing

It is best practise, generally speaking, to avoid creating global variables wherever possible. A much more suitable approach is to create all of your classes in one single location within the global namespace. In Picket, this is done by specifying your class name as a namespaced string, using dots to separate each level of namespace:

```javascript
define(

'class MyNamespace.SomeClass',
{
    
    // ... class members
    
});
```

In this example, we have created one global object, `MyNamespace` and within that, we have declared a class named `SomeClass`.

> *Always try to make a library or project under a single namespace which clearly identifies the project. This reduces the likelihood of class name clashes with other projects.*

## Instantiating namespaced classes

In order to create an instance of a namespaced class, use the same dot notation whilst using the `new` keyword.

```javascript
var someObject = new MyNamespace.SomeClass();
console.log(someObject instanceof MyNamespace.SomeClass); // true
```

## Under the covers

If you were to run this class declaration in a browser and inspect the results, you would see that one entry, a JavaScript object, has indeed been made in the global `window` object and within that, there is a single function named `SomeClass`.

## Nesting namespaces

There is no limit to how many levels of nesting can be performed. Simply add dots as you need.

```javascript
define(

'class MyNamespace.Application.Controller.Api.SimpleEndpoint',
{
    
    // ... class members
    
});
```

Nested classes can be instantiated using the same dot notation:

```javascript
var myEndpoint = new MyNamespace.Application.Controller.Api.SimpleEndpoint();
console.log(myEndpoint instanceof MyNamespace.Application.Controller.Api.SimpleEndpoint); // true
```