<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductionReportExport implements WithDrawings, WithEvents, WithStyles {
    protected $productionReport;
    protected $grower;

    public function __construct( $productionReport, $grower ) {
        $this->productionReport = $productionReport;
        $this->grower = $grower;
    }

    /**
     * Add drawings (logos) to the worksheet.
     *
     * @return array
     */
    public function drawings() {
        $drawing = new Drawing();
        $drawing->setName( 'Logo' );
        $drawing->setDescription( 'Company Logo' );
        $drawing->setPath( public_path( 'images/logo/srlogo.png' ) );
        $drawing->setWidth( 350 );
        $drawing->setCoordinates( 'C2' );

        return [$drawing];
    }

    /**
     * Handle after sheet events to add custom data to cells.
     *
     * @return array
     */
    public function registerEvents(): array {
        return [
            AfterSheet::class => function ( AfterSheet $event ) {
                $sheet = $event->sheet->getDelegate();

                $sheet->setCellValue( 'A8', 'Quantities sold under contract number: ' );
                $sheet->setCellValue( 'L8', $this->grower->agreement_number ?? 0 );

                $sheet->setCellValue( 'C11', 'Licensor' );
                $sheet->setCellValue( 'C13', 'Breederplants VOF' );
                $sheet->setCellValue( 'C14', 'R.Laman' );
                $sheet->setCellValue( 'C15', 'Botterwerf 14' );
                $sheet->setCellValue( 'C16', '2804 MK Gouda' );
                $sheet->setCellValue( 'C17', 'Nederland' );
                $sheet->setCellValue( 'C19', '+31 (0)6 55 877 388' );
                $sheet->setCellValue( 'C20', 'info@breederplants.nl' );

                $sheet->setCellValue( 'H11', 'Licensee' );
                $sheet->setCellValue( 'H13', $this->grower->company_name ?? '' );
                $sheet->setCellValue( 'H14', $this->grower->contact_person ?? '' );
                $sheet->setCellValue( 'H15', $this->grower->street ?? '' );
                $sheet->setCellValue( 'H16', ( $this->grower->postal_code ?? '' ) . ' ' . ( $this->grower->city ?? '' ) );
                $sheet->setCellValue( 'H17', $this->grower->country ?? '' );
                $sheet->setCellValue( 'H19', $this->grower->phone ?? '' );
                $sheet->setCellValue( 'H20', $this->grower->company_email ?? '' );

                $sheet->setCellValue( 'C24', 'Production Reports' );
                $sheet->setCellValue( 'H24', 'Year:' );
                $sheet->setCellValue( 'I24', ( $this->productionReport->year ) . ' - ' . ucwords( $this->productionReport->quarter ) );

                $sheet->setCellValue( 'C25', 'Name' );
                $sheet->setCellValue( 'H25', 'Quantity' );

                // Data rows: assume productionReport->data is a json encoded object with key => quantity pairs.
                $reportData = json_decode( $this->productionReport->data, true );
                $rowIndex = 26;
                foreach ( $reportData as $field => $quantity ) {

                    $field = str_replace( '_', ' ', $field );

                    $sheet->setCellValue( 'C' . $rowIndex, ucfirst( $field ) );
                    $sheet->setCellValue( 'H' . $rowIndex, $quantity );

                    // Apply border to quantity cell.
                    $sheet->getStyle( 'H' . $rowIndex )->applyFromArray( [
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => Border::BORDER_THIN,
                            ],
                        ],
                    ] );

                    // Alternate row background
                    if ( $rowIndex % 2 == 0 ) {
                        $sheet->getStyle( "C{$rowIndex}:K{$rowIndex}" )->applyFromArray( [
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'startColor' => [
                                    'argb' => 'E0E0E0',
                                ],
                            ],
                        ] );
                    }
                    $rowIndex++;
                }
            },
        ];
    }

    /**
     * Format the quarters array as a string for display.
     *
     * @return string
     */
    private function formatQuartersArray(): string {
        $quartersArray = json_decode( $this->productionReport->quarters_array, true );

        if ( empty( $quartersArray ) ) {
            return 'N/A';
        }

        return implode( ', ', array_map( function ( $quarter ) {
            return ucfirst( $quarter['quarter'] ) . ' - ' . $quarter['year'];
        }, $quartersArray ) );
    }

    public function styles( Worksheet $sheet ) {

        // Hide B column
        $sheet->getColumnDimension( 'B' )->setVisible( false );

        // Border Bottom from A8 to L8
        $sheet->getStyle( 'A8:L8' )->applyFromArray( [
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                ],
            ],
        ] );

        // L8 Font Bold
        $sheet->getStyle( 'L8' )->applyFromArray( [
            'font' => [
                'bold' => true,
            ],
        ] );

        // C11 Bold
        $sheet->getStyle( 'C11' )->applyFromArray( [
            'font' => [
                'bold' => true,
            ],
        ] );

        // h11 bold
        $sheet->getStyle( 'H11' )->applyFromArray( [
            'font' => [
                'bold' => true,
            ],
        ] );

        // Apply background color to cells C12:F12, C13:F13, C14:F14, C15:F15, C16:F16, C17:F17, C18:F18, C19:F19, C20:F20, C21:F21, C22:F22
        for ( $row = 12; $row <= 22; $row++ ) {
            $sheet->getStyle( "C{$row}:F{$row}" )->applyFromArray( [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => [
                        'argb' => 'FFE0E0E0',
                    ],
                ],
            ] );

            $sheet->getStyle( "H{$row}:K{$row}" )->applyFromArray( [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => [
                        'argb' => 'FFE0E0E0',
                    ],
                ],
            ] );
        }

        // C24  to K24 Background Color
        $sheet->getStyle( 'C24:K24' )->applyFromArray( [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'c1bdbd',
                ],
            ],
        ] );

        // 24 to 33 height 30 also center align
        for ( $row = 24; $row <= 33; $row++ ) {
            $sheet->getRowDimension( $row )->setRowHeight( 30 );
            $sheet->getStyle( "A{$row}:L{$row}" )->applyFromArray( [
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ] );
        }

        // c24 font size 20px and bold
        $sheet->getStyle( 'C24' )->applyFromArray( [
            'font' => [
                'bold' => true,
                'size' => 20,
            ],
        ] );

        // H24 & i24 bold
        $sheet->getStyle( 'H24:I24' )->applyFromArray( [
            'font' => [
                'bold' => true,
            ],
        ] );

        // C25 & K25 border bottom
        $sheet->getStyle( 'C25:K25' )->applyFromArray( [
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ] );

    }
}