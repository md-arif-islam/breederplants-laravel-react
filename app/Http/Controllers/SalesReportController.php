<?php

namespace App\Http\Controllers;

use App\Exports\SalesReportExport;
use App\Http\Controllers\Controller;
use App\Models\Grower;
use App\Models\GrowerProduct;
use App\Models\SalesReport;
use App\Notifications\SalesReportSubmittedNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Maatwebsite\Excel\Excel;

class SalesReportController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {

        $user = Auth::user();

        $grower = Grower::where( "user_id", $user->id )->firstOrFail();
        $salesReports = SalesReport::where( "grower_id", $grower->id )->orderBy( 'id', 'desc' )->paginate( 10 );
        return response()->json( $salesReports );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create( $year, $quarter ) {

        $getQuarterDateRange = function ( $year, $quarter ) {
            switch ( $quarter ) {
            case "q1":
                return [
                    "start" => Carbon::create( $year, 1, 1 )->startOfDay(),
                    "end" => Carbon::create( $year, 3, 31 )->endOfDay(),
                ];
            case "q2":
                return [
                    "start" => Carbon::create( $year, 4, 1 )->startOfDay(),
                    "end" => Carbon::create( $year, 6, 30 )->endOfDay(),
                ];
            case "q3":
                return [
                    "start" => Carbon::create( $year, 7, 1 )->startOfDay(),
                    "end" => Carbon::create( $year, 9, 30 )->endOfDay(),
                ];
            case "q4":
                return [
                    "start" => Carbon::create( $year, 10, 1 )->startOfDay(),
                    "end" => Carbon::create( $year, 12, 31 )->endOfDay(),
                ];
            }
        };

        $user = Auth::user();

        $grower = Grower::where( "user_id", $user->id )->first();
        $quarters = json_decode( $grower->sales_reporting_quarter, true );

        $quarterCount = count( $quarters );

        $quarterIndex = array_search( $quarter, $quarters );

        $start_date = "";
        $end_date = "";
        $quarters_array = [];

        if ( $quarterCount == 1 ) {
            if ( $quarter == "q1" ) {
                $quarters_array = [
                    [
                        "year" => $year - 1,
                        "quarter" => "q4",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q3",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q2",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q1",
                    ],
                ];
            } elseif ( $quarter == "q2" ) {
                $quarters_array = [
                    [
                        "year" => $year,
                        "quarter" => "q1",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q4",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q3",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q2",
                    ],
                ];
            } elseif ( $quarter == "q3" ) {
                $quarters_array = [
                    [
                        "year" => $year,
                        "quarter" => "q2",
                    ],
                    [
                        "year" => $year,
                        "quarter" => "q1",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q4",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q3",
                    ],
                ];
            } elseif ( $quarter == "q4" ) {
                $quarters_array = [
                    [
                        "year" => $year,
                        "quarter" => "q3",
                    ],
                    [
                        "year" => $year,
                        "quarter" => "q2",
                    ],
                    [
                        "year" => $year,
                        "quarter" => "q1",
                    ],
                    [
                        "year" => $year - 1,
                        "quarter" => "q4",
                    ],
                ];
            }

            $start_date = $getQuarterDateRange( $quarters_array[3]["year"], $quarters_array[3]["quarter"] )["start"];
            $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
        } elseif ( $quarterCount == 2 ) {
            if ( $quarters == [
                "q1",
                "q2",
            ] ) {
                if ( $quarter == "q2" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q3",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q2",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q1",
                "q3",
            ] ) {
                if ( $quarter == "q3" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q3",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q1",
                "q4",
            ] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q3",
                        ],
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q2",
                "q3",
            ] ) {
                if ( $quarter == "q3" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                    ];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q3",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q2",
                "q4",
            ] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q3",
                        ],
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                    ];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q3",
                "q4",
            ] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q3",
                        ],
                    ];
                } elseif ( $quarter == "q3" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            }
        } elseif ( $quarterCount == 3 ) {
            if ( $quarters == [
                "q1",
                "q2",
                "q3",
            ] ) {
                if ( $quarter == "q3" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                    ];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q3",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q1",
                "q2",
                "q4",
            ] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q3",
                        ],
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                    ];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q2",
                "q3",
                "q4",
            ] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q3",
                        ],
                    ];
                } elseif ( $quarter == "q3" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                    ];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == [
                "q1",
                "q3",
                "q4",
            ] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q3",
                        ],
                    ];
                } elseif ( $quarter == "q3" ) {
                    $quarters_array = [
                        [
                            "year" => $year,
                            "quarter" => "q2",
                        ],
                        [
                            "year" => $year,
                            "quarter" => "q1",
                        ],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [

                        [
                            "year" => $year - 1,
                            "quarter" => "q4",
                        ],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"], $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
                }
            }
        } elseif ( $quarterCount == 4 ) {
            if ( $quarter == "q1" ) {
                $quarters_array = [
                    [
                        "year" => $year - 1,
                        "quarter" => "q4",
                    ],
                ];
            } elseif ( $quarter == "q2" ) {
                $quarters_array = [
                    [
                        "year" => $year,
                        "quarter" => "q1",
                    ],
                ];
            } elseif ( $quarter == "q3" ) {
                $quarters_array = [
                    [
                        "year" => $year,
                        "quarter" => "q2",
                    ],
                ];
            } elseif ( $quarter == "q4" ) {
                $quarters_array = [
                    [
                        "year" => $year,
                        "quarter" => "q3",
                    ],
                ];
            }

            $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
            $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
        }

        // Retrieve the grower product details based on the logged-in user's grower information
        $grower_products = GrowerProduct::with( "product" )->where( "grower_id", Auth::user()->grower->id )->get();

        return response()->json( compact( "grower_products", "year", "quarter", "start_date", "end_date", "quarters_array" ) );

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store( Request $request ) {

        // Validate the input data
        $request->validate( [
            "amount_sold" => "required|array",
            "amount_sold.*" => "required|integer|min:1",
            "unit_price" => "required|array",
            "unit_price.*" => "required|numeric|min:0",
            "product_id" => "required|array",
            "product_id.*" => "exists:products,id",
            "quarter" => "required|string",
            "year" => "required|integer",
            "quarters_array" => "required|json",
        ] );

        // Fetch the grower associated with the authenticated user
        $growerId = Auth::user()->grower->id;

        // Create an array to store the sales report data
        $salesData = [];

        // Loop through the submitted amount_sold data
        foreach ( $request->amount_sold as $productDetailId => $amountSold ) {
            // Gather additional data from the request
            $unitPrice = $request->unit_price[$productDetailId];
            $productId = $request->product_id[$productDetailId];
            $productName = $request->product_name[$productDetailId];

            // Add sales data for each product
            $salesData[] = [
                "product_id" => $productId,
                "unit_price" => $unitPrice,
                "amount" => $amountSold,
                "product_name" => $productName,
            ];

            // Optionally, update the stock if the sale is confirmed
            $growerProduct = GrowerProduct::find( $productDetailId );
            if ( $growerProduct ) {
                $growerProduct->stock -= $amountSold;
                $growerProduct->save();
            }
        }

        // Calculate total
        $total = 0;
        foreach ( $salesData as $sale ) {
            $total += $sale["unit_price"] * $sale["amount"];
        }

        // Check if a sales report already exists
        $salesReport = SalesReport::where( "grower_id", $growerId )->where( "year", $request->year )->where( "quarter", $request->quarter )->first();

        if ( $salesReport ) {
            // Update existing report
            $salesReport->update( [
                "submission_date" => now(),
                "data" => json_encode( $salesData ),
                "quarters_array" => $request->quarters_array,
                "total" => $total,
            ] );
        } else {
            // Create a new sales report entry
            $salesReport = SalesReport::create( [
                "grower_id" => $growerId,
                "submission_date" => now(),
                "data" => json_encode( $salesData ),
                "quarter" => $request->quarter,
                "year" => $request->year,
                "quarters_array" => $request->quarters_array,
                "total" => $total,
            ] );
        }

        $grower = Grower::find( $salesReport->grower_id );

        // Generate Excel file
        $excel = app( Excel::class );
        $excelFile = $excel->raw( new SalesReportExport( $salesReport, $grower ), Excel::XLSX );

        // Send notification to admin
        try {
            Notification::route( 'mail', 'arifislamdev@gmail.com' )
                ->notify( new SalesReportSubmittedNotification( $salesReport, $grower, $excelFile, 'admin' ) );
            Log::info( "Sales report submitted by " . $grower->company_name . " for " . ucwords( $salesReport->quarter ) . " " . $salesReport->year . " (admin notified)." );
        } catch ( \Exception $e ) {
            Log::info( "Sales report submitted but admin notification failed for " . $grower->company_name . "." );
        }

        // Send notification to grower
        try {
            $grower->user->notify( new SalesReportSubmittedNotification( $salesReport, $grower, $excelFile, 'grower' ) );
        } catch ( \Exception $e ) {
            Log::info( "Sales report submitted but grower notification failed for " . $grower->company_name . "." );
        }

        return response()->json( [
            "message" => "Sales Report submitted successfully.",
        ] );
    }

}