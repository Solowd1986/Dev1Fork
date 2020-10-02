<?php

namespace php\auth\helpers;

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