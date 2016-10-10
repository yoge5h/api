<?php

namespace App\Api\V1\Controllers;
use JWTAuth;
use App\Subscription;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Requests;

class SubscriptionController extends Controller
{
	use Helpers;
    public function save(Request $request)
	{
	    $subscription = Subscription::firstOrNew(array('deviceId' => $request->get('deviceId')));
		$subscription->deviceId = $request->get('deviceId');
		$subscription->save();
	}
}
