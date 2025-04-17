<?php

namespace App\Http\Controllers\Admin;

use App\Exports\VarietyReportExport;
use App\Http\Controllers\Controller;
use App\Imports\VarietyReportImport;
use App\Models\Breeder;
use App\Models\Grower;
use App\Models\User;
use App\Models\VarietyReport;
use App\Notifications\MissedSampleNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class AdminVarietyReportController extends Controller {
    public function index( Request $request ) {
        $query = VarietyReport::with( ['grower', 'breeder'] );

        // Search functionality
        if ( $search = $request->input( 'search' ) ) {
            $query->where( 'variety_name', 'LIKE', "%{$search}%" );
        }

        // Sorting functionality
        if ( $sort = $request->input( 'sort' ) ) {
            switch ( $sort ) {
            case 'a-z':
                $query->orderBy( 'variety_name', 'asc' );
                break;
            case 'last-item-first':
                $query->latest();
                break;
            case 'first-item-last':
                $query->oldest();
                break;
            }
        }

        // Grower filter functionality
        if ( $growerId = $request->input( 'grower_id' ) ) {
            $query->where( 'grower_id', $growerId );
        }

        $varietyReports = $query->paginate( 6 );
        $growers = Grower::all( 'id', 'company_name' );

        return response()->json( [
            'varietyReports' => $varietyReports,
            'growers' => $growers,
        ] );
    }

    public function create() {
        $growers = Grower::all( 'id', 'company_name' );
        $breeders = Breeder::all( 'id', 'company_name' );

        return response()->json( [
            'growers' => $growers,
            'breeders' => $breeders,
        ] );
    }

    public function show( $id ) {
        $varietyReport = VarietyReport::with( ['grower', 'breeder', 'samples'] )->findOrFail( $id );
        // $varietyReport = VarietyReport::with( ['grower', 'breeder'] )->findOrFail( $id );
        $growers = Grower::all( 'id', 'company_name' );
        $breeders = Breeder::all( 'id', 'company_name' );

        return response()->json( [
            'varietyReport' => $varietyReport,
            'growers' => $growers,
            'breeders' => $breeders,
        ] );
    }

    public function store( Request $request ) {

        $request->validate( [
            'variety_name' => 'required|string|max:255',
            'thumbnail' => 'nullable',
            'breeder_id' => 'required|exists:breeders,id',
            'grower_id' => 'required|exists:growers,id',
            'amount_of_plants' => 'required|integer|min:1',
            'pot_size' => 'nullable|string|max:255',
            'pot_trial' => 'nullable|boolean',
            'open_field_trial' => 'required|boolean',
            'date_of_propagation' => 'nullable|date',
            'date_of_potting' => 'nullable|date',
            'samples_schedule' => 'required|array',
            'samples_schedule.*' => 'required|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|boolean',
        ] );

        if ( isset( $request['thumbnail'] ) ) {
            if ( preg_match( '/^data:image\/(\w+);base64,/', $request['thumbnail'] ) ) {
                $relativePath = $this->saveImage( $request['thumbnail'] );
                $request['thumbnail'] = $relativePath;
            } else {
                // nothing
            }

        }

        $request['samples_schedule'] = json_encode( $request['samples_schedule'] );
        $request['user_id'] = 1;
        $varietyReport = VarietyReport::create( $request->all() );

        return response()->json( [
            'message' => 'Variety report created successfully',
            'id' => $varietyReport->id,
        ], 200 );
    }

    public function update( Request $request, $id ) {

        $varietyReport = VarietyReport::findOrFail( $id );

        $request->validate( [
            'variety_name' => 'required|string|max:255',
            'thumbnail' => 'nullable',
            'breeder_id' => 'required|exists:breeders,id',
            'grower_id' => 'required|exists:growers,id',
            'amount_of_plants' => 'required|integer|min:1',
            'pot_size' => 'nullable|string|max:255',
            'pot_trial' => 'nullable|boolean',
            'open_field_trial' => 'required|boolean',
            'date_of_propagation' => 'nullable|date',
            'date_of_potting' => 'nullable|date',
            'samples_schedule' => 'required|array',
            'samples_schedule.*' => 'required|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|boolean',
        ] );

        if ( isset( $request['thumbnail'] ) ) {
            if ( preg_match( '/^data:image\/(\w+);base64,/', $request['thumbnail'] ) ) {

                if ( file_exists( $varietyReport->thumbnail ) ) {
                    unlink( $varietyReport->thumbnail );
                }

                $relativePath = $this->saveImage( $request['thumbnail'] );
                $request['thumbnail'] = $relativePath;
            } else {

            }

        }

        $request['samples_schedule'] = json_encode( $request['samples_schedule'] );
        $varietyReport->update( $request->all() );

        return response()->json( [
            'message' => 'Variety report updated successfully',
        ], 200 );

    }

    public function destroy( $id ) {
        $varietyReport = VarietyReport::findOrFail( $id );

        // Move image to trash folder
        $trashDir = public_path( 'images/variety-reports/trash/' );
        if ( !File::exists( $trashDir ) ) {
            File::makeDirectory( $trashDir, 0755, true );
        }

        if ( file_exists( $varietyReport->thumbnail ) ) {
            File::move(
                public_path( $varietyReport->thumbnail ),
                $trashDir . basename( $varietyReport->thumbnail )
            );
        }

        $varietyReport->delete();

        return response()->json( [
            'message' => 'Variety report deleted successfully',
        ], 200 );
    }

    private function saveImage( $image ) {
        // Check if image is valid base64 string
        if ( preg_match( '/^data:image\/(\w+);base64,/', $image, $type ) ) {
            // Take out the base64 encoded text without mime type
            $image = substr( $image, strpos( $image, ',' ) + 1 );
            // Get file extension
            $type = strtolower( $type[1] ); // jpg, png, gif

            // Check if file is an image
            if ( !in_array( $type, ['jpg', 'jpeg', 'gif', 'png'] ) ) {
                throw new \Exception( 'invalid image type' );
            }
            $image = str_replace( ' ', '+', $image );
            $image = base64_decode( $image );

            if ( $image === false ) {
                throw new \Exception( 'base64_decode failed' );
            }
        } else {
            throw new \Exception( 'did not match data URI with image data' );
        }

        $dir = 'images/variety-reports/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path( $dir );
        $relativePath = $dir . $file;
        if ( !File::exists( $absolutePath ) ) {
            File::makeDirectory( $absolutePath, 0755, true );
        }
        file_put_contents( $relativePath, $image );

        return $relativePath;
    }

    public function import( Request $request ) {
        // Validate the file upload (optional)
        $request->validate( [
            'file' => 'required|file|mimes:xls,xlsx',
        ] );

        // Handle the file upload
        $file = $request->file( 'file' );

        // Use Excel::import to run the import process
        Excel::import( new VarietyReportImport, $file );

        return response()->json( ['message' => 'Import completed successfully!'], 200 );
    }

    public function export( $id ) {
        // Fetch the specific variety report by ID
        $report = VarietyReport::findOrFail( $id );

        $fileName = 'variety-report-' . Str::slug( $report->variety_name ) . '.xlsx';

        // Return the download response directly
        return Excel::download( new VarietyReportExport( $report ), $fileName );
    }

    public function reminder( $id ) {
        // Fetch the specific variety report by ID
        $varietyReport = VarietyReport::findOrFail( $id );

        $variety_name = $varietyReport->variety_name;
        $grower_id = $varietyReport->grower_id;

        $next_sample_date = json_decode( $varietyReport->samples_schedule )[0];

        // Format the date nicely
        $formatted_date = Carbon::parse( $next_sample_date )->format( 'l, M d Y' );

        // Generate the URL for the variety report
        $varietyReportUrl = env( 'FRONTEND_URL' ) . '/variety-reports/' . $varietyReport->id;

        $grower = Grower::findOrFail( $grower_id );
        $grower = User::find( $grower->user_id );
        $grower->notify( new MissedSampleNotification( $varietyReport, $grower, $formatted_date, $varietyReportUrl ) );

        return response()->json( ['message' => 'Reminder email sent successfully!'], 200 );
    }

}
