An abstract class is a class that cannot be instantiated. An attempt to create an instance of it will result in an error.

```javascript
define(

'abstract class MyClass',
{
    
    // ...
    
});
```

```javascript
new MyClass(); // ERROR
```

## Explicit abstract classes

A class can be marked as abstract by stating so at the start of the class signature, as demonstrated in the example above. This is done when the author of the class considers it not to be useful in its current state and that it should be considered a base class for extending.

## Implicit abstract classes

More commonly, a class can be marked as abstract by declaring one or more of its methods as abstract. [[Abstract methods]] are methods which have not yet been implemented. The author of the implicit abstract class expects that any class which inherits from it will implement the body of the method.

```javascript
define(

'class MyParent',
{
    
    'abstract protected getString () -> string': undefined,
    
    'public shout ()': function()
    {
        console.log(this.getString().toUpperCase());
    }
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    'protected getString () -> string': function()
    {
        return 'From Child';
    }
    
});
```

```javascript
var myChild = new MyChild();
myChild.shout(); // FROM CHILD
```

If this child class had not implemented the abstract method of its parent, instantiating it would have produced an error.

Any implementation of an abstract method must match the abstract signature exactly, *except* the keyword `abstract` which should be removed. If the signature differs in either access modifier, name, argument types or return type, it is not considered an implementation of the abstract method. Instantiating a class which declares this method incorrectly will result in an error.

## Implicit child classes

A class which extends an implicitly abstract class *can* leave out the implementation of the parent's abstract methods. In this case, the child class is also considered to be implicitly abstract; an ancestor of the child would have to implement the abstract method before it could be instantiated.

```javascript
define(

'class MyParent',
{
    
    'abstract public doSomething ()': undefined
    
});
```

```javascript
define(

'class MyChild extends MyParent',
{
    
    // Not implementing abstract 'doSomething'
    
});
```

```javascript
define(

'class MyGrandChild extends MyChild',
{
    
    'public doSomething ()': function()
    {
        // ...
    }
    
});
```

```javascript
new MyParent(); // ERROR
new MyChild(); // ERROR
new MyGrandChild(); // No problem
```