
function PointLight(){
    //constants that define the number of subdivisions for the lights
    this.VOLUME_FINENESS = 10;
    this.LIGHT_FINENES = 10;
    this.shadowMap = null;
    
    if(arguments.length === 10){
        // PointLight(float posX, float posY, float posZ, float r, float g, float b, 
            // float lightRad, float volumeRad, float intensity, float atten)
        this.position = new Vec3(arguments[0], arguments[1], arguments[2]);
        this.color = new Vec3(arguments[3], arguments[4], arguments[5]);
        
        this.lightRadius = arguments[6];
        this.intensity = arguments[8];
        this.attenuation = arguments[9];
        this.light = new Sphere(arguments[6], this.LIGHT_FINENES, 0);
        this.volume = new Sphere(arguments[7], this.VOLUME_FINENESS, 0);
        this.volume.translate(this.position);
            
    }else if(arguments.length === 6){
        //PointLight(Vec3 pos, Vec3 color, float lightRad, float volumeRad, float intensity, float atten)
        this.position = new Vec3(arguments[0]);
        this.color = new Vec3(arguments[1]);
        
        this.lightRadius = arguments[2];
        this.intensity = arguments[4];
        this.attenuation = arguments[5];
        this.light = new Sphere(arguments[6], this.LIGHT_FINENES, 0);
        this.volume = new Sphere(arguments[7], this.VOLUME_FINENESS, 0);
        this.volume.translate(this.position);
    }
}
    
PointLight.prototype.getPosition = function(){
    return this.position;
};
    
PointLight.prototype.getAttenuation = function(){
    return this.attenuation;
};
    
PointLight.prototype.getIntensity = function(){
    return this.intensity;
};
    
PointLight.prototype.getRadius = function(){
    return this.lightRadius;
};
    
PointLight.prototype.setIntensity = function(intensity) {
    this.intensity = intensity;
};

PointLight.prototype.setAttenuation = function(attenuation) {
    this.attenuation = attenuation;
};

PointLight.prototype.getPosBuffer = function(){
    return this.position.asBuffer();
};
    
PointLight.prototype.setPosition = function(){
    if(arguments.length === 3){
        this.volume.translate(VecUtil.subtract(new Vec3(arguments[0], arguments[1], arguments[2]), this.position));
        this.position.set(arguments[0], arguments[1], arguments[2]);
    }else if(arguments.length === 1){
        this.volume.translate(VecUtil.subtract(new Vec3(arguments[0]), this.position));
        this.position.set(arguments[0]);
    }
};
    
PointLight.prototype.translate = function(){
    if(arguments.length === 3){
        this.volume.translate(arguments[0], arguments[1], arguments[2]);
        this.position.add(new Vec3(arguments[0], arguments[1], arguments[2]));
    }else if(arguments.length === 1){
        this.volume.translate(arguments[0]);
        this.position.add(arguments[0]);
    }
};
    
PointLight.prototype.storePos = function(buffer){
    this.position.store(buffer);
};
    
PointLight.prototype.getModelBuffer = function(){
    return this.volume.getMatrixBuffer();
};
    
PointLight.prototype.setColor = function() {
    if(arguments.length === 3){
        this.color.set(arguments[0], arguments[1], arguments[2]);
    }else if(arguments.length === 1){
        this.color.set(arguments[0]);
    }
};

PointLight.prototype.getColorBuffer = function() {
    return this.color.asBuffer();
};

PointLight.prototype.getColor = function() {
    return this.color;
};

PointLight.prototype.storeColor = function(buffer) {
    this.color.store(buffer);
};

PointLight.prototype.render = function(shader, modelMat) {
    if(shader !== null && typeof shader !== "undefined"){
        if(modelMat !== null && typeof modelMat !== "undefined"){
            shader.setUniform(modelMat, this.volume.getMatrixBuffer());
        }
    }
    this.volume.render();
};

PointLight.prototype.renderLight = function(shader, modelMat) {
    if(shader !== null && typeof shader !== "undefined"){
        if(modelMat !== null && typeof modelMat !== "undefined"){
            shader.setUniform(modelMat, this.volume.getMatrixBuffer());
        }
    }
    this.light.render();
};
