<?php


function var_dump_pre($mixed)
{
    echo '<pre>';
    print_r($mixed);
    echo '</pre>';
    return null;
}