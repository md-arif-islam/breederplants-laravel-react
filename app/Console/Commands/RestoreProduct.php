<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RestoreProduct extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:restore-product {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restore a soft-deleted product by ID and recover image files';

    /**
     * Execute the console command.
     */
    public function handle() {
        $id = $this->argument( 'id' );
        $product = Product::withTrashed()->find( $id );

        if ( !$product ) {
            $this->error( "Product ID $id not found." );
            return;
        }

        if ( !$product->trashed() ) {
            $this->warn( "Product ID $id is not deleted." );
            return;
        }

        // Restore the product record first
        $product->restore();

        // Then handle image restoration
        $images = json_decode( $product->images, true ) ?? [];
        $restoredImages = 0;

        foreach ( $images as $imagePath ) {
            $fileName = basename( $imagePath );
            $trashPath = public_path( 'images/products/trash/' . $fileName );
            $originalPath = public_path( $imagePath );

            if ( File::exists( $trashPath ) ) {
                $originalDir = dirname( $originalPath );
                if ( !File::exists( $originalDir ) ) {
                    File::makeDirectory( $originalDir, 0755, true );
                }

                File::move( $trashPath, $originalPath );
                $restoredImages++;
            }
        }

        $this->info( "✅ Product ID $id restored successfully." );
        if ( $restoredImages > 0 ) {
            $this->info( "✅ Restored $restoredImages image(s) from trash." );
        }
    }
}