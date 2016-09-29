-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Сен 29 2016 г., 18:52
-- Версия сервера: 5.5.52-0ubuntu0.14.04.1
-- Версия PHP: 5.6.23-1+deprecated+dontuse+deb.sury.org~trusty+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `pp`
--

--
-- Дамп данных таблицы `countries`
--

INSERT INTO `countries` (`id`, `name`, `created_at`, `updated_at`, `code`) VALUES
(1, 'Азербайджан', '2016-09-29 13:10:31', '2016-09-29 13:10:31', '994'),
(2, 'Армения', '2016-09-29 13:10:31', '2016-09-29 13:10:31', '374'),
(3, 'Белоруссия', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '375'),
(4, 'Грузия', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '995'),
(5, 'Казахстан', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '7'),
(6, 'Киргизия', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '996'),
(7, 'Молдавия', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '37'),
(8, 'Россия', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '7'),
(9, 'Таджикистан', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '992'),
(10, 'Туркмения', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '993'),
(11, 'Узбекистан', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '998'),
(12, 'Украина', '2016-09-29 13:10:32', '2016-09-29 13:10:32', '380');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
