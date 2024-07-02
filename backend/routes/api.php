<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\DesaKontroller;
use App\Http\Controllers\KecamatanController;

// Admin Authentication Routes
Route::post('/login', [AdminAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/validate-token', [AdminAuthController::class, 'validateToken']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/dashboard-data', [AdminAuthController::class, 'dashboardData']);
    Route::get('/users-per-desa/{kecamatan_id}', [AdminAuthController::class, 'getUsersPerDesa']);
    // User Routes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::delete('/batch-delete', [UserController::class, 'batchDelete']);

    // Kecamatan Routes
    Route::get('/kecamatan', [KecamatanController::class, 'index']);

    // Desa Routes
    Route::get('/kecamatan/{id}/desa', [DesaKontroller::class, 'getDesaByKecamatan']);
});
