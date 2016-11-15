<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = ['firstName','lastName','phone','email','sectionId'];

    protected $hidden = array('created_at', 'updated_at');

    public function section()
    {
        return $this->belongsTo('App\Section', 'sectionId');
    }
}
