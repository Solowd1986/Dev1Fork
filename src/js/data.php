<?php


require_once realpath('../../vendor/autoload.php');



\php\db\DbConnect::exec();

die();

try {
    \php\db\DbConnect::exec();
} catch (Error $e) {
    var_dump("err" . $e->getMessage());
}



class Db
{
    private static $host = "localhost";
    private static $db = "site";
    private static $user = "root";
    private static $psw = 1234;
    private static $charset = "utf8";

    private static $pdo;

    private function __construct()
    {
    }

    private function __clone()
    {
    }

    public static function connectDb()
    {
        if (empty(self::$pdo)) {
            $opt = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,

            ];
            try {
                self::$pdo = new \PDO("mysql:host="
                    . self::$host . ";dbname="
                    . self::$db . ";" . "charset="
                    . self::$charset, self::$user, self::$psw, $opt);

            } catch (Throwable $e) {
                var_dump("Error in PDO: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}

var_dump(Db::connectDb());



class PasswordHelper
{
    public static function encodePsw($psw)
    {
        return password_hash($psw, PASSWORD_DEFAULT);
    }

    public static function verifyPsw($psw, $hash)
    {
        return password_verify($psw, $hash);
    }

    public static function restorePsw($userId)
    {

    }
}



class DataSanitizeHelper
{
    private static function cln($str, $email = false)
    {
        return preg_replace("/[^\w@.+]/i", "", trim(filter_var($str, !$email ? FILTER_SANITIZE_STRING : FILTER_SANITIZE_EMAIL)));
    }

    private static function check($checkingData)
    {

    }

    public static function run($data)
    {
        $sanitizeData = [];
        foreach ($data as $key => $value) {
            if ($key === "email" || strpos($value, "@")) {
                $sanitizeData[DataSanitizeHelper::cln($key)] = DataSanitizeHelper::cln($value, true);
            } else {
                $sanitizeData[DataSanitizeHelper::cln($key)] = DataSanitizeHelper::cln($value);
            }
        }
        return $sanitizeData;
    }
}









$data2 = [
    "login" => "asseta",
    "e11mail" => "logo@yaw.ru",
    "psw" => 1234,
    "name" => "stan",
    "blod" => true
];





//DataSanitizeHelper::run($data2);




class UserAuth
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

            if (!DbQuery::checkRecord(self::$checkingTable, [self::$checkingUniqueField => $fields[self::$checkingUniqueField]])) {
                $fields[self::$passwordFieldTitle] = PasswordHelper::encodePsw($fields[self::$passwordFieldTitle]);
                DbQuery::insert(self::$checkingTable, $fields);
            } else {
                throw new Error("user with this email already exist");
            }
        } else {
            throw new Error("passed fields not equal to reqiring list of fields");
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
            if (DbQuery::checkRecord(self::$checkingTable, [self::$checkingAuthField => $fields[self::$checkingAuthField]])) {


                //$fields[self::$passwordFieldTitle] = PasswordHelper::encodePsw($fields[self::$passwordFieldTitle]);

                $er = DbQuery::getUserPsw("users", ["email" => "cvmfg@ya.ru"]);


                var_dump($er);

                return PasswordHelper::verifyPsw($fields[self::$checkingPswField], PasswordHelper::encodePsw($er));

                //DbQuery::insert(self::$checkingTable, $fields);

            } else {
                throw new Error("user with this email don't exist");
            }
        } else {
            throw new Error("passed fields not equal to reqiring list of fields");
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


$passedData = [
    "login" => "",
    "email" => "logo@yaw.ru",
    "psw" => 1234,
    "name" => "stan",
];


try {
    //var_dump(UserAuth::userAuthorize(["email" => "cvmfg@ya.ru", "psw" => "345667"]));

    //var_dump(UserAuth::checkUserRegistrationFields(DataSanitizeHelper::run($passedData)));

    if (!UserAuth::checkUserRegistrationFields(DataSanitizeHelper::run($passedData))) {
        //var_dump("no err");
    } else {
        //var_dump("err");
    }
} catch (Error $e) {
    var_dump($e->getMessage());
}


//die();





//$names = array_map(function($person) { return $person['name']; }, $data);






//
//try {
//    UserAuth::userRegistration($data);
//} catch (Error $e) {
//    PrintHelper::pre($e->getMessage());
//}










class UserToken
{
    private static $sign_key = "4za84A3R9MJ3H4hh";
    private static $key_separator = "|";

    public static function sign($data)
    {
        return hash("sha256", serialize($data) . self::$sign_key);
    }

    public static function packedData($data)
    {
        return base64_encode(json_encode($data)) . self::$key_separator . self::sign($data);
    }

    public static function verifyUserData($userid, $data, $sign)
    {
        return (explode("|", $data)[1] === $sign) ? json_decode(base64_decode(explode("|", $data)[0]), true) : false;
    }
}


class PrintHelper {
    public static function pre($data) {
        echo '<pre>';
        print_r($data);
        echo '</pre>';
        return null;
    }
}



class DbQuery extends Db
{
    public static function insert($table, $arrayUserData)
    {
        $columns = [];
        foreach ($arrayUserData as $key => $value) {
            if ($key !== 'id' && $key !== 'date') {
                $columns[':' . $key] = $value;
            }
        }

        $fields = str_replace(':', '', implode(',', array_keys($columns)));
        $values = implode(',', array_keys($columns));

        $sql = "INSERT INTO {$table}($fields) VALUES ($values)";
        try {
            $pdo = Db::connectDb()->prepare($sql);
            $pdo->execute($columns);
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции insert " . $e->getMessage());
        }
        return Db::connectDb()->lastInsertId();
    }


    public static function update($arrayUserData, $table, $id)
    {
        $columns = [];
        $fields = [];
        /*
         * fields приводим к виду title=:title, article=:article, через foreach и implode
         * columns просто массив подстановок
         */
        foreach ($arrayUserData as $key => $value) {
            if ($key !== 'id' && $key !== 'date') {
                $fields[] = $key . "=:" . $key;
                $columns[':' . $key] = $value;
            }
        }

        $str = implode(',', array_values($fields));
        $sql = "UPDATE {$table} SET $str WHERE id={$id}";
        try {
            $pdo = Db::connectDb()->prepare($sql);
            $pdo->execute($columns);
        } catch (Exception $e) {
            PrintHelper::pre("Ошибка при операции update " . $e->getMessage());
        }
    }

    public static function getUserPsw($table, $record)
    {
        try {
            $query = array_keys($record)[0] . "=:" . array_keys($record)[0];
            $pdo = DB::connectDb()->prepare("SELECT psw FROM {$table} WHERE {$query} LIMIT 1");
            $pdo->execute($record);
            return $pdo->fetchColumn();
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции getItem " . $e->getMessage());
        }
    }



    /**
     * @param $table
     * @param $id
     * @return mixed|null
     */
    public static function getItem($table, $id)
    {
        try {
            $pdo = DB::connectDb()->prepare("SELECT * FROM {$table} WHERE id={$id} LIMIT 1");
            $pdo->execute();
            return $pdo->fetch();
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции getItem " . $e->getMessage());
        }
    }


    public static function setSQLQuery($queryString, $fetchType = "fetchAll") {
        try {
            $pdo = DB::connectDb()->prepare($queryString);
            $pdo->execute();
            return $pdo->$fetchType();
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции setSQLQuery " . $e->getMessage());
        }
    }


    public static function getColumn($table, $columnTitle)
    {
        try {
            $pdo = DB::connectDb()->prepare("SELECT {$columnTitle} FROM {$table}");
            $pdo->execute();
            return $pdo->fetchAll(PDO::FETCH_COLUMN);
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции getColumn " . $e->getMessage());
        }
    }


    public static function getAll($table)
    {
        try {
            $pdo = DB::connectDb()->prepare("SELECT * FROM {$table}");
            $pdo->execute();
            return $pdo->fetchAll();
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции getAll " . $e->getMessage());
        }
    }


    /**
     * @param $table
     * @param $record
     * @return bool|null
     */
    public static function checkRecord($table, $record)
    {
        try {
            var_dump($record);
            $query = array_keys($record)[0] . "=:" . array_keys($record)[0];
            $pdo = DB::connectDb()->prepare("SELECT * FROM $table WHERE {$query} LIMIT 1");

            var_dump($pdo->queryString);
            $pdo->execute($record);
            var_dump($pdo->fetch());

            return $pdo->rowCount() !== 0 ? true : false;
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции checkRecord " . $e->getMessage());
        }
    }


    /**
     * @param $id
     * @param $table
     * @return int - вернет количество удаленных записей, если вернет 0 - то ничего не удалено
     */
    public static function delete($table, $id)
    {
        try {
            $pdo = DB::connectDb()->prepare("DELETE FROM $table WHERE id={$id} LIMIT 1");
            $pdo->execute();
            return $pdo->rowCount();
        } catch (Exception $e) {
            return PrintHelper::pre("Ошибка при операции delete " . $e->getMessage());
        }
    }
}



//PrintHelper::pre(DbQuery::getItem("1", "users"));
//PrintHelper::pre(DbQuery::checkRecord("users", "id", 70));

//PrintHelper::pre(DbQuery::getColumn("users", "email, psw"));

//var_dump(DbQuery::insert(["name" => "stan", "email" => "us#ya.ru", "psw" => "12345"], "users"));
//var_dump(DbQuery::update(["name" => "stan2"], "user1s", 5));
//var_dump(DbQuery::delete(5, "users"));







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

    function jsonEncodeData($data, $add = [])
    {
        return json_encode(array_merge($data, $add));
    }

    if (isset(getallheaders()["Data-Type"])) {

        //var_dump_pre($_POST);
        //print jsonEncodeData(["name" => "gill"], $_POST);


        $sanitizedPost = DataSanitizeHelper::run($_POST);
        $res = UserAuth::checkUserRegistrationFields(DataSanitizeHelper::run($passedData));
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
        if (!empty(UserAuth::checkUserRegistrationFields(DataSanitizeHelper::run($passedData)))) {
            $responce["errors"]["registrationFormErrors"] = UserAuth::checkUserRegistrationFields(DataSanitizeHelper::run($passedData));
        }
        print json_encode($responce);
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