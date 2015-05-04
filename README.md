# Picket

Hi, thanks for stopping by. Picket is a library which allows you to create object-orientated architectures in JavaScript. Whilst there is an extensive number of features, the project is very much in an early stage - there are bugs, there is no documentation, at least one significant feature is missing that stops it being production ready (info in the road map).

I am keen to hear from anyone who is interested in contributing, whether that be actual pull requests or simply using the code and/or filing issues.

As there is no documentation, this file includes the very basics to get going. If you feel you want to get involved but can't get work out how, please do contact me.

## Syntax / Features

The current feature list includes the following; classes, abstract classes, interfaces, inheritance, class properties/fields, class methods, class constructors, class constants, class events, abstract class members, typing of properties, typing of method arguments, typing of method return values, method overloading, optional method arguments, autoloading classes and interfaces and the (very) early stages of a reflection API.

### Example

The following shows some basics of inheritance, abstraction and type safety.

```javascript
define(

'class Animal',
{
    
    'private weight (number)': null,
    
    'abstract protected getStartingWeight () -> number': undefined,
    
    'public construct () -> undefined': function()
    {
        this.weight(this.getStartingWeight());
    },
    
    'public eat (Food) -> undefined': function(food)
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
    
    'public construct (number) -> undefined': function(calories)
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

In order to run the code, download one of the files from the build directory and include the following in your HTML.

```html
<script type="text/javascript" src="path/to/picket.js"></script>
<script>
    
    start.addAutoLoadPattern(
        'MyNamespace',
        '/public/scripts'
    );
    
    start('MyNamespace.Start');
    
</script>
```

This example expects that you have a class named MyNamespace.Start inside the file /public/scripts/Start.js. This file must have a constructor that expects no arguments. Further classes must be named to match the file system. The following is an example of what MyNamespace.Start may look like and assumes there are classes at /public/scripts/Application.js and /public/scripts/Application/Controller.js.

```javascript
define(

'require MyNamespace.Application',
'require MyNamespace.Application.Controller',

'class MyNamespace.Start',
{
    
    'public construct () -> undefined': function()
    {
        
        var application = new MyNamespace.Application(
            new MyNamespace.Application.Controller()
        );
        
        application.run();
        
    }
    
});
```

From this point on, you are advised to look at any/all of the files within the integration-tests directory as documentation. All features should have examples in here. For more details on a particular feature, you may seek guidance from the unit tests in the build directory.

## Contributing

For the short term, there is no complication to the git workflow; if you wish to make a pull request, simply fork the library and work on the master branch.

Any contributions are welcome but I would ideally like to see supporting unit tests and integration tests for any changes or new features. Unit tests are based on one single class and reside along the class - they should consider all details of said class. Integration tests are like documentation - they should demonstrate how a user consumes a feature and will likely cover functionality within many classes.

To run the tests, use node.js and npm to install the dependencies. Then type `gulp` within the root directory of the project. Again, if you are new to node and would like assistance, feel free to contact me.

## Roadmap

The following describes the likely features ahead for Picket.

* Documentation / website / tutorials
* Ability to compile many classes into one library file and not have the autoload system attempt to load each individually. This is currently a blocker to production usage as loading each class individually is not acceptable beyond development.
* Compilation to vanilla JavaScript - there is a performance hit because of all the work Picket has to do in type checking and such. The ideal workflow would be to develop using all features and then compile the code down to a lighter version which does not do as much work.
* New language features - currently being considered features include variadic methods, enums, generics and more.
* Node.js compatability
* Registration with common package managers such as npm and Bower.
* Facility to write code without the limitations imposed by the nature of class declarations being valid JavaScript literals. This code would be identical but without quotes around signatures, commas after class members etc and would then be compilable to valid Picket.
* Possible integration with an established autoloading system such as AMD or Require.js.
* Name change - there are a few libraries with the same name (https://www.google.co.uk/webhp?ion=1&espv=2&ie=UTF-8#q=classy%20js)
* Debugger (such as Chrome Developer Tools) extension to allow stepping into and out of Picket methods (bypassing the inner workings of the library).
* Comments!

## Contact

You can contact me at pete@peteonline.co.uk

Cheers!
