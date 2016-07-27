<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class StaticTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testStaticPage()
    {
        $this->json('GET', 'static_page/help')->AssertResponseOk();
    }

    public function testCountry()
    {
        $this->json('GET', 'country/')->AssertResponseOk();
    }
    
    public function testStaticName()
    {
        $this->json('GET', 'static_page/get/name/')->AssertResponseOk();
    }

    public function testCity()
    {
        $country = \App\Country::first();
        $this->json('GET', 'city/'.$country->id)->AssertResponseOk();
    }

    public function testStaticPageStore()
    {
        $this->json('POST', 'admin/static_page/store', ['name' => 'name','description'=>'description','text' => 'text'])->seeJson(['status' => true]);
        $this->seeInDatabase('static_pages', ['name' => 'name','description'=>'description','text' => 'text']);
    }

    public function testStaticPageUpdate()
    {
        $page = \App\StaticPage::where('name','name')->first();
        if(!$page) {
            $page = \App\StaticPage::create(['name' => 'name', 'description' => 'description', 'text' => 'text']);
        }
        $this->json('POST', 'admin/static_page/update/'.$page->id, ['name' => 'name','description'=>'description1','text' => 'text1'])->seeJson(['status' => true]);
        $this->seeInDatabase('static_pages', ['name' => 'name','description'=>'description1','text' => 'text1']);
    }

    public function testStaticPageDestroy()
    {
        $page = \App\StaticPage::where('name','name')->first();
        if(!$page) {
            $page = \App\StaticPage::create(['name' => 'name', 'description' => 'description', 'text' => 'text']);
        }
        $this->json('GET', 'admin/static_page/destroy/'.$page->id)->assertRedirectedTo('admin/static_page/');
    }
}
