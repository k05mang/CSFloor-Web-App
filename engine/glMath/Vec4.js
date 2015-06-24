function Vec4(x,y,z,w){
	
	// this.SIZE_IN_BYTES = 16;
	// this.SIZE_IN_FLOATS = 4;
	var ROUND_VALUE = 1e-10;
	
	if(typeof x === "undefined" &&
		typeof y === "undefined" &&
		typeof z === "undefined" &&
		typeof w === "undefined"){
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
		this.w = 0.0;
	}else if(typeof x === "number" &&
		typeof y === "number" &&
		typeof z === "number" &&
		typeof w === "number"){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}else if(x instanceof Vec2 &&
		y instanceof Vec2 &&
		typeof z === "undefined" &&
		typeof w === "undefined"){
		this.x = x.x;
		this.y = x.y;
		this.z = y.x;
		this.w = y.y;
	}else if(x instanceof Vec2 &&
		typeof y === "number" &&
		typeof z === "number" &&
		typeof w === "undefined"){
		this.x = x.x;
		this.y = x.y;
		this.z = y;
		this.w = z;
	}else if(typeof x === "number" &&
		typeof y === "number" &&
		z instanceof Vec2 &&
		typeof w === "undefined"){
		this.x = x;
		this.y = y;
		this.z = z.x;
		this.w = z.y;
	}else if(typeof x === "number" &&
		y instanceof Vec2 &&
		typeof z === "number" &&
		typeof w === "undefined"){
		this.x = x;
		this.y = y.x;
		this.z = y.y;
		this.w = z;
	}else if(typeof x === "number" &&
		y instanceof Vec3 &&
		typeof z === "undefined" &&
		typeof w === "undefined"){
		this.x = x;
		this.y = y.x;
		this.z = y.y;
		this.w = y.z;
	}else if(x instanceof Vec3 &&
		typeof y === "number" &&
		typeof z === "undefined" &&
		typeof w === "undefined"){
		this.x = x.x;
		this.y = x.y;
		this.z = x.z;
		this.w = y;
	}else if(x instanceof Vec4 &&
		typeof y === "undefined" &&
		typeof z === "undefined" &&
		typeof w === "undefined"){
		this.x = x.x;
		this.y = x.y;
		this.z = x.z;
		this.w = x.w;
	}else if(typeof x === "number" &&
		typeof y === "undefined" &&
		typeof z === "undefined" &&
		typeof w === "undefined"){
		this.x = x;
		this.y = x;
		this.z = x;
		this.w = x;
	}
};
		
	Vec4.prototype.dot = function(vector) {
		if(vector instanceof Vec4){
			return this.x*vector.x+
					this.y*vector.y+
					this.z*vector.z+
					this.w*vector.w;
		}else{
			return 0;
		}
	};
	
	Vec4.prototype.length = function(){
		return Math.sqrt(this.x*this.x+
						this.y*this.y+
						this.z*this.z+
						this.w*this.w);
	};
	
	Vec4.prototype.normalize = function(){
		var len = Math.sqrt(this.x*this.x+
						this.y*this.y+
						this.z*this.z+
						this.w*this.w);
		this.x /= len;
        this.y /= len;
        this.z /= len;
        this.w /= len;
		return len;
	};
	
	Vec4.prototype.add = function(x, y, z, w){
		if(x instanceof Vec4){
			this.x += x.x;
			this.y += x.y;
			this.z += x.z;
			this.w += x.w;
		}else if(typeof x === "number" 
			&& typeof y === "number"
			&& typeof z === "number"
			&& typeof w === "number"){
			this.x += x;
			this.y += y;
			this.z += z;
			this.w += w;
		}
		return this;
	};
	
	Vec4.prototype.subtract = function(x, y, z, w){
		if(x instanceof Vec4){
			this.x -= x.x;
			this.y -= x.y;
			this.z -= x.z;
			this.w -= x.w;
		}else if(typeof x === "number" 
			&& typeof y === "number"
			&& typeof z === "number"
			&& typeof w === "number"){
			this.x -= x;
			this.y -= y;
			this.z -= z;
			this.w -= w;
		}
		return this;
	};
	
	Vec4.prototype.scale = function(factor){
		this.x *= factor;
		this.y *= factor;
		this.z *= factor;
		this.w *= factor;
		return this;
	};
	
	Vec4.prototype.set = function(){
	    if(arguments.length == 1){
	        if(arguments[0] instanceof Vec4){
                this.x = arguments[0].x;
                this.y = arguments[0].y;
                this.z = arguments[0].z;
                this.w = arguments[0].w;
            }
	    }else if(arguments.length == 2){
	        if(typeof arguments[0] === "number" &&
                typeof arguments[1] === "number"){
                switch(arguments[0]){
                    case 0:
                        this.x = arguments[1];
                        break;
                    case 1:
                        this.y = arguments[1];
                        break;
                    case 2:
                        this.z = arguments[1];
                        break;
                    case 3:
                        this.w = arguments[1];
                        break;
                }
            }
	    }else if(arguments.length == 4){
            if(
                typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number" &&
                typeof arguments[3] === "number"
            ){
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
                this.w = arguments[3];
            }
        }
		return this;
	};
	
	Vec4.prototype.swizzle = function(type){
		type = type.trim();
		switch(type.length){
			case 2:
				switch(type.charAt(0)){
					case 'x':
						return this.getPosType(type, 2);
					case 'y':
						return this.getPosType(type, 2);
					case 'z':
						return this.getPosType(type, 2);
					case 'w':
						return this.getPosType(type, 2);
						
					case 'r':
						return this.getColorType(type, 2);
					case 'g':
						return this.getColorType(type, 2);
					case 'b':
						return this.getColorType(type, 2);
					case 'a':
						return this.getColorType(type, 2);
						
					case 's':
						return this.getTextureType(type, 2);
					case 't':
						return this.getTextureType(type, 2);
					case 'p':
						return this.getTextureType(type, 2);
					case 'q':
						return this.getTextureType(type, 2);
					default:
						return null;
				}
			case 3:
				switch(type.charAt(0)){
					case 'x':
						return this.getPosType(type, 3);
					case 'y':
						return this.getPosType(type, 3);
					case 'z':
						return this.getPosType(type, 3);
					case 'w':
						return this.getPosType(type, 3);
						
					case 'r':
						return this.getColorType(type, 3);
					case 'g':
						return this.getColorType(type, 3);
					case 'b':
						return this.getColorType(type, 3);
					case 'a':
						return this.getColorType(type, 3);
						
					case 's':
						return this.getTextureType(type, 3);
					case 't':
						return this.getTextureType(type, 3);
					case 'p':
						return this.getTextureType(type, 3);
					case 'q':
						return this.getTextureType(type, 3);
					default:
						return null;
				}
			case 4:
				switch(type.charAt(0)){
					case 'x':
						return this.getPosType(type, 4);
					case 'y':
						return this.getPosType(type, 4);
					case 'z':
						return this.getPosType(type, 4);
					case 'w':
						return this.getPosType(type, 4);
						
					case 'r':
						return this.getColorType(type, 4);
					case 'g':
						return this.getColorType(type, 4);
					case 'b':
						return this.getColorType(type, 4);
					case 'a':
						return this.getColorType(type, 4);
						
					case 's':
						return this.getTextureType(type, 4);
					case 't':
						return this.getTextureType(type, 4);
					case 'p':
						return this.getTextureType(type, 4);
					case 'q':
						return this.getTextureType(type, 4);
					default:
						return null;
				}
			default:
				return null;
		}
	};
	
	Vec4.prototype.getPosType = function(type, size){
		var result = null;
		switch(size){
			case 2:
				result = new Vec2();
				break;
			case 3:
				result = new Vec3();
				break;
			case 4:
				result = new Vec4();
				break;
		}
		
		for (var index = 0; index < size; index++) {
			var symbol = type.charAt(index);

			switch (symbol) {
				case 'x':
					result.set(index, this.x);
					break;
				case 'y':
					result.set(index, this.y);
					break;
				case 'z':
					result.set(index, this.z);
					break;
				case 'w':
					result.set(index, this.w);
					break;
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec4.prototype.getColorType = function(type, size){
		var result = null;
		switch(size){
			case 2:
				result = new Vec2();
				break;
			case 3:
				result = new Vec3();
				break;
			case 4:
				result = new Vec4();
				break;
		}
		
		for (var index = 0; index < size; index++) {
			var symbol = type.charAt(index);

			switch (symbol) {
				case 'r':
					result.set(index, this.x);
					break;
				case 'g':
					result.set(index, this.y);
					break;
				case 'b':
					result.set(index, this.z);
					break;
				case 'a':
					result.set(index, this.w);
					break;
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec4.prototype.getTextureType = function(type, size){
		var result = null;
		switch(size){
			case 2:
				result = new Vec2();
				break;
			case 3:
				result = new Vec3();
				break;
			case 4:
				result = new Vec4();
				break;
		}
		
		for (var index = 0; index < size; index++) {
			var symbol = type.charAt(index);

			switch (symbol) {
				case 's':
					result.set(index, this.x);
					break;
				case 't':
					result.set(index, this.y);
					break;
				case 'p':
					result.set(index, this.z);
					break;
				case 'q':
					result.set(index, this.w);
					break;
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec4.prototype.proj = function(vector){
		if(vector instanceof Vec4){
			var target = new Vec4(vector);
			return target.scale(dot(target)/target.dot(target));
		}else{
			return null;
		}
	};
	
	Vec4.prototype.comp = function(vector){
		if(vector instanceof Vec4){
				return this.dot(vector)/vector.length();
		}else{
			return 0;
		}
	};
	
	Vec4.prototype.toString = function(){
		return this.x+" | "+this.y+" | "+this.z+" | "+this.w;
	};
    
    Vec4.prototype.equals = function(vec){
        if(vec instanceof Vec4){
            return vec.x == this.x && vec.y == this.y && vec.z == this.z && vec.w == this.w;
        }else{
            return false;
        }
    };
	
	Vec4.prototype.asBuffer = function(){
		return [this.x,this.y,this.z,this.w];
	};
	
	Vec4.prototype.print = function(){
		console.log(this.toString());
	};
	
	Vec4.prototype.isZero = function(){
		return this.x == 0.0 && this.y == 0.0 && this.z == 0.0 && this.w == 0.0;
	};

	Vec4.prototype.trunc = function(){
		if(this.x < this.ROUND_VALUE && this.x > -this.ROUND_VALUE){
			this.x = 0.0;
		}
		
		if(this.y < this.ROUND_VALUE && this.y > -this.ROUND_VALUE){
			this.y = 0.0;
		}
		
		if(this.z < this.ROUND_VALUE && this.z > -this.ROUND_VALUE){
			this.z = 0.0;
		}
		
		if(this.w < this.ROUND_VALUE && this.w > -this.ROUND_VALUE){
			this.w = 0.0;
		}
	};
	
	Vec4.prototype.inverse = function(){
		return (new Vec4(this)).scale(-1);
	};

Vec4.SIZE_IN_BYTES = 16;
Vec4.SIZE_IN_FLOATS = 4;
