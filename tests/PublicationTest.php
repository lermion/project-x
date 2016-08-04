<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PublicationTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $this->json('POST', 'publication/')->AssertResponseOk();
    }

    public function testTopic()
    {
        $this->json('GET', 'publication/topic')->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $data = [
            'text' => 'test', 'is_anonym' => false, 'is_main' => false,
        ];
        $this->json('POST', 'publication/store', $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('publications', $data);
    }

    public function testUpdate()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id, 'is_main' => false]);
        $data = [
            'text' => 'test',
            'is_main' => false
        ];
        $this->json('POST', 'publication/update/'.$publication->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('publications', $data);
    }

    public function testDeleet()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/destroy/' . $publication->id)->seeJson([
            'status' => true,
        ]);
    }

    public function testLike()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/like/' . $publication->id)->seeJson([
            'status' => true,
        ]);
    }

    public function testShow()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/show/' . $publication->id)->seeJson();
    }

    public function testComplaint()
    {
        $user1 = \App\User::create(['phone' => '88888888888', 'password' => bcrypt('123'), 'country_id' => 1]);
        $user2 = \App\User::create(['phone' => '99999999999', 'password' => bcrypt('123'), 'country_id' => 1]);
        $this->be($user1);
        $publication = \App\Publication::create(['user_id'=> $user2->id]);
        $this->json('POST', 'publication/complaint', ['publication_id' =>$publication->id,
            'complaint_category_id'=>array(1,3)])
            ->seeJson([
                'status' => true,
            ]);
    }
}
