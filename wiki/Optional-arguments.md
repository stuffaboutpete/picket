Method arguments can be specified as optional, in which case the method can be called with or without the argument. There are two ways to specify an argument as optional; by explicitly stating so or by providing a default value.

## Explicit optional arguments

An argument can be marked as optional by appending a `?` to the type within the method signature. 

```javascript
define(

'class MyClass',
{
    
    'public construct (number?)': function(myNumber)
    {
        // Here, we may or may not have a number
        console.log(myNumber);
    }
    
});
```

In this case, calling the method will be successful if either a number or nothing is provided.

```javascript
new MyClass(); // null
new MyClass(4); // 4
```

### The value of an optional argument

When an argument is explicitly optional, the method implementation can be confident that its value is *either* the type specified in the signature, *or* `null`. On first consideration, this may seem to negate the purpose of type-safety but knowing that the argument is one of two types greatly simplifies any code that verifies what argument it is dealing with; a simple null-check is all that is required.

```javascript
define(

'class FunctionCaller',
{
    
    'public callWithString (string, function?)': function(string, functionToCall)
    {

        // We simply need to check for null
        // to determine whether a function
        // has been provided...

        if (functionToCall !== null) {
            functionToCall(string);
        } else {
            console.log(string);
        }

    }
    
});
```

Here, the method first verifies that the function variable is not `null`. If the variable is indeed not `null`, it can be completely confident that it must be a function.

```javascript
var caller = new FunctionCaller();
caller.callWithString('A string'); // Console logs 'A string'
caller.callWithString('A string', alert); // Alerts 'A string'
caller.callWithString('A string', 'Another string'); // ERROR - as with any badly typed method call
```

## Default argument values

Alternatively, an argument can be marked as optional by providing a default value. This is then used in the absence of a user-provided value.

```javascript
define(

'class MyClass',
{
    
    'public construct (number = 10)': function(myNumber)
    {
        // Do something with the number
        console.log(myNumber);
    }
    
});
```

```javascript
new MyClass(); // 10
new MyClass(4); // 4
```

When a default value is provided, the method can be certain that the argument adheres to type-safety rules. The value will never be `null` as it is either a valid user-provided value or the default value.

### Types that can have default values

Not all argument types can specify a default value. The full list of types is `string`, `number`, `boolean`, `array` and `object` arguments. An example of each can be seen below.

```javascript
define(

'class MyClass',
{
    
    'public giveString (string = example)': function(string){},
    'public giveNumber (number = 10)': function(number){},
    'public giveBoolean (boolean = true)': function(boolean){},
    'public giveArray (array = [])': function(array){},
    'public giveObject (object = {})': function(object){}
    
});
```

Array and object types can only specify empty defaults meaning there is no way to create an array containing an element or an object with a key and value.

## Ordering arguments

It is required that *all* optional arguments appear after *all* non-optional arguments in a method's signature. This is simply because positioning an optional argument before a non-optional argument would result in it becoming implicitly non-optional.

When calling a method containing optional arguments, all non-optional arguments *must* be provided followed by any number of non-optional arguments. At the point where one optional argument is omitted, no more arguments must be supplied.

```javascript
define(

'class MyClass',
{
    
    'public construct (string, number, string?, number?)': function(str1, num1, str2, num2)
    {
        // 
    }
    
});
```

```javascript
new MyClass('1'); // ERROR
new MyClass('1', 2); // Ok
new MyClass('1', 2, '3'); // Ok
new MyClass('1', 2, '3', 4); // Ok
new MyClass('1', 2, 4); // ERROR
new MyClass('1', 2, undefined, 4); // ERROR
```

When considering the order of method arguments, explicit-optionals and default-optionals are considered to be the same.