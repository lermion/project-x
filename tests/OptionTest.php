<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class OptionTest extends TestCase
{
    public function testOptionIndex()
    {
        $this->json('GET', 'admin/user/option')->AssertResponseOk();
    }

    public function testOptionCreate()
    {
        $data = [
            'time_chat_message' => '1'
        ];
        $this->json('POST', 'admin/user/create_option', $data)->seeJson(['status' => true]);
        \App\Option::where(['time_chat_message' => '1'])->delete();
    }

    public function testOptionUpdate()
    {
        $option = \App\Option::create(['time_chat_message' => '2']);
        $data = [
            'time_chat_message' => '1'
        ];
        $this->json('POST', 'admin/user/update_option/'.$option->id, $data)->seeJson(['status' => true]);
        \App\Option::where(['time_chat_message' => '1'])->delete();
    }

}
