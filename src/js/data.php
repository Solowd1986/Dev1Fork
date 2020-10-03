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
        if (\php\auth\helpers\UserToken::verifyUserData($token)) {
            var_dump_pre("Token solid");
        } else {
            var_dump_pre("Token wrong");
        }
    }


    if (isset(getallheaders()["Data-Type"])) {


        $sanitizedPost = \php\auth\helpers\DataSanitizeHelper::run($_POST);
        //var_dump($_POST);

        if (empty(\php\auth\UserRegistration::checkUserRegistrationFields($sanitizedPost))) {

            print \php\auth\helpers\UserToken::packedData($sanitizedPost);


//            var_dump_pre("ext");
//            var_dump($sanitizedPost);
//            var_dump_pre("-----");


            $token = \php\auth\helpers\UserToken::packedData($sanitizedPost);
//            var_dump_pre("token");
//            var_dump_pre($token);
//            var_dump_pre("-----");


            $t1 = explode(\php\auth\helpers\UserToken::$key_separator, $token)[0];
            $t2 = explode(\php\auth\helpers\UserToken::$key_separator, $token)[1];

//            var_dump_pre($t1);
//            var_dump_pre($t2);
//
//            var_dump_pre("decoded");
//            var_dump(\php\auth\helpers\UserToken::decodeBase64Data($t1));
//            var_dump_pre("-----");
//
//
//            var_dump_pre(\php\auth\helpers\UserToken::verifyUserData($token));

            if (\php\auth\helpers\UserToken::verifyUserData($token)) {
                //var_dump_pre("oj");
            }





        }






















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