<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['name'];

    protected $hidden = array('created_at', 'updated_at');

    public function subjects()
	{
	    return $this->hasMany('App\Subject');
	}

	public function students()
	{
	    return $this->hasMany('App\Student');
	}
}
