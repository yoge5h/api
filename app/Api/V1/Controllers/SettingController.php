<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Setting;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Requests;

class SettingController extends Controller
{
    use Helpers;
    public function index()
	{
	    return Setting::get();
	}

	public function update(Request $request)
	{
	    $count = Setting::get()->count();
	    if($count == 0){
	        $setting = new Setting;
	        $setting->cc = $request->get('cc');
	        $setting->email = $request->get('email');
	        if($setting->save())
	         return response()
        			->json(['message' => 'Setting updated successfully.', 'status' => 200]);
	    }
	    else{	 
	    	$setting = Setting::find($request->get('id'));	
		    $setting->cc = $request->get('cc');
	        $setting->email = $request->get('email');
		    if($setting->save())
		         return response()
	        			->json(['message' => 'Setting updated successfully.', 'status' => 200]);
		    else
		        return $this->response->error('could not update setting', 500);
		}
	}
}
