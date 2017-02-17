<?php
    require_once("config.php");
    $pdo = new PDO("mysql:dbname=$DB_NAME;host=$DB_HOST", $DB_USER, $DB_PASS);

    if ($_GET["query"] === "client") {

    } else if ($_GET["query"] === "log") {

    }
?>