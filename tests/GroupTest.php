<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class GroupTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $this->json('GET', 'group/')->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->be($user);
        $data = [
            'name' => 'test',
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('POST', 'group/store', $data)->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('groups', $data);
    }
}
