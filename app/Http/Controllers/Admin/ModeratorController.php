<?php

namespace App\Http\Controllers\Admin;

use App\Moderator;
use App\Option;
use App\WorkingHoursModerator;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
            if (isset ($weekday[1]) && $weekday[1] == 'on') {
                $from_times = explode(":", $from_time[1]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[1]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 1)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 1, 'from_time' => $from_time[1],
                                'to_time' => $to_time[1],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.1', 'Время работы модератор в <span style="color: green; font-size: 20px;">понедельник</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.1', 'Время работы модератор в <span style="color: green; font-size: 20px;">понедельник</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            };

            if (isset ($weekday[2]) && $weekday[2] == 'on') {
                $from_times = explode(":", $from_time[2]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[2]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 2)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 2, 'from_time' => $from_time[2],
                                'to_time' => $to_time[2],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.2', 'Время работы модератор во <span style="color: green; font-size: 20px;">вторник</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.2', 'Время работы модератор во <span style="color: green; font-size: 20px;">вторник</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            };

            if (isset ($weekday[3]) && $weekday[3] == 'on') {
                $from_times = explode(":", $from_time[3]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[3]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 3)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 3, 'from_time' => $from_time[3],
                                'to_time' => $to_time[3],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.3', 'Время работы модератор в <span style="color: green; font-size: 20px;">среду</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.3', 'Время работы модератор в <span style="color: green; font-size: 20px;">среду</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            };

            if (isset ($weekday[4]) && $weekday[4] == 'on') {
                $from_times = explode(":", $from_time[4]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[4]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 4)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 4, 'from_time' => $from_time[4],
                                'to_time' => $to_time[4],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.4', 'Время работы модератор в <span style="color: green; font-size: 20px;">четверг</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.4', 'Время работы модератор в <span style="color: green; font-size: 20px;">четверг</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            };

            if (isset ($weekday[5]) && $weekday[5] == 'on') {
                $from_times = explode(":", $from_time[5]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[5]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 5)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 5, 'from_time' => $from_time[5],
                                'to_time' => $to_time[5],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.5', 'Время работы модератор в <span style="color: green; font-size: 20px;">пятницу</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.5', 'Время работы модератор в <span style="color: green; font-size: 20px;">пятницу</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            };

            if (isset ($weekday[6]) && $weekday[6] == 'on') {
                $from_times = explode(":", $from_time[6]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[6]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 6)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 6, 'from_time' => $from_time[6],
                                'to_time' => $to_time[6],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.6', 'Время работы модератор в <span style="color: green; font-size: 20px;">субботу</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.6', 'Время работы модератор в <span style="color: green; font-size: 20px;">субботу</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            };

            if (isset ($weekday[0]) && $weekday[0] == 'on') {
                $from_times = explode(":", $from_time[0]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[0]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 0)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 0, 'from_time' => $from_time[0],
                                'to_time' => $to_time[0],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.7', 'Время работы модератор в <span style="color: green; font-size: 20px;">воскресенье</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.7', 'Время работы модератор в <span style="color: green; font-size: 20px;">воскресенье</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            };
        }
        catch (\Exception $ex) {
            session()->put('message', 'Ошибка !!! Модератор не добавленн');
            return redirect()->back();
        }

        return redirect('admin/moderator/');//->with('message', 'Модератор добавленн');
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
            if (isset ($weekday[1]) && $weekday[1] == 'on') {
                WorkingHoursModerator::where(['weekday' => 1, 'moderator_id' => $moderator['id']])->delete();
                $from_times = explode(":", $from_time[1]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[1]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 1)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 1, 'from_time' => $from_time[1],
                                'to_time' => $to_time[1],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.1', 'Время работы модератор в <span style="color: green; font-size: 20px;">понедельник</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.1', 'Время работы модератор в <span style="color: green; font-size: 20px;">понедельник</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            } else {
                WorkingHoursModerator::where(['weekday' => 1, 'moderator_id' => $moderator['id']])->delete();
            };

            if (isset ($weekday[2]) && $weekday[2] == 'on') {
                WorkingHoursModerator::where(['weekday' => 2, 'moderator_id' => $moderator['id']])->delete();
                $from_times = explode(":", $from_time[2]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[2]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 2)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 2, 'from_time' => $from_time[2],
                                'to_time' => $to_time[2],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.2', 'Время работы модератор во <span style="color: green; font-size: 20px;">вторник</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.2', 'Время работы модератор во <span style="color: green; font-size: 20px;">вторник</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            } else {
                WorkingHoursModerator::where(['weekday' => 2, 'moderator_id' => $moderator['id']])->delete();
            };


            if (isset ($weekday[3]) && $weekday[3] == 'on') {
                WorkingHoursModerator::where(['weekday' => 3, 'moderator_id' => $moderator['id']])->delete();
                $from_times = explode(":", $from_time[3]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[3]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 3)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 3, 'from_time' => $from_time[3],
                                'to_time' => $to_time[3],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.3', 'Время работы модератор в <span style="color: green; font-size: 20px;">среду</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.3', 'Время работы модератор в <span style="color: green; font-size: 20px;">среду</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            } else {
                WorkingHoursModerator::where(['weekday' => 3, 'moderator_id' => $moderator['id']])->delete();
            };


            if (isset ($weekday[4]) && $weekday[4] == 'on') {
                WorkingHoursModerator::where(['weekday' => 4, 'moderator_id' => $moderator['id']])->delete();
                $from_times = explode(":", $from_time[4]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[4]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 4)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 4, 'from_time' => $from_time[4],
                                'to_time' => $to_time[4],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.4', 'Время работы модератор в <span style="color: green; font-size: 20px;">четверг</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.4', 'Время работы модератор в <span style="color: green; font-size: 20px;">четверг</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            } else {
                WorkingHoursModerator::where(['weekday' => 4, 'moderator_id' => $moderator['id']])->delete();
            };


            if (isset ($weekday[5]) && $weekday[5] == 'on') {
                WorkingHoursModerator::where(['weekday' => 5, 'moderator_id' => $moderator['id']])->delete();
                $from_times = explode(":", $from_time[5]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[5]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 5)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 5, 'from_time' => $from_time[5],
                                'to_time' => $to_time[5],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.5', 'Время работы модератор в <span style="color: green; font-size: 20px;">пятницу</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.5', 'Время работы модератор в <span style="color: green; font-size: 20px;">пятницу</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            } else {
                WorkingHoursModerator::where(['weekday' => 5, 'moderator_id' => $moderator['id']])->delete();
            };


            if (isset ($weekday[6]) && $weekday[6] == 'on') {
                WorkingHoursModerator::where(['weekday' => 6, 'moderator_id' => $moderator['id']])->delete();
                $from_times = explode(":", $from_time[6]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[6]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 6)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 6, 'from_time' => $from_time[6],
                                'to_time' => $to_time[6],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.6', 'Время работы модератор в <span style="color: green; font-size: 20px;">субботу</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.6', 'Время работы модератор в <span style="color: green; font-size: 20px;">субботу</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            } else {
                WorkingHoursModerator::where(['weekday' => 6, 'moderator_id' => $moderator['id']])->delete();
            };


            if (isset ($weekday[0]) && $weekday[0] == 'on') {
                WorkingHoursModerator::where(['weekday' => 0, 'moderator_id' => $moderator['id']])->delete();
                $from_times = explode(":", $from_time[0]);
                $hour = $from_times[0];
                $min = $from_times[1];
                $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
                $to_times = explode(":", $to_time[0]);
                $to_hour = $to_times[0];
                $to_min = $to_times[1];
                $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
                if ($working_time < $to_working_time) {
                    $working_hours = WorkingHoursModerator::where('weekday', 0)->get();
                    $valid = $this->valid($working_hours, $to_working_time, $working_time);
                    if ($valid == 0) {
                        WorkingHoursModerator::create(
                            ['weekday' => 0, 'from_time' => $from_time[0],
                                'to_time' => $to_time[0],
                                'moderator_id' => $moderator['id']
                            ]);
                    } else {
                        session()->put('message.7', 'Время работы модератор в <span style="color: green; font-size: 20px;">воскресенье</span> не было добавлено поскольку было указанно не коректно либо совпадает с временем работы другого модератора');
                    }
                } else {
                    session()->put('message.7', 'Время работы модератор в <span style="color: green; font-size: 20px;">воскресенье</span> не было добавлено поскольку время начала работы должно быть меньше времени окончания');
                }
            } else {
                WorkingHoursModerator::where(['weekday' => 0, 'moderator_id' => $moderator['id']])->delete();
            };

        }
        catch (\Exception $ex) {
            session()->put('message', 'Ошибка!!! Модератор не изменен');
            return redirect()->back();
        }
        $moderator->save();

        //$moderators['working_hours'] = WorkingHoursModerator::where('moderator_id',$id);
        return redirect('/admin/moderator/');//->with('message', 'Модератор изменен');
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
//        $moderators = Moderator::where('is_stop',false)->get();
//        $working_hours = WorkingHoursModerator::all();
//        return view('admin.moderator.index',['moderators'=>$moderators,'working_hours'=>$working_hours,'url'=>'New']);
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
//            if ($working_time != $working_time1 and $to_working_time != $to_working_time1) {
//                $i += 0;
//            } else {
//                $i += 1;
//            }
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
        return view('admin.moderator.update')->with('moderators', $moderators);
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
