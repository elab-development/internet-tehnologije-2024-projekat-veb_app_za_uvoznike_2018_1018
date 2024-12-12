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
        Schema::create('containers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('max_capacity')->nullable();
            $table->string('max_dimensions')->nullable();
            $table->decimal('total_import_cost', 10, 2)->nullable();
            $table->unsignedBigInteger('importer_id')->nullable();
            $table->enum('status', ['pending', 'shipped', 'delivered'])->default('pending');
            $table->foreign('importer_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('containers');
    }
};
