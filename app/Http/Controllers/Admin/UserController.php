<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    private function checkAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized - Admin access only');
        }
    }

    public function index(Request $request)
    {
        $this->checkAdmin();

        $search = $request->input('search');

        $users = User::query()
            ->where('role', '!=', 'admin')
            ->with('siswa')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nohp', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $this->checkAdmin();

        return Inertia::render('admin/users/create');
    }

    public function store(Request $request)
    {
        $this->checkAdmin();
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'nohp' => ['required', 'string', 'max:20', 'unique:users'],
            'role' => ['required', Rule::in(['guru', 'orangtua'])],
        ]);

        $validated['nohp'] = $this->normalizePhone($validated['nohp']);
        $validated['password'] = Hash::make('12345678');
        $validated['email_verified_at'] = now();

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil ditambahkan dengan password default: 12345678');
    }

    public function edit(User $user)
    {
        $this->checkAdmin();

        // Prevent editing admin users
        if ($user->role === 'admin') {
            abort(403, 'Tidak dapat mengedit user admin');
        }

        return Inertia::render('admin/users/edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->checkAdmin();

        // Prevent editing admin users
        if ($user->role === 'admin') {
            abort(403, 'Tidak dapat mengedit user admin');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'nohp' => ['required', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['guru', 'orangtua'])],
        ]);

        $validated['nohp'] = $this->normalizePhone($validated['nohp']);

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diupdate!');
    }

    public function destroy(User $user)
    {
        $this->checkAdmin();

        // Prevent deleting admin users
        if ($user->role === 'admin') {
            abort(403, 'Tidak dapat menghapus user admin');
        }

        // Delete related siswa if exists
        if ($user->siswa) {
            $user->siswa->delete();
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dihapus!');
    }

    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '08')) {
            return '62'.substr($phone, 1);
        }
        if (str_starts_with($phone, '62')) {
            return $phone;
        }
        if (str_starts_with($phone, '8')) {
            return '62'.$phone;
        }

        return '62'.$phone;
    }
}
