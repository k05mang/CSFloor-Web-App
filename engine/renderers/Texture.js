function Texture(){
	
	if(arguments.length === 7){
	    //(GLenum target, GLenum internalformat, 
        // GLsizei width, GLsizei height, GLenum format, 
        // GLenum type, ArrayBufferView? pixels)
        this.target = arguments[0];
        this.width = arguments[2];
        this.height = arguments[3];
        this.id = gl.createTexture();
        gl.bindTexture(this.target, this.id);
        gl.texImage2D(this.target, 0, arguments[1], 
            this.width, this.height, 0, arguments[4],
            arguments[5], arguments[6]);
	}else if(arguments.length === 5){
	    //empty texture made using the given format, dimensions, and type
        //(GLenum target, GLsizei width, GLsizei height, GLenum format, GLenum type)
        this.target = arguments[0];
        this.id = gl.createTexture();
        this.width = arguments[1];
        this.height = arguments[2];
        gl.bindTexture(this.target, this.id);
        
        gl.texImage2D(this.target, 0, arguments[3], 
            this.width, this.height, 0, arguments[3],
            arguments[4], null);
    }else if(arguments.length === 4){
        // (GLenum target, GLenum format, GLenum type, ImageData? pixels)
                    
        // (GLenum target, GLenum format, GLenum type, HTMLImageElement image)

        // (GLenum target, GLenum format, GLenum type, HTMLCanvasElement canvas)

        // (GLenum target, GLenum format, GLenum type, HTMLVideoElement video)
        //or arrays of the last param to be used in cube maps
        
        //get width and height from last param if possible or necessary?
        
        this.target = arguments[0];
        this.id = gl.createTexture();
        gl.bindTexture(this.target, this.id);
        
        if(arguments[0] === gl.TEXTURE_CUBE_MAP && Array.isArray(arguments[3])){
            if(arguments[3].length < 6){
                console.log("failed to generate cube map texture, insufficient image array data");
            }else{
                for(var image = 0; image < 6; iamge++){
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+image, 0, arguments[1], arguments[1],
                        arguments[2], arguments[3][image]);
                }
            }
        }else{
            gl.texImage2D(this.target, 0, arguments[1], arguments[1],
            arguments[2], arguments[3]);
        }
	    
	}else if(arguments.length === 2){
        // (GLenum target, ImageData? pixels)
                    
        // (GLenum target, HTMLImageElement image)

        // (GLenum target, HTMLCanvasElement canvas)

        // (GLenum target, HTMLVideoElement video)
        //or arrays of the last param to be used in cube maps
        
	    this.target = arguments[0];
        this.id = gl.createTexture();
        gl.bindTexture(this.target, this.id);
        
        if(arguments[0] === gl.TEXTURE_CUBE_MAP && Array.isArray(arguments[1])){
            if(arguments[1].length < 6){
                console.log("failed to generate cube map texture, insufficient image array data");
            }else{
                for(var image = 0; image < 6; iamge++){
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+image, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, arguments[1][image]);
                }
            }
        }else{
            gl.texImage2D(this.target, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, arguments[1]);
        }
	}

    gl.texParameteri( 
        this.target,
        gl.TEXTURE_MAG_FILTER,
        gl.LINEAR );

    gl.texParameteri( 
        this.target, 
        gl.TEXTURE_MIN_FILTER, 
        gl.LINEAR );

    gl.texParameteri( this.target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri( this.target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
};
	
	
	/**
	 * Sets the texParameter of this texture object
	 * 
	 * @param param The parameter to change 
	 * @param value The value to set the parameter to
	 */
Texture.prototype.setParam = function(param, value){
		//test if the given parameter is usable with the texParam function based on the opengl 3.3 specification
		if(param === gl.TEXTURE_MIN_FILTER){
		     if(value === gl.NEAREST ||
                value === gl.LINEAR ||
                value === gl.NEAREST_MIPMAP_NEAREST ||
                value === gl.LINEAR_MIPMAP_NEAREST ||
                value === gl.NEAREST_MIPMAP_LINEAR ||
                value === gl.LINEAR_MIPMAP_LINEAR){
                    
                    gl.bindTexture(this.target, this.id);
                    gl.texParameteri( this.target, param, value);
		     }
		}else if(param === gl.TEXTURE_MAG_FILTER){
		    if(value === gl.NEAREST ||
                value === gl.LINEAR){
                    
                    gl.bindTexture(this.target, this.id);
                    gl.texParameteri( this.target, param, value);
             }
		}else if(param === gl.TEXTURE_WRAP_S || param === gl.TEXTURE_WRAP_T){
		    if(value === gl.CLAMP_TO_EDGE ||
                value === gl.MIRRORED_REPEAT ||
                value === gl.REPEAT){
                    gl.bindTexture(this.target, this.id);
                    gl.texParameteri( this.target, param, value);
             }
		}
        gl.bindTexture(this.target, null);
	};
	
	/**
	 * Gets the OpenGL texture id for this texture object
	 * 
	 * @return Integer representing the OpenGL texture id
	 */
Texture.prototype.getId = function(){
		return this.id;
};
	
Texture.prototype.genMipMaps = function(){
        gl.bindTexture(this.target, this.id);
        gl.generateMipmap(this.target);
	};
	
	/**
	 * Binds this texture object to the context
	 */
Texture.prototype.bind = function(){
        gl.bindTexture(this.target, this.id);
};

Texture.prototype.unbind = function(){
        gl.bindTexture(this.target, null);
};
	
	/**
	 * Binds this texture object to the context after setting the active texture unit to the value 
	 * provided.
	 * 
	 * @param activeTexture OpenGL texture unit to bind this texture to, this value must be in the range
	 * GL_TEXTUREi, where i ranges from 0 (GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1)
	 * 
	 * @return True if this texture was bound to the texture unit, false if the provided value was not a 
	 * texture unit or was out of the range of the texture units
	 */
Texture.prototype.bind = function(texUnit){
		var maxUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		if(texUnit > gl.TEXTURE0 || texUnit < gl.TEXTURE0+maxUnits){
			gl.activeTexture(texUnit);
			gl.bindTexture(this.target, this.id);
			return true;
		}else{
			return false;
		}
	};
	
Texture.prototype.equals = function(o){
		if(o != null && o instanceof Texture){
			return this.id == o.getId();
		}
		return false;
};
	
Texture.prototype.hashCode = function(){
		return this.id;
};
	
	/**
	 * Deletes this texture from the graphics card
	 */
Texture.prototype.erase = function(){
		gl.deleteTextures(this.id);
};
