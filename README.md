DynamicMatcher
==============

Searches elements via complex selectors and executes functions on them. Very useful to define behavior for certain elements or when you control all content via XHR. Also might be of use if you have no control of the markup. Requires MooTools Core 1.3.

This Plugin is part of MooTools [PowerTools!](http://cpojer.net/PowerTools).

* [Build PowerTools!](http://cpojer.net/PowerTools)
* [Fork PowerTools!](https://github.com/cpojer/PowerTools)

Build
-----

Build via [Packager](http://github.com/kamicane/packager), requires [MooTools Core](http://github.com/mootools/mootools-core) to be registered to Packager already

	packager register /path/to/dynamic-matcher
	packager build DynamicMatcher/* > dynamic-matcher.js

To build this plugin without external dependencies use

	packager build DynamicMatcher/* +use-only DynamicMatcher > dynamic-matcher.js

How To Use
----------

You need to create an instance of DynamicMatcher in order to use it

	var Matcher = new DynamicMatcher;

You can now register certain selectors to the Matcher

	Matcher.register('some#complex.selector:not(.thatClass)', function(elements){
		// elements holds all matched elements
		
		elements.addEvent('click', function(e){
			e.preventDefault();
			
			// Now do something
		});
	});

In the above example you might run into the problem that every time the Matcher updates some elements, a new listener with the same functionality is being added. You can overcome this with a simple trick:

	var listener = function(e){
		e.preventDefault();
	
		// Now do something
	};
	
	Matcher.register('some#complex.selector:not(.thatClass)', function(elements){
		elements.addEvent('click', listener); // The same listener will only be added once
	});

You can also unregister via

	Matcher.unregister('the selector', theListener);

In order to update all elements matching the registered selectors you can use

	Matcher.update();

Ideally you should execute this call right after any Request to the Server.


To keep everything fast, if you only have certain content areas updated in your application you can also pass an element. Depending on the complexity of your selector, this may not update all elements (think "body > div" won't match on any element within the page).

	Matcher.update(element); // Only update elements within the provided element

An "update" event is fired on the updated element

	Matcher.addEvent('update', function(element){
		// The passed element is the one passed to Matcher.update
	});

Further Information
-------------------

DynamicMatcher is very useful in conjunction with [Class-Extras](http://github.com/cpojer/mootools-class-extras).

#### Class.Singleton

You can bind a single instance of a Class to an element via Class.Singleton. Combine that with Class.Instantiate to make your code super slick. Consider the following example

	var MyWidget = new Class({

	    Implements: Class.Singleton,

	    initialize: function(element){
			element = this.element = document.id(element);
			
	        return this.check(element) || this.setup(); // Only allows a single instance per Element
	    },

	    setup: function(){
			// This will only ever be executed once per Element
		}

	});
	
	Matcher.register('my#widget.selector', Class.Instantiate(MyWidget));

The above example allows the creation of only a single instance per Element. Class.Instantiate returns a function that creates an instance for all elements that have been passed in. Clean and pretty simple, huh?