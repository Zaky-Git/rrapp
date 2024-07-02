<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Desa extends Model
{
    use HasFactory;

    protected $table = 'desa';

    protected $fillable = ['nama', 'kecamatan_id'];


    public function kecamatan()
    {
        return $this->belongsTo(Desa::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
