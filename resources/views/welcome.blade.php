<!DOCTYPE html>
<html lang="en" ng-app="placePeopleApp">
<head>
    <meta charset="UTF-8">
    <title>Place People</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <link href="../../css/style.css" rel="stylesheet">
    <link href="../../css/settings.css" rel="stylesheet">
</head>
<body ng-controller="mainCtrl" ng-class="bodyClass">
    <div id="wrapper" ui-view></div> 
    <!-- Scripts -->
    <script src="../../app/libs/angular.min.js"></script>
    <script src="../../app/libs/angular-ui-router.min.js"></script>
    <script src="../../app/libs/ngDialog.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../../app/libs/css/ngDialog.min.css">    
    <script src="../../app/libs/ng-flow/dist/ng-flow-standalone.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../../app/libs/css/ng-img-crop.css">
    <script src="../../app/libs/ng-img-crop.js"></script>
    <link rel="stylesheet" type="text/css" href="../../app/libs/ladda/ladda-themeless.min.css">    
    <script src="../../app/libs/ladda/spin.min.js"></script>
    <script src="../../app/libs/ladda/ladda.min.js"></script>
    <script src="../../app/libs/ladda/angular-ladda.min.js"></script>
    <script src="../../app/libs/ng-scrollbar/ng-scrollbar.min.js"></script>
    <script src="../../app/libs/moment/min/moment-with-locales.min.js"></script>
    <script src="../../app/libs/angular-moment/angular-moment.min.js"></script>
    <link rel="stylesheet" href="../../app/libs/ng-scrollbar/ng-scrollbar.min.css"/>   

    <script src="../../app/app.js"></script>
    <script src="../../app/config.js"></script>
    <script src="../../app/mainCtrl.js"></script>    
    <script src="../../app/common/services/storageService.js"></script>
    <script src="../../app/Publication/models/publicationService.js"></script>

    <script src="../../app/Auth/models/authService.js"></script>
    <script src="../../app/Auth/controllers/authCtrl.js"></script>    
    <script src="../../app/Static/controllers/staticCtrl.js"></script>    
    <script src="../../app/Static/models/staticService.js"></script>    
    <script src="../../app/User/models/userService.js"></script>
    <script src="../../app/User/controllers/userCtrl.js"></script>
    
    <script src="../../app/Settings/controllers/settingsCtrl.js"></script>
</body>
</html>