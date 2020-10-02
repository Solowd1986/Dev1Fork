<?php

namespace php\helpers;

class Output
{
    public static function show($data) {
        echo '<pre>';
        print_r($data);
        echo '</pre>';
        return null;
    }
}