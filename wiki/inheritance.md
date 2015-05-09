## Inheriting from a parent class

A class can optionally inherit from one other class by specifying the relationship in the class signature. This means that any instance of the child class will be an instance of the child, the parent and any ancestor of the parent.

```javascript
define(

'class MyParent',
{
    
    // ...
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    // ...
    
});
```

```javascript
var myChild = new MyChild();
console.log(myChild instanceof MyChild); // true
console.log(myChild instanceof MyParent); // true
```

## Utilising parent members

A child class will automatically inherit *some* behaviour from its parent. Specifically, it will inherit behaviour marked as `public` or `protected` (see access modifiers section). In the example below, the parent method and property are both available as though they were defined on the child. The method and property defined on the child however, will only be available to instances of the child class.

```javascript
define(

'class MyParent',
{
    
    'public parentProperty (string)': 'Parent',
    
    'public sayHiFromParent () -> string': function()
    {
        return 'Hi, from Parent!';
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    'public childProperty (string)': 'Child',
    
    'public sayHiFromChild () -> string': function()
    {
        return 'Hi, from Child!';
    }
    
});
```

```javascript
var myChild = new MyChild();
console.log(myChild.parentProperty()); // 'Parent'
console.log(myChild.sayHiFromParent()); // 'Hi, from Parent!'
console.log(myChild.childProperty()); // 'Child'
console.log(myChild.sayHiFromChild()); // 'Hi, from Child!'

var myParent = new MyParent();
console.log(myChild.parentProperty()); // 'Parent'
console.log(myChild.sayHiFromParent()); // 'Hi, from Parent!'
console.log(myChild.childProperty()); // ERROR
console.log(myChild.sayHiFromChild()); // ERROR
```

## Understanding `this`

Within a class, `this` refers to the current instance of the class. When using inheritance, the meaning of `this` does not change; it still refers to the class instance, however the instance is now considered to have all the behaviour of its parent class and any other ancestor class. Therefore, when using inheritance, `this` can be used to invoke code in a parent class.

In the example below, the child class calls a method in the parent class by referring to it as `this`.

```javascript
define(

'class MyParent',
{
    
    'public getID () -> string': function()
    {
        return "'this' example";
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    'public getUpperCasedID () -> string': function()
    {
        return this.getID().toUpperCase();
    }
    
});
```

```javascript
var myChild = new MyChild();
console.log(myChild.getUpperCasedID()); // 'THIS' EXAMPLE
```

## Access modifiers

In Picket, all members are specified with one of the three access modifiers: `public`, `private` or `protected`.

Public members are available to any code which has access to an object instance. That is, the class they are defined in, any class that inherits from it and any client code which can 'see' the object instance. In terms of methods, this means anyone can call a public method; in terms of properties, anyone can get or set the value of the property.

Private members are the opposite end of the scale with respect to their availability; only code within the class which defines them can access them. A private method cannot be called by any other class and a private property cannot be accessed by any other class.

Protected members are very similar to private members in that they do not expose functionality to code outside of the object they are defined in. They do, however, allow functionality to be shared betweens classes related by inheritance. That means that a protected method can be called by a child or parent class and a protected property can also be accessed by a child or parent.

```javascript
define(

'class MyParent',
{
    
    'public publicMethod ()': function()
    {
        // ...
    },
    
    'protected protectedMethod ()': function()
    {
        // ...
    },
    
    'private privateMethod ()': function()
    {
        // ...
    },
    
    'public construct ()': function()
    {
        this.publicMethod(); // No problem
        this.protectedMethod(); // No problem
        this.privateMethod(); // No problem
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    'public callMethods ()': function()
    {
        this.publicMethod(); // No problem
        this.protectedMethod(); // No problem
        this.privateMethod(); // ERROR
    }
    
});
```

```javascript
var myChild = new MyChild();
myChild.publicMethod(); // No problem
myChild.protectedMethod(); // ERROR
myChild.privateMethod(); // ERROR
```

## Over-riding parent members

A child class can specify a member with the same name as a parent member. When this occurs, any instances of the child class will invoke the child implementation. Instances of the parent class would invoke the parent implementation.

```javascript
define(

'class MyParent',
{
    
    'public publicMethod () -> string': function()
    {
        return 'From Parent';
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    'public publicMethod () -> string': function()
    {
        return 'From Child';
    }
    
});
```

```javascript
var myChild = new MyChild();
myChild.publicMethod(); // From Child

var myParent = new MyParent();
myParent.publicMethod(); // From Parent
```

An over-riding method may call the original parent method by using the `parent` keyword. The following demonstrates this with a constructor, but it is true of any method.

```javascript
define(

'class MyParent',
{
    
    'public construct ()': function()
    {
        console.log('Constructing Parent');
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    'public construct ()': function()
    {
        parent.construct();
        console.log('Constructing Child');
    }
    
});
```

```javascript
var myChild = new MyChild();
// Constructing Parent
// Constructing Child
```