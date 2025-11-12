<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $gurus = Guru::with(['user:id,name,email,nohp', 'kelas:id,nama_kelas'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nip', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('email', 'like', "%{$search}%")
                                ->orWhere('nohp', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/guru/index', [
            'gurus' => $gurus,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        // Get users with role guru that don't have guru profile yet
        $availableUsers = User::where('role', 'guru')
            ->whereDoesntHave('guru')
            ->get(['id', 'name', 'email']);

        $kelas = Kelas::all();

        return Inertia::render('admin/guru/create', [
            'availableUsers' => $availableUsers,
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nip' => 'nullable|unique:gurus,nip',
            'nama_lengkap' => 'required|string|max:255',
            'kelas_id' => 'nullable|exists:kelas,id',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'alamat' => 'nullable|string',
            'pendidikan_terakhir' => 'nullable|string|max:255',
            'foto_guru' => 'nullable|image|max:2048',
        ]);

        // Check if user already has guru profile
        $existingGuru = Guru::where('user_id', $validated['user_id'])->first();
        if ($existingGuru) {
            return back()->withErrors(['user_id' => 'User ini sudah memiliki profil guru']);
        }

        // Handle foto upload
        $fotoPath = null;
        if ($request->hasFile('foto_guru')) {
            $file = $request->file('foto_guru');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/foto_guru'), $filename);
            $fotoPath = $filename;
        }

        // Create guru profile
        Guru::create([
            'user_id' => $validated['user_id'],
            'kelas_id' => $validated['kelas_id'] ?? null,
            'nip' => $validated['nip'] ?? null,
            'nama_lengkap' => $validated['nama_lengkap'],
            'tempat_lahir' => $validated['tempat_lahir'] ?? null,
            'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
            'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
            'alamat' => $validated['alamat'] ?? null,
            'pendidikan_terakhir' => $validated['pendidikan_terakhir'] ?? null,
            'foto_guru' => $fotoPath,
        ]);

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data guru berhasil ditambahkan');
    }

    public function edit(Guru $guru)
    {
        $guru->load('user:id,name,email,nohp');
        $kelas = Kelas::all();

        return Inertia::render('admin/guru/edit', [
            'guru' => $guru,
            'kelas' => $kelas,
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'nip' => 'nullable|unique:gurus,nip,'.$guru->id,
            'nama_lengkap' => 'required|string|max:255',
            'kelas_id' => 'nullable|exists:kelas,id',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'alamat' => 'nullable|string',
            'pendidikan_terakhir' => 'nullable|string|max:255',
            'foto_guru' => 'nullable|image|max:2048',
        ]);

        // Update user name
        $guru->user->update([
            'name' => $validated['nama_lengkap'],
        ]);

        // Handle foto upload
        if ($request->hasFile('foto_guru')) {
            // Delete old photo
            if ($guru->foto_guru && file_exists(public_path('assets/images/foto_guru/'.$guru->foto_guru))) {
                unlink(public_path('assets/images/foto_guru/'.$guru->foto_guru));
            }

            $file = $request->file('foto_guru');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/foto_guru'), $filename);
            $validated['foto_guru'] = $filename;
        } else {
            unset($validated['foto_guru']);
        }

        // Update guru profile
        $guru->update([
            'kelas_id' => $validated['kelas_id'] ?? null,
            'nip' => $validated['nip'] ?? null,
            'nama_lengkap' => $validated['nama_lengkap'],
            'tempat_lahir' => $validated['tempat_lahir'] ?? null,
            'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
            'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
            'alamat' => $validated['alamat'] ?? null,
            'pendidikan_terakhir' => $validated['pendidikan_terakhir'] ?? null,
            'foto_guru' => $validated['foto_guru'] ?? $guru->foto_guru,
        ]);

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data guru berhasil diupdate');
    }

    public function destroy(Guru $guru)
    {
        // Delete photo if exists
        if ($guru->foto_guru && file_exists(public_path('assets/images/foto_guru/'.$guru->foto_guru))) {
            unlink(public_path('assets/images/foto_guru/'.$guru->foto_guru));
        }

        // Delete guru (will cascade delete user)
        $guru->delete();

        return redirect()->route('admin.guru.index')
            ->with('success', 'Data guru berhasil dihapus');
    }
}
