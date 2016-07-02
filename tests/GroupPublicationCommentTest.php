<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class GroupPublicationCommentTest extends TestCase
{
    use DatabaseTransactions;
    
    public function testStore()
    {
        $user = \App\User::first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $group = \App\Group::first();
        if (!$group) {
            $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        }
        \App\GroupUser::create(['user_id' => $user->id, 'group_id' => $group->id, 'is_admin' => 0]);
        $this->be($user);
        $this->be($user);
        $data = [
            'text' => 'test'
        ];
        $publication = $group->publications()->create(['user_id' => $user->id]);
        $this->json('POST', 'group/'.$group->id.'/publication/'.$publication->id.'/comment/store', $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('comments', $data);
    }
}
