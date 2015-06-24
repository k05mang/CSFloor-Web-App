
function SpotLight(){

// SpotLight(posX, posY, posZ, 
		// r, g, b, 
		// angle, length, intensity, atten)
	this.shadowMap = null;
	
	if(arguments.length === 6){
	    this.position = new Vec3(arguments[0]);
        this.color = new Vec3(arguments[1]);
	}else if(arguments.length === 10){
        this.position = new Vec3(arguments[0], arguments[1], arguments[2]);
        this.color = new Vec3(arguments[3], arguments[4], arguments[5]);
	}
	
	this.intensity = arguments[arguments.length-2];
    this.attenuation = arguments[arguments.length-1];
	
	if(arguments[arguments.length-4] <= 0){
		var absValue = Math.abs(arguments[arguments.length-4]);
		this.angle = absValue > 170 ? 170 : absValue;
	}else{
		this.angle = arguments[arguments.length-4] > 170 ? 170 : arguments[arguments.length-4];
	}
    // this.attenuation = Math.cos(this.angle*(Math.PI/180.0));
    // this.attenuation = 170/this.angle;
    
	this.cutOff = Math.cos((this.angle/2.0)*(Math.PI/180.0));
	this.length = arguments[arguments.length-3] == 0 ? .0001 : arguments[arguments.length-3];
	
	var coneRadius = this.length*Math.tan((this.angle/2.0)*Math.PI/180.0);
    //compute the radius of the sphere that the cone intersects
    this.attenRadius = coneRadius/Math.sin((this.angle/2.0)*Math.PI/180.0);
    
	this.volume = new Cone(coneRadius, this.length, this.VOLUME_FINENESS, 0, false);
	this.volume.translate(0,-this.length/2.0,0);
    this.volume.translate(this.position);
	
	this.perspective = MatrixUtil.getPerspective(this.angle, 1, .1, this.length);
    this.lightView = new Camera(this.position, 0, -90);
    this.compositeMat = MatrixUtil.multiply(this.perspective, this.lightView.getLookAt());
};
    
SpotLight.prototype.getAttenRadius = function(){
    return this.attenRadius;
};  

SpotLight.prototype.getCutOff = function(){
    return this.cutOff;
};
	
SpotLight.prototype.getPosition = function(){
	return this.position;
};
	
SpotLight.prototype.getAttenuation = function(){
	return this.attenuation;
};
	
SpotLight.prototype.getIntensity = function(){
	return this.intensity;
};
	
SpotLight.prototype.setIntensity = function(intensity) {
	this.intensity = intensity;
};

SpotLight.prototype.setAttenuation = function(attenuation) {
	this.attenuation = attenuation;
};

SpotLight.prototype.getLength = function(){
	return this.length;
};

SpotLight.prototype.getAngle = function(){
	return this.angle;
};

SpotLight.prototype.getPosBuffer = function(){
	return this.position.asBuffer();
};
	
SpotLight.prototype.setPosition = function(){
	if(arguments.length === 3){
        this.volume.translate(VecUtil.subtract(new Vec3(arguments[0], arguments[1], arguments[2]), this.position));
        this.position.set(arguments[0], arguments[1], arguments[2]);
        this.lightView.moveTo(this.position);
	}else if(arguments.length === 1){
        this.volume.translate(VecUtil.subtract(new Vec3(arguments[0]), this.position));
        this.position.set(arguments[0]);
        this.lightView.moveTo(this.position);
	}
    this.compositeMat = MatrixUtil.multiply(this.perspective, this.lightView.getLookAt());
};
	
SpotLight.prototype.translate = function(){
	if(arguments.length === 3){
        this.volume.translate(arguments[0], arguments[1], arguments[2]);
        this.position.add(new Vec3(arguments[0], arguments[1], arguments[2]));
        this.lightView.moveTo(this.position);
    }else if(arguments.length === 1){
        this.volume.translate(arguments[0]);
        this.position.add(arguments[0]);
        this.lightView.moveTo(this.position);
    }
    this.compositeMat = MatrixUtil.multiply(this.perspective, this.lightView.getLookAt());
};
	
SpotLight.prototype.storePos = function(buffer){
	this.position.store(buffer);
};
	
SpotLight.prototype.getModelBuffer = function(){
	return this.volume.getMatrixBuffer();
};

SpotLight.prototype.getView = function(){
	return this.lightView;
};

SpotLight.prototype.getViewBuffer = function(){
	return this.lightView.getLookAt().asBuffer();
};

SpotLight.prototype.getPerspective = function(){
	return this.perspective;
};

SpotLight.prototype.getPerspectiveBuffer = function(){
	return this.perspective.asBuffer();
};

SpotLight.prototype.getComposite = function(){
    return this.compositeMat;
};


SpotLight.prototype.getCompositeBuffer = function(){
    return this.compositeMat.asBuffer();
};
	
SpotLight.prototype.setColor = function() {
	if(arguments.length === 3){
        this.color.set(arguments[0], arguments[1], arguments[2]);
	}else if(arguments.length === 1){
        this.color.set(arguments[0]);
	}
};

SpotLight.prototype.getColorBuffer = function() {
	return this.color.asBuffer();
};

SpotLight.prototype.getColor = function() {
	return this.color;
};

SpotLight.prototype.storeColor = function(buffer) {
	this.color.store(buffer);
};

SpotLight.prototype.genShadowMap = function(){
	if(depthTexEXT){
	    this.shadowMap = new Texture(gl.TEXTURE_2D, 
            this.SHADOW_MAP_SIZE, this.SHADOW_MAP_SIZE, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT);
            
        // this.shadowMap = new Texture(gl.TEXTURE_2D, 
            // canvas.width, canvas.height, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT);
    
        this.shadowMap.setParam(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.shadowMap.setParam(gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
};

SpotLight.prototype.getShadowMap = function(){
	return this.shadowMap;
};
	
SpotLight.prototype.bindShadow = function(texUnit) {
	if(this.shadowMap !== null){
	    this.shadowMap.bind(texUnit);
	}
};

SpotLight.prototype.render = function(shader, modelMat) {
    if(shader !== null && typeof shader !== "undefined"){
        if(modelMat !== null && typeof modelMat !== "undefined"){
            shader.setUniform(modelMat, this.volume.getMatrixBuffer());
        }
    }
	this.volume.render();
};

SpotLight.prototype.cleanUp = function() {
	if(this.shadowMap !== null){
		this.shadowMap.erase();
	}
	this.volume.erase();
};

SpotLight.prototype.VOLUME_FINENESS = 30;
SpotLight.prototype.SHADOW_MAP_SIZE = 1024;
