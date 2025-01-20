<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class AbsensiController extends Controller
{
    public function index()
    {
        return Inertia::render('Absensi/Index');
    }
}
