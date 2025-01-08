<?php
header('Content-Type: application/json');
$apiUrl = "https://api.exchangerate.host/symbols";
$response = file_get_contents($apiUrl);

if ($response) {
    echo $response;
} else {
    echo json_encode(["error" => "Unable to fetch currencies"]);
}
?>
