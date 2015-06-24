<?php 
	require "functions.php";

	if($_POST["updateDatabase"]){
		$db = my_connect();
		//echo $db;
		updateDatabase("assets/models/", $db);
		$db->close();
	}else if($_GET["getMeshes"]){
		$db = my_connect();
		$result = $db->query("SELECT * FROM Meshes");
		$meshes = array();
		while($row = $result->fetch_array(MYSQL_ASSOC)){
			$curMesh = array();
			foreach($row as $meshField){
				$curMesh[] = $meshField;
			}
			//array for holding all the spatial data for this mesh
			$spatialData = array();
			//get all the spatial data associated with this mesh
			$spatialResult = $db->query("SELECT 
			orientX, 
			orientY, 
			orientZ, 
			posX,
			posY,
			posZ
			from `Spatial Data`
			where meshId=".$row["meshId"]);
			//compact it into a separate array then append this array to the end of the current mesh array
			while($spatialRow = $spatialResult->fetch_array(MYSQL_ASSOC)){
				$curSpatial = array();
				foreach($spatialRow as $spaceData){
					$curSpatial[] = $spaceData;
				}
				$spatialData[] = $curSpatial;
			}
			$meshes[] = array($curMesh, $spatialData);
		}
		echo json_encode($meshes);
		$db->close();
	}else if($_GET["getLights"]){
		$db = my_connect();
		$result = $db->query("SELECT * FROM lights");
		$lights = array();
		while($row = $result->fetch_array(MYSQL_ASSOC)){
			$curLight = array();
			foreach($row as $lightField){
				$curLight[] = $lightField;
			}
			$lights[] = $curLight;
		}
		echo json_encode($lights);
		$db->close();
	}
	
?>