<?php 
/**
*** chelleventurina - https://github.com/chelleventurina
**/
if ( isset($_POST['Submit'] ) ) {
	$name = $_POST['name'];
	echo 'Hello ' . $name . '!';
}	
?>

<!DOCTYPE html>
<html>
<head>
	<title>Hello World in PHP</title>
</head>
<body>
	<form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
		<div class="form-group">
			<label>Enter your Name: </label>
			<input type="text" name="name" />
		</div>
		<input type="submit" name="Submit" value="Submit">
	</form>
</body>
</html>