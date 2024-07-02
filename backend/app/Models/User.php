<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table = 'user';

    protected $fillable = ['nama', 'nik', 'alamat', 'phone', 'kecamatan_id', 'desa_id', 'admin_create_id', 'admin_update_id'];

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class);
    }

    public function desa()
    {
        return $this->belongsTo(Desa::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function lastUpdatedBy()
    {
        return $this->belongsTo(Admin::class, 'last_updated_by');
    }

    public function getQrCodeUrlAttribute()
    {
        return asset("storage/qrcodes/{$this->id}.png");
    }
}
