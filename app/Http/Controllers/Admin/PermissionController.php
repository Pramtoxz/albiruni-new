<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    private array $availableMenus = [
        'dashboard' => 'Dashboard',
        'user-activity' => 'User Activity',
        'users.manage' => 'Manajemen User',
        'guru.manage' => 'Data Guru',
        'kelas.manage' => 'Kelas',
        'emosi.manage' => 'Emosi',
        'siswa.pending' => 'Pendaftaran Siswa',
        'siswa.approved' => 'Data Siswa',
        'pembayaran.manage' => 'Pembayaran SPP',
        'daily-report.view' => 'Daily Report',
        'menu-mingguan.manage' => 'Menu Mingguan',
        'rencana-pembelajaran.manage' => 'Rencana Pembelajaran',
        'news.manage' => 'Berita',
    ];

    public function index(): Response
    {
        $adminUsers = User::where('role', 'admin')
            ->where('is_it', false)
            ->with(['permissions' => function ($query) {
                $query->where('is_active', true);
            }])
            ->get()
            ->map(function ($user) {
                $activePermissions = $user->permissions->pluck('menu_key')->toArray();
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'active_permissions_count' => count($activePermissions),
                    'total_permissions' => count($this->availableMenus),
                    'permissions' => $activePermissions,
                ];
            });

        return Inertia::render('admin/permissions/index', [
            'adminUsers' => $adminUsers,
            'availableMenus' => $this->availableMenus,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string',
        ]);

        $user->permissions()->delete();

        foreach ($validated['permissions'] as $menuKey) {
            if (array_key_exists($menuKey, $this->availableMenus)) {
                UserPermission::create([
                    'user_id' => $user->id,
                    'menu_key' => $menuKey,
                    'is_active' => true,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Permissions updated successfully');
    }
}
