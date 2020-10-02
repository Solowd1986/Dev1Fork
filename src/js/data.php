<?php


require_once realpath('../../vendor/autoload.php');
require_once realpath('php/functions/functions.php');


$passedData = [
    "login" => "",
    "email" => "logo@yaw.ru",
    "psw" => 1234,
    "name" => "stan",
];


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    if (empty($_POST)) {
        print "empty arr\n";
    }

    function jsonEncodeData($data, $add = [])
    {
        return json_encode(array_merge($data, $add));
    }

    if (isset(getallheaders()["Data-Type"])) {

        //var_dump_pre($_POST);
        //print jsonEncodeData(["name" => "gill"], $_POST);


        $sanitizedPost = \php\auth\helpers\DataSanitizeHelper::run($_POST);
        $res = \php\auth\UserRegistration::checkUserRegistrationFields(\php\auth\helpers\DataSanitizeHelper::run($passedData));
        $tokenData = [
            "tokenName" => "auth",
            "uid" => 34467,
            "allowed" => true,
            "path" => "/",
            "tokenId" => "sdf657gfhytutyutyu",
            "name" => "Bob",
            "role" => "user",
            "expires" => (time() + 3600) * 1000,
            "max-age" => 3600
        ];

        //print UserToken::packedData($tokenData);
        $responce["errors"] = [];
        if (!empty(\php\auth\UserRegistration::checkUserRegistrationFields(\php\auth\helpers\DataSanitizeHelper::run($passedData)))) {
            $responce["errors"]["registrationFormErrors"] = \php\auth\UserRegistration::checkUserRegistrationFields(\php\auth\helpers\DataSanitizeHelper::run($passedData));
        }
        print json_encode($responce);
    }
    
    if (isset($_POST["auth-submit"])) {
        print "post from auth-submit";
        
    }
}



if ($_SERVER["REQUEST_METHOD"] == "GET") {

    if (isset(getallheaders()["User-Exit"])) {
        $name = getallheaders()["User-Exit"];
        setcookie($name, "", time() - 3600, "/");
    }


    if (array_key_exists('id', $_GET)) {
        print json_encode(array_merge(["responce" => true], apache_request_headers()));
    } else {

        print json_encode(array_merge(["responce" => true], apache_request_headers()));

    }
}


if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    if (array_key_exists('id', $_GET)) {
        print false;
        //print "data with id = " . $_GET['id'] . " deleted";
    }
}