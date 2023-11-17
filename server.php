<?php
$obj = json_decode(file_get_contents("php://input"), true);
echo print_r($obj[email], true);