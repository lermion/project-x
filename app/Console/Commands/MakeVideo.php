<?php

namespace App\Console\Commands;

use App\Video;
use Illuminate\Console\Command;

class MakeVideo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'video:make {f_name} {f_path} {new_fname}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'video:make
                              f_name: uploaded client file name
                              f_patch: path for uploaded files
                              new_fname: converted file name
                              Convert uploaded videos';

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
        $arguments = $this->argument();
        Video::makeVideo($arguments['f_name'], $arguments['f_path'], $arguments['new_fname']);
        Video::where('url', $arguments['new_fname'] . '.mp4')->update(['is_coded' => 1]);
    }
}
