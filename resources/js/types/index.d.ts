import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Siswa {
    id: number;
    user_id: number;
    kelas_id?: number;
    guru_id?: number;
    nama_lengkap: string;
    nama_panggilan?: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    tempat_lahir?: string;
    tanggal_lahir?: string;
    agama?: string;
    kewarganegaraan: string;
    anak_ke?: number;
    jumlah_saudara_kandung?: number;
    bahasa_sehari_hari?: string;
    foto_siswa?: string;
    berat_badan?: number;
    tinggi_badan?: number;
    golongan_darah?: string;
    riwayat_penyakit?: string;
    alasan_rawat_inap?: string;
    riwayat_alergi_makanan?: string;
    ayah_nama_lengkap?: string;
    ayah_tempat_tanggal_lahir?: string;
    ayah_pekerjaan?: string;
    ayah_pendidikan_terakhir?: string;
    ayah_nomor_identitas?: string;
    ayah_alamat_rumah?: string;
    ayah_telepon_rumah?: string;
    ayah_alamat_kantor?: string;
    ayah_telepon_kantor?: string;
    ayah_no_hp?: string;
    ibu_nama_lengkap?: string;
    ibu_tempat_tanggal_lahir?: string;
    ibu_pekerjaan?: string;
    ibu_pendidikan_terakhir?: string;
    ibu_nomor_identitas?: string;
    ibu_alamat_rumah?: string;
    ibu_telepon_rumah?: string;
    ibu_alamat_kantor?: string;
    ibu_telepon_kantor?: string;
    ibu_no_hp?: string;
    kontak_darurat_nama_lengkap?: string;
    kontak_darurat_hubungan?: string;
    kontak_darurat_pekerjaan?: string;
    kontak_darurat_nomor_identitas?: string;
    kontak_darurat_alamat_rumah?: string;
    kontak_darurat_telepon_rumah?: string;
    kontak_darurat_alamat_kantor?: string;
    kontak_darurat_telepon_kantor?: string;
    kontak_darurat_no_hp?: string;
    lokasi_pendaftaran?: string;
    tanggal_pendaftaran?: string;
    status_siswa: boolean;
    is_active: boolean;
    jenis_pembayaran?: 'transfer' | 'cash';
    user?: User;
    kelas?: {
        id: number;
        nama_kelas: string;
        deskripsi?: string;
        spp: string;
    };
    guru?: {
        id: number;
        nama_lengkap: string;
        user?: User;
    };
    created_at: string;
    updated_at: string;
}
