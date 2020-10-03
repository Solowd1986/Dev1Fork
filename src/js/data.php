<?php

/*
 * Пути для звпуска от папки dist
 */
require_once realpath('vendor/autoload.php');
require_once realpath('php/functions/functions.php');

/*
 * Пути для запуска скрипта самостоятельно, но нужно прописать новые пути автозагрузки
 * и вызвать php composer.phar dump-autoload
 * Пути для работы отдельного модуля:
 *  "php\\db\\": "src/js/php/db",
 *  "php\\auth\\": "src/js/php/auth",
 *  "php\\auth\\helpers\\": "src/js/php/auth/helpers"
 *
 *
 *  php composer.phar dump-autoload
 */

/*
require_once realpath('../../vendor/autoload.php');
require_once realpath('php/functions/functions.php');
*/



use \php\auth\helpers\UserToken as UserToken;
use \php\auth\UserRegistration as UserRegistration;
use \php\auth\helpers\DataSanitizeHelper as DataSanitizeHelper;



$passedData = [
    "login" => "bob",
    "email" => "lo1go@yaw.ru",
    "psw" => 1234,
];






if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    if (empty($_POST)) {
        print "empty arr\n";
    }

    if (isset(getallheaders()["Token-Status"])) {
        $token = $_POST["token"];
        if (UserToken::verifyUserData($token)) {
            var_dump_pre("Token solid");
        } else {
            var_dump_pre("Token wrong");
        }
    }


    if (isset(getallheaders()["Data-Type"])) {

        $sanitizedPost = DataSanitizeHelper::run($_POST);
        //var_dump($_POST);

        $tokenSuccess = [
            "result" => true,
            "tokenName" => "auth",
            "uid" => 34467,
            "allowed" => true,
            "path" => "/",
            "tokenId" => "sdf657gfhytutyutyu",
            "name" => "Stan",
            "role" => "user",
            "expires" => (time() + 3600) * 1000,
            "max-age" => 3600
        ];


        if (empty(UserRegistration::checkUserRegistrationFields($sanitizedPost))) {

            print UserToken::packedData(array_merge($sanitizedPost, $tokenSuccess));


        }




        //print UserToken::packedData($tokenData);
        $responce["errors"] = [];
        if (!empty(UserRegistration::checkUserRegistrationFields(DataSanitizeHelper::run($passedData)))) {
            $responce["errors"]["registrationFormErrors"] = UserRegistration::checkUserRegistrationFields(DataSanitizeHelper::run($passedData));
        }

        //print json_encode($responce);
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