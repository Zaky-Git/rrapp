<?php

namespace App\Http\Controllers;

use App\Models\Kecamatan;
use Illuminate\Http\Request;

class DesaKontroller extends Controller
{
    public function getDesaByKecamatan($id)
    {
        try {
            $kecamatan = Kecamatan::with('desa')->find($id);
            return response()->json($kecamatan->desa);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
