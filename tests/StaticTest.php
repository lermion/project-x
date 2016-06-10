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
    public function testCountry()
    {
        $this->json('GET', 'static_page/help')->AssertResponseOk();
    }

    public function testStaticPage(){
        $this->json('GET', 'country/')->AssertResponseOk();
    }
    
    public function testStaticName(){
        $this->json('GET', 'static_page/get/name/')->AssertResponseOk();
    }
}
