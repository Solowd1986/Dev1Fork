<?php

namespace php\auth\helpers;

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