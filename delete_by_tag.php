<?php
require_once __DIR__ . '/vendor/autoload.php';

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

$config = new Configuration();
$config->cloud->cloudName = 'yehudah';
$config->cloud->apiKey = 'XXXXXX';
$config->cloud->apiSecret = 'XXXXXX';
$config->url->secure = true;
$cloudinary = new Cloudinary($config);

try {
    $response = $cloudinary->adminApi()->deleteAssetsByTag('cl-yehuda');
} catch (Exception $e) {
    printf( "There was an Exception: %s\r\n", $e->getMessage() );
}

