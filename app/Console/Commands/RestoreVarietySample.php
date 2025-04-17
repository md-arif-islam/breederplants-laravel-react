<?php

namespace App\Console\Commands;

use App\Models\VarietySample;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RestoreVarietySample extends Command {
    protected $signature = 'app:restore-variety-sample {id}';
    protected $description = 'Restore a soft-deleted variety sample by ID and recover image files';

    public function handle() {
        $id = $this->argument( 'id' );
        $sample = VarietySample::withTrashed()->find( $id );

        if ( !$sample ) {
            $this->error( "Sample ID $id not found." );
            return;
        }

        if ( !$sample->trashed() ) {
            $this->warn( "Sample ID $id is not deleted." );
            return;
        }

        // Restore the sample record first
        $sample->restore();

        // Then handle image restoration
        $images = json_decode( $sample->images, true ) ?? [];
        $restoredImages = 0;

        foreach ( $images as $imagePath ) {
            $fileName = basename( $imagePath );
            $trashPath = public_path( 'images/variety-samples/trash/' . $fileName );
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

        $this->info( "✅ Variety Sample ID $id restored successfully." );
        if ( $restoredImages > 0 ) {
            $this->info( "✅ Restored $restoredImages image(s) from trash." );
        }
    }
}