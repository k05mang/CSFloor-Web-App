function Mat3(col1, col2, col3){
	
	// this.SIZE_IN_BYTES = 36;
	// this.SIZE_IN_FLOATS = 9;
	
	if(typeof col1 === "undefined" &&
		typeof col2 === "undefined" &&
		typeof col3 === "undefined"){
			this.matrix = [
				new Vec3(1.0, 0.0, 0.0),
				new Vec3(0.0, 1.0, 0.0),
				new Vec3(0.0, 0.0, 1.0)
			];
	}else if(col1 instanceof Vec3 &&
			col2 instanceof Vec3 &&
			col3 instanceof Vec3){
			this.matrix = [
				new Vec3(col1),
				new Vec3(col2),
				new Vec3(col3)
			];
	}else if(typeof col1 === "number" &&
			typeof col2 === "undefined" &&
			typeof col3 === "undefined"){
			this.matrix = [
				new Vec3(col1, 0.0, 0.0),
				new Vec3(0.0, col1, 0.0),
				new Vec3(0.0, 0.0, col1)
			];
	}else if(col1 instanceof Mat3 &&
			typeof col2 === "undefined" &&
			typeof col3 === "undefined"){
			this.matrix = [
				new Vec3(col1.matrix[0]),
				new Vec3(col1.matrix[1]),
				new Vec3(col1.matrix[2])
			];
	}
};
	
	Mat3.prototype.getUpperMatrix = function(){
			return new Mat2(this.matrix[0].swizzle("xy"), this.matrix[1].swizzle("xy"));
	};
	
	Mat3.prototype.invert = function(){
			var det = this.determinant();
			if(det != 0){
				var col1 = new Vec3(
						this.matrix[1].y*this.matrix[2].z-this.matrix[2].y*this.matrix[1].z,
						this.matrix[2].y*this.matrix[0].z-this.matrix[0].y*this.matrix[2].z,
						this.matrix[0].y*this.matrix[1].z-this.matrix[1].y*this.matrix[0].z
						);
				var col2 =  new Vec3(
						this.matrix[2].x*this.matrix[1].z-this.matrix[1].x*this.matrix[2].z,
						this.matrix[0].x*this.matrix[2].z-this.matrix[2].x*this.matrix[0].z,
						this.matrix[1].x*this.matrix[0].z-this.matrix[0].x*this.matrix[1].z
						);
				var col3 = new Vec3(
						this.matrix[1].x*this.matrix[2].y-this.matrix[2].x*this.matrix[1].y,
						this.matrix[2].x*this.matrix[0].y-this.matrix[0].x*this.matrix[2].y,
						this.matrix[0].x*this.matrix[1].y-this.matrix[1].x*this.matrix[0].y
						);
				this.matrix[0].set(col1);
				this.matrix[1].set(col2);
				this.matrix[2].set(col3);
				this.multFactor(1.0/det);
			}
			return this;
	};
    
    Mat3.prototype.inverse = function() {
        return new Mat3(this).invert();
    };
	
	Mat3.prototype.determinant = function(){
		return this.matrix[0].x*(this.matrix[1].y*this.matrix[2].z-this.matrix[2].y*this.matrix[1].z)
					-this.matrix[1].x*(this.matrix[0].y*this.matrix[2].z-this.matrix[2].y*this.matrix[0].z)
					+this.matrix[2].x*(this.matrix[0].y*this.matrix[1].z-this.matrix[1].y*this.matrix[0].z);
	};
	
	Mat3.prototype.transpose = function(){
		var col1 = new Vec3(this.matrix[0].x, this.matrix[1].x,  this.matrix[2].x);
		var col2 = new Vec3(this.matrix[0].y, this.matrix[1].y,  this.matrix[2].y);
		var col3 = new Vec3(this.matrix[0].z, this.matrix[1].z,  this.matrix[2].z);
		this.matrix[0].set(col1);
		this.matrix[1].set(col2);
		this.matrix[2].set(col3);
		return this;
	};
	
	Mat3.prototype.add = function(rhs){
		if(rhs instanceof Mat3){
			this.matrix[0].add(rhs.col(0));
			this.matrix[1].add(rhs.col(1));
			this.matrix[2].add(rhs.col(2));
		}
		return this;
	};
	
	Mat3.prototype.subtract = function(rhs){
		if(rhs instanceof Mat3){
			this.matrix[0].subtract(rhs.col(0));
			this.matrix[1].subtract(rhs.col(1));	
			this.matrix[2].subtract(rhs.col(2));
		}
		return this;
	};
	
	Mat3.prototype.loadIdentity = function(){
		this.matrix[0].set(1.0,0.0,0.0);
		this.matrix[1].set(0.0,1.0,0.0);
		this.matrix[2].set(0.0,0.0,1.0);
		return this;
	};
	
	Mat3.prototype.multFactor = function(factor){
		this.matrix[0].scale(factor);
		this.matrix[1].scale(factor);
		this.matrix[2].scale(factor);
		return this;
	};
	
	Mat3.prototype.multVec = function(vec){
		if(vec instanceof Vec3){
			var row1 = new Vec3(this.matrix[0].x, this.matrix[1].x, this.matrix[2].x);
			var row2 = new Vec3(this.matrix[0].y, this.matrix[1].y, this.matrix[2].y);
			var row3 = new Vec3(this.matrix[0].z, this.matrix[1].z, this.matrix[2].z);
			return new Vec3(row1.dot(vec), row2.dot(vec), row3.dot(vec));
		}else{
			return null;
		}
	};
	
	Mat3.prototype.multiply = function(rhs){
		if(rhs instanceof Mat3){
			var row1 = new Vec3(this.matrix[0].x, this.matrix[1].x, this.matrix[2].x);
			var row2 = new Vec3(this.matrix[0].y, this.matrix[1].y, this.matrix[2].y);
			var row3 = new Vec3(this.matrix[0].z, this.matrix[1].z, this.matrix[2].z);
			this.matrix[0].set( row1.dot(rhs.col(0)), row2.dot(rhs.col(0)), row3.dot(rhs.col(0)) );
			this.matrix[1].set( row1.dot(rhs.col(1)), row2.dot(rhs.col(1)), row3.dot(rhs.col(1)) );
			this.matrix[2].set( row1.dot(rhs.col(2)), row2.dot(rhs.col(2)), row3.dot(rhs.col(2)) );
		}
		return this;
	};
	
	Mat3.prototype.leftMult = function(lhs){
		if(lhs instanceof Mat3){
			var row1 = new Vec3(lhs.matrix[0].x, lhs.matrix[1].x, lhs.matrix[2].x);
			var row2 = new Vec3(lhs.matrix[0].y, lhs.matrix[1].y, lhs.matrix[2].y);
			var row3 = new Vec3(lhs.matrix[0].z, lhs.matrix[1].z, lhs.matrix[2].z);
			this.matrix[0].set( row1.dot(this.matrix[0]), row2.dot(this.matrix[0]), row3.dot(this.matrix[0]) );
			this.matrix[1].set( row1.dot(this.matrix[1]), row2.dot(this.matrix[1]), row3.dot(this.matrix[1]) );
			this.matrix[2].set( row1.dot(this.matrix[2]), row2.dot(this.matrix[2]), row3.dot(this.matrix[2]) );
		}
		return this;
	};
	
	Mat3.prototype.col = function(index){
		return index < this.matrix.length ? this.matrix[index] : null;
	};
	
	Mat3.prototype.setColumn = function(index, value){
		if(index < this.matrix.length && column instanceof Vec3){
			this.matrix[index].set(column);
		}
	};
	
	Mat3.prototype.getMatrix = function(){
		return this.matrix;
	};
	
	Mat3.prototype.setMatrix = function(mat){
		if(mat instanceof Mat3){
			this.matrix[0].set(mat.col(0));
			this.matrix[1].set(mat.col(1));
			this.matrix[2].set(mat.col(2));
		}
	};
	
	Mat3.prototype.setValueAt = function(col, row, value){
		if(col < this.matrix.length && row < 3){
			this.matrix[col].set(row,  value);
		}
	};
	
	Mat3.prototype.asBuffer = function(){
		return Array.prototype.concat(
			this.matrix[0].asBuffer(),
			this.matrix[1].asBuffer(),
			this.matrix[2].asBuffer());
	};
	
	Mat3.prototype.toString = function(){
		return this.matrix[0].x+" | "+this.matrix[1].x+" | "+this.matrix[2].x+"\n"+
                this.matrix[0].y+" | "+this.matrix[1].y+" | "+this.matrix[2].y+"\n"+
                this.matrix[0].z+" | "+this.matrix[1].z+" | "+this.matrix[2].z+"\n";
	};
	
	Mat3.prototype.print = function(){
		console.log(this.toString());
	};
	
	Mat3.prototype.trace = function(){
		return this.matrix[0].x+this.matrix[1].y+this.matrix[2].z;
	};
    
    Mat3.prototype.orthonormalize = function(){
        for(var curVec = 0; curVec < 3; curVec++){
            this.matrix[curVec].normalize();
            for(var nextVec = curVec+1; nextVec < 3; nextVec++){
                this.matrix[nextVec].subtract(this.matrix[nextVec].proj(this.matrix[curVec]));
            }
        }
    };

Mat2.SIZE_IN_BYTES = 36;
Mat2.SIZE_IN_FLOATS = 9;
