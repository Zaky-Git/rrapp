<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('kecamatan_id') && $request->kecamatan_id !== "") {
            $query->where('kecamatan_id', $request->kecamatan_id);
        }

        if ($request->filled('desa_id') && $request->desa_id !== "") {
            $query->where('desa_id', $request->desa_id);
        }
        $users = $query->with(['kecamatan', 'desa', 'admin', 'lastUpdatedBy'])
            ->get()
            ->append('qr_code_url');

        return response()->json($users);
    }

    public function show($id)
    {
        return User::with(['kecamatan', 'desa', 'admin', 'lastUpdatedBy'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|max:20|unique:user,nik',
            'alamat' => 'required|string|max:255',
            'phone' => 'required|string|max:14',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'desa_id' => 'required|exists:desa,id',
            'admin_create_id' => 'required|exists:admin,id',
            'admin_update_id' => 'required|exists:admin,id',
        ]);

        $user = User::create($validated);

        $this->generateQrCode($user);

        return $user;
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|max:20|unique:user,nik,' . $id,
            'alamat' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'desa_id' => 'required|exists:desa,id',
            'admin_update_id' => 'required|exists:admin,id',
        ]);

        $nikChanged = $user->nik !== $validated['nik'];

        $user->update($validated);

        if ($nikChanged) {
            $this->generateQrCode($user);
        }

        return $user;
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $this->deleteQrCode($user);

        $user->delete();

        return response()->noContent();
    }


    private function generateQrCode(User $user)
    {
        $this->deleteQrCode($user);


        $link = "http://www.react/{$user->nik}";


        $filePath = storage_path("app/public/qrcodes/{$user->id}.png");


        QrCode::size(300)->generate($link, $filePath);
    }

    private function deleteQrCode(User $user)
    {
        $filePath = storage_path("app/public/qrcodes/{$user->id}.png");

        try {
            if (file_exists($filePath)) {
                unlink($filePath);
                return true;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    public function batchDelete(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:user,id',
        ]);

        $userIds = $request->user_ids;

        $users = User::whereIn('id', $userIds)->get();

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found for the provided IDs'], 404);
        }

        foreach ($users as $user) {
            $this->deleteQrCode($user);
            $user->delete();
        }

        return response()->json(['message' => 'Users deleted successfully']);
    }
}
