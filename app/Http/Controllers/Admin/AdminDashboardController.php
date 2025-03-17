<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Breeder;
use App\Models\Grower;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductionReport;
use App\Models\SalesReport;
use App\Models\VarietyReport;
use App\Models\VarietySample;
use Carbon\Carbon;

class AdminDashboardController extends Controller {
    public function index() {
        // count all growers, breeders, variety reports, variety samples

        $totalGrowers = Grower::count();
        $totalBreeders = Breeder::count();
        $totalVarietyReports = VarietyReport::count();
        $totalVarietySamples = VarietySample::count();
        $totalProducts = Product::count();
        $totalNews = Post::count();

        $currentQuarter = "q" . ceil( Carbon::now()->month / 3 );
        $currentYear = Carbon::now()->year;
        $notSubmittedSalesReportCountAtCurrentQuarter = SalesReport::where( 'quarter', $currentQuarter )
            ->where( 'year', $currentYear )
            ->whereNull( 'submission_date' )->count();

        $submittedSalesReportCountAtCurrentQuarter = SalesReport::where( 'quarter', $currentQuarter )
            ->where( 'year', $currentYear )
            ->whereNotNull( 'submission_date' )->count();

        $notSubmittedProductionReportCountAtCurrentQuarter = ProductionReport::where( 'quarter', $currentQuarter )
            ->where( 'year', $currentYear )
            ->whereNull( 'submission_date' )->count();

        $submittedProductionReportCountAtCurrentQuarter = ProductionReport::where( 'quarter', $currentQuarter )
            ->where( 'year', $currentYear )
            ->whereNotNull( 'submission_date' )->count();

        return response()->json( compact( 'totalGrowers', 'totalBreeders', 'totalVarietyReports', 'totalVarietySamples', 'totalProducts', 'currentQuarter', 'currentYear', 'notSubmittedSalesReportCountAtCurrentQuarter', 'submittedSalesReportCountAtCurrentQuarter',
            'notSubmittedProductionReportCountAtCurrentQuarter', 'submittedProductionReportCountAtCurrentQuarter', 'totalNews'
        ) );
    }
}
