<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<!-- Meta, title, CSS, favicons, etc. -->
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Ludi Gor. Панель управления.</title>

	<!-- Bootstrap core CSS -->

	<link href="/css/bootstrap.min.css" rel="stylesheet">
	<link href="/fonts/css/font-awesome.min.css" rel="stylesheet">
	<link href="/css/animate.min.css" rel="stylesheet">
	<link href="/css/remodal-default-theme.css" rel="stylesheet">

	<!-- Custom styling plus plugins -->
	<link href="/css/custom.css" rel="stylesheet">
	<link href="/css/jquery.timepicker.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="/css/maps/jquery-jvectormap-2.0.3.css" />
	<link href="/css/icheck/flat/green.css" rel="stylesheet" />
	<link href="/css/floatexamples.css" rel="stylesheet" type="text/css" />
	<link href="/css/admin/style.css" rel="stylesheet" type="text/css" />
	<script src="/js/jquery.min.js"></script>
	<script src="/js/nprogress.js"></script>
	<script src="{{ asset('libs/remodal/dist/remodal.min.js') }}"></script>
	<script src="/js/jquery-ui.js"></script>
	<script src="/js/timepicker/jquery.timepicker.min.js"></script>

	<!--[if lt IE 9]>
	<script src="../assets/js/ie8-responsive-file-warning.js"></script>
	<![endif]-->

	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->

</head>

<body class="nav-md">

  <!-- Modal -->
  <div class="modal fade" id="myModal" role="dialog">
	<div class="modal-dialog">
	
	  <!-- Modal content-->
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal">&times;</button>
		  <h4 class="modal-title">Проверка присутствия модератора</h4>
		</div>
		<div class="modal-body">
		  <p>Вы на месте?</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-success js-moderator-confirm">Да</button>
			<!--<button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>-->
		</div>
	  </div>
	  
	</div>
  </div>
  
<div class="container body">
	<div class="main_container">
		<div class="col-md-3 left_col">
			<div class="left_col scroll-view">
				<div class="navbar nav_title" style="border: 0;"> <a href="index.php" class="site_title"><img src="/img/pr/logo.png" height="25" /> <span>Ludi Gor</span></a> </div>
				<div class="clearfix"></div>
				<br />

				<!-- sidebar menu -->
				<div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
					<div class="menu_section">
						<?php if($moderator['is_admin'] == false){ ?>
						<script>
							// Check moderator
							$(function() {
								var URL = window.location.origin + '/admin/get_check_time',
										URL_CONFIRM = window.location.origin + '/admin/confirmation/',
										POLL_FREQUENCY = 5000,
										moderatorId = null;

								var queue = [],
										inProgress = false;

								var $moderatorModal = $('#myModal');
								var $moderatorConfirmBtn = $('.js-moderator-confirm');

								$moderatorConfirmBtn.on('click', function() {
									confirmTimeModerator();
								});
								// использование Math.round() даст неравномерное распределение!
								var getRandomInt = function(min, max){
									return Math.floor(Math.random() * (max - min + 1)) + min;
								}

								$moderatorModal.on('shown.bs.modal', function (e) {
									console.log("show modal!!");
									setTimeout(function() {
										$moderatorModal.modal('hide');
										getCheckTimeModerator();
									}, 60000);
								});
								// $moderatorModal.on('show.bs.modal', function (e) {
								// 	$(".modal-content").css({
								// 		"left": getRandomInt(1, 300) + "px",
								// 		"top": getRandomInt(1, 300) + "px"
								// 	});
								// });

								$.fastPoll = $.fastPoll || {};

								$.fastPoll.sendMessage = function(message) {
									queue.push(message);
								};

								$.fastPoll.receiveMessage = function(message) {
									console.log('received message');
									console.dir(message);
								};

								function getCheckTimeModerator() {
									if (inProgress) {
										return;
									}
									inProgress = true;
									var messages = queue;
									queue = [];

									$.ajax(URL, {
										type: 'GET',
										dataType: 'json',
										data: null,
										contentType: 'application/json',
										success: function(data) {
											console.log(data);
											moderatorId = data.moderator_id;
											var date = new Date();
											var time = data.time.split(/\:|\-/g);
											date.setHours(time[0]);
											date.setMinutes(time[1]);
											date.setSeconds(time[2]);
											var delay = date.getTime() - Date.now();
											console.log(date);
											console.log(new Date());
											setTimeout(function(){
												$moderatorModal.modal({
													keyboard: false
												});
											}, delay);
											inProgress = false;
										},
										error: function() {
											queue = queue.concat(messages);
											inProgress = false;
										}
									});
								}

								function confirmTimeModerator() {
									if (inProgress) {
										return;
									}
									inProgress = true;
									var messages = queue;
									queue = [];

									$.ajax(URL_CONFIRM + moderatorId, {
										type: 'GET',
										dataType: 'json',
										data: null,
										contentType: 'application/json',
										success: function(data) {
											inProgress = false;
											$moderatorModal.modal('hide');
											getCheckTimeModerator();
										},
										error: function() {
											queue = queue.concat(messages);
											inProgress = false;
										}
									});
								}

								getCheckTimeModerator();

								//setInterval(getToRemoveCounter, POLL_FREQUENCY);
							}());
						</script>
							<h3>Moderator</h3>
						<ul class="nav side-menu">
							<li><a href="{{ action('Admin\HomeController@index') }}"><i class="fa fa-bar-chart-o"></i> Аналитика</a></li>
							<li><a href="{{ action('Admin\ModerationController@index') }}"><i class="fa fa-thumbs-o-up"></i> Модерация</a></li> <!-- Публикации, места, публичные группы -->
							<li><a href="{{ action('Admin\UserController@index') }}"><i class="fa fa-child"></i> Пользователи <span class="counters counter__users badge"></span></a></li> <!-- адекватность [блокирует] -->
							<li><a href="{{ action('Admin\ComplaintsController@index') }}"><i class="fa fa-bullhorn"></i> Жалобы</a></li>
							<li><a href="{{ action('Admin\CommentsController@index') }}"><i class="fa fa-comments-o"></i> Комментарии</a></li>

							<!-- отправить предупреждение [блокирует] -->

							<li><a><i class="fa fa-database"></i> База <span class="fa fa-chevron-down"></span></a>
								<ul class="nav child_menu" style="display: none">
									<li><a href="{{ action('Admin\CountryController@index')}}">Страны</a></li>
									<li><a href="{{ action('Admin\CountryController@region')}}">Области</a></li>
									<li><a href="{{ action('Admin\CountryController@district')}}">Районы</a></li>
									<li><a href="{{ action('Admin\CountryController@settlement')}}">Населенные пункты</a></li>
								</ul>
							</li>

						</ul>
						<?php }else{ ?>
						<h3>Admin</h3>
						<ul class="nav side-menu">
							<li><a href="{{ action('Admin\HomeController@index') }}"><i class="fa fa-bar-chart-o"></i> Аналитика</a></li>
							<li><a href="{{ action('Admin\UserController@index') }}"><i class="fa fa-male"></i>Пользователи <span class="counters counter__users badge"></span></a></li>
							<li><a href="{{ action('Admin\ModeratorController@index') }}"><i class="fa fa-mortar-board"></i> Модераторы</a></li>
							<!--<li><a href="#"><i class="fa fa-rouble"></i> Финансы</a></li>-->
							<li><a href="{{ action('Admin\StaticPageController@index') }}"><i class="fa fa-desktop"></i> Промо</a></li>
							<li><a href="{{ action('Admin\MailController@index') }}"><i class="fa fa-envelope-o"></i> Письма админу <span class="counters counter__mails badge"></span></a></li>
							<!--<li><a href="#"><i class="fa fa-institution"></i> Услуги</a></li>-->
							<li><a href="{{ action('Admin\LockContentController@index') }}"><i class="fa fa-trash"></i> На удаление <span class="counters counter__toremove badge"></span></a></li>
							<li><a href="{{ action('Admin\OptionController@index') }}"><i class="fa fa-cogs"></i> Настройки</a></li>
							<li><a href="{{ action('Admin\ComplaintsController@index') }}"><i class="fa fa-bullhorn"></i> Жалобы</a></li>
							<li><a href="{{ action('Admin\ModerationController@index') }}"><i class="fa fa-thumbs-o-up"></i> Модерация</a></li>
							<li><a href="{{ action('Admin\CommentsController@index') }}"><i class="fa fa-comments-o"></i> Комментарии</a></li>
							<li><a><i class="fa fa-database"></i> База <span class="fa fa-chevron-down"></span></a>
								<ul class="nav child_menu" style="display: none">
									<li><a href="{{ action('Admin\CountryController@index')}}">Страны</a></li>
									<li><a href="{{ action('Admin\CountryController@region')}}">Области</a></li>
									<li><a href="{{ action('Admin\CountryController@district')}}">Районы</a></li>
									<li><a href="{{ action('Admin\CountryController@settlement')}}">Населенные пункты</a></li>
								</ul>
							</li>
						</ul>
						<?php } ?>
					</div>
				</div>
				<!-- /sidebar menu -->

				<!-- /menu footer buttons -->
				<!-- <div class="sidebar-footer hidden-small">
					<a data-toggle="tooltip" data-placement="top" title="Settings"> <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> </a>
					<a data-toggle="tooltip" data-placement="top" title="FullScreen"> <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span> </a>
					<a data-toggle="tooltip" data-placement="top" title="Lock"> <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> </a>
					<a href="{{ action('Admin\AuthController@logout') }}" data-toggle="tooltip" data-placement="top" title="Logout"> <span class="glyphicon glyphicon-off" aria-hidden="true"></span> </a> 
				</div> -->
				<!-- /menu footer buttons -->
			</div>
		</div>

		<!-- top navigation -->
		<div class="top_nav">
			<div class="nav_menu">
				<nav class="" role="navigation">
					<div class="nav toggle"> <a id="menu_toggle"><i class="fa fa-bars"></i></a> </div>
					<ul class="nav navbar-nav navbar-right">
						<li class=""> <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> <img src="/img/ava/ava2.jpg" />Администратор <span class=" fa fa-angle-down"></span> </a>
							<ul class="dropdown-menu dropdown-usermenu pull-right">
								<!-- <li><a href="javascript:;"> Профайл</a> </li>
								<li> <a href="javascript:;"> <span class="badge bg-red pull-right">50%</span> <span>Настройки</span> </a> </li>
								<li> <a href="javascript:;">Помощь</a> </li> -->
								<li><a href="{{ action('Admin\AuthController@logout') }}"><i class="fa fa-sign-out pull-right"></i> Выход</a> </li>
							</ul>
						</li>
					</ul>
				</nav>
			</div>
		</div>
		<!-- /top navigation -->

		<!-- page content -->
		<div class="right_col" role="main">

			<!-- top tiles --><!-- /top tiles --><br />
				@yield('content')

				
	</div>
		<!-- /page content -->
	</div>
</div>
<div id="custom_notifications" class="custom-notifications dsp_none">
	<ul class="list-unstyled notifications clearfix" data-tabbed_notifications="notif-group">
	</ul>
	<div class="clearfix"></div>
	<div id="notif-group" class="tabbed_notifications"></div>
</div>
<script src="/js/bootstrap.min.js"></script>

<!-- gauge js -->
<script type="text/javascript" src="/js/gauge/gauge.min.js"></script>
<script type="text/javascript" src="/js/gauge/gauge_demo.js"></script>
<!-- bootstrap progress js -->
<script src="/js/progressbar/bootstrap-progressbar.min.js"></script>
<!-- icheck -->
<script src="/js/icheck/icheck.min.js"></script>
<!-- daterangepicker -->
<script type="text/javascript" src="/js/moment/moment.min.js"></script>
<script type="text/javascript" src="/js/datepicker/daterangepicker.js"></script>
<!-- chart js -->
<script src="/js/chartjs/chart.min.js"></script>
<script src="/js/custom.js"></script>
<script src="/js/admin.js"></script>

<!-- flot js -->
<!--[if lte IE 8]><script type="text/javascript" src="/js/excanvas.min.js"></script><![endif]-->
<script type="text/javascript" src="/js/flot/jquery.flot.js"></script>
<script type="text/javascript" src="/js/flot/jquery.flot.pie.js"></script>
<script type="text/javascript" src="/js/flot/jquery.flot.orderBars.js"></script>
<script type="text/javascript" src="/js/flot/jquery.flot.time.min.js"></script>
<script type="text/javascript" src="/js/flot/date.js"></script>
<script type="text/javascript" src="/js/flot/jquery.flot.spline.js"></script>
<script type="text/javascript" src="/js/flot/jquery.flot.stack.js"></script>
<script type="text/javascript" src="/js/flot/curvedLines.js"></script>
<script type="text/javascript" src="/js/flot/jquery.flot.resize.js"></script>

<!-- worldmap -->
<script type="text/javascript" src="/js/maps/jquery-jvectormap-2.0.3.min.js"></script>
<script type="text/javascript" src="/js/maps/gdp-data.js"></script>
<script type="text/javascript" src="/js/maps/jquery-jvectormap-world-mill-en.js"></script>
<script type="text/javascript" src="/js/maps/jquery-jvectormap-us-aea-en.js"></script>
<!-- pace -->
<script src="/js/pace/pace.min.js"></script>

<script>
$(document).ready(function(){
	$("#myBtn").click(function(){
		$("#myModal").modal();
	});
});
</script>
</body>
</html>