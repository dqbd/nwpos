<?php
    require_once("config.php");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    $pdo = new PDO("mysql:dbname=$DB_NAME;host=$DB_HOST", $DB_USER, $DB_PASS);
    $RESULT = ["result" => false];

    if (empty($_GET["query"])) {
        exit();
    }

    if ($_GET["query"] == "generate") {
        $RESULT = ["result" => true, "data" => uniqid()];
    } else if ($_GET["query"] == "clients") {
        $query = $pdo->prepare("SELECT server_id FROM logs GROUP BY server_id");
        $status = $query->execute();
        $rows = $query->fetchAll(PDO::FETCH_ASSOC);

        $RESULT = ["result" => $status, "data" => $rows];
    } else if ($_GET["query"] == "log" && !empty($_GET["id"])) {

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $file = file_get_contents('php://input');
            $payload = json_decode($file, true);

            $query = $pdo->prepare("INSERT INTO logs (server_id, process, content) VALUE (:server_id, :process, :content)");

            $query->bindParam(":server_id", $_GET["id"]);
            $query->bindParam(":process", $payload["process"]["name"]);
            $query->bindParam(":content", $payload["data"]);

            $RESULT = ["result" => $query->execute()];
        } else if (!empty($_GET["date"]) && is_numeric($_GET["date"])) {
            $query = $pdo->prepare("SELECT * FROM logs WHERE UNIX_TIMESTAMP(date) >= :timestamp AND server_id = :server_id ORDER BY date DESC");
            $date = intval($_GET["date"]);
            $query->bindParam(":timestamp", $date);
            $query->bindParam(":server_id", $_GET["id"]);

            $result = $query->execute();

            if ($result) {
                $rows = $query->fetchAll(PDO::FETCH_ASSOC);
                $RESULT = ["result" => true, "data" => $rows];
            } else {
                $RESULT = ["result" => false];
            }
        }
    } else if ($_GET["query"] == "actions" && !empty($_GET["id"])) {

        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            $file = file_get_contents('php://input');
            $payload = json_decode($file, true);

            $query = $pdo->prepare("INSERT INTO actions (server_id, action, arguments) VALUE (:server_id, :action, :arguments)");

            $query->bindParam(":server_id", $_GET["id"]);
            $query->bindParam(":action", $payload["action"]);
            $query->bindParam(":arguments", $payload["arguments"]);

            $RESULT = ["result" => $query->execute()];

        } else if (is_numeric($_GET["date"])) {
            $query = $pdo->prepare("SELECT * FROM actions WHERE UNIX_TIMESTAMP(date) >= :timestamp AND server_id = :server_id ORDER BY date DESC");

            $date = intval($_GET["date"]);
            $query->bindParam(":timestamp", $date);
            $query->bindParam(":server_id", $_GET["id"]);

            $result = $query->execute();

            if ($result) {
                $rows = $query->fetchAll(PDO::FETCH_ASSOC);
                $RESULT = ["result" => true, "data" => $rows, "date" => $date];
            } else {
                $RESULT = ["result" => false];
            }
        }
        
    }

    echo json_encode($RESULT);
?>