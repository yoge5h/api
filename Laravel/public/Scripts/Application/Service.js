"use strict";
angular.module('NOTICE.services', ['ngResource','ngStorage'])
.constant('urls', {
    base: 'http://localhost:8000/api/'
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

.factory("messageService", ["$http", function ($http) {
    return {
        sendMessage: function (message, files) {
            var targetUrl = "/Home/Message";
            return $http({
                url: targetUrl,
                method: "POST",
                headers: { "Content-Type": undefined },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("messageRequest", angular.toJson(data.messageRequest));
                    angular.forEach(data.filesRequest, function (file) {
                        formData.append("filesRequest", file);
                    })

                    return formData;

                },
                data: { messageRequest: message, filesRequest: files }
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
.factory('userService', ['$http', function ($http) {
    return {
        addUser: function (user) {

        },
        amendUser: function (user) {

        },
        resetPassword: function () {

        },
        changePassword: function (passwordInfo) {

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
    var attendancereportSection = [
            {
                student: 'Yogesh Adhikari',
                attendance: [
                    { subject: "Micro Economics", attendance: 90 },
                    { subject: "Human Resource Management", attendance: 92 },
                    { subject: "Business Management", attendance: 88 },
                    { subject: "Business Statistics", attendance: 82 },
                    { subject: "Management Accounting", attendance: 88 },
                    { subject: "Managerial Communication", attendance: 85 },
                ]
            },
            {
                student: 'Lunish Yakami',
                attendance: [
                    { subject: "Micro Economics", attendance: 94 },
                    { subject: "Human Resource Management", attendance: 82 },
                    { subject: "Business Management", attendance: 86 },
                    { subject: "Business Statistics", attendance: 83 },
                    { subject: "Management Accounting", attendance: 98 },
                    { subject: "Managerial Communication", attendance: 79 },
                ]
            }
    ];
    return {
        getAttendanceReport: function (criteria, callback) {
            if(criteria.reportType === 1)
                return callback(attendancereportSection);
            return callback(attendancereportStudent);
        },
        getStudentReport: function(criteria){
            var targeturl = urls.base + 'attendance/student';     
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
        getUsers: function () {
            
        }
    };
}])
;