<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('nik')->unique();
            $table->unsignedBigInteger('kecamatan_id');
            $table->unsignedBigInteger('desa_id');
            $table->string('alamat');
            $table->string('phone');
            $table->unsignedBigInteger('admin_create_id');
            $table->unsignedBigInteger('admin_update_id');
            $table->timestamps();


            $table->foreign('kecamatan_id')->references('id')->on('kecamatan')->onDelete('cascade');
            $table->foreign('desa_id')->references('id')->on('desa')->onDelete('cascade');
            $table->foreign('admin_create_id')->references('id')->on('admin')->onDelete('cascade');
            $table->foreign('admin_update_id')->references('id')->on('admin')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
