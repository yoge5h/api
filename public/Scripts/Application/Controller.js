"use strict";
angular.module('NOTICE.controllers', ['ui.bootstrap'])
.controller("HeaderController", ["$scope", "authenticationService", "$location", "template", "$uibModal", "$localStorage"
    , function ($scope, authenticationService, $location, template, $uibModal, $localStorage) {
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
        $localStorage.store('token', '');
        $location.path("/login");
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
    
    $scope.activeOnHome = function(){
        angular.forEach($scope.menuItems, function (key, value) {
            key.active = "";
        });
        $scope.menuItems[0].active = 'active';
    };

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
.controller("LandingPageController", ["$scope", "$rootScope", "sections", "messageService", function ($scope, $rootScope, sections, messageService) {
    $scope.message = {
        sendEmail: true,
        sendToMobile: false
    };
   
    $scope.uploadFile = function (files) {
        $scope.files = [];
        angular.forEach(files, function (file) {
            $scope.files.push(file);
        })
    };
    $scope.sendMessage = function () {
        messageService.sendMessage($scope.message, $scope.files).then(function (response) {
            window.Application.toast.show('success', 'Message sent successfully.');
        })
    };
    
    $scope.sections = sections;
    
}])
.controller("UserController", ["$scope", "$rootScope", "template", "users", "$uibModal", function ($scope, $rootScope, template, users, $uibModal) {
    $scope.userHeadings = ["Name", "Email", "Action"];
    $rootScope.users = users;

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
.controller("LoginController", ["$scope", "$rootScope", "authenticationService", "$localStorage", "$location", function ($scope, $rootScope, authenticationService, $localStorage, $location) {
    $scope.userInfo = {};
    $scope.doLogin = function () {
        authenticationService.signin($scope.userInfo).then(function(response){            
            $localStorage.store('token', response.data.token);
            window.location.href = "/";
        }, function(data){
            window.Application.toast.show('error', 'Invalid username or password.');
        });
        
       
    };
}])
.controller("SettingsController", ["$scope", "cacheService", function ($scope,cacheService) {
    $scope.settings = {};
    cacheService.getSetting().then(function(response){
        if(response.data.length != 0){
            $scope.settings = response.data.settings[0];
        }
    })
    $scope.saveSettings = function () {
        cacheService.saveSettings($scope.settings).then(function(response){
            window.Application.toast.show('success', 'Setting updated successfully.');
        })
    };
}])
.controller("StudentsController", ["$scope", "$rootScope", "tabs", "templates", "cacheService", "$uibModal", "sections"
    , function ($scope, $rootScope, tabs, templates, cacheService, $uibModal, sections) {
    $scope.tabs = tabs;

    $scope.sectionHeadings = ["Section Name", "Action"];
    $scope.subjectHeadings = ["Subject Code", "Subject Name", "Section","isActive", "Action"];
    $scope.studentHeadings = ["First Name", "Last Name", "Email", "Phone", "Action"];

   
    $rootScope.sections = sections;
    if (sections.length > 0) {
        $scope.selectedStudent = {
            section: $scope.sections[0].id
        };
        $scope.selectedSubject = {
            section: $scope.sections[0].id
        };
        cacheService.getStudents($scope.selectedStudent.section).then(function(response){
            $scope.students = response.data.students;
        });
        cacheService.getAllSubjectBySection($scope.selectedSubject.section).then(function(response){
            $rootScope.subjects = response.data.subjects;
        });
    }
   
    //$rootScope.subjects = subjects;
    $scope.changeActiveStatus = function(id){
        cacheService.changeActiveStatus(id).then(function(response){
            window.Application.toast.show('success', 'Status changed successfully.');
            $scope.getSubjectsForSection();
        });
    };
    
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

    $rootScope.getStudentsForSection = function () {
        cacheService.getStudents($scope.selectedStudent.section).then(function(response){
            $scope.students = response.data.students;
        });
    };

    $scope.getSubjectsForSection = function () {
        cacheService.getSubjectBySection($scope.selectedSubject.section).then(function(response){
            $rootScope.subjects = response.data.subjects;
        });
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
                },
                sections: ['cacheService', function (cacheSercice) {
                    return cacheSercice.getSections();
                }]
            }
        });
    };
}])
.controller("AttendanceController", ["$scope", "$rootScope", "sections", "cacheService", "attendanceService"
    , function ($scope, $rootScope, sections, cacheService, attendanceService) {
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
   
    $scope.sections = sections; 

    $scope.getSubjectBySection = function(){
        cacheService.getSubjectBySection($scope.attendance.section).then(function(response){
            $scope.attendance.subject = undefined;
            $scope.students = [];
            $scope.subjects = response.data.subjects;
        })
    };

    $scope.getStudents = function () {
        $scope.students = [];    
        if (typeof $scope.attendance.section == 'undefined') {
            window.Application.toast.show('error', 'Please select a section.');
            return;
        }
        if (typeof $scope.attendance.subject == 'undefined') {
            window.Application.toast.show('error', 'Please select a subject.');
            return;
        }

        var att = {
            sectionId : $scope.attendance.section,
            subjectId : $scope.attendance.subject,
            date:  $scope.attendance.date
        }

        attendanceService.isAttedanceMarked(att).then(function(response){
            if(!response.data.status){
                window.Application.toast.show('error', 'Attendance for the day and subject already marked.');
                return;
            }
            else{
                cacheService.getStudents($scope.attendance.section).then(function(response){
                    $scope.students = response.data.students;
                });
            }
        });
    };
    $scope.saveAttendance = function () {
        $scope.attendance.students = [];
        angular.forEach($scope.students, function (key, value) {
            var student = {};
            student.studentId = key.id
            if (key.isPresent)
                student.isPresent = key.isPresent;
            else
                student.isPresent = false;
            $scope.attendance.students.push(student);
        });
        attendanceService.saveAttendance($scope.attendance).then(function(response){
            $scope.students = [];
            window.Application.toast.show(response.data.status, response.data.message);
        });
    }
}])
.controller("ReportController", ["$scope", "$rootScope", "reportService", "sections",'cacheService'
    , function ($scope, $rootScope, reportService, sections,cacheService) {
    $scope.report = {
        section: -1,
        reportType:1,
        toDate: new Date(),
        fromDate: new Date(),
        isFromStart: true
    };
   
   
    $scope.sections = sections;
    $scope.ReportTypes = [
        { 'id': 1, type: 'Section Report' },
        { 'id': 2, type: 'Student Report' }
    ];
    if (sections.length > 0) {
        $scope.report.section = $scope.sections[0].id;
    }
   
    $scope.getAttendanceReport = function () {
        if (typeof $scope.report.student !== 'object' && $scope.report.reportType === 2) {
            window.Application.toast.show('error', 'Please enter a student.');
            return;
        }
        $scope.allSubjects = [];
        $scope.reportData = [];
        if ($scope.report.reportType === 1) {           
            reportService.getSectionReport($scope.report).then(function(response){                
                var attendancereportSection = [];
                angular.forEach(response.data.students, function (std, index) {
                    var report = {
                        student:'',
                        attendance:[]
                    };
                    var studentRecord = $.grep(response.data.report,function(data){
                        return data.id == std.id;
                    });
                    if(studentRecord.length > 0){
                        report.student = studentRecord[0].name;
                        angular.forEach(studentRecord, function (rec, index) {
                            var attendance = {}
                            attendance.subject = rec.subject;
                            attendance.attendance = rec.attendance;
                            report.attendance.push(attendance);
                        });
                        attendancereportSection.push(report);
                    }
                });
                $scope.reportData = attendancereportSection;
                if (attendancereportSection.length > 0) {
                    angular.forEach(attendancereportSection[0].attendance, function (item, index) {
                        if ($scope.allSubjects.indexOf(item.subject) === -1)
                            $scope.allSubjects.push(item.subject);
                    });
                };
            });
        }
        else if($scope.report.reportType === 2){
            reportService.getStudentReport($scope.report).then(function(response){
                $scope.reportData = response.data;
            });
        }
    };

    $scope.getStudents = function () {
        $scope.reportData = [];
        if($scope.report.reportType === 2){
           cacheService.getStudents($scope.report.section).then(function(response){
                 $scope.students = response.data.students;
           });
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
.controller("PasswordController", ["$scope", "$uibModalInstance", "userService", function ($scope, $uibModalInstance, userService) {
    $scope.password = {};
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.changePassword = function () {
        userService.changePassword($scope.password).then(function(response){
           window.Application.toast.show('success', 'Password changed successfully');
           $scope.close();
        },function(response){
            if(typeof response.data.errors != 'undefined'){
                $.each(response.data.errors,function(index,error){
                     window.Application.toast.show('error', error);
                })
            }
            else{
                window.Application.toast.show('error', 'An error occured duting the operation.');
            }
        });
    };
   
}])
.controller("SectionController", ["$scope", "mode", "data", "$uibModalInstance", "sectionService",'$rootScope'
    , function ($scope, mode, data, $uibModalInstance, sectionService,$rootScope) {
    $scope.section = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;
    $scope.saveSection = function () {
        if (mode === 'Add') {
            sectionService.addSection($scope.section).then(function(response){
                $rootScope.sections.push(response.data);
                window.Application.toast.show('success', 'Section added successfully.');
                $scope.close();
            },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
            });
        }
        else if (mode === 'Edit') {
            sectionService.amendSection($scope.section).then(function(response){
                window.Application.toast.show('success', 'Section updated successfully.');
                $scope.close();
            },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
            });
        }
    };
}])
.controller("SubjectController", ["$scope", "mode", "data", "$uibModalInstance", "sections", 'subjectService','$rootScope'
    , function ($scope, mode, data, $uibModalInstance, sections, subjectService,$rootScope) {
    $scope.subject = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;
   
    $scope.sections = sections;
    
    $scope.savesubject = function () {
        if (mode === 'Add') {
            subjectService.addSubject($scope.subject).then(function(response){
                $rootScope.subjects.push(response.data);
                window.Application.toast.show('success', 'Subject added successfully.');
                $scope.close();
            },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
            });
        }
        else if (mode === 'Edit') {
            subjectService.amendSubject($scope.subject).then(function(response){
                $scope.subject.section = $.grep($scope.sections,function(section){return section.id == $scope.subject.sectionId})[0];
                window.Application.toast.show('success', 'Subject updated successfully.');
                $scope.close();
            },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
            });
        }
    };

}])

.controller("StudentController", ["$scope", "mode", "data", "$uibModalInstance", "sections", "studentService","$rootScope"
    , function ($scope, mode, data, $uibModalInstance, sections, studentService,$rootScope) {
    $scope.student = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;
    
    $scope.savestudent = function () {        
        if (mode === 'Add') {
            studentService.addStudent($scope.student).then(function(response){
                $rootScope.getStudentsForSection();
                window.Application.toast.show('success', 'Student added successfully.');
                $scope.close();
            },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
            });
        }
        else if (mode === 'Edit') {
            studentService.amendStudent($scope.student).then(function(response){
                $rootScope.getStudentsForSection();
                window.Application.toast.show('success', 'Subject updated successfully.');
                $scope.close();
            },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
            });
        }
    };
   
    $scope.sections = sections;
   
}])
.controller("SaveUserController", ["$scope", "mode", "data", "$uibModalInstance", "userService",'$rootScope'
    , function ($scope, mode, data, $uibModalInstance, userService,$rootScope) {
    $scope.user = data;
    $scope.close = function () {
        $uibModalInstance.close('ok');
    };
    $scope.mode = mode;

    $scope.saveUser = function () {
        if (mode === 'Add') {           
            userService.addUser($scope.user).then(function(response){
                $rootScope.users.push(response.data);
                window.Application.toast.show('success', 'User added successfully.');
                $scope.close();
            });
        }
        else if (mode === 'Edit') {
            userService.amendUser($scope.user).then(function(response){
            window.Application.toast.show('success', 'User updated successfully.');
            $scope.close();
        },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
        });
        }
    };

    $scope.resetPassword = function() {
        userService.resetPassword($scope.user).then(function(response){
            window.Application.toast.show('success', 'Default password set for ' + data.name);
            $scope.close();
        },function(response){
                window.Application.toast.show('error', 'An error occured duting the operation.');
        });
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
        $(element).css('height', screen.height * .50 + 'px')
                  .css('overflow-y','auto')
    };    
})
.directive('customDataLoading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
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

}])
.filter('studentSearchFilter', function () {
    return function (students, search) {
        var out = [];
        if (search != undefined)
            var searchString = search.toLowerCase();
        if (!angular.isDefined(searchString) || searchString == '') {
            return students;
        }
        angular.forEach(students, function (student, index) {
            if ((student.firstName.toLowerCase().indexOf(searchString) != -1)
                || (student.lastName.toLowerCase().indexOf(searchString) != -1)                
                || ((student.firstName + ' ' + student.lastName).toLowerCase().indexOf(searchString)) != -1) {
                out.push(student);
            }
        });
        return out;
    }
});