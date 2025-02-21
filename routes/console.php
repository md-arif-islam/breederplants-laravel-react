<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command( 'sales-reports:generate' )
    ->daily();
