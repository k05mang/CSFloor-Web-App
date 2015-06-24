
function Vertex(){
//(x, y, z, normalX, normalY, normalZ, u, v, boneIDs, weights)
	
	this.pos = null;
	this.normal = null;
	this.textCoords = null;
	this.boneIDs = [];
	this.weights = [];
	
	// this.SIZE_IN_BYTES = 32;
	// this.SIZE_IN_FLOATS = 8;
	// this.SIZE_OF_BONEDATA = 64;
	
	this.constructor = function(x, y, z, normalX, normalY, normalZ, u, v, boneIDs, weights){
		this.pos = new Vec3(x, y, z);
		this.normal = new Vec3(normalX, normalY, normalZ);
		this.normal.normalize();
		this.textCoords = new Vec2(u, v);
		if(typeof boneIDs !== "undefined" && typeof weights !== "undefined"){
			this.boneIDs = [];
			this.weights = [];
			var curIndex = 0;
			for(; curIndex < (boneIDs.length < 8 ? boneIDs.length : 8); curIndex++){
				this.boneIDs[curIndex] = boneIDs[curIndex];
			}
			
			for(curIndex = 0; curIndex < (weights.length < 8 ? weights.length : 8); curIndex++){
				this.weights[curIndex] = weights[curIndex];
			}
		}
	};
	
	if(arguments.length === 3){
		//only 1 constructor exists for 3 arguments which is all being vector types
		this.constructor(
			arguments[0].x,
			arguments[0].y,
			arguments[0].z,
			
			arguments[1].x,
			arguments[1].y,
			arguments[1].z,
			
			arguments[2].x,
			arguments[2].y
		);
	}else if(arguments.length === 4){
		/*
		 * public Vertex(Vec3 pos,  Vec3 normal, float u, float v)
		 */
		//only 1 constructor exists for 4 arguments
		this.constructor(
			arguments[0].x,
			arguments[0].y,
			arguments[0].z,
			
			arguments[1].x,
			arguments[1].y,
			arguments[1].z,
			
			arguments[2],
			arguments[3]
		);
	}else if(arguments.length === 5){
		/*
		 * public Vertex(Vec3 pos, Vec3 normal, Vec2 textCoord, int[] boneIDs, float[] weights)
		 * public Vertex(Vec3 pos, float normalX, float normalY, float normalZ, Vec2 textCoord)
		 * public Vertex(float x, float y, float z, Vec3 normal, Vec2 textCoord)
		 * 
		 */
		if(
			arguments[0] instanceof Vec3 &&
			arguments[1] instanceof Vec3 &&
			arguments[2] instanceof Vec2 &&
			
			arguments[3].constructor.toString().indexOf("Array") > -1 &&
			arguments[4].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0].x,
				arguments[0].y,
				arguments[0].z,
				//normals
				arguments[1].x,
				arguments[1].y,
				arguments[1].z,
				//textcoords
				arguments[2].x,
				arguments[2].y,
				//bone data
				arguments[3],
				arguments[4]
			);
		}else if(
			arguments[0] instanceof Vec3 &&
			
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			typeof arguments[3] === "number" &&
			
			arguments[4] instanceof Vec2
		){
			this.constructor(
				//pos
				arguments[0].x,
				arguments[0].y,
				arguments[0].z,
				//normals
				arguments[1],
				arguments[2],
				arguments[3],
				//textcoords
				arguments[4].x,
				arguments[4].y
			);
		}else if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			arguments[3] instanceof Vec3 &&
			arguments[4] instanceof Vec2
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3].x,
				arguments[3].y,
				arguments[3].z,
				
				//textcoords
				arguments[4].x,
				arguments[4].y
			);
		}
	}else if(arguments.length === 6){
		/*
		 * public Vertex(Vec3 pos,  Vec3 normal, float u, float v, int[] boneIDs, float[] weights)
		 * public Vertex(Vec3 pos, float normalX, float normalY, float normalZ, float u, float v)
		 * public Vertex(float x, float y, float z, Vec3 normal, float u, float v)
		 * 
		 */
		if(
			arguments[0] instanceof Vec3 &&
			arguments[1] instanceof Vec3 &&
			
			typeof arguments[2] === "number" &&
			typeof arguments[3] === "number" &&
			
			arguments[4].constructor.toString().indexOf("Array") > -1 &&
			arguments[5].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0].x,
				arguments[0].y,
				arguments[0].z,
				
				//normals
				arguments[1].x,
				arguments[1].y,
				arguments[1].z,
				
				//textcoords
				arguments[2],
				arguments[3],
				
				//bone data
				arguments[4],
				arguments[5]
			);
		}else if(
			arguments[0] instanceof Vec3 &&
			
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			typeof arguments[3] === "number" &&
			
			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number"
		){
			this.constructor(
				//pos
				arguments[0].x,
				arguments[0].y,
				arguments[0].z,
				
				//normals
				arguments[1],
				arguments[2],
				arguments[3],
				
				//textcoords
				arguments[4],
				arguments[5]
			);
		}else if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			arguments[3] instanceof Vec3 &&

			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number"
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3].x,
				arguments[3].y,
				arguments[3].z,
				
				//textcoords
				arguments[4],
				arguments[5]
			);
		}
	}else if(arguments.length === 7){
		/*
		 * public Vertex(Vec3 pos, float normalX, float normalY, float normalZ, Vec2 textCoord, int[] boneIDs, float[] weights)
		 * 
		 * public Vertex(float x, float y, float z, Vec3 normal, Vec2 textCoord, int[] boneIDs, float[] weights)
		 * 
		 * public Vertex(float x, float y, float z, float normalX, float normalY, float normalZ, Vec2 textCoord)
		 */
		if(
			arguments[0] instanceof Vec3 &&
			
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			typeof arguments[3] === "number" &&
			
			arguments[4] instanceof Vec2 &&
			
			arguments[5].constructor.toString().indexOf("Array") > -1 &&
			arguments[6].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0].x,
				arguments[0].y,
				arguments[0].z,
				
				//normals
				arguments[1],
				arguments[2],
				arguments[3],
				
				//textcoords
				arguments[4].x,
				arguments[4].y,
				
				//bone data
				arguments[5],
				arguments[6]
			);
		}else if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			arguments[3] instanceof Vec3 &&
			arguments[4] instanceof Vec2 &&
			
			arguments[5].constructor.toString().indexOf("Array") > -1 &&
			arguments[6].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3].x,
				arguments[3].y,
				arguments[3].z,
				
				//textcoords
				arguments[4].x,
				arguments[4].y,
				
				//bone data
				arguments[5],
				arguments[6]
			);
		}else if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			typeof arguments[3] === "number" &&
			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number" &&

			arguments[6] instanceof Vec2
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3],
				arguments[4],
				arguments[5],
				
				//textcoords
				arguments[6].x,
				arguments[6].y
			);
		}
	}else if(arguments.length === 8){
		/*
		 * public Vertex(Vec3 pos, float normalX, float normalY, float normalZ, float u, float v, int[] boneIDs, float[] weights)
		 * 
		 * public Vertex(float x, float y, float z, Vec3 normal, float u, float v, int[] boneIDs, float[] weights)
		 * 
		 * public Vertex(float x, float y, float z, float normalX, float normalY, float normalZ, float u, float v)
		 */if(
		 	arguments[0] instanceof Vec3 &&
		 	
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			typeof arguments[3] === "number" &&
			
			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number" &&
			
			arguments[6].constructor.toString().indexOf("Array") > -1 &&
			arguments[7].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0].x,
				arguments[0].y,
				arguments[0].z,
				
				//normals
				arguments[1],
				arguments[2],
				arguments[3],
				
				//textcoords
				arguments[4],
				arguments[5],
				
				//bone data
				arguments[6],
				arguments[7]
			);
		}else if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			arguments[3] instanceof Vec3 &&
			
			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number" &&

			arguments[6].constructor.toString().indexOf("Array") > -1 &&
			arguments[7].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3].x,
				arguments[3].y,
				arguments[3].z,
				
				//textcoords
				arguments[4],
				arguments[5],
				
				//bone data
				arguments[6],
				arguments[7]
			);
		}else if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			typeof arguments[3] === "number" &&
			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number" &&
			
			typeof arguments[6] === "number" &&
			typeof arguments[7] === "number"
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3],
				arguments[4],
				arguments[5],
				
				//textcoords
				arguments[6],
				arguments[7]
			);
		}
	}else if(arguments.length === 9){
		/*
		 * public Vertex(float x, float y, float z, float normalX, float normalY, float normalZ, Vec2 textCoord, int[] boneIDs, float[] weights)
		 */
		 if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			typeof arguments[3] === "number" &&
			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number" &&
			
			arguments[6] instanceof Vec2 &&

			arguments[7].constructor.toString().indexOf("Array") > -1 &&
			arguments[8].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3],
				arguments[4],
				arguments[5],
				
				//textcoords
				arguments[6].x,
				arguments[6].y,
				
				//bone data
				arguments[7],
				arguments[8]
			);
		}
	}else if(arguments.length === 10){
		/*
		 * public Vertex(float x, float y, float z, float normalX, float normalY, float normalZ, float u, float v, int[] boneIDs, float[] weights)
		 */
		 if(
			typeof arguments[0] === "number" &&
			typeof arguments[1] === "number" &&
			typeof arguments[2] === "number" &&
			
			typeof arguments[3] === "number" &&
			typeof arguments[4] === "number" &&
			typeof arguments[5] === "number" &&
			
			typeof arguments[6] === "number" &&
			typeof arguments[7] === "number" &&

			arguments[8].constructor.toString().indexOf("Array") > -1 &&
			arguments[9].constructor.toString().indexOf("Array") > -1
		){
			this.constructor(
				//pos
				arguments[0],
				arguments[1],
				arguments[2],
				
				//normals
				arguments[3],
				arguments[4],
				arguments[5],
				
				//textcoords
				arguments[6],
				arguments[7],
				
				//bone data
				arguments[8],
				arguments[9]
			);
		}
	}
};

	Vertex.prototype.getPos = function(){
		return this.pos;
	};
	
	Vertex.prototype.getNormal = function(){
		return this.normal;
	};
	
	Vertex.prototype.getUVs = function(){
		return this.textCoords;
	};
	
	Vertex.prototype.setPos = function(){
		if(arguments.length === 1){
			if(arguments[0] instanceof Vec3){
				this.pos.set(arguments[0]);
			}
		}else if(arguments.length === 3){
			if(
				typeof arguments[0] == "number" &&
				typeof arguments[1] == "number" &&
				typeof arguments[2] == "number"
			){
				this.pos.set(
				arguments[0], arguments[1], arguments[2]
				);
			}
		}
	};
	
	Vertex.prototype.setNormal = function(){
		if(arguments.length === 1){
			if(arguments[0] instanceof Vec3){
				this.normal.set(arguments[0]);
			}
		}else if(arguments.length === 3){
			if(
				typeof arguments[0] == "number" &&
				typeof arguments[1] == "number" &&
				typeof arguments[2] == "number"
			){
				this.normal.set(
				arguments[0], arguments[1], arguments[2]
				);
			}
		}
	};
	
	Vertex.prototype.setUVs = function(){
		if(arguments.length === 1){
			if(arguments[0] instanceof Vec2){
				this.textCoords.set(arguments[0]);
			}
		}else if(arguments.length === 2){
			if(
				typeof arguments[0] == "number" &&
				typeof arguments[1] == "number"
			){
				this.textCoords.set(
				arguments[0], arguments[1]
				);
			}
		}
	};
	
	Vertex.prototype.asBuffer = function(){
		return Array.prototype.concat(
			this.pos.asBuffer(),
			this.normal.asBuffer(),
			this.textCoords.asBuffer()
			);
		
	};
	
    Vertex.prototype.store = function(buffer){
        buffer.push(
            this.pos.x,
            this.pos.y,
            this.pos.z,
            
            this.normal.x,
            this.normal.y,
            this.normal.z,
            
            this.textCoords.x,
            this.textCoords.y
        );
    };
	
	Vertex.prototype.equals = function(o){
		if(o instanceof Vertex){
			return this.pos.equals(o.pos) && 
					this.normal.equals(o.normal) && 
					this.textCoords.equals(o.textCoords);
		}else{
			return false;
		}
	};
	
	Vertex.prototype.hashCode = function(){
		return Math.floor((100*(
                this.pos.x+this.pos.y+this.pos.z+
                this.normal.x+this.normal.y+this.normal.z+
                this.textCoords.x+this.textCoords.y
                )))+"";
	};
	
	/**
	 * Gets the id's of the bones that influence this vertex object
	 * 
	 * @return array containing the bone id's
	 */
	Vertex.prototype.getIds = function(){
		return this.boneIDs;
	};
	
	/**
	 * Gets the weights of the bones that influence this vertex
	 * 
	 * @return Array containing the weights of influence for each of the 
	 * bones
	 */
	Vertex.prototype.getWeights = function(){
		return this.weights;
	};

Vertex.SIZE_IN_BYTES = 32;
Vertex.SIZE_IN_FLOATS = 8;
Vertex.SIZE_OF_BONEDATA = 64;