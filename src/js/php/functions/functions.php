<?php


function var_dump_pre($mixed = null)
{
    echo '<pre>';
    print_r($mixed);
    echo '</pre>';
    return null;
}