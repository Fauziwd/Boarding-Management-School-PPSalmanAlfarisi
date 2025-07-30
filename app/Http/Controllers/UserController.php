<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Daftar role yang valid.
    private $validRoles = ['admin', 'user', 'Murobbi', 'Muhafidz', 'Mudaris', 'koperasi'];

    public function index()
    {
        $users = User::latest()->paginate(10);

        return Inertia::render('User/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        // Kirim daftar role ke frontend
        return Inertia::render('User/Create', [
            'roles' => $this->validRoles
        ]);
    }

    public function edit(User $user)
    {
        // Jika user adalah guru, kita perlu mengambil role spesifiknya dari tabel teachers
        $specificRole = '';
        if ($user->role === 'guru' && $user->teacher) {
            // Ambil role pertama dari array roles di tabel teacher
            $specificRole = $user->teacher->roles[0] ?? '';
        }

        return Inertia::render('User/Edit', [
            'user' => $user,
            'roles' => $this->validRoles,
            'specificRole' => $specificRole, // Kirim role spesifik ke frontend
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in($this->validRoles)],
            'password' => 'required|min:8|confirmed',
        ]);
    
        DB::transaction(function () use ($request) {
            $teacherRoles = ['Murobbi', 'Muhafidz', 'Mudaris'];
            $isTeacherRole = in_array($request->role, $teacherRoles);

            // Tentukan role untuk tabel users. Jika role guru, maka 'guru'.
            $userRole = $isTeacherRole ? 'guru' : $request->role;

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $userRole,
                'password' => Hash::make($request->password),
            ]);

            // Jika role adalah guru, buat entri di tabel teachers
            if ($isTeacherRole) {
                Teacher::create([
                    'user_id' => $user->id,
                    'roles' => [$request->role] // Simpan role spesifik sebagai array
                ]);
            }
        });

        return redirect()->route('users.index')->with('success', 'User berhasil dibuat!');
    }     

    public function update(Request $request, User $user)
    {
        if ($user->id === Auth::id() && $user->role !== $request->role) {
            return redirect()->back()->with('error', 'Anda tidak dapat mengubah role akun Anda sendiri.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in($this->validRoles)],
            'password' => 'nullable|min:8|confirmed',
        ]);
    
        $newRoleSelection = $validated['role'];
        $teacherRoles = ['Murobbi', 'Muhafidz', 'Mudaris'];
        $newIsTeacher = in_array($newRoleSelection, $teacherRoles);

        DB::transaction(function () use ($user, $validated, $newIsTeacher, $newRoleSelection) {
            // Tentukan role baru untuk tabel users
            $newUserRole = $newIsTeacher ? 'guru' : $newRoleSelection;

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $newUserRole,
                'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
            ]);

            // Jika role baru adalah guru, buat atau perbarui entri di tabel teachers
            if ($newIsTeacher) {
                Teacher::updateOrCreate(
                    ['user_id' => $user->id],
                    ['roles' => [$newRoleSelection]]
                );
            } 
            // Jika role baru bukan guru (dan mungkin sebelumnya adalah guru), hapus entri dari tabel teachers
            else {
                $user->teacher()->delete();
            }
        });
    
        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus!');
    }
}
