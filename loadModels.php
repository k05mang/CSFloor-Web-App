<?php 
	require "functions.php";
	$db = my_connect();
	//echo $db;
	updateDatabase("assets/models/", $db);
	$db->close();
?>