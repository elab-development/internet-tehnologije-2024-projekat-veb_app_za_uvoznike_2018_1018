<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Prvo brišemo postojeću kolonu 'role' jer MySQL ne podržava direktnu promenu u enum.
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        // Ponovo kreiramo kolonu 'role' kao enum.
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'supplier', 'importer'])->default('importer')->after('password');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Brišemo enum kolonu 'role'.
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        // Vraćamo kolonu 'role' kao string.
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('importer')->after('password');
        });
    }
};
