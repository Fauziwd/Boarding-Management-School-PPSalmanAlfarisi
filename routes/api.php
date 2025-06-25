<?php
use App\Http\Controllers\AkademikController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SantriController; 

Route::get('/akademiks/{santri_id}', [AkademikController::class, 'getBySantri']);
Route::get('/check-nis/{nis}', [SantriController::class, 'checkNis']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

