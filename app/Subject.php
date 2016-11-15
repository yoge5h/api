<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name','code','sectionId','isActive'];

    protected $hidden = array('created_at', 'updated_at');

    public function section()
    {
        return $this->belongsTo('App\Section', 'sectionId');
    }
}
