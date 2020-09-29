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


    public static function delete($id, $table) {
        $pdo = DB::connectDb()->prepare("DELETE FROM $table WHERE id={$id}");
        $pdo->execute();
        return $pdo->rowCount();
    }

}




class UserAuth {
    public static function generatePsw($psw) {
        return password_hash($psw, PASSWORD_DEFAULT);
    }

    public static function verifyPsw($psw, $hash) {
        return password_verify($psw, $hash);
    }

    public static function restorePsw($userId) {

    }
}


class UserToken {
    private static $sign_key = "4za84A3R9MJ3H4hh";
    private static $key_separator = "|";

    public static function sign($data) {
        return hash("sha256", serialize($data) . self::$sign_key);
    }

    public static function packedData($data) {
        return base64_encode(json_encode($data)) . self::$key_separator . self::sign($data);
    }

    public static  function verifyUserData($data, $sign) {
        return (explode("|", $data)[1] === $sign) ? json_decode(base64_decode(explode("|", $data)[0]), true) : false;
    }
}



/*
function var_dump_pre($mixed = null) {
    echo '<pre>';
    print_r($mixed);
    echo '</pre>';
    return null;
}


$solt = "dsf943nmdjf89345fdtger";
const PSW_SEPARATOR = "|";

$user = [
    "uid" => 34467,
    "role" => "user",
    "expire" => time() + 3600
];

function sign($data, $solt) {
    return hash("sha256", serialize($data) . $solt);
}

$token_sign = sign($user, $solt);


function packedData($data, $solt) {
    return base64_encode(json_encode($data)) . PSW_SEPARATOR . sign($data, $solt);
}

$res = packedData($user, $solt);
echo "<p style='margin: 30px auto;text-align: center; font-size: 20px;'>packedData - " . $res . "</p>";



function verifyUserData($data, $sign) {
    if (explode("|", $data)[1] === $sign) {
        $userData = json_decode(base64_decode(explode("|", $data)[0]), true);
        var_dump_pre($userData);
    }
}

verifyUserData($res, $token_sign);

echo "<p style='text-align: center; padding: 10px'>
        <a style='padding: 10px; font-size: 20px; background-color: red; color: white; border-radius: 5px;' href='/dist'>Back</a>
      </p>";

*/
const PSW_SEPARATOR = "|";






if ($_SERVER["REQUEST_METHOD"] == "POST") {


    function var_dump_pre($mixed = null)
    {
        echo '<pre>';
        print_r($mixed);
        echo '</pre>';
        return null;
    }


    //var_dump($_REQUEST);
    if (empty($_POST)) {
        print "empty arr\n";
    }

    function jsonEncodeData($data, $add = []) {
        return json_encode(array_merge($data, $add));
    }

    if (isset(getallheaders()["Data-Type"])) {

        //var_dump_pre($_POST);
        //print jsonEncodeData(["name" => "gill"], $_POST);
        $tokenData = [
            "tokenName" => "auth",
            "uid" => 34467,
            "path" => "/",
            "tokenId" => "sdf657gfhytutyutyu",
            "name" => "Bob",
            "role" => "user",
            "expires" => (time() + 3600) * 1000,
            "max-age" => 3600
        ];
        print UserToken::packedData($tokenData);
    }


    if (isset($_POST["auth-submit"])) {

        print 12;



        //var_dump_pre($_POST);

        $solt = "dsf943nmdjf89345fdtger";

        $user = [
            "uid" => 34467,
            "role" => "user",
            "expire" => time() + 3600
        ];

        function sign($data, $solt)
        {
            return hash("sha256", serialize($data) . $solt);
        }

        $token_sign = sign($user, $solt);


        function packedData($data, $solt)
        {
            return base64_encode(json_encode($data)) . PSW_SEPARATOR . sign($data, $solt);
        }

        $res = packedData($user, $solt);
        //echo "<p style='margin: 30px auto;text-align: center; font-size: 20px;'>packedData - " . $res . "</p>";


        function verifyUserData($data, $sign)
        {
            if (explode("|", $data)[1] === $sign) {
                $userData = json_decode(base64_decode(explode("|", $data)[0]), true);
                var_dump_pre($userData);
            }
        }

        //verifyUserData($res, $token_sign);

        if (isset($_POST["login"]) && isset($_POST["psw"])) {
            if ($_POST["login"] === "bob") {
                //print hash("sha256", "data");
            }
        }


//        echo "<p style='text-align: center; padding: 10px'>
//        <a style='padding: 10px; font-size: 20px; background-color: red; color: white; border-radius: 5px;' href='/dist'>Back</a>
//      </p>";
    }

//    } else {
//        //print json_encode($_POST);
//        //print 1222;
//        print json_encode(
//            array_merge(
//                [
//                    "responce" => true,
//                    "tokenTitle" => "token",
//                    "tokenId" => "df54tergfery456",
//                    "tokenExpire" => (time() * 1000) + 3600], $_POST));
//
//
//    }

    //var_dump($_POST);
    //print json_encode($_POST);
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


//sleep(4);

if ($_SERVER["REQUEST_METHOD"] == "GET") {

//    if(isset($_COOKIE["auth"])) {
//        setcookie('auth', "", time()-3600, '/');
//        unset($_COOKIE['auth']);
//    }

    $res = $pdo->query("SELECT * FROM users")->fetchAll(\PDO::FETCH_ASSOC);

    if (isset(getallheaders()["User-Exit"])) {
        $name = getallheaders()["User-Exit"];
        setcookie($name, "", time() - 3600, "/");
    }


    if (array_key_exists('id', $_GET)) {
        //print $_GET['id'];
         //print json_encode($res);
         //print json_encode($_SERVER['HTTP_AUTH2']);
         print json_encode(array_merge(["responce" => true] ,apache_request_headers()));
    } else {
        //$res["res"] = 12;
        //array_push($res, ["success" => true]);
        print json_encode(array_merge(["responce" => true] ,apache_request_headers()));

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