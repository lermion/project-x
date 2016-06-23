<?php

namespace App\Http\Controllers\Moderator;

use App\Publication;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ModerateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $publications = Publication::with('user','images','videos','group')->where(['is_moderate'=>false,'is_main'=>true,
            'is_block'=>false])->get();
        $data = [];
        foreach ($publications as $publication){
            if(count($publication->group)==0){
                $data[] = $publication;
            }elseif ($publication->group[0]->is_open){
                $data[] = $publication;
            }
        }
        return view('moderator.moderate.index',['publications'=>$data]);
    }

    public function confirm($id){
        $publication = Publication::find($id);
        $publication->is_moderate = true;
        $publication->save();
        return redirect()->action('Moderator\ModerateController@index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }
    
    public function block(Request $request,$id)
    {
        $publication = Publication::find($id);
        $publication->is_block = true;
        $publication->block_message = $request->input('message');
        $publication->save();
        return redirect()->action('Moderator\ModerateController@index');
    }
}
