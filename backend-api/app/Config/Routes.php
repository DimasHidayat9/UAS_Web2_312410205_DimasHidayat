<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->options('(:any)', function() {
    return \Config\Services::response()
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->setStatusCode(200);
});

$routes->post('api/login', 'AuthController::login');
$routes->post('api/logout', 'AuthController::logout');

$routes->get('api/barang/summary', 'BarangController::summary');
$routes->get('api/kategori', 'BarangController::getKategori');
$routes->get('api/supplier-publik', 'SupplierController::index');

$routes->group('api', ['filter' => 'authFilter'], function($routes) {
    $routes->resource('barang', ['controller' => 'BarangController', 'except' => 'summary']);
    $routes->get('histori', 'HistoriController::index');
    $routes->post('histori', 'HistoriController::create');
    $routes->delete('histori/(:num)', 'HistoriController::delete/$1');
    $routes->resource('supplier', ['controller' => 'SupplierController']);
});