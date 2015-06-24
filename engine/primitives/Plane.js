function Plane(){
    //copy constructor
    if(arguments.length === 1){
        this.width = arguments[0].width;
        this.length = arguments[0].length;
        
        this.face1 = arguments[0].face1;
        this.face2 = arguments[0].face2;
        
        this.vertices = arguments[0].vertices;
        this.isAdjBuffered = arguments[0].isAdjBuffered;
        
        this.modelMat = new Mat4(1);
        this.vAttrib = arguments[0].vAttrib;
        this.nAttrib = arguments[0].nAttrib;
        this.orientation = new Quaternion();
        this.numIndices = arguments[0].numIndices;
        
        this.vbo = arguments[0].vbo;
        this.ibo = arguments[0].ibo;
        
        if(vaoEXT){
            this.vao = arguments[0].vao;
        }
        //TO DO copy the collider
        
    }else if(arguments.length === 4){
        // Plane(width, length, vAttrib, isAdjBuffer)
        this.width = arguments[0];
        this.length = arguments[1];
        var halfWidth = this.width/2.0;
        var halfHeight = this.length/2.0;
        this.vertices = [];
        this.isAdjBuffered = arguments[3];
        this.numIndices = (this.isAdjBuffered ? Triangle.INDEX_ADJ : Triangle.INDEX_NOADJ) << 1;
        
        this.modelMat = new Mat4(1);
        this.vAttrib = arguments[2];
        this.nAttrib = arguments[2]+1;
        this.orientation = new Quaternion();
        
        this.vbo = gl.createBuffer();
        this.ibo = gl.createBuffer();
        
        var verts = [];
        var indices = [];
        var edgesMap = new Hashtable();
        
        var topLeft = new Vertex(-halfWidth,0,-halfHeight, 0,1,0, 0,1);
        var bottomLeft = new Vertex(-halfWidth,0,halfHeight, 0,1,0, 0,0);
        var topRight = new Vertex(halfWidth,0,-halfHeight, 0,1,0, 1,1);
        var bottomRight = new Vertex(halfWidth,0,halfHeight, 0,1,0, 1,0);
        
        topLeft.store(verts);
        bottomLeft.store(verts);
        topRight.store(verts);
        bottomRight.store(verts);
        
        this.vertices.push(topLeft);
        this.vertices.push(bottomLeft);
        this.vertices.push(topRight);
        this.vertices.push(bottomRight);
        
        this.face1 = new Triangle(0, 1, 2);
        this.face2 = new Triangle(2, 1, 3);
        
        this.setUpTriangle(this.face1, edgesMap);
        this.setUpTriangle(this.face2, edgesMap);
        
        if(arguments[3]){
            this.face1.storeAllIndices(indices);
            this.face2.storeAllIndices(indices);
        }else{
            this.face1.storePrimitiveIndices(indices);
            this.face2.storePrimitiveIndices(indices);
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

        //this.collider = new CollisionPlane(arguments[0], arguments[1]);
    }
};
    
Plane.prototype.copy = function(){
        return new Plane(this);
};
    
Plane.prototype.getCenter = function(){
        return this.getModelMatrix().multVec(VecUtil.zero).swizzle("xyz");
};
    
Plane.prototype.getNumIndices = function() {
        return this.numIndices;
};

Plane.prototype.getVertices = function() {
        return this.vertices;
};
    
Plane.prototype.getFaces = function(){
        return [face1,face2];
};

Plane.prototype.render = function() {
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

Plane.prototype.computeTensor = function(mass) {
        var tensor = new Mat3((mass*(width*width+length*length))/12);
        if(mass > 0){
            tensor.invert();
        }
        return tensor;
};

Plane.prototype.erase = function(){
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.ibo);
    };
    
Plane.prototype.translate = function(){
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

Plane.prototype.scale = function(){
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

Plane.prototype.rotate = function(){
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

Plane.prototype.orient = function(){
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

Plane.prototype.getOrientation = function(){
    return this.orientation;
};

Plane.prototype.hasAdjData = function(){
    return this.isAdjBuffered;
};

Plane.prototype.resetModel = function(){
    this.modelMat.loadIdentity();
};

Plane.prototype.resetOrientation = function(){
    this.orientation.set(0, 0, 0);
};

Plane.prototype.setUpTriangle = function(face, edgesMap){
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

// Plane.prototype.getCollisionMesh = function(){
    // return this.collider;
// };

Plane.prototype.setOrientation = function(orient){
    this.orientation.set(orient);
};

Plane.prototype.getModelMatrix = function(){
    return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix());
};

Plane.prototype.getNormalMatrix = function(){
    return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix()).getNormalMatrix();
};

Plane.prototype.getMatrixBuffer = function(){
    return this.getModelMatrix().asBuffer();
};

Plane.prototype.getNMatrixBuffer = function(){
    return this.getNormalMatrix().asBuffer();
};

Plane.prototype.getVertexBuffer = function(){
    return this.vbo;
};

Plane.prototype.getIndexBuffer = function(){
    return this.ibo;
};

Plane.prototype.getVattrib = function(){
    return this.vAttrib;
};

Plane.prototype.getNattrib = function(){
    return this.nAttrib;
};
