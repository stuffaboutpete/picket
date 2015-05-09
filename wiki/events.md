A class can choose to declare one or many events which are a way of alerting other classes that something of interest has happened. Below is the most simple example where one class declares a `change` event and another class binds to it.

```javascript
define(

'class Model',
{
    
    'public event change ()': undefined,
    
    'private myProperty (string)': null,
    
    'public setProperty (string)': function(value)
    {
        this.myProperty(value);
        this.trigger('change');
    }
    
});
```

```javascript
define(

'class Observer',
{
    
    'public numberOfChanges (number)': 0,
    
    'public setup (Model)': function(model)
    {
        model.bind('change', 'handleModelChange');
    },
    
    'private handleModelChange ()': function()
    {
        this.numberOfChanges('++');
    }
    
});
```

```javascript
// Create instances of our classes
var myModel = new Model();
var observer = new Observer();

// Allow the observer to bind to the model's event
observer.setup(myModel);

// Observe the changing counter as the model is changed
observer.numberOfChanges(); // 0
myModel.setProperty('Example');
observer.numberOfChanges(); // 1
myModel.setProperty('Other Example');
observer.numberOfChanges(); // 2
```

In this example, the `Model` class defines a `change` event which it triggers when its property is set. The `Observer` class binds to the `change` event. By binding, the `Observer` class is indicating that when the `Model` triggers its event, it wants one of its own methods to be called so that it can process the change. In this case, the `Observer` simply increments a counter.

> *By convention, event handler methods begin with the word 'handle' although this is not enforced.*

## Providing arguments when triggering

Each event defines a list of arguments which will be provided to any bound methods when it is triggered. When a bind is registered, Picket will ensure that the method to be called matches the argument signature of the event being bound to. If the signatures do not match, a fatal error will be raised.

> *Although an argument list must be defined, it may be empty, as in the example above.*

When a class triggers one of its events, it is expected to provide arguments which match the event's argument signature. Failure to provide suitable arguments will also trigger a fatal error. This means that events guarantee type-safety both at the bind and the trigger stage.

```javascript
define(

'class Model',
{
    
    // Will provide value of myProperty and current Model instance
    'public event change (string, Model)': undefined,
    
    'private myProperty (string)': null,
    
    'public setProperty (string)': function(value)
    {
        this.myProperty(value);
        this.trigger('change', value, this);
    }
    
});
```

```javascript
define(

'class Observer',
{
    
    'public valueHistory ([string])': [],
    
    'public setup (Model)': function(model)
    {
        model.bind('change', 'handleModelChange');
    },
    
    'private handleModelChange (string, Model)': function(value, model)
    {
        this.valueHistory('push', value);
    }
    
});
```

```javascript
// Create instances of our classes
var myModel = new Model();
var observer = new Observer();

// Allow the observer to bind to the model's event
observer.setup(myModel);

// Observe the changing history of the model
observer.valueHistory().length; // 0
myModel.setProperty('Example');
observer.valueHistory().join(', '); // Example
myModel.setProperty('Other Example');
observer.valueHistory().join(', '); // Example, Other Example
```

This example is a variation on the previous where now the change event declares that it will be providing both a `string`, the property value, and an instance of the `Model` class as it is triggered. The `Observer` has been updated so that its `handleModelChange` method is expecting to receive a `string` and a `Model`. Finally, the `trigger` call has been updated to provide these values.

If the `handleModelChange` method had not been updated to match the event's new signature, the `bind` call would have triggered a fatal error. Similarly, if the `trigger` call had not provided suitable values, this would also have resulted in a fatal error.

The observer now stores historical values of the property instead of just the number of changes. Whilst it does not actually use the model instance, it is made available to it by the event.

> *Whilst an event declares what types it intends to broadcast, there is nothing to indicate what these types represent such as the property value and model instance in the example above. You are strongly encouraged to comment your events clearly to fully describe the arguments.*

## Binding restricted methods

The keen-eyed may have noticed that the `handleModelChange` method in the examples above are labelled as `private` and may have assumed this would cause an error as the method is being called externally. However, Picket understands that this is a special situation where the binding class has actually indicated its permission for the method to be called. This makes more sense than forcing the binding class to compromise its encapsulation by making the handler method public. In all other ways, handler methods obey rules dictated by whether they are `public`, `protected` or `private`.

## Event access modifiers

Events themselves can be declared as either `public` or `protected` to determine which classes can bind to them. Public events can be bound by any code whereas protected events can only be bound to by classes related by inheritance.

> *Events cannot be private as that would mean they can only be bound to by themselves. If a class wants to respond to something happening within itself, that is simply a matter of class design.*