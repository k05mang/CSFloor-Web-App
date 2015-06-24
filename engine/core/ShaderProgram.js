
function ShaderStruct(structName){
	this.name = structName;
	this.fields = [];
	this.fieldTypes = [];
};
	
	ShaderStruct.prototype.addField = function(fieldType, field){
		this.fieldTypes.push(fieldType.trim());
		this.fields.push(field.trim());
	};

function ShaderProgram (shaderNames, shaderTypes){
	this.space1plus = "(?:\\s+|\\t+)+";
	this.space0plus = "(?:\\s*|\\t*)*";
	this.initializers = "(?:\\((?:\\d+|\\d+\\.\\d+f?|\\w|\\-|\\*|/|\\+|,|\\(|\\)|"+this.space0plus+")*\\)";

	
	this.uniforms = new Hashtable();
	var type = function(shader){
                switch(shader.type){
                    case "vertex":
                        return gl.VERTEX_SHADER;
                    case "fragment":
                        return gl.FRAGMENT_SHADER;
                    default:
                        break;
                }
            };
	
	this.programObjects = [];
	this.programId = gl.createProgram();
	
	for (var shaders = 0; shaders < shaderNames.length; shaders++) {
	    var curShaderFile = document.getElementById(shaderNames[shaders]);
	    
		this.programObjects.push(this.createShader(
				curShaderFile.innerHTML, type(curShaderFile)));
		gl.attachShader(this.programId, this.programObjects[shaders]);
	}
	gl.linkProgram(this.programId);
	
	//check for faults in the shader program
	if(!gl.getProgramParameter(this.programId, gl.LINK_STATUS)){
		var infoLog = gl.getProgramInfoLog(this.programId);
		
		for(var shader = 0; shader < this.programObjects.length;shader++){
			gl.detachShader(this.programId, this.programObjects[shader]);
			gl.deleteShader(this.programObjects[shader]);
		}
		gl.deleteProgram(this.programId);
		
		console.log("Failed to link program");
		console.log(infoLog);
	}else{
		for (var detach = 0; detach < this.programObjects.length; detach++) {
			gl.detachShader(this.programId, this.programObjects[detach]);
			gl.deleteShader(this.programObjects[detach]);
		}
        var keys = this.uniforms.keys();
        for(var curUni = 0; curUni < keys.length; curUni++){
            var varName = keys[curUni];
			this.uniforms.get(varName).setLoc(gl.getUniformLocation(this.programId, varName));
		}
	}
};

    ShaderProgram.prototype.get = function(retrieve){
        return this.uniforms.containsKey(retrieve) ? this.uniforms.get(retrieve).getLoc() : -1;
    };
    
    ShaderProgram.prototype.bind = function(){
        gl.useProgram(this.programId);
    };
    
    ShaderProgram.prototype.unbind = function(){
        gl.useProgram(null);
    };
    
    ShaderProgram.prototype.erase = function(){
        gl.deleteProgram(this.programId);
    };
    
    ShaderProgram.prototype.genUniforms = function(type, names){
        var varNames = names.trim().replace(new RegExp("="+this.space0plus+"(?:"+type+this.initializers+")|true|false|\\d+|\\d+\\.\\d+f?)"+this.space0plus+",?", "g"), ",")
        .split(new RegExp(this.space0plus+","+this.space0plus));
        
        for(var vars = 0; vars < varNames.length; vars++){
            if(varNames[vars].indexOf("[") == -1){
                this.uniforms.put(varNames[vars], new Uniform(varNames[vars], type));
            }
            else{
                // var arraySize = varNames[vars].substring(indexOfBrace1+1, indexOfBrace2);
                // var uniformName = varNames[vars].substring(0, indexOfBrace1);
                
                var arraySize = varNames[vars].match(/\[\d+\]/);
                var uniformName = varNames[vars].match(/\w+\[/);
                
                for(var array = 0; array < arraySize; array++){
                    this.uniforms.put(uniformName+"["+array+"]", new Uniform(uniformName+"["+array+"]", type));
                }
            }
        }
    };
    
    ShaderProgram.prototype.genStruct = function(name, memberList, structMap){
        var struct = new ShaderStruct(name);
        var members = memberList.trim().split(new RegExp(this.space0plus+";"));
        //iterate over the different groups of variables for the current structure
        for(var curGroup = 0; curGroup < members.length; curGroup++){
            //separate the type from the names
            var type_names = members[curGroup].trim().replace(new RegExp(this.space1plus), "@").split(/\@/);
            var type = type_names[0];//store type
            var names = type_names[1].split(new RegExp(this.space0plus+","+this.space0plus));//separate the names
            //iterate over the names of the structure variables
            for(var curName = 0; curName < names.length; curName++){
                var curVar = names[curName].trim();
                //determine if the name is an array type or not and store the names
                if(curVar.indexOf("[") == -1){
                    struct.addField(type, curVar);
                }
                else{
                    // var indexOfBrace1 = curVar.indexOf("[");
                    // var indexOfBrace2 = curVar.indexOf("]");
//                  
                    // var arraySize = Integer.parseInt(curVar.substring(indexOfBrace1+1, indexOfBrace2));
                    // var varName = curVar.substring(0, indexOfBrace1);
                    var arraySize = varNames[vars].match(/\[\d+\]/);
                    var varName = varNames[vars].match(/\w+\[/);
                    //create the different names for each element of the array
                    for(var array = 0; array < arraySize; array++){
                        struct.addField(type, varName+"["+array+"]");
                    }
                }
            }
        }
        //store in the structures map passed to the function using the provided name
        structMap.put(name, struct);
    };
    
    ShaderProgram.prototype.genStructUniform = function(name, curType, structMap){
        var glslTypes = /float|int|uint|bool|mat2|mat2x2|mat2x3|mat2x4|mat3|mat3x3|mat3x2|mat3x4|mat4|mat4x4|mat4x2|mat4x3|vec2|uvec2|ivec2|bvec2|vec3|uvec3|ivec3|bvec3|vec4|uvec4|ivec4|bvec4/;
        if(glslTypes.test(curType)){
            this.uniforms.put(name, new Uniform(name, curType));
        }else{
            var current = structMap.get(curType);
            for(var structVar = 0; structVar < current.fields.length; structVar++){
                var curName = name+"."+current.fields.get(structVar);
                this.genStructUniform(curName, current.fieldTypes.get(structVar), structMap);
            }
        }
    };
    
    /**
     * 
     * @param structName
     * @param uniformNames Names of the instances of the uniform structure to be formed
     * @param structMap
     */
    ShaderProgram.prototype.genUniformStructs = function(structName, uniformNames, structMap){
        //split up the instance names
        var instanceNames = uniformNames.replace(new RegExp("="+this.space0plus+"(?:"+structName+this.initializers+")|true|false|\\d+|\\d+\\.\\d+f?)"+this.space0plus+",?", "g"), ",")
        .split(new RegExp(this.space0plus+","+this.space0plus));
        //iterate over every instance name
        for(var curInstance = 0; curInstance < instanceNames.length; curInstance++){
            //get the name of the instance
            var curVar = instanceNames[curInstance];
            //check if it is an array type
            if(curVar.indexOf("[") == -1){
                this.genStructUniform(curVar, structName, structMap);
            }
            else{
                // var indexOfBrace1 = curVar.indexOf("[");
                // var indexOfBrace2 = curVar.indexOf("]");
                // var arraySize = Integer.parseInt(curVar.substring(indexOfBrace1+1, indexOfBrace2));
                // var varName = curVar.substring(0, indexOfBrace1);
                var arraySize = varNames[vars].match(/\[\d+\]/);
                var varName = varNames[vars].match(/\w+\[/);
                //create the different names for each element of the array
                for(var array = 0; array < arraySize; array++){
                    this.genStructUniform(varName+"["+array+"]", structName, structMap);
                }
            }
        }
    };
    
    /**
     *this method takes the string of the name of the uniform to set, and the value to set it
     * the value can be a series of values for vec types or an array for both vec types and matrices 
     */
    ShaderProgram.prototype.setUniform = function(uniformName){
        if(arguments.length == 3){
            if(typeof arguments[1] === "boolean" && Array.isArray(arguments[2])){
                this.uniforms.get(uniformName).setMat(arguments[1], arguments[2]);
            }else{
                this.uniforms.get(uniformName).set(Array.prototype.slice.call(arguments).slice(1,arguments.length));
            }
        }else{
            if(Array.isArray(arguments[1])){
                this.uniforms.get(uniformName).set(arguments[1]);
            }else{
                this.uniforms.get(uniformName).set(Array.prototype.slice.call(arguments).slice(1,arguments.length));
            }
        }
    };
    
    /**
     * Generates a shader object, reads the source code for a shader, and compiles the shader to be used
     * in the rendering pipeline
     * 
     * @param fileName String specifying the file path to the file containing the shader code
     * 
     * @param shaderType The type of shader to be generated, this must be one of the types specified
     * in the openGL specification, that is gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * 
     * @param gl OpenGL graphics context with which to work with shaders
     * 
     * @return Returns an int representing the handle for the generated shader object
     */
    ShaderProgram.prototype.createShader = function(file, shaderType){
        var shaderID = 0;
        
        /*scan the file taking each line and adding it to the source array list and the lengths of each line to the 
        Integer array list*/
        var structs = new Hashtable();
        var splitFile = file.split(/\n/);
        var line;
        //set of regular expressions to use in determining information about the shader
        var uniform = "uniform";//due to constant usage, make a universal object for it
        var struct = "struct";
        /*String glslTypes = "float|int|uint|bool|mat2|mat2x2|mat2x3|mat2x4|mat3|mat3x3|mat3x2|mat3x4|mat4|mat4x4|mat4x2|mat4x3|"+
        "vec2|uvec2|ivec2|bvec2|vec3|uvec3|ivec3|bvec3|vec4|uvec4|ivec4|bvec4|\\w*sampler\\w*";*/
        var numAnon = 0;
        var anon = "anonStruct";
        
        for(var lineIndex = 0; lineIndex < splitFile.length; lineIndex++){
            line = splitFile[lineIndex];
            //process potential uniforms
            if(line.indexOf(uniform) > -1){
                if(line.indexOf(struct) > -1){
                    var structInfo = new String(line);
                    //continue reading the shader storing additional information about the structure in the string builder
                    //while also updating the line variable and the source string builder
                    while(line.indexOf("}") == -1){
                        lineIndex++;
                        line = splitFile[lineIndex];
                        structInfo += line;
                    }
                    var left = structInfo.indexOf(struct);
                    var right = structInfo.indexOf('}');
                    //get the substring starting after the keyword struct and before the } brace
                    //then split on { dividing the data into the name and the member list of the struct
                    var structData = structInfo.substring(left+struct.length, right).split(new RegExp(this.space0plus+"\\{"+this.space0plus));
                    //store the name of the structure
                    var structName = structData[0].trim();
                    if(structName.length == 0){
                        structName = anon+numAnon;
                        numAnon++;
                    }
                    //generate a structure for use
                    this.genStruct(structName, structData[1], structs);
                    //determine if potential instance names have already been gathered into the current string
                    if(line.indexOf(";") == -1){//if they haven't
                        //then continue processing the shader file until the end delimited is found
                        //updating the proper variables as necessary
                        while(line.indexOf(";") == -1){
                            lineIndex++;
                            line = splitFile[lineIndex];
                            structInfo += line;
                        }
                        //get the instance names between the } brace and the ; 
                        var instances = structInfo.substring(right+1, structInfo.lastIndexOf(';')).trim();
                        //check if there are any intance names to actually process
                        if(instances.length != 0){
                            //generate uniforms based on the structures fields and types and create uniforms with those values and the variable name
                            this.genUniformStructs(structName, instances, structs);
                        }
                    }else{//if they have
                        //get the instance names between the } brace and the ; 
                        var instances = structInfo.substring(right+1, structInfo.lastIndexOf(';')).trim();
                        //check if there are any intance names to actually process
                        if(instances.length != 0){
                            //generate uniforms based on the structures fields and types and create uniforms with those values and the variable name
                            this.genUniformStructs(structName, instances, structs);
                        }
                    }
                }else{
                    var left = line.indexOf(uniform);
                    var right = line.indexOf(';');
                    //use the @ to replace the spacing between the uniform type and the names of the uniforms then split them around that
                    var typeNames = line.substring(left+uniform.length, right).trim().replace(new RegExp(this.space1plus), "@").split(/\@/);
                    //determine is the uniform type is a struct type or basic type
                    if(!structs.containsKey(typeNames[0])){
                        this.genUniforms(typeNames[0], typeNames[1]);
                    }else{
                        this.genUniformStructs(typeNames[0], typeNames[1], structs);
                    }
                }
            }else if(line.indexOf(struct) > -1){
                var structInfo = new String(line);
                //continue reading the shader storing additional information about the structure in the string builder
                //while also updating the line variable and the source string builder
                while(line.indexOf("}") == -1){
                    lineIndex++;
                    line = splitFile[lineIndex];
                    structInfo += line;
                }
                var left = structInfo.indexOf(struct);
                var right = structInfo.indexOf('}');
                //get the substring starting after the keyword struct and before the } brace
                //then split on {  dividing the data into the name and the member list of the struct
                var structData = structInfo.substring(left+struct.length, right).split(new RegExp(this.space0plus+"\\{"+this.space0plus));
                //store the name of the structure
                var structName = structData[0].trim();
                if(structName.length != 0){
                    //generate a structure for use
                    this.genStruct(structName, structData[1], structs);
                }
            }
        }
        //create a shader object and store it in a handler for the application to use
        shaderID = gl.createShader(shaderType);
        //send the source code read from the file to the shader object
        gl.shaderSource(shaderID, file);
        //compile the source code stored on the specified shader object
        gl.compileShader(shaderID);
        //check whether the shader passed being compiled
        if(!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)){
            console.log(gl.getShaderInfoLog(shaderID));
        }
        return shaderID;
    };
    
    ShaderProgram.prototype.bindAttribLoc = function(index, name){
        gl.bindAttribLocation(this.programId, index, name);
    };
