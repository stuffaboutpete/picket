Static methods are methods which exist on classes as opposed to class instances. This means that a class does not have to be instantiated in order to utilise the method. Static methods are declared using the keyword `static` in the method signature.

```javascript
define(

'class MyClass',
{
    
    'public static getString () -> string': function()
    {
        return 'A string';
    }
    
});
```

```javascript
// Note that no new class instance is created
var myString = MyClass.getString();
console.log(myString); // A string
```

## Calling static methods from other methods

Static methods can be called either by other static methods or by non-static methods as demonstrated below.

```javascript
define(

'class MyClass',
{
    
    'public static getString () -> string': function()
    {
        return 'A string';
    },
    
    'public static callOtherMethod () -> string': function()
    {
        return MyClass.getString();
    },
    
    'public callStaticMethod () -> string':function()
    {
        return MyClass.getString();
    }
    
});
```

```javascript
MyClass.callOtherMethod(); // A string
new MyClass().callStaticMethod(); // A string
```

## Understanding `this`

Within a static method, `this` refers to the current class, as opposed to a class instance. This means a static method which calls another can either refer to it by class name or by `this`.

```javascript
'class MyClass',
{
    
    'public static getString () -> string': function()
    {
        return 'A string';
    },
    
    'public static callOtherMethod () -> undefined': function()
    {
        // The following two lines are equivalent
        MyClass.getString();
        this.getString();
    }
    
});
```

## Inheritance and access modifiers

Like non-static methods, static methods are shared across classes related by inheritance. This means that a method can be called against a class when the method was defined on its parent.

```javascript
define(

'class MyParent',
{
    
    'public static getString () -> string': function()
    {
        return 'A string';
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    //
    
});
```

```javascript
MyChild.getString(); // A string
```

Like all other class members, static methods adhere to `public`, `protected` and `private` rules where private methods are available only to the defining class, protected methods are available to classes related by inheritance and public methods are available to all.