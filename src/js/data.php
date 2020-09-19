<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //print "data_from_post";r;
    print json_encode([
        "name" => "bob",
        "age" => 21
    ]);
}