<?php
	
$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {

	$api->post('auth/login', 'App\Api\V1\Controllers\AuthController@login');
	$api->post('auth/signup', 'App\Api\V1\Controllers\AuthController@signup');
	$api->post('auth/recovery', 'App\Api\V1\Controllers\AuthController@recovery');
	$api->post('auth/reset', 'App\Api\V1\Controllers\AuthController@reset');

	// example of protected route
	$api->get('protected', ['middleware' => ['api.auth'], function () {		
		return \App\User::all();
    }]);

	// example of free route
	$api->get('free', function() {
		return \App\User::all();
	});

	$api->group(['middleware' => 'api.auth'], function ($api) {
		$api->get('section', 'App\Api\V1\Controllers\SectionController@index');
		$api->post('section/add', 'App\Api\V1\Controllers\SectionController@add');
		$api->get('section/{id}', 'App\Api\V1\Controllers\SectionController@get');
		$api->post('section/{id}', 'App\Api\V1\Controllers\SectionController@update');
		$api->delete('section/{id}', 'App\Api\V1\Controllers\SectionController@delete');


		$api->get('subject', 'App\Api\V1\Controllers\SubjectController@index');
		$api->post('subject/add', 'App\Api\V1\Controllers\SubjectController@add');
		$api->get('subject/{id}', 'App\Api\V1\Controllers\SubjectController@get');
		$api->post('subject/{id}', 'App\Api\V1\Controllers\SubjectController@update');
		$api->delete('subject/{id}', 'App\Api\V1\Controllers\SubjectController@delete');

		$api->get('student', 'App\Api\V1\Controllers\StudentController@index');
		$api->post('student/add', 'App\Api\V1\Controllers\StudentController@add');
		$api->get('student/{id}', 'App\Api\V1\Controllers\StudentController@get');
		$api->post('student/{id}', 'App\Api\V1\Controllers\StudentController@update');
		$api->delete('student/{id}', 'App\Api\V1\Controllers\StudentController@delete');

		$api->post('notice/send','App\Api\V1\Controllers\NoticeController@add');

		$api->post('attendance','App\Api\V1\Controllers\AttendanceController@attendanceExists');
		$api->post('attendance/add','App\Api\V1\Controllers\AttendanceController@add');
		$api->post('attendance/student','App\Api\V1\Controllers\AttendanceController@student');
	});

	$api->get('notice/{id}','App\Api\V1\Controllers\NoticeController@index');

});
