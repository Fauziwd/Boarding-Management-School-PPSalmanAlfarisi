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



    // Manuskrip yang bikin halaman absensi jadi mirrorring ke halaman dashboard 
    
//     <?php

// // app/Http/Controllers/AbsensiController.php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Inertia\Inertia;
// use App\Models\User;
// use App\Models\Attendance;

// class AbsensiController extends Controller
// {
//     public function index()
//     {
//         // Mengambil data users beserta absensi mereka
//         $users = User::with('attendances')->paginate(10);

//         return Inertia::render('Dashboard', [
//             'users' => $users
//         ]);
//     }
// }