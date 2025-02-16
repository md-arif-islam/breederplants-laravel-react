<?php

namespace App\Exports;

use App\Models\VarietyReport;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class VarietyReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithDrawings {
    protected $report;
    protected $drawings = [];
    protected $currentRow = 17;

    public function __construct( VarietyReport $report ) {
        $this->report = $report;
    }

    public function collection() {
        // Fetch the variety report with its samples
        return $this->report->samples;
    }

    public function headings(): array {
        return [
            ['TRIAL REPORT'],
            [], // Empty row for spacing
            ['Variety', $this->report->variety_name],
            ['Breeder Name', $this->report->breeder->company_name],
            ['Location', $this->report->grower->company_name],
            ['Amount of Plants', $this->report->amount_of_plants],
            ['Pot Size', $this->report->pot_size],
            ['Pot Trial', $this->report->pot_trial ? 'Yes' : 'No'],
            ['Open Field Trial', $this->report->open_field_trial ? 'Yes' : 'No'],
            ['Date of Propagation', $this->report->date_of_propagation],
            ['Date of Potting', $this->report->date_of_potting],
            ['Start Date', $this->report->start_date],
            ['End Date', $this->report->end_date],
            [],
        ];
    }

    public function map( $sample ): array {
        $mapData = [
            [], // First empty row
            [], // Second empty row
            ['Date:', $sample->sample_date],
            ['Leaf color', $sample->leaf_color],
            ['Amount of branches', $sample->amount_of_branches],
            ['Flower buds', $sample->flower_buds],
            ['Branch color', $sample->branch_color],
            ['Roots', $sample->roots],
            ['Flower color', $sample->flower_color],
            ['Flower petals', $sample->flower_petals],
            ['Flowering time', $sample->flowering_time],
            ['Length of flowering', $sample->length_of_flowering],
            ['Seeds', $sample->seeds],
            ['Seed color', $sample->seed_color],
            ['Amount of seeds', $sample->amount_of_seeds],
            ['Note', $sample->note],
            [],
        ];

        // Decode the images JSON and iterate over each image
        $images = json_decode( $sample->images, true ) ?? [];
        // remove web app url from image path

        $currentColumn = 'D'; // Start placing images from column D
        foreach ( $images as $index => $image ) {
            $this->drawings[] = $this->createDrawing( $image, $this->currentRow, $currentColumn );
            $currentColumn++; // Move to the next column for the next image
        }

        $this->currentRow += 17;

        return $mapData;
    }

    protected function createDrawing( $imagePath, $row, $column ) {
        $drawing = new Drawing();
        $drawing->setPath( public_path( $imagePath ) );
        $drawing->setHeight( 200 );
        $drawing->setCoordinates( $column . $row );

        return $drawing;
    }

    public function drawings() {
        return $this->drawings;
    }

    public function styles( Worksheet $sheet ) {
        $sheet->getStyle( 'A1' )->applyFromArray( [
            'font' => [
                'bold' => true,
                'size' => 18,
            ],
        ] );
        $sheet->mergeCells( 'A1:B1' );
        $sheet->getColumnDimension( 'A' )->setWidth( 30 );
        $sheet->getColumnDimension( 'B' )->setWidth( 40 );

        // Set the width for columns D through K to 500
        foreach ( range( 'D', 'K' ) as $columnID ) {
            $sheet->getColumnDimension( $columnID )->setWidth( 50 );
        }

        $sheet->getStyle( 'A3:B13' )->applyFromArray( [
            'font' => [
                'bold' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ] );
        $highestRow = $sheet->getHighestRow();
        for ( $i = 14; $i <= $highestRow; $i++ ) {
            if ( $sheet->getCell( 'A' . $i )->getValue() !== null && $sheet->getCell( 'A' . $i )->getValue() !== '' ) {
                $sheet->getRowDimension( $i )->setRowHeight( 20 );
                $sheet->getStyle( 'A' . $i . ':B' . $i )->applyFromArray( [
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ] );
            }
        }
    }

}
