# Picket

Picket allows you to create large-scale object-orientated architectures in JavaScript.

The current feature list includes the following; classes, abstract classes, interfaces, inheritance, class properties/fields, class methods, class constructors, class constants, class events, abstract class members, typing of properties, typing of method arguments, typing of method return values, method overloading, optional method arguments, autoloading classes and interfaces and a reflection API.

I am keen to hear from anyone who is interested in contributing, whether that be actual pull requests or simply using the code and/or filing issues.

## Documentation

There is full documentation on each feature on the Picket website at (http://picketjs.com/documentation).

There is a tutorial series currently being and this will be available as soon as possible. This will be a considerably more friendly introduction to coding in Picket.

## Example

The following shows some basics of inheritance, abstraction and type safety.

```javascript
define(

'class Animal',
{
    
    'private weight (number)': null,
    
    'abstract protected getStartingWeight () -> number': undefined,
    
    'public construct ()': function()
    {
        this.weight(this.getStartingWeight());
    },
    
    'public eat (Food)': function(food)
    {
        this.weight(this.weight() + food.getCalories() / 10);
    },
    
    'public getWeight () -> number': function()
    {
        return this.weight();
    }
    
});
```

```javascript
define(

'class Pig extends Animal',
{
    
    'protected getStartingWeight () -> number': function()
    {
        return 1000;
    }
    
});
```

```javascript
define(

'class Food',
{
    
    'private calories (number)': null,
    
    'public construct (number)': function(calories)
    {
        this.calories(calories);
    },
    
    'public getCalories () -> number': function()
    {
        return this.calories();
    }
    
});
```

Given these classes, the following Jasmine test will pass:

```javascript
describe('Pig', function(){
    
    it('gains weight when it eats', function(){
        
        var pete = new Pig();
        pete.eat(new Food(100));
        expect(pete.getWeight()).toBe(1010);
        
    });
    
});
```

## Running the code

In order to run your own Picket, download one of the files from the build directory and include something like the following in your HTML. You could alternatively get the files from Bower or NPM via the alias `picket`.

```html
<script type="text/javascript" src="path/to/picket.js"></script>
<script>
    start('MyNamespace.Start', { 'MyNamespace': '/public/scripts' });
</script>
```

This example expects that you have a class named `MyNamespace.Start` inside the file `/public/scripts/Start.js`. This file must have a constructor that expects no arguments. Further classes must be named to match the file system.

The following is an example of what `MyNamespace.Start` may look like and assumes there are classes at `/public/scripts/Application.js` and `/public/scripts/Application/Controller.js`.

```javascript
define(

'require MyNamespace.Application',
'require MyNamespace.Application.Controller',

'class MyNamespace.Start',
{
    
    'public construct ()': function()
    {
        
        var application = new MyNamespace.Application(
            new MyNamespace.Application.Controller()
        );
        
        application.run();
        
    }
    
});
```

## Contributing

All contributions are welcome. To do so, branch from `develop` and create a pull request.

Whilst all contributions are indeed welcome, I would ideally like to see supporting unit tests and integration tests for any changes or new features. Unit tests are based on one single class and reside along the class - they should consider all details of said class. Integration tests are like documentation - they should demonstrate how a user consumes a feature and will likely cover functionality within many classes.

To run the tests, use Node.js and NPM to install the dependencies. Then type `gulp` within the root directory of the project. If you are new to Node and would like assistance, feel free to contact me.

## Roadmap

The following describes the likely features ahead for Picket.

* Tutorials
* Browser support - right now, Picket is only guaranteed to work in the latest versions of Chrome and Firefox. This is a work in progress and is likely to be resolved in the coming weeks all the way back to Internet Explorer 6, Android 2.3, iOS 4.3 and the like.
* Node.js compatability
* Integration with an established autoloading system such as AMD or Require.js.
* New language features - currently being considered features include variadic methods, enums, generics and more.
* Facility to write code without the limitations imposed by the nature of class declarations being valid JavaScript literals. This code would be identical but without quotes around signatures, commas after class members etc and would then be compilable to valid Picket.

## Contact

You are encouraged to contact me at pete@peteonline.co.uk if you want to be involved in the project or if you want any assistance in using it for yourself.
