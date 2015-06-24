
function Material(diffuse, normal, bump, specular, occlusion, specPower, specIntensity){
     
     this.diffuse = null;
     this.normal = null;
     this.bump = null;
     this.specular = null;
     this.occlusion = null;
     
     if(diffuse.indexOf("png") > -1){
        this.diffuse = allTextures.get(diffuse);
     }else{
        var values = diffuse.split(new RegExp("(?:\\s*|\\t*)*,(?:\\s*|\\t*)*" , "g"));
        this.diffuse = new Vec3(
            parseFloat(values[0])/255,
            parseFloat(values[1])/255,
            parseFloat(values[2])/255
        );
     }
     
     if(normal !== null){
        this.normal = allTextures.get(normal);
     }
     
     if(bump !== null){
         this.bump = allTextures.get(bump);
     }
     
     if(specular !== null){
         this.specular = allTextures.get(specular);
     }
     
     if(occlusion !== null){
         this.occlusion = allTextures.get(occlusion);
     }
     this.specPower = specPower;
     this.specInt = specIntensity;
}
	
// Material.prototype.equals = function(material){
	// if(material instanceof Material){
		// return materialName === material.materialName;
	// }else{
		// return false;
	// }
// };
	
// Material.prototype.hashCode = function(){
	// return this.materialName;
// };
	
// Material.prototype.getNumTextures = function(){
	// return this.numTextures;
// };
	
//-------binding and unbinding diffuse texture
Material.prototype.bindDiffuse = function(texUnit){
    if(this.diffuse instanceof Texture){
        this.diffuse.bind(texUnit);
    }
};

Material.prototype.unbindDiffuse = function(){
    if(this.diffuse instanceof Texture){
        this.diffuse.unbind();
    }
};

Material.prototype.bindColor = function(shader, colorVar){
    if(this.diffuse instanceof Vec3){
        shader.setUniform(colorVar, this.diffuse.asBuffer());
    }
};

//-------binding and unbinding normal texture
Material.prototype.bindNormal = function(texUnit){
    if(this.normal !== null){
        this.normal.bind(texUnit);
    }
};

Material.prototype.unbindNormal = function(){
    if(this.normal !== null){
        this.normal.unbind();
    }
};

//-------binding and unbinding bump texture
Material.prototype.bindBump = function(texUnit){
    if(this.bump !== null){
        this.bump.bind(texUnit);
    }
};

Material.prototype.unbindBump = function(){
    if(this.bump !== null){
        this.bump.unbind();
    }
};

//-------binding and unbinding specular texture
Material.prototype.bindSpecular = function(texUnit){
    if(this.specular !== null){
        this.specular.bind(texUnit);
    }
};

Material.prototype.unbindSpecular = function(){
    if(this.specular !== null){
        this.specular.unbind();
    }
};

//-------binding and unbinding occlusion texture
Material.prototype.bindOcclusion = function(texUnit){
    if(this.occlusion !== null){
        this.occlusion.bind(texUnit);
    }
};

Material.prototype.unbindOcclusion = function(){
    if(this.occlusion !== null){
        this.occlusion.unbind();
    }
};


Material.prototype.getSpecPower = function(){
    return this.specPower;
};

Material.prototype.getSpecIntensity = function(){
    return this.specInt;
};

/**
 * Deletes the textures associated with this material object from the graphics card
 */
Material.prototype.erase = function(){
	for(var tex = 0; tex < this.textures.length; tex++){
	    this.textures[tex].erase();
	}
};

var MaterialUtils = {
    genMaterials: function(matName){
                    var request = new XMLHttpRequest();
                    request.open("POST", matName, false);
                    
                    var receivedData = null;
                    request.onload = function (oEvent) {
                      receivedData = request.response; 
                    };
                    
                    request.send();
                    var materials = [];
                    
                    var txtlines = receivedData.split('\n');
                    
                    
                    
                    for(var current = 1; current < txtlines.length; current++){
                        var curLine = txtlines[current];//move up by 1 so that we don't read the filename  
                        
                        var diffuse = null,
                        normal = null,
                        bump = null,
                        specular = null,
                        occlusion = null;
                        var specPower = 0.0, specIntensity = 0.0;
                        
                        while(current < txtlines.length && curLine.indexOf('&') < 0){
                            //some lines may have multiple pairings listed delimited by ;
                            var pairs = curLine.split(new RegExp("(?:\\s*|\\t*)*;(?:\\s*|\\t*)*" , "g"));
                            //iterate over all the pairings on the current line and check them, subtract 1 so that we don't parse the empty string pair
                            for(var curPair = 0; curPair < pairs.length-1; curPair++){
                                var pair = pairs[curPair].split(new RegExp("(?:\\s*|\\t*)*:(?:\\s*|\\t*)*" , "g"));
                                switch (pair[0].trim().toLowerCase()) {
                                    case "diffuse":
                                        diffuse = pair[1].trim();
                                        if(diffuse === ""){
                                            diffuse = null;
                                        }
                                        break;
                                    case "normal":
                                        normal = pair[1].trim();
                                        if(normal === ""){
                                            normal = null;
                                        }
                                        break;
                                    case "bump":
                                        bump = pair[1].trim();
                                        if(bump === ""){
                                            bump = null;
                                        }
                                        break;
                                    case "specular":
                                        specular = pair[1].trim();
                                        if(specular === ""){
                                            specular = null;
                                        }
                                        break;
                                    case "occlusion":
                                        occlusion = pair[1].trim();
                                        if(occlusion === ""){
                                            occlusion = null;
                                        }
                                        break;
                                    case "specular power":
                                        if(pair[1].trim() !== ""){
                                            specPower = parseFloat(pair[1].trim());
                                        }
                                        break;
                                    case "specular intensity":
                                        if(pair[1].trim() !== ""){
                                            specIntensity = parseFloat(pair[1].trim());
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            current++;
                            curLine = txtlines[current];
                        }
                        current++;
                        materials.push(new Material(diffuse, normal, bump, specular, occlusion, specPower, specIntensity));
                    }
                    
                    return materials;
                 }
};
