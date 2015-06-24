function Torus(radius, tubeRadius, rings, ringSegs, vAttrib, bufferAdj){
    
    this.modelMat = new Mat4(1);
    this.vAttrib = vAttrib;
    this.nAttrib = vAttrib+1;
    this.isAdjBuffered = bufferAdj;
    this.orientation = new Quaternion();
    
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();
    
    this.radius = radius;
    this.tubeRadius = tubeRadius;
    this.rings = rings < 3 ? 3 : rings;
    this.ringSegs = ringSegs < 3 ? 3 : ringSegs;
    this.faces = [];
    this.vertices = [];
    // this.faces = new Array(2*this.rings*this.ringSegs);//creates array then starts populating at index of length
    // this.vertices = new Array(this.rings*this.ringSegs);
    this.numIndices = 2*(bufferAdj ? Triangle.INDEX_ADJ : Triangle.INDEX_NOADJ)*this.rings*this.ringSegs;
    
    var edgeMap = new Hashtable();
    
    var indices = [];
    var verts = [];
    
    for(var curRing = 0; curRing < this.rings; curRing++){
        for(var ring = 0; ring < this.ringSegs; ring++){
            var phi = 2*Math.PI*(ring/this.ringSegs);
            var theta = 2*Math.PI*(curRing/this.rings);
            
            var x = (radius + tubeRadius*Math.cos(phi))*Math.cos(theta);
            var y = tubeRadius*Math.sin(phi);
            var z = (radius + tubeRadius*Math.cos(phi))*Math.sin(theta);
            
            var normX = x-radius*Math.cos(theta);
            var normZ = z-radius*Math.sin(theta);
            
            var vert = new Vertex(x, y, z,  normX, y, normZ,  0, 0);
            vert.store(verts);
            this.vertices.push(vert);
            
            var face1 = new Triangle(
                    ring+this.rings*curRing,
                    (ring+1)%this.ringSegs+this.rings*( (curRing+1)%this.rings ),
                    ring+this.rings*( (curRing+1)%this.rings )
                    );
            
            var face2 = new Triangle(
                    ring+this.rings*curRing,
                    (ring+1)%this.ringSegs+this.rings*curRing,
                    (ring+1)%this.ringSegs+this.rings*( (curRing+1)%this.rings )
                    );
                    
            this.setUpTriangle(face1, edgeMap);
            this.setUpTriangle(face2, edgeMap);
            
            this.faces.push(face1);
            this.faces.push(face2);
        }
    }
    
    for(var curFace = 0; curFace < this.faces.length; curFace++){
        var face = this.faces[curFace];
        face.initAdjacent();
        
        if(bufferAdj){
            face.storeAllIndices(indices);
        }else{
            face.storePrimitiveIndices(indices);
        }
        
    }
    
    if(vaoEXT){
        this.vao = vaoEXT.createVertexArrayOES();
        vaoEXT.bindVertexArrayOES(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        
        gl.vertexAttribPointer(this.vAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES, 0);
        gl.vertexAttribPointer(this.nAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES, 12);
        gl.vertexAttribPointer(this.nAttrib+1, 2, gl.FLOAT, false, Vertex.SIZE_IN_BYTES, 24);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices) , gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        vaoEXT.bindVertexArrayOES(null);
    }else{
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices) , gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
};

// public Torus(Torus copy){
    // super(copy);
    // this.faces = copy.faces;
    // this.vertices = copy.vertices;
    // rings = copy.rings;
    // ringSegs = copy.ringSegs; 
    // this.numIndices = copy.this.numIndices;
// }
// 
// @Override
// public Torus copy(){
    // return new Torus(this);
// }

Torus.prototype.getNumIndices = function(){
    return this.numIndices;
};

Torus.prototype.getFaces = function() {
    return faces;
};

Torus.prototype.getVertices = function() {
    return vertices;
};

Torus.prototype.getRings = function() {
    return rings;
};

Torus.prototype.getRingSegs = function() {
    return ringSegs;
};

Torus.prototype.render = function(){
    if(vaoEXT){
        vaoEXT.bindVertexArrayOES(this.vao);
        gl.enableVertexAttribArray(this.vAttrib);
        gl.enableVertexAttribArray(this.nAttrib);
        gl.enableVertexAttribArray(this.nAttrib+1);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.drawElements((this.isAdjBuffered ? gl.TRIANGLES_ADJACENCY : gl.TRIANGLES), 
                this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        gl.disableVertexAttribArray(this.vAttrib);
        gl.disableVertexAttribArray(this.nAttrib);
        gl.disableVertexAttribArray(this.nAttrib+1);
        vaoEXT.bindVertexArrayOES(null);
    }else{
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(this.vAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES, 0);
        gl.vertexAttribPointer(this.nAttrib, 3, gl.FLOAT, false, Vertex.SIZE_IN_BYTES, 12);
        gl.vertexAttribPointer(this.nAttrib+1, 2, gl.FLOAT, false, Vertex.SIZE_IN_BYTES, 24);
        
        gl.enableVertexAttribArray(this.vAttrib);
        gl.enableVertexAttribArray(this.nAttrib);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.drawElements((this.isAdjBuffered ? gl.TRIANGLES_ADJACENCY : gl.TRIANGLES), 
                this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        gl.disableVertexAttribArray(this.vAttrib);
        gl.disableVertexAttribArray(this.nAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
};

// Torus.prototype.computeTensor(var mass) {
    // var radiusSq = radius*radius;
    // var tubeRadiusSq = tubeRadius*tubeRadius;
    // var iXY = .125f*(4*tubeRadiusSq+5*radiusSq);
    // Mat3 tensor = new Mat3(
            // new Vec3(iXY, 0, 0),
            // new Vec3(0, (tubeRadiusSq+.75f*radiusSq)*mass, 0),
            // new Vec3(0, 0, iXY)
            // );
    // if(mass > 0){
        // tensor.invert();
    // }
    // return tensor;
// }

    Torus.prototype.erase = function(){
        if(vaoEXT){
            vaoEXT.bindVertexArrayOES(null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.deleteBuffer(this.vbo);
            gl.deleteBuffer(this.ibo);
            vaoEXT.deleteVertexArrayOES(this.vao);
        }else{
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.deleteBuffer(this.vbo);
            gl.deleteBuffer(this.ibo);
        }
    };
    
    Torus.prototype.translate = function(){
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
    
    Torus.prototype.scale = function(){
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
    
    Torus.prototype.rotate = function(){
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
    
    Torus.prototype.orient = function(){
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
    
    Torus.prototype.getOrientation = function(){
        return this.orientation;
    };
    
    Torus.prototype.hasAdjData = function(){
        return this.isAdjBuffered;
    };
    
    Torus.prototype.resetModel = function(){
        this.modelMat.loadIdentity();
    };
    
    Torus.prototype.resetOrientation = function(){
        this.orientation.set(0, 0, 0);
    };
    
    Torus.prototype.setUpTriangle = function(face, edgesMap){
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
    
    // Torus.prototype.getCollisionMesh = function(){
        // return this.collider;
    // };
    
    Torus.prototype.setOrientation = function(orient){
        this.orientation.set(orient);
    };
    
    Torus.prototype.getModelMatrix = function(){
        return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix());
    };
    
    Torus.prototype.getNormalMatrix = function(){
        return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix()).getNormalMatrix();
    };
    
    Torus.prototype.getMatrixBuffer = function(){
        return this.getModelMatrix().asBuffer();
    };
    
    Torus.prototype.getNMatrixBuffer = function(){
        return this.getNormalMatrix().asBuffer();
    };
    
    Torus.prototype.getVertexBuffer = function(){
        return this.vbo;
    };
    
    Torus.prototype.getIndexBuffer = function(){
        return this.ibo;
    };
    
    Torus.prototype.getVattrib = function(){
        return this.vAttrib;
    };
    
    Torus.prototype.getNattrib = function(){
        return this.nAttrib;
    };

