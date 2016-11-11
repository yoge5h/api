"use strict";
angular.module('NOTICE.services', ['ngResource','ngStorage'])
.constant('urls', {
    base: 'http://192.168.1.78:8000/api/'
})
.factory('authenticationService', ['$http', '$localStorage', 'urls', function ($http, $localStorage, urls) {
    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    };

    function getClaimsFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    };

    var tokenClaims = getClaimsFromToken();

    return {
        signup: function (data) {
            return $http.post(urls.base + 'auth/signup', data);
        },
        signin: function (data, success, error) {
            var targeturl = urls.base + 'auth/login'
            return $http.post(targeturl, data);
            //console.log(data);
        },       
        getTokenClaims: function () {
            return tokenClaims;
        }
    };
}])

.factory("messageService", ["$http",'urls', function ($http,urls) {
    return {
        sendMessage: function (message, files) {
            var targeturl = urls.base + 'notice/send';
            var noOfFiles = files.length;
            var formData = new FormData();
            formData.append("to", message.to);
            formData.append("subject", message.subject);  
            formData.append("message", message.message); 
            formData.append("sendEmail", message.sendEmail);
            formData.append("sendToMobile", message.sendToMobile)
            for (var i=0; i < noOfFiles; i++) {
              formData.append("file_" + i, files[i]); 
            };
            formData.append("noOfFiles",noOfFiles);
            return $http.post(targeturl,formData,{
                  withCredentials: true,
                  headers: {'Content-Type': undefined },
                  transformRequest: angular.identity
              })
        }
    };
}])
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])
.factory('attendanceService', ['$http', 'urls', function ($http, urls) {
    return {
        saveAttendance: function (attendance) {
            var targeturl = urls.base + 'attendance/add';
            return $http.post(targeturl,attendance);
        },
        isAttedanceMarked : function(attendance){
            var targeturl = urls.base + 'attendance';
            return $http.post(targeturl,attendance);
        }
    };
}])
.factory('userService', ['$http','urls','$localStorage', function ($http,urls,$localStorage) {
    return {
        addUser: function (user) {
            user.password = 'Nepal@123'
            var targeturl = urls.base + 'auth/signup';
            return $http.post(targeturl,user);
        },
        amendUser: function (user) {
            var targeturl = urls.base + 'auth/update';
            return $http.post(targeturl,user);
        },
        resetPassword: function (userInfo) {
            userInfo.password = 'Nepal@123';
            var targeturl = urls.base + 'auth/resetPassword';
            return $http.post(targeturl,userInfo);
        },
        changePassword: function (passwordInfo) {
            var targeturl = urls.base + 'auth/changePassword';
            return $http.post(targeturl,passwordInfo);
        }
    }
}])
.factory('studentService', ['$http', 'urls', function ($http, urls) {
    return {
        addStudent: function (student) {
            var targeturl = urls.base + 'student/add';
            return $http.post(targeturl,student);
        },
        amendStudent: function (student) {
            var targeturl = urls.base + 'student/' + student.id;
            return $http.post(targeturl,student);
        },
        getStudentsBySection: function (sectionId) {

        }
    };
}])
.factory('subjectService', ['$http', 'urls',  function ($http, urls) {
    return {
        addSubject: function (subject) {
            var targeturl = urls.base + 'subject/add';
            return $http.post(targeturl,subject);
        },
        amendSubject: function (subject) {
            var targeturl = urls.base + 'subject/' + subject.id;
            return $http.post(targeturl,subject);
        }
    };
}])
.factory('sectionService', ['$http', 'urls', function ($http, urls) {
    return {
        addSection: function (section) {
            var targeturl = urls.base + 'section/add';
            return $http.post(targeturl,section);
        },
        amendSection: function (section) {
            var targeturl = urls.base + 'section/' + section.id;
            return $http.post(targeturl,section);
        }
    };
}])
.factory('reportService', ['$http','urls', function ($http,urls) {   
    return {
        getAttendanceReport: function (criteria, callback) {
            if(criteria.reportType === 1)
                return callback(attendancereportSection);
            return callback(attendancereportStudent);
        },
        getStudentReport: function(criteria){
            var targeturl = urls.base + 'attendance/student';     
            return $http.post(targeturl,criteria);
        },
        getSectionReport: function(criteria){
            var targeturl = urls.base + 'attendance/section';     
            return $http.post(targeturl,criteria);
        }
    }
}])
.factory("cacheService", ["$http",'urls','$localStorage', function ($http,urls,$localStorage) {
    return {
        refreshcache:function(type){
            
        },
        getSections: function () {
            var targeturl = urls.base + 'section';     
            return $http.get(targeturl).then(function(response){
                var sections = response.data.sections;
                return sections;
            },function(response){
                return [];
            });
        },
        getSubjects: function () {
            var targeturl = urls.base + 'subject';
            return $http.get(targeturl).then(function(response){
                var subjects = response.data.subjects;
                return subjects;
            });
        },
        getStudents: function (id) {
            var targeturl = urls.base + 'student/' + id;                         
            return $http.get(targeturl);
        },
        getSubjectBySection: function(id){
            var targeturl = urls.base + 'subject/' + id;
            return $http.get(targeturl);
        },
        getAllSubjectBySection: function(id){
            var targeturl = urls.base + 'allSubjects/' + id;
            return $http.get(targeturl);
        },
        getUsers: function () {
            var targeturl = urls.base + 'users';
            return $http.get(targeturl).then(function(response){
                return response.data.users;
            });
        },
        changeActiveStatus: function(id){
            var targeturl = urls.base + 'subject/changeActiveStatus/' + id;
            return $http.get(targeturl);
        },
        getSetting: function(){
            var targeturl = urls.base + 'setting';
            return $http.get(targeturl);
        },
        saveSettings: function(setting){
            var targeturl = urls.base + 'setting';
            return $http.post(targeturl,setting);
        }
    };
}]);