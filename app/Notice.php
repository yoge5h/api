<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = ['subject','message','sectionId','created_at'];

    protected $hidden = array('addedBy','updated_at');
}
