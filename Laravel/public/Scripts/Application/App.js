"use strict";
angular.module("NOTICE", ["ui.router", "NOTICE.controllers", "NOTICE.services", 'ngStorage'])
.config(["$stateProvider", "$urlRouterProvider","$httpProvider", function ($stateProvider, $urlRouterProvider,$httpProvider) {
    $stateProvider
        .state('NOTICE', {
            url: '/',
            views: {
                'header':{
                    templateUrl: "Templates/header.html",
                    controller: "HeaderController",
                    resolve: {
                        template: function () {
                            return { 
                                passwordModal: "Templates/Modal/changePassword.html"
                            }
                            
                        }
                    }
                },
                'content': {
                    templateUrl: "Templates/notice.html",
                    controller: "LandingPageController"
                },
                'footer': {
                    templateUrl: "Templates/footer.html"
                }
            }
        })
        .state('NOTICE.login', {
            url: 'login',
            views: {
                'content@': {
                    templateUrl: "Templates/login.html",
                    controller: "LoginController"
                }
            }
        })
        .state('NOTICE.settings', {
            url: 'settings',
            views: {
                'content@': {
                    templateUrl: "Templates/settings.html",
                    controller: "SettingsController"
                }
            }
        })
        .state('NOTICE.attendance', {
            url: 'attendance',
            views: {
                'content@': {
                    templateUrl: "Templates/attendance.html",
                    controller: "AttendanceController"
                }
            }
        })
        .state('NOTICE.report', {
            url: 'report',
            views: {
                'content@': {
                    templateUrl: "Templates/report.html",
                    controller: "ReportController"
                }
            }
        })
        .state('NOTICE.students', {
            url: 'students',
            views: {
                'content@': {
                    templateUrl: "Templates/students.html",
                    controller: "StudentsController",
                    resolve: {
                        tabs: function(){
                            return [
                                { title: "Sections", template: "Templates/section.html"},
                                { title: "Subjects", template: "Templates/subject.html"},
                                { title: "Students", template: "Templates/student-list.html"}
                            ]
                        },
                        templates: function () {
                            return {
                                addSectionModal: 'Templates/Modal/addSection.html',
                                addSubjectModal: 'Templates/Modal/addSubject.html',
                                addStudentModal: 'Templates/Modal/addStudent.html'
                            }
                        }
                    }
                }
            }
        })
        .state('NOTICE.users', {
            url: 'users',
            views: {
                'content@': {
                    templateUrl: "Templates/users.html",
                    controller: "UserController",
                    resolve: {
                        template: function () {
                            return {
                                userModal: "Templates/Modal/addUser.html"
                            }

                        }
                    }
                }
            }
        })
        
    $urlRouterProvider.otherwise("/");



    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);
}])

.run(function () {
    window.Application = window.Application || {};

    $(document).on('click', '.navbar-collapse.in', function (e) {
        if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
            $(this).collapse('hide');
        }
    });

    window.Application.toast = (function ($, toastr) {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": "500",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        $(document).on("showToast", function (e, data) {
            var m = data.message;
            switch (data.type) {
                case "error":
                    toastr.error(m);
                    return;
                case "success":
                    toastr.success(m);
                    return;
                case "warning":
                    toastr.warning(m);
                    return;
            }
        });

        var showToast = function (type, message) {
            $(document).trigger("showToast", { type: type, message: message });
        };

        var toast = {
            show: showToast
        };

        return toast;

    })(jQuery, toastr);
});
