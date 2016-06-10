<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class AdminStaticTest extends TestCase
{
    use DatabaseTransactions;

    public function testIndex()
    {
        $this->json('GET', 'admin/static_page/')->AssertResponseOk();
    }

    public function testCreate()
    {
        $this->json('GET', 'admin/static_page/create')->AssertResponseOk();
    }
    public function testStore()
    {
        $data = [
            'name' => 'test','text' => 'test','description'=>'test'
        ];
        $this->json('POST', 'admin/static_page/store', $data);
        $this->seeInDatabase('static_pages', $data);
    }
    public function testShow()
    {
        $page = \App\StaticPage::first();
        $this->json('GET', 'admin/static_page/show/'.$page->id)->AssertResponseOk();
    }
    public function testEdit()
    {
        $page = \App\StaticPage::first();
        $this->json('GET', 'admin/static_page/edit/'.$page->id)->AssertResponseOk();
    }
    public function testUpdate()
    {
        $page = \App\StaticPage::first();
        $data = [
            'name' => 'test',
            'text' => 'test',
            'description'=>'test'
        ];
        $this->json('POST', 'admin/static_page/update/'.$page->id, $data);
        $this->seeInDatabase('static_pages', $data);
    }
    public function testDestroy()
    {
        $page = \App\StaticPage::first();
        $this->json('GET', 'admin/static_page/destroy/'.$page->id)->assertRedirectedTo('/admin/static_page');
    }
}
