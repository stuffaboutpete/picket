Picket is heavily reliant on the idea of type-hinting. It means that your classes and interfaces can define rules for what is considered a valid value when information is passed between different areas of code.

For example, a class property must specify a type. Then, when any value is assigned to that property, it must pass a test to ensure that it matches the type. Alternatively, a method may specify any number of input types and a single output type. Picket will ensure that all arguments passed to the method adhere to the corresponding type and that the value the method returns adheres to the return type.

Type hinting is also present in constant and event definitions and when defining interfaces, type hinting is an important part of the signatures you will define.

## Types of hinting

There are various types that can be hinting for but all are represented as a string without spaces. These strings will usually appear within a larger signature string which defines a class member. The example below specifies `string` as the return type:

```javascript
'public myMethod () -> string'
```

### Fundamental JavaScript types

The basic JavaScript data types can all be hinted for. These are the values that the JavaScript keyword `typeof` can return and include:

* `string`
* `number`
* `boolean`
* `undefined`
* `null`
* `object`
* `function`

### Class types

You can specify both native and Picket class types in your signatures. These are all tested using the JavaScript `instanceof` operator so any object which is a direct instantiation of the class *or* an instantiation of a class which descends from the type will pass the test.

For example, the following native types can be hinted for:

* `Date`
* `HTMLElement`
* `XMLHttpRequest`

Or if we were to declare the following two Picket classes:

```javascript
define('class Helper');
define('class HelperWithExtras extends Helper');
```

Then we would be able to type hint for either `Helper` or `HelperWithExtras`. `HelperWithExtras` would pass both tests as it is an instance of both classes whilst an instance of `Helper` would only pass the `Helper` test.

### Interface types

Much like class names, you can hint for a specific interface name. Only class instances which implement the interface will pass the type test.

```javascript
define('interface IMyInterface');
define('class MyClass implements IMyInterface');
define('class MyOtherClass');
```

Here, any instance of `MyClass` would pass a type test for `IMyInterface`, but `MyOtherClass` would not.

> *Remember that a class is only deemed to implement an interface if its signature declares so, not simply if its members match the interface members.*

### Namespaced types

Picket classes and interfaces, as well as native classes, can be type hinted for when they are not in the global namespace. This is done by including a dot to indicate a namespace level, exactly as you would whilst defining a class. An instance of the following class would pass a test for `My.Namespaced.Class`.

```javascript
define('class My.Namespaced.Class');
```

### Arrays

There are two ways to type hint for an array. Firstly, you can specify `array`. Under the covers, this does the popular, though verbose, `Object.prototype.toString.call(value) == '[object Array]'` test and will pass any variable that is a native JavaScript array.

Alternatively, you can specify something of the form `ExampleType[]`. The two square brackets at the end indicate to Picket that we are looking for an array which contains only elements described by the preceeding term. In this example, we want an array that contains nothing but instances of `ExampleType`. This system can be applied to any of the type examples listed above. For example:

* `string[]`
* `boolean[]`
* `Date[]`
* `MyClass[]`
* `My.Namespaced.Class[]`
* `IMyInterface[]`

> *Note that an empty array will pass any array type test.*

## Exceptions

What is described in this page are the basic rules for type hinting, however each member type may specify its own rules for what can be typed. Read the documentation on each feature for more detailed descriptions. Below are some of the caveats to look out for:

* Properties can contain a value of `null` even if this goes against the specified type. This is only ever when no value has yet been specified.
* Constants can only be typed to one of `string` or `number`
* Methods can specify optional argument types by appending extra characters to the end of the type declaration.

## Further information

More specific details can be found in the documentation for each of the class member types:

* [[Properties]]
* [[Methods]]
* [[Events]]
* [[Constants]]