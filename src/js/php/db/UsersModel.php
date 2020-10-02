<?php

namespace php\db;

class UsersModel
{
    public static function getUserPsw($table, $record)
    {
        try {
            $query = array_keys($record)[0] . "=:" . array_keys($record)[0];
            $pdo = \php\db\DbConnect::exec()->prepare("SELECT psw FROM {$table} WHERE {$query} LIMIT 1");
            $pdo->execute($record);
            return $pdo->fetchColumn();
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции getItem " . $e->getMessage());
        }
    }
}