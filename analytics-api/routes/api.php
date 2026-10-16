<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalyticsEventController;
use App\Http\Controllers\Api\AnalyticsDashboardController;

Route::get('/analytics/dashboard', [
    AnalyticsDashboardController::class,
    'index',
]);
Route::post('/analytics/events', [
    AnalyticsEventController::class,
    'store',
]);