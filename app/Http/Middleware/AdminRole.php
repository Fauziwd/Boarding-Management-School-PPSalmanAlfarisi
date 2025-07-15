<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // Tambahkan ini untuk keamanan

class AdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan pengguna sudah login sebelum memeriksa perannya
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            // Tolak akses jika bukan admin
            abort(403, 'ANDA TIDAK MEMILIKI AKSES.');
        }
        
        return $next($request);
    }
}