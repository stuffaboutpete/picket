Picket has an in-built file loading system which allows a class to specify its dependencies and have them loaded before any code is run. A class, or an interface, can `require` any other class or interface as part of its declaration, allowing Picket to build a map of all files that should be included before it is safe to proceed.

```javascript
define(

'require My.OtherClass',
'require My.IInterface',

'class My.Class',
{

    //

});
```

Here, a class, `My.Class` declares that it needs both the class `My.OtherClass` and the interface `My.IInterface` to be available in order to run. This is all a class declaration must do in order to be functional within the Picket autoload system.

## One class or interface per file

Picket, and its autoloading system, is built on the idea that each class or interface should exist in its own file and each file should contain no more than one class or interface. Furthermore, the directory structure and file naming scheme should mirror the namespace and class naming scheme.

A class named `MyNamespace.Some.Class` should exist within a file named `Class.js`. It is a possibility that this will exist within a directory named `Some` which in turn will exist in a directory named `MyNamespace` although this is not definitely true as it depends on the loading patterns provided to Picket. There is more on this below.

## Starting and providing loading patterns

In order to utilise autoloading in Picket, a call must be made to the global `start` function. The `start` function requires a single class name and a JavaScript object containing at least one key/value pair. The class name describes a class to be instantiated once the dependency tree has been discovered and all the files in it have been successfully loaded. The object describes the relationships between any class namespaces used in the system and their location on the web server.

```javascript
start(
    'MyNamespace.Start',
    {
        'MyNamespace': '/public/scripts'
    }
);
```

It should be noted that unless the `start` function is called, `require` statements in classes and interfaces are completely ignored. You may include all of your scripts manually if you choose and it is your duty to ensure that scripts are included in the correct order.

### Under the covers

When a call to `start` is made, Picket first uses the provided loading patterns object to determine where the initial class will be found. This file is loaded and its contents are parsed by the JavaScript engine. If this class has dependencies, specified as `require` statements then the relevant file for each of these classes or interfaces is also loaded. Again, as these are parsed, they may indicate dependencies of their own which in turn will be loaded. This process continues until some point when Picket sees that no new files need to be loaded and no files are currently pending. It will then proceed to create one instance of the 'start' class that was provided so that its constructor can act as an entry point for your application.

> *By convention, the class provided to the start function should be of the format `MyNamespace.Start`. This is simply so that developers have a common place to start investigating a system. This convention is not enforced.*

### Loading patterns

The loading patterns provided to the `start` function allow Picket to decide where a class file should be located. In order to determine a location, it iterates through the provided key/value pairs and attempts to find a match between the class name and the provided key. If the full class name, including namespace, starts with one of the object keys, then that part of the class is replaced with the corresponding object value and the remaining parts of the class are converted from namespace parts to directory and files parts. This is easily demonstrated with an example.

```javascript
start(
    'MyNamespace.Start',
    {
        'MyNamespace':              '/public/scripts',
        'ExampleLibrary':           '/public/vendor/example-library',
        'MyNamespace.SubNamespace': '/other-scripts'
    }
);
```

Given these loading patterns, the following class names will be resolved to the specified files.

Class name                                  | File location
------------------------------------------- | -----------------------------------------------------------
`MyNamespace.Start`                         | `/public/scripts/Start.js`
`MyNamespace.Application.Controller.Simple` | `/public/scripts/Application/Controller/Simple.js`
`ExampleLibrary.SomeClass`                  | `/public/vendor/example-library/SomeClass.js`
`ExampleLibrary.Interfaces.ISomeInterface`  | `/public/vendor/example-library/Interfaces/ISomeInterface.js`
`MyNamespace.SubNamespace.ExampleClass`     | `/other-scripts/ExampleClass.js`

Note that the final example, `MyNamespace.SubNamespace.ExampleClass` does not resolve to `/public/scripts/SubNamespace/ExampleClass.js` despite the fact that the class name begins with `MyNamespace`. This is because the third pattern provided to `start`, which also matches the class name, is longer than the first and longer patterns get priority over shorter ones.

## The start class

An instance of the class which is provided to the `start` function is instantiated when all dependency files have completed loading. This class is responsible for initiating the rest of the application.

This start class *must* have at least one constructor which can be run with no arguments. This is because it is instantiated by Picket which will supply no arguments. It is not permitted to have *no* constructor as this would result in no code being executed and the class instantiation having no purpose. 

## Implicitly loaded classes

When a class inherits from a parent, Picket will infer the parent class to be a dependency of the child. If it is not specifically specified as a dependency elsewhere, Picket will still load the parent class upon loading the child class.

The same applies when a class implements an interface; the interface will be loaded without having to be specified as a dependency.

## The `require` function

On occasion, it is useful to load a class or interface programmatically, for example based upon user input. This can be achieved by calling the global `require` function. `require` takes two arguments; the name of the class or interface to be loaded and the name of a method to be called once the resource is available. This handler method will be a member of the current class.

```javascript
define(

'class My.Class',
{
	
	'public myMethod ()': function()
	{
		// ...Programatically determine className
		require(className, 'handleClassLoaded');
	},
	
	'private handleClassLoaded (string)': function(className)
	{
		// At this point, the class described by className exists
	}
	
});
```

In this example, `myMethod` determines a class to load and then provides it to the `require` function along with `handleClassLoaded`. If there is no method named `handleClassLoaded` then Picket will trigger an error. Also, `handleClassLoaded` must have a type signature which indicates it accepts a `string` and returns `undefined`. If this is not the case, Picket will trigger an error.

If all is in order, Picket will call the nominated method when the class or interface is fully loaded, providing its name.

> *By convention, handler methods begin with the word `handle`, but this is not enforced.*

### Handling via private/protected methods

In the example above, `handleClassLoaded` is designated `private` as it is not meant to be part of the class's public interface. However, the method is being triggered externally, not by a simple call from within the class. Picket understands that this is a special case, where the class has implied its consent for the method to be called. Handler methods may be `public`, `private` or `protected` provided the requiring class has privileges to call it.