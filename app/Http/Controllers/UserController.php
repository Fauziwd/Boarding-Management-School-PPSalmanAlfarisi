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
        return Inertia::render('User/Edit', [
            'user' => $user,
            'roles' => $this->validRoles
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
    
        // Gunakan transaksi agar data konsisten
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'password' => Hash::make($request->password),
            ]);

            $teacherRoles = ['Murobbi', 'Muhafidz', 'Mudaris'];
            if (in_array($request->role, $teacherRoles)) {
                Teacher::create([
                    'user_id' => $user->id,
                    'teacher_type' => $request->role
                ]);
            }
        });

        return redirect()->route('users.index')->with('success', 'User berhasil dibuat!');
    }     

    public function update(Request $request, User $user)
    {
        // Mencegah admin mengubah role-nya sendiri
        if ($user->id === Auth::id() && $user->role !== $request->role) {
            return redirect()->back()->with('error', 'Anda tidak dapat mengubah role akun Anda sendiri.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in($this->validRoles)],
            'password' => 'nullable|min:8|confirmed',
        ]);
    
        $oldRole = $user->role;
        $newRole = $validated['role'];

        DB::transaction(function () use ($user, $validated, $oldRole, $newRole) {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $newRole,
                'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
            ]);

            $teacherRoles = ['Murobbi', 'Muhafidz', 'Mudaris'];

            // Jika awalnya guru, lalu bukan guru, hapus dari tabel teachers
            if (in_array($oldRole, $teacherRoles) && !in_array($newRole, $teacherRoles)) {
                Teacher::where('user_id', $user->id)->delete();
            }
            // Jika awalnya bukan guru, lalu jadi guru, atau role guru berubah, update/buat di tabel teachers
            elseif (in_array($newRole, $teacherRoles)) {
                Teacher::updateOrCreate(
                    ['user_id' => $user->id],
                    ['teacher_type' => $newRole]
                );
            }
        });
    
        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        // Mencegah admin menghapus akunnya sendiri
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus!');
    }
}