	
function Edge(start, end) {
	this.start = start;
	this.end = end;
	this.hash = (1 << 25)*(start+1)+end;
};
	
	Edge.prototype.hashCode = function(){
		return this.hash+"";
	};
	
	Edge.prototype.equals = function(obj){
		if(obj instanceof Edge)
			return obj.start === this.start && obj.end === this.end;
		else
			return false;
	};

function HalfEdge(emenatingVert) {
	if(emenatingVert instanceof HalfEdge){
		this.parent = emenatingVert.parent;
		this.opposite = emenatingVert.opposite;
		this.next = emenatingVert.next;
		this.sourceVert = emenatingVert.sourceVert;
	}else{
		this.parent = null;
		this.opposite = null;
		this.next = null;
		this.sourceVert = emenatingVert;
	}
};
	
	HalfEdge.prototype.equals = function(o){
		if(o instanceof HalfEdge){
			return this.sourceVert == o.sourceVert && this.parent.equals(o.parent);
		}else{
			return false;
		}
	};
	
	HalfEdge.prototype.set = function(setter){
		if(setter instanceof HalfEdge){
			this.parent = setter.parent;
			this.opposite = setter.opposite;
			this.next = setter.next;
			this.sourceVert = setter.sourceVert;
		}
	};


function Triangle(v0,v1,v2) {
	
	this.primitive = [v0,v1,v2];
	this.adjacent = [-1,-1,-1];
	this.edges = [new Edge(v0,v1),
				new Edge(v1,v2),
				new Edge(v2,v0)];
	this.halfEdges = [];
};
    Triangle.prototype.getAllIndices = function(){
        return [
            this.primitive[0],
            this.adjacent[0],
            
            this.primitive[1],
            this.adjacent[1],
            
            this.primitive[2],
            this.adjacent[2]
        ];
    };
    
    Triangle.prototype.storeAllIndices = function(buffer){
        buffer.push(
            this.primitive[0],
            this.adjacent[0],
            
            this.primitive[1],
            this.adjacent[1],
            
            this.primitive[2],
            this.adjacent[2]
            );
    };
    
    Triangle.prototype.storePrimitiveIndices = function(buffer){
        buffer.push(
            this.primitive[0],
            this.primitive[1],
            this.primitive[2]
            );
    };

	Triangle.prototype.initAdjacent = function(){
	    if(this.halfEdges[0].opposite !== null){
            if(this.halfEdges[0].opposite.next !== null){
                if(this.halfEdges[0].opposite.next.next !== null){
                    this.adjacent[0] = this.halfEdges[0].opposite.next.next.sourceVert;
                }
            }
        }
        
        if(this.halfEdges[1].opposite !== null){
            if(this.halfEdges[1].opposite.next !== null){
                if(this.halfEdges[1].opposite.next.next !== null){
                    this.adjacent[1] = this.halfEdges[1].opposite.next.next.sourceVert;
                }
            }
        }
        
        if(this.halfEdges[2].opposite !== null){
            if(this.halfEdges[2].opposite.next !== null){
                if(this.halfEdges[2].opposite.next.next !== null){
                    this.adjacent[2] = this.halfEdges[2].opposite.next.next.sourceVert;
                }
            }
        }
	    
	    
		// this.adjacent[0] = this.halfEdges[0].opposite.next.next.sourceVert;
		// this.adjacent[1] = this.halfEdges[1].opposite.next.next.sourceVert;
		// this.adjacent[2] = this.halfEdges[2].opposite.next.next.sourceVert;
	};
	
	Triangle.prototype.equals = function(o){
		if(o instanceof Triangle){
			return o.primitive[0] == this.primitive[0] && 
				   o.primitive[1] == this.primitive[1] && 
				   o.primitive[2] == this.primitive[2] &&
				   this.edges[0].equals(o.edges[0]) &&
				   this.edges[1].equals(o.edges[1]) && 
				   this.edges[2].equals(o.edges[2]);
		}else{
			return false;
		}
	};

Triangle.INDEX_ADJ = 6; 
Triangle.INDEX_NOADJ = 3;