<?php

//header('Content-Type: application/json');


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    print json_encode([
        "name" => "bob",
        "age" => 21
    ]);
}

$host = '127.0.0.1';
$db   = 'site';
$user = 'root';
$pass = '1234';
$charset = 'utf8';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opt = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = new PDO($dsn, $user, $pass, $opt);


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $res = $pdo->query("SELECT * FROM users")->fetchAll(\PDO::FETCH_ASSOC);


    if (array_key_exists('id', $_GET)) {
        //print $_GET['id'];
         print json_encode($res);

    } else {
        print json_encode($res);

//        print json_encode([
//            "name" => "bob",
//            "age" => 21
//        ]);
    }
}


if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    if (array_key_exists('id', $_GET)) {
        print "data with id = " . $_GET['id'] . " deleted";
    }
}