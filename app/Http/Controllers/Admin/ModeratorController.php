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
        $moderators = Moderator::where('is_stop',false)->get();
        $working_hours = WorkingHoursModerator::all();
        return view('admin.moderator.index',['moderators'=>$moderators,'working_hours'=>$working_hours]);
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
        $from_time = $data['from_time'];
        $to_time = $data['to_time'];
        $weekday = $data['weekday'];
        if (isset ($weekday[1]) && $weekday[1]=='on'){
            WorkingHoursModerator::create(
                ['weekday'=>1,'from_time'=>$from_time[1],
                    'to_time'=>$to_time[1],
                    'moderator_id'=>$moderator['id']
                    ]);
            };

        if (isset ($weekday[2]) && $weekday[2]=='on'){
            WorkingHoursModerator::create(
                ['weekday'=>2,'from_time'=>$from_time[2],
                    'to_time'=>$to_time[2],
                    'moderator_id'=>$moderator['id']
                ]);
        };

        if (isset ($weekday[3]) && $weekday[3]=='on'){
            WorkingHoursModerator::create(
                ['weekday'=>3,'from_time'=>$from_time[3],
                    'to_time'=>$to_time[3],
                    'moderator_id'=>$moderator['id']
                ]);
        };

        if (isset ($weekday[4]) && $weekday[4]=='on'){
            WorkingHoursModerator::create(
                ['weekday'=>4,'from_time'=>$from_time[4],
                    'to_time'=>$to_time[4],
                    'moderator_id'=>$moderator['id']
                ]);
        };

        if (isset ($weekday[5]) && $weekday[5]=='on'){
            WorkingHoursModerator::create(
                ['weekday'=>5,'from_time'=>$from_time[5],
                    'to_time'=>$to_time[5],
                    'moderator_id'=>$moderator['id']
                ]);
        };

        if (isset ($weekday[6]) && $weekday[6]=='on'){
            WorkingHoursModerator::create(
                ['weekday'=>6,'from_time'=>$from_time[6],
                    'to_time'=>$to_time[6],
                    'moderator_id'=>$moderator['id']
                ]);
        };

        if (isset ($weekday[7]) && $weekday[7]=='on'){
            WorkingHoursModerator::create(
                ['weekday'=>7,'from_time'=>$from_time[7],
                    'to_time'=>$to_time[7],
                    'moderator_id'=>$moderator['id']
                ]);
        };


//        return response()->json($data);

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
        $moderator = Moderator::find($id);
        $moderator->is_stop = !$moderator->is_stop;
        $moderator->save();

        return redirect('admin/moderator/')->with('message', 'Модератор остановлен');
    }

    public function stopped()
    {
        $moderators = Moderator::where('is_stop',true)->get();
        return view('admin.moderator.index')->with('moderators', $moderators);
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
    public function update($id)
    {
        $moderators = Moderator::find($id);
        $moderators['working_hours'] = WorkingHoursModerator::where('moderator_id',$id);
        return view('admin.moderator.update')->with('moderators', $moderators);
    }

    public function updateSave(Request $request)
    {
        $data = $request->all();
        $moderator = Moderator::find($data['id']);
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $path = $this->getAvatarPath($photo);
            $data['photo'] = $path;
            $moderator->photo = $data['photo'];
        }
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $moderator->password = $data['password'];
        $moderator->first_name = $data['first_name'];
        $moderator->last_name = $data['last_name'];
        $moderator->email = $data['email'];
        $moderator->save();

        //$moderators['working_hours'] = WorkingHoursModerator::where('moderator_id',$id);
        return redirect('/admin/moderator/')->with('message', 'Модератор изменен');
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
