<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = ['deviceId','sectionId'];

    protected $hidden = array('created_at', 'updated_at');
   
}
