<?php

namespace php\auth;

class UserRegistration
{

    private static $checkingUserFieldsList = ["login", "email", "psw", "name"];
    private static $checkingTable = "users";
    private static $checkingUniqueField = "email";
    private static $passwordFieldTitle = "psw";

    private static $checkingUserAuthFieldsList = ["email", "psw"];
    private static $checkingAuthTable = "users";
    private static $checkingAuthField = "email";
    private static $checkingPswField = "psw";


    public static function userRegistration($data)
    {
        if (self::checkFieldsAccordance(self::$checkingUserFieldsList, $data)) {
            // формируем массив для вставки только из заданных в $checkingUserFieldsList полей, первым общий массив,
            // элементы с общими ключами уйдут в результат имеено поэтому array_flip - чтобы значения стали ключами
            // и сравнение прошло корректно.

            $fields = array_intersect_key($data, array_flip(self::$checkingUserFieldsList));

            if (!\php\db\DbQueryCore::checkRecord(self::$checkingTable, [self::$checkingUniqueField => $fields[self::$checkingUniqueField]])) {
                $fields[self::$passwordFieldTitle] = \php\auth\helpers\PasswordHelper::encodePsw($fields[self::$passwordFieldTitle]);
                \php\db\DbQueryCore::insert(self::$checkingTable, $fields);
            } else {
                throw new \Error("user with this email already exist");
            }
        } else {
            throw new \Error("passed fields not equal to reqiring list of fields");
        }
    }


    public static function checkUserRegistrationFields($passedUserFields)
    {
        $userFieldsRequirement = [
            "login" => [
                "minChars" => "4",
                "maxChars" => "10",
                "allowedCharsRegExp" => '/[\w+]/i'
            ],
            "email" => [
                "minChars" => "6",
                "maxChars" => "25",
                "allowedCharsRegExp" => '/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD'
            ],
            "psw" => [
                "minChars" => "6",
                "maxChars" => "25",
                "allowedCharsRegExp" => '/[\w+]/i'
            ],
            "name" => [
                "minChars" => "2",
                "maxChars" => "10",
                "allowedCharsRegExp" => '/[\w+]/i'
            ],
        ];


        $errors = [];
        foreach ($passedUserFields as $key => $value) {
            if (!preg_match($userFieldsRequirement[$key]["allowedCharsRegExp"], $value)) {
                $errors[$key][] = "Для поля {$key} выбраны недопустимые символы";
            }
            if ($value < $userFieldsRequirement[$key]["minChars"]) {
                $errors[$key][] = "Поле {$key} должно содержать не менее {$userFieldsRequirement[$key]["minChars"]} символов";
            }
            if ($value < $userFieldsRequirement[$key]["maxChars"]) {
                $errors[$key][] = "Поле {$key} должно содержать не более {$userFieldsRequirement[$key]["maxChars"]} символов";
            }
        }
        return $errors;
    }



    public static function userAuthorize($data)
    {
        if (self::checkFieldsAccordance(self::$checkingUserAuthFieldsList, $data)) {
            $fields = array_intersect_key($data, array_flip(self::$checkingUserAuthFieldsList));
            if (\php\db\DbQueryCore::checkRecord(self::$checkingTable, [self::$checkingAuthField => $fields[self::$checkingAuthField]])) {


                //$fields[self::$passwordFieldTitle] = \php\auth\helpers\PasswordHelper::encodePsw($fields[self::$passwordFieldTitle]);

                $er = \php\db\UsersModel::getUserPsw("users", ["email" => "cvmfg@ya.ru"]);


                var_dump($er);

                return \php\auth\helpers\PasswordHelper::verifyPsw($fields[self::$checkingPswField], \php\auth\helpers\PasswordHelper::encodePsw($er));

                //\php\db\DbQueryCore::insert(self::$checkingTable, $fields);

            } else {
                throw new \Error("user with this email don't exist");
            }
        } else {
            throw new \Error("passed fields not equal to reqiring list of fields");
        }
    }



    /*
     * checkFieldsAccordance - проверка на соответствие переданных полей некоему эталонному набору.
     * $originalFieldList - эталонный набор
     * $data - проверяемый набор
     * Результат - true, если в переданном наборе есть все позиции из эталонного.
     * 1. Считаем количество элементов в эталонном наборе, этому значению должен будет соответствовать результат справа.
     * 2. Вызываем array_intersect_key, он получает 2 массива и вернет те пары, ключи из которых есть в обоих массивах
     * 3. Переворачиваем эталонный массив, так как его ключи целочисленные, он выглядит как ["email", "psw"], а нам нужно, чтобы значения стали ключами
     * 4. array_intersect_key вернет совпадения по ключам, эталонный массив мы перевернули и все сработает как нужно.
     * 5. Число получившихся элементов должно быть равно числу элементов для эталонного массива, значит, все элементы были найдены, тогда true
     */
    public static function checkFieldsAccordance($originalFieldList, $testedArray)
    {
        return count($originalFieldList) === count(array_intersect_key($testedArray, array_flip($originalFieldList)));
    }
}