<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kecamatan;
use App\Models\Desa;

class KecamatanDesaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'nama' => 'Bang Haji',
                'desa' => [
                    'Air Napal', 'Bang Haji', 'Genting', 'Lubuk Langkap', 'Padang Burnai',
                    'Sekayun', 'Sekayun Ilir', 'Sekayun Mudik', 'Sungkai Berayun',
                    'Taba Tengah', 'Talang Donok', 'Talang Panjang'
                ]
            ],
            [
                'nama' => 'Karang Tinggi',
                'desa' => [
                    'Durian Demang', 'Dusun Baru II', 'Kancing', 'Karang Tinggi',
                    'Padang Tambak', 'Pelajau', 'Penanding', 'Renah Lebar',
                    'Renah Semanek', 'Taba Mutung', 'Taba Terunjam', 'Talang Empat',
                    'Ujung Karang'
                ]
            ],
            [
                'nama' => 'Merigi Kelindang',
                'desa' => [
                    'Bajak II', 'Jambu', 'Kelindang', 'Kelindang Atas', 'Lubuk Unen',
                    'Lubuk Unen Baru', 'Padang Kedeper', 'Penembang', 'Pungguk Beringin',
                    'Pungguk Ketupak', 'Taba Durian Sebakul', 'Talang Ambung', 'Ulak Lebar'
                ]
            ],
            [
                'nama' => 'Merigi Sakti',
                'desa' => [
                    'Arga Indah II', 'Bajak III', 'Curup', 'Durian Lebar', 'Karang Panggung',
                    'Komering', 'Lubuk Pendam', 'Lubuk Puar', 'Pagar Agung', 'Pagar Besi',
                    'Pungguk Jaya', 'Punjung', 'Rajak Besi', 'Susup', 'Taba Gemantung'
                ]
            ],
            [
                'nama' => 'Pagar Jati',
                'desa' => [
                    'Arga Indah I', 'Datar Penokot', 'Karang Are', 'Keroya', 'Kertapati',
                    'Kertapati Mudik', 'Layang Lekat', 'Pagar Jati', 'Rena Jaya', 'Rena Kandis',
                    'Taba Renah', 'Talang Curup', 'Temiang', 'Tumbuk'
                ]
            ],
            [
                'nama' => 'Pondok Kelapa',
                'desa' => [
                    'Abu Sakim', 'Bintang Selatan', 'Harapan', 'Kembang Ayun', 'Padang Betuah',
                    'Pagar Dewa', 'Panca Mukti', 'Pasar Pedati', 'Pekik Nyaring', 'Pondok Kelapa',
                    'Sidodadi', 'Sidorejo', 'Sri Kuncoro', 'Srikaton', 'Sunda Kelapa',
                    'Talang Boseng', 'Talang Pauh'
                ]
            ],
            [
                'nama' => 'Pondok Kubang',
                'desa' => [
                    'Batu Raja', 'Dusun Anyar', 'Dusun Baru I', 'Harapan Makmur', 'Linggar Galing',
                    'Margo Mulyo', 'Paku Haji', 'Pondok Kubang', 'Taba Jambu', 'Talang Tengah I',
                    'Tanjung Dalam', 'Tanjung Terdana'
                ]
            ],
            [
                'nama' => 'Pematang Tiga',
                'desa' => [
                    'Air Kotok', 'Aturan Mumpo', 'Aturan Mumpo II', 'Batu Beriang', 'Genting Dabuk',
                    'Kebun Lebar', 'Kota Titik', 'Pematang Tiga', 'Pematang Tiga Lama', 'Senabah',
                    'Talang Tengah II', 'Tanjung Kepahyang', 'Tiambang'
                ]
            ],
            [
                'nama' => 'Semidang Lagan',
                'desa' => [
                    'Bukit', 'Gajah Mati', 'Karang Nanding', 'Kota Niur', 'Lagan', 'Lagan Bungin',
                    'Padang Siring', 'Pagar Gunung', 'Pagar Jati', 'Semidang', 'Taba Lagan'
                ]
            ],
            [
                'nama' => 'Taba Penanjung',
                'desa' => [
                    'Bajak I', 'Datar Lebar', 'Karang Tengah', 'Lubuk Sini', 'Penum', 'Rindu Hati',
                    'Sukarami', 'Surau', 'Taba Baru', 'Taba Teret', 'Tanjung Heran', 'Tanjung Raman'
                ]
            ],
            [
                'nama' => 'Talang Empat',
                'desa' => [
                    'Air Putih', 'Air Sebakul', 'Jayakarta', 'Jumat', 'Kembang Seri', 'Nakau',
                    'Padang Ulak Tanjung', 'Pulau Panggung', 'Taba Pasmah', 'Tengah Padang'
                ]
            ],
        ];

        foreach ($data as $kecamatan) {
            $kecamatanModel = Kecamatan::create([
                'nama' => $kecamatan['nama']
            ]);

            foreach ($kecamatan['desa'] as $desa) {
                Desa::create([
                    'kecamatan_id' => $kecamatanModel->id,
                    'nama' => $desa
                ]);
            }
        }
    }
}
