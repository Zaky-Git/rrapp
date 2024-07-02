<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(KecamatanDesaSeeder::class);

        Admin::create([
            'nama' => 'Muhammad Zaky',
            'email' => 'mzakyf@gmail.com',
            'password' => '12345678'
        ]);
    }
}
