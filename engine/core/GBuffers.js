
function GBuffers(width, height){
	this.fbo = new FBO();
	this.diffuse = new Texture(gl.TEXTURE_2D, width, height, gl.RGBA, gl.FLOAT);
	this.fbo.bind();
	if(depthTexEXT){
        this.depthStencil = new Texture(gl.TEXTURE_2D, width, height, gl.DEPTH_STENCIL, depthTexEXT.UNSIGNED_INT_24_8_WEBGL);
    
        this.depthStencil.setParam(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.depthStencil.setParam(gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        this.fbo.attachDepthStencil(this.depthStencil);
    }else{
        this.fbo.genRenderbuffer(gl.DEPTH_STENCIL, width, height);
        this.fbo.useRenderbuffer(gl.DEPTH_STENCIL_ATTACHMENT);
    }
    this.normals = new Texture(gl.TEXTURE_2D, width, height, gl.RGBA, gl.FLOAT);
    this.position = new Texture(gl.TEXTURE_2D, width, height, gl.RGBA, gl.FLOAT);
    this.lightBuffer = new Texture(gl.TEXTURE_2D, width, height, gl.RGBA, gl.FLOAT);
    
    //attach the different textures to the buffer
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT0_WEBGL, this.diffuse);
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT1_WEBGL, this.normals);
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT2_WEBGL, this.position);
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT3_WEBGL, this.lightBuffer);
    
    this.fbo.setDrawBuffers();
    this.fbo.unbind();
    this.screenPlane = new Plane(2, 2, 0, false);
}

GBuffers.prototype.geomPass = function(){
    this.fbo.bind();
    //reattach the position and normal buffers for writing into
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT1_WEBGL, this.normals);
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT2_WEBGL, this.position);
    //set the draw buffers to diffuse, normals, and position
    this.fbo.setDrawBuffers(
        // [drawBufferEXT.DRAW_BUFFER0_WEBGL, drawBufferEXT.DRAW_BUFFER1_WEBGL, drawBufferEXT.DRAW_BUFFER2_WEBGL]
        [drawBufferEXT.COLOR_ATTACHMENT0_WEBGL, drawBufferEXT.COLOR_ATTACHMENT1_WEBGL, drawBufferEXT.COLOR_ATTACHMENT2_WEBGL, gl.NONE]
    );
	//allow depth buffer writing
	gl.depthMask(true);
	//clear everything
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	//re-enable depth testing
	gl.enable(gl.DEPTH_TEST);
};

GBuffers.prototype.bindForLight = function(positions, normal /*, occlusion, specular?*/){
    //technically only #3 should be bound
    //bind only the light accumulation buffer
    this.fbo.setDrawBuffers(
        // [drawBufferEXT.DRAW_BUFFER0_WEBGL, drawBufferEXT.DRAW_BUFFER1_WEBGL, drawBufferEXT.DRAW_BUFFER2_WEBGL]
        [gl.NONE, gl.NONE, gl.NONE, drawBufferEXT.COLOR_ATTACHMENT3_WEBGL]
    );
    //clear to black so that clear color doesn't effect sampling later
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //detach the normals and position buffers for read back
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT1_WEBGL, null);
    this.fbo.attachColor(drawBufferEXT.COLOR_ATTACHMENT2_WEBGL, null);
    //bind the normals and position texture for read back
    this.position.bind(positions);
    this.normals.bind(normal);
    //if the back face fails the depth test increment the stencil buffer
    gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.INCR_WRAP, gl.KEEP);
    //if the front face fails the depth test decrement the stencil buffer
    gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.DECR_WRAP, gl.KEEP);
};

GBuffers.prototype.stencilPass = function(){
    //set the draw buffers to GL_NONE
    this.fbo.setDrawBuffers(null);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    //disable face culling to allow for front and back deoth testing on light volume geometry
    gl.disable(gl.CULL_FACE);
    //let the geometry that is creating the stencil buffer pass the stencil test, this way we don't need to constanly enable and disable it
    gl.stencilFunc(gl.ALWAYS, 0, 0);
};

GBuffers.prototype.lightPass = function(){
    //rebind the light accumulation buffer for writing in to
    this.fbo.setDrawBuffers(
        // [drawBufferEXT.DRAW_BUFFER0_WEBGL, drawBufferEXT.DRAW_BUFFER1_WEBGL, drawBufferEXT.DRAW_BUFFER2_WEBGL]
        [gl.NONE, gl.NONE, gl.NONE, drawBufferEXT.COLOR_ATTACHMENT3_WEBGL]
    );
    //set the stencil test operation using the new stencil buffer from previous pass
    gl.stencilFunc(gl.NOTEQUAL, 0, 0xFF);//perform stencil testing
    gl.disable(gl.DEPTH_TEST);//don't perform depth testing, this way only the stencil test will cull unnecessary fragment operations
    
    gl.enable(gl.BLEND);//blend the results
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);
    
    //re-enable face culling and set it to the front faces, this way when inside of the light volume culling won't 
    //disable drawing of the faces "shut off" the light
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
};

GBuffers.prototype.finish = function(diffuse, lighting){
    //unbind the gbuffer fbo 
    this.fbo.unbind();
    //unbind the normals and position textures
    this.normals.unbind();
    this.position.unbind();
    //bind the diffuse texture so the color data can be read in 
    this.diffuse.bind(diffuse);
    //bind the lighting buffer to be read back lighting information
    this.lightBuffer.bind(lighting);
    
    // gl.disable(gl.BLEND);
    
    //set it back to back face culling
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    
    //render the screen space quad
    this.screenPlane.render();
    //unbind the textures for diffuse and lighting
    this.diffuse.unbind();
    this.lightBuffer.unbind();
};

GBuffers.prototype.unbind = function(){
    this.fbo.unbind();
    this.normals.unbind();
    this.position.unbind();
    this.diffuse.unbind();
    this.lightBuffer.unbind();
};
