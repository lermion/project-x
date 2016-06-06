<!DOCTYPE html>
<html lang="en" ng-app="placePeopleApp">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <link href="../../css/style.css" rel="stylesheet">
</head>
<body class="main-page">
    <div id="wrapper" ui-view ng-controller="mainCtrl"></div>
        <footer>
                <div class="footer">
                        <div class="footer-item">
                                    <div><a href="">Place People </a><span>© 2016</span></div>
                                    <div class="payment">
                                                <a class="mastercard" href=""></a>
                                                <a class="visa" href=""></a>
                                    </div>
                        </div>
                        <div class="menu">
                            <a class="drop-menu" href=""></a>
                            <div class="menu-item">
                                    <a href="">О сервисе </a>
                                    <a href="">Помощь </a>
                                    <a href="">Правила </a>
                                    <a href="">Реклама </a>
                                    <a href="">Разработчикам </a>
                            </div>
                        </div>
                </div>
        </footer>
        <script src="../../app/libs/angular.min.js"></script>
        <script src="../../app/libs/angular-ui-router.min.js"></script>
        <script src="../../app/app.js"></script>
        <script src="../../app/config.js"></script>
        <script src="../../app/mainCtrl.js"></script>

        <script src="../../app/Auth/controllers/authCtrl.js"></script>
        <script src="../../app/Auth/models/authService.js"></script>
</body>
</html>