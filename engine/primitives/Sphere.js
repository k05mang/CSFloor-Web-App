
function Sphere(){
    this.modelMat = new Mat4(1);
    this.orientation = new Quaternion();
    if(arguments.length > 1){
        this.vAttrib = arguments[arguments.length-1];
        this.nAttrib = this.vAttrib+1;
        
        this.vbo = gl.createBuffer();
        this.ibo = gl.createBuffer();
        
        this.radius = arguments[0] <= 0 ? .01 : arguments[0];
        //whether the stacks and slices are a single variable or two
        if(arguments.length === 4){
            this.slices = arguments[1] < 3 ? 3 : arguments[1];
            this.stacks = arguments[2] < 1 ? 1 : arguments[2];
        }else if(arguments.length === 3){
            this.slices = arguments[1] < 3 ? 3 : arguments[1];
            this.stacks = arguments[1] < 1 ? 1 : arguments[1];
        }
        this.faces = [];
        this.vertices = [];
        /*
        compute the number of indices needed for a sphere
        number of triangles for the "caps" of the sphere are equal to the number of slices, 2 caps = 2*slices
        when there is 1 stack there are only the caps, 2 stacks means 1 row of slices number of quads which are each
        2 triangles, so (stacks-1)*(2*slices) number of internal faces for the sphere
        */
        this.numIndices = ((2*this.slices)*(this.stacks-1)+2*this.slices)*Triangle.INDEX_NOADJ;
        
        //hash map for the edges to the half edges look up
        var edgeMap = new Hashtable();
        var numVerts = this.slices*this.stacks+1;
        var indices = [];
        var verts = [];
        //generate the vertices
        var first = new Vertex(0,0,this.radius, 0,0,1, 0,0);
        this.vertices.push(first);
        first.store(verts);
        for(var stack = 1; stack < this.stacks+1; stack++){
            for(var slice = 0; slice < this.slices; slice++){
                var phi = Math.PI*(stack/this.stacks+1);
                var theta = 2*Math.PI*(slice/this.slices);
                
                var x = this.radius*Math.cos(theta)*Math.sin(phi);
                var y = this.radius*Math.sin(theta)*Math.sin(phi);
                var z = -this.radius*Math.cos(phi);
                var vert = new Vertex(x,y,z, x,y,z, 0,0);
                this.vertices.push(vert);
                vert.store(verts);
                var cycle = (slice+1)%this.slices;
                //if we are on the first stack we are generating triangles for the cap
                if (stack == 1) {
                    //create the face
                    var face = new Triangle(
                            0,
                            slice+1,
                            cycle+1);
                    
                    this.setUpTriangle(face, edgeMap);
                    this.faces.push(face);
                    // console.log(face.primitive);
                }
                //if we are on the last stack we are generating triangles for the bottom cap
                if(stack == this.stacks){
                    //numVerts-this.slices-1 indicates the index of the starting vertex for the bottom stack
                    var face = new Triangle(
                            numVerts,
                            numVerts-this.slices+cycle,
                            numVerts-this.slices+slice);
                    
                    this.setUpTriangle(face, edgeMap);
                    this.faces.push(face);
                }
                //if we are in the mid section of the sphere then there are 2 triangles to generate per slice
                if(stack != 1){
                    var prevStack = (stack-2)*this.slices;
                    var curStack = (stack-1)*this.slices;
                    
                    var face1 = new Triangle(
                            prevStack+slice+1 ,   //top left vertex in the left triangle of the square
                            curStack+slice+1,     //bottom left vertex in the left triangle of the square
                            curStack+cycle+1      //bottom right vertex in the left triangle of the square
                            );
                    this.setUpTriangle(face1, edgeMap);
                    
                    var face2 = new Triangle(
                            prevStack+slice+1,        //top left vertex in the right triangle of the square
                            curStack+cycle+1,        //bottom right vertex in the right triangle of the square
                            prevStack+cycle+1        //top right vertex in the right triangle of the square
                            );
                    this.setUpTriangle(face2, edgeMap);
                    this.faces.push(face1);
                    this.faces.push(face2);
                }
            }
        }
        var last = new Vertex(0,0,-this.radius, 0,0,-1, 0,0);
        this.vertices.push(last);
        last.store(verts);
        // console.log(this.vertices[0]);
        // console.log(this.vertices[this.vertices.length-1]);
        
        for(var curFace = 0; curFace < this.faces.length; curFace++){
            var face = this.faces[curFace];
            face.initAdjacent();
            
            face.storePrimitiveIndices(indices);
            
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
    }else if(arguments.length === 1){
        this.faces = arguments[0].faces;
        this.vertices = arguments[0].vertices;
        this.numIndices = arguments[0].numIndices;
        this.slices = arguments[0].slices;
        this.stacks = arguments[0].stacks;
        this.radius = arguments[0].radius;
        
        this.modelMat = new Mat4(1);
        this.vAttrib = arguments[0].vAttrib;
        this.nAttrib = arguments[0].nAttrib;
        this.orientation = new Quaternion();
        
        this.vbo = arguments[0].vbo;
        this.ibo = arguments[0].ibo;
        
        if(vaoEXT){
            this.vao = arguments[0].vao;
        }
    }
        
}Sphere.prototype.copy = function(){
    return new Sphere(this);
};

Sphere.prototype.getRadius = function(){
    return this.radius;
};

Sphere.prototype.getNumIndices = function(){
    return this.numIndices;
};

Sphere.prototype.getFaces = function() {
    return this.faces;
};

Sphere.prototype.getVertices = function() {
    return this.vertices;
};

Sphere.prototype.render = function() {
    if(vaoEXT){
        vaoEXT.bindVertexArrayOES(this.vao);
        gl.enableVertexAttribArray(this.vAttrib);
        gl.enableVertexAttribArray(this.nAttrib);
        gl.enableVertexAttribArray(this.nAttrib+1);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
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
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        gl.disableVertexAttribArray(this.vAttrib);
        gl.disableVertexAttribArray(this.nAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
};

Sphere.prototype.erase = function(){
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
    
Sphere.prototype.translate = function(){
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

Sphere.prototype.scale = function(){
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

Sphere.prototype.rotate = function(){
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

Sphere.prototype.orient = function(){
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

Sphere.prototype.getOrientation = function(){
    return this.orientation;
};

Sphere.prototype.hasAdjData = function(){
    return this.isAdjBuffered;
};

Sphere.prototype.resetModel = function(){
    this.modelMat.loadIdentity();
};

Sphere.prototype.resetOrientation = function(){
    this.orientation.set(0, 0, 0);
};

Sphere.prototype.setUpTriangle = function(face, edgeMap){
    //create the half edge map to the edges of the face
    for(var curEdge = 0; curEdge < face.edges.length; curEdge++){
        var edge = face.edges[curEdge];
        var halfEdge = new HalfEdge(edge.start);
        edgeMap.put(edge, halfEdge);
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
        if(edgeMap.containsKey(oppositeEdge)){
            var h1 = edgeMap.get(edge);
            var h2 = edgeMap.get(oppositeEdge);
            h1.opposite = h2;
            h2.opposite = h1;
        }
    }
};

Sphere.prototype.setOrientation = function(orient){
    this.orientation.set(orient);
};

Sphere.prototype.getModelMatrix = function(){
    return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix());
};

Sphere.prototype.getNormalMatrix = function(){
    return MatrixUtil.multiply(this.modelMat, this.orientation.asMatrix()).getNormalMatrix();
};

Sphere.prototype.getMatrixBuffer = function(){
    return this.getModelMatrix().asBuffer();
};

Sphere.prototype.getNMatrixBuffer = function(){
    return this.getNormalMatrix().asBuffer();
};

Sphere.prototype.getVertexBuffer = function(){
    return this.vbo;
};

Sphere.prototype.getIndexBuffer = function(){
    return this.ibo;
};

Sphere.prototype.getVattrib = function(){
    return this.vAttrib;
};

Sphere.prototype.getNattrib = function(){
    return this.nAttrib;
};
