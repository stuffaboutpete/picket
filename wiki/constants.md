Classes can declare constants which are a type of property that cannot be changed. Their value is determined as the class is declared and never change throughout the life of the class.

Constants are static which means that they exist on classes as opposed to class instances. As constants can *only* be static, there is no need to include the `static` keyword present in static methods.

```javascript
define(

'class MyClass',
{
    
    'public constant MY_CONSTANT (number)': 1.23
    
});
```

```javascript
MyClass.MY_CONSTANT(); // 1.23
```

Any effort to change the value of a constant value will result in a fatal error.

```javascript
MyClass.MY_CONSTANT(2); ERROR
```

Constant names must be made up of uppercase letters and underscores only.

## Constant types

Constants can be of the type `string` or `number` only. This is because they are simple value types that Picket can guarantee will not change unlike an object for example which is passed by reference and could be altered after it has been retrieved.

## Generated constants

On occasion you may need to know that a value is constant whilst not actually minding what its value is. This could be to offer behaviour like enums, which exist in other languages, where a value must be chosen from a list of available options. Picket can generate the value of a constant for you, if the declared value is left as `undefined`. In the example below, the color must be instantiated as one of red, green or blue.

> *It is likely that Picket will include enums in future but this feature is not currently in development.*

```javascript
define(

'class Color',
{
    
    'public constant RED (number)': undefined,
    'public constant GREEN (number)': undefined,
    'public constant BLUE (number)': undefined,
    
    'public construct (number)': function(value)
    {
        if (value != Color.RED() && value != Color.GREEN() && value != Color.BLUE()) {
            throw new Error('Color must be either Color.RED(), Color.GREEN() or Color.BLUE()');
        }
        // Save or process the value...
    }
    
});
```

```javascript
// myColor will be instantiated to be blue
var myColor = new Color(Color.BLUE());
```

In this example, it is clear that the value of the three color constants do not matter. They are simply something to compare against for similarity.

Picket will generate either a string or a number depending on the declared type of the constant so that it obeys type-safety. If this value is a string, it will be of length 32 and made up of upper and lower-case letters and numbers. If it is a number it will be an integer between 0 and the highest JavaScript can handle safely (2^53 - 1). These values are sufficiently long that they can be considered unique.