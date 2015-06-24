
//debug geometry
var diffuse, normals, position, light; 

var camera;
var pause = false;
var strafe = 10;
var move = 10;
var wHeld = false, aHeld = false, sHeld = false, dHeld = false, shiftHeld = false, eHeld = false;

//global application variables
var allTextures;
var allMeshes, meshHash;
var shaders = new Hashtable();
// var spotLight;
var shadowFBO;
var gBuf;
var lights;
var userAABB;
var showInstruction = true;
var boundingBoxes;


function launch(){
    // var extensions = gl.getSupportedExtensions();
    // for(var ext = 0; ext < extensions.length; ext++){
        // console.log(extensions[ext]);
    // }
                         
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    
    shaders.put("main", new ShaderProgram(["verts", "frags"]));
    shaders.put("shadow", new ShaderProgram(["shadowVert", "shadowFrag"]));
    shaders.put("geoPass", new ShaderProgram(["geoVert", "geoFrag"]));
    shaders.put("stencilPass", new ShaderProgram(["stencilVert", "stencilFrag"]));
    shaders.put("lightPass", new ShaderProgram(["lightVert", "lightFrag"]));
    shaders.put("finalPass", new ShaderProgram(["finalVert", "finalFrag"]));
    
    //initialize hashtable for all textures
    allTextures = new Hashtable();
    meshHash = new Hashtable();
    allMeshes = [];
    
    loadTextures();
    
    camera = new Camera(0,25.5,0,0,-30, 45, canvas.width/canvas.height, .1, 4000);
    lights = [];
    loadLights();
    
    shadowFBO = new FBO();
    shadowFBO.bind();
    shadowFBO.setDrawBuffers(null);
    shadowFBO.unbind();
    
    // setupForwardRendering();
    setupForGeoPass();
    setupForStencilPass();
    setupForLightPass();
    setupForFinalPass();
    
    // diffuse = new Plane(canvas.width/8.0, canvas.height/8.0, 0, false);
    // normals = new Plane(diffuse);
    // position = new Plane(diffuse);
    // light = new Plane(diffuse);
    
    //reorient and translate debug geometry
    // diffuse.orient(1,0,0,-90);
    // diffuse.translate(-canvas.width/16.0,canvas.height/16.0,-300);
//     
    // normals.orient(1,0,0,-90);
    // normals.translate(-canvas.width/16.0,-canvas.height/16.0,-300);
//     
    // position.orient(1,0,0,-90);
    // position.translate(canvas.width/16.0,canvas.height/16.0,-300);
//     
    // light.orient(1,0,0,-90);
    // light.translate(canvas.width/16.0,-canvas.height/16.0,-300);
    //----------------------------------------------------------------debug geometry ends
    
    gBuf = new GBuffers(canvas.width, canvas.height);
    
    loadModels();
  	
  	//set up the bounding boxes for the collision detection
  	userAABB = new AABB(5,5,5);
  	userAABB.moveTo(camera.getEye());
  	
    boundingBoxes = [];
    
    var breimerwall = new AABB(13.458, 131.479, 443.683);
    breimerwall.translate(-214.53732, 47.11248, -94.91574);
    boundingBoxes.push(breimerwall);
    
    var breimerwalledge = new AABB(6.759, 131.479, 17.515);
    breimerwalledge.translate(-203.75305, 25.19931, -25.97379);
    boundingBoxes.push(breimerwalledge);
    
    var librarywall = new AABB(506.937, 131.479, 9.946);
    librarywall.translate(46.33586, 25.19931, 130.14342);
    boundingBoxes.push(librarywall);
    
    var librarywalledge = new AABB(32.622, 131.479, 11.584);
    librarywalledge.translate(208.33377, 25.19931, 121.13344);
    boundingBoxes.push(librarywalledge);
    
    var exitWall = new AABB(10, 131.479, 94.593);
    exitWall.translate(296.15155, 25.19931, -33.2352);
    boundingBoxes.push(exitWall);
    
    var exitWalldoors = new AABB(8.947, 131.479, 112.865);
    exitWalldoors.translate(302.46848, 25.19931, 70.49332);
    boundingBoxes.push(exitWalldoors);
    
    var ditursiwall = new AABB(159.924, 131.479, 21.326);
    ditursiwall.translate(212.6967, 25.19931, -89.68578);
    boundingBoxes.push(ditursiwall);
    
    var limwall = new AABB(148.248, 131.479, 12.187);
    limwall.translate(58.28246, 25.19931, -103.54028);
    boundingBoxes.push(limwall);
    
    var sinkwall = new AABB(19.161, 131.479, 217.515);
    sinkwall.translate(-6.2614, 25.19931, -207.99939);
    boundingBoxes.push(sinkwall);
    
    var windowwall = new AABB(191.291, 131.479, 16.376);
    windowwall.translate(-111.48721, 25.19931, -322.39465);
    boundingBoxes.push(windowwall);
  	
  	gl.clearColor(.5, .6, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.viewport(0,0,canvas.width, canvas.height);
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", keyboard);
    window.addEventListener("keyup", keyrelease);
    window.addEventListener("mousemove", mouse);
    lockPointer();//possibly add error callback
    renderShadows();
  	renderCallback();
}

function loadModels(){
    var meshRequest = new XMLHttpRequest();
    meshRequest.open("GET", "operations.php?getMeshes=true", false);
    var meshData = null;
    meshRequest.onload = function(){
        meshData = JSON.parse(meshRequest.response);
    };
    
    meshRequest.send();
    
    for(var curMesh = 0; curMesh < meshData.length; curMesh++){
        /* meshData[curMesh][0] = actual mesh data
         * meshData[curMesh][1] = mesh spatial array
         * 
         * mesh[0] = meshId
         * mesh[1] = path and file name
         * mesh[2] = path and mats name
         * mesh[3] = isReflective
         * mesh[4] = isTransparent
         * mesh[5] = fileSize
         * 
         * meshSpatialData[0] = orientX
         * meshSpatialData[1] = orientY
         * meshSpatialData[2] = orientZ
         * meshSpatialData[3] = posX
         * meshSpatialData[2] = posY
         * meshSpatialData[5] = posZ
         * 
         */
        var mesh = meshData[curMesh][0]; 
        var meshSpatialData = meshData[curMesh][1];
        // console.log(meshSpatialData);
        //look up value into the look up table for the meshes
        var model;
        var meshLookup = mesh[1].substring(mesh[1].lastIndexOf("/"));
        if(meshHash.get(meshLookup) === null){
            var hashModel = new SMDModel(mesh[1], 0, mesh[2], mesh[5]);
            meshHash.put(meshLookup, hashModel);
            model = new SMDModel(hashModel);
        }else{
            model = new SMDModel(meshHash.get(meshLookup));
        }
        
        if(meshSpatialData.length === 0){
            allMeshes.push(model);
        }else{
            for(var curSD = 0; curSD < meshSpatialData.length; curSD++){
                var currentSD = meshSpatialData[curSD];
                
                var copyModel = new SMDModel(model);
                //this orientation will likely need to be changed to account for axis differences between my system and blender
                copyModel.orient(
                    parseFloat(currentSD[0]),
                    -parseFloat(currentSD[2]),
                    parseFloat(currentSD[1])
                    );
                    
                    copyModel.translate(
                        parseFloat(currentSD[3]),
                        parseFloat(currentSD[5]),
                        -parseFloat(currentSD[4])
                    );
                
                allMeshes.push(copyModel);
            }
        }
    }
}

function loadTextures(){
    
    var textures = document.getElementsByTagName("img");
    for(var curText = 0; curText < textures.length; curText++){
        if(textures[curText].id.indexOf("icon") < 0){
            var textureName = textures[curText].id;
            var texture = new Texture(gl.TEXTURE_2D, textures[curText]);
            texture.setParam(gl.TEXTURE_WRAP_S, gl.REPEAT);
            texture.setParam(gl.TEXTURE_WRAP_T, gl.REPEAT); 
            texture.setParam(gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
            texture.genMipMaps();
            
            allTextures.put(textureName, texture);
        }  
    }
}

function loadLights(){
    var lightsRequest = new XMLHttpRequest();
    lightsRequest.open("GET", "operations.php?getLights=true", false);
    var lightData = null;
    lightsRequest.onload = function(){
        lightData = JSON.parse(lightsRequest.response);
    };
    
    lightsRequest.send();
    
    for(var curLight = 0; curLight < lightData.length; curLight++){
        /*
         * lightData[][0] = lightId
         * lightData[][1] = intensity
         * lightData[][2] = spot light angle/point light radius
         * lightData[][3] = x position
         * lightData[][4] = y position
         * lightData[][5] = z position
         * lightData[][6] = type
         * 
         */
        var light = lightData[curLight];
        // console.log(light);
        if(light[6] == 0){
            lights.push(
                new SpotLight(parseFloat(light[3]), parseFloat(light[5]), -parseFloat(light[4]), //position
                1, .92, .9,             //color
                parseFloat(light[2]),   //angle defining area of effect for light
                200,                    //length of light
                parseFloat(light[1]),   //intensity of the light
                2)                      //attenuation factor
                
                // new SpotLight(parseFloat(light[3]), parseFloat(light[5]), -parseFloat(light[4]), 1, .92, .9, 145, 200, .25, 2)
                );
            lights[curLight].genShadowMap();
        }else if(light[6] == 1){
            
            lights.push(new PointLight(parseFloat(light[3]), parseFloat(light[5]), -parseFloat(light[4])+7.5, //position
                                1, .92, .9,//color
                                parseFloat(light[2]),//light radius
                                parseFloat(light[2]),//light volume radius
                                parseFloat(light[1]),//intensity
                                4//attentuation
                                ));
                                
            lights.push(new PointLight(parseFloat(light[3]), parseFloat(light[5]), -parseFloat(light[4])-7.5, //position
                                1, .92, .9,//color
                                parseFloat(light[2]),//light radius
                                parseFloat(light[2]),//light volume radius
                                parseFloat(light[1]),//intensity
                                4//attentuation
                                ));
                                
            lights.push(new PointLight(parseFloat(light[3])+7.5, parseFloat(light[5]), -parseFloat(light[4]), //position
                                1, .92, .9,//color
                                parseFloat(light[2]),//light radius
                                parseFloat(light[2]),//light volume radius
                                parseFloat(light[1]),//intensity
                                4//attentuation
                                ));
                                
            lights.push(new PointLight(parseFloat(light[3])-7.5, parseFloat(light[5]), -parseFloat(light[4]), //position
                                1, .92, .9,//color
                                parseFloat(light[2]),//light radius
                                parseFloat(light[2]),//light volume radius
                                parseFloat(light[1]),//intensity
                                4//attentuation
                                ));
        }
    }
}

function setupForGeoPass(){
    var curShader = shaders.get("geoPass");
    curShader.bind();
    curShader.setUniform("proj", camera.getProjBuffer());
    curShader.setUniform("texture", 0);
    curShader.setUniform("normals", 1);
    curShader.setUniform("specMap", 2);
    curShader.unbind();
}

function setupForStencilPass(){
    var curShader = shaders.get("stencilPass");
    curShader.bind();
    curShader.setUniform("proj", camera.getProjBuffer());
    curShader.unbind();
}

function setupForLightPass(){
    var curShader = shaders.get("lightPass");
    curShader.bind();
    curShader.setUniform("proj", camera.getProjBuffer());
    curShader.setUniform("screenSpace", canvas.width, canvas.height);
    //set texture indices
    curShader.setUniform("position", 0);
    curShader.setUniform("normals", 1);
    curShader.setUniform("shadow", 2);
    // curShader.setUniform("depths", 2);
    curShader.unbind();
}

function setupForFinalPass(){
    var curShader = shaders.get("finalPass");
    curShader.bind();
    curShader.setUniform("screenSpace", canvas.width, canvas.height);
    curShader.setUniform("diffuse", 0);
    curShader.setUniform("light", 1);
    
    // curShader.bindAttribLoc(0, "vertex");
    // curShader.bindAttribLoc(2, "uvs");
    curShader.unbind();
}

function setupForwardRendering(){
    var curShader = shaders.get("main");
    curShader.bind();
    curShader.setUniform("proj", camera.getProjBuffer());
    curShader.setUniform("lightPos", spotLight.getPosBuffer());
    curShader.setUniform("color", .3, .1, .8);
    curShader.setUniform("image", 0);
    curShader.setUniform("shadowText", 1);
    curShader.setUniform("useTexture", false);
    
    //light uniforms
    curShader.setUniform("lightVPMat", spotLight.getCompositeBuffer());   
    curShader.setUniform("cutOff", spotLight.getCutOff());
    curShader.setUniform("atten", spotLight.getAttenuation());
    curShader.setUniform("intensity", spotLight.getIntensity());
    
    // curShader.bindAttribLoc(0, "vertex");
    // curShader.bindAttribLoc(1, "normal");
    // curShader.bindAttribLoc(2, "uv");
    curShader.unbind();
    
    //shader for the shadow rendering
    curShader = shaders.get("shadow");
    curShader.bind();
    
    curShader.setUniform("vpMat", spotLight.getCompositeBuffer());
    
    curShader.unbind();
}

function calculateMovement(){
    var speedMod = (shiftHeld ? 1 : .25);
    if(wHeld){
        camera.move(-move*speedMod);
        userAABB.moveTo(camera.getEye());
        //if there is a collision undo the last movement
        
        for(var curBox = 0; curBox < boundingBoxes.length; curBox++){
            if(userAABB.colliding(boundingBoxes[curBox])){
                camera.move(move*speedMod);
                userAABB.moveTo(camera.getEye());
                break;
            }
        }
    }
    
    if(aHeld){
        camera.strafe(-strafe*speedMod); 
        userAABB.moveTo(camera.getEye());
        //if there is a collision undo the last movement
        // if(userAABB.colliding(planeAABB)){
            // camera.strafe(strafe*speedMod); 
            // userAABB.moveTo(camera.getEye());
        // }  
        for(var curBox = 0; curBox < boundingBoxes.length; curBox++){
            if(userAABB.colliding(boundingBoxes[curBox])){
                camera.strafe(strafe*speedMod); 
                userAABB.moveTo(camera.getEye());
                break;
            }
        }
    }
    
    if(sHeld){
        camera.move(move*speedMod);
        userAABB.moveTo(camera.getEye());
        //if there is a collision undo the last movement
        // if(userAABB.colliding(planeAABB)){
            // camera.fly(-move*speedMod);
            // userAABB.moveTo(camera.getEye());
        // } 
        for(var curBox = 0; curBox < boundingBoxes.length; curBox++){
            if(userAABB.colliding(boundingBoxes[curBox])){
                camera.move(-move*speedMod); 
                userAABB.moveTo(camera.getEye());
                break;
            }
        }
    }
    
    if(dHeld){
        camera.strafe(strafe*speedMod);   
        userAABB.moveTo(camera.getEye());
        //if there is a collision undo the last movement
        // if(userAABB.colliding(planeAABB)){
            // camera.strafe(-strafe*speedMod); 
            // userAABB.moveTo(camera.getEye());
        // } 
        for(var curBox = 0; curBox < boundingBoxes.length; curBox++){
            if(userAABB.colliding(boundingBoxes[curBox])){
                camera.strafe(-strafe*speedMod); 
                userAABB.moveTo(camera.getEye());
                break;
            }
        }
    }
}

function renderCallback(){
    window.requestAnimationFrame(renderCallback);
    //code for computing movement and camera changes
    calculateMovement();
    
    gl.depthMask(true);
    gBuf.geomPass();
    renderGeo();
    gl.depthMask(false);//don't allow writing into the depth buffer
    
    gl.enable(gl.STENCIL_TEST);
    renderLights();
    gl.disable(gl.STENCIL_TEST);
    
    // gl.disable(gl.BLEND);
    // gl.enable(gl.CULL_FACE);
    // gl.enable(gl.DEPTH_TEST);
    // gl.cullFace(gl.BACK);

    shaders.get("finalPass").bind();
    gBuf.finish(gl.TEXTURE0, gl.TEXTURE1);
    shaders.get("finalPass").unbind();
    
    // gBuf.unbind();
    // renderDebug();
}

function renderGeo(){
    gl.viewport(0,0, canvas.width, canvas.height);
    var shader = shaders.get("geoPass");
    
    shader.bind();
    shader.setUniform("view", camera.getLookAt().asBuffer());
    
    
    shader.setUniform("useTexture", true);
    for(var curMesh = 0; curMesh < allMeshes.length; curMesh++){
        shader.setUniform("model", allMeshes[curMesh].getMatrixBuffer());
        shader.setUniform("nMatrix", allMeshes[curMesh].getNMatrixBuffer());
        allMeshes[curMesh].render(shader, gl.TEXTURE0,
            "color", "useTexture", 
            gl.TEXTURE1, "useNormal",
            gl.TEXTURE2, "useSpecular",
            null, null,
            "specPow", "specInten");
    }
    shader.setUniform("useTexture", false);
    shader.unbind();
}

function renderLights(){
    
    gBuf.bindForLight(gl.TEXTURE0, gl.TEXTURE1);
    var shader = shaders.get("stencilPass");
    shader.bind();
    shader.setUniform("view", camera.getLookAt().asBuffer());
    shader.unbind();
    
    shader = shaders.get("lightPass");
    shader.bind();
    shader.setUniform("view", camera.getLookAt().asBuffer());
    shader.setUniform("eye", camera.getEye().asBuffer());
    shader.unbind();
    
    for(var curLight = 0; curLight < lights.length; curLight++){
    // for(var curLight = lights.length-1; curLight > 0; curLight--){
        var currentLight = lights[curLight];
        shader = shaders.get("stencilPass");
        shader.bind();
        gBuf.stencilPass();
        currentLight.render(shader, "model");
        shader.unbind();
        
        // gl.clearColor(.35, .35, .35, 1.0);//clear to the ambient color to allow for more appropriate blending results
        gBuf.lightPass();
        
        shader = shaders.get("lightPass");
        shader.bind();
        if(currentLight.shadowMap !== null){
            currentLight.bindShadow(gl.TEXTURE2);
            shader.setUniform("useShadow", true);
        }else{
            shader.setUniform("useShadow", false);
        }
        shader.setUniform("intensity", currentLight.getIntensity());
        shader.setUniform("lightPos", currentLight.getPosBuffer());
        shader.setUniform("atten", currentLight.getAttenuation());
        shader.setUniform("lightColor", currentLight.getColorBuffer());
        
        if(currentLight instanceof SpotLight){
            shader.setUniform("cutOff", currentLight.getCutOff());
            shader.setUniform("lightVPMat", currentLight.getCompositeBuffer());
            shader.setUniform("radius", currentLight.getAttenRadius());
            shader.setUniform("isPointLight", false);
        }else{
            shader.setUniform("radius", currentLight.getRadius());
            shader.setUniform("isPointLight", true);
        }
        
        currentLight.render(shader, "model");
        shader.unbind();
    }
    
    gl.disable(gl.BLEND);//do this for every light
    gl.depthMask(true);
    gl.clearColor(.5, .6, 1.0, 1.0);
}

function renderDebug(){
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    var shader = shaders.get("main");
    shader.bind();
    shader.setUniform("view", camera.getLookAt().asBuffer());
    
    //diffuse
    gBuf.diffuse.bind(gl.TEXTURE0);
    shader.setUniform("useTexture", true);
    shader.setUniform("model", diffuse.getMatrixBuffer());
    shader.setUniform("nMatrix", diffuse.getNMatrixBuffer());
    diffuse.render();
    shader.setUniform("useTexture", false);
    gBuf.diffuse.unbind();
    
    //normals
    gBuf.normals.bind(gl.TEXTURE0);
    shader.setUniform("useTexture", true);
    shader.setUniform("model", normals.getMatrixBuffer());
    shader.setUniform("nMatrix", normals.getNMatrixBuffer());
    normals.render();
    shader.setUniform("useTexture", false);
    gBuf.normals.unbind();
    
    //position
    gBuf.position.bind(gl.TEXTURE0);
    shader.setUniform("useTexture", true);
    shader.setUniform("model", position.getMatrixBuffer());
    shader.setUniform("nMatrix", position.getNMatrixBuffer());
    position.render();
    shader.setUniform("useTexture", false);
    gBuf.position.unbind();
    
    //lighting
    lights[0].shadowMap.bind(gl.TEXTURE0);
    shader.setUniform("useTexture", true);
    shader.setUniform("model", light.getMatrixBuffer());
    shader.setUniform("nMatrix", light.getNMatrixBuffer());
    light.render();
    shader.setUniform("useTexture", false);
    lights[0].shadowMap.unbind();
    
    shader.unbind();
}

function renderShadows(){
    shadowFBO.bind();
    shadowFBO.setDrawBuffers(null);
    gl.viewport(0,0, 1024, 1024);
    var shader = shaders.get("shadow");
    shader.bind();
    
    for(var curLight = 0; curLight < lights.length; curLight++){
        var current = lights[curLight];
        if(current.shadowMap !== null){
            //attach current lights shadow texture
            shadowFBO.attachDepth(current.shadowMap);
            //clear the depth buffer for the texture
            gl.clear(gl.DEPTH_BUFFER_BIT);
            //render the scene
            shader.setUniform("vpMat", current.getCompositeBuffer());
    
            for(var curMesh = 0; curMesh < allMeshes.length; curMesh++){
                shader.setUniform("model", allMeshes[curMesh].getMatrixBuffer());
                allMeshes[curMesh].render();
            }
        }
    }
    shader.unbind();
    shadowFBO.unbind();
    gl.viewport(0,0, canvas.width, canvas.height);
}

function render(){
    
    gl.viewport(0,0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    var shader = shaders.get("main");
    
    shader.bind();
    spotLight.getShadowMap().bind(gl.TEXTURE1);
    shader.setUniform("view", camera.getLookAt().asBuffer());
    // shader.setUniform("eye", view.getEye().getAsBuffer());
    
    shader.setUniform("useTexture", true);
    shader.setUniform("color", .3, .2, .6);
    shader.setUniform("model", computer.getMatrixBuffer());
    shader.setUniform("nMatrix", computer.getNMatrixBuffer());
    computer.render(shader, gl.TEXTURE0);
    shader.setUniform("useTexture", false);
    
    shader.setUniform("color", .6, .2, .2);
    shader.setUniform("model", testTorus.getMatrixBuffer());
    shader.setUniform("nMatrix", testTorus.getNMatrixBuffer());
    testTorus.render();
    
    shader.setUniform("color", .8, .6, .5);
    shader.setUniform("model", shadowSurface.getMatrixBuffer());
    shader.setUniform("nMatrix", shadowSurface.getNMatrixBuffer());
    shadowSurface.render();
    
    spotLight.getShadowMap().unbind();
    shader.unbind();
    testTorus.orient(1,0,0,1);
}

function resize(){
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
    // var perspective = MatrixUtil.getPerspective(45, canvas.width/canvas.height, .01, 30000);
    camera.setProjection(45, canvas.width/canvas.height, .01, 30000);
    
    var curShader = shaders.get("main");
    curShader.bind();
    curShader.setUniform("proj", camera.getProjBuffer());
    curShader.unbind();
    gl.viewport(0,0,canvas.width, canvas.height);
}

function lockPointer(){
    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock ||
                            canvas.webkitRequestPointerLock;

    canvas.requestPointerLock();
}

function unlockPointer(){
    document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

    // Attempt to unlock
    document.exitPointerLock();
}

function keyboard(evt){
    switch(evt.keyCode){
        case 87://W
            wHeld = true;
            break;
        case 65://A
            aHeld = true;
            break;
        case 83://S
            sHeld = true;
            break;
        case 68://D
            dHeld = true;
            break;
        case 81://Q
            pause = !pause;
            pause ? unlockPointer() : lockPointer();
            //add a menu system for "pausing"
            break; 
        case 16://shift
            shiftHeld = true;
            break; 
        case 69://E
            // eHeld = true;
            // camera.getEye().print();
        case 73://I
            var translateSpeed = 10;
            var leftMin = 95;//max amount to the right the instruction bar can go
            var leftMax = 0;//max amount to the left the instruction bar can go
            if(showInstruction){
                // instructionBar.style.transform = showInstruct;
                //left is 95 when calling this
                var transformBar = function(left){
                    instructionBar.style.left = left+"%";
                    if(left !== leftMax){
                        window.setTimeout(transformBar, translateSpeed, left-5);
                    } 
                };
                window.setTimeout(transformBar, translateSpeed, leftMin-5);
            }else{
                // instructionBar.style.transform = hideInstruct;
                //left is 0 when calling this
                var transformBar = function(left){
                    instructionBar.style.left = left+"%"; 
                    if(left !== leftMin){
                        window.setTimeout(transformBar, translateSpeed, left+5);
                    } 
                };
                window.setTimeout(transformBar, translateSpeed, leftMax+5);
            }
            showInstruction = !showInstruction;
        break; 
    }
}

function keyrelease(evt){
    switch(evt.keyCode){
        case 87://W
            wHeld = false;
            break;
        case 65://A
            aHeld = false;
            break;
        case 83://S
            sHeld = false;
            break;
        case 68://D
            dHeld = false;
            break;
        case 16://shift
            shiftHeld = false;
            break;
        case 69://E
            eHeld = false;
        break; 
    }
}

function mouse(evt){
    var havePointerLock = document.pointerLockElement === canvas ||
          document.mozPointerLockElement === canvas ||
          document.webkitPointerLockElement === canvas;
    
    if(havePointerLock){
        var movementX = evt.movementX ||
          evt.mozMovementX          ||
          evt.webkitMovementX       ||
          0;
        var movementY = evt.movementY ||
          evt.mozMovementY      ||
          evt.webkitMovementY   ||
          0;
          camera.rotate(-movementX*.5);
          camera.lookY(-movementY*.5, true);
    }
}


