
    /*
     * theta: Horizontal rotation in degrees
     * phi: Vertical rotation in degrees
     * eye: The x,y,z, coordinates of the camera
     * forward: The forward vector for the camera look at matrix
     * right: The right vector for the camera look at matrix
     * up: The up vector for the camera look at matrix
     * projection: The projection matrix for this camera 
     */
function Camera(){
    switch(arguments.length){
        /**
         * Constructs a camera object without any projection matrix, the camera is centered
         * at the origin, defined as (0,0,0) with 0 horizontal and vertical rotation.
         */
        case 0:
            this.theta = 0;
            this.phi = 0;
            this.eye = new Vec3(0,0,0);
            this.forward = new Vec3(0,0,-1);
            this.right = new Vec3(1,0,0);
            this.up = new Vec3(0,1,0);
            this.projection = null;
            break;
        /**
         * Creates a camera with the given x, y, z eye position, and a theta horizontal rotation
         * and a phi vertical rotation.
         * 
         * @param arguments[0] the x component of the camera's location
         * @param arguments[1] the y component of the camera's location
         * @param arguments[2] the z component of the camera's location
         * @param arguments[3] the camera's horizontal rotation (in degrees)
         * @param arguments[4] the camera's vertical rotation (in degrees)
         */
        case 5:
            this.theta = arguments[3];
            this.phi = arguments[4];
            this.eye = new Vec3(arguments[0], arguments[1], arguments[2]);
            this.forward = new Vec3(0,0,-1);
            this.right = new Vec3(1,0,0);
            this.up = new Vec3(0,1,0);
            this.projection = null;
            break;
        /**
         * Creates a camera with the given vector eye position, and a theta horizontal rotation
         * and a phi vertical rotation.
         * 
         * @param arguments[0] Vector that will be used for this cameras starting position
         * @param arguments[1] the camera's horizontal rotation (in degrees)
         * @param arguments[2] the camera's vertical rotation (in degrees)
         */
        case 3:
            this.theta = arguments[1];
            this.phi = arguments[2];
            this.eye = new Vec3(arguments[0]);
            this.forward = new Vec3(0,0,-1);
            this.right = new Vec3(1,0,0);
            this.up = new Vec3(0,1,0);
            this.projection = null;
            break;
        case 9:
            if(arguments[0] instanceof Vec3){
            /**
             * Creates a camera with the given vector eye position, and a theta horizontal rotation
             * and a phi vertical rotation, additionall this creates and stores an orthographic projection
             * matrix formed using the given left, right, bottom, top, zNear, and zFar values.
             * 
             * @param arguments[0] Vector that will be used for this cameras starting position
             * @param arguments[1] the camera's horizontal rotation (in degrees)
             * @param arguments[2] the camera's vertical rotation (in degrees)
             * 
             * @param arguments[3] The minimum x clipping value
             * @param arguments[4] The maximum x clipping value
             * @param arguments[5] The minimum y clipping value
             * @param arguments[6] The maximum y clipping value
             * @param arguments[7] The nearest z value to the view before being clipped
             * @param arguments[8] The farthest z value from the view before being clipped
             */
                this.theta = arguments[1];
                this.phi = arguments[2];
                this.eye = new Vec3(arguments[0]);
                this.forward = new Vec3(0,0,-1);
                this.right = new Vec3(1,0,0);
                this.up = new Vec3(0,1,0);
                this.projection = MatrixUtil.getOrtho(arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
            }else{
                /**
             * Creates a camera with the given x, y, z eye position, and a theta horizontal rotation
             * and a phi vertical rotation, additionall this creates and stores a perspective projection
             * matrix formed using the given fovy, aspect, zNear, and zFar.
             * 
             * @param arguments[0] the x component of the camera's location
             * @param arguments[1] the y component of the camera's location
             * @param arguments[2] the z component of the camera's location
             * @param arguments[3] the camera's horizontal rotation (in degrees)
             * @param arguments[4] the camera's vertical rotation (in degrees)
             * 
             * @param arguments[5] Field of View angle for the y direction 
             * @param arguments[6] Aspect ratio of the area being rendered to
             * @param arguments[7] The nearest z value to the view before being clipped
             * @param arguments[8] The farthest z value from the view before being clipped
             */
                this.theta = arguments[3];
                this.phi = arguments[4];
                this.eye = new Vec3(arguments[0], arguments[1], arguments[2]);
                this.forward = new Vec3(0,0,-1);
                this.right = new Vec3(1,0,0);
                this.up = new Vec3(0,1,0);
                this.projection = MatrixUtil.getPerspective(arguments[5], arguments[6], arguments[7], arguments[8]); 
            }
            break;
        /**
         * Creates a camera with the given vector eye position, and a theta horizontal rotation
         * and a phi vertical rotation, additionall this creates and stores a perspective projection
         * matrix formed using the given fovy, aspect, zNear, and zFar.
         * 
         * @param arguments[0] Vector that will be used for this cameras starting position
         * @param arguments[1] the camera's horizontal rotation (in degrees)
         * @param arguments[2] the camera's vertical rotation (in degrees)
         * 
         * @param arguments[3] Field of View angle for the y direction 
         * @param arguments[4] Aspect ratio of the area being rendered to
         * @param arguments[5] The nearest z value to the view before being clipped
         * @param arguments[6] The farthest z value from the view before being clipped
         */
        case 7:
            this.theta = arguments[1];
            this.phi = arguments[2];
            this.eye = new Vec3(arguments[0]);
            this.forward = new Vec3(0,0,-1);
            this.right = new Vec3(1,0,0);
            this.up = new Vec3(0,1,0);
            this.projection = MatrixUtil.getPerspective(arguments[3], arguments[4], arguments[5], arguments[6]);
            break;
        /**
         * Creates a camera with the given x, y, z eye position, and a theta horizontal rotation
         * and a phi vertical rotation, additionall this creates and stores an orthographic projection
         * matrix formed using the given left, right, bottom, top, zNear, and zFar values.
         * 
         * @param arguments[0] the x component of the camera's location
         * @param arguments[1] the y component of the camera's location
         * @param arguments[2] the z component of the camera's location
         * @param arguments[3] the camera's horizontal rotation (in degrees)
         * @param arguments[4] the camera's vertical rotation (in degrees)
         * 
         * @param arguments[5] The minimum x clipping value
         * @param arguments[6] The maximum x clipping value
         * @param arguments[7] The minimum y clipping value
         * @param arguments[8] The maximum y clipping value
         * @param arguments[9] The nearest z value to the view before being clipped
         * @param arguments[10] The farthest z value from the view before being clipped
         */
        case 11:
            this.theta = arguments[3];
            this.phi = arguments[4];
            this.eye = new Vec3(arguments[0], arguments[1], arguments[2]);
            this.forward = new Vec3(0,0,-1);
            this.right = new Vec3(1,0,0);
            this.up = new Vec3(0,1,0);
            this.projection = MatrixUtil.getOrtho(arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
            break;
    }
};

Camera.prototype.getLookAt = function(){
    var rot = new Quaternion(this.phi,this.theta,0);
    
    this.forward = rot.multVec(VecUtil.zAxis);
    this.up = rot.multVec(VecUtil.yAxis);
    this.right = this.up.cross(this.forward);
    
    return  new Mat4(
            new Vec4(this.right.x, this.up.x, this.forward.x, 0),
            new Vec4(this.right.y, this.up.y, this.forward.y, 0),
            new Vec4(this.right.z, this.up.z, this.forward.z, 0),
            new Vec4(-this.right.dot(this.eye),-this.up.dot(this.eye),-this.forward.dot(this.eye),1.0)
            );
};

Camera.prototype.getProjection = function(){
    return this.projection;
};

Camera.prototype.getProjBuffer = function(){
    return this.projection.asBuffer();
};

Camera.prototype.setProjection = function(){
    if(arguments.length === 4){
        this.projection = MatrixUtil.getPerspective(arguments[0], arguments[1], arguments[2], arguments[3]);
    }else if(arguments.length === 6){
        this.projection = MatrixUtil.getOrtho(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }
};

/**
 * Increases the camera's rotation angle by the indicated amount. 
 * 
 * @param amt amount (in degrees) by which to increase the camera's rotation
 */
Camera.prototype.rotate = function( amt ) {
    this.theta = (this.theta+amt)%360;
};
 
/**
 * Rotates the camera vertically
 * 
 * @param amt amount (in degrees) by which to increase the camera's rotation
 */
Camera.prototype.lookY = function(amt, restrict){
    if (restrict) {
        this.phi += (!(this.phi + amt < -85 || this.phi + amt > 85) ? amt : 0);
    }else{
        this.phi += amt;
    }
};

Camera.prototype.moveTo = function(){
    if(arguments.length == 3){
        this.eye.set(arguments[0], arguments[1], arguments[2]);
    }else{
       this.eye.set(arguments[0]); 
    }
};

Camera.prototype.strafe = function(amt){
    this.eye.add(this.right.x*amt, this.right.y*amt, this.right.z*amt);
};

/**
 * Moves the camera in a horizontal direction independent of where the camera is facing (walking)
 * 
 * @param amt how far to move 
 */
Camera.prototype.move = function(amt){
    var rot = new Quaternion(0,this.theta,0);
    
    var dir = rot.multVec(VecUtil.zAxis);
    
    this.eye.add(dir.scale(amt));
};

Camera.prototype.moveUpDown = function(amt){
    this.eye.set(1, this.eye.y+amt);
};

Camera.prototype.fly = function(amt){
    this.eye.add(this.forward.x*amt, this.forward.y*amt, this.forward.z*amt);
};

Camera.prototype.getEye = function(){
    return this.eye;
};

Camera.prototype.getForwardVec = function(){
    return this.forward;
};