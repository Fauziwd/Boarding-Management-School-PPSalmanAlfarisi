<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TeacherRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah pengguna sudah login dan memiliki data sebagai guru
        if (!Auth::check() || !Auth::user()->teacher) {
            abort(403, 'AKSES DITOLAK. ANDA BUKAN GURU.');
        }

        // Periksa apakah peran guru mencakup Murobbi, Muhafidz, atau Mudaris
        $teacherRoles = Auth::user()->teacher->roles ?? [];
        if (empty(array_intersect(['Murobbi', 'Muhafidz', 'Mudaris'], $teacherRoles))) {
            abort(403, 'AKSES DITOLAK. PERAN ANDA TIDAK SESUAI.');
        }

        return $next($request);
    }
}