var MatrixUtil = {
	
	 multiply: function(){
		//check if there are enough values in the array to multiply with
		if(arguments.length > 1){
			var numMat2 = 0, numMat3 = 0, numMat4 = 0;//store the count of the different types of arguments
			//iterate over the array counting the different types of arguments in the array
			//if there are more than one type in the array the function returns and error and a null value
			for (var curMat = 0; curMat < arguments.length; curMat++) {
			    var mat = arguments[curMat];
				if (mat instanceof Mat2) {
					numMat2++;
				} else if (mat instanceof Mat3) {
					numMat3++;
				} else if (mat instanceof Mat4) {
					numMat4++;
				} else if(  (numMat2 != 0 && (numMat3 != 0 || numMat4 != 0)) ||
							(numMat3 != 0 && numMat4 != 0)){
					return null;
				}
			}
			
			//based on the type of arguments the array holds create a new instance of that type and begin
			//multiplying them together
			if(numMat2 == arguments.length)
			{
				var result = new Mat2(1);
				for (var curMatrix = arguments.length - 1; curMatrix > -1; curMatrix--){
					result.leftMult(arguments[curMatrix]);
				}
				return result;
			} 
			else if (numMat3 == arguments.length)
			{
				var result = new Mat3(1);
				for (var curMatrix = arguments.length - 1; curMatrix > -1; curMatrix--){
					result.leftMult(arguments[curMatrix]);
				}
				return result;
			} 
			else if (numMat4 == arguments.length)
			{
				var result = new Mat4(1);
				for (var curMatrix = arguments.length - 1; curMatrix > -1; curMatrix--){
					result.leftMult(arguments[curMatrix]);
				}
				return result;
			}
		}else{
			return arguments.length == 1 ? arguments[0] : null;
		}
		return null;
	},
	
	 add: function(){
		
		if(arguments.length > 1){
			var numMat2 = 0, numMat3 = 0, numMat4 = 0;
			for (var curMat = 0; curMat < arguments.length; curMat++) {
                var mat = arguments[curMat];
				if (mat instanceof Mat2) {
					numMat2++;
				} else if (mat instanceof Mat3) {
					numMat3++;
				} else if (mat instanceof Mat4) {
					numMat4++;
				} else if(  (numMat2 != 0 && (numMat3 != 0 || numMat4 != 0)) ||
							(numMat3 != 0 && numMat4 != 0)){
					return null;
				}
			}
			
			if(numMat2 == arguments.length)
			{
				var result = new Mat2(0);
				for (var curMatrix = 0; curMatrix < arguments.length; curMatrix++){
					result.add(arguments[curMatrix]);
				}
				return result;
			} 
			else if (numMat3 == arguments.length)
			{
				var result = new Mat3(0);
				for (var curMatrix = 0; curMatrix < arguments.length; curMatrix++){
					result.add(arguments[curMatrix]);
				}
				return result;
			} 
			else if (numMat4 == arguments.length)
			{
				var result = new Mat4(0);
				for (var curMatrix = 0; curMatrix < arguments.length; curMatrix++){
					result.add(arguments[curMatrix]);
				}
				return result;
			} 
		}
		return arguments.length == 1 ? arguments[0] : null;
	},
	
	 subtract: function(){
		
		if(arguments.length > 1){
			var numMat2 = 0, numMat3 = 0, numMat4 = 0;
			for (var curMat = 0; curMat < arguments.length; curMat++) {
                var mat = arguments[curMat];
				if (mat instanceof Mat2) {
					numMat2++;
				} else if (mat instanceof Mat3) {
					numMat3++;
				} else if (mat instanceof Mat4) {
					numMat4++;
				} else if(  (numMat2 != 0 && (numMat3 != 0 || numMat4 != 0)) ||
							(numMat3 != 0 && numMat4 != 0)){
					return null;
				}
			}
			
			if(numMat2 == arguments.length)
			{
				var result = new Mat2(arguments[0]);
				for (var curMatrix = 1; curMatrix < arguments.length; curMatrix++){
					result.subtract(arguments[curMatrix]);
				}
				return result;
			} 
			else if (numMat3 == arguments.length)
			{
				var result = new Mat3(arguments[0]);
				for (var curMatrix = 1; curMatrix < arguments.length; curMatrix++){
					result.subtract(arguments[curMatrix]);
				}
				return result;
			} 
			else if (numMat4 == arguments.length)
			{
				var result = new Mat4(arguments[0]);
				for (var curMatrix = 1; curMatrix < arguments.length; curMatrix++){
					result.subtract(arguments[curMatrix]);
				}
				return result;
			} 
		}
		return arguments.length == 1 ? arguments[0] : null;
	},
	
	 scale: function(){
        if(arguments.length == 1){
             if(arguments[0] instanceof Vec3){
                return new Mat4(
                    new Vec4(arguments[0].x,0,0,0),
                    new Vec4(0,arguments[0].y,0,0),
                    new Vec4(0,0,arguments[0].z,0),
                    new Vec4(0,0,0,1)
                    );
            }
         }else if(arguments.length == 3){
             if(
                typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number"
            ){
                return new Mat4(
                    new Vec4(arguments[0],0,0,0),
                    new Vec4(0,arguments[1],0,0),
                    new Vec4(0,0,arguments[2],0),
                    new Vec4(0,0,0,1)
                    );
            }
         }
	},
	
	 translate: function(){
	     if(arguments.length == 1){
	         if(arguments[0] instanceof Vec3){
                return new Mat4(
                    new Mat3(1),
                    arguments[0]
                    );
            }
	     }else if(arguments.length == 3){
	         if(
                typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number"
            ){
                return new Mat4(
                    new Mat3(1),
                    new Vec3(arguments[0], arguments[1], arguments[2])
                    );
            }
	     }
	},
	
	 rotate: function(){
		var normAx;
		if(arguments.length == 2){
		    if(arguments[0] instanceof Vec3){
                normAx = new Vec3(arguments[0]);
                normAx.normalize();
                return QuaternionUtil.fromAxisAngle(normAx, typeof arguments[1]).asMatrix();
            }
		}else if(arguments.length == 4){
		    if(
                typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number" &&
                typeof arguments[3] === "number"
            ){
                normAx = new Vec3(arguments[0], arguments[1], arguments[2]);
                normAx.normalize();
                return QuaternionUtil.fromAxisAngle(normAx, typeof arguments[3]).asMatrix();
            }
		}
	},
	
	 getPerspective: function(fovy, aspect, zNear, zFar){
		var f = 1/Math.tan((fovy/2.0)*(Math.PI/180));
		 return new Mat4(
				new Vec4(f/aspect,0,0,0),
				new Vec4(0,f,0,0),
				new Vec4(0,0,(zFar+zNear)/(zNear-zFar),-1),
				new Vec4(0,0,(2*zFar*zNear)/(zNear-zFar),0)
		);
	},
	
	 getOrthographic: function(left, right, bottom, top, zNear, zFar){
		return new Mat4(
				new Vec4(2/(right-left),0,0,0),
				new Vec4(0,2/(top-bottom),0,0),
				new Vec4(0,0,1/(zFar-zNear),0),
				new Vec4(-((right+left)/(right-left)), -((top+bottom)/(top-bottom)), -(zNear/(zFar-zNear)), 1)
				);
	}
};
