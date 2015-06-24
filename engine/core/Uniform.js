function Uniform(name, type){
	
	this.BLOCK = 0,
	this.FLOAT = 1,
	this.INT = 2,
	this.BOOL = 3,
	this.MAT2 = 4,
	this.MAT2X3 = 5,
	this.MAT2X4 = 6,
	this.MAT3 = 7,
	this.MAT3X2 = 8,
	this.MAT3X4 = 9,
	this.MAT4 = 10,
	this.MAT4X2 = 11,
	this.MAT4X3 = 12
		;
	this.name = name;
	if(typeof type !== "undefined"){
		if(type.toLowerCase().indexOf("sampler") > -1){
			this.type = this.INT;
			this.size = 1;
		}else{
			switch(type.toLowerCase()){
				case "float":
					this.type = this.FLOAT;
					this.size = 1;
					break;
				case "int":
					this.type = this.INT;
					this.size = 1;
					break;
				case "uint":
					this.type = this.INT;
					this.size = 1;
					break;
				case "bool":
					this.type = this.BOOL;
					this.size = 1;
					break;
					
				case "vec2":
					this.type = this.FLOAT;
					this.size = 2;
					break;
				case "ivec2":
					this.type = this.INT;
					this.size = 2;
					break;
				case "uvec2":
					this.type = this.INT;
					this.size = 2;
					break;
				case "bvec2":
					this.type = this.BOOL;
					this.size = 2;
					break;
					
				case "vec3":
					this.type = this.FLOAT;
					this.size = 3;
					break;
				case "ivec3":
					this.type = this.INT;
					this.size = 3;
					break;
				case "uvec3":
					this.type = this.INT;
					this.size = 3;
					break;
				case "bvec3":
					this.type = this.BOOL;
					this.size = 3;
					break;
					
				case "vec4":
					this.type = this.FLOAT;
					this.size = 4;
					break;
				case "ivec4":
					this.type = this.INT;
					this.size = 4;
					break;
				case "uvec4":
					this.type = this.INT;
					this.size = 4;
					break;
				case "bvec4":
					this.type = this.BOOL;
					this.size = 4;
					break;
					
				case "mat2":
					this.type = this.MAT2;
					this.size = 4;
					break;
				case "mat2x2":
					this.type = this.MAT2;
					this.size = 4;
					break;
				case "mat2x3":
					this.type = this.MAT2X3;
					this.size = 6;
					break;
				case "mat2x4":
					this.type = this.MAT2X4;
					this.size = 8;
					break;
					
				case "mat3":
					this.type = this.MAT3;
					this.size = 9;
					break;
				case "mat3x3":
					this.type = this.MAT3;
					this.size = 9;
					break;
				case "mat3x2":
					this.type = this.MAT3X2;
					this.size = 6;
					break;
				case "mat3x4":
					this.type = this.MAT3X4;
					this.size = 12;
					break;
					
				case "mat4":
					this.type = this.MAT4;
					this.size = 16;
					break;
				case "mat4x4":
					this.type = this.MAT4;
					this.size = 16;
					break;
				case "mat4x2":
					this.type = this.MAT4X2;
					this.size = 8;
					break;
				case "mat4x3":
					this.type = this.MAT4X3;
					this.size = 12;
					break;
			}
		}
	}else{
		this.type = this.BLOCK;
	}
	this.location = null;
};
	
	Uniform.prototype.setLoc = function(loc){
		this.location = loc;
	};
	
	Uniform.prototype.getLoc = function(){
		return this.location;
	};
	
	Uniform.prototype.isFloat = function(value){
		return value === +value && value !== (value|0);
	};
	
	Uniform.prototype.set = function(){
		if(arguments.length != 0){
			if(arguments.length == 1){
			    if(Array.isArray(arguments[0])){
			        if(this.type >= this.MAT2){
			            this.setMat(false, arguments[0]);
			        }else{
			            if(this.type == this.FLOAT){
			                switch(this.size){
                                case 1:
                                    gl.uniform1fv(this.location, new Float32Array(arguments[0]));
                                    break;
                                case 2:
                                    gl.uniform2fv(this.location, new Float32Array(arguments[0]));
                                    break;
                                case 3:
                                    gl.uniform3fv(this.location, new Float32Array(arguments[0]));
                                    break;
                                case 4:
                                    gl.uniform4fv(this.location, new Float32Array(arguments[0]));
                                    break;
                            }
			            }else{
			                switch(this.size){
                                case 1:
                                    gl.uniform1iv(this.location, new Int32Array(arguments[0]));
                                    break;
                                case 2:
                                    gl.uniform2iv(this.location, new Int32Array(arguments[0]));
                                    break;
                                case 3:
                                    gl.uniform3iv(this.location, new Int32Array(arguments[0]));
                                    break;
                                case 4:
                                    gl.uniform4iv(this.location, new Int32Array(arguments[0]));
                                    break;
                            }
			            }
			        }
			    }else{
			        if(this.type == this.FLOAT){
                        gl.uniform1f(this.location, arguments[0]);
                    }else{
                        gl.uniform1i(this.location, arguments[0]);
                    }
			    }
			}else{
			    if(this.type == this.FLOAT){
                    switch(this.size){
                        case 2:
                            gl.uniform2f(this.location, arguments[0],arguments[1]);
                            break;
                        case 3:
                            gl.uniform3f(this.location, arguments[0],arguments[1],arguments[2]);
                            break;
                        case 4:
                            gl.uniform4f(this.location, arguments[0],arguments[1],arguments[2],arguments[3]);
                            break;
                    }
                }else{
                    switch(this.size){
                        case 2:
                            gl.uniform2i(this.location, arguments[0],arguments[1]);
                            break;
                        case 3:
                            gl.uniform3i(this.location, arguments[0],arguments[1],arguments[2]);
                            break;
                        case 4:
                            gl.uniform4i(this.location, arguments[0],arguments[1],arguments[2],arguments[3]);
                            break;
                    }
                }
			}
		}
	};
	
	Uniform.prototype.setMat = function(transpose, data){
		if(this.type >= this.MAT2){
			var buffer = new Float32Array(data);
			switch (this.type) {
				case this.MAT2:
					gl.uniformMatrix2fv(this.location, transpose, buffer);
					break;
				case this.MAT2X3:
					gl.uniformMatrix2fv(this.location, transpose, buffer);
					break;
				case this.MAT2X4:
					gl.uniformMatrix2fv(this.location, transpose, buffer);
					break;
				case this.MAT3:
					gl.uniformMatrix3fv(this.location, transpose, buffer);
					break;
				case this.MAT3X2:
					gl.uniformMatrix3fv(this.location, transpose, buffer);
					break;
				case this.MAT3X4:
					gl.uniformMatrix3fv(this.location, transpose, buffer);
					break;
				case this.MAT4:
					gl.uniformMatrix4fv(this.location, transpose, buffer);
					break;
				case this.MAT4X2:
					gl.uniformMatrix4fv(this.location, transpose, buffer);
					break;
				case this.MAT4X3:
					gl.uniformMatrix4fv(this.location, transpose, buffer);
					break;
			}
		}else{
			console.log("Types do not match, this uniform is not a matrix type");
		}
	};
