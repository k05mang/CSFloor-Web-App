function Mat2(col1, col2){
	// this.SIZE_IN_BYTES = 16;
	// this.SIZE_IN_FLOATS = 4;

	if(typeof col1 === "undefined" &&
		typeof col2 === "undefined"){
			this.matrix = [
				new Vec2(1.0,0.0),
				new Vec2(0.0,1.0)
			];
	}else if(col1 instanceof Vec2 &&
			col2 instanceof Vec2){
			this.matrix = [
				new Vec2(col1),
				new Vec2(col2)
			];
	}else if(typeof col1 === "number" &&
			typeof col2 === "undefined"){
			this.matrix = [
				new Vec2(col1,0.0),
				new Vec2(0.0,col2)
			];
	}else if(col1 instanceof Mat2 &&
			typeof col2 === "undefined"){
			this.matrix = [
				new Vec2(col1.matrix[0]),
				new Vec2(col2.matrix[1])
			];
	}
};
	Mat2.prototype.invert = function(){
		var det = this.determinant();
		if(det != 0){
			var col1 = new Vec2(this.matrix[1].y, -this.matrix[0].y);
			var col2 = new Vec2(-this.matrix[1].x, this.matrix[0].x);
			this.matrix[0].set(col1);
			this.matrix[1].set(col2);
			this.multFactor(1.0/det);
		}
		return this;
	};
    
    Mat2.prototype.inverse = function() {
        return new Mat2(this).invert();
    };
	
	Mat2.prototype.determinant = function(){
		return this.matrix[0].x*this.matrix[1].y-this.matrix[1].x*this.matrix[0].y;
	};
	
	Mat2.prototype.transpose = function(){
		var col1 = new Vec2(this.matrix[0].x, this.matrix[1].x);
		var col2 = new Vec2(this.matrix[0].y, this.matrix[1].y);
		this.matrix[0].set(col1);
		this.matrix[1].set(col2);
		return this;
	};
	
	Mat2.prototype.add = function(rhs){
		if(rhs instanceof Mat2){
			this.matrix[0].add(rhs.col(0));
			this.matrix[1].add(rhs.col(1));
		}
		return this;
	};
	
	Mat2.prototype.subtract = function(rhs){
		if(rhs instanceof Mat2){
			this.matrix[0].subtract(rhs.col(0));
			this.matrix[1].subtract(rhs.col(1));
		}
		return this;
	};
	
	Mat2.prototype.loadIdentity = function(){
		this.matrix[0].set(1.0,0.0);
		this.matrix[1].set(0.0,1.0);
		return this;
	};
	
	Mat2.prototype.multFactor = function(factor){
		this.matrix[0].scale(factor);
		this.matrix[1].scale(factor);
		return this;
	};
	
	Mat2.prototype.multVec = function(vec){
		if(vec instanceof Vec2){
			var row1 = new Vec2(this.matrix[0].x, this.matrix[1].x);
			var row2 = new Vec2(this.matrix[0].y, this.matrix[1].y);
			return new Vec2(row1.dot(vec), row2.dot(vec));
		}else{
			return null;
		}
	};
	
	Mat2.prototype.multiply = function(rhs){
		if(rhs instanceof Mat2){
			var row1 = new Vec2(this.matrix[0].x, this.matrix[1].x);
			var row2 = new Vec2(this.matrix[0].y, this.matrix[1].y);
			this.matrix[0].set( row1.dot(rhs.col(0)), row2.dot(rhs.col(0)) );
			this.matrix[1].set( row1.dot(rhs.col(1)), row2.dot(rhs.col(1)) );
		}
		return this;
	};
	
	Mat2.prototype.leftMult = function(lhs){
		if(lhs instanceof Mat2){
			var row1 = new Vec2(lhs.matrix[0].x, lhs.matrix[1].x);
			var row2 = new Vec2(lhs.matrix[0].y, lhs.matrix[1].y);
			this.matrix[0].set( row1.dot(this.matrix[0]), row2.dot(this.matrix[0]) );
			this.matrix[1].set( row1.dot(this.matrix[1]), row2.dot(this.matrix[1]) );
		}
		return this;
	};
	
	Mat2.prototype.col = function(index){
		return index < this.matrix.length ? this.matrix[index] : null;
	};
	
	Mat2.prototype.setColumn = function(index, value){
		if(index < this.matrix.length && column instanceof Vec2){
			this.matrix[index].set(column);
		}
	};
	
	Mat2.prototype.getMatrix = function(){
		return this.matrix;
	};
	
	Mat2.prototype.setMatrix = function(mat){
		if(mat instanceof Mat2){
			this.matrix[0].set(mat.col(0));
			this.matrix[1].set(mat.col(1));
		}
	};
	
	Mat2.prototype.setValueAt = function(col, row, value){
		if(col < this.matrix.length && row < 2){
			this.matrix[col].set(row,  value);
		}
	};
	
	Mat2.prototype.asBuffer = function(){
		return Array.prototype.concat(
			this.matrix[0].asBuffer(),
			this.matrix[1].asBuffer());
	};
	
	Mat2.prototype.toString = function(){
		return this.matrix[0].x+" | "+this.matrix[1].x+"\n"+
                this.matrix[0].y+" | "+this.matrix[1].y+"\n";
	};
	
	Mat2.prototype.print = function(){
		console.log(this.toString());
	};
	
	Mat2.prototype.trace = function(){
		return this.matrix[0].x+this.matrix[1].y;
	};
    
    Mat2.prototype.orthonormalize = function(){
        for(var curVec = 0; curVec < 2; curVec++){
            this.matrix[curVec].normalize();
            for(var nextVec = curVec+1; nextVec < 2; nextVec++){
                this.matrix[nextVec].subtract(this.matrix[nextVec].proj(this.matrix[curVec]));
            }
        }
    };

Mat2.SIZE_IN_BYTES = 16;
Mat2.SIZE_IN_FLOATS = 4;
