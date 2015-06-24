var VecUtil = {
	
	xAxis: new Vec3(1,0,0),
	yAxis: new Vec3(0,1,0),
	zAxis: new Vec3(0,0,1),
	zero: new Vec3(0,0,0),
	
	dot: function(vec1, vec2){
		//check if the given vectors of a matching type and compute the result if they are 
		if( vec1 instanceof  vec2){
			return vec1.dot(vec2);
		}else{
			return 0;
		}
	},

	cross: function(){
		if(vectors.length > 1){
			var result = vectors[0].cross(vectors[1]);
			for(var curVec = 2; curVec < vectors.length; curVec++){
				result.cross(vectors[curVec]);
			}
			return result;
		}else{
			return null;
		}
	},
	
	add: function(){
		
		if(arguments.length > 1){
			var numVec2 = 0, numVec3 = 0, numVec4 = 0;
			for (var curVec = 0; curVec < arguments.length; curVec++) {
                var vec = arguments[curVec];
				if (vec instanceof Vec2) {
					numVec2++;
				} else if (vec instanceof Vec3) {
					numVec3++;
				} else if (vec instanceof Vec4) {
					numVec4++;
				} else if(  (numVec2 != 0 && (numVec3 != 0 || numVec4 != 0)) ||
							(numVec3 != 0 && numVec4 != 0)){
					return null;
				}
			}
			
			if(numVec2 == arguments.length)
			{
				var result = new Vec2(0);
				for (var curVec = 0; curVec < arguments.length; curVec++){
					result.add(arguments[curVec]);
				}
				return result;
			} 
			else if (numVec3 == arguments.length)
			{
				var result = new Vec3(0);
				for (var curVec = 0; curVec < arguments.length; curVec++){
					result.add(arguments[curVec]);
				}
				return result;
			} 
			else if (numVec4 == arguments.length)
			{
				var result = new Vec4(0);
				for (var curVec = 0; curVec < arguments.length; curVec++){
					result.add(arguments[curVec]);
				}
				return result;
			} 
		}
		return arguments.length == 1 ? arguments[0] : null;
	},
	
	subtract: function(){
		
		if(arguments.length > 1){
			var numVec2 = 0, numVec3 = 0, numVec4 = 0;
			for (var curVec = 0; curVec < arguments.length; curVec++) {
                var vec = arguments[curVec];
				if (vec instanceof Vec2) {
					numVec2++;
				} else if (vec instanceof Vec3) {
					numVec3++;
				} else if (vec instanceof Vec4) {
					numVec4++;
				} else if(  (numVec2 != 0 && (numVec3 != 0 || numVec4 != 0)) ||
							(numVec3 != 0 && numVec4 != 0)){
					return null;
				}
			}
			
			if(numVec2 == arguments.length)
			{
				var result = new Vec2(arguments[0]);
				for (var curVec = 1; curVec < arguments.length; curVec++){
					result.subtract(arguments[curVec]);
				}
				return result;
			} 
			else if (numVec3 == arguments.length)
			{
				var result = new Vec3(arguments[0]);
				for (var curVec = 1; curVec < arguments.length; curVec++){
					result.subtract(arguments[curVec]);
				}
				return result;
			} 
			else if (numVec4 == arguments.length)
			{
				var result = new Vec4(arguments[0]);
				for (var curVec = 1; curVec < arguments.length; curVec++){
					result.subtract(arguments[curVec]);
				}
				return result;
			} 
		}
		return arguments.length == 1 ? arguments[0] : null;
	},
	
	reflect: function(incident, normal){
		if(incident instanceof Vec2 && normal instanceof Vec2){
			var i = new Vec2(incident);
			var n = new Vec2(incident);
			n.normalize();
			return i.subtract(n.scale(2*(i.dot(n))));
		}else if(incident instanceof Vec3 && normal instanceof Vec3){
			var i = new Vec3(incident);
			var n = new Vec3(incident);
			n.normalize();
			return i.subtract(n.scale(2*(i.dot(n))));
		}else if(incident instanceof Vec4 && normal instanceof Vec4){
			var i = new Vec4(incident);
			var n = new Vec4(incident);
			n.normalize();
			return i.subtract(n.scale(2*(i.dot(n))));
		}else{
			return null;
		}
	}
};
