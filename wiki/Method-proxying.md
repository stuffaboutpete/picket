On occasion, you may need to create a native JavaScript function inside one of your methods such as when providing a callback to a third-party library. This function is not considered a member of the class and as such can produce some issues.

```javascript
'class MyClass',
{
    
    'public setupButton ()': function()
    {
        $('button#my-button').on('click', function(){
            var message = this.getMessage(); // ERROR
            $('span#message').html(message);
        });
    },
    
    'private getMessage () -> string': function()
    {
        return 'A string';
    }
    
});
```

```javascript
var myObject = new MyClass();
myObject.setupButton();
$('button#my-button').trigger('click'); // Will trigger error
```

There are actually two problems with the example above. Firstly, `this` will not refer to our class instance and so the anonymous callback function will not be able to locate the `getMessage` method. Secondly, the `getMessage` method is private and as the callback function is not considered to be part of `MyClass`, it would not be permitted to make the call.

Both of these issues can be overcome by 'proxying' the function. When this is done, the function will run as though it was defined as part of the containing class. The following example is equivalent to the one above except that the function is proxied and therefore runs without problems.

```javascript
'class MyClass',
{
    
    'public setupButton ()': function()
    {
        $('button#my-button').on('click', this.proxyMethod(function(){
            var message = this.getMessage();
            $('span#message').html(message);
        }));
    },
    
    'private getMessage () -> string': function()
    {
        return 'A string';
    }
    
});
```

```javascript
var myObject = new MyClass();
myObject.setupButton();
$('button#my-button').trigger('click'); // Will NOT trigger error
```

## Under the covers

Here, the function has been passed to a built-in class method named `proxyMethod` which returns a new function. This new function wraps the original, behaving identically except that `this` has been changed and some meta data has been appended to ensure it has access privileges.

```javascript
var originalFunction = function(){};
var proxiedFunction = this.proxyFunction(originalFunction);
```