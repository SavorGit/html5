(function(a, b){
	b.extend({
		changeObject: function(o0, o1){
			if(typeof(o0) != "object" || typeof(o1) != "object"){
				throw new Error("Must object");
			}
			
			for(var propertyName in o1){
				var newPropertyValue = o1[propertyName];
				if (o0[propertyName]){
					
				}else{
					o0[propertyName] = newPropertyValue;
				}
			}
		}
	});
})(window, jQuery);