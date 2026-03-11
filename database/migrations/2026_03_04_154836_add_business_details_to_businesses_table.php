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
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('email')->nullable();
            $table->string('branch')->nullable();
            $table->string('logo')->nullable();
            $table->string('footer_message')->nullable();
            $table->string('paper_size')->default('80');
            $table->string('font_family')->default("'Roboto Mono', monospace");
            $table->decimal('tax_rate', 5, 2)->default(16);
            $table->string('receipt_prefix')->default('REF');
            $table->string('qr_content')->nullable();
            $table->string('currency')->default('KES');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['email', 'branch', 'logo', 'footer_message', 'paper_size', 'font_family', 'tax_rate', 'receipt_prefix', 'qr_content', 'currency']);
        });
    }
};
