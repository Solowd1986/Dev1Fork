<?php

namespace php\auth\helpers;



class UserToken
{
    private static $sign_key = "4za84A3R9MJ3H4hh";
    public static $key_separator = "|";


    /*
     * Подпись формирует хэш, это необратимое шифрование, но нам и не нужно раскодировать подпись, только данные в токене до нее.
     * Защита тут в том, что подпись у нас формируется на основе секретного ключа, то есть, нельзя изменить данные и прикрепить
     * нашу же подпись, так как данные не пройдут проверку на создание новой подписи у нас, так как для новых данных
     * подпись будет отличаться от старой. Сгенерировать свою подпись не выйдет, так как недостаточно просто взять sha256,
     * у нас хэш учитывает еще и ключ, который недоступен извне.
     *
     */
    private static function sign($data)
    {
        return hash("sha256", serialize($data) . self::$sign_key);
    }

    private static function encodeBase64Data($data)
    {
        return base64_encode(json_encode($data));
    }

    /*
     * Декодирвоание данных токена, флаг true тут для того, чтобы json_decode вернул не STD Object, а ассоциативный массив
     */
    public static function decodeBase64Data($data)
    {
        return json_decode(base64_decode($data), true);
    }

    /*
     * Создание токена (на вход обычно приходит ассоциативный массив):
     * 1. Левая часть токена, до сепаратора - кодированные данные, их не шифруем, тут это не обязательно.
     * 2. Правая часть токена это подпись, она создается на основе данных
     * 3. Части токена разделены сепаратором, лучше, если он уникальный, чтоб разбивать строку удобней, base64 кодирует без "|"
     *    поэтому его и используем, чтобы данный символ встречался лишь специально.
     */
    public static function packedData($data)
    {
        return self::encodeBase64Data($data) . self::$key_separator . self::sign($data);
    }


    public static function setTokenParams($token, $params) {
        $data = self::decodeBase64Data(explode(self::$key_separator, $token)[0]);
        foreach ($params as $key => $value) {
            $data[$key] = $params[$key];
        }
        return UserToken::packedData($data);
    }



    /*
     * Получаем токен, раскодируем через метод, забираем поле ситечения сркоа годности.
     * Делим на 1000, так как time() работает с секундами, а в JS токен уходит с миллисекундами, чтоб там удобнее было.
     * Сравниваем с текущей датой, если срок токена меньше, то есть время уже ушло вперед, то он истек
     */
    public static function hasTokenExpired($token)
    {
        return (self::decodeTokenData($token)["expiration-date"] / 1000) < time();
    }

    /*
     * Раскодируем токен, берем первый из двух элементов массива, получившегося от деления строки токена по сепаратору
     * Первая часть - это данные, вторая - это подпись. Нам нужна только первая тут, потом ее пропускаем через декодирование
     */
    public static function decodeTokenData($token) {
        return self::decodeBase64Data(explode(self::$key_separator, $token)[0]);
    }


    public static function verifyUserData($token)
    {
        /*
        * Ход работы:
        * 1. При получении токена, мы берем его данные (не подпись), раскодируем их, заново подписываем, сравниваем с подписью.
        * 2. Если подпись создавалась для одних данных, а пришли другие, то подписи не совпадут.
        */
        return (explode(self::$key_separator, $token)[1] === self::sign(self::decodeBase64Data(explode(self::$key_separator, $token)[0])));
    }
}