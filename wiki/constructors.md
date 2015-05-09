A class's constructor is an optional [method](Methods) which is called when the class is instantiated.

```javascript
define(

'class MyClass',
{
    
    'public construct ()': function()
    {
        alert('Constructing!');
    }
    
});
```

With this constructor in place, creating an object will result in the phrase `Constructing!` being alerted.

```javascript
new MyClass(); // Constructing!
```

## Providing arguments

If your constructor is defined to take arguments, they can be provided whilst calling the `new` operator like below.

```javascript
define(

'class MyClass',
{
    
    'public construct (string, number)': function(stringVar, numberVar)
    {
        // ...
    }
    
});
```

```javascript
new MyClass('ten', 10);
```

If your class has a constructor, any non-optional arguments must be provided. Not doing so will result in an error.

> *Note that the return type specified in a constructor is irrelevant as the new class instance is returned regardless of what the constructor states. However, whatever return type you specify must be adhered to, even though this value will never be passed to the user. It is recommended that you specify the return type as `undefined` and do not specify a `return` statement.*

> *This behaviour is likely to change in a future version of Picket, when return types for constructors will be removed.*

## Constructor overloading

Like any method, the constructor can be [overloaded](Overloading), meaning that multiple can be declared with different argument types. The correct constructor will be chosen based on the arguments provided.

```javascript
define(

'class Person',
{
    
    'public construct (string, string)': function(firstName, secondName)
    {
        // ...
    },
    
    'public construct (string)': function(fullName)
    {
        // ...
    }
    
});
```

A `Person` can now be created with either a single string or two strings. **Only** the relevant constructor is called.

```javascript
var joe = new Person('Joe', 'Bloggs');
var jane = new Person('Jane Bloggs');
```