<!DOCTYPE html>
<html lang="en" ng-app="placePeopleApp">
<head>
	<meta charset="UTF-8">
	<title>Place People</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="description" content="">
	<link href="../../css/style.css" rel="stylesheet">
	<link href="../../css/settings.css" rel="stylesheet">
	<base href="/">
</head>
<body ng-controller="mainCtrl" ng-class="bodyClass">

<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-KT9G9X"
				  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KT9G9X');</script>
<!-- End Google Tag Manager -->

	<back-top ng-cloak class="main-up-button">Наверх</back-top>
	<header ng-cloak ng-if="$root.isAuthorized && $root.showHeader && !(currentPath === '/auth/login' || currentPath === '/' || currentPath === '/auth/registration' || currentPath === '/auth/restore' || currentPath === '/auth/invite')">
		<div class="header header-user">
			<a class="logo" ui-sref="feed">
				<span class="beta">β</span>
			</a>
			
			<div class="main-menu"  ng-class="showMenu ? 'show-menu' : ''">
			<a class="drop-menu" ng-click="openMenu()" href></a>
			<div class="menu-item" ng-show="showMenu">
				<a class="logo logo-in-menu" ui-sref="feed"></a>
				<div class="search">
					<form name="form.search" ng-submit="submitSearch()" novalidate>
						<input type="text" ng-model="search.str" placeholder="Поиск...">
						<span class="button" ng-click="submitSearch()"></span>
					</form>
				</div>
				<a class="profile" ui-sref="user({username: $root.user.username})">Мой профиль <span class="places-count-span" ng-if="counters.subscribersNew > 0">@{{counters.subscribersNew}}</span></a>
				<a class="places" ui-sref="places">Места <span class="places-count-span" ng-if="counters.placesNew > 0">@{{counters.placesNew}}</span></a>
				<a class="main-header-group" ui-sref="groups">Группы <span class="places-count-span" ng-if="counters.groupsNew > 0">@{{counters.groupsNew}}</span></a>
				<a class="chat" ui-sref="chat.list"> Чаты <span ng-if="countChatMessages > 0" class="places-count-span">@{{countChatMessages}}</span></a>
				<a class="settings" ui-sref="settings">Настройки</a>
			</div>
			</div>
			<div class="search main-header-search" ng-click="$root.showSearch = !($root.showSearch)"></div>
			<a class="exit" href="javascript:void(0);" ng-click="logOut()"><span></span>Выйти</a>
		</div>
		<div class="header-search-container" ng-if="$root.showSearch">
			<div class="header-search-input-wrap">
				<form name="form.search" ng-submit="submitSearch()" novalidate>
					<input type="text" ng-model="search.str" placeholder="Поиск..." focus-me="showSearch">
					<span class="header-search-input-wrap-span" ng-click="submitSearch()"></span>
				</form>
			</div>
		</div>
	</header>
	<header ng-cloak ng-if="!$root.isAuthorized && $root.showHeader && !(currentPath === '/auth/login' || currentPath === '/' || currentPath === '/auth/registration' || currentPath === '/auth/restore' || currentPath === '/auth/invite')">
		<div class="header">
			<a class="logo" ui-sref="auth"></a>
			<span class="beta">β</span>
			<a class="registration" ui-sref="reg">Регистрация</a>
			<a class="exit enter"  ui-sref="login"><span></span>Вoйти</a>
		</div>
	</header>
	<div id="wrapper" ui-view></div>

	<div ng-show="preloader" class="content-preloader">
		<div class="preloader-item">
			<img src="/images/loading-main.gif" alt="">
		</div>
	</div>
	<div class="mobile-menu-overlay" ng-show="isOverlay"></div>
	<!-- Scripts -->
	<script type="text/javascript" src="../../app/libs/jquery-2.1.3.min.js"></script>
	<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
	<script src="../../app/libs/angular.min.js"></script>
	<script src="../../app/libs/angular-ui-router.min.js"></script>
	<script src="../../app/libs/angular-messages.min.js"></script>
	<script src="../../app/libs/angular-animate.min.js"></script>
	<script src="../../app/libs/ngDialog.min.js"></script>
	<link rel="stylesheet" type="text/css" href="../../app/libs/css/ngDialog.min.css">
	<script src="../../app/libs/ng-flow/dist/ng-flow-standalone.min.js"></script>
	<link rel="stylesheet" type="text/css" href="../../app/libs/css/ng-img-crop.css">
	<script src="../../app/libs/ng-img-crop.js"></script>
	<script src="../../app/libs/ng-img-crop-full-extended/compile/minified/ng-img-crop.js"></script>
	<link rel="stylesheet" type="text/css" href="../../app/libs/ladda/ladda-themeless.min.css">
	<link rel="stylesheet" type="text/css" href="../../app/libs/nanoscroller.css">
	<link rel="stylesheet" type="text/css" href="../../app/libs/emoji.css">
	<link rel="stylesheet" type="text/css" href="../../app/libs/angular-backtop.css">
	<script src="../../app/libs/ladda/spin.min.js"></script>
	<script src="../../app/libs/ng-file-upload/ng-file-upload-shim.min.js"></script>
	<script src="../../app/libs/ng-file-upload/ng-file-upload.min.js"></script>
	<script src="../../app/libs/ladda/ladda.min.js"></script>
	<script src="../../app/libs/ladda/angular-ladda.min.js"></script>
	<script src="../../app/libs/ng-scrollbar/ng-scrollbar.min.js"></script>
	<script src="../../app/libs/moment/min/moment-with-locales.js"></script>
	<script src="../../app/libs/angular-moment/angular-moment.min.js"></script>
	<link rel="stylesheet" href="../../app/libs/ng-scrollbar/ng-scrollbar.min.css"/>
	<script src="../../app/libs/angular-sanitize.js"></script>
	<script type="text/javascript" src="../../app/libs/ng-infinite-scroll.min.js"></script>
	<script src="../../app/libs/nanoscroller.min.js"></script>
	<script src="../../app/libs/scrollglue.js"></script>
	<script src="../../app/libs/tether.min.js"></script>
	<script src="../../app/libs/config.js"></script>
	<script src="../../app/libs/util.js"></script>
	<script src="../../app/libs/jquery.emojiarea.js"></script>
	<script src="../../app/libs/angular-md5.min.js"></script>
	<script src="../../app/libs/emoji-picker.js"></script>
	<script src="../../app/libs/angular-backtop.min.js"></script>
	<script src="../../app/libs/ya-map-2.1.min.js"></script>
	<script src="../../app/libs/angucomplete-alt.min.js"></script>
	<script src="../../app/libs/socket.min.js"></script>
	<script src="../../app/libs/metrika.js"></script>
	<script type="text/javascript" src="../../app/libs/emoji/config.js"></script>
	<script type="text/javascript" src="../../app/libs/emoji/emoji.min.js"></script>
	<!-- <link type="text/stylesheet" rel="stylesheet" href="../../app/libs/emoji/emoji.min.css" /> -->
	<script src="../../app/app.js"></script>
	<script src="../../app/config.js"></script>
	<script src="../../app/mainCtrl.js"></script>
	<script src="../../app/libs/socket.io-1.3.4.js"></script>
	<script src="../../app/common/services/storageService.js"></script>
	<script src="../../app/common/services/socketService.js"></script>
	<script src="../../app/common/directives/index.js"></script>
	<script src="../../app/common/directives/typeahead/typeahead.js"></script>
	<script src="../../app/common/filters/filters.js"></script>
	<script src="../../app/Publication/models/publicationService.js"></script>
	<script src="../../app/Auth/models/authService.js"></script>
	<script src="../../app/Auth/controllers/authCtrl.js"></script>
	<script src="../../app/Four04Controller.js"></script>
	<script src="../../app/HiddenPubContoller.js"></script>
	<script src="../../app/Static/controllers/staticCtrl.js"></script>
	<script src="../../app/Static/models/staticService.js"></script>
	<script src="../../app/User/models/userService.js"></script>
	<script src="../../app/User/controllers/userCtrl.js"></script>
	<script src="../../app/Feed/index.js"></script>
	<script src="../../app/Feed/models/feedService.js"></script>
	<script src="../../app/Feed/controllers/feedCtrl.js"></script>
	<script src="../../app/Chat/models/chatService.js"></script>
	<script src="../../app/Chat/controllers/chatCtrl.js"></script>
	<script src="../../app/Settings/controllers/settingsCtrl.js"></script>
	<script src="../../app/Groups/index.js"></script>
	<script src="../../app/Groups/controllers/groupsCtrl.js"></script>
	<script src="../../app/Groups/controllers/group.ctrl.js"></script>
	<script src="../../app/Groups/services/groups.srv.js"></script>
	<script src="../../app/Places/index.js"></script>
	<script src="../../app/Places/controllers/places.ctrl.js"></script>
	<script src="../../app/Places/controllers/place.ctrl.js"></script>
	<script src="../../app/Places/services/places.srv.js"></script>
	<script src="../../app/Search/index.js"></script>
	<script src="../../app/Search/controllers/search.ctrl.js"></script>
	<script src="../../app/Search/services/search.srv.js"></script>
	<script src="../../app/common/components/index.js"></script>
	<script src="../../app/common/components/publication/index.js"></script>
	<script src="../../app/common/components/publication-list-item/index.js"></script>
	<script src="../../app/common/components/publication-new/index.js"></script>
	<script src="../../app/common/components/publication-edit/index.js"></script>
	<script src="../../app/common/components/media-file/index.js"></script>
	<footer>
		<div class="footer">
			<div class="footer-item">
				<div class="footer-place">
					<a ui-sref="auth">Place People </a>
					<span>© 2016</span>
				</div>
				<!-- <div class="payment">
					<a class="mastercard" href="javascript:void(0)"></a>
					<a class="visa" href="javascript:void(0)"></a>
				</div> -->
			</div>
			<div class="menu" ng-click="openBottomMenu()" ng-class="showBottomMenu ? 'open-bottom-menu' : ''"
						 ng-init="showBottomMenu=true;">
				<a class="drop-menu" href="javascript:void(0)"></a>

				<div class="menu-item">
				<a ng-repeat="staticPage in staticPages" ui-sref="static({ pageName: staticPage.name})" ng-click="closePopup()">@{{staticPage.description}}</a>
				</div>
			</div>
		</div>
	</footer>
</body>
</html>