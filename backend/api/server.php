<?php
// ini_set('display_errors', E_ALL);
ini_set('memory_limit', '256M');
set_time_limit(300);
require_once __DIR__ . '/../Routify/vendor/autoload.php';

header('Content-Type: application/json');

use Routify\Api;