<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = ['sectionId','subjectId','studentId','date','isPresent'];

    protected $hidden = array('addedBy','created_at','updated_at');
}
