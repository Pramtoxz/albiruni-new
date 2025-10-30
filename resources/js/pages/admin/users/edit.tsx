import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';

interface User {
    id: number;
    name: string;
    email: string;
    nohp: string;
    role: 'guru' | 'orangtua';
}

interface Props {
    user: User;
}

export default function EditUser({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        nohp: user.nohp,
        role: user.role,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit User" />

            <div className="max-w-2xl space-y-6">
                {/* Header */}
                <div>
                    <Link href="/admin/users">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Edit User</h1>
                    <p className="text-muted-foreground mt-1">
                        Update informasi user {user.name}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="nohp">Nomor WhatsApp</Label>
                        <Input
                            id="nohp"
                            type="tel"
                            value={data.nohp}
                            onChange={(e) => setData('nohp', e.target.value)}
                            placeholder="628123456789"
                            required
                        />
                        <InputError message={errors.nohp} />
                        <p className="text-xs text-muted-foreground">
                            Format: 628xxx atau 08xxx
                        </p>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value: 'guru' | 'orangtua') =>
                                setData('role', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="guru">Guru</SelectItem>
                                <SelectItem value="orangtua">Orang Tua</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update User'}
                        </Button>
                        <Link href="/admin/users">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
