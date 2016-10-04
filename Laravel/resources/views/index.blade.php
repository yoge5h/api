<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notice</title>
        <!--[if lt IE 9]>
        <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        <link href="Content/bootstrap.min.css" rel="stylesheet" />
        <link href="Content/site.css" rel="stylesheet" />
        <link href="Content/toastr.min.css" rel="stylesheet" />

        <link rel="shortcut icon" href="favicon-bell-o.ico" type="image/vnd.microsoft.icon" />
    </head>
    <body ng-app="NOTICE">
        <div custom-data-loading class="loading"></div>
        <div ui-view="header"></div>
        <div ui-view="content"></div>
        <div ui-view="footer"></div>
        
        <script src="Scripts/jquery-1.9.1.min.js"></script>
        <script src="Scripts/bootstrap.min.js"></script>
        <script src="Scripts/angular.min.js"></script>
        <script src="Scripts/angular-ui-router.min.js"></script>
        <script src="Scripts/angular-resource.min.js"></script>
        <script src="Scripts/Application/angular-storage.js"></script>
        <script src="Scripts/toastr.min.js"></script>
        <script src="Scripts/ui-bootstrap-tpls-2.1.3.min.js"></script>

        <script src="Scripts/Application/App.js"></script>
        <script src="Scripts/Application/Controller.js"></script>
        <script src="Scripts/Application/Service.js"></script>

    </body>
</html>
