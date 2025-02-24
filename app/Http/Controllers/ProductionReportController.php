<?php

namespace App\Http\Controllers;

use App\Exports\ProductionReportExport;
use App\Http\Controllers\Controller;
use App\Models\Grower;
use App\Models\GrowerProduct;
use App\Models\ProductionReport;
use App\Notifications\ProductionReportSubmittedNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Maatwebsite\Excel\Excel;

class ProductionReportController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {

        $user = Auth::user();

        $grower = Grower::where( "user_id", $user->id )->firstOrFail();
        $productionReports = ProductionReport::where( "grower_id", $grower->id )->orderBy( 'id', 'desc' )->paginate( 10 );
        return response()->json( $productionReports );
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
        $quarters = json_decode( $grower->production_reporting_quarter, true );

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

        // Create an array to store the production report data
        $productionData = [];

        // Loop through the submitted amount_sold data
        foreach ( $request->amount_sold as $productDetailId => $amountSold ) {
            // Gather additional data from the request
            $unitPrice = $request->unit_price[$productDetailId];
            $productId = $request->product_id[$productDetailId];
            $productName = $request->product_name[$productDetailId];

            // Add production data for each product
            $productionData[] = [
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
        foreach ( $productionData as $sale ) {
            $total += $sale["unit_price"] * $sale["amount"];
        }

        // Check if a production report already exists
        $productionReport = ProductionReport::where( "grower_id", $growerId )->where( "year", $request->year )->where( "quarter", $request->quarter )->first();

        if ( $productionReport ) {
            // Update existing report
            $productionReport->update( [
                "submission_date" => now(),
                "data" => json_encode( $productionData ),
                "quarters_array" => $request->quarters_array,
                "total" => $total,
            ] );
        } else {
            // Create a new production report entry
            $productionReport = ProductionReport::create( [
                "grower_id" => $growerId,
                "submission_date" => now(),
                "data" => json_encode( $productionData ),
                "quarter" => $request->quarter,
                "year" => $request->year,
                "quarters_array" => $request->quarters_array,
                "total" => $total,
            ] );
        }

        $grower = Grower::find( $productionReport->grower_id );

        // Generate Excel file
        $excel = app( Excel::class );
        $excelFile = $excel->raw( new ProductionReportExport( $productionReport, $grower ), Excel::XLSX );

        // Send notification to admin
        try {
            Notification::route( 'mail', 'arifislamdev@gmail.com' )
                ->notify( new ProductionReportSubmittedNotification( $productionReport, $grower, $excelFile, 'admin' ) );
            Log::info( "Production report submitted by " . $grower->company_name . " for " . ucwords( $productionReport->quarter ) . " " . $productionReport->year . " (admin notified)." );
        } catch ( \Exception $e ) {
            Log::info( "Production report submitted but admin notification failed for " . $grower->company_name . "." );
        }

        // Send notification to grower
        try {
            $grower->user->notify( new ProductionReportSubmittedNotification( $productionReport, $grower, $excelFile, 'grower' ) );
        } catch ( \Exception $e ) {
            Log::info( "Production report submitted but grower notification failed for " . $grower->company_name . "." );
        }

        return response()->json( [
            "message" => "Production Report submitted successfully.",
        ] );
    }

}