
function FBO(){
	this.fboId = gl.createFramebuffer();
	this.rbo = null;
	this.rboAttachment = null;
};

/*
 * returns a booleam value based on the success of attaching the renderbuffer to the framebuffer
 * false means that the renderbuffer either doesn't exist for this framebuffer or failed to attach
 */
FBO.prototype.useRenderbuffer = function(attachment){
    if(this.rbo !== null){
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, this.rbo);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        if(this.isComplete()){
            this.rboAttachment = attachment;
            return true;
        }else{
            return false;
        }
    }else{
        console.log("A renderbuffer has not been initialied for this framebuffer");
        return false;
    }  
};

FBO.prototype.genRenderbuffer = function(format, width, height){
    this.rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
};

FBO.prototype.isComplete = function(){
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status !== gl.FRAMEBUFFER_COMPLETE){
        switch(status){
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                console.log("Framebuffer returned status: FRAMEBUFFER_INCOMPLETE_ATTACHMENT when attempting to use renderbufffer");
                return false;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                console.log("Framebuffer returned status: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT when attempting to use renderbufffer");
                return false;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                console.log("Framebuffer returned status: FRAMEBUFFER_INCOMPLETE_DIMENSIONS when attempting to use renderbufffer");
                return false;
            case gl.FRAMEBUFFER_UNSUPPORTED:
                console.log("Framebuffer returned status: FRAMEBUFFER_UNSUPPORTED when attempting to use renderbufffer");
                return false;
        } 
    }else{
        return true;
    }
};

/*
 * avlues passed to this function should be an array of numeric values representing the corresponding 
 * draw buffers, a value of null will set the drawbuffers to GL_NONE.
 */
FBO.prototype.setDrawBuffers = function(drawBuffers){
    if(drawBufferEXT){
        if(drawBuffers === null || typeof drawBuffers === "undefined"){
            drawBufferEXT.drawBuffersWEBGL([gl.NONE]);
        }else{
            drawBufferEXT.drawBuffersWEBGL(drawBuffers);
        }
    }
};
	
/*
 * Attaches a color renderable texture to this framebuffer at the given attachment point
 * if the drawbuffers extension is not enabled then it will default the attachment to color attachment 0.
 * This function also returns a boolean value, true if the attachment was successful, false otherwise
 */
FBO.prototype.attachColor = function(attachPoint, texture){
    var isDefined = (texture !== null && typeof texture !== "undefined");
    if(drawBufferEXT){
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachPoint, gl.TEXTURE_2D, (isDefined ? texture.id : null), 0);
    }else{
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, (isDefined ? texture.id : null), 0);
    }
    
    return this.isComplete();
};
    
/*
 * Attaches a depth renderable texture to this framebuffe.
 * This function also returns a boolean value, true if the attachment was successful, false otherwise.
 */
FBO.prototype.attachDepth = function(texture){
    var isDefined = (texture !== null && typeof texture !== "undefined");
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, (isDefined ? texture.id : null), 0);
};
    
/*
 * Attaches a stencil renderable texture to this framebuffe.
 * This function also returns a boolean value, true if the attachment was successful, false otherwise.
 */
FBO.prototype.attachStencil = function(texture){
    var isDefined = (texture !== null && typeof texture !== "undefined");
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.TEXTURE_2D, (isDefined ? texture.id : null), 0);
};
    
/*
 * Attaches a depth and stencil renderable texture to this framebuffe.
 * This function also returns a boolean value, true if the attachment was successful, false otherwise.
 */
FBO.prototype.attachDepthStencil = function(texture){
    var isDefined = (texture !== null && typeof texture !== "undefined");
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, (isDefined ? texture.id : null), 0);
};

FBO.prototype.bind = function(){
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboId);
};

FBO.prototype.unbind = function(){
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

FBO.prototype.getId = function() {
	return this.fboId;
};

FBO.prototype.getRenderBuffer = function() {
	return this.rbo;
};

FBO.prototype.erase = function(){
	if(this.rbo !== null){
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboId);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, this.rboAttachment, gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.deleteFramebuffers(this.fboId);
};
