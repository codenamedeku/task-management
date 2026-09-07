<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('tasks', [TaskController::class, 'index'])
        ->name('tasks.index');

    Route::get('tasks/{task}', [TaskController::class, 'show'])
        ->middleware('can:view,task')
        ->name('tasks.show');

    Route::post('tasks', [TaskController::class, 'store'])
        ->name('tasks.store');

    Route::put('tasks/{task}', [TaskController::class, 'update'])
        ->middleware('can:update,task')
        ->name('tasks.update');

    Route::delete('tasks/{task}', [TaskController::class, 'destroy'])
        ->middleware('can:delete,task')
        ->name('tasks.destroy');
});

require __DIR__ . '/settings.php';
