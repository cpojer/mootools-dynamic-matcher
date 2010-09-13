(function(){

var global = this;
describe('Dynamic Matcher', function(){
	
	it('should be available', function(){
		expect('DynamicMatcher' in global).toBeTruthy();
	});
	
	it('should implement Events', function(){
		expect((new DynamicMatcher).addEvent).toBeTruthy();
	});
	
	it('should allow to register a method to a selector', function(){
		var Matcher = new DynamicMatcher;
		
		var fired = false;
		Matcher.register('div#test a', function(){
			fired = true;
		});
		
		Matcher.update();
		
		expect(fired).toBeTruthy();
	});
	
	it('should pass all matched elements', function(){
		var Matcher = new DynamicMatcher;
		
		var length = 0, element;
		Matcher.register('div#test a', function(elements){
			length = elements.length;
			element = elements[0];
		});
		
		Matcher.update();
		
		expect(length).toBe(1);
		expect(element == document.getElement('div#test a')).toBeTruthy();
	});
	
	it('should allow to register multipe functions to the same selector', function(){
		var Matcher = new DynamicMatcher;
		
		var count = 0;
		Matcher.register('div#test a', function(){
			count++;
		});

		Matcher.update();
		
		expect(count).toBe(1);
		
		Matcher.register('div#test a', function(){
			count++;
		});
		
		Matcher.update();
		
		expect(count).toBe(3);
	});
	
	it('should allow to unregister a selector', function(){
		var Matcher = new DynamicMatcher;
		
		var fired = false,
			listener = function(){
				fired = true;
			};
		
		Matcher.register('div#test a', listener);
		Matcher.unregister('div#test a', listener);
		
		Matcher.update();
		
		expect(fired).toBeFalsy();
	});
	
	it('should pass the updated element', function(){
		var Matcher = new DynamicMatcher;
		
		var updated;
		Matcher.addEvent('update', function(element){
			updated = element;
		});
		
		Matcher.update();
		
		expect(updated == document).toBeTruthy();
		
		Matcher.update(document.id('test'));
		
		expect(updated == document.id('test')).toBeTruthy();
	});
	
	it('should fire on the updated element', function(){
		var Matcher = new DynamicMatcher;
		
		var fired = false;
		Matcher.register('div#test a', function(){
			fired = true;
		});
		
		Matcher.update(document.getElement('div#test a'));
		
		expect(fired).toBeTruthy();
	});
	
	it('should allow to unregister during an update', function(){
		var Matcher = new DynamicMatcher;
		
		var list = [];
		Matcher.register('a', function(){
			list.push(1);
		});
		
		var two = function(){
			list.push(2);
			Matcher.unregister('a', two);
		};
		
		Matcher.register('a', two);
		
		Matcher.register('a', function(){
			list.push(3);
		});
		
		Matcher.update();
		
		expect(list).toEqual([1, 2, 3]);
	});
	
});

})();