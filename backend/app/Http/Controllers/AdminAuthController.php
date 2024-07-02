<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Desa;
use App\Models\Kecamatan;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AdminAuthController extends Controller
{


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        $cookie = cookie('token', $token, 60 * 24, null, null, true, true, false, 'Strict'); //

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $admin->id,
                'name' => $admin->nama,
                'email' => $admin->email,
            ],
        ])->withCookie($cookie);
    }

    public function validateToken(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['valid' => false], 401);
        }

        $tokenData = PersonalAccessToken::findToken($token);

        if (!$tokenData || !$tokenData->tokenable) {
            return response()->json(['valid' => false], 401);
        }

        $user = $tokenData->tokenable;

        return response()->json(['valid' => true, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            $tokenData = PersonalAccessToken::findToken($token);

            if ($tokenData) {
                $tokenData->delete();
            }
        }

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function dashboardData()
    {
        $totalUsers = User::count();
        $totalKecamatan = Kecamatan::count();
        $jumlahUserPerKecamatan = [];

        $kecamatans = Kecamatan::all();
        foreach ($kecamatans as $kecamatan) {
            $jumlahUserPerKecamatan[] = [
                'id_kecamatan' => $kecamatan->id,
                'label' => $kecamatan->nama,
                'value' => $kecamatan->users()->count(),
            ];
        }
        $latestUsers = User::latest()->take(5)->get();
        $historyDaftarUser = $latestUsers->map(function ($user) {
            return [
                'id' => $user->id,
                'title' => $user->nama,
                'type' => $user->kecamatan_id,
                'time' => $user->created_at,
            ];
        });

        return response()->json([
            'total_users' => $totalUsers,
            'total_kecamatan' => $totalKecamatan,
            'jumlah_user_per_kecamatan' => $jumlahUserPerKecamatan,
            'history_daftar_user' => $historyDaftarUser,
        ]);
    }
    public function getUsersPerDesa($kecamatan_id)
    {
        $kecamatan = Kecamatan::with('desa')->find($kecamatan_id);
        if (!$kecamatan) {
            return response()->json(['error' => 'Kecamatan not found'], 404);
        }

        $desaData = [];
        foreach ($kecamatan->desa as $desa) {
            $desaData[] = [
                'label' => $desa->nama,
                'value' => $desa->users->count(),
            ];
        }

        return response()->json($desaData);
    }
}
