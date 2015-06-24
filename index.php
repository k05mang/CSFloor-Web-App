<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		<!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
		Remove this if you use the .htaccess -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

		<title>Siena Computer Science department</title>
		<meta name="CS Floor">
		<meta name="Kevin Mango">

		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<?php 
			require("shaders/forward.html");
			require("shaders/shadow.html");
			require("shaders/geoPass.html");
			require("shaders/stencilPass.html");
			require("shaders/lightPass.html");
			require("shaders/finalPass.html"); 
		?>
		
		<script src="engine/glMath/Vec2.js"></script>
		<script src="engine/glMath/Vec3.js"></script>
		<script src="engine/glMath/Vec4.js"></script>
		
		<script src="engine/glMath/Mat2.js"></script>
		<script src="engine/glMath/Mat3.js"></script>
		<script src="engine/glMath/Mat4.js"></script>
		
		<script src="engine/glMath/MatrixUtil.js"></script>
		<script src="engine/glMath/Quaternion.js"></script>
		<script src="engine/glMath/VecUtil.js"></script>
		
		<script src="libraries/jshashtable-3.0.js"></script>
		
		<script src="engine/core/Camera.js"></script>
		<script src="engine/core/Uniform.js"></script>
		<script src="engine/core/ShaderProgram.js"></script>
		
		<script src="engine/primitives/Vertex.js"></script>
		<script src="engine/primitives/Triangle.js"></script>
		<script src="engine/collision/AABB.js"></script>
		<script src="engine/primitives/Torus.js"></script>
		<script src="engine/primitives/Plane.js"></script>
		<script src="engine/primitives/Cone.js"></script>
		<script src="engine/primitives/Sphere.js"></script>
		
		<script src="engine/renderers/Texture.js"></script>
		<script src="engine/ModelLoaders/Material.js"></script>
		<script src="engine/ModelLoaders/SMDModel.js"></script>
		
		<script src="engine/core/SpotLight.js"></script>
		<script src="engine/core/PointLight.js"></script>
		<script src="engine/renderers/FBO.js"></script>
		<script src="engine/core/GBuffers.js"></script>
		
		
		<style>
			body, html { 
		        width: 100%;
		        height: 100%;
		        border: 0px;
		        padding: 0px;
		        margin: 0px;
		        bottom: 0px;
		        overflow: hidden;
	        }
	       
			#glcanvas{
				width: 100%;
				height: 100%;
				margin: 0px;
				padding: 0px;
				border: 0px;
				bottom: 0px;
			}
			
			#loadingBar{
				width: 75%;
				position: absolute;
				top: 50%;
				left: 12.5%;
			}
			
			#data-span{
				position: absolute;
				top: 47%;
				left: 12.5%;
			}
			
			#instruction_div{
				width: 100%;
				height: 10%;
				background-color: rgba(0,0,0,.3);
				color: white;
				position: absolute;
				top: -10%;
				left: 95%;
				border-radius: 10px;
			}
			
			.icon-info{
				/*margin-left: 1.1%;*/
				margin-top: 20%;
			}
			
			.icon-group{
				margin-left: 1em;
				height: 100%;
			}
			
			div{
				display: inline-block;
			}
			
			#icon-7{
				width: 53px;
				height: 53px;
			}
		</style>
		
		<script>
			var gl = null, 
				canvas, 
				isSupported = false;
				
			//extension variables
			var vaoEXT = null;
			var drawBufferEXT = null;
			var depthTexEXT = null;
			var floatTex = null;
			var floatLinear = null;
			  
			try {
				canvas = document.createElement("canvas");
				canvas.setAttribute("width", window.innerWidth);
				canvas.setAttribute("height", window.innerHeight);
				// Try to grab the standard context. If it fails, fallback to experimental.
				gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			}catch(e){
			  	
			}
			  
			// If we don't have a GL context, give up now
			if (!gl) {
				alert("Unable to initialize WebGL. Your browser may not support it or may have it disabled.");
				gl = null;
			}
				
			if(gl){
				vaoEXT = gl.getExtension('OES_vertex_array_object') ||
				                 gl.getExtension('MOZ_OES_vertex_array_object') ||
				                 gl.getExtension('WEBKIT_OES_vertex_array_object');  
				                     
				drawBufferEXT = gl.getExtension('WEBGL_draw_buffers') ||
				                 gl.getExtension('MOZ_WEBGL_draw_buffers') ||
				                 gl.getExtension('WEBKIT_WEBGL_draw_buffers');  
				                     
				depthTexEXT = gl.getExtension('WEBGL_depth_texture') ||
				                 gl.getExtension('MOZ_WEBGL_depth_texture') ||
				                 gl.getExtension('WEBKIT_WEBGL_depth_texture'); 
				                     
				floatTex = gl.getExtension('OES_texture_float') ||
				                 gl.getExtension('MOZ_OES_texture_float') ||
				                 gl.getExtension('WEBKIT_OES_texture_float');  
				                     
				floatLinear = gl.getExtension('OES_texture_float_linear') ||
				                 gl.getExtension('MOZ_OES_texture_float_linear') ||
				                 gl.getExtension('WEBKIT_OES_texture_float_linear');
				                 
				isSupported = drawBufferEXT && depthTexEXT && floatTex && floatLinear;
				if(!isSupported){
					window.stop();
					var errorMsg = "Your computer doesn't seem to support the following extensions needed to run this application:\n";
					if(!drawBufferEXT){
						errorMsg += "-draw buffers\n";
					}
					if(!depthTexEXT){
						errorMsg += "-depth texture\n";
					}
					if(!floatTex){
						errorMsg += "-floating point texture\n";
					}
					if(!floatLinear){
						errorMsg += "-floating texture linear filter\n";
					}
					errorMsg += "These issues are related to your graphics card hardware capabilities or outdated graphics card drivers";
					alert(errorMsg);
				}
			}
  			
		</script>
	</head>
	
	<body>
		<div id="instruction_div">
			<div class="icon-group">
				<img src="keyboardIcons/i.svg" id="icon-1" class="icon-info"/>
				<!-- <span class="button-text">Info</span> -->
			</div>
			<div class="icon-group">
				<img src="keyboardIcons/w.svg" id="icon-2"/>
				<span>Forward</span>
				<img src="keyboardIcons/a.svg" id="icon-3"/>
				<span>Left</span>
				<img src="keyboardIcons/s.svg" id="icon-4"/>
				<span>Back</span>
				<img src="keyboardIcons/d.svg" id="icon-5"/>
				<span>Right</span>
			</div>
			<div class="icon-group">
				<img src="keyboardIcons/q.svg" id="icon-6"/>
				<span>Toggle Pointer</span>
			</div>
			<div class="icon-group">
				<img src="keyboardIcons/mouse_icon.svg" id="icon-7"/>
				<span>Move camera after pointer is invisible</span>
			</div>
		</div>
			<?php 
				require("functions.php");
				$dirSize = getDirSize("assets");
				$imageDirSize = getDirSize("assets/textures");
				echo "<span id='data-span'>Loading digital assets, models, textures, ect...</span>";
				echo "<progress id='loadingBar' value=0 max=".$dirSize."></progress>";//<span id='loadPercent'>60%</span>
			?>
		  <?php
			  function retrieveTextures($dir){
					$files = array();
					foreach(new RecursiveDirectoryIterator($dir) as $child){
						if($child->isDir()){
							 $files = array_merge($files, retrieveTextures($child));
						}else{
							$files[] = $child->getPathname();
						}
					}
					return $files;
				}
			  foreach(retrieveTextures("assets/textures/") as $image){
			  	$texturename = substr($image, strripos($image, "/")+1);
				$size = filesize($image);
				//change this to be an onprogress event instead
			  	echo "<img id='$texturename' src='$image' hidden onload='updateProgress($size)'>";
			  }
		  ?>
	</body>
	<script>
		var progress = document.getElementById("loadingBar");
		var instructionBar = document.getElementById("instruction_div");
		<?php
			echo "var imagesSize=$imageDirSize;";
		?>
		function updateProgress(amtLoaded){
	  	  	progress.value += amtLoaded;
	  	  	if(progress.value >= imagesSize){
	  	  		startProgram();
	  	  	}
		}
		
		function startProgram(){
			launch();
		}
	</script>
	<script src="main.js"></script>
</html>
