function AABB(){    
    if(arguments.length === 0)
    {
        this.halfDimensions = new Vec3(.5);
        this.modelMat = new Mat4(1);
        
    }else if(arguments.length === 1)
    {
        if(arguments[0] instanceof Vec3){
            this.halfDimensions = new Vec3(arguments[0].x/2.0, arguments[0].y/2.0, arguments[0].z/2.0);
            this.modelMat = new Mat4(1);
            
        }else if(arguments[0] instanceof AABB){
            this.modelMat = new Mat4(arguments[0].modelMat);
            this.halfDimensions = new Vec3(arguments[0].halfDimensions);
        }
    }else if(arguments.length === 3)
    {
        this.halfDimensions = new Vec3(arguments[0]/2.0, arguments[1]/2.0, arguments[2]/2.0);
        this.modelMat = new Mat4(1);
    }
}

AABB.prototype.colliding = function(collider){
    var thisCenter = this.modelMat.multVec(VecUtil.zero).swizzle("xyz");
    var colliderCenter = collider.getCenter();
    //max x value of this < min x of collider or min x value of this < max x value of collider
    var xCheck = thisCenter.x+this.halfDimensions.x > colliderCenter.x-collider.halfDimensions.x //case where this is left of collider
            &&
            thisCenter.x-this.halfDimensions.x < colliderCenter.x+collider.halfDimensions.x;//case where this is right of collider
            
    //max y value of this < min y of collider or min y value of this < max y value of collider
    var yCheck = thisCenter.y+this.halfDimensions.y > colliderCenter.y-collider.halfDimensions.y //case where this is below of collider
            &&
            thisCenter.y-this.halfDimensions.y < colliderCenter.y+collider.halfDimensions.y;//case where this is above of collider
            
    //max z value of this < min z of collider or min z value of this < max z value of collider
    var zCheck = thisCenter.z+this.halfDimensions.z > colliderCenter.z-collider.halfDimensions.z //case where this is behind of collider
            &&
            thisCenter.z-this.halfDimensions.z < colliderCenter.z+collider.halfDimensions.z;//case where this is front of collider
            
    //all three must be true for the boxes to be colliding
    return xCheck && yCheck && zCheck;
};

AABB.prototype.translate = function(){
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

AABB.prototype.scale = function(){
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

AABB.prototype.rotate = function(){
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

AABB.prototype.moveTo = function(){
    if(arguments.length === 1){
        this.modelMat.loadIdentity();
        this.translate(arguments[0]);
    }else if(arguments.length === 3){
        this.modelMat.loadIdentity();
        this.translate(arguments[0], arguments[1], arguments[2]);
    }
};

AABB.prototype.getModelMatrix = function(){
    return this.modelMat;
};

AABB.prototype.getHalfDimensions = function(){
    return this.halfDimensions;
};
AABB.prototype.setData = function(mat){
    this.modelMat.setMatrix(mat);
};

AABB.prototype.getCenter = function(){
    return this.modelMat.multVec(VecUtil.zero).swizzle("xyz");
};

AABB.prototype.support = function(direction){
    
    return this.modelMat.multVec(new Vec3(
            halfDimensions.x*Math.sign(direction.x),
            halfDimensions.y*Math.sign(direction.y),
            halfDimensions.z*Math.sign(direction.z)
            )).swizzle("xyz");
};

AABB.prototype.copy = function() {
    return new AABB(this);
};

AABB.prototype.reset = function() {
    this.modelMat.loadIdentity();
};
