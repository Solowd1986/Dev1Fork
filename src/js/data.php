<?php

//header('Content-Type: application/json');
//print json_encode([
//    "name" => "bob",
//    "age" => 21
//]);


class Db
{
    private static $host = "127.0.0.1";
    private static $db = "site";
    private static $user = "root";
    private static $psw = 1234;
    private static $charset = "utf8";

    private static $pdo;

    private function __construct() {}
    private function __clone() {}

    public static function connectDb()
    {
        if (empty(self::$pdo)) {
            $opt = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            self::$pdo = new \PDO("mysql:host=localhost;dbname=test",self::$user,self::$psw, $opt);
        }
        return self::$pdo;
    }
}







if ($_SERVER["REQUEST_METHOD"] == "POST") {

    print json_encode($_POST);
    //print false;


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
         //print json_encode($res);
         //print json_encode($_SERVER['HTTP_AUTH2']);
         print json_encode(apache_request_headers());



    } else {
        //$res["res"] = 12;
        //array_push($res, ["success" => true]);

        print json_encode($res);
        //print false;

        //var_dump($res);

//        print json_encode([
//            "name" => "bob",
//            "age" => 21
//        ]);
    }
}


if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    if (array_key_exists('id', $_GET)) {
        print false;
        //print "data with id = " . $_GET['id'] . " deleted";
    }
}