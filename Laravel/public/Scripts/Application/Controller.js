"use strict";
angular.module('NOTICE.controllers', ['ui.bootstrap'])
.controller("HeaderController", ["$scope", "authenticationService", "$location", "template", "$uibModal", function ($scope, authenticationService, $location, template, $uibModal) {
    $scope.menuItems = [
        {
            id: "0",
            title: " Send Notice",
            icon: "glyphicon glyphicon-envelope",
            url: "NOTICE",
            active: ""
        },        
        {
            id: "1",
            title: " Manage Students",
            icon: "glyphicon glyphicon-book",
            url: "NOTICE.students",
            active: ""
        },
        {
            id: "2",
            title: " Attendance",
            icon: "glyphicon glyphicon-check",
            url: "NOTICE.attendance",
            active: ""
        },
        {
            id: "3",
            title: " Report",
            icon: "glyphicon glyphicon-th-list",
            url: "NOTICE.report",
            active: ""
        },
        {
            id: "4",
            title: " Users",
            icon: "glyphicon glyphicon-user",
            url: "NOTICE.users",
            active: ""
        },        
        {
            id: "5",
            title: " Settings",
            icon: "glyphicon glyphicon-cog",
            url: "NOTICE.settings",
            active: ""
        }             
    ];

    $scope.changeActiveMenu = function (id) {
        angular.forEach($scope.menuItems, function (key, value) {
            if (key.id == id)
                key.active = "active";
            else
                key.active = "";
        });
    };

    $scope.logout = function () {
        authenticationService.logout(function () {
            $location.path("/login");
            // window.location = "/"
        });
    };

    $scope.changePassword = function () {
        $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: template.passwordModal,
            controller: 'PasswordController'
        });
    };
    
    initActive(function (isChanged) {
        if (!isChanged)
            $scope.menuItems[0].active = 'active';
    });

    function initActive(callback) {
        var changed = false;
        angular.forEach($scope.menuItems, function (key, value) {
            var state = $location.path().split('/')[1];
            if (key.url.indexOf(state) != -1 && state != "") {
                key.active = "active";
                changed = true;
            }
            else
                key.active = "";
        });
        callback(changed);
    }
}])
.controller("LandingPageController", ["$scope", "$rootScope", "cacheService", "messageService", function ($scope, $rootScope, cacheService, messageService) {
    $rootScope.isLogin = false;
    $scope.message = {
        sendEmail: true
    };
    $scope.files = [];
    $scope.uploadFile = function (files) {
        angular.forEach(files, function (file) {
            $scope.files.push(file);
        })
    };
    $scope.sendMessage = function () {
        messageService.sendMessage($scope.message, $scope.files).then(function (response) {
            //debugger;
        })
    };
    cacheService.getSections(function (sections) {
        $scope.sections = sections;
    })
}])
.controller("UserController", ["$scope", "$rootScope", "template", "cacheService", "$uibModal", function ($scope, $rootScope, template, cacheService, $uibModal) {
    $rootScope.isLogin = false;
    $scope.users = {};
    $scope.userHeadings = ["User Name", "First Name", "Last Name", "Action"];
    $scope.users = cacheService.getUsers();

    $scope.addUser = function () {
        openModel(template.userModal, 'SaveUserController', {}, 'Add', 'md')
    };

    $scope.editUser = function (user) {
        openModel(template.userModal, 'SaveUserController', user, 'Edit', 'md')
    };


    function openModel(template, controller, data, mode, size) {
        $uibModal.open({
            size: size,
            templateUrl: template,
            controller: controller,
            resolve: {
                mode: function () {
                    return mode;
                },
                data: function () {
                    return data;
                }
            }
        });
    };
}])
.controller("LoginController", ["$scope", "$rootScope", "authenticationService", function ($scope, $rootScope, authenticationService) {
    $rootScope.isLogin = true;
    $scope.userInfo = {};
    $scope.doLogin = function () {
        authenticationService.signin($scope.userInfo);
    };
}])
.controller("SettingsController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.isLogin = false;
    $scope.settings = {};
    $scope.saveSettings = function () {
        console.log($scope.settings)
    };
}])
.controller("StudentsController", ["$scope", "$rootScope", "tabs", "templates", "cacheService", "$uibModal", function ($scope, $rootScope, tabs, templates, cacheService, $uibModal) {
    $rootScope.isLogin = false;
    $scope.tabs = tabs;

    $scope.sectionHeadings = ["Section Name", "Action"];
    $scope.subjectHeadings = ["Subject Code", "Subject Name", "Section", "Action"];
    $scope.studentHeadings = ["First Name", "Last Name", "Email", "Phone", "Action"];

    cacheService.getSections(function (sections) {
        $scope.sections = sections;
        if (sections.length > 0) {
            $scope.selectedStudent = {
                section: $scope.sections[0].id
            };
            $scope.students = cacheService.getStudents($scope.selectedStudent.section);
        }
    });
    $scope.subjects = cacheService.getSubjects();
      
    $scope.students = cacheService.getStudents($scope.selectedStudent.section);

    $scope.addSection = function () {
        openModel(templates.addSectionModal, 'SectionController', {}, 'Add','sm')
    };

    $scope.editSection = function (section) {
        openModel(templates.addSectionModal, 'SectionController', section, 'Edit','sm')
    };

    $scope.addSubject = function () {
        openModel(templates.addSubjectModal, 'SubjectController', {}, 'Add', 'md')
    };

    $scope.editSubject = function (subject) {
        openModel(templates.addSubjectModal, 'SubjectController', subject, 'Edit', 'md')
    };

    $scope.addStudent = function () {
        openModel(templates.addStudentModal, 'StudentController', {}, 'Add', 'md')
    };

    $scope.editStudent = function (student) {
        openModel(templates.addStudentModal, 'StudentController', student, 'Edit', 'md')
    };

    $scope.getStudentsForSection = function () {
        $scope.students = cacheService.getStudents($scope.selectedStudent.section);
    };

    function openModel(template,controller,data,mode,size) {
        $uibModal.open({
            size:size,
            templateUrl: template,
            controller: controller,
            resolve: {
                mode: function () {
                    return mode;
                },
                data: function () {
                    return data;
                }
            }
        });
    };
}])
.controller("AttendanceController", ["$scope", "$rootScope", "cacheService", function ($scope, $rootScope, cacheService) {
    $rootScope.isLogin = false;
    $scope.attendance = {
        date: new Date(),
        students:[]
    };
    $scope.students = [];
    $scope.attendanceHeadings = ["First Name", "Last Name", "Is Present"];
    $scope.openCalendar = function () {
        $scope.datePicker.opened = true;
    }
    $scope.datePicker = {
        opened: false
    };
    cacheService.getSections(function (sections) {
        $scope.sections = sections;
    });
    $scope.subjects = cacheService.getSubjects();
    $scope.getStudents = function () {       
        if (typeof $scope.attendance.section == 'undefined') {
            window.Application.toast.show('error', 'Please select a section.');
            return;
        }
        if (typeof $scope.attendance.subject == 'undefined') {
            window.Application.toast.show('error', 'Please select a subject.');
            return;
        }
        //check if attendance already exists for the day the subject.
        $scope.students = cacheService.getStudents($scope.attendance.section);
    }
    $scope.saveAttendance = function () {       
        angular.forEach($scope.students, function (key, value) {            
            var student = {};
            student.id = key.id
            if (key.isPresent)
                student.isPresent = key.isPresent;
            else
                student.isPresent = false;
            $scope.attendance.students.push(student);
        });
        console.log($scope.attendance);
    }
}])
.controller("ReportController", ["$scope", "$rootScope", "cacheService", function ($scope, $rootScope, cacheService) {
    $rootScope.isLogin = false;
    $scope.report = {
        section:-1,
        toDate: new Date(),
        fromDate: new Date(),
        isFromStart: true
    };
   
    cacheService.getSections(function (sections) {
        $scope.sections = sections;
        if (sections.length > 0) {
            $scope.report.section = $scope.sections[0].id;
        }
    });
    $scope.getAttendanceReport = function () {
        $scope.allSubjects = [];
        $scope.reportData = cacheService.getAttendanceReport();
        if ($scope.reportData.length > 0) {
            angular.forEach($scope.reportData[0].attendance, function (item, index) {
                if ($scope.allSubjects.indexOf(item.subject) === -1)
                $scope.allSubjects.push(item.subject);
            })
        };
    };
    $scope.datePickerFrom = {
        opened: false
    };
    $scope.datePickerTo = {
        opened: false
    };
    $scope.openCalendar = function (target) {
        if (target === 'From')
            $scope.datePickerFrom.opened = true;
        else if (target === 'To')
            $scope.datePickerTo.opened = true;
    };
    

}])
.controller("PasswordController", ["$scope",  "$uibModalInstance", function ($scope,  $uibModalInstance) {
    $scope.password = {};
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.changePassword = function () {
        console.log($scope.password);
    };
   
}])
.controller("SectionController", ["$scope", "mode","data", "$uibModalInstance", function ($scope, mode, data, $uibModalInstance) {
    $scope.section = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;
    $scope.saveSection = function () {
        console.log($scope.section);
    };
}])
.controller("SubjectController", ["$scope", "mode", "data", "$uibModalInstance", "cacheService", function ($scope, mode, data, $uibModalInstance, cacheService) {
    $scope.subject = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;
    cacheService.getSections(function (sections) {
        $scope.sections = sections;
    });
    $scope.savesubject = function () {
        console.log($scope.subject);
    };

}])

.controller("StudentController", ["$scope", "mode", "data", "$uibModalInstance", "cacheService", function ($scope, mode, data, $uibModalInstance, cacheService) {
    $scope.student = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;
    
    $scope.savestudent = function () {
        console.log($scope.student);
    };
    cacheService.getSections(function (sections) {
        $scope.sections = sections;
    });
}])
.controller("SaveUserController", ["$scope", "mode", "data", "$uibModalInstance", function ($scope, mode, data, $uibModalInstance) {
    $scope.user = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;

    $scope.saveUser = function () {
        console.log($scope.user);
    };

    $scope.resetPassword = function () {
        console.log($scope.user);
    };
}])

.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return val != null ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push(function (val) {
                return val != null ? '' + val : null;
            });
        }
    };
})

.directive('setMaxHeight', function () {
    return function (scope, element, attrs) {
        $(element).css('height', screen.height * .55 + 'px')
                  .css('overflow-y','auto')
    };    
})
.directive('customDataLoading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                console.log('watched')
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };

}]);



