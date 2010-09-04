/*
---

name: DynamicMatcher

description: Searches elements via complex selectors and executes functions on them

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Events, Core/Element]

provides: DynamicMatcher

...
*/

(function(){

this.DynamicMatcher = new Class({

	Implements: Events,

	initialize: function(){
		this.expressions = [];
		this.handlers = [];
	},

	register: function(expression, fn){
		var index = this.handlers.indexOf(fn);
		if (index != -1 && this.expressions[index] == expression) return this;

		this.expressions.push(expression);
		this.handlers.push(fn);

		return this;
	},

	unregister: function(expression, fn){
		var handlers = this.handlers,
			expressions = this.expressions;

		for (var i = 0, l = handlers.length; i < l; i++) if (expression == expressions[i] && fn == handlers[i]){
			handlers.splice(i, 1);
			expressions.splice(i, 1);
			break;
		}

		return this;
	},

	update: function(element){
		element = document.id(element) || document;

		var isDocument = (element == document),
			handlers = this.handlers,
			expressions = this.expressions;

		for (var i = 0, l = handlers.length; i < l; i++){
			var expression = expressions[i],
				elements = element.getElements(expression);
			
			if (!isDocument && element.match(expression)) elements.push(element);
			
			if (elements.length) handlers[i](elements);
		}

		this.triggerEvent('update', [element]);

		return this;
	}

});

})();