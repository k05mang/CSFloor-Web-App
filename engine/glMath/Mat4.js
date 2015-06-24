function Mat4(col1, col2, col3, col4){

	// this.SIZE_IN_BYTES = 64;
	// this.SIZE_IN_FLOATS = 16;
	
	if( typeof col1 === "undefined" &&
		 typeof col2 === "undefined" &&
		 typeof col3 === "undefined" &&
		 typeof col4 === "undefined"){
			this.matrix = [
				new Vec4(1.0, 0.0, 0.0, 0.0),
				new Vec4(0.0, 1.0, 0.0, 0.0),
				new Vec4(0.0, 0.0, 1.0, 0.0),
				new Vec4(0.0, 0.0, 0.0, 1.0)
			];
			
	}else if( col1 instanceof Vec4 &&
			 col2 instanceof Vec4 &&
			 col3 instanceof Vec4 &&
			 col4 instanceof Vec4){
			this.matrix = [
				new Vec4(col1),
				new Vec4(col2),
				new Vec4(col3),
				new Vec4(col4)
			];
	}else if( typeof col1 === "number" &&
			 typeof col2 === "undefined" &&
			 typeof col3 === "undefined" &&
			 typeof col4 === "undefined"){
			this.matrix = [
				new Vec4(col1, 0.0, 0.0, 0.0),
				new Vec4(0.0, col1, 0.0, 0.0),
				new Vec4(0.0, 0.0, col1, 0.0),
				new Vec4(0.0, 0.0, 0.0, col1)
			];
	}else if( col1 instanceof Mat4 &&
			 typeof col2 === "undefined" &&
			 typeof col3 === "undefined" &&
			 typeof col4 === "undefined"){
			this.matrix = [
				new Vec4(col1.matrix[0]),
				new Vec4(col1.matrix[1]),
				new Vec4(col1.matrix[2]),
				new Vec4(col1.matrix[3])
			];
	}else if( col1 instanceof Mat3 &&
			 col2 instanceof Vec3 &&
			 typeof col3 === "undefined" &&
			 typeof col4 === "undefined"){
			this.matrix = [
				new Vec4(col1.matrix[0].swizzle("xyz"), 0),
				new Vec4(col1.matrix[1].swizzle("xyz"), 0),
				new Vec4(col1.matrix[2].swizzle("xyz"), 0),
				new Vec4(col2 , 1)
			];
	}
};
	
	Mat4.prototype.getNormalMatrix = function(){
		return new Mat3( 
                    this.matrix[0].swizzle("xyz"),
                    this.matrix[1].swizzle("xyz"),
                    this.matrix[2].swizzle("xyz") 
                    );
	};
	
	Mat4.prototype.invert = function(){
		var det = this.determinant();
		if( det != 0){
			var col1 = new Vec4(
					 this.matrix[1].y*(this.matrix[2].z*this.matrix[3].w-this.matrix[3].z*this.matrix[2].w)
					 -this.matrix[2].y*(this.matrix[1].z*this.matrix[3].w-this.matrix[3].z*this.matrix[1].w)
					 +this.matrix[3].y*(this.matrix[1].z*this.matrix[2].w-this.matrix[2].z*this.matrix[1].w),
		
					-(this.matrix[0].y*(this.matrix[2].z*this.matrix[3].w-this.matrix[3].z*this.matrix[2].w)
					 -this.matrix[2].y*(this.matrix[0].z*this.matrix[3].w-this.matrix[3].z*this.matrix[0].w)
					 +this.matrix[3].y*(this.matrix[0].z*this.matrix[2].w-this.matrix[2].z*this.matrix[0].w)),
					 
					  this.matrix[0].y*(this.matrix[1].z*this.matrix[3].w-this.matrix[3].z*this.matrix[1].w)
					 -this.matrix[1].y*(this.matrix[0].z*this.matrix[3].w-this.matrix[3].z*this.matrix[0].w)
					 +this.matrix[3].y*(this.matrix[0].z*this.matrix[1].w-this.matrix[1].z*this.matrix[0].w),
				
					-(this.matrix[0].y*(this.matrix[1].z*this.matrix[2].w-this.matrix[2].z*this.matrix[1].w)
					 -this.matrix[1].y*(this.matrix[0].z*this.matrix[2].w-this.matrix[2].z*this.matrix[0].w)
					 +this.matrix[2].y*(this.matrix[0].z*this.matrix[1].w-this.matrix[1].z*this.matrix[0].w))
					  );
			
			var col2 = new Vec4(
					 -(this.matrix[1].x*(this.matrix[2].z*this.matrix[3].w-this.matrix[3].z*this.matrix[2].w)
					 -this.matrix[2].x*(this.matrix[1].z*this.matrix[3].w-this.matrix[3].z*this.matrix[1].w)
					 +this.matrix[3].x*(this.matrix[1].z*this.matrix[2].w-this.matrix[2].z*this.matrix[1].w)),
					 
					  this.matrix[0].x*(this.matrix[2].z*this.matrix[3].w-this.matrix[3].z*this.matrix[2].w)
					 -this.matrix[2].x*(this.matrix[0].z*this.matrix[3].w-this.matrix[3].z*this.matrix[0].w)
					 +this.matrix[3].x*(this.matrix[0].z*this.matrix[2].w-this.matrix[2].z*this.matrix[0].w),
					 
					  this.matrix[0].x*(this.matrix[1].z*this.matrix[3].w-this.matrix[3].z*this.matrix[1].w)
					 -this.matrix[1].x*(this.matrix[0].z*this.matrix[3].w-this.matrix[3].z*this.matrix[0].w)
					 +this.matrix[3].x*(this.matrix[0].z*this.matrix[1].w-this.matrix[1].z*this.matrix[0].w),
					 
					-(this.matrix[0].x*(this.matrix[1].z*this.matrix[2].w-this.matrix[2].z*this.matrix[1].w)
					 -this.matrix[1].x*(this.matrix[0].z*this.matrix[2].w-this.matrix[2].z*this.matrix[0].w)
					 +this.matrix[2].x*(this.matrix[0].z*this.matrix[1].w-this.matrix[1].z*this.matrix[0].w))
					);
			
			var col3 = new Vec4(
					 this.matrix[1].x*(this.matrix[2].y*this.matrix[3].w-this.matrix[3].y*this.matrix[2].w)
					 -this.matrix[2].x*(this.matrix[1].y*this.matrix[3].w-this.matrix[3].y*this.matrix[1].w)
					 +this.matrix[3].x*(this.matrix[1].y*this.matrix[2].w-this.matrix[2].y*this.matrix[1].w),
		
					-(this.matrix[0].x*(this.matrix[2].y*this.matrix[3].w-this.matrix[3].y*this.matrix[2].w)
					 -this.matrix[2].x*(this.matrix[0].y*this.matrix[3].w-this.matrix[3].y*this.matrix[0].w)
					 +this.matrix[3].x*(this.matrix[0].y*this.matrix[2].w-this.matrix[2].y*this.matrix[0].w)),
					 
					  this.matrix[0].x*(this.matrix[1].y*this.matrix[3].w-this.matrix[3].y*this.matrix[1].w)
					 -this.matrix[1].x*(this.matrix[0].y*this.matrix[3].w-this.matrix[3].y*this.matrix[0].w)
					 +this.matrix[3].x*(this.matrix[0].y*this.matrix[1].w-this.matrix[1].y*this.matrix[0].w),
				
					-(this.matrix[0].x*(this.matrix[1].y*this.matrix[2].w-this.matrix[2].y*this.matrix[1].w)
					 -this.matrix[1].x*(this.matrix[0].y*this.matrix[2].w-this.matrix[2].y*this.matrix[0].w)
					 +this.matrix[2].x*(this.matrix[0].y*this.matrix[1].w-this.matrix[1].y*this.matrix[0].w))
					  );
			
			var col4 = new Vec4(
					 -(this.matrix[1].x*(this.matrix[2].y*this.matrix[3].z-this.matrix[3].y*this.matrix[2].z)
					  -this.matrix[2].x*(this.matrix[1].y*this.matrix[3].z-this.matrix[3].y*this.matrix[1].z)
					  +this.matrix[3].x*(this.matrix[1].y*this.matrix[2].z-this.matrix[2].y*this.matrix[1].z)),
					  
					   this.matrix[0].x*(this.matrix[2].y*this.matrix[3].z-this.matrix[3].y*this.matrix[2].z)
					  -this.matrix[2].x*(this.matrix[0].y*this.matrix[3].z-this.matrix[3].y*this.matrix[0].z)
					  +this.matrix[3].x*(this.matrix[0].y*this.matrix[2].z-this.matrix[2].y*this.matrix[0].z),
					  
					   this.matrix[0].x*(this.matrix[1].y*this.matrix[3].z-this.matrix[3].y*this.matrix[1].z)
					  -this.matrix[1].x*(this.matrix[0].y*this.matrix[3].z-this.matrix[3].y*this.matrix[0].z)
					  +this.matrix[3].x*(this.matrix[0].y*this.matrix[1].z-this.matrix[1].y*this.matrix[0].z),
					  
					 -(this.matrix[0].x*(this.matrix[1].y*this.matrix[2].z-this.matrix[2].y*this.matrix[1].z)
					  -this.matrix[1].x*(this.matrix[0].y*this.matrix[2].z-this.matrix[2].y*this.matrix[0].z)
					  +this.matrix[2].x*(this.matrix[0].y*this.matrix[1].z-this.matrix[1].y*this.matrix[0].z))
					);
			
			this.matrix[0].set(col1);
			this.matrix[1].set(col2);
			this.matrix[2].set(col3);
			this.matrix[3].set(col4);
			this.multFactor(1/det);
		}
		return this;
	};
	
    Mat4.prototype.inverse = function() {
        return new Mat4(this).invert();
    };
	
	Mat4.prototype.determinant = function(){
		return this.matrix[0].x*(this.matrix[1].y*(this.matrix[2].z*this.matrix[3].w-this.matrix[3].z*this.matrix[2].w)
								-this.matrix[2].y*(this.matrix[1].z*this.matrix[3].w-this.matrix[3].z*this.matrix[1].w)
								+this.matrix[3].y*(this.matrix[1].z*this.matrix[2].w-this.matrix[2].z*this.matrix[1].w))
					
					-this.matrix[1].x*(this.matrix[0].y*(this.matrix[2].z*this.matrix[3].w-this.matrix[3].z*this.matrix[2].w)
								  -this.matrix[2].y*(this.matrix[0].z*this.matrix[3].w-this.matrix[3].z*this.matrix[0].w)
								  +this.matrix[3].y*(this.matrix[0].z*this.matrix[2].w-this.matrix[2].z*this.matrix[0].w))
							
					+this.matrix[2].x*(this.matrix[0].y*(this.matrix[1].z*this.matrix[3].w-this.matrix[3].z*this.matrix[1].w)
								  -this.matrix[1].y*(this.matrix[0].z*this.matrix[3].w-this.matrix[3].z*this.matrix[0].w)
								  +this.matrix[3].y*(this.matrix[0].z*this.matrix[1].w-this.matrix[1].z*this.matrix[0].w))
							
					-this.matrix[3].x*(this.matrix[0].y*(this.matrix[1].z*this.matrix[2].w-this.matrix[2].z*this.matrix[1].w)
								  -this.matrix[1].y*(this.matrix[0].z*this.matrix[2].w-this.matrix[2].z*this.matrix[0].w)
								  +this.matrix[2].y*(this.matrix[0].z*this.matrix[1].w-this.matrix[1].z*this.matrix[0].w));
	};
	
	Mat4.prototype.transpose = function(){
		var col1 = new Vec4(this.matrix[0].x, this.matrix[1].x,  this.matrix[2].x, this.matrix[3].x);
		var col2 = new Vec4(this.matrix[0].y, this.matrix[1].y,  this.matrix[2].y, this.matrix[3].y);
		var col3 = new Vec4(this.matrix[0].z, this.matrix[1].z,  this.matrix[2].z, this.matrix[3].z);
		var col4 = new Vec4(this.matrix[0].w, this.matrix[1].w,  this.matrix[2].w, this.matrix[3].w);
		this.matrix[0].set(col1);
		this.matrix[1].set(col2);
		this.matrix[2].set(col3);
		this.matrix[3].set(col4);
		return this;
	};
	
	Mat4.prototype.add = function(rhs){
		if( rhs instanceof Mat4){
			this.matrix[0].add(rhs.col(0));
			this.matrix[1].add(rhs.col(1));
			this.matrix[2].add(rhs.col(2));
			this.matrix[3].add(rhs.col(3));
		}
		return this;
	};
	
	Mat4.prototype.subtract = function(rhs){
		if( rhs instanceof Mat4){
			this.matrix[0].subtract(rhs.col(0));
			this.matrix[1].subtract(rhs.col(1));	
			this.matrix[2].subtract(rhs.col(2));
			this.matrix[3].subtract(rhs.col(3));
		}
		return this;
	};
	
	Mat4.prototype.loadIdentity = function(){
		this.matrix[0].set(1.0, 0.0, 0.0, 0.0);
		this.matrix[1].set(0.0, 1.0, 0.0, 0.0);
		this.matrix[2].set(0.0, 0.0, 1.0, 0.0);
		this.matrix[3].set(0.0, 0.0, 0.0, 1.0);
		return this;
	};
	
	Mat4.prototype.multFactor = function(factor){
		this.matrix[0].scale(factor);
		this.matrix[1].scale(factor);
		this.matrix[2].scale(factor);
		this.matrix[3].scale(factor);
		return this;
	};
	
	Mat4.prototype.multVec = function(vec){
		if( vec instanceof Vec4){
			var row1 = new Vec4(this.matrix[0].x, this.matrix[1].x,  this.matrix[2].x, this.matrix[3].x);
			var row2 = new Vec4(this.matrix[0].y, this.matrix[1].y,  this.matrix[2].y, this.matrix[3].y);
			var row3 = new Vec4(this.matrix[0].z, this.matrix[1].z,  this.matrix[2].z, this.matrix[3].z);
			var row4 = new Vec4(this.matrix[0].w, this.matrix[1].w,  this.matrix[2].w, this.matrix[3].w);
			return new Vec4(row1.dot(vec), row2.dot(vec), row3.dot(vec), row4.dot(vec));
		}else if( vec instanceof Vec3){
			var mult = new Vec4(vec, 1.0);
			var row1 = new Vec4(this.matrix[0].x, this.matrix[1].x,  this.matrix[2].x, this.matrix[3].x);
			var row2 = new Vec4(this.matrix[0].y, this.matrix[1].y,  this.matrix[2].y, this.matrix[3].y);
			var row3 = new Vec4(this.matrix[0].z, this.matrix[1].z,  this.matrix[2].z, this.matrix[3].z);
			var row4 = new Vec4(this.matrix[0].w, this.matrix[1].w,  this.matrix[2].w, this.matrix[3].w);
			return new Vec4(row1.dot(mult), row2.dot(mult), row3.dot(mult), row4.dot(mult));
		}else{
			return null;
		}
	};
	
	Mat4.prototype.multiply = function(rhs){
		if( rhs instanceof Mat4){
			var row1 = new Vec4(this.matrix[0].x, this.matrix[1].x,  this.matrix[2].x, this.matrix[3].x);
			var row2 = new Vec4(this.matrix[0].y, this.matrix[1].y,  this.matrix[2].y, this.matrix[3].y);
			var row3 = new Vec4(this.matrix[0].z, this.matrix[1].z,  this.matrix[2].z, this.matrix[3].z);
			var row4 = new Vec4(this.matrix[0].w, this.matrix[1].w,  this.matrix[2].w, this.matrix[3].w);
			this.matrix[0].set( row1.dot(rhs.col(0)), row2.dot(rhs.col(0)), row3.dot(rhs.col(0)), row4.dot(rhs.col(0)) );
			this.matrix[1].set( row1.dot(rhs.col(1)), row2.dot(rhs.col(1)), row3.dot(rhs.col(1)), row4.dot(rhs.col(1)) );
			this.matrix[2].set( row1.dot(rhs.col(2)), row2.dot(rhs.col(2)), row3.dot(rhs.col(2)), row4.dot(rhs.col(2)) );
			this.matrix[3].set( row1.dot(rhs.col(3)), row2.dot(rhs.col(3)), row3.dot(rhs.col(3)), row4.dot(rhs.col(3)) );
		}
		return this;
	};
	
	Mat4.prototype.leftMult = function(lhs){
		if( lhs instanceof Mat4){
			var row1 = new Vec4(lhs.matrix[0].x, lhs.matrix[1].x,  lhs.matrix[2].x, lhs.matrix[3].x);
			var row2 = new Vec4(lhs.matrix[0].y, lhs.matrix[1].y,  lhs.matrix[2].y, lhs.matrix[3].y);
			var row3 = new Vec4(lhs.matrix[0].z, lhs.matrix[1].z,  lhs.matrix[2].z, lhs.matrix[3].z);
			var row4 = new Vec4(lhs.matrix[0].w, lhs.matrix[1].w,  lhs.matrix[2].w, lhs.matrix[3].w);
			this.matrix[0].set( row1.dot(this.matrix[0]), row2.dot(this.matrix[0]), row3.dot(this.matrix[0]), row4.dot(this.matrix[0]) );
			this.matrix[1].set( row1.dot(this.matrix[1]), row2.dot(this.matrix[1]), row3.dot(this.matrix[1]), row4.dot(this.matrix[1]) );
			this.matrix[2].set( row1.dot(this.matrix[2]), row2.dot(this.matrix[2]), row3.dot(this.matrix[2]), row4.dot(this.matrix[2]) );
			this.matrix[3].set( row1.dot(this.matrix[3]), row2.dot(this.matrix[3]), row3.dot(this.matrix[3]), row4.dot(this.matrix[3]) );
		}
		return this;
	};
	
	Mat4.prototype.col = function(index){
		return index < this.matrix.length ? this.matrix[index] : null;
	};
	
	Mat4.prototype.setColumn = function(index, value){
		if(index < this.matrix.length &&  column instanceof Vec4){
			this.matrix[index].set(column);
		}
	};
	
	Mat4.prototype.getMatrix = function(){
		return this.matrix;
	};
	
	Mat4.prototype.setMatrix = function(mat){
		if( mat instanceof Mat4){
			this.matrix[0].set(mat.col(0));
			this.matrix[1].set(mat.col(1));
			this.matrix[2].set(mat.col(2));
			this.matrix[3].set(mat.col(3));
		}
	};
	
	Mat4.prototype.setValueAt = function(col, row, value){
		if(col < this.matrix.length && row < 4){
			this.matrix[col].set(row,  value);
		}
	};
	
	Mat4.prototype.asBuffer = function(){
		return Array.prototype.concat(
			this.matrix[0].asBuffer(),
			this.matrix[1].asBuffer(),
			this.matrix[2].asBuffer(),
			this.matrix[3].asBuffer());
	};
	
	Mat4.prototype.toString = function(){
		return this.matrix[0].x+" | "+this.matrix[1].x+" | "+this.matrix[2].x+" | "+this.matrix[3].x+"\n"+
                this.matrix[0].y+" | "+this.matrix[1].y+" | "+this.matrix[2].y+" | "+this.matrix[3].y+"\n"+
                this.matrix[0].z+" | "+this.matrix[1].z+" | "+this.matrix[2].z+" | "+this.matrix[3].z+"\n"+
                this.matrix[0].w+" | "+this.matrix[1].w+" | "+this.matrix[2].w+" | "+this.matrix[3].w+"\n";
	};
	
	Mat4.prototype.print = function(){
		console.log(this.toString());
	};
	
	Mat4.prototype.trace = function(){
		return this.matrix[0].x+this.matrix[1].y+this.matrix[2].z+this.matrix[3].w;
	};
	
	Mat4.prototype.orthonormalize = function(){
        for(var curVec = 0; curVec < 4; curVec++){
            this.matrix[curVec].normalize();
            for(var nextVec = curVec+1; nextVec < 4; nextVec++){
                this.matrix[nextVec].subtract(this.matrix[nextVec].proj(this.matrix[curVec]));
            }
        }
    };

Mat2.SIZE_IN_BYTES = 64;
Mat2.SIZE_IN_FLOATS = 16;
