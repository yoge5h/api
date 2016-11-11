<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['email','cc','password'];

    protected $hidden = array('created_at', 'updated_at');
}
