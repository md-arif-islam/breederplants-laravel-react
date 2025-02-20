<?php

namespace App\Console\Commands;

use App\Models\Grower;
use App\Models\SalesReport;
use App\Models\User;
use App\Notifications\BlankSalesReportNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateBlankSalesReports extends Command {
    protected $signature = 'sales-reports:generate';
    protected $description = 'Generate blank sales report entries for all growers based on their reporting quarters';

    public function __construct() {
        parent::__construct();
    }

    public function handle() {
        $currentYear = Carbon::now()->year;
        $currentDate = Carbon::now()->format( 'd-m-Y' );

        $quarters = [
            'q1' => Carbon::create( $currentYear, 1, 1 )->format( 'd-m-Y' ),
            'q2' => Carbon::create( $currentYear, 4, 1 )->format( 'd-m-Y' ),
            'q3' => Carbon::create( $currentYear, 7, 1 )->format( 'd-m-Y' ),
            'q4' => Carbon::create( $currentYear, 10, 1 )->format( 'd-m-Y' ),
        ];

        $this->info( "Current Date {$currentDate}" );
        foreach ( $quarters as $quarter => $startDate ) {
            // Todo if ( "01-01-2025" === $startDate ) {
            if ( "01-01-2025" === $startDate ) {
                $this->info( "Processing quarter: {$quarter} (Start Date: {$startDate})" );
                $growers = Grower::whereJsonContains( 'sales_reporting_quarter', $quarter )->get();

                $this->info( "Found {$growers->count()} growers for quarter {$quarter}" );

                foreach ( $growers as $grower ) {
                    $existingReport = SalesReport::where( 'grower_id', $grower->id )
                        ->where( 'year', $currentYear )
                        ->where( 'quarter', $quarter )
                        ->first();

                    if ( $existingReport ) {
                        $this->info( "Skipping grower ID {$grower->id} (report already exists for quarter {$quarter})" );
                        continue;
                    }

                    $quartersArray = json_decode( $grower->sales_reporting_quarter, true );
                    $quarterCount = count( $quartersArray );
                    $quarterData = $this->get_qa_sd_ed( $currentYear, $quarter, $quarterCount, $quartersArray )['quarters_array'];

                    SalesReport::create( [
                        'grower_id' => $grower->id,
                        'submission_date' => null,
                        'data' => null,
                        'quarter' => $quarter,
                        'year' => $currentYear,
                        'quarters_array' => json_encode( $quarterData ),
                    ] );

                    Log::info( "Created blank sales report for grower ID {$grower->id}, quarter {$quarter}, year {$currentYear}" );

                    $aboutQuarters = "";
                    foreach ( $quarterData as $index => $q ) {
                        $aboutQuarters .= ucwords( $q["quarter"] ) . " - " . $q["year"];
                        if ( $index !== array_key_last( $quarterData ) ) {
                            $aboutQuarters .= ", ";
                        }
                    }
                    $link = env( 'FRONTEND_URL' ) . "/sales-reports";
                    $quarter_uc = ucwords( $quarter );

                    $grower = Grower::find( $grower->id );
                    $user = User::find( $grower->user_id );

                    try {
                        // Send notification via Laravel notification
                        $user->notify( new BlankSalesReportNotification( $grower, $quarter_uc, $aboutQuarters, $link, $currentYear ) );
                        $this->info( "Notification sent to grower (ID: {$grower->id}) for quarter: {$quarter_uc}" );
                        Log::info( "Notification sent to grower (ID: {$grower->id}) for quarter: {$quarter_uc}" );
                    } catch ( Exception $e ) {
                        $this->error( "Failed to send notification to grower (ID: {$grower->id}) for quarter: {$quarter_uc}. Error: " . $e->getMessage() );
                        Log::error( "Failed to send notification to grower (ID: {$grower->id}) for quarter: {$quarter_uc}. Error: " . $e->getMessage() );
                    }

                    Log::info( "Created blank sales report for grower ID {$grower->id}, quarter {$quarter_uc}, year {$currentYear}" );
                }
            }
        }

        $this->info( 'Blank sales report generation completed successfully.' );
    }

    public function get_qa_sd_ed( $year, $quarter, $quarterCount, $quarters ) {

        $getQuarterDateRange = function ( $year, $quarter ) {
            return match ( $quarter ) {
                'q1' => [
                    'start' => Carbon::create( $year, 1, 1 )->startOfDay(),
                    'end' => Carbon::create( $year, 3, 31 )->endOfDay(),
                ],
                'q2' => [
                    'start' => Carbon::create( $year, 4, 1 )->startOfDay(),
                    'end' => Carbon::create( $year, 6, 30 )->endOfDay(),
                ],
                'q3' => [
                    'start' => Carbon::create( $year, 7, 1 )->startOfDay(),
                    'end' => Carbon::create( $year, 9, 30 )->endOfDay(),
                ],
                'q4' => [
                    'start' => Carbon::create( $year, 10, 1 )->startOfDay(),
                    'end' => Carbon::create( $year, 12, 31 )->endOfDay(),
                ],
            };
        };

        $start_date = "";
        $end_date = "";
        $quarters_array = [];

        if ( $quarterCount == 1 ) {
            if ( $quarter == "q1" ) {
                $quarters_array = [
                    ["year" => $year - 1, "quarter" => "q4"],
                    ["year" => $year - 1, "quarter" => "q3"],
                    ["year" => $year - 1, "quarter" => "q2"],
                    ["year" => $year - 1, "quarter" => "q1"],
                ];
            } elseif ( $quarter == "q2" ) {
                $quarters_array = [
                    ["year" => $year, "quarter" => "q1"],
                    ["year" => $year - 1, "quarter" => "q4"],
                    ["year" => $year - 1, "quarter" => "q3"],
                    ["year" => $year - 1, "quarter" => "q2"],
                ];
            } elseif ( $quarter == "q3" ) {
                $quarters_array = [
                    ["year" => $year, "quarter" => "q2"],
                    ["year" => $year, "quarter" => "q1"],
                    ["year" => $year - 1, "quarter" => "q4"],
                    ["year" => $year - 1, "quarter" => "q3"],
                ];
            } elseif ( $quarter == "q4" ) {
                $quarters_array = [
                    ["year" => $year, "quarter" => "q3"],
                    ["year" => $year, "quarter" => "q2"],
                    ["year" => $year, "quarter" => "q1"],
                    ["year" => $year - 1, "quarter" => "q4"],
                ];
            }

            $start_date = $getQuarterDateRange( $quarters_array[3]["year"], $quarters_array[3]["quarter"] )["start"];
            $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
        } elseif ( $quarterCount == 2 ) {
            if ( $quarters == ["q1", "q2"] ) {
                if ( $quarter == "q2" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q1"]];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        ["year" => $year - 1, "quarter" => "q4"],
                        ["year" => $year - 1, "quarter" => "q3"],
                        ["year" => $year - 1, "quarter" => "q2"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q1", "q3"] ) {
                if ( $quarter == "q3" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q2"],
                        ["year" => $year, "quarter" => "q1"],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        ["year" => $year - 1, "quarter" => "q4"],
                        ["year" => $year - 1, "quarter" => "q3"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q1", "q4"] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q3"],
                        ["year" => $year, "quarter" => "q2"],
                        ["year" => $year, "quarter" => "q1"],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [["year" => $year - 1, "quarter" => "q4"]];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q2", "q3"] ) {
                if ( $quarter == "q3" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q2"]];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q1"],
                        ["year" => $year - 1, "quarter" => "q4"],
                        ["year" => $year - 1, "quarter" => "q3"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q2", "q4"] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q3"],
                        ["year" => $year, "quarter" => "q2"],
                    ];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q1"],
                        ["year" => $year - 1, "quarter" => "q4"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q3", "q4"] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q3"]];
                } elseif ( $quarter == "q3" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q2"],
                        ["year" => $year, "quarter" => "q1"],
                        ["year" => $year - 1, "quarter" => "q4"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            }
        } elseif ( $quarterCount == 3 ) {
            if ( $quarters == ["q1", "q2", "q3"] ) {
                if ( $quarter == "q3" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q2"]];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q1"]];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [
                        ["year" => $year - 1, "quarter" => "q4"],
                        ["year" => $year - 1, "quarter" => "q3"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q1", "q2", "q4"] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q3"],
                        ["year" => $year, "quarter" => "q2"],
                    ];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q1"]];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [["year" => $year - 1, "quarter" => "q4"]];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q2", "q3", "q4"] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q3"]];
                } elseif ( $quarter == "q3" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q2"]];
                } elseif ( $quarter == "q2" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q1"],
                        ["year" => $year - 1, "quarter" => "q4"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            } elseif ( $quarters == ["q1", "q3", "q4"] ) {
                if ( $quarter == "q4" ) {
                    $quarters_array = [["year" => $year, "quarter" => "q3"]];
                } elseif ( $quarter == "q3" ) {
                    $quarters_array = [
                        ["year" => $year, "quarter" => "q2"],
                        ["year" => $year, "quarter" => "q1"],
                    ];
                } elseif ( $quarter == "q1" ) {
                    $quarters_array = [

                        ["year" => $year - 1, "quarter" => "q4"],
                    ];
                }

                $quarters_array_count = count( $quarters_array );

                if ( $quarters_array_count > 1 ) {
                    $start_date = $getQuarterDateRange( $quarters_array[$quarters_array_count - 1]["year"],
                        $quarters_array[$quarters_array_count - 1]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                } else {
                    $start_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["start"];
                    $end_date = $getQuarterDateRange( $quarters_array[0]["year"],
                        $quarters_array[0]["quarter"] )["end"];
                }
            }
        } elseif ( $quarterCount == 4 ) {
            if ( $quarter == "q1" ) {
                $quarters_array = [["year" => $year - 1, "quarter" => "q4"]];
            } elseif ( $quarter == "q2" ) {
                $quarters_array = [["year" => $year, "quarter" => "q1"]];
            } elseif ( $quarter == "q3" ) {
                $quarters_array = [["year" => $year, "quarter" => "q2"]];
            } elseif ( $quarter == "q4" ) {
                $quarters_array = [["year" => $year, "quarter" => "q3"]];
            }

            $start_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["start"];
            $end_date = $getQuarterDateRange( $quarters_array[0]["year"], $quarters_array[0]["quarter"] )["end"];
        }

        return [
            'start_date' => $start_date,
            'end_date' => $end_date,
            'quarters_array' => $quarters_array,
        ];
    }
}