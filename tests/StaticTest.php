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

    public function testStaticTypePlace()
    {
        $this->json('GET', 'place/type/static')->AssertResponseOk();
    }

    public function testDynamicTypePlace()
    {
        $this->json('GET', 'place/type/dynamic')->AssertResponseOk();
    }
}
