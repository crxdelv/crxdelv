<?php
$servername = "sql208.infinityfree.com";
$username = "if0_35696357";
$password = "OSrV2qOoC0";
$dbname = "if0_35696357_dlv";

header('Access-Control-Allow-Origin: *')
header('Content-Type: text/plain')

if ($_GET['process'] != '1') {
  die('400 Anti-inadvertent mode');
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("400 " . $conn->connect_error);
}

$id = $_GET['id'];
$title = $_GET['title'];
$description = $_GET['description'];
$topics = $_GET['topics'];
$date = $_GET['date'];

$sql = "INSERT INTO blogs (id, title, description, topics, date) VALUES ('$id', '$title', '$description', '$topics', '$date')";

if ($conn->query($sql) === TRUE) {
  echo "200";
} else {
  echo "404 " . $conn->error;
}

$conn->close();
?>