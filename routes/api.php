<?php
use App\Http\Controllers\AkademikController;
use Illuminate\Support\Facades\Route;

Route::get('/akademiks/{santri_id}', [AkademikController::class, 'getBySantri']);
