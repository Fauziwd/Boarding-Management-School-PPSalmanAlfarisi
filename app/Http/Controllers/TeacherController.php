<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Menampilkan daftar semua guru.
     */
    public function index()
    {
        $teachers = Teacher::with('user')->latest()->paginate(10);
        return Inertia::render('Teacher/Index', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Menampilkan formulir untuk membuat guru baru.
     */
    public function create()
    {
        $availableUsers = User::where('role', 'user')
            ->whereNotIn('id', function($query) {
                $query->select('user_id')->from('teachers');
            })
            ->select('id', 'name')
            ->get();
            
        return Inertia::render('Teacher/Create', [
            'users' => $availableUsers,
        ]);
    }

    /**
     * Menyimpan guru baru ke dalam database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', Rule::exists('users', 'id'), Rule::unique('teachers', 'user_id')],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['required', Rule::in(['Murobbi', 'Muhafidz', 'Mudaris'])],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated) {
            Teacher::create($validated);
            $user = User::find($validated['user_id']);
            if ($user) {
                $user->role = 'guru';
                $user->save();
            }
        });

        return redirect()->route('teachers.index')->with('success', 'Guru berhasil dibuat.');
    }
    
    /**
     * Menampilkan detail spesifik seorang guru.
     */
    public function show(Teacher $teacher)
    {
        // Memuat semua relasi yang dibutuhkan untuk halaman detail
        $teacher->load([
            'user', 
            // Memuat relasi dan menghitung jumlah santri di setiap grup
            'usrohs' => fn($query) => $query->withCount('santris')->with('academicYear'), 
            'halaqohs' => fn($query) => $query->withCount('santris')->with('academicYear'), 
            'studyClasses' => fn($query) => $query->withCount('santris')->with('academicYear'), 
        ]);

        // Menambahkan URL foto untuk ditampilkan
        // Mengasumsikan foto ada di model User, sesuaikan jika berbeda
        if ($teacher->user->foto) { 
             $teacher->user->foto_url = Storage::url($teacher->user->foto);
        } else {
             $teacher->user->foto_url = null;
        }

        return Inertia::render('Teacher/Show', [
            'teacher' => $teacher,
        ]);
    }

    /**
     * Menampilkan formulir untuk mengedit data guru.
     */
    public function edit(Teacher $teacher)
    {
        $teacher->load('user');
        return Inertia::render('Teacher/Edit', [
            'teacher' => $teacher,
        ]);
    }

    /**
     * Memperbarui data guru yang sudah ada.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['required', Rule::in(['Murobbi', 'Muhafidz', 'Mudaris'])],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
        ]);

        $teacher->update($validated);

        return redirect()->route('teachers.index')->with('success', 'Data guru berhasil diperbarui.');
    }

    /**
     * Menghapus data guru dari database.
     */
    public function destroy(Teacher $teacher)
    {
        DB::transaction(function () use ($teacher) {
            $user = $teacher->user;
            $teacher->delete();
            
            if ($user) {
                $user->role = 'user';
                $user->save();
            }
        });

        return redirect()->route('teachers.index')->with('success', 'Guru berhasil dihapus.');
    }
}
