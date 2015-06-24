
function Cone(){
    
    if(arguments.length === 1){
        this.faces = arguments[0].faces;
        this.vertices = arguments[0].vertices;
        this.numIndices = arguments[0].numIndices;
        this.subdiv = arguments[0].subdiv; 
        this.length = arguments[0].length; 
        this.radius = arguments[0].radius;
        
        this.modelMat = new Mat4(1);
        this.vAttrib = arguments[0].vAttrib;
        this.nAttrib = arguments[0].nAttrib;
        this.isAdjBuffered = arguments[0].isAdjBuffered;
        this.orientation = new Quaternion();
        
        this.vbo = arguments[0].vbo;
        this.ibo = arguments[0].ibo;
        
        if(vaoEXT){
            this.vao = arguments[0].vao;
        }
    }else if(arguments.length === 5){
        // public Cone(float radius, float length, int subdivisions, int vAttrib, boolean bufferAdj)
        this.faces = [];
        this.vertices = [];
            
        this.subdiv = (arguments[2] > 2 ? arguments[2] : 3);
        this.radius = arguments[0] <= 0 ? .01 : arguments[0];
        this.length = arguments[1] == 0 ? .0001 : arguments[1];
        
        this.subdiv = arguments[2]; 
        this.length = arguments[1]; 
        this.radius = arguments[0];
        
        this.modelMat = new Mat4(1);
        this.vAttrib = arguments[3];
        this.nAttrib = arguments[3]+1;
        this.isAdjBuffered = arguments[4];
        this.orientation = new Quaternion();
        
        this.numIndices = (this.subdiv+(this.subdiv-2))*(this.isAdjBuffered ? Triangle.INDEX_ADJ : Triangle.INDEX_NOADJ);
        
        this.vbo = gl.createBuffer();
        this.ibo = gl.createBuffer();
        
        var edgeMap = new Hashtable();
    
        var indices = [];
        var verts = [];
        
        var tip = new Vertex(0,this.length/2.0,0, 0,this.length/2.0,0, 0,0);
        this.vertices.push(tip);
        tip.store(verts);
        for(var segment = 1; segment < this.subdiv+1; segment++){
            var theta = 2*Math.PI*(segment/this.subdiv);
            
            var x = this.radius*(Math.cos(theta));
            var z = this.radius*(Math.sin(theta));
            
            var vert1 = new Vertex(x, -this.length/2.0, z,  x, -this.length/2.0, z, 0,0);
            this.vertices.push(vert1);
            vert1.store(verts);
            
            var side = new Triangle(
                    0, 
                     (segment+1)%(this.subdiv+1) == 0 ? 1 : (segment+1)%(this.subdiv+1),
                    segment
                    );
            this.setUpTriangle(side, edgeMap);
            this.faces.push(side);
            
            if(segment < this.subdiv-1){
                var bottom = new Triangle(
                        1,                     //the first bottom vertex
                        segment+1,    //the vertex that is segment+1 of the bottom ring
                        segment+2  //the vertex that is segment+2 of the bottom ring
                        );
                this.setUpTriangle(bottom, edgeMap);
                this.faces.push(bottom);
            }
        }

        for(var curFace = 0; curFace < this.faces.length; curFace++){
            var face = this.faces[curFace];
            face.initAdjacent();
            
            if(this.isAdjBuffered){
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
        
        // this.collider = new ConvexHull(vertices, faces.get(0));
    }
};
    
Cone.prototype.copy = function(){
    return new Cone(this);
};

Cone.prototype.getRadius = function(){
    return this.radius;
};

Cone.prototype.getLength = function(){
    return this.length;
};

Cone.prototype.getNumIndices = function(){
    return this.numIndices;
};

Cone.prototype.getFaces = function() {
    return this.faces;
};

Cone.prototype.getVertices = function() {
    return this.vertices;
};

Cone.prototype.getSubdivisions = function() {
    return this.subdiv;
};

Cone.prototype.render = function() {
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

// public Mat3 computeTensor(float mass) {
    // Mat3 tensor = new Mat3(
            // new Vec3((3*mass/5)*((radius*radius)/4+length*length), 0, 0),
            // new Vec3(0, 3*mass/10*(radius*radius), 0),
            // new Vec3(0, 0, (3*mass/5)*((radius*radius)/4+length*length))
            // );
    // if(mass > 0){
        // tensor.invert();
    // }
    // return tensor;
// }

Cone.prototype.erase = function(){
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
    
    Cone.prototype.translate = function(){
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
    
    Cone.prototype.scale = function(){
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
    
    Cone.prototype.rotate = function(){
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
    
    Cone.prototype.orient = function(){
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
    
    Cone.prototype.getOrientation = function(){
        return this.orientation;
    };
    
    Cone.prototype.hasAdjData = function(){
        return this.isAdjBuffered;
    };
    
    Cone.prototype.resetModel = function(){
        this.modelMat.loadIdentity();
    };
    
    Cone.prototype.resetOrientation = function(){
        this.orientation.set(0, 0, 0);
    };
    
    Cone.prototype.setUpTriangle = function(face, edgesMap){
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
    
    // Cone.prototype.getCollisionMesh = function(){
        // return this.collider;
    // };
    
    Cone.prototype.setOrientation = function(orient){
        this.orientation.set(orient);
    };
    
    Cone.prototype.getModelMatrix = function(){
        return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix());
    };
    
    Cone.prototype.getNormalMatrix = function(){
        return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix()).getNormalMatrix();
    };
    
    Cone.prototype.getMatrixBuffer = function(){
        return this.getModelMatrix().asBuffer();
    };
    
    Cone.prototype.getNMatrixBuffer = function(){
        return this.getNormalMatrix().asBuffer();
    };
    
    Cone.prototype.getVertexBuffer = function(){
        return this.vbo;
    };
    
    Cone.prototype.getIndexBuffer = function(){
        return this.ibo;
    };
    
    Cone.prototype.getVattrib = function(){
        return this.vAttrib;
    };
    
    Cone.prototype.getNattrib = function(){
        return this.nAttrib;
    };
