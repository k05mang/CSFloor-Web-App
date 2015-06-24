function Vec2(x,y){
	
	// this.SIZE_IN_BYTES = 8;
	// this.SIZE_IN_FLOATS = 2;
	var ROUND_VALUE = 1e-10;
	
	if( typeof x === "number" &&
		 typeof y === "number"){
			this.x = x;
			this.y = y;
	}else if( x instanceof Vec2 &&
		 typeof y === "undefined" ){
			this.x = x.x;
			this.y = x.y;
	}else if( typeof x === "number" &&
		 typeof y ===  "undefined"){
			this.x = x;
			this.y = x;
	}else if( typeof x === "undefined" &&
		 typeof y === "undefined"){
			this.x = 0.0;
			this.y = 0.0;
	}
};
		
	Vec2.prototype.dot = function(vector) {
		if( vector instanceof Vec2){
			return this.x*vector.x+this.y*vector.y;
		}else{
			return 0;
		}
	};
	
	Vec2.prototype.length = function(){
		return Math.sqrt(this.x*this.x+
					this.y*this.y);
	};
	
	Vec2.prototype.normalize = function(){
		var len = Math.sqrt(this.x*this.x+
					this.y*this.y);
		this.x /= len;
        this.y /= len;
		return len;
	};
	
	Vec2.prototype.add = function(x, y){
		if( x instanceof Vec2){
			this.x += x.x;
			this.y += x.y;
		}else if( typeof x === "number" 
			&&  typeof y === "number"){
			this.x += x;
			this.y += y;
		}
		return this;
	};
	
	Vec2.prototype.subtract = function(x, y){
		if( x instanceof Vec2){
			this.x -= x.x;
			this.y -= x.y;
		}else if( typeof x === "number" 
			&&  typeof y === "number"){
			this.x -= x;
			this.y -= y;
		}
		return this;
	};
	
	Vec2.prototype.scale = function(factor){
		this.x *= factor;
		this.y *= factor;
		return this;
	};
	
	Vec2.prototype.set = function(){
        if(arguments.length == 1){
            if(arguments[0] instanceof Vec2){
                this.x = arguments[0].x;
                this.y = arguments[0].y;
            }
        }else if(arguments.length == 2){
            if(typeof arguments[0] === "number" &&
                typeof arguments[1] === "number"){
                    //checks whether the values passed are floats in which case use the given values as
                    //values to set the vectors parameters
                    if(
                        arguments[0] === +arguments[0] && arguments[0] !== (arguments[0]|0) &&
                        arguments[1] === +arguments[1] && arguments[1] !== (arguments[1]|0)
                    ){
                        this.x = arguments[0];
                        this.y = arguments[1];
                    }else{
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
            }
        }
        return this;
    };
	
	Vec2.prototype.swizzle = function(type){
			type = type.trim();
			switch(type.length){
				case 2:
					switch(type.charAt(0)){
						case 'x':
							return this.getPosType(type, 2);
						case 'y':
							return this.getPosType(type, 2);
							
						case 'r':
							return this.getColorType(type, 2);
						case 'g':
							return this.getColorType(type, 2);
							
						case 's':
							return this.getTextureType(type, 2);
						case 't':
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
							
						case 'r':
							return this.getColorType(type, 3);
						case 'g':
							return this.getColorType(type, 3);
							
						case 's':
							return this.getTextureType(type, 3);
						case 't':
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
							
						case 'r':
							return this.getColorType(type, 4);
						case 'g':
							return this.getColorType(type, 4);
							
						case 's':
							return this.getTextureType(type, 4);
						case 't':
							return this.getTextureType(type, 4);
						default:
							return null;
					}
				default:
					return null;
			}
	};
		
	Vec2.prototype.getPosType = function(type, size){
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
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec2.prototype.getColorType = function(type, size){
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
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec2.prototype.getTextureType = function(type, size){
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
				default:
					return null;
			}
		}
		return result;
	};
	
	Vec2.prototype.proj = function(vector){
		if( vector instanceof Vec2){
			var target = new Vec2(vector);
			return target.scale(dot(target)/target.dot(target));
		}else{
			return null;
		}
	};
	
	Vec2.prototype.comp = function(vector){
		if( vector instanceof Vec2){
				return this.dot(vector)/vector.length();
		}else{
			return 0;
		}
	};
	
	Vec2.prototype.toString = function(){
		return this.x+" | "+this.y;
	};
    
    Vec2.prototype.equals = function(vec){
        if(vec instanceof Vec2){
            return vec.x == this.x && vec.y == this.y;
        }else{
            return false;
        }
    };
	
	Vec2.prototype.asBuffer = function(){
		return [this.x,this.y];
	};
	
	Vec2.prototype.print = function(){
		console.log(this.toString());
	};
	
	Vec2.prototype.isZero = function(){
		return this.x == 0.0 && this.y == 0.0;
	};

	Vec2.prototype.trunc = function(){
		if(this.x < this.ROUND_VALUE && this.x > -this.ROUND_VALUE){
			this.x = 0.0;
		}
		
		if(this.y < this.ROUND_VALUE && this.y > -this.ROUND_VALUE){
			this.y = 0.0;
		}
	};
	
	Vec2.prototype.inverse = function(){
		return (new Vec2(this)).scale(-1);
	};

Vec2.SIZE_IN_BYTES = 8;
Vec2.SIZE_IN_FLOATS = 2;