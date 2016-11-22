<?php

namespace App\Http\Controllers\Admin;

use App\Jobs\Job;
use App\Moderator;
use App\Option;
use App\WorkingHoursModerator;
use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class ModeratorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $option = Option::first();
        $moderators = Moderator::where('is_stop',false)->get();
        $working_hours = WorkingHoursModerator::all();
        return view('admin.moderator.index',['moderators'=>$moderators,'working_hours'=>$working_hours, 'option'=>$option, 'url'=>'New']);
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
//            Session::put('main_error', 'Email уже используется другим модератором!');
            return view('admin.moderator.create',['exist_mod'=>'Email уже используется другим модератором']);
    }
        $data = $request->all();
//        dd($data);
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $path = $this->getAvatarPath($photo);
            $data['photo'] = $path;
        }
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $moderator = Moderator::create($data);
        try {
            if (isset($data['from_time'])) {
                $from_time = $data['from_time'];
            }
            if (isset($data['to_time'])) {
                $to_time = $data['to_time'];
            }
            if (isset($data['weekday'])) {
                $weekday = $data['weekday'];
            }

            for ($i = 0; $i < 7; $i++) {
                switch ($i) {
                    case 0:
                        $day = 'воскресенье';
                        break;
                    case 1:
                        $day = 'понедельник';
                        break;
                    case 2:
                        $day = 'вторник';
                        break;
                    case 3:
                        $day = 'среда';
                        break;
                    case 4:
                        $day = 'четверг';
                        break;
                    case 5:
                        $day = 'пятница';
                        break;
                    case 6:
                        $day = 'суббота';
                        break;
                }
                if (isset ($weekday[$i]) && $weekday[$i] == 'on' && $from_time != '' && $to_time != '') {
                    $from_times = explode(":", $from_time[$i]);
                    $hour = $from_times[0];
                    $min = $from_times[1];
                    $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                    $to_times = explode(":", $to_time[$i]);
                    $to_hour = $to_times[0];
                    $to_min = $to_times[1];
                    $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                    Session::put('remember_user', $data);
                    if ($working_time < $to_working_time) {
                        $working_hours = WorkingHoursModerator::where('weekday', $i)->get();
                        for($j = 0; $j < count($working_hours); $j++) {

                            if ($to_time[$i] > $working_hours[$j]->from_time &&
                                $to_time[$i] < $working_hours[$j]->to_time ||
                                $from_time[$i] > $working_hours[$j]->from_time &&
                                $from_time[$i] < $working_hours[$j]->to_time
                            ) {
                                $moderator_info = Moderator::find($working_hours[$j]->moderator_id);
                                $error = 'Время работы модераторa в '. $day . ' не было добавлено поскольку выбранный период ('. $from_time[$i] .' - '. $to_time[$i] .') совпадает с существующим рабочим временем ('. $working_hours[$j]->from_time .' - '. $working_hours[$j]->to_time .') модератора ' . $moderator_info->last_name . ' ' . $moderator_info->first_name;

                                Session::put('main_error', $error);
                                return view('admin.moderator.create');
                            } else {
                                $start_time = $from_time[$i];
                                $end_time = $to_time[$i];
                            }

                        }
                        WorkingHoursModerator::create([
                            'weekday' => $i,
                            'from_time' => $start_time,
                            'to_time' => $end_time,
                            'moderator_id' => $moderator->id
                        ]);

                    } else {
                        $second_error = 'Время работы модераторa в ' . $day . ' не было добавлено поскольку время начала работы ('. $from_time[$i] .') должно быть меньше времени окончания ('. $to_time[$i] .')';
                        session()->put('error', $second_error);
                        return view('admin.moderator.create');
                    }
                }
            }
        }
        catch (\Exception $ex) {
            session()->put('message', 'Ошибка!!! Модератор не изменен');
            return view('admin.moderator.create');
        }

        return redirect('admin/moderator/');
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
        if(isset($data['from_time'])) {
            $from_time = $data['from_time'];
        }
        if(isset($data['to_time'])) {
            $to_time = $data['to_time'];
        }
        if(isset($data['weekday'])) {
            $weekday = $data['weekday'];
        }
        try {
            for ($i = 0; $i < 7; $i++) {
                switch ($i) {
                    case 0:
                        $day = 'воскресенье';
                        break;
                    case 1:
                        $day = 'понедельник';
                        break;
                    case 2:
                        $day = 'вторник';
                        break;
                    case 3:
                        $day = 'среда';
                        break;
                    case 4:
                        $day = 'четверг';
                        break;
                    case 5:
                        $day = 'пятница';
                        break;
                    case 6:
                        $day = 'суббота';
                        break;
                }

                if (isset ($weekday[$i]) && $weekday[$i] == 'on') {
                    $moderator_date = WorkingHoursModerator::where(['weekday' => $i, 'moderator_id' => $moderator['id']])->first();

                    WorkingHoursModerator::where(['weekday' => $i, 'moderator_id' => $moderator['id']])->delete();
                    $from_times = explode(":", $from_time[$i]);
                    $hour = $from_times[0];
                    $min = $from_times[1];
                    $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                    $to_times = explode(":", $to_time[$i]);
                    $to_hour = $to_times[0];
                    $to_min = $to_times[1];
                    $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                    if ($working_time < $to_working_time) {
                        $working_hours = WorkingHoursModerator::where('weekday', $i)->get();
                        for($j = 0; $j < count($working_hours); $j++) {

                            if ($to_time[$i] > $working_hours[$j]->from_time &&
                                $to_time[$i] < $working_hours[$j]->to_time ||
                                $from_time[$i] > $working_hours[$j]->from_time &&
                                $from_time[$i] < $working_hours[$j]->to_time
                            ) {
                                $moderator_info = Moderator::find($working_hours[$j]->moderator_id);
                                $error = 'Время работы модераторa в '. $day . ' не было добавлено поскольку выбранный период ('. $from_time[$i] .' - '. $to_time[$i] .') совпадает с существующим рабочим временем ('. $working_hours[$j]->from_time .' - '. $working_hours[$j]->to_time .') модератора ' . $moderator_info->last_name . ' ' . $moderator_info->first_name;

                                Session::put('main_error', $error);
                                WorkingHoursModerator::create([
                                    'weekday' => $moderator_date['weekday'],
                                    'from_time' => $moderator_date['from_time'],
                                    'to_time' => $moderator_date['to_time'],
                                    'moderator_id' => $moderator_date['moderator_id']
                                ]);
                                return redirect()->back();
                            } else {
                                $start_time = $from_time[$i];
                                $end_time = $to_time[$i];
                            }
                        }
                        $period = WorkingHoursModerator::where(['weekday' => $i, 'moderator_id' => $moderator['id']])->first();
                        if (isset($period)) {
                            $period->from_time = $start_time;
                            $period->to_time = $end_time;
                            $period->save();
                        } else {
                            WorkingHoursModerator::create([
                                'weekday' => $i,
                                'from_time' => $from_time[$i],
                                'to_time' => $to_time[$i],
                                'moderator_id' => $moderator['id']
                            ]);
                        }
                    } else {
                        WorkingHoursModerator::create([
                            'weekday' => $moderator_date['weekday'],
                            'from_time' => $moderator_date['from_time'],
                            'to_time' => $moderator_date['to_time'],
                            'moderator_id' => $moderator_date['moderator_id']
                        ]);
                        $second_error = 'Время работы модераторa в ' . $day . ' не было добавлено поскольку время начала работы ('. $from_time[$i] .') должно быть меньше времени окончания ('. $to_time[$i] .')';
                        session()->put('error', $second_error);
                        return redirect()->back();
                    }
                } else {
                    WorkingHoursModerator::where(['weekday' => $i, 'moderator_id' => $moderator['id']])->delete();
                };
            }
        }
        catch (\Exception $ex) {
            session()->put('message', 'Ошибка!!! Модератор не изменен');
            return redirect()->back();
        }
        $moderator->save();

        return redirect('/admin/moderator/');
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
        $option = Option::first();
        $moderators = Moderator::where('is_stop',true)->get();
        $working_hours = WorkingHoursModerator::all();
        return view('admin.moderator.index',['moderators'=>$moderators,'working_hours'=>$working_hours,'url'=>'Stopped','option'=>$option]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function valid($working_hours,$to_working_time,$working_time)
    {
        $i = 0;
        foreach ($working_hours as $working_hour) {
            $from_time1 = explode(":", $working_hour['from_time']);
            $hour1 = $from_time1[0];
            $min1 = $from_time1[1];
            $working_time1 = Carbon::create(null, null, null, $hour1, $min1, 0, NULL)->timestamp;
            $to_time1 = explode(":", $working_hour['to_time']);
            $to_hour1 = $to_time1[0];
            $to_min1 = $to_time1[1];
            $to_working_time1 = Carbon::create(null, null, null, $to_hour1, $to_min1, 0, NULL)->timestamp;
            if ($working_time <= $working_time1 or $working_time >= $to_working_time1) {
                $i += 0;
            } else {
                $i += 1;
            }
            if ($working_time < $working_time1 and $to_working_time > $to_working_time1) {
                $i += 1;
            } else {
                $i += 0;
            }
            if ($to_working_time <= $working_time1 or $to_working_time >= $to_working_time1) {
                $i += 0;
            } else {
                $i += 1;
            }
        }
        return $i;
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
        $moderators['working_hours'] = WorkingHoursModerator::where('moderator_id',$id)->get();
        return view('/admin/moderator/update')->with('moderators', $moderators);
    }

    public function update_inspection(Request $request)
    {
        $option = Option::first();
        $option->inspection_moderator = $request->input('inspection_moderator');
        $option->save();
        return redirect('/admin/moderator/')->with('message', 'Время измененно');
    }

    public function destroy($id)
    {
        Moderator::find($id)->delete();
        WorkingHoursModerator::where('moderator_id',$id)->delete();
        return redirect('/admin/moderator/')->with('message', 'Модератор удаленн');
    }
}
