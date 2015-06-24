function Quaternion(x,y,z,w){
	
	if(typeof x === "number" && 
		typeof y === "number" && 
		typeof z === "number" && 
		typeof w === "number"){
			this.data = new Vec4(x,y,z,w);
	}else if(typeof x === "undefined" && 
		typeof y === "undefined" && 
		typeof z === "undefined" && 
		typeof w === "undefined"){
			this.data = new Vec4(0.0,0.0,0.0,1.0);
	}else if(x instanceof Vec4 && 
		typeof y === "undefined" && 
		typeof z === "undefined" && 
		typeof w === "undefined"){
			this.data = new Vec4(x);
	}else if(x instanceof Vec3 && 
		typeof y === "undefined" && 
		typeof z === "undefined" && 
		typeof w === "undefined"){
			var radAngles = (new Vec3(x)).scale((Math.PI/180)/2.0);
		
			var sinr = Math.sin(radAngles.x);
			var sinp = Math.sin(radAngles.y);
			var siny = Math.sin(radAngles.z);
			
			var cosr = Math.cos(radAngles.x);
			var cosp = Math.cos(radAngles.y);
			var cosy = Math.cos(radAngles.z);
			
			this.data = new Vec4(sinr*cosp*cosy - cosr*sinp*siny,
				cosr*sinp*cosy + sinr*cosp*siny,
				cosr*cosp*siny - sinr*sinp*cosy,
				cosr*cosp*cosy + sinr*sinp*siny);
		
			this.normalize();
	}else if(x instanceof Vec3 && 
		typeof y === "number" && 
		typeof z === "undefined" && 
		typeof w === "undefined"){
			var nAxis = (new Vec3(x)).normalize();
			var sinAngle = Math.sin((y*Math.PI/180)/2.0);
			nAxis.scale(sinAngle);
			
			this.data = new Vec4(nAxis, Math.cos((y*Math.PI/180)/2.0));
	}else if(typeof x === "number" && 
		typeof y === "number" && 
		typeof z === "number" && 
		typeof w === "undefined"){
			var radAngles = (new Vec3(x,y,z)).scale((Math.PI/180)/2.0);
		
			var sinr = Math.sin(radAngles.x);
			var sinp = Math.sin(radAngles.y);
			var siny = Math.sin(radAngles.z);
			
			var cosr = Math.cos(radAngles.x);
			var cosp = Math.cos(radAngles.y);
			var cosy = Math.cos(radAngles.z);
			
			this.data = new Vec4(sinr*cosp*cosy - cosr*sinp*siny,
				cosr*sinp*cosy + sinr*cosp*siny,
				cosr*cosp*siny - sinr*sinp*cosy,
				cosr*cosp*cosy + sinr*sinp*siny);
		
			this.normalize();
	}else if(x instanceof Quaternion && 
		typeof y === "undefined" && 
		typeof z === "undefined" && 
		typeof w === "undefined"){
			this.data = new Vec4(x.data);
	}
};
	
	Quaternion.prototype.conjugate = function(){
		this.data.normalize();
		return new Quaternion(-this.data.x,-this.data.y,-this.data.z,this.data.w);
	};
	
	Quaternion.prototype.mult = function(rhs){
		if(rhs instanceof Quaternion){
			var multData = rhs.data;
			return new Quaternion(this.data.w*multData.x + this.data.x*multData.w + this.data.y*multData.z - this.data.z*multData.y,
					                this.data.w*multData.y + this.data.y*multData.w + this.data.z*multData.x - this.data.x*multData.z,
					                this.data.w*multData.z + this.data.z*multData.w + this.data.x*multData.y - this.data.y*multData.x,
					                this.data.w*multData.w - this.data.x*multData.x - this.data.y*multData.y - this.data.z*multData.z);
		}else{
			return null;
		}
	};
	
	Quaternion.prototype.normalize = function(){
		this.data.normalize();
	};
	
	Quaternion.prototype.multVec = function(vector){
		if(vector instanceof Vec3){
			var vecCopy = new Vec3(vector);
			vecCopy.normalize();
			var vec = new Quaternion(new Vec4(vecCopy, 0));
			return QuaternionUtil.multiply(this, vec, this.conjugate()).data.swizzle("xyz");
		}else{
			return null;
		}
	};
	
	Quaternion.prototype.addVector = function(vector){
		if(arguments.length === 1){
			if(argument[0] instanceof Vec3){
				var newRotation = new Quaternion(vector.x, vector.y, vector.z, 0);
				newRotation.set(newRotation.mult(this));
				this.data.x += newRotation.data.x*.5;
				this.data.y += newRotation.data.y*.5;
				this.data.z += newRotation.data.z*.5;
				this.data.w += newRotation.data.w*.5;
			}
		}else if(arguments.length === 3){
			if(typeof argument[0] === "number" &&
				typeof argument[1] === "number" &&
				typeof argument[2] === "number"){
				var newRotation = new Quaternion(argument[0], argument[1], argument[2], 0);
				newRotation.set(newRotation.mult(this));
				this.data.x += newRotation.data.x*.5;
				this.data.y += newRotation.data.y*.5;
				this.data.z += newRotation.data.z*.5;
				this.data.w += newRotation.data.w*.5;
			}
		}
		return this;
	};
	
	Quaternion.prototype.set = function(x,y,z,w){
		if(x instanceof Quaternion && 
			typeof y === "undefined" && 
			typeof z === "undefined" && 
			typeof w === "undefined"){
				this.data.set(x.data);
		}else if(typeof x === "number" && 
			typeof y === "number" && 
			typeof z === "number" && 
			typeof w === "undefined"){
				var radAngles = (new Vec3(x, y, z)).scale((Math.PI/180)/2.0);
		
				var sinr = Math.sin(radAngles.x);
				var sinp = Math.sin(radAngles.y);
				var siny = Math.sin(radAngles.z);
				
				var cosr = Math.cos(radAngles.x);
				var cosp = Math.cos(radAngles.y);
				var cosy = Math.cos(radAngles.z);
				
			 
				this.data.set(sinr*cosp*cosy - cosr*sinp*siny,
						cosr*sinp*cosy + sinr*cosp*siny,
						cosr*cosp*siny - sinr*sinp*cosy,
						cosr*cosp*cosy + sinr*sinp*siny);
		
				this.normalize();
		}else if(typeof x === "number" && 
			typeof y === "number" && 
			typeof z === "number" && 
			typeof w === "number"){
				this.data.set(x,y,z,w);
		}
	};
	
	Quaternion.prototype.asMatrix = function(){
		this.normalize();
		
		var x2 = this.data.x*this.data.x;
		var y2 = this.data.y*this.data.y;
		var z2 = this.data.z*this.data.z;
		
		var xy = this.data.x*this.data.y;
		var xz = this.data.x*this.data.z;
		var yz = this.data.y*this.data.z;
		
		var wx = this.data.w*this.data.x;
		var wy = this.data.w*this.data.y;
		var wz = this.data.w*this.data.z;
		
		return new Mat4( new Vec4(1.0 - 2.0 * (y2 + z2), 2.0 * (xy - wz), 2.0 * (xz + wy), 0.0),
						new Vec4(2.0 * (xy + wz), 1.0 - 2.0 * (x2 + z2), 2.0 * (yz - wx), 0.0),
						new Vec4(2.0 * (xz - wy), 2.0 * (yz + wx), 1.0 - 2.0 * (x2 + y2), 0.0),
						new Vec4(0.0, 0.0, 0.0, 1.0));
	};
    
    Quaternion.prototype.asRotMatrix = function(){
        this.normalize();
        
        var x2 = this.data.x*this.data.x;
        var y2 = this.data.y*this.data.y;
        var z2 = this.data.z*this.data.z;
        
        var xy = this.data.x*this.data.y;
        var xz = this.data.x*this.data.z;
        var yz = this.data.y*this.data.z;
        
        var wx = this.data.w*this.data.x;
        var wy = this.data.w*this.data.y;
        var wz = this.data.w*this.data.z;
        
        return new Mat3( new Vec3(1.0 - 2.0 * (y2 + z2), 2.0 * (xy - wz), 2.0 * (xz + wy)),
                        new Vec3(2.0 * (xy + wz), 1.0 - 2.0 * (x2 + z2), 2.0 * (yz - wx)),
                        new Vec3(2.0 * (xz - wy), 2.0 * (yz + wx), 1.0 - 2.0 * (x2 + y2)));
    };
	
	Quaternion.prototype.getAxis = function(){
		var axis = data.swizzle("xyz");
		axis.normalize();
		return axis;
	};
	
	Quaternion.prototype.getAngle = function(){
		return Math.acos(data.w)*2*(180/Math.PI);
	};
	
	Quaternion.prototype.print = function(){
		this.data.print();
	};

var QuaternionUtil = {
	multiply: function(){
		if(arguments.length > 1){
			var result = new Quaternion(arguments[0]);
			for(var curQuat = 1; curQuat < arguments.length; curQuat++){
				result.set(result.mult(arguments[curQuat]));
			}
			return result;
		}else{
			return arguments.length == 1 ? arguments[0] : null;
		}
	},
	
	fromAxisAngle: function(x,y,z,angle){
		if(typeof x === "number" && 
			typeof y === "number" && 
			typeof z === "number" && 
			typeof angle === "number"){
				var nAxis = new Vec3(x, y, z);
				nAxis.normalize();
				var sinAngle = Math.sin((angle*Math.PI/180)/2.0);
				nAxis.scale(sinAngle);
				
				return new Quaternion(new Vec4(nAxis, Math.cos((angle*Math.PI/180)/2.0)));
		}else if(x instanceof Vec3 && 
			typeof y === "number" && 
			typeof z === "undefined" && 
			typeof angle === "undefined"){
				var nAxis = new Vec3(x);
				nAxis.normalize();
				var sinAngle = Math.sin((y*Math.PI/180)/2.0);
				nAxis.scale(sinAngle);
				
				return new Quaternion(new Vec4(nAxis, Math.cos((y*Math.PI/180)/2.0)));
		}
	}
};
