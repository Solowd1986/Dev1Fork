<?php

namespace php\db;

class DbConnect
{
    private static $host = "localhost";
    private static $db = "site";
    private static $user = "root";
    private static $psw = 1234;
    private static $charset = "utf8";

    private static $pdo;

    private function __construct(){}
    private function __clone(){}

    public static function exec()
    {
        if (empty(self::$pdo)) {
            $opt = [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES => false,

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