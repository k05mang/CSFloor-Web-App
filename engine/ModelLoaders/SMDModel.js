
function SMDModel(){
    
    this.AUXILIARY_DATA_SIZE = 4;
    this.vertexSize = this.AUXILIARY_DATA_SIZE+Vertex.SIZE_OF_BONEDATA+Vertex.SIZE_IN_BYTES;
    
    if(arguments.length === 1){
        if(arguments[0] instanceof SMDModel){
            //add copy for armature class, we want the armature to be independent for each mesh, thus a copy is needed
            this.faces = arguments[0].faces;
            this.vertices = arguments[0].vertices;
            this.materials = arguments[0].materials;
            // this.name = arguments[0].name;
            
            this.modelMat = new Mat4(1);
            this.orientation = new Quaternion();
            this.vAttrib = arguments[0].vAttrib;
            this.nAttrib = arguments[0].nAttrib;
            // this.isAdjBuffered = arguments[0].isAdjBuffered;
            
            // this.vao = gl.createVertexArray();
            this.vbos = arguments[0].vbos;
            this.ibos = arguments[0].ibos;
            if(vaoEXT){
                this.vaos = arguments[0].vaos;
            }
        }
    }else if(arguments.length === 4){
        //(string filName, number vAttrib, material)
        this.vertices = [];
        this.faces = [];
        this.vaos = [];
        this.vbos = [];
        this.ibos= [];
        
        this.modelMat = new Mat4(1);
        this.vAttrib = arguments[1];
        this.nAttrib = arguments[1]+1;
        this.orientation = new Quaternion();
        
        this.data = null;
        this.fileSize = arguments[3];
        var thisModel = this;
        var request = new XMLHttpRequest();
        request.open("POST", arguments[0], false);
        request.overrideMimeType("text/plain; charset=x-user-defined");
        
        var receivedData = null;
        request.onload = function (oEvent) {
              receivedData = request.response;
              progress.value += thisModel.fileSize; 
              if(progress.value == progress.max){
                  progress.remove();
                  document.getElementById("data-span").remove();
                  document.body.appendChild(canvas);
                  instructionBar.style.top = "0%";
              }
        };
        
        request.send();
        var store = function(str) {
            var buf = new ArrayBuffer(str.length);
            var bufView = new Uint8Array(buf);
            for (var i = 0; i < str.length; i++) {
                bufView[i] = str.charCodeAt(i);
            }
    
            return buf;
        };
        
        receivedData = store(receivedData);
        this.data = new DataView(receivedData);
        
        var byteOffset = 0;
        
        var matName = arguments[2];
        
        this.materials = MaterialUtils.genMaterials(matName);
        //use a synchronous fetch of a material file from the server
        var numMats = this.data.getInt8(byteOffset, true);
        byteOffset++;
        
        //loop through each of the materials associated with this mesh and create the mesh data for it
        for(var curMat = 0; curMat < numMats; curMat++){
            var curVertices = [];
            var curIndices = [];
            
            //------START OF VERTEX AND INDEX PROCESSING-----------------------------------------------------
            var vertexCount = this.data.getUint16(byteOffset);
            byteOffset += 2;
            
            //loop that flips the floats to be big-endian
            for(var curFloat = 0; curFloat < vertexCount*(Vertex.SIZE_IN_FLOATS+this.AUXVERTFLOATS); curFloat++){
                curVertices.push(this.data.getFloat32(byteOffset, false));
                byteOffset += 4;
            }
            
            var numIndices = this.data.getInt16(byteOffset);
            byteOffset += 2;
            
            //loop that flips the shorts to be big-endian
            for(var curShort = 0; curShort < numIndices; curShort++){
                curIndices.push(this.data.getUint16(byteOffset, false));
                byteOffset += 2;
            }
            
            this.vbos.push(gl.createBuffer());
            this.ibos.push(gl.createBuffer());
            
            if(vaoEXT){
                //create the vertex array object
                this.vaos.push(vaoEXT.createVertexArrayOES());
                vaoEXT.bindVertexArrayOES(this.vaos[curMat]);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbos[curMat]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curVertices), gl.STATIC_DRAW);
                
                //tell opengl how to read the vertex data
                gl.vertexAttribPointer(this.vAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 0);
                gl.vertexAttribPointer(this.nAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 12);
                gl.vertexAttribPointer(this.nAttrib+1, 2, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 24);
                gl.vertexAttribPointer(this.nAttrib+2, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 32);
                gl.vertexAttribPointer(this.nAttrib+3, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 44);
                
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibos[curMat]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(curIndices) , gl.STATIC_DRAW);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                vaoEXT.bindVertexArrayOES(null);
            }else{
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbos[curMat]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curVertices), gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibos[curMat]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(curIndices) , gl.STATIC_DRAW);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            }
            
            this.vertices.push(curVertices);
            this.faces.push(curIndices);
        }
    }
};
	
	
	SMDModel.prototype.copy = function(){
		return new SMDModel(this);
	};
	
	SMDModel.prototype.getVertices = function(){
		return this.vertices;
	};
	
	SMDModel.prototype.getFaces = function(){
		return this.faces;
	};
	
	/**
	 * Shaders: shader that is being used in the rendering when this method is called
	 * diffuse: the texture index to bind the diffuse texture of this model to
	 * 
	 * normal: the texture index to bind the normal map texture of this model to
	 * useNMapVar: name of the variable in the shader that toggles the use of a normal map
	 * in the shader
     * 
     * specular: the texture index to bind the specular map texture of this model to
     * useSMapVar: name of the variable in the shader that toggles the use of a specular map
     * in the shader
     * 
     * occlusion: the texture index to bind the occlusion map texture of this model to
     * useOMapVar: name of the variable in the shader that toggles the use of a occlusion map
     * in the shader
	 */
	SMDModel.prototype.render = function(shader, diffuse, colorVar, useTexture, normal, useNMapVar, specular, useSMapVar, occlusion, useOMapVar, specPower, specInt){
		
		if(vaoEXT){
            for(var curMat = 0; curMat < this.vertices.length; curMat++){
                //bind materials
                var curMaterial = this.materials[curMat];
                curMaterial.bindDiffuse(diffuse);
                if(typeof shader !== "undefined"){
                    curMaterial.bindColor(shader, colorVar);
                }
                curMaterial.bindNormal(normal);
                curMaterial.bindSpecular(specular);
                curMaterial.bindOcclusion(occlusion);
                
                //tell the shader whether or not to use a color value or the diffuse texture
                if(typeof shader !== "undefined" && curMaterial.diffuse instanceof Vec3){
                    shader.setUniform(useTexture, false);
                }else if(typeof shader !== "undefined"){
                    shader.setUniform(useTexture, true);
                }
                
                //check whether to use normal map or not
                if(typeof shader !== "undefined"&& curMaterial.normal !== null && normal !== null && typeof normal !== "undefined"){
                    shader.setUniform(useNMapVar, true);
                }else if(typeof shader !== "undefined"&& curMaterial.normal === null && useNMapVar !== null && typeof useNMapVar !== "undefined"){
                    shader.setUniform(useNMapVar, false);
                }
                
                //check whether to use specular map or not
                if(typeof shader !== "undefined"&& curMaterial.specular !== null && specular !== null && typeof specular !== "undefined"){
                    shader.setUniform(useSMapVar, true);
                }else if(typeof shader !== "undefined"&& curMaterial.specular === null && useSMapVar !== null && typeof useSMapVar !== "undefined"){
                    shader.setUniform(useSMapVar, false);
                }
                
                //check whether to use occlusion map or not
                if(typeof shader !== "undefined"&& curMaterial.occlusion !== null && occlusion !== null && typeof occlusion !== "undefined"){
                    shader.setUniform(useOMapVar, true);
                }else if(typeof shader !== "undefined"&& curMaterial.occlusion === null && useOMapVar !== null && typeof useOMapVar !== "undefined"){
                    shader.setUniform(useOMapVar, false);
                }
                
                if(typeof shader !== "undefined"&& specPower !== null && typeof specPower !== "undefined"){
                    //in case the value given is 0 it will default to 1 since there seems to be an issue with raising values to 0 in glsl
                    var specP = curMaterial.getSpecPower();
                    shader.setUniform(specPower, (specP === 0 ? 1 : specP));
                }
                
                if(typeof shader !== "undefined"&& specInt !== null && typeof specInt !== "undefined"){
                    shader.setUniform(specInt, curMaterial.getSpecIntensity());
                }
                //bind buffers and render
                vaoEXT.bindVertexArrayOES(this.vaos[curMat]);
                gl.enableVertexAttribArray(this.vAttrib);
                gl.enableVertexAttribArray(this.nAttrib);
                gl.enableVertexAttribArray(this.nAttrib+1);
                
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibos[curMat]);
                gl.drawElements(gl.TRIANGLES, this.faces[curMat].length, gl.UNSIGNED_SHORT, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                
                gl.disableVertexAttribArray(this.vAttrib);
                gl.disableVertexAttribArray(this.nAttrib);
                gl.disableVertexAttribArray(this.nAttrib+1);
                vaoEXT.bindVertexArrayOES(null);
                
                curMaterial.unbindDiffuse();
                curMaterial.unbindNormal();
                curMaterial.unbindSpecular();
                curMaterial.unbindOcclusion();
            }
        }else{
            for(var curMat = 0; curMat < this.vertices.length; curMat++){
                //bind materials
                var curMaterial = this.materials[curMat];
                curMaterial.bindDiffuse(diffuse);
                if(typeof shader !== "undefined"){
                    curMaterial.bindColor(shader, colorVar);
                }
                curMaterial.bindNormal(normal);
                curMaterial.bindSpecular(specular);
                curMaterial.bindOcclusion(occlusion);
                
                //tell the shader whether or not to use a color value or the diffuse texture
                if(typeof shader !== "undefined" && curMaterial.diffuse instanceof Vec3){
                    shader.setUniform(useTexture, false);
                }else if(typeof shader !== "undefined"){
                    shader.setUniform(useTexture, true);
                }
                
                //check whether to use normal map or not
                if(typeof shader !== "undefined"&& curMaterial.normal !== null && normal !== null && typeof normal !== "undefined"){
                    shader.setUniform(useNMapVar, true);
                }else if(typeof shader !== "undefined"&& curMaterial.normal === null && useNMapVar !== null && typeof useNMapVar !== "undefined"){
                    shader.setUniform(useNMapVar, false);
                }
                
                //check whether to use specular map or not
                if(typeof shader !== "undefined"&& curMaterial.specular !== null && specular !== null && typeof specular !== "undefined"){
                    shader.setUniform(useSMapVar, true);
                }else if(typeof shader !== "undefined"&& curMaterial.specular === null && useSMapVar !== null && typeof useSMapVar !== "undefined"){
                    shader.setUniform(useSMapVar, false);
                }
                
                //check whether to use occlusion map or not
                if(typeof shader !== "undefined"&& curMaterial.occlusion !== null && occlusion !== null && typeof occlusion !== "undefined"){
                    shader.setUniform(useOMapVar, true);
                }else if(typeof shader !== "undefined"&& curMaterial.occlusion === null && useOMapVar !== null && typeof useOMapVar !== "undefined"){
                    shader.setUniform(useOMapVar, false);
                }
                
                if(typeof shader !== "undefined"&& specPower !== null && typeof specPower !== "undefined"){
                    //in case the value given is 0 it will default to 1 since there seems to be an issue with raising values to 0 in glsl
                    var specP = curMaterial.getSpecPower();
                    shader.setUniform(specPower, (specP === 0 ? 1 : specP));
                }
                
                if(typeof shader !== "undefined"&& specInt !== null && typeof specInt !== "undefined"){
                    shader.setUniform(specInt, curMaterial.getSpecIntensity());
                }
                //bind buffers and render
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbos[curMat]);
                gl.vertexAttribPointer(this.vAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 0);
                gl.vertexAttribPointer(this.nAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 12);
                gl.vertexAttribPointer(this.nAttrib+1, 2, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 24);
                gl.vertexAttribPointer(this.nAttrib+2, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 32);
                gl.vertexAttribPointer(this.nAttrib+3, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES+this.AUXVERTBYTES, 44);
                
                gl.enableVertexAttribArray(this.vAttrib);
                gl.enableVertexAttribArray(this.nAttrib);
                gl.enableVertexAttribArray(this.nAttrib+1);
                
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibos[curMat]);
                gl.drawElements(gl.TRIANGLES, this.faces[curMat].length, gl.UNSIGNED_SHORT, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                
                gl.disableVertexAttribArray(this.vAttrib);
                gl.disableVertexAttribArray(this.nAttrib);
                gl.disableVertexAttribArray(this.nAttrib+1);
                
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                
                curMaterial.unbindDiffuse();
                curMaterial.unbindNormal();
                curMaterial.unbindSpecular();
                curMaterial.unbindOcclusion();
            }
        }
	};
	
	SMDModel.prototype.getName = function(){
		return this.name;
	};

	// SMDModel.prototype.getNumIndices = function(){
		// return this.faces.length*(this.isAdjBuffered ? Triangle.INDEX_ADJ : Triangle.INDEX_NOADJ);
	// };
	
	SMDModel.prototype.erase = function(){
        for(var buffers = 0; buffers < this.vbos.length; buffers++){
            if(vaoEXT){
                vaoEXT.bindVertexArrayOES(null);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.deleteBuffer(this.vbos[buffers]);
            gl.deleteBuffer(this.ibos[buffers]);
            if(vaoEXT){
                vaoEXT.deleteVertexArrayOES(this.vaos[buffers]);
            }
        }
		// this.erase();
		// for(var curMat = 0; curMat < this.mats.length; curMat++){
			// this.mats[curMat].unbind();
			// this.mats[curMat].erase();
		// }
	};
	
	SMDModel.prototype.translate = function(){
        if(arguments.length == 1){
          if(arguments[0] instanceof Vec3){
              this.modelMat.leftMult(MatrixUtil.translate(arguments[0]));
          }   
        }else if(arguments.length == 3){
            if(typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number"){
                this.modelMat.leftMult(MatrixUtil.translate(arguments[0], arguments[1], arguments[2]));
            }
        }
    };
    
    SMDModel.prototype.scale = function(){
        if(arguments.length == 1){
          if(arguments[0] instanceof Vec3){
              this.modelMat.leftMult(MatrixUtil.scale(arguments[0]));
          }   
        }else if(arguments.length == 3){
            if(typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number"){
                this.modelMat.leftMult(MatrixUtil.scale(arguments[0], arguments[1], arguments[2]));
            }
        }
    };
    
    SMDModel.prototype.rotate = function(){
        if(arguments.length == 2){
          if(arguments[0] instanceof Vec3 &&
                typeof arguments[1] === "number"){
              this.modelMat.leftMult(QuaternionUtil.fromAxisAngle(arguments[0], arguments[1]).asMatrix());
          }   
        }else if(arguments.length == 4){
            if(typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number" &&
                typeof arguments[3] === "number"){
                this.modelMat.leftMult(QuaternionUtil.fromAxisAngle(arguments[0], arguments[1], arguments[2], arguments[3]).asMatrix());
            }
        }
    };
    
    SMDModel.prototype.orient = function(){
        if(arguments.length == 1){
            if(arguments[0] instanceof Vec3){
            this.orientation.set(QuaternionUtil.multiply(new Quaternion(arguments[0]), this.orientation));
        }
        }else if(arguments.length == 2){
            if(arguments[0] instanceof Vec3 &&
               typeof arguments[1] === "number"){
                this.orientation.set(QuaternionUtil.multiply(QuaternionUtil.fromAxisAngle(arguments[0], arguments[1]), this.orientation));
            }
        }else if(arguments.length == 3){
            if(typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number" &&
                typeof theta === "undefined"){
                this.orientation.set(QuaternionUtil.multiply(new Quaternion(arguments[0], arguments[1], arguments[2]), this.orientation));
            }
        }else if(arguments.length == 4){
            if(typeof arguments[0] === "number" &&
                typeof arguments[1] === "number" &&
                typeof arguments[2] === "number" &&
                typeof arguments[3] === "number"){
                this.orientation.set(QuaternionUtil.multiply(QuaternionUtil.fromAxisAngle(arguments[0], arguments[1], arguments[2], arguments[3]), this.orientation));
            }
        }
    };
    
    SMDModel.prototype.getOrientation = function(){
        return this.orientation;
    };
    
    SMDModel.prototype.hasAdjData = function(){
        return this.isAdjBuffered;
    };
    
    SMDModel.prototype.resetModel = function(){
        this.modelMat.loadIdentity();
    };
    
    SMDModel.prototype.resetOrientation = function(){
        this.orientation.set(0, 0, 0);
    };
    
    SMDModel.prototype.setUpTriangle = function(face, edgesMap){
        //create the half edge map to the edges of the face
        for(var curEdge = 0; curEdge < face.edges.length; curEdge++){
            var edge = face.edges[curEdge];
            var halfEdge = new HalfEdge(edge.start);
            edgesMap.put(edge, halfEdge);
            halfEdge.parent = face;
            face.halfEdges.push(halfEdge);
        }
        /*create the linked half edges of the face
        and link the opposite half edges if the
        half edge exists in the map*/
        var numEdges = face.edges.length;
        for(var edgeGet = 0; edgeGet < numEdges; edgeGet++){
            var edge = face.edges[edgeGet];
            //set the half edge that is next in the triangle after the current half edge
            face.halfEdges[edgeGet].next = face.halfEdges[(edgeGet+1)%numEdges];
            //generate the key to get the opposite half edge
            var oppositeEdge = new Edge(edge.end,  edge.start);
            //if the map contains the opposite key set the two half edges opposite pointers
            if(edgesMap.containsKey(oppositeEdge)){
                var h1 = edgesMap.get(edge);
                var h2 = edgesMap.get(oppositeEdge);
                h1.opposite = h2;
                h2.opposite = h1;
            }
        }
    };
    
    SMDModel.prototype.getCollisionMesh = function(){
        return this.collider;
    };
    
    SMDModel.prototype.setOrientation = function(orient){
        this.orientation.set(orient);
    };
    
    SMDModel.prototype.getModelMatrix = function(){
        return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix());
    };
    
    SMDModel.prototype.getNormalMatrix = function(){
        return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix()).getNormalMatrix();
    };
    
    SMDModel.prototype.getMatrixBuffer = function(){
        return this.getModelMatrix().asBuffer();
    };
    
    SMDModel.prototype.getNMatrixBuffer = function(){
        return this.getNormalMatrix().asBuffer();
    };
    
    SMDModel.prototype.getVertexBuffer = function(){
        return this.vbo;
    };
    
    SMDModel.prototype.getIndexBuffer = function(){
        return this.ibo;
    };
    
    SMDModel.prototype.getVattrib = function(){
        return this.vAttrib;
    };
    
    SMDModel.prototype.getNattrib = function(){
        return this.nAttrib;
    };
    
    SMDModel.prototype.AUXVERTFLOATS = 6;
    SMDModel.prototype.AUXVERTBYTES = 24;
