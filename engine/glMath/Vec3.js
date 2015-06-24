function Vec3(x,y,z){
	
	// this.SIZE_IN_BYTES = 12;
	// this.SIZE_IN_FLOATS = 3;
	var ROUND_VALUE = 1e-10;
	
	if(typeof x === "number" &&
		typeof y === "number" &&
		typeof z === "number"){
		this.x = x;
		this.y = y;
		this.z = z;
	}else if(x instanceof Vec3 &&
		typeof y === "undefined" &&
		typeof z === "undefined"){
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
	}else if(typeof x === "number" &&
		typeof y === "undefined" &&
		typeof z === "undefined"){
			this.x = x;
			this.y = x;
			this.z = x;
	}else if(x instanceof Vec2 &&
		typeof y === "number" &&
		typeof z === "undefined"){
			this.x = x.x;
			this.y = x.y;
			this.z = y;
	}else if(typeof x === "number" &&
		y instanceof Vec2 &&
		typeof z === "undefined"){
			this.x = x;
			this.y = y.x;
			this.z = y.y;
	}else if(typeof x === "undefined" &&
		typeof y === "undefined" &&
		typeof z === "undefined"){
			this.x = 0.0;
			this.y = 0.0;
			this.z = 0.0;
	}
};
	
	Vec3.prototype.cross = function(vector){
		return new Vec3(
					this.y*vector.z - this.z*vector.y,
					this.z*vector.x - this.x*vector.z,
					this.x*vector.y - this.y*vector.x
					);
	};
		
	Vec3.prototype.dot = function(vector) {
		if(vector instanceof Vec3){
			return this.x*vector.x+
					this.y*vector.y+
					this.z*vector.z;
		}else{
			return 0;
		}
	};
	
	Vec3.prototype.length = function(){
		return Math.sqrt(this.x*this.x+
						this.y*this.y+
						this.z*this.z);
	};
	
	Vec3.prototype.normalize = function(){
		var len = Math.sqrt(this.x*this.x+
						this.y*this.y+
						this.z*this.z);
		this.x /= len;
        this.y /= len;
        this.z /= len;
		return len;
	};
	
	Vec3.prototype.add = function(x, y, z){
		if(x instanceof Vec3){
			this.x += x.x;
			this.y += x.y;
			this.z += x.z;
		}else if(typeof x === "number" 
			&& typeof y === "number"
			&& typeof z === "number"){
			this.x += x;
			this.y += y;
			this.z += z;
		}
		return this;
	};
	
	Vec3.prototype.subtract = function(x, y, z){
		if(x instanceof Vec3){
			this.x -= x.x;
			this.y -= x.y;
			this.z -= x.z;
		}else if(typeof x === "number" 
			&& typeof y === "number"
			&& typeof z === "number"){
			this.x -= x;
			this.y -= y;
			this.z -= z;
		}
		return this;
	};
	
	Vec3.prototype.scale = function(factor){
		this.x *= factor;
		this.y *= factor;
		this.z *= factor;
		return this;
	};
	
	Vec3.prototype.set = function(){
        if(arguments.length == 1){
            if(arguments[0] instanceof Vec3){
                this.x = arguments[0].x;
                this.y = arguments[0].y;
                this.z = arguments[0].z;
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
                }
            }
        }else if(arguments.length == 3){
            if(
                typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number"
            ){
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
            }
        }
        return this;
    };
	
	Vec3.prototype.swizzle = function(type){
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
							
						case 'r':
							return this.getColorType(type, 2);
						case 'g':
							return this.getColorType(type, 2);
						case 'b':
							return this.getColorType(type, 2);
							
						case 's':
							return this.getTextureType(type, 2);
						case 't':
							return this.getTextureType(type, 2);
						case 'p':
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
							
						case 'r':
							return this.getColorType(type, 3);
						case 'g':
							return this.getColorType(type, 3);
						case 'b':
							return this.getColorType(type, 3);
							
						case 's':
							return this.getTextureType(type, 3);
						case 't':
							return this.getTextureType(type, 3);
						case 'p':
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
							
						case 'r':
							return this.getColorType(type, 4);
						case 'g':
							return this.getColorType(type, 4);
						case 'b':
							return this.getColorType(type, 4);
							
						case 's':
							return this.getTextureType(type, 4);
						case 't':
							return this.getTextureType(type, 4);
						case 'p':
							return this.getTextureType(type, 4);
						default:
							return null;
					}
				default:
					return null;
			}
	};
		
	Vec3.prototype.getPosType = function(type, size){
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
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec3.prototype.getColorType = function(type, size){
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
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec3.prototype.getTextureType = function(type, size){
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
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec3.prototype.proj = function(vector){
		if(vector instanceof Vec3){
			var target = new Vec3(vector);
			return target.scale(dot(target)/target.dot(target));
		}else{
			return null;
		}
	};
	
	Vec3.prototype.comp = function(vector){
		if(vector instanceof Vec3){
				return this.dot(vector)/vector.length();
		}else{
			return 0;
		}
	};
	
	Vec3.prototype.toString = function(){
		return this.x+" | "+this.y+" | "+this.z;
	};
    
    Vec3.prototype.equals = function(vec){
        if(vec instanceof Vec3){
            return vec.x == this.x && vec.y == this.y && vec.z == this.z;
        }else{
            return false;
        }
    };
	
	Vec3.prototype.asBuffer = function(){
		return [this.x,this.y,this.z];
	};
	
	Vec3.prototype.print = function(){
		console.log(this.toString());
	};
	
	Vec3.prototype.isZero = function(){
		return this.x == 0.0 && this.y == 0.0 && this.z == 0.0;
	};

	Vec3.prototype.trunc = function(){
		if(this.x < this.ROUND_VALUE && this.x > -this.ROUND_VALUE){
			this.x = 0.0;
		}
		
		if(this.y < this.ROUND_VALUE && this.y > -this.ROUND_VALUE){
			this.y = 0.0;
		}
		
		if(this.z < this.ROUND_VALUE && this.z > -this.ROUND_VALUE){
			this.z = 0.0;
		}
	};
	
	Vec3.prototype.inverse = function(){
		return (new Vec3(this)).scale(-1);
	};

Vec3.SIZE_IN_BYTES = 12;
Vec3.SIZE_IN_FLOATS = 3;
