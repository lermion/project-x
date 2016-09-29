<?php

namespace App\Console\Commands;

use App\AccessCode;
use Illuminate\Console\Command;

class GeneratorCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generator';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'generator codes';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        AccessCode::generateCodes();
    }
}
