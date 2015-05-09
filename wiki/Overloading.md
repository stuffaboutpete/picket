Method overloading is a feature which allows multiple methods with the same name to be declared with varying argument types. This means that a method can appear to take a variety of different argument permutations whereas in reality, different methods are being called.

```javascript
define(

'class PointOnGraph',
{
    
    'public construct (number, number)': function(xCoordinate, yCoordinate)
    {
        // Save co-ordinates
    },
    
    'public construct (Angle, number)': function(angle, distanceFromCenter)
    {
        // Convert to co-ordinates and save
    }
    
});
```

This class, representing a point on a graph, can be instantiated in one of two different ways; by providing two co-ordinates or by providing an angle from the x-axis and a distance from the center.

```javascript
// Both of these lines will create a valid 'point'
var pointOnGraph = new PointOnGraph(10, 4);
var pointOnGraph = new PointOnGraph(new Angle('45degs'), 5);
```

In this example, it is the constructor that has been overloaded but this can be applied to any class method. There is also no limit to the number of methods with the same name within a class.

## Calling overloaded methods

Any class method, or indeed any code (provided it has access privileges), can call any overloaded method provided it supplies the correct arguments. This means that overloaded methods can call each other, which amongst other things gives way to one method of creating default values, as seen below.

```javascript
define(

'class MyClass',
{
    
    'public construct ()': function()
    {
        // Provide a default value to the
        // other constructor to do the real work
        this.construct(4);
    },
    
    'public construct (number)': function(myNumber)
    {
        // Do something with our number
        console.log(myNumber);
    }
    
});
```

```javascript
new MyClass(); // 4
new MyClass(5); // 5
```

## Similar features

Note that the effect above of specifying a default value can be produced more simply by using a [[default value|Optional arguments]]. However overloading allows more complex setups, for example when the default value is a class that needs to be instantiated or when some logic needs to be applied to determine the default.

Similarly, [[multi-typed arguments|Multi-typed Arguments]] can produce the same effect as method overloading. When combined, all of these styles can produce elegant, expressive code and it is up to you to determine which is the most suitable approach.