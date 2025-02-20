<?php

namespace App\Imports;

use App\Models\Breeder;
use App\Models\Grower;
use App\Models\VarietyReport;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing;

class VarietyReportImport implements ToModel, WithHeadingRow {
    /**
     * Handle each row of the Excel file.
     *
     * @param array $row
     * @return VarietyReport
     */

    public function model( array $row ) {
        static $currentRow = 2; // Start from the second row, as the first row usually contains headers

        // Find grower and breeder by their ID (correcting the array keys to match the Excel headings)
        $grower = Grower::where( 'username', $row['grower_id'] )->first();
        $breeder = Breeder::where( 'username', $row['breeder_id'] )->first();

        // If grower or breeder is not found, skip this row
        if ( !$grower || !$breeder ) {
            Log::warning( 'Grower or Breeder not found for row', $row );
            return null;
        }

        // Create the variety report with the data from the row
        $varietyReport = VarietyReport::create( [
            'user_id' => 1,
            'grower_id' => $grower->id,
            'breeder_id' => $breeder->id,
            'variety_name' => $row['variety_name'],
            'amount_of_plants' => $row['amount_of_plants'],
            'pot_size' => $row['pot_size'],
            'pot_trial' => strtolower( $row['pot_trial'] ) === 'yes' ? 1 : 0,
            'open_field_trial' => strtolower( $row['open_field_trial'] ) === 'yes' ? 1 : 0,
            'date_of_propagation' => $row['date_of_propagation'],
            'date_of_potting' => $row['date_of_potting'],
            'samples_schedule' => json_encode( explode( ',', $row['samples_schedule'] ) ),
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date'],
            'status' => strtolower( $row['status'] ) === 'active' ? 1 : 0,
        ] );

        // Load the spreadsheet and get the drawings
        $spreadsheet = IOFactory::load( request()->file( 'file' ) );
        $drawings = $spreadsheet->getActiveSheet()->getDrawingCollection();

        Log::info( 'Found ' . count( $drawings ) . ' drawing(s) in the sheet' );

        // Process each drawing
        foreach ( $drawings as $drawing ) {
            // Extract the drawing's coordinates (e.g., N2)
            $drawingCoordinates = $drawing->getCoordinates();
            Log::info( 'Found drawing at coordinates: ' . $drawingCoordinates );

            // Extract the row number from the drawing's coordinates (e.g., 2 from N2)
            $drawingRow = preg_replace( '/[^0-9]/', '', $drawingCoordinates );

            // Compare the extracted drawing row with the static current row
            if ( $drawingRow == $currentRow ) {
                if ( $drawing instanceof MemoryDrawing ) {
                    $this->processMemoryDrawing( $drawing, $varietyReport );
                } elseif ( $drawing instanceof Drawing ) {
                    $this->processRegularDrawing( $drawing, $varietyReport );
                }
            }
        }

        // Move to the next row
        $currentRow++;

        return $varietyReport;
    }

    private function processMemoryDrawing( MemoryDrawing $drawing, $varietyReport ) {
        Log::info( 'AAAAAAaaaaa' );

        ob_start();
        call_user_func(
            $drawing->getRenderingFunction(),
            $drawing->getImageResource()
        );
        $imageContents = ob_get_contents();
        ob_end_clean();

        $extension = $this->getExtensionFromMimeType( $drawing->getMimeType() );

        // Save the image to disk
        $this->saveImageToDisk( $imageContents, $extension, $varietyReport );
    }

    private function processRegularDrawing( Drawing $drawing, $varietyReport ) {
        Log::info( 'bbbbbbbbbbbbbbb' );
        // Read image from path
        $zipReader = fopen( $drawing->getPath(), 'r' );
        $imageContents = '';
        while ( !feof( $zipReader ) ) {
            $imageContents .= fread( $zipReader, 1024 );
        }
        fclose( $zipReader );

        $extension = $drawing->getExtension();

        // Save the image to disk
        $this->saveImageToDisk( $imageContents, $extension, $varietyReport );
    }

    private function getExtensionFromMimeType( $mimeType ) {
        Log::info( 'ccccccccccccccccccccc' );
        switch ( $mimeType ) {
        case MemoryDrawing::MIMETYPE_PNG:
            return 'png';
        case MemoryDrawing::MIMETYPE_JPEG:
            return 'jpg';
        case MemoryDrawing::MIMETYPE_GIF:
            return 'gif';
        default:
            return 'jpg'; // Default to jpg if no type is found
        }
    }

    private function saveImageToDisk( $imageContents, $extension, $varietyReport ) {
        Log::info( 'ddddddddddddddddddd' );
        $filename = time() . '-' . Str::slug( $varietyReport->variety_name ) . '.' . $extension;
        $path = 'images/' . $filename;
        if ( file_put_contents( public_path( $path ), $imageContents ) === false ) {
            Log::error( 'Failed to save image for variety report ID: ' . $varietyReport->id );
            return;
        }
        $pathUrl = $path;
        // Log success and update variety report
        Log::info( 'Image successfully saved at: ' . $pathUrl );
        $varietyReport->update( ['thumbnail' => $pathUrl] );
    }

}