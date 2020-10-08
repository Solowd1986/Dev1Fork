<?php

namespace php\db;


class DbQueryCore extends DbConnect
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
            $pdo = \php\db\DbConnect::exec()->prepare($sql);
            $pdo->execute($columns);
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции insert " . $e->getMessage());
        }
        return \php\db\DbConnect::exec()->lastInsertId();
    }



    public static function update($id, $table, $arrayUserData)
    {
        $columns = [];
        $fields = [];
        /*
         * fields приводим к виду title=:title, article=:article, через foreach и implode
         * columns просто массив подстановок
         */
        foreach ($arrayUserData as $key => $value) {
            if ($key !== 'id' && $key !== 'date' && $key !== 'table') {
                $fields[] = $key . "=:" . $key;
                $columns[':' . $key] = $value;
            }
        }

        $str = implode(',', array_values($fields));
        $sql = "UPDATE {$table} SET $str WHERE id={$id}";
        try {
            $pdo = \php\db\DbConnect::exec()->prepare($sql);
            $pdo->execute($columns);
        } catch (\Exception $e) {
            \php\helpers\Output::show("Ошибка при операции update " . $e->getMessage());
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
            $pdo = \php\db\DbConnect::exec()->prepare("SELECT * FROM {$table} WHERE id={$id} LIMIT 1");
            $pdo->execute();
            return $pdo->fetch();
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции getItem " . $e->getMessage());
        }
    }


    public static function setSQLQuery($queryString, $fetchType = "fetchAll") {
        try {
            $pdo = \php\db\DbConnect::exec()->prepare($queryString);
            $pdo->execute();
            return $pdo->$fetchType();
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции setSQLQuery " . $e->getMessage());
        }
    }


    public static function getColumn($table, $columnTitle)
    {
        try {
            $pdo = \php\db\DbConnect::exec()->prepare("SELECT {$columnTitle} FROM {$table}");
            $pdo->execute();
            return $pdo->fetchAll(\PDO::FETCH_COLUMN);
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции getColumn " . $e->getMessage());
        }
    }


    /*
     * TABLE_COMMENT - данная запись в таблице содержит ее название, удобное для вывода в админ-панели.
     * Для корректной работы, каждая нужная для вывода таблица должна иметь заполненное поле Comment
     */
    public static function getAllTablesNames()
    {
        $sql = "SELECT TABLE_COMMENT, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'site'";

        try {
            $pdo = \php\db\DbConnect::exec()->prepare($sql);
            $pdo->execute();
            return $pdo->fetchAll();
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции getAll " . $e->getMessage());
        }
    }

    public static function getFieldNamesOfOneTable($table)
    {
        $sql = "SELECT DISTINCT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{$table}'";

        try {
            $pdo = \php\db\DbConnect::exec()->prepare($sql);
            $pdo->execute();
            return $pdo->fetchAll(\PDO::FETCH_COLUMN);
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции getAll " . $e->getMessage());
        }
    }




    public static function getTableName($table)
    {
        $sql = "SELECT TABLE_COMMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '$table' AND TABLE_SCHEMA = 'site'";

        try {
            $pdo = \php\db\DbConnect::exec()->prepare($sql);
            $pdo->execute();
            return $pdo->fetchColumn();
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции getAll " . $e->getMessage());
        }
    }


    public static function getAll($table)
    {
        try {
            $pdo = \php\db\DbConnect::exec()->prepare("SELECT * FROM {$table}");
            $pdo->execute();
            return $pdo->fetchAll();
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции getAll " . $e->getMessage());
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
            $pdo = \php\db\DbConnect::exec()->prepare("SELECT * FROM $table WHERE {$query} LIMIT 1");

            var_dump($pdo->queryString);
            $pdo->execute($record);
            var_dump($pdo->fetch());

            return $pdo->rowCount() !== 0 ? true : false;
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции checkRecord " . $e->getMessage());
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
            $pdo = \php\db\DbConnect::exec()->prepare("DELETE FROM $table WHERE id={$id} LIMIT 1");
            $pdo->execute();
            return $pdo->rowCount();
        } catch (\Exception $e) {
            return \php\helpers\Output::show("Ошибка при операции delete " . $e->getMessage());
        }
    }

    
}