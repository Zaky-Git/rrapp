<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'admin';

    protected $fillable = ['nama', 'email', 'password'];

    protected $hidden = ['password'];

    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = Hash::make($password);
    }

    public function usersAdded()
    {
        return $this->hasMany(User::class, 'admin_id');
    }

    public function usersUpdated()
    {
        return $this->hasMany(User::class, 'last_updated_by');
    }
}
