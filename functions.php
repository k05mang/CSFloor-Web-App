<?php 
	function updateDatabase($dir, $db){
		$model = null;
		$mats = null;
		foreach(new RecursiveDirectoryIterator($dir) as $child){
			if($child->isDir()){
				updateDatabase($child, $db);
			}else{
				// echo "<p>".$child->getPathname()."</p>";
				if(strpos($child->getPathname(), ".csbin") !== FALSE){
					$model = $child->getPathname();
				}else{
					$mats = $child->getPathname();
				}
				
				if($model && $mats){
					$size = filesize($child->getPathname());
					$result = $db->query("SELECT meshId FROM Meshes WHERE fileName='$model' AND materialName='$mats'");
					// var_dump($result);
					$data = $result->fetch_array(MYSQL_ASSOC);
					// var_dump($data);
					if(!$data){
						$db->query("INSERT INTO Meshes VALUES (DEFAULT, '$model', '$mats', 0, 0, $size)");
					}else{
						$db->query("UPDATE Meshes SET fileSize=$size WHERE fileName='$model' AND materialName='$mats'");
					}
					return;
				}
			}
		}
	}
	
	function getDirSize($dir){
		$size = 0;
		foreach(new RecursiveDirectoryIterator($dir) as $child){
			if($child->isDir()){
				 $size += getDirSize($child);
			}else{
				$size += filesize($child->getPathname());
			}
		}
		return $size;
	}
?>