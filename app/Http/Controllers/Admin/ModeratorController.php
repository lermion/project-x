<?php

namespace App\Http\Controllers\Admin;

use App\Moderator;
use App\WorkingHoursModerator;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ModeratorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $moderators = Moderator::all();
        return view('admin.moderator.index')->with('moderators', $moderators);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.moderator.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Moderator::where('email',$request->input('email'))->first()){
            return view('admin.moderator.create',['error'=>'Email уже используется другим модератором']);
        }
        $data = $request->all();
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $path = $this->getAvatarPath($photo);
            $data['photo'] = $path;
        }

        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $moderator = Moderator::create($data);
        if($data['weekday1']){
            WorkingHoursModerator::create(
                ['weekday'=>1,'from_time'=>$data['from_time1'],
                    'to_time'=>$data['to_time1'],
                    'moderator_id'=>$moderator['id']
                ]);
        }
        if($data['weekday2']){
            WorkingHoursModerator::create(
                ['weekday'=>2,'from_time'=>$data['from_time2'],
                    'to_time'=>$data['to_time2'],
                    'moderator_id'=>$moderator['id']
                ]);
        }
        if($data['weekday3']){
            WorkingHoursModerator::create(
                ['weekday'=>3,'from_time'=>$data['from_time3'],
                    'to_time'=>$data['to_time3'],
                    'moderator_id'=>$moderator['id']
                ]);
        }
        if($data['weekday4']){
            WorkingHoursModerator::create(
                ['weekday'=>4,'from_time'=>$data['from_time4'],
                    'to_time'=>$data['to_time4'],
                    'moderator_id'=>$moderator['id']
                ]);
        }
        if($data['weekday5']){
            WorkingHoursModerator::create(
                ['weekday'=>5,'from_time'=>$data['from_time5'],
                    'to_time'=>$data['to_time5'],
                    'moderator_id'=>$moderator['id']
                ]);
        }
        if($data['weekday6']){
        WorkingHoursModerator::create(
            ['weekday'=>6,'from_time'=>$data['from_time6'],
                'to_time'=>$data['to_time6'],
                'moderator_id'=>$moderator['id']
            ]);
        }
        if($data['weekday7']){
            WorkingHoursModerator::create(
                ['weekday'=>7,'from_time'=>$data['from_time7'],
                    'to_time'=>$data['to_time7'],
                    'moderator_id'=>$moderator['id']
                ]);
        }
//        $result = [
//            "status" => true];
//        return response()->json($result);

        return redirect('admin/moderator/')->with('message', 'Модератор добавленн');
    }

    private function getAvatarPath($photo)
    {
        $path = '/upload/moderator/';
        $fileName = str_random(8) . $photo->getClientOriginalName();
        $fullPath = public_path() . $path;
        $photo->move($fullPath, $fileName);
        return $path . $fileName;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function stop($id)
    {
        return redirect('admin/moderator/')->with('message', 'Модератор остановлен');
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
//        iModerator::first($id);
//        $data = $request->all();
//        if ($request->hasFile('photo')) {
//            $photo = $request->file('photo');
//            $path = $this->getAvatarPath($photo);
//            $data['photo'] = $path;
//        }
//
//        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
//        $moderator = Moderator::create($data);
//        if($data['weekday1']){
//            WorkingHoursModerator::create(
//                ['weekday'=>1,'from_time'=>$data['from_time1'],
//                    'to_time'=>$data['to_time1'],
//                    'moderator_id'=>$moderator['id']
//                ]);
//        }
//        if($data['weekday2']){
//            WorkingHoursModerator::create(
//                ['weekday'=>2,'from_time'=>$data['from_time2'],
//                    'to_time'=>$data['to_time2'],
//                    'moderator_id'=>$moderator['id']
//                ]);
//        }
//        if($data['weekday3']){
//            WorkingHoursModerator::create(
//                ['weekday'=>3,'from_time'=>$data['from_time3'],
//                    'to_time'=>$data['to_time3'],
//                    'moderator_id'=>$moderator['id']
//                ]);
//        }
//        if($data['weekday4']){
//            WorkingHoursModerator::create(
//                ['weekday'=>4,'from_time'=>$data['from_time4'],
//                    'to_time'=>$data['to_time4'],
//                    'moderator_id'=>$moderator['id']
//                ]);
//        }
//        if($data['weekday5']){
//            WorkingHoursModerator::create(
//                ['weekday'=>5,'from_time'=>$data['from_time5'],
//                    'to_time'=>$data['to_time5'],
//                    'moderator_id'=>$moderator['id']
//                ]);
//        }
//        if($data['weekday6']){
//            WorkingHoursModerator::create(
//                ['weekday'=>6,'from_time'=>$data['from_time6'],
//                    'to_time'=>$data['to_time6'],
//                    'moderator_id'=>$moderator['id']
//                ]);
//        }
//        if($data['weekday7']){
//            WorkingHoursModerator::create(
//                ['weekday'=>7,'from_time'=>$data['from_time7'],
//                    'to_time'=>$data['to_time7'],
//                    'moderator_id'=>$moderator['id']
//                ]);
//        }
//        $result = [
//            "status" => true];
//        return response()->json($result);

        return redirect('admin/moderator/')->with('message', 'Модератор изменен');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
