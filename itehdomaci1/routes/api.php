<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ContainerController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\SupplierImporterController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


 

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/containers', [ContainerController::class, 'index']);
    Route::get('/containers/{id}', [ContainerController::class, 'show']);
    Route::post('/containers', [ContainerController::class, 'store']);
    Route::put('/containers/{id}', [ContainerController::class, 'update']);
    Route::delete('/containers/{id}', [ContainerController::class, 'destroy']);


    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);


    Route::get('/supplier-importers', [SupplierImporterController::class, 'index']);
    Route::post('/supplier-importers', [SupplierImporterController::class, 'store']);
    Route::delete('/supplier-importers/{id}', [SupplierImporterController::class, 'destroy']);

    Route::get('/supplier/{supplierId}/importers', [SupplierImporterController::class, 'getImportersBySupplier']);
    Route::get('/importer/{importerId}/suppliers', [SupplierImporterController::class, 'getSuppliersByImporter']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

 

Route::middleware('auth:sanctum')->apiResource('offers', OfferController::class);