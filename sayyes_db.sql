-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 18, 2023 at 08:09 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sayyes_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE PROCEDURE `sp_get_available_users` (IN `intrestedIn` VARCHAR(255), IN `availableForPick` VARCHAR(255))   SELECT * FROM users WHERE `users`.`availableForPick` = availableForPick AND (`users`.`email` NOT LIKE 'admin@sayyesadmin.com' || `users`.`email` IS NULL)$$

CREATE PROCEDURE `sp_get_live_activities` (IN `time` VARCHAR(255), IN `city` VARCHAR(255), IN `country` VARCHAR(255))   SELECT * FROM liveActivities, users 
WHERE CAST(`liveActivities`.date AS DATE) = time AND `liveActivities`.city = city 
AND `liveActivities`.country = country
AND users.userId = `liveActivities`.userId$$

CREATE PROCEDURE `sp_get_my_activities` (IN `userId` BIGINT(20))   SELECT * FROM `userActivities` WHERE `userActivities`.`sentBy` = userId$$

CREATE PROCEDURE `sp_get_my_friends` (IN `userId` BIGINT(20))   SELECT * FROM userRequests WHERE (`userRequests`.`sentBy` = userId OR `userRequests`.`sentTo` = userId) AND `userRequests`.`isAccepted` = 1$$

CREATE PROCEDURE `sp_get_my_offered_activity_requests` (IN `userId` BIGINT(20))   SELECT * FROM `userRequests` WHERE `userRequests`.`sentBy` = userId$$

CREATE PROCEDURE `sp_get_my_offered_friend_requests` (IN `userId` BIGINT(20))   SELECT `userRequests`.*,users.country, users.profileImage FROM `userRequests`, `users` WHERE (`userRequests`.`sentBy` LIKE userId OR `userRequests`.`sentTo` LIKE userId) AND ((`userRequests`.`sentTo` LIKE userId OR `userRequests`.`sentTo` = `users`.`userId`) AND (`userRequests`.`sentBy` LIKE userId OR `userRequests`.`sentBy` = `users`.`userId`))$$

CREATE PROCEDURE `sp_get_user_activity_requests` (IN `userId` BIGINT(20))   SELECT * FROM `userRequests` WHERE `userRequests`.`sentTo` = userId$$

CREATE PROCEDURE `sp_get_user_requests` (IN `userId` BIGINT(20))   SELECT userRequests.id AS id, 
          userRequests.date AS date, 
          userRequests.sentTo AS sentTo, 
          userRequests.sentBy AS sentBy,
          userRequests.activity_name AS activity_name,
          userRequests.activity_address AS activity_address,
          userRequests.createdAt AS createdAt,
          userRequests.activity_image AS activity_image,
          userRequests.sentToimage AS sentToimage,
          userRequests.sentToNAME AS sentToNAME,
          userRequests.sentBYNAME AS sentBYNAME,
          userRequests.isAccepted AS isAccepted,
          userRequests.confirm AS confirm,
          users.genderId AS gender,
          DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), STR_TO_DATE(users.birthday, '%c/%e/%Y'))), '%Y') + 0 AS age,
          users.birthday AS birthday,
          users.country AS country,
          users.profileImage as profileImage,
          users.favActivities as favActivities,
          users.aboutMe as aboutMe,
          users.intrestedIn as intrestedIn
          FROM userRequests, users WHERE users.userId=userRequests.sentBy AND `userRequests`.`sentTo` = userId$$

CREATE PROCEDURE `sp_login_user` (IN `username` VARCHAR(255))   SELECT * FROM users WHERE `users`.`username` = username$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `advertisements`
--

CREATE TABLE `advertisements` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` text NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `blockusers`
--

CREATE TABLE `blockusers` (
  `id` bigint(20) NOT NULL,
  `user_blocked_by` bigint(20) DEFAULT NULL,
  `blocked_user_id` bigint(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blockusers`
--

INSERT INTO `blockusers` (`id`, `user_blocked_by`, `blocked_user_id`, `status`) VALUES
(1, 156, 150, 0);

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` bigint(20) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `receiver_id` bigint(20) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `audio` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT '0',
  `userId_dele` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `room_id`, `sender_id`, `receiver_id`, `message`, `audio`, `status`, `userId_dele`, `createdAt`) VALUES
(1, 1, 39, 40, '1', NULL, '0', NULL, '2023-03-01 04:42:37'),
(2, 1, 40, 39, '2', NULL, '0', NULL, '2023-03-01 04:43:13'),
(3, 1, 39, 40, '3', NULL, '0', NULL, '2023-03-01 04:43:19'),
(4, 1, 40, 39, '4', NULL, '0', NULL, '2023-03-01 04:43:26'),
(5, 2, 60, 59, '1', NULL, '1', '7', '2023-03-04 14:27:26'),
(6, 3, 66, 60, '1', NULL, '0', NULL, '2023-03-10 06:31:59'),
(7, 3, 66, 60, '1', NULL, '0', NULL, '2023-03-10 06:32:00'),
(8, 4, 7, 60, 'Hello honey glad you’re coming to the party ', NULL, '1', '99', '2023-03-13 05:16:19'),
(9, 4, 7, 60, NULL, '0.0audio.mp3', '0', NULL, '2023-03-13 05:16:35'),
(10, 4, 7, 60, NULL, '0.0audio.mp3', '0', NULL, '2023-03-13 05:16:51'),
(11, 5, 7, 62, 'Hi juicy I’m trying to drink', NULL, '0', NULL, '2023-03-20 17:23:57'),
(12, 5, 7, 62, 'You trying to go get dinner ', NULL, '0', NULL, '2023-03-20 17:30:16'),
(13, 5, 7, 62, 'Or you can be dinner ', NULL, '1', '153', '2023-03-20 17:30:45'),
(14, 5, 62, 7, 'Yurrrrrrrrr', NULL, '0', NULL, '2023-03-20 17:36:57'),
(15, 5, 7, 62, 'Fuck', NULL, '0', NULL, '2023-03-20 17:37:33'),
(16, 5, 7, 62, 'Fuck', NULL, '0', NULL, '2023-03-20 17:37:33'),
(17, 5, 62, 7, 'Big Dick Energy', NULL, '1', '156', '2023-03-20 17:37:54'),
(18, 6, 7, 69, 'Hi bro', NULL, '1', '156', '2023-03-22 13:40:21'),
(19, 6, 7, 69, 'Hi bro', NULL, '0', NULL, '2023-03-22 13:40:21'),
(20, 6, 7, 69, 'Hey woodly ?', NULL, '1', '156', '2023-03-24 15:18:31'),
(21, 7, 7, 73, 'Yurrr', NULL, '0', NULL, '2023-03-25 04:33:21'),
(22, 7, 73, 7, 'What’s good ', NULL, '0', NULL, '2023-03-25 04:33:57'),
(23, 3, 60, 66, NULL, '0.0audio.mp3', '0', NULL, '2023-04-20 05:21:22'),
(24, 3, 60, 66, NULL, '0.0audio.mp3', '0', NULL, '2023-04-20 05:21:34'),
(25, 3, 60, 66, NULL, '0.0audio.mp3', '0', NULL, '2023-04-20 05:21:44'),
(26, 3, 60, 66, NULL, '0.0audio.mp3', '0', NULL, '2023-04-20 05:25:36'),
(27, 3, 60, 66, NULL, '0.0audio.mp3', '0', NULL, '2023-04-20 05:25:45'),
(28, 3, 60, 66, NULL, '-9.5367431640625e-07audio.mp3', '0', NULL, '2023-04-20 05:25:54'),
(29, 3, 60, 66, NULL, '0.0audio.mp3', '0', NULL, '2023-07-24 11:13:36'),
(30, 3, 60, 66, NULL, '0.0audio.mp3', '0', NULL, '2023-07-24 11:13:39'),
(31, 3, 60, 66, NULL, '-9.5367431640625e-07audio.mp3', '0', NULL, '2023-07-24 11:13:47'),
(32, 3, 60, 66, NULL, '-1.0728836059570312e-06audio.mp3', '0', NULL, '2023-07-24 11:14:12'),
(33, 8, 99, 105, 'Hy\n', NULL, '0', NULL, '2023-11-24 12:19:25'),
(34, 8, 105, 99, 'Hy', NULL, '1', '105', '2023-11-24 12:19:47'),
(35, 8, 105, 99, 'Oyy', NULL, '1', '105', '2023-11-24 12:28:27'),
(36, 8, 105, 99, 'Hhyy', NULL, '1', '105', '2023-11-24 12:28:45'),
(37, 8, 105, 99, 'Hey! Mansi', NULL, '1', '105', '2023-11-25 04:15:36'),
(38, 8, 105, 99, NULL, '0.0audio.mp3', '1', '105', '2023-11-25 04:15:45'),
(39, 8, 105, 99, 'Hey mansi', NULL, '1', '105', '2023-11-25 04:16:42'),
(40, 8, 99, 105, 'Ha bol ne', NULL, '0', NULL, '2023-11-25 04:16:58'),
(41, 8, 99, 105, NULL, '0.0audio.mp3', '0', NULL, '2023-11-25 04:17:29'),
(42, 8, 105, 99, 'ABCD', NULL, '0', NULL, '2023-11-25 04:21:56'),
(43, 8, 105, 99, NULL, '0.0audio.mp3', '0', NULL, '2023-11-25 04:23:01'),
(44, 8, 105, 99, '123', NULL, '0', NULL, '2023-11-25 06:22:38'),
(45, 9, 106, 107, 'Hey ! Piyush', NULL, '0', NULL, '2023-11-27 04:11:49'),
(46, 9, 107, 106, 'Hey! Deep', NULL, '0', NULL, '2023-11-27 04:12:09'),
(47, 9, 106, 107, 'Hy', NULL, '0', NULL, '2023-11-27 04:53:08'),
(48, 9, 106, 107, 'Hlw', NULL, '0', NULL, '2023-11-27 04:53:23'),
(49, 9, 107, 106, NULL, '0.0audio.mp3', '0', NULL, '2023-11-27 07:16:32'),
(50, 9, 107, 106, 'Hy what are you doing ', NULL, '0', NULL, '2023-11-27 07:20:07'),
(51, 10, 110, 111, 'Hy', NULL, '0', NULL, '2023-12-05 10:31:39'),
(52, 10, 111, 110, '1', NULL, '0', NULL, '2023-12-05 10:32:03'),
(53, 10, 111, 110, '1', NULL, '0', NULL, '2023-12-05 10:32:03'),
(54, 10, 110, 111, 'Hello', NULL, '0', NULL, '2023-12-06 04:35:53'),
(55, 10, 110, 111, '1', NULL, '0', NULL, '2023-12-06 10:47:34'),
(56, 10, 110, 111, '1', NULL, '0', NULL, '2023-12-06 10:47:34'),
(57, 10, 111, 110, '2', NULL, '0', NULL, '2023-12-06 10:47:42'),
(58, 11, 142, 141, 'Hello', NULL, '0', NULL, '2023-12-11 12:23:07'),
(59, 11, 142, 141, 'Hyy', NULL, '0', NULL, '2023-12-11 12:24:25'),
(60, 11, 141, 142, 'Hiii ….', NULL, '0', NULL, '2023-12-11 12:24:36'),
(61, 12, 150, 151, 'Hy\n', NULL, '1', '150', '2023-12-14 04:27:40'),
(62, 12, 151, 150, 'Hy', NULL, '0', NULL, '2023-12-14 04:27:51'),
(63, 13, 152, 153, 'Hey', NULL, '0', NULL, '2023-12-14 06:39:13'),
(64, 13, 153, 152, 'Hy', NULL, '0', NULL, '2023-12-14 06:39:35'),
(65, 13, 152, 153, 'Oyyy', NULL, '1', '152', '2023-12-14 06:41:13'),
(66, 13, 153, 152, 'Hy', NULL, '0', NULL, '2023-12-14 06:45:57'),
(67, 13, 152, 153, 'Hy', NULL, '0', NULL, '2023-12-14 06:46:02'),
(68, 13, 153, 152, 'Hy akbar', NULL, '0', NULL, '2023-12-14 06:48:18'),
(69, 13, 152, 153, 'Hy', NULL, '0', NULL, '2023-12-14 06:49:05'),
(70, 13, 153, 152, NULL, '0.0audio.mp3', '1', '153', '2023-12-14 06:49:20'),
(71, 13, 152, 153, NULL, '-1.0728836059570312e-06audio.mp3', '1', '152', '2023-12-14 06:49:35'),
(72, 13, 152, 153, NULL, '0.0audio.mp3', '1', '152', '2023-12-14 06:51:58'),
(73, 13, 152, 153, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 06:52:16'),
(74, 13, 153, 152, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 06:52:25'),
(75, 14, 152, 151, 'Hy', NULL, '0', NULL, '2023-12-14 06:57:54'),
(76, 14, 151, 152, 'Hy', NULL, '0', NULL, '2023-12-14 06:58:12'),
(77, 15, 153, 151, 'Hy', NULL, '0', NULL, '2023-12-14 07:00:40'),
(78, 15, 151, 153, 'Hy', NULL, '0', NULL, '2023-12-14 07:00:53'),
(79, 15, 151, 153, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 07:01:51'),
(80, 15, 153, 151, NULL, '0.0audio.mp3', '1', '153', '2023-12-14 07:02:05'),
(81, 15, 151, 153, NULL, '0.0audio.mp3', '1', '151', '2023-12-14 07:02:20'),
(82, 15, 151, 153, 'Hy', NULL, '0', NULL, '2023-12-14 07:02:31'),
(83, 15, 151, 153, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 07:02:52'),
(84, 15, 153, 151, 'Hy', NULL, '0', NULL, '2023-12-14 07:03:03'),
(85, 12, 151, 150, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 08:05:03'),
(86, 12, 150, 151, NULL, '-2.9802322387695312e-06audio.mp3', '1', '150', '2023-12-14 08:06:10'),
(87, 12, 151, 150, 'Hy', NULL, '0', NULL, '2023-12-14 08:06:19'),
(88, 12, 150, 151, NULL, '0.0audio.mp3', '1', '150', '2023-12-14 08:23:01'),
(89, 12, 150, 151, NULL, '0.0audio.mp3', '1', '150', '2023-12-14 08:23:03'),
(90, 12, 150, 151, NULL, '0.0audio.mp3', '1', '150', '2023-12-14 08:23:06'),
(91, 12, 150, 151, NULL, '0.0audio.mp3', '1', '150', '2023-12-14 08:24:25'),
(92, 12, 150, 151, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 08:24:45'),
(93, 12, 151, 150, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 08:24:59'),
(94, 12, 150, 151, NULL, '0.0audio.mp3', '0', NULL, '2023-12-14 08:44:03'),
(95, 16, 154, 155, 'Hy', NULL, '0', NULL, '2023-12-14 11:12:17'),
(96, 16, 155, 154, 'Hy', NULL, '0', NULL, '2023-12-14 11:12:40'),
(97, 16, 155, 154, NULL, '-1.0728836059570312e-06audio.mp3', '0', NULL, '2023-12-14 11:13:26'),
(98, 17, 150, 156, '1', NULL, '0', NULL, '2023-12-15 04:29:09'),
(99, 17, 156, 150, '2', NULL, '0', NULL, '2023-12-15 04:32:05'),
(100, 18, 156, 157, 'Hy', NULL, '0', NULL, '2023-12-15 08:38:03'),
(101, 19, 156, 159, '1', NULL, '0', NULL, '2023-12-15 11:00:23'),
(102, 19, 159, 156, '2', NULL, '0', NULL, '2023-12-15 11:00:35'),
(103, 20, 158, 156, 'Hy', NULL, '0', NULL, '2023-12-15 11:27:38'),
(104, 17, 150, 156, 'Hy', NULL, '0', NULL, '2023-12-15 11:29:26'),
(105, 17, 156, 150, 'Hy', NULL, '0', NULL, '2023-12-15 11:29:49'),
(106, 19, 159, 156, 'Hy', NULL, '0', NULL, '2023-12-15 11:31:40'),
(107, 19, 156, 159, 'Hy', NULL, '0', NULL, '2023-12-15 11:31:50'),
(108, 19, 156, 159, 'Hy', NULL, '0', NULL, '2023-12-15 12:08:26');

-- --------------------------------------------------------

--
-- Table structure for table `confirmActivities`
--

CREATE TABLE `confirmActivities` (
  `id` bigint(20) NOT NULL,
  `SendTo` bigint(20) DEFAULT NULL,
  `SendBy` bigint(20) DEFAULT NULL,
  `Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `confirmActivities`
--

INSERT INTO `confirmActivities` (`id`, `SendTo`, `SendBy`, `Date`) VALUES
(1, 39, 40, '2023-03-01'),
(2, 60, 59, '2023-03-11'),
(3, 60, 66, '2023-03-10'),
(4, 60, 59, '2023-03-11'),
(5, 60, 59, '2023-03-11'),
(6, 60, 59, '2023-03-11'),
(7, 60, 59, '2023-03-11'),
(8, 66, 67, '2023-03-11'),
(9, 66, 60, '2023-03-11'),
(10, 7, 60, '2023-03-09'),
(11, 62, 7, '2023-03-20'),
(12, 69, 7, '2023-03-23'),
(13, 73, 7, '2023-03-25'),
(14, 105, 99, '2023-11-24'),
(15, 99, 105, '2023-11-24'),
(16, 106, 107, '2023-11-27'),
(17, 107, 106, '2023-11-27'),
(18, 60, 77, '2023-05-08'),
(19, 110, 111, '2024-02-05'),
(20, 111, 110, '2023-12-05'),
(21, 111, 110, '2023-12-06'),
(22, 111, 110, '2023-12-06'),
(23, 111, 110, '2023-12-06'),
(24, 110, 111, '2024-01-06'),
(25, 111, 110, '2023-12-06'),
(26, 110, 111, '2024-02-06'),
(27, 138, 137, '2023-12-11'),
(28, 137, 138, '2024-01-11'),
(29, 141, 142, '2023-12-11'),
(30, 142, 141, '2023-12-11'),
(31, 141, 142, '2024-01-11'),
(32, 149, 147, '2023-12-14'),
(33, 150, 151, '2023-12-14'),
(34, 151, 150, '2023-12-14'),
(35, 153, 152, '2023-12-14'),
(36, 152, 153, '2023-12-14'),
(37, 152, 151, '2023-12-14'),
(38, 151, 153, '2023-12-14'),
(39, 154, 155, '2023-12-14'),
(40, 150, 156, '2023-01-15'),
(41, 156, 155, '2023-12-15'),
(42, 156, 154, '2023-12-15'),
(43, 156, 155, '2023-12-15'),
(44, 156, 157, '2023-12-15'),
(45, 158, 156, '2023-12-15'),
(46, 158, 156, '2023-12-15'),
(47, 156, 158, '2023-12-15'),
(48, 159, 156, '2023-12-15');

-- --------------------------------------------------------

--
-- Table structure for table `flages`
--

CREATE TABLE `flages` (
  `id` bigint(20) NOT NULL,
  `activity_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `flages`
--

INSERT INTO `flages` (`id`, `activity_id`, `user_id`, `message`) VALUES
(1, 35, 99, 'ABCDEFG'),
(2, 40, 99, 'Hey how are you'),
(3, 97, 155, 'Hello korean');

-- --------------------------------------------------------

--
-- Table structure for table `forgetPasswords`
--

CREATE TABLE `forgetPasswords` (
  `id` bigint(20) NOT NULL,
  `code` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `forgetPasswords`
--

INSERT INTO `forgetPasswords` (`id`, `code`, `username`) VALUES
(1, 834889, '8456080008'),
(2, 286574, '7706870627'),
(3, 616031, '3513233724'),
(4, 276898, '9512524573'),
(5, 605582, '7194749074'),
(6, 546131, '9146613446'),
(7, 476996, '7188092140'),
(8, 180176, '9177972773'),
(9, 110127, '7085951380'),
(12, 605488, '8135739712'),
(13, 189829, '6463397185'),
(16, 789575, '8454614816'),
(18, 665870, '8457297815'),
(19, 970077, '9173020298'),
(20, 855310, '3215433882'),
(21, 736286, '3204580903'),
(22, 740345, '9015813796'),
(23, 677761, '2028235090'),
(24, 746252, '9736099244'),
(25, 113448, '9143404498'),
(26, 995660, '8456658387'),
(27, 784746, '2144543527'),
(28, 169480, '2017797965'),
(29, 333776, '2104256709'),
(30, 238225, '9313325938');

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE `genders` (
  `id` bigint(20) NOT NULL,
  `type` varchar(255) DEFAULT 'F'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `likeliveactivitises`
--

CREATE TABLE `likeliveactivitises` (
  `id` bigint(11) NOT NULL,
  `user_id` bigint(11) NOT NULL,
  `live_activitise_id` bigint(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `likeliveactivitises`
--

INSERT INTO `likeliveactivitises` (`id`, `user_id`, `live_activitise_id`, `status`) VALUES
(1, 7, 2, 0),
(2, 60, 6, 0),
(3, 66, 9, 1),
(4, 60, 9, 0),
(5, 67, 9, 0),
(6, 7, 31, 0),
(7, 7, 32, 0),
(8, 7, 33, 0),
(9, 99, 35, 1),
(10, 99, 40, 1),
(11, 109, 30, 0),
(12, 60, 41, 0),
(13, 60, 32, 0),
(14, 141, 42, 0),
(15, 149, 67, 1),
(16, 154, 97, 1);

-- --------------------------------------------------------

--
-- Table structure for table `liveActivities`
--

CREATE TABLE `liveActivities` (
  `id` bigint(20) NOT NULL,
  `activityName` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `delete_notification_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `liveActivities`
--

INSERT INTO `liveActivities` (`id`, `activityName`, `description`, `address`, `city`, `country`, `date`, `createdAt`, `userId`, `delete_notification_status`) VALUES
(4, 'A1', 'Hi IM test user', 'Surat Gujarat', NULL, NULL, '2023-03-01 00:00:00', '2023-03-02', 40, 0),
(18, 'A1', 'Hi I’m Test Account ..', 'Surat', NULL, NULL, '2023-03-11 00:00:00', '2023-03-12', 20, 0),
(23, 'a1', 'Hi', 'SHAh', NULL, NULL, '2023-03-11 10:42:00', '2023-03-12', 20, 0),
(24, 'A1', 'Asa', 'sad', NULL, NULL, '2023-03-11 10:44:00', '2023-03-12', 20, 0),
(29, 'Beach ', 'Hi Please Join  Request To Forward !!', 'Surat', NULL, NULL, '2023-03-11 09:22:00', '2023-03-12', 66, 0),
(30, 'A1', 'Please Join This .', 'Surat', NULL, NULL, '2023-03-11 11:05:00', '2023-03-12', 67, 0),
(32, 'Explore World', 'Let’s explore things', '201, Annapurna Sadan, Mumbai.', NULL, NULL, '2023-03-13 05:08:00', '2023-03-14', 60, 0),
(33, 'pool party kitty', 'Bring drinks and good vibes ', '105 five point circle ', NULL, NULL, '2023-04-05 16:01:00', '2023-04-06', 7, 0),
(34, 'find object', 'This is game you have to find object at given short time.', 'silver empire ', NULL, NULL, '2022-02-08 00:00:00', '2023-05-09', 77, 0),
(36, 'padmaavat', 'Enjoying the movie', 'Friday cinema most varacha', NULL, NULL, '2023-11-26 09:30:00', '2023-11-25', 99, 0),
(37, 'enjoy series', 'Enjoy movie', 'PVR Mall', NULL, NULL, '2023-12-03 13:45:00', '2023-11-25', 99, 0),
(41, 'Diwali Vacation', 'Please accept this request to go for holiday.', 'Surat Beach', NULL, NULL, '2023-12-12 04:34:00', '2023-12-03', 60, 0),
(42, 'deep activity’s ', 'Desc. Cool shots a', 'silver empires ', NULL, NULL, '2023-12-11 04:42:00', '2023-12-03', 109, 0),
(43, 'Activity kmsoft', 'Please do it ..', 'Surat', NULL, NULL, '2023-12-05 06:18:00', '2023-12-06', 60, 0),
(44, 'A 1', 'Desc….', 'Surat ', NULL, NULL, '2023-12-11 12:26:00', '2023-12-12', 141, 0),
(45, 'Vacation Activity.', 'Please accept this request to deal with this vacation activity.', 'Surat , Gujarat', NULL, NULL, '2023-12-13 05:45:00', '2023-12-13', 143, 0),
(46, 'Acitivity Test', 'Please ', 'Surat Gujarat', NULL, NULL, '2023-12-12 05:53:00', '2023-12-13', 143, 0),
(47, 'A 1', 'Lplp', 'Surat', NULL, NULL, '2023-12-13 05:58:00', '2023-12-13', 141, 0),
(48, 'Activity Name 1', 'Desc.', 'Surat, India', NULL, NULL, '2023-12-14 04:41:00', '2023-12-14', 143, 0),
(49, 'Activity 1', 'Desc.', 'Surat, India', NULL, NULL, '2023-12-13 05:03:00', '2023-12-14', 143, 0),
(50, 'A 1', 'Desc….', 'Surat, India', NULL, NULL, '2023-12-13 05:16:00', '2023-12-14', 143, 0),
(51, 'A 1', 'Desc…', 'Surat, India', NULL, NULL, '2023-12-13 05:25:00', '2023-12-14', 143, 0),
(52, 'A 1', 'Descc..', 'Surat, India', NULL, NULL, '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(53, 'A 1', 'Descc..', 'Surat, India', NULL, NULL, '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(54, 'A 1', 'Descc..', 'Surat, India', NULL, NULL, '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(55, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(56, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(57, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(58, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(59, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(60, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(61, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(62, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(63, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(64, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(65, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(66, 'A 1', 'Descc..', 'Surat, India', 'Surat', 'India\n', '2023-12-13 05:12:00', '2023-12-14', 143, 0),
(67, 'a 2', 'Desc.', 'Surat, India', 'Surat', 'India', '2023-12-13 05:35:00', '2023-12-14', 143, 0),
(68, 'A 3', 'Desc..', 'Surat, India', 'Surat', 'India', '2023-12-13 05:50:00', '2023-12-14', 143, 0),
(69, 'A test', 'Desc…', 'Surat, India', 'Surat', 'India', '2023-12-13 05:51:00', '2023-12-14', 143, 0),
(70, 'activity', 'Description ', 'Acapulco, Mexico', 'Acapulco', 'Mexico', '2023-12-15 11:57:00', '2023-12-14', 149, 0),
(71, 'h', 'B', 'Surat, India', 'Surat', 'India', '2023-12-13 11:59:00', '2023-12-14', 149, 0),
(72, 'Pune', 'Disc', 'Pune, India', 'Pune', 'India', '2023-12-16 12:55:00', '2023-12-14', 149, 0),
(73, 'nature', 'Deep here', 'Indiana, United States', 'Indiana', 'United States', '2023-12-17 16:31:00', '2023-12-15', 150, 0),
(74, 'movie time', 'Enjoy movie and chill', 'Seattle, United States', 'Seattle', 'United States', '2023-12-17 16:38:00', '2023-12-15', 151, 0),
(75, 'movies', 'Chilling movie', 'Seattle, United States', 'Seattle', 'United States', '2023-12-19 16:45:00', '2023-12-15', 151, 0),
(76, 'nature', 'Enjoying nature', 'Surat, India', 'Surat', 'India', '2023-12-16 17:44:00', '2023-12-15', 150, 0),
(82, 'a7', 'Aaa7', 'Surat, India', 'Surat', 'India', '2023-12-15 05:25:00', '2023-12-15', 150, 0),
(85, 'a9', 'Aaaa9', 'Surat, India', 'Surat', 'India', '2023-12-14 05:59:00', '2023-12-15', 150, 0),
(86, 'a1', 'A111', 'Mumbai, India', 'Mumbai', 'India', '2023-12-14 07:04:00', '2023-12-15', 151, 0),
(87, 'a2', 'Bb22', 'Mumbai, India', 'Mumbai', 'India', '2023-12-15 07:06:00', '2023-12-15', 151, 0),
(88, 'b2', 'Bb22', 'Mumbai, India', 'Mumbai', 'India', '2023-12-15 07:07:00', '2023-12-15', 151, 0),
(89, 'b2', 'Bb22', 'Poicha, India', 'Poicha', 'India', '2023-12-16 07:08:00', '2023-12-15', 153, 0),
(90, 'a3', 'Aa33', 'Mumbai, India', 'Mumbai', 'India', '2023-12-15 07:11:00', '2023-12-15', 151, 0),
(91, 'a12', 'Aaaa12', 'Surat, India', 'Surat', 'India', '2023-12-14 07:20:00', '2023-12-15', 150, 0),
(92, 'a13', 'Aaa13', 'Seattle, United States', 'Seattle', 'United States', '2023-12-15 07:23:00', '2023-12-15', 151, 0),
(93, 'a14', 'Aaaa14', 'Surat, India', 'Surat', 'India', '2023-12-15 07:25:00', '2023-12-15', 150, 0),
(94, 'a14', 'Aaaa14', 'Surat, India', 'Surat', 'India', '2023-12-14 07:27:00', '2023-12-15', 150, 0),
(95, 'a15', 'Aaaa15', 'Seattle, United States', 'Seattle', 'United States', '2023-12-14 07:29:00', '2023-12-15', 151, 0),
(96, 'hourse riding', 'Enjoying showing hourse riding', 'Surat, India', 'Surat', 'India', '2023-12-14 11:13:00', '2023-12-15', 154, 0),
(97, 'Korean drama', 'Enjoying Korean dramas…', 'Pune, India', 'Pune', 'India', '2023-12-14 11:16:00', '2023-12-15', 155, 0),
(98, 'hourse', 'Hourse riding', 'Surat, India', 'Surat', 'India', '2023-12-15 03:42:00', '2023-12-16', 154, 0),
(99, 'A1', 'Desc...', 'Pune, India', 'Pune', 'India', '2023-12-15 04:33:00', '2023-12-16', 156, 0),
(100, 'A 1', 'Desc…..', 'Surat, India', 'Surat', 'India', '2023-12-15 10:53:00', '2023-12-16', 159, 0);

-- --------------------------------------------------------

--
-- Table structure for table `liveActivityImages`
--

CREATE TABLE `liveActivityImages` (
  `id` bigint(20) NOT NULL,
  `activityId` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `liveActivityImages`
--

INSERT INTO `liveActivityImages` (`id`, `activityId`, `image`) VALUES
(10, 4, 'https://backend.sayyesadmin.com/files?fileName=image-1677646751526.png'),
(11, 4, 'https://backend.sayyesadmin.com/files?fileName=image-1677646751541.png'),
(12, 4, 'https://backend.sayyesadmin.com/files?fileName=image-1677646751544.png'),
(52, 18, 'https://backend.sayyesadmin.com/files?fileName=image-1678508168369.png'),
(53, 18, 'https://backend.sayyesadmin.com/files?fileName=image-1678508168373.png'),
(54, 18, 'https://backend.sayyesadmin.com/files?fileName=image-1678508168375.png'),
(67, 23, 'https://backend.sayyesadmin.com/files?fileName=image-1678511618990.png'),
(68, 23, 'https://backend.sayyesadmin.com/files?fileName=image-1678511618991.png'),
(69, 23, 'https://backend.sayyesadmin.com/files?fileName=image-1678511618993.png'),
(70, 24, 'https://backend.sayyesadmin.com/files?fileName=image-1678511683730.png'),
(71, 24, 'https://backend.sayyesadmin.com/files?fileName=image-1678511683768.png'),
(72, 24, 'https://backend.sayyesadmin.com/files?fileName=image-1678511683778.png'),
(85, 29, 'https://backend.sayyesadmin.com/files?fileName=image-1678526629578.png'),
(86, 29, 'https://backend.sayyesadmin.com/files?fileName=image-1678526629579.png'),
(87, 29, 'https://backend.sayyesadmin.com/files?fileName=image-1678526629581.png'),
(88, 30, 'https://backend.sayyesadmin.com/files?fileName=image-1678532746362.png'),
(89, 30, 'https://backend.sayyesadmin.com/files?fileName=image-1678532746365.png'),
(90, 30, 'https://backend.sayyesadmin.com/files?fileName=image-1678532746367.png'),
(94, 32, 'https://backend.sayyesadmin.com/files?fileName=image-1678684246529.png'),
(95, 32, 'https://backend.sayyesadmin.com/files?fileName=image-1678684246536.png'),
(96, 32, 'https://backend.sayyesadmin.com/files?fileName=image-1678684246546.png'),
(97, 33, 'https://backend.sayyesadmin.com/files?fileName=image-1680660203873.png'),
(98, 33, 'https://backend.sayyesadmin.com/files?fileName=image-1680660203897.png'),
(99, 33, 'https://backend.sayyesadmin.com/files?fileName=image-1680660203909.png'),
(100, 34, 'https://backend.sayyesadmin.com/files?fileName=image-1683548553276.png'),
(101, 34, 'https://backend.sayyesadmin.com/files?fileName=image-1683548553287.png'),
(102, 34, 'https://backend.sayyesadmin.com/files?fileName=image-1683548553298.png'),
(106, 36, 'https://backend.sayyesadmin.com/files?fileName=image-1700815137672.png'),
(107, 36, 'https://backend.sayyesadmin.com/files?fileName=image-1700815137677.png'),
(108, 36, 'https://backend.sayyesadmin.com/files?fileName=image-1700815137676.png'),
(109, 37, 'https://backend.sayyesadmin.com/files?fileName=image-1700822475951.png'),
(110, 37, 'https://backend.sayyesadmin.com/files?fileName=image-1700822475964.png'),
(111, 37, 'https://backend.sayyesadmin.com/files?fileName=image-1700822475970.png'),
(121, 41, 'https://backend.sayyesadmin.com/files?fileName=image-1701492022831.png'),
(122, 41, 'https://backend.sayyesadmin.com/files?fileName=image-1701492022832.png'),
(123, 41, 'https://backend.sayyesadmin.com/files?fileName=image-1701492022834.png'),
(124, 42, 'https://backend.sayyesadmin.com/files?fileName=image-1701492282564.png'),
(125, 42, 'https://backend.sayyesadmin.com/files?fileName=image-1701492282580.png'),
(126, 42, 'https://backend.sayyesadmin.com/files?fileName=image-1701492282586.png'),
(127, 43, 'https://backend.sayyesadmin.com/files?fileName=image-1701757170738.png'),
(128, 43, 'https://backend.sayyesadmin.com/files?fileName=image-1701757170741.png'),
(129, 43, 'https://backend.sayyesadmin.com/files?fileName=image-1701757170747.png'),
(130, 44, 'http://192.168.29.100:1111/files?fileName=image-1702297662583.png'),
(131, 44, 'http://192.168.29.100:1111/files?fileName=image-1702297662786.png'),
(132, 44, 'http://192.168.29.100:1111/files?fileName=image-1702297663075.png'),
(133, 45, 'http://192.168.29.100:1111/files?fileName=image-1702360147804.png'),
(134, 45, 'http://192.168.29.100:1111/files?fileName=image-1702360150798.png'),
(135, 45, 'http://192.168.29.100:1111/files?fileName=image-1702360153474.png'),
(136, 46, 'http://192.168.29.100:1111/files?fileName=image-1702360545773.png'),
(137, 46, 'http://192.168.29.100:1111/files?fileName=image-1702360547350.png'),
(138, 46, 'http://192.168.29.100:1111/files?fileName=image-1702360549760.png'),
(139, 47, 'http://192.168.29.100:1111/files?fileName=image-1702360718564.png'),
(140, 47, 'http://192.168.29.100:1111/files?fileName=image-1702360718917.png'),
(141, 47, 'http://192.168.29.100:1111/files?fileName=image-1702360719249.png'),
(142, 48, 'http://192.168.29.100:1111/files?fileName=image-1702442546345.png'),
(143, 48, 'http://192.168.29.100:1111/files?fileName=image-1702442548647.png'),
(144, 48, 'http://192.168.29.100:1111/files?fileName=image-1702442551624.png'),
(145, 49, 'http://192.168.29.100:1111/files?fileName=image-1702443925316.png'),
(146, 49, 'http://192.168.29.100:1111/files?fileName=image-1702443927635.png'),
(147, 49, 'http://192.168.29.100:1111/files?fileName=image-1702443930643.png'),
(148, 50, 'http://192.168.29.100:1111/files?fileName=image-1702444642831.png'),
(149, 50, 'http://192.168.29.100:1111/files?fileName=image-1702444645018.png'),
(150, 50, 'http://192.168.29.100:1111/files?fileName=image-1702444646430.png'),
(151, 51, 'http://192.168.29.100:1111/files?fileName=image-1702445205297.png'),
(152, 51, 'http://192.168.29.100:1111/files?fileName=image-1702445206619.png'),
(153, 51, 'http://192.168.29.100:1111/files?fileName=image-1702445207935.png'),
(154, 52, 'http://192.168.29.100:1111/files?fileName=image-1702445467898.jpeg'),
(155, 53, 'http://192.168.29.100:1111/files?fileName=image-1702445537943.jpeg'),
(156, 54, 'http://192.168.29.100:1111/files?fileName=image-1702445543776.jpeg'),
(157, 55, 'http://192.168.29.100:1111/files?fileName=image-1702445601569.jpeg'),
(158, 56, 'http://192.168.29.100:1111/files?fileName=image-1702445612301.jpeg'),
(159, 57, 'http://192.168.29.100:1111/files?fileName=image-1702445614099.jpeg'),
(160, 58, 'http://192.168.29.100:1111/files?fileName=image-1702445622748.jpeg'),
(161, 59, 'http://192.168.29.100:1111/files?fileName=image-1702445630300.jpeg'),
(162, 60, 'http://192.168.29.100:1111/files?fileName=image-1702445631214.jpeg'),
(163, 61, 'http://192.168.29.100:1111/files?fileName=image-1702445632063.jpeg'),
(164, 62, 'http://192.168.29.100:1111/files?fileName=image-1702445632893.jpeg'),
(165, 63, 'http://192.168.29.100:1111/files?fileName=image-1702445633721.jpeg'),
(166, 64, 'http://192.168.29.100:1111/files?fileName=image-1702445634532.jpeg'),
(167, 65, 'http://192.168.29.100:1111/files?fileName=image-1702445635305.jpeg'),
(168, 66, 'http://192.168.29.100:1111/files?fileName=image-1702445662561.jpeg'),
(169, 67, 'http://192.168.29.100:1111/files?fileName=image-1702445755379.png'),
(170, 67, 'http://192.168.29.100:1111/files?fileName=image-1702445756886.png'),
(171, 67, 'http://192.168.29.100:1111/files?fileName=image-1702445759964.png'),
(172, 68, 'http://192.168.29.100:1111/files?fileName=image-1702446668558.png'),
(173, 68, 'http://192.168.29.100:1111/files?fileName=image-1702446670065.png'),
(174, 68, 'http://192.168.29.100:1111/files?fileName=image-1702446670968.png'),
(175, 69, 'http://192.168.29.100:1111/files?fileName=image-1702446749306.png'),
(176, 69, 'http://192.168.29.100:1111/files?fileName=image-1702446750210.png'),
(177, 69, 'http://192.168.29.100:1111/files?fileName=image-1702446753279.png'),
(178, 70, 'http://192.168.29.100:1111/files?fileName=image-1702468736540.png'),
(179, 70, 'http://192.168.29.100:1111/files?fileName=image-1702468736569.png'),
(180, 70, 'http://192.168.29.100:1111/files?fileName=image-1702468736701.png'),
(181, 71, 'http://192.168.29.100:1111/files?fileName=image-1702468809488.png'),
(182, 71, 'http://192.168.29.100:1111/files?fileName=image-1702468809503.png'),
(183, 71, 'http://192.168.29.100:1111/files?fileName=image-1702468809514.png'),
(184, 72, 'http://192.168.29.100:1111/files?fileName=image-1702472161734.png'),
(185, 72, 'http://192.168.29.100:1111/files?fileName=image-1702472161754.png'),
(186, 72, 'http://192.168.29.100:1111/files?fileName=image-1702472161771.png'),
(187, 73, 'http://192.168.29.100:1111/files?fileName=image-1702528378021.png'),
(188, 73, 'http://192.168.29.100:1111/files?fileName=image-1702528375376.png'),
(189, 73, 'http://192.168.29.100:1111/files?fileName=image-1702528380627.png'),
(190, 74, 'http://192.168.29.100:1111/files?fileName=image-1702528784159.png'),
(191, 74, 'http://192.168.29.100:1111/files?fileName=image-1702528784637.png'),
(192, 74, 'http://192.168.29.100:1111/files?fileName=image-1702528784713.png'),
(193, 75, 'http://192.168.29.100:1111/files?fileName=image-1702529164629.png'),
(194, 75, 'http://192.168.29.100:1111/files?fileName=image-1702529165713.png'),
(195, 75, 'http://192.168.29.100:1111/files?fileName=image-1702529165805.png'),
(196, 76, 'http://192.168.29.100:1111/files?fileName=image-1702529451667.png'),
(197, 76, 'http://192.168.29.100:1111/files?fileName=image-1702529453544.png'),
(198, 76, 'http://192.168.29.100:1111/files?fileName=image-1702529455579.png'),
(214, 82, 'http://192.168.29.100:1111/files?fileName=image-1702531550277.png'),
(215, 82, 'http://192.168.29.100:1111/files?fileName=image-1702531552140.png'),
(216, 82, 'http://192.168.29.100:1111/files?fileName=image-1702531554174.png'),
(223, 85, 'http://192.168.29.100:1111/files?fileName=image-1702533620629.png'),
(224, 85, 'http://192.168.29.100:1111/files?fileName=image-1702533625321.png'),
(225, 85, 'http://192.168.29.100:1111/files?fileName=image-1702533623287.png'),
(226, 86, 'http://192.168.29.100:1111/files?fileName=image-1702537539272.png'),
(227, 86, 'http://192.168.29.100:1111/files?fileName=image-1702537539402.png'),
(228, 86, 'http://192.168.29.100:1111/files?fileName=image-1702537539319.png'),
(229, 87, 'http://192.168.29.100:1111/files?fileName=image-1702537621269.png'),
(230, 87, 'http://192.168.29.100:1111/files?fileName=image-1702537622030.png'),
(231, 87, 'http://192.168.29.100:1111/files?fileName=image-1702537623218.png'),
(232, 88, 'http://192.168.29.100:1111/files?fileName=image-1702537685576.png'),
(233, 88, 'http://192.168.29.100:1111/files?fileName=image-1702537686337.png'),
(234, 88, 'http://192.168.29.100:1111/files?fileName=image-1702537687524.png'),
(235, 89, 'http://192.168.29.100:1111/files?fileName=image-1702537768497.png'),
(236, 89, 'http://192.168.29.100:1111/files?fileName=image-1702537770374.png'),
(237, 89, 'http://192.168.29.100:1111/files?fileName=image-1702537772237.png'),
(238, 90, 'http://192.168.29.100:1111/files?fileName=image-1702537968004.png'),
(239, 90, 'http://192.168.29.100:1111/files?fileName=image-1702537968766.png'),
(240, 90, 'http://192.168.29.100:1111/files?fileName=image-1702537969953.png'),
(241, 91, 'http://192.168.29.100:1111/files?fileName=image-1702538488539.png'),
(242, 91, 'http://192.168.29.100:1111/files?fileName=image-1702538490417.png'),
(243, 91, 'http://192.168.29.100:1111/files?fileName=image-1702538493022.png'),
(244, 92, 'http://192.168.29.100:1111/files?fileName=image-1702538623354.png'),
(245, 92, 'http://192.168.29.100:1111/files?fileName=image-1702538623402.png'),
(246, 92, 'http://192.168.29.100:1111/files?fileName=image-1702538623484.png'),
(247, 93, 'http://192.168.29.100:1111/files?fileName=image-1702538786391.png'),
(248, 93, 'http://192.168.29.100:1111/files?fileName=image-1702538788269.png'),
(249, 93, 'http://192.168.29.100:1111/files?fileName=image-1702538790873.png'),
(250, 94, 'http://192.168.29.100:1111/files?fileName=image-1702538892035.png'),
(251, 94, 'http://192.168.29.100:1111/files?fileName=image-1702538893911.png'),
(252, 94, 'http://192.168.29.100:1111/files?fileName=image-1702538896517.png'),
(253, 95, 'http://192.168.29.100:1111/files?fileName=image-1702539029559.png'),
(254, 95, 'http://192.168.29.100:1111/files?fileName=image-1702539030625.png'),
(255, 95, 'http://192.168.29.100:1111/files?fileName=image-1702539030716.png'),
(256, 96, 'http://192.168.29.100:1111/files?fileName=image-1702552504451.png'),
(257, 96, 'http://192.168.29.100:1111/files?fileName=image-1702552507714.png'),
(258, 96, 'http://192.168.29.100:1111/files?fileName=image-1702552505976.png'),
(259, 97, 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png'),
(260, 97, 'http://192.168.29.100:1111/files?fileName=image-1702552655590.png'),
(261, 97, 'http://192.168.29.100:1111/files?fileName=image-1702552655683.png'),
(262, 98, 'http://192.168.29.100:1111/files?fileName=image-1702611975612.png'),
(263, 98, 'http://192.168.29.100:1111/files?fileName=image-1702611979155.png'),
(264, 98, 'http://192.168.29.100:1111/files?fileName=image-1702611977624.png'),
(265, 99, 'http://192.168.29.100:1111/files?fileName=image-1702614848642.png'),
(266, 99, 'http://192.168.29.100:1111/files?fileName=image-1702614848682.png'),
(267, 99, 'http://192.168.29.100:1111/files?fileName=image-1702614848739.png'),
(268, 100, 'http://192.168.29.100:1111/files?fileName=image-1702637618601.png'),
(269, 100, 'http://192.168.29.100:1111/files?fileName=image-1702637618969.png'),
(270, 100, 'http://192.168.29.100:1111/files?fileName=image-1702637619192.png');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `run_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `message`, `user_id`, `created_at`) VALUES
(1, 'you have receive a request from TWO', '39', '2023-03-01'),
(2, 'TWO  confirm the date at 2023-03-01', '39', '2023-03-01'),
(3, 'you have receive a request from TWO', '43', '2023-03-01'),
(4, 'you have receive a request from Sayyes ', '39', '2023-03-02'),
(5, 'you have receive a request from rico', '39', '2023-03-03'),
(6, 'you have receive a request from rico', '39', '2023-03-03'),
(7, 'you have receive a request from JOHN', '60', '2023-03-04'),
(8, 'JOHN  confirm the date at 2023-03-11', '60', '2023-03-04'),
(9, 'you have receive a request from Honey', '7', '2023-03-09'),
(10, 'you have receive a request from AARAV', '60', '2023-03-10'),
(11, 'you have receive a request from SMIT', '60', '2023-03-10'),
(12, 'AARAV  confirm the date at 2023-03-10', '60', '2023-03-10'),
(13, 'you have receive a request from AARAV', '60', '2023-03-10'),
(14, 'you have receive a request from AARAV', '60', '2023-03-10'),
(15, 'JOHN  confirm the date at 2023-03-11', '60', '2023-03-10'),
(16, 'JOHN  confirm the date at 2023-03-11', '60', '2023-03-10'),
(17, 'JOHN  confirm the date at 2023-03-11', '60', '2023-03-10'),
(18, 'JOHN  confirm the date at 2023-03-11', '60', '2023-03-10'),
(19, 'you have receive a request from SMIT', '66', '2023-03-11'),
(20, 'you have receive a request from Honey', '66', '2023-03-11'),
(21, 'SMIT  confirm the date at 2023-03-11', '66', '2023-03-11'),
(22, 'Honey  confirm the date at 2023-03-11', '66', '2023-03-11'),
(23, 'you have receive a request from Honey', '67', '2023-03-11'),
(24, 'you have receive a request from AARAV', '67', '2023-03-11'),
(25, 'Honey  confirm the date at 2023-03-09', '7', '2023-03-13'),
(26, 'you have receive a request from MyJuicyPassion', '7', '2023-03-20'),
(27, 'you have receive a request from ti Fleche ', '62', '2023-03-20'),
(28, 'ti Fleche   confirm the date at 2023-03-20', '62', '2023-03-20'),
(29, 'you have receive a request from ti Fleche ', '62', '2023-03-20'),
(30, 'you have receive a request from ti Fleche ', '69', '2023-03-22'),
(31, 'you have receive a request from ti Fleche ', '69', '2023-03-22'),
(32, 'ti Fleche   confirm the date at 2023-03-23', '69', '2023-03-22'),
(33, 'you have receive a request from ti Fleche ', '73', '2023-03-25'),
(34, 'ti Fleche   confirm the date at 2023-03-25', '73', '2023-03-25'),
(35, 'you have receive a request from david ', '7', '2023-03-25'),
(36, 'you have receive a request from ti Flèche ', '73', '2023-04-04'),
(37, 'you have receive a request from young_nrestless', '7', '2023-04-06'),
(38, 'you have receive a request from ti Flèche ', '74', '2023-04-06'),
(39, 'you have receive a request from vicenterancel', '27', '2023-04-13'),
(40, 'you have receive a request from dips johnson', '60', '2023-05-08'),
(41, 'you have receive a request from dips johnson', '59', '2023-05-08'),
(42, 'you have receive a request from camillegilbert_206', '89', '2023-09-22'),
(43, 'you have receive a request from mansi', '60', '2023-11-24'),
(44, 'you have receive a request from mansi', '60', '2023-11-24'),
(45, 'you have receive a request from mansi', '60', '2023-11-24'),
(46, 'you have receive a request from mansi', '67', '2023-11-24'),
(47, 'you have receive a request from mansi', '67', '2023-11-24'),
(48, 'you have receive a request from mansi', '54', '2023-11-24'),
(49, 'you have receive a request from mansi', '54', '2023-11-24'),
(50, 'you have receive a request from mansi', '98', '2023-11-24'),
(51, 'you have receive a request from mansi', '27', '2023-11-24'),
(52, 'you have receive a request from mansi', '98', '2023-11-24'),
(53, 'you have receive a request from mansi', '98', '2023-11-24'),
(54, 'you have receive a request from mansi', '94', '2023-11-24'),
(55, 'you have receive a request from mansi', '93', '2023-11-24'),
(56, 'you have receive a request from swift taylor', '52', '2023-11-24'),
(57, 'you have receive a request from swift taylor', '27', '2023-11-24'),
(58, 'you have receive a request from mansi', '60', '2023-11-24'),
(59, 'you have receive a request from mansi', '52', '2023-11-24'),
(60, 'you have receive a request from mansi', '27', '2023-11-24'),
(61, 'you have receive a request from mansi', '100', '2023-11-24'),
(62, 'you have receive a request from mansi', '100', '2023-11-24'),
(63, 'you have receive a request from palak', '98', '2023-11-24'),
(64, 'you have receive a request from palak', '99', '2023-11-24'),
(65, 'you have receive a request from palak', '99', '2023-11-24'),
(66, 'you have receive a request from palak', '99', '2023-11-24'),
(67, 'you have receive a request from mansi', '105', '2023-11-24'),
(68, 'mansi  confirm the date at 2023-11-24', '105', '2023-11-24'),
(69, 'palak  confirm the date at 2023-11-24', '99', '2023-11-24'),
(70, 'you have receive a request from palak', '99', '2023-11-25'),
(71, 'you have receive a request from Piyush Vasoya', '106', '2023-11-27'),
(72, 'Piyush Vasoya  confirm the date at 2023-11-27', '106', '2023-11-27'),
(73, 'you have receive a request from Deep Savaliya', '107', '2023-11-27'),
(74, 'Deep Savaliya  confirm the date at 2023-11-27', '107', '2023-11-27'),
(75, 'you have receive a request from Deep Savaliya', '107', '2023-11-27'),
(76, 'you have receive a request from deep', '66', '2023-12-02'),
(77, 'you have receive a request from Belle', '66', '2023-12-02'),
(78, 'you have receive a request from deep', '66', '2023-12-02'),
(79, 'you have receive a request from deep', '27', '2023-12-02'),
(80, 'you have receive a request from Honey', '109', '2023-12-02'),
(81, 'you have receive a request from Honey', '109', '2023-12-02'),
(82, 'you have receive a request from Honey', '109', '2023-12-02'),
(83, 'you have receive a request from Rahul', '60', '2023-12-04'),
(84, 'you have receive a request from Honey', '27', '2023-12-04'),
(85, 'you have receive a request from Honey', '27', '2023-12-05'),
(86, 'you have receive a request from Honey', '27', '2023-12-05'),
(87, 'you have receive a request from Honey', '52', '2023-12-05'),
(88, 'you have receive a request from Honey', '52', '2023-12-05'),
(89, 'you have receive a request from Honey', '27', '2023-12-05'),
(90, 'you have receive a request from Honey', '27', '2023-12-05'),
(91, 'you have receive a request from Honey', '27', '2023-12-05'),
(92, 'you have receive a request from Honey', '27', '2023-12-05'),
(93, 'you have receive a request from Piyush', '107', '2023-12-05'),
(94, 'you have receive a request from Piyush', '60', '2023-12-05'),
(95, 'you have receive a request from Piyush', '60', '2023-12-05'),
(96, 'Dips johnson  confirm the date at 2023-05-08', '60', '2023-12-05'),
(97, 'you have receive a request from Rahul', '60', '2023-12-05'),
(98, 'you have receive a request from Rahul', '110', '2023-12-05'),
(99, 'Rahul  confirm the date at 2024-02-05', '110', '2023-12-05'),
(100, 'you have receive a request from Piyush', '111', '2023-12-05'),
(101, 'Piyush  confirm the date at 2023-12-05', '111', '2023-12-05'),
(102, 'you have receive a request from Piyush', '60', '2023-12-06'),
(103, 'you have receive a request from Piyush', '107', '2023-12-06'),
(104, 'you have receive a request from Piyush', '111', '2023-12-06'),
(105, 'Piyush  confirm the date at 2023-12-06', '111', '2023-12-06'),
(106, 'you have receive a request from Piyush', '111', '2023-12-06'),
(107, 'Piyush  confirm the date at 2023-12-06', '111', '2023-12-06'),
(108, 'you have receive a request from Piyush', '107', '2023-12-06'),
(109, 'you have receive a request from Piyush', '111', '2023-12-06'),
(110, 'Piyush  confirm the date at 2023-12-06', '111', '2023-12-06'),
(111, 'you have receive a request from Rahul', '110', '2023-12-06'),
(112, 'you have receive a request from Rahul', '110', '2023-12-06'),
(113, 'you have receive a request from Piyush', '111', '2023-12-06'),
(114, 'Rahul  confirm the date at 2024-01-06', '110', '2023-12-06'),
(115, 'you have receive a request from Piyush', '111', '2023-12-06'),
(116, 'Piyush  confirm the date at 2023-12-06', '111', '2023-12-06'),
(117, 'you have receive a request from Rahul', '110', '2023-12-06'),
(118, 'Rahul  confirm the date at 2024-02-06', '110', '2023-12-06'),
(119, 'you have receive a request from Rahul', '110', '2023-12-06'),
(120, 'you have receive a request from Piyush', '56', '2023-12-06'),
(121, 'you have receive a request from Rahul', '106', '2023-12-06'),
(122, 'you have receive a request from Rahul', '98', '2023-12-06'),
(123, 'you have receive a request from Piyush', '98', '2023-12-07'),
(124, 'you have receive a request from Rahul', '110', '2023-12-07'),
(125, 'you have receive a request from Piyush', '111', '2023-12-07'),
(126, 'you have receive a request from a', '118', '2023-12-08'),
(127, 'you have receive a request from Piyush', '118', '2023-12-08'),
(128, 'you have receive a request from Macy’s', '9', '2023-12-09'),
(129, 'you have receive a request from Macy’s', '26', '2023-12-09'),
(130, 'you have receive a request from Macy’s', '122', '2023-12-09'),
(131, 'you have receive a request from Macy’s', '119', '2023-12-09'),
(132, 'you have receive a request from jash07', '128', '2023-12-11'),
(133, 'you have receive a request from janvi_05', '119', '2023-12-11'),
(134, 'you have receive a request from rajvi_01', '137', '2023-12-11'),
(135, 'you have receive a request from maya sharma', '138', '2023-12-11'),
(136, 'you have receive a request from rajvi birla', '139', '2023-12-11'),
(137, 'you have receive a request from kaxa dhanani', '138', '2023-12-11'),
(138, 'you have receive a request from maya sharma', '138', '2023-12-11'),
(139, 'you have receive a request from rajvi birla', '137', '2023-12-11'),
(140, 'maya sharma  confirm the date at 2023-12-11', '138', '2023-12-11'),
(141, 'you have receive a request from Rajvi birla', '137', '2023-12-11'),
(142, 'Rajvi birla  confirm the date at 2024-01-11', '137', '2023-12-11'),
(143, 'you have receive a request from Deep kmsoft', '141', '2023-12-11'),
(144, 'you have receive a request from Deep kmsoft', '141', '2023-12-11'),
(145, 'Deep kmsoft  confirm the date at 2023-12-11', '141', '2023-12-11'),
(146, 'you have receive a request from Rahul Shah', '142', '2023-12-11'),
(147, 'Rahul Shah  confirm the date at 2023-12-11', '142', '2023-12-11'),
(148, 'Deep kmsoft  confirm the date at 2024-01-11', '141', '2023-12-11'),
(149, 'you have receive a request from Deep kmsoft', '141', '2023-12-11'),
(150, 'you have receive a request from Rahul 2 kmsoft', '143', '2023-12-12'),
(151, 'you have receive a request from Rahul Shah', '143', '2023-12-12'),
(152, 'you have receive a request from 1', '149', '2023-12-13'),
(153, 'you have receive a request from 1', '149', '2023-12-13'),
(154, 'you have receive a request from 1', '149', '2023-12-13'),
(155, 'you have receive a request from 1', '149', '2023-12-13'),
(156, 'you have receive a request from 1', '149', '2023-12-13'),
(157, 'you have receive a request from 1', '149', '2023-12-13'),
(158, 'you have receive a request from 1', '149', '2023-12-13'),
(159, 'you have receive a request from test', '147', '2023-12-13'),
(160, 'you have receive a request from test', '147', '2023-12-13'),
(161, 'you have receive a request from 1', '149', '2023-12-13'),
(162, '1  confirm the date at 2023-12-14', '149', '2023-12-13'),
(163, 'you have receive a request from piyush vasoya', '150', '2023-12-14'),
(164, 'piyush vasoya  confirm the date at 2023-12-14', '150', '2023-12-14'),
(165, 'you have receive a request from deep savaliya', '151', '2023-12-14'),
(166, 'deep savaliya  confirm the date at 2023-12-14', '151', '2023-12-14'),
(167, 'you have receive a request from akbar ', '153', '2023-12-14'),
(168, 'you have receive a request from birbal', '152', '2023-12-14'),
(169, 'akbar   confirm the date at 2023-12-14', '153', '2023-12-14'),
(170, 'birbal  confirm the date at 2023-12-14', '152', '2023-12-14'),
(171, 'you have receive a request from piyush vasoya', '152', '2023-12-14'),
(172, 'piyush vasoya  confirm the date at 2023-12-14', '152', '2023-12-14'),
(173, 'you have receive a request from birbal', '151', '2023-12-14'),
(174, 'birbal  confirm the date at 2023-12-14', '151', '2023-12-14'),
(175, 'you have receive a request from dipen', '154', '2023-12-14'),
(176, 'dipen  confirm the date at 2023-12-14', '154', '2023-12-14'),
(177, 'you have receive a request from shruti', '155', '2023-12-14'),
(178, 'you have receive a request from shruti', '155', '2023-12-14'),
(179, 'you have receive a request from lucidwillfit', '155', '2023-12-14'),
(180, 'you have receive a request from shruti', '155', '2023-12-14'),
(181, 'you have receive a request from shruti', '155', '2023-12-14'),
(182, 'you have receive a request from piyush vasoya', '155', '2023-12-14'),
(183, 'you have receive a request from shruti', '155', '2023-12-14'),
(184, 'you have receive a request from Rahul', '150', '2023-12-15'),
(185, 'Rahul  confirm the date at 2023-01-15', '150', '2023-12-15'),
(186, 'you have receive a request from Rahul', '150', '2023-12-15'),
(187, 'you have receive a request from Rahul', '154', '2023-12-15'),
(188, 'you have receive a request from deep savaliya', '154', '2023-12-15'),
(189, 'you have receive a request from Rahul', '154', '2023-12-15'),
(190, 'you have receive a request from Rahul', '154', '2023-12-15'),
(191, 'you have receive a request from dipen', '156', '2023-12-15'),
(192, 'dipen  confirm the date at 2023-12-15', '156', '2023-12-15'),
(193, 'you have receive a request from shruti', '156', '2023-12-15'),
(194, 'shruti  confirm the date at 2023-12-15', '156', '2023-12-15'),
(195, 'you have receive a request from dipen', '156', '2023-12-15'),
(196, 'dipen  confirm the date at 2023-12-15', '156', '2023-12-15'),
(197, 'you have receive a request from dipen', '156', '2023-12-15'),
(198, 'you have receive a request from Shruti', '156', '2023-12-15'),
(199, 'you have receive a request from minaty', '156', '2023-12-15'),
(200, 'you have receive a request from minaty', '156', '2023-12-15'),
(201, 'minaty  confirm the date at 2023-12-15', '156', '2023-12-15'),
(202, 'you have receive a request from Rahul', '157', '2023-12-15'),
(203, 'you have receive a request from Rahul', '158', '2023-12-15'),
(204, 'Rahul  confirm the date at 2023-12-15', '158', '2023-12-15'),
(205, 'Rahul  confirm the date at 2023-12-15', '158', '2023-12-15'),
(206, 'you have receive a request from kavya sharma', '156', '2023-12-15'),
(207, 'kavya sharma  confirm the date at 2023-12-15', '156', '2023-12-15'),
(208, 'you have receive a request from Simit', '150', '2023-12-15'),
(209, 'you have receive a request from kavya sharma', '156', '2023-12-15'),
(210, 'you have receive a request from Rahul', '159', '2023-12-15'),
(211, 'you have receive a request from kavya sharma', '156', '2023-12-15'),
(212, 'Rahul  confirm the date at 2023-12-15', '159', '2023-12-15'),
(213, 'you have receive a request from Rahul', '158', '2023-12-15'),
(214, 'you have receive a request from Rahul', '158', '2023-12-15'),
(215, 'you have receive a request from kavya sharma', '156', '2023-12-15'),
(216, 'you have receive a request from kavya sharma', '156', '2023-12-15'),
(217, 'you have receive a request from kavya sharma', '156', '2023-12-15'),
(218, 'you have receive a request from Rahul', '155', '2023-12-15'),
(219, 'you have receive a request from dipen', '156', '2023-12-15');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) NOT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `receiver_id` bigint(20) DEFAULT NULL,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `sender_id`, `receiver_id`, `createdAt`) VALUES
(1, 39, 40, '2023-03-01'),
(2, 60, 59, '2023-03-04'),
(3, 66, 60, '2023-03-10'),
(4, 7, 60, '2023-03-13'), 
(5, 7, 62, '2023-03-20'),
(6, 7, 69, '2023-03-22'),
(7, 7, 73, '2023-03-25'),
(8, 99, 105, '2023-11-24'),
(9, 106, 107, '2023-11-27'),
(10, 110, 111, '2023-12-05'),
(11, 142, 141, '2023-12-11'),
(12, 150, 151, '2023-12-14'),
(13, 152, 153, '2023-12-14'),
(14, 152, 151, '2023-12-14'),
(15, 153, 151, '2023-12-14'),
(16, 154, 155, '2023-12-14'),
(17, 150, 156, '2023-12-15'),
(18, 156, 157, '2023-12-15'),
(19, 156, 159, '2023-12-15'),
(20, 158, 156, '2023-12-15');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userActivities`
--

CREATE TABLE `userActivities` (
  `id` bigint(20) NOT NULL,
  `sentBy` bigint(20) DEFAULT NULL,
  `sentTo` bigint(20) DEFAULT NULL,
  `latitude` decimal(10,0) DEFAULT NULL,
  `longitude` decimal(10,0) DEFAULT NULL,
  `activityId` bigint(20) DEFAULT NULL,
  `activityTime` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `isAccepted` tinyint(4) DEFAULT 0,
  `clientResponse` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `userImages`
--

CREATE TABLE `userImages` (
  `id` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userImages`
--

INSERT INTO `userImages` (`id`, `userId`, `image`) VALUES
(4, 39, 'https://backend.sayyesadmin.com/files?fileName=image-1676691569036.png'),
(5, 39, 'https://backend.sayyesadmin.com/files?fileName=image-1676691581246.png'),
(6, 39, 'https://backend.sayyesadmin.com/files?fileName=image-1676691591558.png'),
(7, 40, 'https://backend.sayyesadmin.com/files?fileName=image-1676703118679.png'),
(8, 40, 'https://backend.sayyesadmin.com/files?fileName=image-1676703127647.png'),
(10, 43, 'https://backend.sayyesadmin.com/files?fileName=image-1677148680299.png'),
(11, 43, 'https://backend.sayyesadmin.com/files?fileName=image-1677148690527.png'),
(12, 43, 'https://backend.sayyesadmin.com/files?fileName=image-1677148701809.png'),
(13, 44, 'https://backend.sayyesadmin.com/files?fileName=image-1677153586345.png'),
(14, 44, 'https://backend.sayyesadmin.com/files?fileName=image-1677153595200.png'),
(15, 44, 'https://backend.sayyesadmin.com/files?fileName=image-1677153600930.png'),
(16, 45, 'https://backend.sayyesadmin.com/files?fileName=image-1677777260698.png'),
(17, 45, 'https://backend.sayyesadmin.com/files?fileName=image-1677779340987.png'),
(18, 45, 'https://backend.sayyesadmin.com/files?fileName=image-1677779410389.png'),
(19, 46, 'https://backend.sayyesadmin.com/files?fileName=image-1677779582550.png'),
(20, 46, 'https://backend.sayyesadmin.com/files?fileName=image-1677779603468.png'),
(21, 46, 'https://backend.sayyesadmin.com/files?fileName=image-1677779658610.png'),
(22, 47, 'https://backend.sayyesadmin.com/files?fileName=image-1677781230712.png'),
(23, 47, 'https://backend.sayyesadmin.com/files?fileName=image-1677781250184.png'),
(24, 47, 'https://backend.sayyesadmin.com/files?fileName=image-1677781260229.png'),
(25, 48, 'https://backend.sayyesadmin.com/files?fileName=image-1677790416676.png'),
(26, 48, 'https://backend.sayyesadmin.com/files?fileName=image-1677790441077.png'),
(27, 48, 'https://backend.sayyesadmin.com/files?fileName=image-1677790479043.png'),
(28, 50, 'https://backend.sayyesadmin.com/files?fileName=image-1677795504684.png'),
(30, 50, 'https://backend.sayyesadmin.com/files?fileName=image-1677795959871.png'),
(31, 50, 'https://backend.sayyesadmin.com/files?fileName=image-1677795989289.png'),
(32, 52, 'https://backend.sayyesadmin.com/files?fileName=image-1677816359111.png'),
(33, 52, 'https://backend.sayyesadmin.com/files?fileName=image-1677816377008.png'),
(34, 52, 'https://backend.sayyesadmin.com/files?fileName=image-1677816405118.png'),
(35, 53, 'https://backend.sayyesadmin.com/files?fileName=image-1677844596096.png'),
(36, 53, 'https://backend.sayyesadmin.com/files?fileName=image-1677844623326.png'),
(37, 53, 'https://backend.sayyesadmin.com/files?fileName=image-1677844655125.png'),
(41, 55, 'https://backend.sayyesadmin.com/files?fileName=image-1677879717893.png'),
(42, 55, 'https://backend.sayyesadmin.com/files?fileName=image-1677879725551.png'),
(43, 55, 'https://backend.sayyesadmin.com/files?fileName=image-1677879735043.png'),
(44, 56, 'https://backend.sayyesadmin.com/files?fileName=image-1677895805705.png'),
(45, 56, 'https://backend.sayyesadmin.com/files?fileName=image-1677895885189.png'),
(46, 56, 'https://backend.sayyesadmin.com/files?fileName=image-1677895926712.png'),
(47, 58, 'https://backend.sayyesadmin.com/files?fileName=image-1677924040590.png'),
(48, 58, 'https://backend.sayyesadmin.com/files?fileName=image-1677924055927.png'),
(49, 58, 'https://backend.sayyesadmin.com/files?fileName=image-1677924078407.png'),
(50, 59, 'https://backend.sayyesadmin.com/files?fileName=image-1677939352633.png'),
(51, 59, 'https://backend.sayyesadmin.com/files?fileName=image-1677939361080.png'),
(52, 59, 'https://backend.sayyesadmin.com/files?fileName=image-1677939373369.png'),
(53, 60, 'https://backend.sayyesadmin.com/files?fileName=image-1677939544048.png'),
(54, 60, 'https://backend.sayyesadmin.com/files?fileName=image-1677939553791.png'),
(55, 60, 'https://backend.sayyesadmin.com/files?fileName=image-1677939563261.png'),
(56, 61, 'https://backend.sayyesadmin.com/files?fileName=image-1677942558078.png'),
(57, 61, 'https://backend.sayyesadmin.com/files?fileName=image-1677942585369.png'),
(58, 61, 'https://backend.sayyesadmin.com/files?fileName=image-1677942604881.png'),
(59, 62, 'https://backend.sayyesadmin.com/files?fileName=image-1677963665131.png'),
(60, 62, 'https://backend.sayyesadmin.com/files?fileName=image-1677963696502.png'),
(61, 62, 'https://backend.sayyesadmin.com/files?fileName=image-1677963825860.png'),
(62, 7, 'https://backend.sayyesadmin.com/files?fileName=image-1677991698174.png'),
(63, 7, 'https://backend.sayyesadmin.com/files?fileName=image-1677991789363.png'),
(64, 7, 'https://backend.sayyesadmin.com/files?fileName=image-1677991851045.png'),
(65, 63, 'https://backend.sayyesadmin.com/files?fileName=image-1678112386485.png'),
(66, 63, 'https://backend.sayyesadmin.com/files?fileName=image-1678112417267.png'),
(67, 63, 'https://backend.sayyesadmin.com/files?fileName=image-1678112465570.png'),
(68, 64, 'https://backend.sayyesadmin.com/files?fileName=image-1678175443348.png'),
(69, 64, 'https://backend.sayyesadmin.com/files?fileName=image-1678175488854.png'),
(70, 64, 'https://backend.sayyesadmin.com/files?fileName=image-1678175541836.png'),
(71, 65, 'https://backend.sayyesadmin.com/files?fileName=image-1678188948523.png'),
(72, 65, 'https://backend.sayyesadmin.com/files?fileName=image-1678189006011.png'),
(73, 65, 'https://backend.sayyesadmin.com/files?fileName=image-1678189022851.png'),
(74, 57, 'https://backend.sayyesadmin.com/files?fileName=image-1678294025678.png'),
(75, 57, 'https://backend.sayyesadmin.com/files?fileName=image-1678294051970.png'),
(77, 57, 'https://backend.sayyesadmin.com/files?fileName=image-1678294104842.png'),
(78, 66, 'https://backend.sayyesadmin.com/files?fileName=image-1678425498066.png'),
(79, 66, 'https://backend.sayyesadmin.com/files?fileName=image-1678425507465.png'),
(80, 66, 'https://backend.sayyesadmin.com/files?fileName=image-1678425514125.png'),
(81, 67, 'https://backend.sayyesadmin.com/files?fileName=image-1678426508504.png'),
(82, 67, 'https://backend.sayyesadmin.com/files?fileName=image-1678426519612.png'),
(83, 67, 'https://backend.sayyesadmin.com/files?fileName=image-1678426527848.png'),
(84, 68, 'https://backend.sayyesadmin.com/files?fileName=image-1678648028469.png'),
(85, 68, 'https://backend.sayyesadmin.com/files?fileName=image-1678648062036.png'),
(86, 68, 'https://backend.sayyesadmin.com/files?fileName=image-1678648089925.png'),
(87, 69, 'https://backend.sayyesadmin.com/files?fileName=image-1678985132748.png'),
(88, 69, 'https://backend.sayyesadmin.com/files?fileName=image-1678986041318.png'),
(89, 69, 'https://backend.sayyesadmin.com/files?fileName=image-1678986512052.png'),
(90, 70, 'https://backend.sayyesadmin.com/files?fileName=image-1678994551205.png'),
(92, 70, 'https://backend.sayyesadmin.com/files?fileName=image-1678995522521.png'),
(93, 70, 'https://backend.sayyesadmin.com/files?fileName=image-1678995536721.png'),
(97, 72, 'https://backend.sayyesadmin.com/files?fileName=image-1679188212339.png'),
(98, 72, 'https://backend.sayyesadmin.com/files?fileName=image-1679188232032.png'),
(99, 72, 'https://backend.sayyesadmin.com/files?fileName=image-1679188265490.png'),
(100, 73, 'https://backend.sayyesadmin.com/files?fileName=image-1679718525403.png'),
(101, 73, 'https://backend.sayyesadmin.com/files?fileName=image-1679718548396.png'),
(102, 73, 'https://backend.sayyesadmin.com/files?fileName=image-1679718565518.png'),
(103, 74, 'https://backend.sayyesadmin.com/files?fileName=image-1680052475395.png'),
(104, 74, 'https://backend.sayyesadmin.com/files?fileName=image-1680052529951.png'),
(105, 74, 'https://backend.sayyesadmin.com/files?fileName=image-1680052585955.png'),
(106, 75, 'https://backend.sayyesadmin.com/files?fileName=image-1680226829229.png'),
(107, 75, 'https://backend.sayyesadmin.com/files?fileName=image-1680226837496.png'),
(108, 75, 'https://backend.sayyesadmin.com/files?fileName=image-1680226843462.png'),
(109, 71, 'https://backend.sayyesadmin.com/files?fileName=image-1681412767173.png'),
(110, 77, 'https://backend.sayyesadmin.com/files?fileName=image-1683548045968.png'),
(111, 77, 'https://backend.sayyesadmin.com/files?fileName=image-1683548143647.png'),
(112, 77, 'https://backend.sayyesadmin.com/files?fileName=image-1683548158528.png'),
(113, 77, 'https://backend.sayyesadmin.com/files?fileName=image-1683548173698.png'),
(114, 78, 'https://backend.sayyesadmin.com/files?fileName=image-1683656885481.png'),
(115, 78, 'https://backend.sayyesadmin.com/files?fileName=image-1683657042407.png'),
(116, 81, 'https://backend.sayyesadmin.com/files?fileName=image-1684434020239.png'),
(117, 81, 'https://backend.sayyesadmin.com/files?fileName=image-1684434033851.png'),
(118, 81, 'https://backend.sayyesadmin.com/files?fileName=image-1684434045919.png'),
(119, 82, 'https://backend.sayyesadmin.com/files?fileName=image-1684602307300.png'),
(120, 82, 'https://backend.sayyesadmin.com/files?fileName=image-1684602327673.png'),
(121, 82, 'https://backend.sayyesadmin.com/files?fileName=image-1684602344446.png'),
(122, 83, 'https://backend.sayyesadmin.com/files?fileName=image-1684879565733.png'),
(123, 83, 'https://backend.sayyesadmin.com/files?fileName=image-1684879586149.png'),
(124, 83, 'https://backend.sayyesadmin.com/files?fileName=image-1684879602762.png'),
(125, 84, 'https://backend.sayyesadmin.com/files?fileName=image-1685845478413.png'),
(126, 84, 'https://backend.sayyesadmin.com/files?fileName=image-1685845504937.png'),
(127, 84, 'https://backend.sayyesadmin.com/files?fileName=image-1685845528310.png'),
(128, 85, 'https://backend.sayyesadmin.com/files?fileName=image-1688183452509.png'),
(129, 87, 'https://backend.sayyesadmin.com/files?fileName=image-1690282447884.png'),
(130, 87, 'https://backend.sayyesadmin.com/files?fileName=image-1690282506068.png'),
(131, 87, 'https://backend.sayyesadmin.com/files?fileName=image-1690282642157.png'),
(132, 89, 'https://backend.sayyesadmin.com/files?fileName=image-1695394718448.png'),
(133, 89, 'https://backend.sayyesadmin.com/files?fileName=image-1695394762536.png'),
(134, 89, 'https://backend.sayyesadmin.com/files?fileName=image-1695394785772.png'),
(135, 90, 'https://backend.sayyesadmin.com/files?fileName=image-1695885500484.png'),
(136, 90, 'https://backend.sayyesadmin.com/files?fileName=image-1695885510414.png'),
(137, 90, 'https://backend.sayyesadmin.com/files?fileName=image-1695885516597.png'),
(138, 91, 'https://backend.sayyesadmin.com/files?fileName=image-1696092727130.png'),
(139, 91, 'https://backend.sayyesadmin.com/files?fileName=image-1696092741918.png'),
(140, 91, 'https://backend.sayyesadmin.com/files?fileName=image-1696092766529.png'),
(141, 92, 'https://backend.sayyesadmin.com/files?fileName=image-1698631080096.png'),
(142, 92, 'https://backend.sayyesadmin.com/files?fileName=image-1698631122813.png'),
(143, 92, 'https://backend.sayyesadmin.com/files?fileName=image-1698631245586.png'),
(144, 93, 'https://backend.sayyesadmin.com/files?fileName=image-1698719179470.png'),
(145, 93, 'https://backend.sayyesadmin.com/files?fileName=image-1698719223528.png'),
(146, 93, 'https://backend.sayyesadmin.com/files?fileName=image-1698719271653.png'),
(147, 94, 'https://backend.sayyesadmin.com/files?fileName=image-1699083912632.png'),
(148, 94, 'https://backend.sayyesadmin.com/files?fileName=image-1699083932209.png'),
(149, 94, 'https://backend.sayyesadmin.com/files?fileName=image-1699083947287.png'),
(150, 94, 'https://backend.sayyesadmin.com/files?fileName=image-1699083958675.png'),
(151, 94, 'https://backend.sayyesadmin.com/files?fileName=image-1699083971401.png'),
(152, 94, 'https://backend.sayyesadmin.com/files?fileName=image-1699083984631.png'),
(155, 95, 'https://backend.sayyesadmin.com/files?fileName=image-1700254728056.png'),
(156, 95, 'https://backend.sayyesadmin.com/files?fileName=image-1700254746604.png'),
(157, 95, 'https://backend.sayyesadmin.com/files?fileName=image-1700254788509.png'),
(158, 96, 'https://backend.sayyesadmin.com/files?fileName=image-1700268978250.png'),
(159, 96, 'https://backend.sayyesadmin.com/files?fileName=image-1700268996698.png'),
(160, 96, 'https://backend.sayyesadmin.com/files?fileName=image-1700269016934.png'),
(161, 97, 'https://backend.sayyesadmin.com/files?fileName=image-1700273247452.png'),
(162, 97, 'https://backend.sayyesadmin.com/files?fileName=image-1700273390983.png'),
(163, 97, 'https://backend.sayyesadmin.com/files?fileName=image-1700273405849.png'),
(164, 98, 'https://backend.sayyesadmin.com/files?fileName=image-1700801585947.png'),
(165, 98, 'https://backend.sayyesadmin.com/files?fileName=image-1700801600129.png'),
(166, 98, 'https://backend.sayyesadmin.com/files?fileName=image-1700801620379.png'),
(170, 101, 'https://backend.sayyesadmin.com/files?fileName=image-1700808818688.png'),
(171, 101, 'https://backend.sayyesadmin.com/files?fileName=image-1700808840508.png'),
(172, 101, 'https://backend.sayyesadmin.com/files?fileName=image-1700808860053.png'),
(173, 102, 'https://backend.sayyesadmin.com/files?fileName=image-1700809045575.png'),
(174, 102, 'https://backend.sayyesadmin.com/files?fileName=image-1700809053666.png'),
(175, 102, 'https://backend.sayyesadmin.com/files?fileName=image-1700809067609.png'),
(176, 102, 'https://backend.sayyesadmin.com/files?fileName=image-1700809094368.png'),
(177, 102, 'https://backend.sayyesadmin.com/files?fileName=image-1700809118038.png'),
(178, 102, 'https://backend.sayyesadmin.com/files?fileName=image-1700809140820.png'),
(179, 99, 'https://backend.sayyesadmin.com/files?fileName=image-1700809259446.png'),
(183, 103, 'https://backend.sayyesadmin.com/files?fileName=image-1700817070333.png'),
(184, 103, 'https://backend.sayyesadmin.com/files?fileName=image-1700817081686.png'),
(185, 103, 'https://backend.sayyesadmin.com/files?fileName=image-1700817090100.png'),
(186, 103, 'https://backend.sayyesadmin.com/files?fileName=image-1700817098939.png'),
(187, 104, 'https://backend.sayyesadmin.com/files?fileName=image-1700823074191.png'),
(188, 104, 'https://backend.sayyesadmin.com/files?fileName=image-1700823079186.png'),
(189, 104, 'https://backend.sayyesadmin.com/files?fileName=image-1700823083694.png'),
(190, 104, 'https://backend.sayyesadmin.com/files?fileName=image-1700823088093.png'),
(191, 104, 'https://backend.sayyesadmin.com/files?fileName=image-1700823095700.png'),
(192, 104, 'https://backend.sayyesadmin.com/files?fileName=image-1700823101462.png'),
(196, 99, 'https://backend.sayyesadmin.com/files?fileName=image-1700885329798.png'),
(197, 99, 'https://backend.sayyesadmin.com/files?fileName=image-1700885344576.png'),
(198, 99, 'https://backend.sayyesadmin.com/files?fileName=image-1700885362963.png'),
(199, 99, 'https://backend.sayyesadmin.com/files?fileName=image-1700885389867.png'),
(200, 99, 'https://backend.sayyesadmin.com/files?fileName=image-1700885412070.png'),
(202, 105, 'https://backend.sayyesadmin.com/files?fileName=image-1700885490898.png'),
(203, 105, 'https://backend.sayyesadmin.com/files?fileName=image-1700885522753.png'),
(204, 105, 'https://backend.sayyesadmin.com/files?fileName=image-1700885544192.png'),
(206, 105, 'https://backend.sayyesadmin.com/files?fileName=image-1700885593364.png'),
(207, 105, 'https://backend.sayyesadmin.com/files?fileName=image-1700885620264.png'),
(208, 105, 'https://backend.sayyesadmin.com/files?fileName=image-1700885641985.png'),
(209, 106, 'https://backend.sayyesadmin.com/files?fileName=image-1701057758921.png'),
(210, 106, 'https://backend.sayyesadmin.com/files?fileName=image-1701057770083.png'),
(211, 106, 'https://backend.sayyesadmin.com/files?fileName=image-1701057784939.png'),
(212, 106, 'https://backend.sayyesadmin.com/files?fileName=image-1701057791787.png'),
(213, 107, 'https://backend.sayyesadmin.com/files?fileName=image-1701057978794.png'),
(214, 107, 'https://backend.sayyesadmin.com/files?fileName=image-1701057996082.png'),
(215, 107, 'https://backend.sayyesadmin.com/files?fileName=image-1701058009719.png'),
(216, 107, 'https://backend.sayyesadmin.com/files?fileName=image-1701058025190.png'),
(217, 109, 'https://backend.sayyesadmin.com/files?fileName=image-1701432447931.png'),
(218, 109, 'https://backend.sayyesadmin.com/files?fileName=image-1701432497939.png'),
(219, 109, 'https://backend.sayyesadmin.com/files?fileName=image-1701432576392.png'),
(220, 111, 'https://backend.sayyesadmin.com/files?fileName=image-1701660347113.png'),
(227, 111, 'https://backend.sayyesadmin.com/files?fileName=image-1701663277373.png'),
(228, 111, 'https://backend.sayyesadmin.com/files?fileName=image-1701663388167.png'),
(229, 112, 'https://backend.sayyesadmin.com/files?fileName=image-1701690833703.png'),
(230, 112, 'https://backend.sayyesadmin.com/files?fileName=image-1701690889416.png'),
(231, 60, 'https://backend.sayyesadmin.com/files?fileName=image-1701759880450.png'),
(232, 110, 'https://backend.sayyesadmin.com/files?fileName=image-1701771717776.png'),
(233, 110, 'https://backend.sayyesadmin.com/files?fileName=image-1701771726018.png'),
(234, 110, 'https://backend.sayyesadmin.com/files?fileName=image-1701771733575.png'),
(235, 114, 'https://backend.sayyesadmin.com/files?fileName=image-1701951555623.png'),
(236, 114, 'https://backend.sayyesadmin.com/files?fileName=image-1701951572210.png'),
(237, 114, 'https://backend.sayyesadmin.com/files?fileName=image-1701951581951.png'),
(238, 115, 'https://backend.sayyesadmin.com/files?fileName=image-1701951818854.png'),
(239, 115, 'https://backend.sayyesadmin.com/files?fileName=image-1701951825575.png'),
(240, 115, 'https://backend.sayyesadmin.com/files?fileName=image-1701951833809.png'),
(241, 116, 'https://backend.sayyesadmin.com/files?fileName=image-1701952323512.png'),
(242, 116, 'https://backend.sayyesadmin.com/files?fileName=image-1701952335111.png'),
(243, 116, 'https://backend.sayyesadmin.com/files?fileName=image-1701952345809.png'),
(244, 117, 'https://backend.sayyesadmin.com/files?fileName=image-1701952543980.png'),
(245, 117, 'https://backend.sayyesadmin.com/files?fileName=image-1701952553930.png'),
(246, 117, 'https://backend.sayyesadmin.com/files?fileName=image-1701952561355.png'),
(247, 118, 'https://backend.sayyesadmin.com/files?fileName=image-1702006988489.png'),
(248, 118, 'https://backend.sayyesadmin.com/files?fileName=image-1702006998363.png'),
(249, 118, 'https://backend.sayyesadmin.com/files?fileName=image-1702007036270.png'),
(250, 119, 'https://backend.sayyesadmin.com/files?fileName=image-1702032074935.png'),
(251, 119, 'https://backend.sayyesadmin.com/files?fileName=image-1702032086343.png'),
(252, 119, 'https://backend.sayyesadmin.com/files?fileName=image-1702032098273.png'),
(253, 120, 'https://backend.sayyesadmin.com/files?fileName=image-1702033150919.png'),
(254, 120, 'https://backend.sayyesadmin.com/files?fileName=image-1702033154001.png'),
(255, 120, 'https://backend.sayyesadmin.com/files?fileName=image-1702033160366.png'),
(256, 126, 'http://192.168.29.100:1111/files?fileName=image-1702269622047.png'),
(257, 126, 'http://192.168.29.100:1111/files?fileName=image-1702269647899.png'),
(258, 126, 'http://192.168.29.100:1111/files?fileName=image-1702269657821.png'),
(259, 127, 'http://192.168.29.100:1111/files?fileName=image-1702269807215.png'),
(260, 127, 'http://192.168.29.100:1111/files?fileName=image-1702269819582.png'),
(261, 127, 'http://192.168.29.100:1111/files?fileName=image-1702269827077.png'),
(262, 128, 'http://192.168.29.100:1111/files?fileName=image-1702270315074.png'),
(263, 128, 'http://192.168.29.100:1111/files?fileName=image-1702270325764.png'),
(264, 128, 'http://192.168.29.100:1111/files?fileName=image-1702270335079.png'),
(265, 129, 'http://192.168.29.100:1111/files?fileName=image-1702272369324.png'),
(266, 129, 'http://192.168.29.100:1111/files?fileName=image-1702272376370.png'),
(267, 129, 'http://192.168.29.100:1111/files?fileName=image-1702272390224.png'),
(268, 130, 'http://192.168.29.100:1111/files?fileName=image-1702274816062.png'),
(269, 130, 'http://192.168.29.100:1111/files?fileName=image-1702274825028.png'),
(270, 130, 'http://192.168.29.100:1111/files?fileName=image-1702274836770.png'),
(271, 131, 'http://192.168.29.100:1111/files?fileName=image-1702275666448.png'),
(272, 131, 'http://192.168.29.100:1111/files?fileName=image-1702275672945.png'),
(273, 131, 'http://192.168.29.100:1111/files?fileName=image-1702275683830.png'),
(275, 134, 'http://192.168.29.100:1111/files?fileName=image-1702277836313.png'),
(276, 134, 'http://192.168.29.100:1111/files?fileName=image-1702277867566.png'),
(277, 134, 'http://192.168.29.100:1111/files?fileName=image-1702277878493.png'),
(278, 135, 'http://192.168.29.100:1111/files?fileName=image-1702278154293.png'),
(279, 135, 'http://192.168.29.100:1111/files?fileName=image-1702278158938.png'),
(280, 135, 'http://192.168.29.100:1111/files?fileName=image-1702278168299.png'),
(281, 136, 'http://192.168.29.100:1111/files?fileName=image-1702278308918.png'),
(282, 136, 'http://192.168.29.100:1111/files?fileName=image-1702278312559.png'),
(283, 136, 'http://192.168.29.100:1111/files?fileName=image-1702278319338.png'),
(284, 137, 'http://192.168.29.100:1111/files?fileName=image-1702279149390.png'),
(285, 137, 'http://192.168.29.100:1111/files?fileName=image-1702279157281.png'),
(286, 137, 'http://192.168.29.100:1111/files?fileName=image-1702279164019.png'),
(287, 138, 'http://192.168.29.100:1111/files?fileName=image-1702279727658.png'),
(288, 138, 'http://192.168.29.100:1111/files?fileName=image-1702279736339.png'),
(289, 138, 'http://192.168.29.100:1111/files?fileName=image-1702279743840.png'),
(290, 139, 'http://192.168.29.100:1111/files?fileName=image-1702287297821.png'),
(291, 139, 'http://192.168.29.100:1111/files?fileName=image-1702287302145.png'),
(292, 139, 'http://192.168.29.100:1111/files?fileName=image-1702287307004.png'),
(293, 140, 'http://192.168.29.100:1111/files?fileName=image-1702291772445.png'),
(294, 140, 'http://192.168.29.100:1111/files?fileName=image-1702291779387.png'),
(295, 140, 'http://192.168.29.100:1111/files?fileName=image-1702291789793.png'),
(296, 141, 'http://192.168.29.100:1111/files?fileName=image-1702292754881.png'),
(297, 141, 'http://192.168.29.100:1111/files?fileName=image-1702292758045.png'),
(298, 141, 'http://192.168.29.100:1111/files?fileName=image-1702292761260.png'),
(299, 142, 'http://192.168.29.100:1111/files?fileName=image-1702292912254.png'),
(300, 142, 'http://192.168.29.100:1111/files?fileName=image-1702292915939.png'),
(301, 142, 'http://192.168.29.100:1111/files?fileName=image-1702292919745.png'),
(302, 143, 'http://192.168.29.100:1111/files?fileName=image-1702359801520.png'),
(303, 143, 'http://192.168.29.100:1111/files?fileName=image-1702359806745.png'),
(304, 143, 'http://192.168.29.100:1111/files?fileName=image-1702359825127.png'),
(305, 147, 'http://192.168.29.100:1111/files?fileName=image-1702440859022.png'),
(306, 147, 'http://192.168.29.100:1111/files?fileName=image-1702440881090.png'),
(307, 147, 'http://192.168.29.100:1111/files?fileName=image-1702440885537.png'),
(308, 148, 'http://192.168.29.100:1111/files?fileName=image-1702464692726.png'),
(309, 148, 'http://192.168.29.100:1111/files?fileName=image-1702464714328.png'),
(310, 148, 'http://192.168.29.100:1111/files?fileName=image-1702464726698.png'),
(311, 149, 'http://192.168.29.100:1111/files?fileName=image-1702465749488.png'),
(312, 149, 'http://192.168.29.100:1111/files?fileName=image-1702465757668.png'),
(313, 149, 'http://192.168.29.100:1111/files?fileName=image-1702465760081.png'),
(314, 150, 'http://192.168.29.100:1111/files?fileName=image-1702527437325.png'),
(315, 150, 'http://192.168.29.100:1111/files?fileName=image-1702527447631.png'),
(316, 150, 'http://192.168.29.100:1111/files?fileName=image-1702527460385.png'),
(317, 151, 'http://192.168.29.100:1111/files?fileName=image-1702527907186.png'),
(318, 151, 'http://192.168.29.100:1111/files?fileName=image-1702527911319.png'),
(319, 151, 'http://192.168.29.100:1111/files?fileName=image-1702527918583.png'),
(320, 152, 'http://192.168.29.100:1111/files?fileName=image-1702535122302.png'),
(321, 152, 'http://192.168.29.100:1111/files?fileName=image-1702535131001.png'),
(322, 152, 'http://192.168.29.100:1111/files?fileName=image-1702535139896.png'),
(323, 152, 'http://192.168.29.100:1111/files?fileName=image-1702535149147.png'),
(324, 152, 'http://192.168.29.100:1111/files?fileName=image-1702535163808.png'),
(325, 153, 'http://192.168.29.100:1111/files?fileName=image-1702535373728.png'),
(326, 153, 'http://192.168.29.100:1111/files?fileName=image-1702535380937.png'),
(327, 153, 'http://192.168.29.100:1111/files?fileName=image-1702535386558.png'),
(328, 153, 'http://192.168.29.100:1111/files?fileName=image-1702535395104.png'),
(329, 153, 'http://192.168.29.100:1111/files?fileName=image-1702535404047.png'),
(330, 153, 'http://192.168.29.100:1111/files?fileName=image-1702535413706.png'),
(331, 154, 'http://192.168.29.100:1111/files?fileName=image-1702549081102.png'),
(332, 154, 'http://192.168.29.100:1111/files?fileName=image-1702549164264.png'),
(333, 154, 'http://192.168.29.100:1111/files?fileName=image-1702549170822.png'),
(334, 154, 'http://192.168.29.100:1111/files?fileName=image-1702549178479.png'),
(335, 154, 'http://192.168.29.100:1111/files?fileName=image-1702549189234.png'),
(336, 155, 'http://192.168.29.100:1111/files?fileName=image-1702550410866.png'),
(337, 155, 'http://192.168.29.100:1111/files?fileName=image-1702550415042.png'),
(338, 155, 'http://192.168.29.100:1111/files?fileName=image-1702550421196.png'),
(339, 155, 'http://192.168.29.100:1111/files?fileName=image-1702550425662.png'),
(340, 155, 'http://192.168.29.100:1111/files?fileName=image-1702550432118.png'),
(341, 155, 'http://192.168.29.100:1111/files?fileName=image-1702550436095.png'),
(342, 156, 'http://192.168.29.100:1111/files?fileName=image-1702613750516.png'),
(343, 156, 'http://192.168.29.100:1111/files?fileName=image-1702613762957.png'),
(344, 156, 'http://192.168.29.100:1111/files?fileName=image-1702613774938.png'),
(345, 157, 'http://192.168.29.100:1111/files?fileName=image-1702629141565.png'),
(346, 157, 'http://192.168.29.100:1111/files?fileName=image-1702629146158.png'),
(347, 157, 'http://192.168.29.100:1111/files?fileName=image-1702629154516.png'),
(348, 158, 'http://192.168.29.100:1111/files?fileName=image-1702635717665.png'),
(349, 158, 'http://192.168.29.100:1111/files?fileName=image-1702635722051.png'),
(350, 158, 'http://192.168.29.100:1111/files?fileName=image-1702635727696.png'),
(351, 159, 'http://192.168.29.100:1111/files?fileName=image-1702637125418.png'),
(352, 159, 'http://192.168.29.100:1111/files?fileName=image-1702637129994.png'),
(353, 159, 'http://192.168.29.100:1111/files?fileName=image-1702637134062.png');

-- --------------------------------------------------------

--
-- Table structure for table `userreports`
--

CREATE TABLE `userreports` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `report_to` bigint(20) DEFAULT NULL,
  `delete_notification_status` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userreports`
--

INSERT INTO `userreports` (`id`, `user_id`, `createdAt`, `report_to`, `delete_notification_status`) VALUES
(1, 7, '2023-08-29', 62, 0),
(2, 99, '2023-11-24', 60, 0),
(3, 107, '2023-11-27', 106, 0),
(4, 109, '2023-12-02', 27, 0),
(5, 60, '2023-12-05', 77, 0),
(6, 110, '2023-12-05', 111, 0),
(7, 153, '2023-12-14', 152, 0);

-- --------------------------------------------------------

--
-- Table structure for table `userRequests`
--

CREATE TABLE `userRequests` (
  `id` bigint(20) NOT NULL,
  `date` date DEFAULT NULL,
  `sentBy` bigint(20) DEFAULT NULL,
  `sentTo` bigint(20) DEFAULT NULL,
  `activity_name` varchar(255) DEFAULT NULL,
  `activity_address` varchar(255) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `activity_image` text DEFAULT NULL,
  `sentToimage` text DEFAULT NULL,
  `sentToNAME` varchar(255) DEFAULT NULL,
  `sentBYNAME` varchar(255) DEFAULT NULL,
  `isAccepted` tinyint(4) DEFAULT NULL,
  `confirm` int(11) DEFAULT NULL,
  `clientResponse` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userRequests`
--

INSERT INTO `userRequests` (`id`, `date`, `sentBy`, `sentTo`, `activity_name`, `activity_address`, `createdAt`, `activity_image`, `sentToimage`, `sentToNAME`, `sentBYNAME`, `isAccepted`, `confirm`, `clientResponse`) VALUES
(1, '2023-03-01', 40, 39, 'Haitian restaurant', 'Surat - Dumas Rd, Behind Iscon Mall, Piplod, Surat', '2023-03-01', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AfLeUgNwyd_WAcX7JC-emoQMz2aNUwBUa_5ed1ujeQYqAmBcuw3Wg1VC7ZzQz90J4XHJsI7PIFLctiO5vSO1VtiA9vOwZR-4pSNab6bmzfL3w8R5FFz9OW88EExJWQ1sr0Yt403pOALd2nyqJVlVnSuLrfnTyfH9uDxcGMNCzfrIGciGl0Uz&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1676786453072.png', 'ONE', 'TWO', 1, 2, 1),
(2, '2023-03-01', 40, 43, 'Parks', '5R84+9V9, Jogger\'s Ln Ext, Panaas, Athwa, Surat', '2023-03-01', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AfLeUgNgHq7K9v76G5kJRVYOIuyXBs-vP1lRPCQTQzkdqUHlEn2wTnJQVRMdcvU067oN1VBzFyjEVLPAR0X3wVf7Xz4Ylr4DiG0XRfdRyU0C4hte1HD7W746mms7NZ42bIU7d8u8Hjtvvr55mSpWOTm4okBaGv1jwOjaELQvM9sZMz1rDm98&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1677148768425.png', 'THREE', 'TWO', NULL, NULL, NULL),
(4, '2023-03-03', 55, 39, 'Fast casual', '192 N Allen St, Albany', '2023-03-03', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1676786453072.png', 'ONE', 'rico', NULL, NULL, NULL),
(5, '2023-03-03', 55, 39, 'Fast casual', '192 N Allen St, Albany', '2023-03-03', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1676786453072.png', 'ONE', 'rico', NULL, NULL, NULL),
(6, '2023-03-11', 59, 60, 'Movie theater', 'Fortune The Shopping Island, Near Galaxy Circle Fortune The Shopping Island, Surat', '2023-03-04', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AfLeUgOy7Fq9MVDoMlaWGoJ_FlzNGewBD68snLGt2wSOCXc0DW5qX_IYTlmBw_o_vFOw1nerGzBFFVbrERSVo8JQ3veX-UfjtwC2xHpQaT5xkJn3ng0-6oBIv7FgMiSc4lZe5KmWwg7BJBT72dyon-u88PnWectwKxdoFTDl5vYMk3_t-sX5&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'Honey', 'JOHN', 1, 2, 1),
(7, '2023-03-09', 60, 7, 'say yes!', '7205 five point circle ', '2023-03-09', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=https://backend.sayyesadmin.com/files?fileName=image-1678339728030.png&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1678063525527.png', 'ti Fleche ', 'Honey', 1, 2, 1),
(8, '2023-03-10', 66, 60, 'Activity 1', 'Surat', '2023-03-10', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=https://backend.sayyesadmin.com/files?fileName=image-1678421548607.png&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1678425660711.png', 'Honey', 'AARAV', 1, 2, 1),
(9, '2023-03-10', 67, 60, 'Activity 1', 'Surat', '2023-03-10', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=https://backend.sayyesadmin.com/files?fileName=image-1678421548607.png&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1678425660711.png', 'Honey', 'SMIT', 1, NULL, 1),
(11, '2023-03-10', 66, 60, 'A2', 'Surat', '2023-03-10', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=https://backend.sayyesadmin.com/files?fileName=image-1678437440356.png&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1678429846506.png', 'Honey', 'AARAV', 1, NULL, 1),
(12, '2023-03-11', 67, 66, 'Beach ', 'Surat', '2023-03-11', 'https://backend.sayyesadmin.com/files?fileName=image-1678526629578.png', 'https://backend.sayyesadmin.com/files?fileName=image-1678429840128.png', 'AARAV', 'SMIT', 1, 2, 1),
(13, '2023-03-11', 60, 66, 'Beach ', 'Surat', '2023-03-11', 'https://backend.sayyesadmin.com/files?fileName=image-1678526629578.png', 'https://backend.sayyesadmin.com/files?fileName=image-1678429840128.png', 'AARAV', 'Honey', 1, 2, 1),
(15, '2023-03-11', 66, 67, 'A1', 'Surat', '2023-03-11', 'https://backend.sayyesadmin.com/files?fileName=image-1678532746362.png', 'https://backend.sayyesadmin.com/files?fileName=image-1678429829773.png', 'SMIT', 'AARAV', NULL, NULL, NULL),
(16, '2023-03-24', 62, 7, 'Movie theater', '64 N Main St, Norwalk', '2023-03-20', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AfLeUgOnC6XMctTWd13h8_RCJOYWLGriwSv0C2VPHw4nIcUfTk2yIEwFD8dQr9Kwj4QQY8lGDfSPQA_ywxOCshhu3KIFUnbZr2fvhLqSj5h1hHvDUCFLdZ9JHSvgEmpdhr0NDSt_z2ShRs5eehzkH-yYB2-AqhU-jmfnpdt7pf3sfNRAVReq&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1678571472688.png', 'ti fleche', 'MyJuicyPassion', NULL, NULL, NULL),
(17, '2023-03-20', 7, 62, 'Fine dining', '2223 N Westshore Blvd, Tampa', '2023-03-20', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AfLeUgPBLmi6aayiPxtulcvJTUwqN6QEesDWEOE4fcRjPNJtEkr2fU6-BPITqYHYfFgCMM3V0G0ll7_Ek9U6OcDMQkomNUuraLl5h_qt16oMthb-S0enzPt3CpFzC631TkQ4TPyQyoAnXdZjE680uxSra8XGYMkNMtxO3-K1dN77dbGcOqCl&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'myjuicypassion ', 'ti Fleche ', 1, 2, 1),
(19, '2023-03-23', 7, 69, 'Kayak', '1420 Alicia Ave, Tampa', '2023-03-22', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AUjq9jnljA1xnQYCOpUMABKDuNfWSXStN8uOUszducQNP_qTJurL70bT2g1kPk3Ihvx3xEtNVoElKOh8-vvZf7xwsfcDSTJyVpJyg9xgIeam3YOz1-0wfKRCwymUYrPC35oEtF60Yi8ePltndkjBbNmj5--mYzra0Mipf5brzXUPSQDDFMQK&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1679492021577.png', 'wood99', 'ti Fleche ', 1, 2, 1),
(20, '2023-03-22', 7, 69, 'Escape room', '2830 E Bearss Ave, Tampa', '2023-03-22', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AUjq9jl9xndFfeaCCwkvhQxJZf9nuIpUqilt8vyd9wjTJTMujhmb2dkC_1zZYQBjnHXo_Ok6zIUb4nX-IMwotj1NBOpr48CbwJDeNXha-cHXpMNIkpkG98AgIIX53TiViM5lY7gtUwNNCAP6Ay0oJphDJfwFXbKUs7Tnvg_jr7uMbQDGXNa5&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1679492021577.png', 'Wood99', 'ti Fleche ', 1, NULL, 1),
(21, '2023-03-25', 7, 73, 'Axe throwing', '13353 W Hillsborough Ave, Tampa', '2023-03-25', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AUjq9jlAzHv-rSXJYFAEiZlv8AgUoCqIHUsDU2xfrGtpeDf6QCulpZCbQuFBri4HA5IHVH4vhtJ-2TfDSZzcRkKZmqSVpcqJ8PV6x7A0fkaIhFsCLjtQkCEv652z-GMBgravZg48wh5FXxXJtwH6Ft7yxReMDsidKCDMlhMqGg0-5XS9B4ZK&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'David', 'ti Fleche ', 1, 2, 1),
(22, '2023-03-23', 73, 7, 'Game centers', '71 S Main St, New City', '2023-03-25', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AUjq9jm3DT95-WBhgMZtzRsTaC9RU9L02kwkNl2a7lL8-hS9UjPvLH3dGPOWqIXx19dOuRsUSsdNxnV7iBMiddmtHakBm4NInD2RTjHmnZAU0w8loHh9ix0S0QuDRluw_oPYHTapLseLTzWaQg3l-iC2LEzwFYcCgFWfO74a0PRrEhC6MK73&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1679491966146.png', 'ti flèche ', 'david ', NULL, NULL, NULL),
(24, '2023-04-06', 74, 7, 'Fine dining', '1 River St, Hastings-On-Hudson', '2023-04-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AUjq9jm_pzKTsofeRWwBJBp9Mnq_3ZWavWRiHwjZcZ3qSdq7FOONHPINoFjfGCT1DU7m7uOb5YEpZgfJ6goI64KBT25p9YB5qMS-4A-fNG_2yDBgteDyAZWgRsrWqz2UNeK6Zft7QncdUp33x0wXBLLEA3zKDngYly5JPrgCzW9SSRPX48Ea&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1680649714749.png', 'Ti fleche ', 'young_nrestless', NULL, NULL, NULL),
(26, '2023-04-13', 71, 27, 'Entertainment centers', '6283 W Waters Ave, Tampa', '2023-04-13', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AUjq9jm-a7P8AD4k5vK1c4eU1fD08BbquE1XVcTkq22n1iOOWf_EL8g_nEEg7M7q4GaIzXjKx-rMaSouSaA9T6ORX_eQ2LtTOvQb6Ka2Oms_yaO-jb0afK9_skjXY9SKG1CT0R8oqXLEfAc79pfPCj1I5jNCKih2CbTptWvrua-JzC8WhHBz&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1679379882071.png', 'Belle', 'vicenterancel', NULL, NULL, NULL),
(27, '2023-05-08', 77, 60, 'Entertainment centers', 'Rebounce, Next to Prime Shoppers, opp. Happy Residency, Surat', '2023-05-08', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AZose0lFfU63prihxC8hTzsye-y8VkORuarxSdDAG4N0-gsZiWXlhpGWexDKC9Di9R9QHl_PfIR3M_eRxaIW9g4H063-nkHUvYX4rRpS9okItYgIJwHy8tuzrN1q5BbGPWOjVpJoqb0slZnS9HX9AWrmnt87iYbv0vALUFHF8dnLfLDWSoQK&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1678684112746.png', 'Honey', 'dips johnson', 1, 2, 1),
(28, '2023-05-11', 77, 59, 'Entertainment centers', 'Rebounce, Next to Prime Shoppers, opp. Happy Residency, Surat', '2023-05-08', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AZose0lFfU63prihxC8hTzsye-y8VkORuarxSdDAG4N0-gsZiWXlhpGWexDKC9Di9R9QHl_PfIR3M_eRxaIW9g4H063-nkHUvYX4rRpS9okItYgIJwHy8tuzrN1q5BbGPWOjVpJoqb0slZnS9HX9AWrmnt87iYbv0vALUFHF8dnLfLDWSoQK&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'John ', 'dips johnson', NULL, NULL, NULL),
(29, '2023-09-22', 89, 89, 'Strip club', '51-07 27th St, Queens', '2023-09-22', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ATJ83zhd7uOJ00ZpYkzgSvgap25ERtS5V-YcH70FBDYIkfO7ERNPERJc_uTcbvk0O0YoclN488baUtAZwtSOsdbsukiqtIlKNOnNV-3gDItG6xsQZidO9YJPPFPlveq1SSket6NldvJho7PifK1XrguABjZrQsqEtthVuc5Dro15eU8yQta5&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1695395654731.png', 'camillegilbert_206', 'camillegilbert_206', NULL, NULL, NULL),
(43, '2023-11-24', 103, 52, 'Kayak', 'Jack London Square, 409 Water St, Oakland', '2023-11-24', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFiI-29r4vxCeU4r8yU2O_CDE3msCuaZ7DN-U4RqOSH_qBHsExSHyTo92FC408aUxuUmB_mPME2O-LIDFA_iMXrXgGDcbbgklc7nqfUiiLR-fDhxqmIPU5jaViT3-B_H9FTtrqRC_XmbGB5nX90EJxHE-tJMhb1I4J_ecN_kK1vTO2Aw&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'doriV', 'swift taylor', NULL, NULL, NULL),
(44, '2023-11-24', 103, 27, 'Scavenger hunts', '524 Union St, San Francisco', '2023-11-24', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFh980cBAtEu5FgpbwVrYB400TTP3LzvWyGb-FVSdGKxRWcFOoG27EAJZXZI_LnwaTHfd40IgyghK_luMMzbegav7fLTmpoD63R5tctS5msbNshNHmy19L7pZYX-RLMqeJ2mh8ZXfquzr3_SEg6zrUqbExwCHVM4k7T8jQOCPFuRhjVp&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1679379882071.png', 'Belle', 'swift taylor', NULL, NULL, NULL),
(52, '2023-11-24', 105, 99, 'Cafe', 'Barkari bhavan, Aai Mata Rd, near unity hospital, Surat', '2023-11-24', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFi7l_zN8Cy649Xh77w0l8JFHK3pAW_fotTgzzq7eKhTPhSFQdSwRIpsUyrbo4VMj2nL8FsjCF1HYKVjEH5iNViyGuRUzu_x1R2hD2M0egWrZwJgSC1ob9MhEZ2z2PHWwv0aSaqad1V6_ALbJoiIVByl2MLpVIBwT0SaIANndvpZgBeU&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1700826872371.png', 'mansi', 'palak', 1, 2, 1),
(54, '2023-11-24', 99, 105, 'Helicopter rides', 'F-1-2, Rajhans Plaza Opp. Pizza Hut, Nr. Kalamandir Jewellers,, Ghod Dod Rd, Surat', '2023-11-24', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFha60wcyJooLWo7vTfYgz1misXZ7olSfC4xO-gvOValeWMpQ2ZSL1rv18RpsYJb9OYcUgZq5zddjqL4R3Zc5Sy1RqmK5472CIyolz9vhslOQQKK0_sI7oe0nkFlVNhrR8YKPL7UskGAkisvo45SsZy1V0dy0fTc8AO8RToXVMm1T4rG&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1700827967778.png', 'palak', 'mansi', 1, 2, 1),
(55, '2023-11-25', 105, 99, 'Kayak', 'navi PARDI NH8, SURAT, Tharoli', '2023-11-25', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgPW9TtvPTKi7ZZoNnZ4mglQczFN8oU-BYc0EPsCz0xUsJZJy1iCxb_yiN8p_NwGJqMh0dHYLlMvNX4Qo3PHBQIV5D7NDFZ2UhohcORb6U_tL-UyRbESiFnK0f9faf5FMsIbpwGaGQkfl1Ef9s7MBrNCQSm-IZ501Is_sKrbXWFOKKI&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1700885673041.png', 'mansi', 'palak', 1, NULL, 1),
(56, '2023-11-27', 107, 106, 'Cafe', 'Shop nob19/20 ,Shajanad business hub Savaliya circle to cenal road, besides of varachha bank, Yogichowk, Vrundavan Society, Yoginagar Society, Surat', '2023-11-27', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjJLxb5L7Wz8clgx9BEazVlHn3kTFFamnWZQZJwmKa1juf7nM1NOo_PQFfgbEAFdfi5gjqV909yB0YRZC5IcV46mcQ9QFZdwJd8FpaH6_3xo8ECMKiD4dnZlmQcw4p2WV1jlZ3VERIN2FQf1f4XJqCppijxJmrrVefPeaUDQeRrADAA&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701058168137.png', 'Deep Savaliya', 'Piyush Vasoya', 1, 2, 1),
(57, '2023-11-27', 106, 107, 'Mini golf', 'Surat - Dumas Rd, Near Valentine Multiplex, Piplod, Surat', '2023-11-27', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhVy6qqFHoCaaCGHl5edx-XvAf61HBbgVkrujyrg680ROlmgDn20u7sDg_coT2iIwectkBy1HJz1fFvFExlUi7C6_y9otklCvuIo0R08QyL1vlqnyv0pctazepCCvQRL67Lu2RRS7oo-gJL7os1w0DCPbP6MImvAQ9wnnlEmyEH6gZF&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701058187973.png', 'Piyush Vasoya', 'Deep Savaliya', 1, 2, 1),
(58, '2023-11-27', 106, 107, 'Pop-up Restaurant', 'Royal Trade Centre, 515, Hazira - Adajan Rd, Jalaram Society, Adajan Gam, Adajan, Surat', '2023-11-27', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjDOt7Jy-3d3J-ciKSmCEGf9Dcu7h1ctYBTMCyeDjrQKfNyaHVzt8JHgb4iQ184MdFTElztv7qDjiykeBOT6_68tmNJ0yiFFX5IWkhOSpBS-rF7Q3hagc5vMnF8TNQa-w_Btt6ifBKMQ189DipTLy-AIZFkvctY7HUbKhYYl5DTj3Ev&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701058187973.png', 'Piyush Vasoya', 'Deep Savaliya', 1, NULL, 1),
(59, '2023-12-02', 109, 66, 'Beach ', 'Surat', '2023-12-02', 'https://backend.sayyesadmin.com/files?fileName=image-1678526629578.png', 'https://backend.sayyesadmin.com/files?fileName=image-1678429840128.png', 'AARAV', 'deep', NULL, NULL, NULL),
(60, '2023-12-02', 27, 66, 'Beach ', 'Surat', '2023-12-02', 'https://backend.sayyesadmin.com/files?fileName=image-1678526629578.png', 'https://backend.sayyesadmin.com/files?fileName=image-1678429840128.png', 'AARAV', 'Belle', NULL, NULL, NULL),
(61, '2023-12-02', 109, 66, 'Beach ', 'Surat', '2023-12-02', 'https://backend.sayyesadmin.com/files?fileName=image-1678526629578.png', 'https://backend.sayyesadmin.com/files?fileName=image-1678429840128.png', 'AARAV', 'deep', NULL, NULL, NULL),
(62, '2023-12-02', 109, 27, 'Canoe', 'navi PARDI NH8, SURAT, Tharoli', '2023-12-02', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjIdwwn5Y3FhBOSgo1n3ZH07fA0cPXXCCKMuE2R45_5gCIB_EoTTw1s1zLsPb_wfrgvvAN5Y7Pa3G9631GTSuyAGMvf4XmzAjmAQAoTQmUr0zkyHQYUlWT0GO7xbIk6LrIABmXwVJW7ox_0df4WHqsvOX2MRnOZuuCI0f0AGqHGnwpP&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1679379882071.png', 'Belle', 'deep', NULL, NULL, NULL),
(80, '2024-02-05', 111, 110, 'Escape room', 'Sri Sri Radha Damodar Temple Variya, Olpad Rd, Jahangir Pura, Surat', '2023-12-05', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgHzDKrd5W0eVwtw4r9-1mw2PMBGhzFtYQMQgPvRkU59U4CEYkruLRPJRuZsAc2tKZrjbL1rJBnciZIaQ3_Z8GtM21HEoaXIygbY-n_W2rfsTSigC96kqF9vNUv5C_zyeZsdO62k_DcUAQtovXOADxGMWGatON0jjveRYRiKaixIHzF&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771771624.png', 'Piyush', 'Rahul', 1, 2, 1),
(81, '2023-12-05', 110, 111, 'Comedy clubs', 'Ug-4, first floor, Sukum Platinum, above Gangour, Vesu, Surat', '2023-12-05', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFiRQqMyeOCgAxwUejC6RTToA0yVa9o-YBV43p28-IrFttFYBCEKNLwtzYxclwxVYemjWtpluCYJY1pq5AeTWsCMjs3has6VkNpWwz6m8U6aD4ez6bgXMrgrGCvC5wyjdLUmZlWjKaAG280j2myFhgvUt0u6zUuq1jJIjtBy3kC_k1lV&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 'Rahul', 'Piyush', 1, 2, 1),
(84, '2023-12-06', 110, 111, 'Cafe', '5Q3X+34M, New City Light, Althan, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhI8BtdpujfWMMvVlmEQDF8QnYo3OPxq8UmkvCKVVNkqzHqyRAG4NQqjxrPrpAYNe8k3UAdyjW6PmL2Oc1QMUjEQTYrKhNBSIv4YLr3sByOFNWxO-vZPRqavvp3iGsAMrhzyPFQtgF2kA-6etfYIDQK89NP5qTXey1WiD5BOeCn5Nsm&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 'Rahul', 'Piyush', 1, 2, 1),
(85, '2023-12-06', 110, 111, 'Italian restaurant', '1441 pizzeria surat F/1,2,3,4,5 Aagam vivianna, opp. Florence Residency, Vesu, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjFxBqzrtYDW0BKqMxVNFUE-MYKhJW6zAkjvTZ5zewUWhzkzY8ysSubnk58xlVK6tg5i61Z2QDfmx5ysa6biXYmInMibQ_X3iKMBMcNvbewgHFOKTHn1zBrKmSkbaQG1cvUQKSxtOPOZtMRvbiSi42BpedOXxY_HP692YzFJcu96ask&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 'Rahul', 'Piyush', 1, 2, 1),
(87, '2023-12-06', 110, 111, 'Escape room', '101 trinity orion nr aagam arcade, Vesu, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFh1OyuZnV0Bqd4p9YZJIJlOW65lMkITbrzb22Le4MY50ekQMWEuimnGeQKvnBv6GgvIp6-JZ3eofDi-hNbtRuTSCFkn7U_GDPVlnjmdbKVqmJgC4Hj0g2fLKUpKYdCtufWOXFK-zIBj0-A9wwhqGm5jGQWOLQaFDgUepW75www0iclI&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 'Rahul', 'Piyush', 1, 2, 1),
(88, '2023-12-06', 111, 110, 'Pools', '2/590, Kot Safil Rd, Surmawad, Rustampura, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgorWDOepFDUxuUx-lbV5ZXjROqGLh6W0D2iF3fu-NeZdaZH46vVpb2-qyewY1oemO7fzDOhTY9jx9SrgJ47D8tyVQg0PNOQEMFM7E4w82EIt3bEaqQ9asb5HPLq6pn_q7XxwXMQCfNlTz4JLMSPwS54eSF9q0Q_dqf_5_NtGxiNCyk&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771771624.png', 'Piyush', 'Rahul', 1, NULL, 1),
(89, '2024-01-06', 111, 110, 'Rooftop restaurants', '10th Floor, A, Vivanta Icon, Subhash Chandra Bose Marg, opp. Shell Petrol pump, Adajan Gam, Adajan, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFg7XgLqvN1IOlvsm3R5Vzdx6mcGtpqcrSxGMQLSHJFM07EboBOYjZqFaqKqUobYWvq0yHsixfh_TAcTqlDyXGLmE972aO_7fGZT7oK1TCRjMSKli9qqkfaGQuvTchCzJ9IhoAJa2dr7wV0LtbTa6-N7DPGvOZHlhi3qJAEwQIfXimfq&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771771624.png', 'Piyush', 'Rahul', 1, 2, 1),
(90, '2023-12-06', 110, 111, 'Cruise', 'Office no:-9, Tapi baug Shopping centre, Varachha Main Rd, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjVW0urWTq3CS5Tch0woqMBtzVNJOIg7Acos84SmOfTyQoyILbNkI-y0HXjcLRewoeQ_r9yvUwiy0A-9MSlABG4RlHdN1rxXo9osXwCMGZmZh-n48eM4LJKnjROek4IhdMRXLn554blp_A48Ryy7GXUbBLZFfMegY4NlF24ShtTqsOk&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 'Rahul', 'Piyush', 1, NULL, 1),
(91, '2023-12-06', 110, 111, 'Canoe', 'navi PARDI NH8, SURAT, Tharoli', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgxy-2yD3piuFjBcG0onk6QDqNUc31eTGVZxF1IA0jv3taMvD6r2wPg-842CdFC3RtyJqw1VNRxMaV9xOALMSYBqCOjazvV5zC5mFQ3_rbVMmLuYEI3Ob7Qqh3FVlHnqcHKyGGNy5qRW9piKyJrYxPsTAFd2TKGlBpXIc6MJ7frE_d6&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 'Rahul', 'Piyush', 1, 2, 1),
(92, '2024-02-06', 111, 110, 'Parks', '5RF3+JQ4, Old Ghod Dod Rd, Athwa, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhIYF35E43BqjvOpS46RbwI2h0ReTk6ZsySxPMlUfCQt5kP47PzsDnHJsTMyWkRKzKDLhaOFTMpNzmOy8I6dsd1ojS2NuFOduNNTRMQFmfdywcZK1l93sTd3ZfIICkhG2DBwj_7NYhwmO81ycznxerrFWpNfUHTf4tZ3S7hWCgNaHJt&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701855565378.png', 'Piyush', 'Rahul', 1, 2, 1),
(93, '2023-12-06', 111, 110, 'Strip club', '4, Nr. Shyam Mandir, Avadh Arena, Opp. Marvella Corridor, VIP Road, Vesu, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjOs1mVuvtVT32dPBWAZ2iM1nVgUsZgZf13hiDzqC1jjBtS6122UHJOfP80rzF-1XYEYBIo0S3D87aY7rKBojAignveS1i9maJajuc_Hb6wkY7BanHLEXsz2DbYNkh-gj1BvfRxrwDgWXR8tnplrwg__F0aa8IXMMhTUt08gYDhlPB5&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701855565378.png', 'Piyush', 'Rahul', 1, NULL, 1),
(94, '2023-12-06', 110, 56, 'Pop-up Restaurant', '2/A Napoleon Estate B/H VR Mall, Magdalla, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhFtgOq6EAj0uJjIFJPnA5lBL25ybPgV1yL3f2s7fR4cFsWjY_f-_7PaHtUR5n_tHqV1PLu80D1rgi5p72pd_BSF47JFIxyZjQ3qJnjHZ3U9AxzdAhZMANXh5tWTDmHFlwDtxLh5FfGaAUj16XY4hZX-fSHe9UxfDFt_M2RNQ2XvKI6&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'sunbun33', 'Piyush', NULL, NULL, NULL),
(95, '2023-12-06', 111, 106, 'Gymnastics centers', '4th Floor, Raj Dream Shopping, Nr. Punyabhoomi Society Nr. Bhagwan Mahavir College, VIP road-2 B/h Shyam Mandir, Vesu, Surat', '2023-12-06', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjwHXyRSGQ7FF07itTTn5vtsJjtc9ReGmJJ96EMQYLqfbPjLqVU-ySsf1ToydEbStIvU1pjfn44ffMyfSb15yvw6w80juMAL-zOztNZosv5aINpjdkC4mDFNz0lUVbJxcCMUEAPRH3SHR54Q6D0ubW8JU4ee3gCGo1G82BJ3RI-efc&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701058168137.png', 'Deep Savaliya', 'Rahul', NULL, NULL, NULL),
(97, '2023-12-07', 110, 98, 'Parks', '5RF3+JQ4, Old Ghod Dod Rd, Athwa, Surat', '2023-12-07', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjDDUlhKPhfErGkAex2M7NkPPiqCBwwpei6oszQ7JobHr4JpJp7SNwe4gz81AUUR9LCS1avmEQwZtony6Jpacpzjbo1JzErUOFeKL44lGS55_Y7R7EEI01dEprOOYDmg6zSpR6x0hQovaeiIIALwuwonjRwhgWJ0e4K8sA7Y2IStrvZ&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'mansi', 'Piyush', NULL, NULL, NULL),
(98, '2023-12-07', 111, 110, 'Parks', '5RF3+JQ4, Old Ghod Dod Rd, Athwa, Surat', '2023-12-07', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgYFyJuCCr3BcvUTPz3J9H-H8wf858wz9mT83jwKxaeonlecM69_uBGmmGMDauVEHeHROJ6IczdOCgnYWUf7kb-JQOn3Sk0Kjwz63iWFZ_bchabumOz21wBacEDs678z_yT0keAe0hORyXT1ybbwWGy5bb3LQ0KOo8Yv138ndb81cYi&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701855565378.png', 'Piyush', 'Rahul', NULL, NULL, NULL),
(99, '2023-12-07', 110, 111, 'Theme parks', '5Q6W+3PP, Athwa, Surat', '2023-12-07', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgAALTS5UC-_e6nqNXZiTQkPW7-AeTJ1gS4pchMhLl99ZbsDfRV2B88L1dWfhRIimHYvqJ3I9bwZNOInGwT8W35L55qV-J6joNTvYhgxcT0jzui5RUfCKIMwztAtzIiMhtuwgy46Y_Qv7TGgsJyyaaOBdWPbcwty7E-vMzAJAGU-W0w&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 'Rahul', 'Piyush', NULL, NULL, NULL),
(100, '2023-12-08', 117, 118, 'Canoe', '40 Pier, San Francisco', '2023-12-08', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFiAD-dqkZ8Z0GEVYZGfmfYQMoHQhXxZ4nlICLsPjzlbVUjX6n6nDGtSrKa8gGQHs8znHgXQyzH8k6LfcdRT82sWpMsUd8MobIz6QmTGdj0ScLxk0wfF6LwVkRR0lafd5djBFBP9kg4F1TsBIBCfOqQYLLs0vzfMkr0LIhXCHKlCpDjY&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'Ayushi', 'a', NULL, NULL, NULL),
(101, '2023-12-08', 110, 118, 'Escape room', 'E 107, 108, 109, 110 Aagam Vivianna Shopping Complex, Vesu, Surat', '2023-12-08', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgHMGURAlkZ0wvzYF5ssmlH0z6accFl0hceszK76J_pRVOkCVZfS8qe3ahJ5ubzJquEFXplNESkNUgu6Y7ITtgIgX_-_4SmzZK6yIHZ5XOlr98Ou1xzF-vUzzqYgY1NpNawNmqO3tZYaq2UV6m5fD_ctGDXwwVWkjWlOTw8MlfvnK9B&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'Ayushi', 'Piyush', NULL, NULL, NULL),
(102, '2023-12-09', 121, 9, 'Fast casual', '400 Geary St, San Francisco', '2023-12-09', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgujgmbJ6sHSgkxxGtoPj0W7OcZ9kKH9F01xMy_B_HovBmIoFHd3etrrqI7h9V0iFRvnPaFckpNi4W6bfK_xXH0DPRVqH5yOyCijwYJ-T88BwNtyO8TWeooU_HK0P62QwNvyyskYTqBawPQ3g3LWQ8K4XDBUUuG5fjIOITvvpL2vzEm&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'test', 'Macy’s', NULL, NULL, NULL),
(103, '2023-12-09', 121, 26, 'Fast casual', '400 Geary St, San Francisco', '2023-12-09', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgujgmbJ6sHSgkxxGtoPj0W7OcZ9kKH9F01xMy_B_HovBmIoFHd3etrrqI7h9V0iFRvnPaFckpNi4W6bfK_xXH0DPRVqH5yOyCijwYJ-T88BwNtyO8TWeooU_HK0P62QwNvyyskYTqBawPQ3g3LWQ8K4XDBUUuG5fjIOITvvpL2vzEm&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'test', 'Macy’s', NULL, NULL, NULL),
(104, '2023-12-09', 121, 122, 'Fast casual', '400 Geary St, San Francisco', '2023-12-09', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgujgmbJ6sHSgkxxGtoPj0W7OcZ9kKH9F01xMy_B_HovBmIoFHd3etrrqI7h9V0iFRvnPaFckpNi4W6bfK_xXH0DPRVqH5yOyCijwYJ-T88BwNtyO8TWeooU_HK0P62QwNvyyskYTqBawPQ3g3LWQ8K4XDBUUuG5fjIOITvvpL2vzEm&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', '', 'shah', 'Macy’s', NULL, NULL, NULL),
(105, '2023-12-09', 121, 119, 'Fast casual', '400 Geary St, San Francisco', '2023-12-09', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgujgmbJ6sHSgkxxGtoPj0W7OcZ9kKH9F01xMy_B_HovBmIoFHd3etrrqI7h9V0iFRvnPaFckpNi4W6bfK_xXH0DPRVqH5yOyCijwYJ-T88BwNtyO8TWeooU_HK0P62QwNvyyskYTqBawPQ3g3LWQ8K4XDBUUuG5fjIOITvvpL2vzEm&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1702034125604.png', 'Palak', 'Macy’s', NULL, NULL, NULL),
(106, '2023-12-11', 127, 128, 'Cruise', '200 Marina Blvd, Berkeley', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjq1iTHmBzNPxCmiZ4aRyTEuQw5pbkHvDA1-hRgbxkxu5sjT9K9x0y0w99spCYRSXnejNWQ4JsYBk-bZGu3cyjyZxpzQ7dbBN538n6k4NLb5C2CgRpD_jLsMZUFLx4gmLV1KnzE4GvjH03Ef1cX48biC2m3UUCcmScz_qAL93N08Bk3&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702270314909.png', 'janvi', 'jash07', NULL, NULL, NULL),
(107, '2023-12-11', 128, 119, 'Escape room', '101 trinity orion nr aagam arcade, Vesu, Surat', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjVcvJOs0P08fOT4tD2vK2_GmxUPois5tsXCVQoloYR3ooiPfBJibdXGfuY-cekjCSf56ozvk0fNDiijBB0dPeDrEVu3yeJlhmwT1S7khhOTgsFrD5C6hUdR2JYV6Bylg1Z4WuqGMDiNoqT3CZ_ZPYUQyRjTXiybEvC8hN7--oXWu8_&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'https://backend.sayyesadmin.com/files?fileName=image-1702034125604.png', 'Palak', 'janvi_05', NULL, NULL, NULL),
(108, '2023-12-11', 138, 137, 'Cruise', '200 Marina Blvd, Berkeley', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhknqIKP46wxHKTqzKBJKWx0BmuF0nV2FDizD0gVtoG8DCfkNKEjOGtM4HNqI3OxuJxJgQZYBafm7glMRki9WIz1_ZTZkuXRtgFis1cfn2KGPP-W87n7Kv7L_Cg7gAT1jKp4EAZ2a9bTy9AWrQgV_9H75B_5-zb7WF6Kku620XHOC9L&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702279583573.png', 'maya sharma', 'rajvi_01', NULL, NULL, NULL),
(109, '2023-12-11', 137, 138, 'Canoe', '40 Pier, San Francisco', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFiMmifBFGQgSgtUcgSh62J1dvHIGf7x2Mn1u2jDI8RnWKDuHw-gg4opPdvnhhRyEq8pTHo2lKH8NIs8gZVaz24BS7D4n_lUGdPyl2WAIt2gAkxi-LsaMzG2RqGKa05MVXiXf08kjlS8az5aL6aNE_lABROUSF7vU17jzpM-3hbyLGxV&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702279789707.png', 'rajvi birla', 'maya sharma', 1, 2, 1),
(110, '2023-12-11', 138, 139, 'Escape room', '364 11th St, San Francisco', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFj6WPbxI_cPZnStfLNCF5U9ApEZ_xHSqVaciGZnA_qmSCnyH0wDcnPzbZOqhSXapAyHf8yCSUWVRhma6wxO7yoa4xgESm3jFF-XaqtaqKq76CyAqcGFJbYGKfH3WC1oJNBJrBMoAxgo7Pb4ORwkbCVEcz3xUHN3eTu1di4HTVlJhotj&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702287341830.png', 'kaxa dhanani', 'rajvi birla', NULL, NULL, NULL),
(111, '2023-12-11', 139, 138, 'Japanese restaurant', '2100 Ward St, Berkeley', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFi1Ihg6ujWKxi33gO563802WAc0YkhhGv4RXmFwu91UXAL8xc-v7f3Vrhq2olM7d2Lrbm53k-NYoJf96hR7eDcRPQkNL9ApsV_QIihyJbUayxkgAmafAfmmKL8v2mG-lvuBOrPoSu9mq3XRq7c7nTGbwvrV6C3ckVrNu0rOXpfNTpQ5&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702279789707.png', 'rajvi birla', 'kaxa dhanani', NULL, NULL, NULL),
(112, '2023-12-11', 137, 138, 'Escape room', '150 Kearny St, San Francisco', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFitbk5yDXtClbR-r_ODF502XpJXDLdRcJFrKwDYhJGABWaE2TJa0DDJEc-_NuOlVJJMrckgkyRXdsaJRwUmZx1O63scUkcQC8UPCqu2fJbb5n0FW3zkqeuUZedHmWpRtttifWVCPPXxn365O-xlbgbix_HnHIUvzFJ9J4s9yX39pvqy&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702289827080.png', 'rajvi birla', 'maya sharma', NULL, NULL, NULL),
(113, '2023-12-11', 138, 137, 'Rooftop restaurants', '45 McAllister St, San Francisco', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFi1Z2K-0Uq6WLKLyVFEvURjW_xSRzMLzF3zRW2h4N9Nakb1BYzOav9-bRrs6wQue5i0WVQogMeUJg1p9zNaBkuCiklwNAtkYjfjgNRuMfLS1ZYKxXPnrDAzao9riXzJBdSRVVMA2ZDIiQfbrBODxsd0CBakkgLRG9HzJOrw1N4nsBdF&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702288487484.png', 'maya sharma', 'rajvi birla', NULL, NULL, NULL),
(114, '2024-01-11', 138, 137, 'Pop-up Restaurant', '123 2nd St, San Francisco', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFh8bA--7vzjpYGbTxs_u3Cn2obxTxPEeVVjB_L6Mvy2Oesxoru_r8U2ScXaDENgH_Na6z-_6xQf-g3pB8SFKEIqu1n3jjWxTtyd5yUAXR8_EzyVSczWfjGTag2NZMN4RHmkoGGzn7hCFckPWiByVAEDscn4rrRThao3rUVnQQv01cmZ&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702288487484.png', 'maya sharma', 'Rajvi birla', 1, 2, 1),
(115, '2023-12-11', 142, 141, 'Casual dining', 'Station Road, near Ayurvedic Hospital, Surat', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjRpZyKYVOpe4uoU3TND8wITGsszaG9AffCPDkNEBmyfPVDfMN2dftjvsTirOLYPkn7qnBOFzMRyUwt5s6FYN77BNVtUOOFdlk-XhWofolmv3njdqgP2TfgfyOhhxjtMLFCGuYWe3F19sa8ryyakSP88ZYkX32AVihIIf6MZZAw-Fg&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702292838734.png', 'Rahul Shah', 'Deep kmsoft', 1, 2, 1),
(116, '2024-01-11', 142, 141, 'Kayak', '7WMJ+HMJ, Surat', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFicG4JPphVICMkf9Rjwe3mHuMCg3_s2_Upm7SJgH8JwlG0zUvX6OC_sjW7eHxXIRMP9KcL8bckaRYabBkVncfsUtIC5EMhX5dCvWAnWopBlucqijzaYQMKBtFdT9Bkiz5t52d7wlusKeD5wmIA4EiH8gfYd-bgFnBQQkDbpx6gfsB8Q&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702295933115.png', 'Rahul Shah', 'Deep kmsoft', 1, 2, 1),
(117, '2023-12-11', 141, 142, 'Strip club', '4, Nr. Shyam Mandir, Avadh Arena, Opp. Marvella Corridor, VIP Road, Vesu, Surat', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFiD2Ht-mZLe-rXiilUgkGRes13sTGlpdVACPVGMudtE0-ojKZ_zE_foI9YrsRolxnn0Fb_PEDb4C6_78gr0d-dCdqn9bIdmQmXLRkK7f3FHuiHeH6VW-DNxthLzgwk43YaCEiLLLpkcCpwbE3E4udg8Fr57PhmPINcBT5ppkJDIOsKE&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702292912089.png', 'Deep kmsoft', 'Rahul Shah', 1, 2, 1),
(118, '2023-12-11', 142, 141, 'Canoe', 'Shop No. 3 & 4, Pyramid Square Near L.P Savani Circle, 120, Feet Road, Adajan, Surat', '2023-12-11', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgj1sxFS1iRMpWTMnjH5BtFb7U-dGb-WSAaiK5Itnc4DbA1UvHudrUVebZ8epgBQPfWPscvcw6zIqIEFAg9FFXHTt2LevBYM72rf9Y34-K35fVbbDVQnemgmg9XmA5ZmWp4PKk7QtregqoEa8nkEn4WnyZVbP9qshGEVfM3TtrD2eMA&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702295933115.png', 'Rahul Shah', 'Deep kmsoft', NULL, NULL, NULL),
(119, '2023-12-12', 133, 143, 'Acitivity Test', 'Surat Gujarat', '2023-12-12', 'http://192.168.29.100:1111/files?fileName=image-1702360545773.png', 'http://192.168.29.100:1111/files?fileName=image-1702359801349.png', 'smit Kmsoft', 'Rahul 2 kmsoft', NULL, NULL, NULL),
(120, '2023-12-12', 141, 143, 'Acitivity Test', 'Surat Gujarat', '2023-12-12', 'http://192.168.29.100:1111/files?fileName=image-1702360545773.png', 'http://192.168.29.100:1111/files?fileName=image-1702359801349.png', 'smit Kmsoft', 'Rahul Shah', NULL, NULL, NULL),
(121, '2023-12-13', 147, 149, 'Canoe', 'JQF9+HH7, Pune Water sports , Thergoan , Primpri-Chinchwad, behind Aditya Birla Hospital Marg, Pune', '2023-12-13', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFj8NWpJRCrncrM4Nrs8a58yJ_qxOdvz8Snn3D39Ol6X_uE37KXF5x9S36XPAuWlre-kzJRIS43ZjqBKmPptPKHZjxeOOTWVybFwSNDMwHeg7YerBxouPP59D3FH-iVKXV1ebSBeQdgorAh9rNvEESnsx-yTwjBDoonM8KsIp2rud9pe&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702467152059.png', 'test', '1', NULL, NULL, NULL),
(122, '2023-12-13', 147, 149, 'Comedy clubs', 'Above Art Beats Cafe, Jyoti Heritage Apartment Behind Sai Sagar Restaurant, Vitthal Rao Shivarkar Rd, opposite Handicap School, Wanowrie, Pune', '2023-12-13', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjUYlUBrLi6EplnupfF3HK8_CDa1jHZoPae55-ua6a8LpXFWNPPmbvyvcQabFhm9B6CTze4LmqlmyzMz5UNzgrYlMl6yBm0wojoymjQXwF-Y0-7BW2UIm_fJvwy0LPGBVEO6JYYmVgnrJwzkK4XpplnITNywQtxxWmvwop-CEi_pAQA&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702467152059.png', 'test', '1', NULL, NULL, NULL),
(128, '2023-12-13', 149, 147, 'Escape room', '17, Old Sabzi Mandi Rd, Radha Bazar, Chowk, Hisar', '2023-12-13', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702467645979.png', '1', 'test', NULL, NULL, NULL),
(129, '2023-12-13', 149, 147, 'Kayak', 'JQF9+HH7, Pune Water sports , Thergoan , Primpri-Chinchwad, behind Aditya Birla Hospital Marg, Pune', '2023-12-13', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjFNaRNQfcguowv3OGu8SHglhrvKsuaTl0pByaCwM7fR7OwtHmtbGFstG53vA9Z0IgLqw_b2EyR5eV2yfodhXpH3A_D0y5cXriCtdcazeRZHEd9jxcMPLPNIfJQT0GdM3TBvOpEtX4b9AgTWnSV947gLiTlV6UvIn3dEesaj2TyDvg2&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702467645979.png', '1', 'test', NULL, NULL, NULL),
(130, '2023-12-14', 147, 149, 'Kayak', 'HRJ8+MXP, Vidya Nagar, Pimple Gurav, Pimpri-Chinchwad', '2023-12-13', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFi2_Q_SAsxVuTs2E8lWJtvpeBLv7VIo3HZ3XfAkAwZ3XQHu1-YEuUmkKveRIIbSwcBtaSVyg-fG450fBRdKHD3QkZ3vUjW-cP0JLuV-POY7ZS8ik9IOyf8T5XjpkymSOAWGH5sZNaSZ_Li_t9mxXR_z-Rc8PkK5G6eoj8fBWqRb57db&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702467152059.png', 'test', '1', 1, 2, 1),
(131, '2023-12-14', 151, 150, 'Comedy clubs', '328 15th Ave E, Seattle', '2023-12-14', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFip1Ax6nGdUiGY9BrVFzoDDEb3V1rVSSOPP2BzQ4vDYBaRKs2k-JwsVt_JUuoE0Z3mcgOaM1vYyyBIuzgBV5F492tG--AFw4uYeKNzOC3fmVcjfnJBz2F8zciNXfKMOECb64j1m6uJML1er8q9ZhDIR_Htkbh6uClKMdXMFeRp4zjaA&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702527590070.png', 'deep savaliya', 'piyush vasoya', 1, 2, 1),
(132, '2023-12-14', 150, 151, 'Casual dining', 'Ring Rd, near Sakar Textile House, Sahara Darwaja, Moti Begumwadi, Begampura, Surat', '2023-12-14', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjLo0eXDXMY0LIBdjLvM29MJYAMBWnhvwS7_Zo9xqgGZt0F0IFBeVLr2bhgJiNCYgzg7Yy3uzIZtZqSSDRpzBizhz9caHSLSpGfHj6zrWn-On_O8uaQ38ik_ttotLROANhsS3_iTGyLAqD_8L9td0Dj-1-gFJeCxAVdVqs3VW8beD3a&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702527906919.png', 'piyush vasoya', 'deep savaliya', 1, 2, 1),
(133, '2023-12-14', 152, 153, 'Movie theater', 'P45F+JQ6, GJ SH 12, Ambica Nagar Society, Umreth', '2023-12-14', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFg7bB8O47Y0uLxTDt5bFEXohClaDwK7QLupXP14K_NODir7sKXCy1gBI9x9Q0IqJLBuFbhENGR4e6QzqMvqVKRnF2HK4Mtm6SJIzjy-pjE-NggqkPvtyod-GsqtSUVlkjZ7QrWx1KD9stuYZJ13ThCvZPJV2B3UrxVG8XXbZiV0CdCm&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702535373553.png', 'birbal', 'akbar ', 1, 2, 1),
(134, '2023-12-14', 153, 152, 'Horse tracks', 'Mumbai', '2023-12-14', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFinyt9V3UPThitJijGv3n0GgkswLSgJ4S1WxXD1JjPX60v-QO5JE-OCisiZ1yfj4GZf0TsBlRU8y890NDG-JCbO45Tx37vPsborMlCmWZ-QDmH0mPzXJX-b6zVoMJm7l01XZGnECBOYdMiApjeNdj7vJjAIfrn6HYLZKEheXdpQUvvA&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702535121999.png', 'akbar ', 'birbal', 1, 2, 1),
(135, '2023-12-14', 151, 152, 'Kayak', 'Near Holy Sprit Hospital, Madhukunj Society, Sher E Punjab Colony, Andheri East, Mumbai', '2023-12-14', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFh3B_nd9e2OnG1EHAUmPT0JwJx9NgOQgJgVels2KiAzhR-2c0FAsIwMvPP9fDUfpgZybCuDMcLkwLtJS8xq6-KqyxCJovFMnW0H9RKb57elvWy3EhC7iZ19Vj-3fTj7irx6-cbTDyoqd5ZePR_bTTxef-6hdwWcxy0jydj8rWrfPSkN&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702535121999.png', 'akbar ', 'piyush vasoya', 1, 2, 1),
(136, '2023-12-14', 153, 151, 'Canoe', 'J6C8+3Q, Lachhanpura', '2023-12-14', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgATgnU2QLK5tSy8Zc1sYY3eNyFhbXsYQwoGZtE1axZVsd36IbjpSgWRyhS8bRaEKeGwFllyxKX2bP6jHLki7I5qu2G8V-7PAMMJ3Q8Tv1MORrE2dCkEG9EGy1SiOF50FGWZGFP1GRIuAkWxb8kcd9_UweFHR-fdKFThsQeEaAWE4eg&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702532166677.png', 'piyush vasoya', 'birbal', 1, 2, 1),
(137, '2023-12-14', 155, 154, 'Parks', 'GRJQ+5MQ, 1102/A/48, Lakaki Rd, Rage Path, Rege Path, Model Colony, Shivajinagar, Pune', '2023-12-14', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFiNasA7haDYQxkKTG1DNOZuEKt1xBn5RZlajUh9bXsJuCn6xNSQEJQfZhKy4uS4kH3ZB-RGAlytxCL0aNo5DrQ3FH6zJJ39RuFY3ikd9gCVxABnGj6SHjQxQSvy70nHF_ry0rv6tqOogo9kU44IH69cSJtS9iYVnZfbZQoL-ZI2bCXb&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702549282412.png', 'shruti', 'dipen', 1, 2, 1),
(138, '2023-12-14', 154, 155, 'Korean drama', 'Pune, India', '2023-12-14', 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png', 'http://192.168.29.100:1111/files?fileName=image-1702550670475.png', 'dipen', 'shruti', NULL, NULL, NULL),
(139, '2023-12-14', 154, 155, 'Korean drama', 'Pune, India', '2023-12-14', 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png', 'http://192.168.29.100:1111/files?fileName=image-1702550670475.png', 'dipen', 'shruti', NULL, NULL, NULL),
(140, '2023-12-14', 45, 155, 'Korean drama', 'Pune, India', '2023-12-14', 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png', 'http://192.168.29.100:1111/files?fileName=image-1702550670475.png', 'dipen', 'lucidwillfit', NULL, NULL, NULL),
(141, '2023-12-14', 154, 155, 'Korean drama', 'Pune, India', '2023-12-14', 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png', 'http://192.168.29.100:1111/files?fileName=image-1702550670475.png', 'dipen', 'shruti', NULL, NULL, NULL),
(142, '2023-12-14', 154, 155, 'Korean drama', 'Pune, India', '2023-12-14', 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png', 'http://192.168.29.100:1111/files?fileName=image-1702550670475.png', 'dipen', 'shruti', NULL, NULL, NULL),
(143, '2023-12-14', 151, 155, 'Korean drama', 'Pune, India', '2023-12-14', 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png', 'http://192.168.29.100:1111/files?fileName=image-1702550670475.png', 'dipen', 'piyush vasoya', NULL, NULL, NULL),
(144, '2023-12-14', 154, 155, 'Korean drama', 'Pune, India', '2023-12-14', 'http://192.168.29.100:1111/files?fileName=image-1702552655207.png', 'http://192.168.29.100:1111/files?fileName=image-1702550670475.png', 'dipen', 'shruti', NULL, NULL, NULL),
(145, '2023-01-15', 156, 150, 'Kayak', '6VPV+8X3, Tapi, River Park Society, Singanpor, Surat', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgaItM4d5c6wfXmk_teujE1hga810XsWJhNcJiPpdM-i7sbVeNJI09s7d0tSFByBJKJKbPFJzCGLfhOOOGcLUtcdQPJbpCBsAnZxZLUot2Sd70Hz7sWAn8CP1EVf0aEOydWMoIMwHztcXZCC2efWnfh8T83h52kpEbRmJqIsRRE0Nyf&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702541933902.png', 'deep savaliya', 'Rahul', 1, 2, 1),
(148, '2023-12-15', 150, 154, 'hourse', 'Surat, India', '2023-12-15', 'http://192.168.29.100:1111/files?fileName=image-1702611975612.png', 'http://192.168.29.100:1111/files?fileName=image-1702549282412.png', 'shruti', 'deep savaliya', NULL, NULL, NULL),
(151, '2023-12-15', 155, 156, 'Kayak', 'JQF9+HH7, Pune Water sports , Thergoan , Primpri-Chinchwad, behind Aditya Birla Hospital Marg, Pune', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgrNKGS3YFZAMz7tH0bIyNneY0tAKS-nHi8H2XJD-0tgRZI_dsABuigDhc_U5-bJFN5Ld0X0UZs7PVpp4X2DZ77T7n2HghmwPU4RhAfDKzQLRRoe3WXbqarNY8oO2EWRQLOY7yrn1cmBPWzm4_Tmm3w4va9SYYtS_mgI_n72qpUGObX&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702615452968.png', 'Rahul', 'dipen', 1, 2, 1),
(152, '2023-12-15', 154, 156, 'Comedy clubs', 'A 103 laxminarayan apartments, Ghod Dod Rd, Surat', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702615452968.png', 'Rahul', 'shruti', 1, 2, 1),
(153, '2023-12-15', 155, 156, 'Dance class', '4 Vasantika Apartments, ahead of Puma Showroom. Opposite Yena bungalow Next to Ideal Colony Metro Station, Paud Rd, Kothrud, Pune', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFg8JBQyZFvR_0x5VY9GZ-yj9abhLa_rVrgrKxZIeNpz6gsmt5qyVUx5iLghSNORAQmWYkgRcS91EnaVyrg_S0iQa4a_IxK6sfMaqdJeirh7xE-DZqKE0VPjpNhJlXPychohXCUVSdRmV1rNfzuDxUijnWDNTFmtKsYNsMSWxfbXPjaH&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702615452968.png', 'Rahul', 'dipen', 1, 2, 1),
(154, '2023-12-15', 155, 156, 'Movie theater', 'Plot No.D, Bund Garden Rd, Agarkar Nagar, Pune', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFilTwey2SkgwgLLK6fIHqtVnPN0WvbPXd1z-RQPj--kjuFXr6i0yEgoV73s30K62qqioDNiP6qwSj-kLSVnNhbt1WMSE5MoHPv0RIYUm6_yLxBh8qSGMTA4ZdtjNRJYlw78qe1swZ7jFcy1qTUCzyTyHaUkKGaiQ4YzPbHdaa9UlV8_&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702615452968.png', 'Rahul', 'dipen', 1, NULL, 1),
(155, '2023-12-15', 154, 156, 'Theme parks', 'Suman Nursery, Botanical Garden, Ugat Bhesn Road, Jahangirabad, Morabhagal, Surat', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFim8nTKXtfLIvyyq0PlVHzAKFzqQ1K6f59zMdGssbhffikhi25bdlz2JmFWEMKW3_ffJuzvcUo5L9tf_xcDphi_RQ67JrKL8bmU8UmuiPIq0LjNGVNY5mm1Tcg5d7xFOwnDr3cW9Exe1es3UA0b2bGAWMmNukuKpn6o8NclQEVcbHr7&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702615452968.png', 'Rahul', 'Shruti', 1, NULL, 1),
(156, '2023-12-15', 157, 156, 'Pool halls', 'Somnath, Somnath By-PassRoad, Prabhash Patan, Veraval', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjcqYW4BiOByqKReDE4WJg3_2wL4Hf5furwzenWMzIdPlUJrPMaGMCSTfxrK3PJDM0EIWVFnKUWD8EZuHut6z-Ydic-MLrb9XiF4z9KkWIH-ui1jGxoVi87nC6-ogBYzCWkUrtWJOqwKjOqpN_9Ggn6OyG2hZglKifO3Py-nu86f4t4&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702615452968.png', 'Rahul', 'minaty', 1, 2, 1),
(157, '2023-12-15', 157, 156, 'Pool halls', 'Somnath, Somnath By-PassRoad, Prabhash Patan, Veraval', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjcqYW4BiOByqKReDE4WJg3_2wL4Hf5furwzenWMzIdPlUJrPMaGMCSTfxrK3PJDM0EIWVFnKUWD8EZuHut6z-Ydic-MLrb9XiF4z9KkWIH-ui1jGxoVi87nC6-ogBYzCWkUrtWJOqwKjOqpN_9Ggn6OyG2hZglKifO3Py-nu86f4t4&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702615452968.png', 'Rahul', 'minaty', 1, NULL, 1),
(158, '2023-12-15', 156, 157, 'Kayak', 'JQF9+HH7, Pune Water sports , Thergoan , Primpri-Chinchwad, behind Aditya Birla Hospital Marg, Pune', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjcwppbXtx-4WVHnYbIb6edYwC2ybHXjk-f8vEpm4uPfmK9c3tkg3bIeXOaJ8oVqsYldUm6AGgS58eJXOYaUbnAS9L8nleoja5tjEBBjxfL_mfIuzxDbHMR0b9W6HXLkjQWnwCu8WF7TYCAupGl2dS2sw6DCCezqsmNqU1cQfGvSe-v&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702629141113.png', 'minaty', 'Rahul', 1, NULL, 1),
(159, '2023-12-15', 156, 158, 'Pool halls', 'The Fortress Turf, Sopan Nagar Rd, Sopan Nagar, Someshwar Nagar, Wadgaon Sheri, Pune', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFh9IXUHrhvYEbQam52U70sUya4_HOIwOo1b-pY912jV8CdXbclGCU-gf4rTp3SCcbkJ3Ewm_xLesslnhVlnGlSMtpK0XLdEd_Dvue75RLWlN0vy_A95qufwblmADHuPONw3OVGA9QA2OQz2IQpD9FJeHGzOPZ0pNtu5Hktoo3nFeVzw&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702635763380.png', 'kavya sharma', 'Rahul', 1, 2, 1),
(160, '2023-12-15', 158, 156, 'Canoe', 'Shop No. 3 & 4, Pyramid Square Near L.P Savani Circle, 120, Feet Road, Adajan, Surat', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFh99j67TznvhJkv7YyhqOE1Ij-ZYwtbGKjhoSs4TwWCL7ITAdgbcge8CR4_JaBC0covpwQI3PwOYU4_nHzTlfkjsWNTkUvRTaJ18WgwAsN46jm5L_avCWVfsQrKJoU_Sq3qw7ZN9cNkYXMzGGAkojSaVQWRBTGbiaviD3KzL6c6Oa7i&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702631419162.png', 'Rahul', 'kavya sharma', 1, 2, 1),
(161, '2023-12-15', 159, 150, 'a7', 'Surat, India', '2023-12-15', 'http://192.168.29.100:1111/files?fileName=image-1702531550277.png', 'http://192.168.29.100:1111/files?fileName=image-1702541933902.png', 'deep savaliya', 'Simit', NULL, NULL, NULL),
(162, '2023-12-15', 158, 156, 'Dance class', 'General Post Office Rd, behind Laxmi Bakery, Rayon Housing Society, Veraval', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjO7elSdIZwccr4C-RZATSe030mohcubpoXj7jYtUaj0AMNKE898oUUdRRJO0drs1DuIiDOn7Sj-NAdZGMFINuV8nrGCWKubdE1mWnhgG3G3bz7ckU1JnFARPGksse02zLQLa3laqL2nEMPt66KzfzEHbgX0iVhD4HPtu6757dUOfph&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702631419162.png', 'Rahul', 'kavya sharma', 1, NULL, 1),
(163, '2023-12-15', 156, 159, 'A 1', 'Surat, India', '2023-12-15', 'http://192.168.29.100:1111/files?fileName=image-1702637618601.png', 'http://192.168.29.100:1111/files?fileName=image-1702637525880.png', 'Simit', 'Rahul', 1, 2, 1),
(164, '2023-12-15', 158, 156, 'Pools', 'W9C7+C2M, 60 Feet Rd, Vidyutnagar Rd, Vidhyut Nagar, Veraval', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFijOXnpLHCqcIL6oYpePiVxw2lfmomB9naWURO29jaXkS8SQGoaUq2WMovAXTyz74BKTuINbAts61Z5UOXgE2wAQDwN5-OaiZNVtkpCLJ1igd8cAjLoP8RAdyYDLCN8vrZ92Vl6KzjOtQXryt92b34llq7QF8nJHNbKXdjwK5bc7p7J&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702637524966.png', 'Rahul', 'kavya sharma', 1, NULL, 1),
(165, '2023-12-15', 156, 158, 'Dance class', 'General Post Office Rd, behind Laxmi Bakery, Rayon Housing Society, Veraval', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFgg8GUyJ26HNzZGpWS0lPK9Yap3lbgeTN-ci7hCqB2-0T0R2eq3s9ZBbaP6dEyIMKeCBCS57tVaHD-MMtI7j8A49SC1t7fPM0bORcQsjoSCai8pkzJGF7q0OsVl-hylIPUyJCjS7VZEiQjc_m0pVcEqn7Y95XB517C2N1D4S6SPxNDT&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702635763380.png', 'kavya sharma', 'Rahul', 1, NULL, 1);
INSERT INTO `userRequests` (`id`, `date`, `sentBy`, `sentTo`, `activity_name`, `activity_address`, `createdAt`, `activity_image`, `sentToimage`, `sentToNAME`, `sentBYNAME`, `isAccepted`, `confirm`, `clientResponse`) VALUES
(166, '2023-12-15', 156, 158, 'Dance class', 'General Post Office Rd, behind Laxmi Bakery, Rayon Housing Society, Veraval', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhVM0I0CWub746GPKBsCEnCA1GIuRnWKXJ7THpV9V8iV8rrkPOeUWa4rjEmuKljxpKfP_xZ2uvJ_Ke8gyuTVoZA0qwZtZoJHR7QIulZm9EKnubE-JS_xleOXsZrVnthahs0DFIwosgy9DRtThT8NpmIT1mYpkaAGnVE7bbqnRHHsxG8&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702640136156.png', 'kavya sharma', 'Rahul', 1, NULL, 1),
(167, '2023-12-15', 158, 156, 'Casino', 'Somnath, Veraval Bypass Rd, Bhalpara Part', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhpQSwhfnpZ8zbOK4ofSg7FV8w4MsmrMDvUOVIrgbvnvyn5BMgsQSGms5TeU9GhBqUXw917pzUyG3A6mCQMVcsjEgha01JM-2uQ8tLu5vwniZ8Vhh7_A07fNCIQnvuKSKsprznDYt1NhFrQmfSEVWBsz8bOgTYMxyMbV4ZnGAENF0FO&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702639334745.png', 'Rahul', 'kavya sharma', 1, NULL, 1),
(168, '2023-12-15', 158, 156, 'Casino', 'Somnath, Veraval Bypass Rd, Bhalpara Part', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhpQSwhfnpZ8zbOK4ofSg7FV8w4MsmrMDvUOVIrgbvnvyn5BMgsQSGms5TeU9GhBqUXw917pzUyG3A6mCQMVcsjEgha01JM-2uQ8tLu5vwniZ8Vhh7_A07fNCIQnvuKSKsprznDYt1NhFrQmfSEVWBsz8bOgTYMxyMbV4ZnGAENF0FO&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702639334745.png', 'Rahul', 'kavya sharma', 1, NULL, 1),
(169, '2023-12-15', 158, 156, 'Casino', 'Somnath, Veraval Bypass Rd, Bhalpara Part', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFhpQSwhfnpZ8zbOK4ofSg7FV8w4MsmrMDvUOVIrgbvnvyn5BMgsQSGms5TeU9GhBqUXw917pzUyG3A6mCQMVcsjEgha01JM-2uQ8tLu5vwniZ8Vhh7_A07fNCIQnvuKSKsprznDYt1NhFrQmfSEVWBsz8bOgTYMxyMbV4ZnGAENF0FO&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702639334745.png', 'Rahul', 'kavya sharma', 1, NULL, 1),
(170, '2023-12-15', 156, 155, 'Kayak', 'JQF9+HH7, Pune Water sports , Thergoan , Primpri-Chinchwad, behind Aditya Birla Hospital Marg, Pune', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFjKOMIoBZRSABrE9GZPIUk5DRmTogOscbTuBspPjAUxrYR3ZO83LFoVbhbhanWTG7QhYIdDiWQ6PNGkuqW1VE7ii-g62TtDlVvgi-Es4y8OM-esw4SSuFR_u_eKfo2i3BtcKsUxxxRi3ybSvDwHY1fZ8hlRE3CF0kDVrhcSmIdH0H2E&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702620188285.png', 'dipen', 'Rahul', NULL, NULL, NULL),
(171, '2023-12-15', 155, 156, 'Casual dining', '5th floor , sahil enclave, next to cluster, Parle Point, Surat', '2023-12-15', 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AWU5eFiATCQC2RLOBm4Y1ZKaNQOlOUVb5YPXqmZuYWhW-qghi1QrzHUNXSKnV6n91ZGtAcLFBDI8WY8_yAFuhOyC5Ka3vwer86gRhn14LG5kPwCceYqCH9U_jxU1J-HNX2vNhSzLUFlhZzaMO6ErhyI1G2ZHDSOL5sS1mBLV62XdqML7Ov17&key=AIzaSyCrb70YFIGy-WdBNCQbRKc-2AYBy1jSvlI', 'http://192.168.29.100:1111/files?fileName=image-1702639334745.png', 'Rahul', 'dipen', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `genderId` bigint(20) DEFAULT 1,
  `intrestedIn` int(11) DEFAULT 1,
  `google_social_id` varchar(255) DEFAULT NULL,
  `facebook_social_id` int(11) DEFAULT NULL,
  `apple_social_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `availableForPick` tinyint(4) DEFAULT 0,
  `aboutMe` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT '0',
  `phoneNumberConfirmed` varchar(255) DEFAULT '0',
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT 'US',
  `favActivities` varchar(255) DEFAULT NULL,
  `zipCode` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `delete_notification_status` int(11) DEFAULT 0,
  `device_token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `email`, `username`, `birthday`, `name`, `profileImage`, `genderId`, `intrestedIn`, `google_social_id`, `facebook_social_id`, `apple_social_id`, `createdAt`, `availableForPick`, `aboutMe`, `password`, `phoneNumberConfirmed`, `city`, `country`, `favActivities`, `zipCode`, `status`, `delete_notification_status`, `device_token`) VALUES
(4, 'admin@sayyesadmin.com', '2032032000', '12/01/2022', '', '', 1, 1, NULL, NULL, NULL, '2022-12-01 19:02:15', 1, '0', '$2a$10$NUloPphMmsQoCrbfArxSYOQgt3AkuwlxoI9ZPBeBN3Ui.I.eTz16y', '0', NULL, 'USA', NULL, NULL, 0, 0, NULL),
(5, 'admin@sayyesadmin.com', '2032032001', '12/01/2022', '', '', 1, 1, NULL, NULL, NULL, '2022-12-01 19:06:03', 1, '0', '$2a$10$y2PAPfb1T49T3G9rZWyApehZI41oMp/mTjDFxQy08sQ7Z2WVgYaRu', '0', NULL, 'USA', NULL, NULL, 0, 0, 'e_O7mIm2SkgfhD8CwvCkwu:APA91bFCGhsmB7dtsG2c2h-FubSX3apGn7ww1W6Z9DYxuQxOqGPhJs6zY8z9T2XRFnmKRqBszCLqdYWvy7yHy690lybctbV665iUtW1Es_aAhsRXLtHdCvl4yvqcIVRAiW2DBOW2Mpl2'),
(6, NULL, '2629015070', '02/11/1994', 'eric', '', 1, 3, NULL, NULL, NULL, '2022-12-10 22:36:42', 1, 'I like to be active.', '$2a$10$dDZ60RvkklhYrL5JLliEquNAySJTmIsoD0nBKNMUnmaPEDN5N8m7K', '0', NULL, 'USA', NULL, '53150', 1, 0, 'cv1r2Bcx-kTyuxPfjfr-0E:APA91bGTY1wtuChGWYXe2bfYX6QY8hV5CdHczNIRAtHbFjwYZqZfgqItLesR7L8WrP9vBTZxXiPp0g1yFyGe-RXr4u2BZHqbvKwf4qoD8DJAwK5MxbjE_RxSViYYHzCez2oLlyLAuhJy'),
(7, NULL, '8455876765', '04/30/1991', 'ti Flèche ', 'https://backend.sayyesadmin.com/files?fileName=image-1699408161660.png', 1, 2, NULL, NULL, NULL, '2022-12-11 07:41:50', 1, 'Adventurous ', '$2a$10$zlGUQhLyt0xCEYl00Zq4c.z/qV3TPVp3bRCxRKOWTByzgQywnwP4O', '0', NULL, 'United States', 'Making you smile nah you ugly ', '10001', 0, 0, 'fpIjv5gJmkaNuCDESyC7dt:APA91bEmgzQRgknZuvUNi-51dw8KVoaWIw-FYwRGRGzXUGl5vNcgIjKzOTKqIoED053eh1JIOi5n1MY_x9WFy3CDw1BNgcrT7WMOxtsYaC146bJixVeg1RQrz8FoM6jvbBnS9zLzXo8s'),
(8, NULL, '01280327473', '12/11/2002', 'rrizk', '', 1, 2, NULL, NULL, NULL, '2022-12-11 15:00:03', 1, 'Something ', '$2a$10$NitWnlqnnzZXOANB.SrmeuAn.3wGJrvgR3BAtbZy6kGMC/aYuJh/G', '0', NULL, 'USA', NULL, '12345', 0, 0, NULL),
(9, NULL, '9099700797', '12/29/1990', 'test', '', 1, 3, NULL, NULL, NULL, '2022-12-29 00:17:27', 1, 'Test', '$2a$10$u1C4TZnAghUmG1yrWLKn.ux3yJ/C.DmfTxzBI1Zt79tRWtqQqQ/n.', '0', NULL, 'USA', NULL, '395008', 0, 0, 'dRsoeecVMk8Nohua7agWTw:APA91bF11k0gfD33mcwcx1gW27GVriYbKELWOG5UjkcKlRwn5vPgU3zYAwVEcWFUyDDrfXgOhvofM8NFJzpmrHxPdY_un29ffHtdWUOh0CW-O8XX7YPqJX6X1pZhr6tamZ2pn50_8sKV'),
(26, NULL, '9876543210', '01/04/2000', 'test', '', 1, 2, NULL, NULL, NULL, '2023-01-04 13:35:09', 1, 'Sometimes ', '$2a$10$FlO6o.VxdsnX/iml/Bp5/ObEv0wFmw.pMWl69alVrDWViEhyuyMi.', '0', NULL, 'USA', NULL, '98765', 0, 0, NULL),
(27, NULL, '9144353015', '04/04/1991', 'Belle', 'https://backend.sayyesadmin.com/files?fileName=image-1679379882071.png', 2, 1, NULL, NULL, NULL, '2023-01-04 14:02:30', 1, 'Love doing new things ', '$2a$10$Oo0ROpwyGpb5oqvh8MfsjepSvZauI9cjwa2NOSFq7/57VNUPP5iQu', '0', NULL, 'United States', 'Trying new restaurants ', '33634', 0, 0, 'dyz-nxRRXEJvtl6P2iEne4:APA91bE1zTnp9LkHtr80CUDMMD9EuXXTlYYVSHwDWAJqBoQ4Sh2S2c44GtTgBxfn-RYN4smj8rsf8G63ZGfSKspCTSEjbfRyCMmprbGhrPREFRnYlGHZyhqvwdSfXi8xOiIDacYHsU_B'),
(45, NULL, '8453766976', '08/23/1990', 'lucidwillfit', '', 1, 2, NULL, NULL, NULL, '2023-03-02 17:12:52', 1, 'Are you feeling it now mr crabs? ', '$2a$10$YibxoA42VWqtTh5tqEDfWOuFHl0OUsAiUR8nTX6mdB4fcznue8J1e', '0', NULL, 'USA', NULL, '10960', 0, 0, NULL),
(46, NULL, '2018929988', '07/28/1989', 'kingflex', '', 1, 2, NULL, NULL, NULL, '2023-03-02 17:52:13', 1, 'I’m handsome ', '$2a$10$kspy9fr5ydwMd.SiS.PxjefKlwDGcGRFmhk7JkBp8xg2eqCti8fwa', '0', NULL, 'USA', NULL, '10954', 0, 0, 'cYo5TTv820yFlSYqvd72nC:APA91bF7eGsRyUZz1DOpFqPFnx0b1gLSeHTe9cVBsSP6L8D8WwB50SoEi3T8XL-dfcT0pKW3uXxZsFDA2Hq8xbNZTAFO3DSpbvRHfXPzOON45WF-B6ax8Ya1UPfgNqwM0X3WPA4u4qC3'),
(47, NULL, '84537676', '08/23/1990', 'chillwill23', 'https://backend.sayyesadmin.com/files?fileName=image-1677861938475.png', 1, 2, NULL, NULL, NULL, '2023-03-02 18:20:08', 1, 'It’s me, I’m Him.', '$2a$10$4bFHWYyt04qyz/GRK1A/4e7b2BkRKyTJMWQ/ua3fNxNj96tmGrf3K', '0', NULL, 'United States', 'Watch Movies', '10960', 0, 0, NULL),
(48, NULL, '43460301', '04/15/1990', 'wisler', '', 1, 2, NULL, NULL, NULL, '2023-03-02 20:52:57', 1, 'I’m a man ', '$2a$10$HJlENXfoXYnCAbdNL/AGSuJpeKZwQQnwj4DvUC8O1U3CRbVL.RgBO', '0', NULL, 'USA', NULL, '33634', 0, 0, NULL),
(49, NULL, '7272667151', '10/14/1991', 'flighttaker@gmail.com', '', 1, 2, NULL, NULL, NULL, '2023-03-02 21:52:06', 1, 'I’m da shit ', '$2a$10$9VDkoMc7wjuiywO1qERrG.j2RgTh1FWDugyhFhvKewWIJ.6XdFkWO', '0', NULL, 'USA', NULL, '33634', 0, 0, NULL),
(50, NULL, '8455350177', '09/11/1991', 'acoichy', '', 1, 2, NULL, NULL, NULL, '2023-03-02 22:18:04', 1, 'My name is Akim and it’s a pleasure to virtually meet you! I love movies, nature, art, food, etc etc etc. \n\nI currently do healthcare marketing and I want to connect with fun, likeminded people. \n\nSay Yes with me. ', '$2a$10$iWsEP.Rx1C4v6jpb2W58d.DJPQOb1XfnlDPwv132Qp5EXn91g5y.G', '0', NULL, 'USA', NULL, '07002', 0, 0, NULL),
(51, NULL, '8622335971', '06/21/1997', 'Jenn bvby', '', 2, 2, NULL, NULL, NULL, '2023-03-02 23:49:34', 1, 'I love going out', '$2a$10$n8mszHnxghOdcfFpeNLxYumzN7M8Ak0vcw3GxMaEoU4yKLLqzQXVm', '0', NULL, 'USA', NULL, '07050', 0, 0, 'dTaPqvMml0XZmXy5pHycfv:APA91bGrGdejbk7fOUZiLTLPxcMl9mNbkCFnfYmAL0glw-e9ItO8wyNOP9i10l6ukCg8YaUwEO7QRzAUsM2sJ01fZedRpxP194XIKt_Y7KXY-ad0gJtr7_PwTzyQlakTVLGBc7zysJnT'),
(52, NULL, '9148395159', '03/02/1997', 'doriV', '', 2, 1, NULL, NULL, NULL, '2023-03-03 04:05:33', 1, 'Just wanna have fun ', '$2a$10$afN6boxxKS/B3PPkrhkG7uP.HxXW3.9lDcYkZJr.AfyKhrcpNuVam', '0', NULL, 'USA', NULL, '14215', 0, 0, NULL),
(53, NULL, '9084252948', '10/11/2000', 'Suca', '', 2, 1, NULL, NULL, NULL, '2023-03-03 11:56:13', 1, 'I like dressing up , going out to eat, do fun things & taking pics', '$2a$10$72DFFBNGIojKuS4BO0jebuUn5UrKC8zbgTeaQ7.n5zKKspAyXpx6i', '0', NULL, 'USA', NULL, '07208', 0, 0, 'f1zEVmi3mEXhorpf5vjCCb:APA91bEuybTwOuR9eFoQEAxPD7edJZ5Zicyogpn6-g92cvPVRDMBYTFSe0itlS18YKLOYZKWYqhF52KipOd8J-qHCoO0oXeTdWsukmlWsjyNWNRngbufgBOtUIDbJqxYceCJ8sFDGdfy'),
(54, NULL, '07703389601', '07/13/1982', 'sim', '', 2, 1, NULL, NULL, NULL, '2023-03-03 15:48:12', 1, 'Looking for fun cheeky people to hang out with ', '$2a$10$8eOl8K9iP9i07h/t8IYff.pmB7Lm2hwyBMaMd0LsDIG3KZ5cn2v5C', '0', NULL, 'USA', NULL, '62', 0, 0, NULL),
(55, NULL, '8456080008', '12/25/2000', 'rico', '', 1, 2, NULL, NULL, NULL, '2023-03-03 21:41:40', 1, 'Just here living life ', '$2a$10$mnVv0K76QDBqTUbgF8YJVuieXppC8QbCX1MJJL9KxN3U.7XO71uWu', '0', NULL, 'USA', NULL, '845', 0, 0, 'e21Yi8OISkNrocdDsDZ_uh:APA91bEHNkxHYllWECGiWJ9RCu7FUDIuFPQCb8SQBVaPMylFkgA4wFgnhIEkGeTa567ZJ6iMekztcanBE-1YusbzCjXMXY6vgeW51516dx3oPdCVwuj5Wxww8ZuDNMPwwCtuFzQhT4bM'),
(56, NULL, '7706870627', '06/22/1989', 'sunbun33', '', 2, 1, NULL, NULL, NULL, '2023-03-04 02:09:50', 1, 'I love to stay home listen to music and smoke hookah', '$2a$10$Pe6nac.QJopV15aeyctICeWZ4O0tMN2AAMn4uTN/K2O2.1KwDFB4i', '0', NULL, 'USA', NULL, '30344', 0, 0, NULL),
(57, NULL, '8455023927', '10/10/1991', 'G', '', 1, 2, NULL, NULL, NULL, '2023-03-04 02:42:15', 1, '.', '$2a$10$S8CXMWO.Ov8QujgvrgvUm.eU4u7RS/.AC79PDDiljPq8F1qFHXhwu', '0', NULL, 'USA', NULL, '10927', 0, 0, 'f9MIFqsu90d0rR_DsmuW0q:APA91bEipgILwNUhgHESvFSIyCpweh_mampzBNxOb8p-XkJZoG_20pB8WEwqKqcI7gy7LGj_eQ4hrmNEMPnSM3KQjVBG5FrMULYxSNVxcHPLpJYPlp99vHFzWXw9YetY07Umg1Cwtpu-'),
(58, NULL, '3513233724', '02/28/1997', 'riyad_elharzli', '', 2, 2, NULL, NULL, NULL, '2023-03-04 10:00:14', 1, 'Fast date', '$2a$10$nyw.ipXh74J/rHgF9C0Ihe5tFRl6YCp0Xm8NsU85cXOganPpuVIhu', '0', NULL, 'USA', NULL, '17041', 0, 0, NULL),
(59, NULL, '789456123', '03/04/1990', 'JOHN', '', 1, 2, NULL, NULL, NULL, '2023-03-04 14:15:39', 1, 'John is Good Boy', '$2a$10$LLh6vNbF0e1S2SMj9MhmluW/YJryEaiDrwEBiAXX/KnjeWwGssb2y', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(60, NULL, '9512524573', '03/04/1990', 'Honey', 'https://backend.sayyesadmin.com/files?fileName=image-1678684112746.png', 2, 1, NULL, NULL, NULL, '2023-03-04 14:18:48', 1, 'I’m good girl', '$2a$10$tXTW1uugQMQ/955ZYqZpnOWYNAT9kmMkzUVhrKb1fKBYHgKGqU6EW', '1', NULL, 'India', 'Hi', '33634', 0, 0, 'eu1iTWku2E8fsae-_uCaRl:APA91bEjOQ9FcEftedwuW9DeH7OOqYZkOTr4JTNU02v46L_H0lhBwuxqA-irSUGc7v3RcjuH8B9c-JILVSypnFEOFiFev6YIaMx1hdRFAlnMEoqEaNso2h3pZWgTImF31WtLlzouPIoi'),
(61, NULL, '7194749074', '10/04/1992', 'babyretta', '', 2, 1, NULL, NULL, NULL, '2023-03-04 15:09:05', 1, 'I’m a fun loving person who has a good heart', '$2a$10$baTwwQso4nu3IQHob7tVcOFNUji0C4SKNJVvFktpiRM/vPbEOFp.W', '1', NULL, 'USA', NULL, '33634', 0, 0, 'dDudH5XB7UqnlI5ilmxYLw:APA91bGB_UYtK77cU8nJeskOuQrqS3RrnVEIZWtOEIBulSEE8Cc3unfSlYqMssTISXVVKs1rY-7KjKdgt9Neu89tDD0mOhOcKzRkMLGPxyAqyaoIO3KiM8W7UOWj7XKDPNYymza4l37e'),
(62, NULL, '9146613446', '06/30/1992', 'MyJuicyPassion', '', 2, 1, NULL, NULL, NULL, '2023-03-04 21:00:20', 1, '💕', '$2a$10$ttmFIAGxQ8iiTRzXo2Jvnu4nQ57avZkIGHy.S8jkfW29Q5idkXCBC', '1', NULL, 'USA', NULL, '06850', 0, 0, 'eTW5yrPWNk38mwfGXuYlou:APA91bE9p_UWYrSMf_5kJcXcWIIIIu6Ee0JchueobqB1CVXYrFthjpFtSTs3_tlKHRmeOo_in6FQyoYWtArayB7Aw1wF8NApd0l8hVDjI6udyrK7V2BPyU35T09sj3DG7HVEIMdPsqzM'),
(63, NULL, '7188092140', '08/21/1996', 'Jay', '', 1, 2, NULL, NULL, NULL, '2023-03-06 14:19:10', 1, 'Cool person who loves building relationships and helping others…', '$2a$10$2FyY5Y2oFQgfhm4cKn.QDeV66wltpN/JRqR7rNzP4cDLHHgc5lNea', '1', NULL, 'USA', NULL, '11213', 0, 0, NULL),
(64, NULL, '9177972773', '12/27/1995', 'shawn', '', 1, 2, NULL, NULL, NULL, '2023-03-07 07:50:17', 1, 'Funny calm and cool', '$2a$10$CATPkYfajAUKHFo2c9jAtedUG2XFAGY3Cn672hISkyoVYQ47M0avC', '1', NULL, 'USA', NULL, '10977', 0, 0, NULL),
(65, NULL, '97516279', '03/07/1995', 'i here ', '', 2, 3, NULL, NULL, NULL, '2023-03-07 11:35:16', 1, 'Look friend ', '$2a$10$8yFfhANQPOGZgTE7UN/.YO9HK.O5QTGDrJCTBfzGwFOla10iIeAN.', '0', NULL, 'USA', NULL, '28184554', 0, 0, NULL),
(66, NULL, '111111111', '03/10/1990', 'AARAV', 'https://backend.sayyesadmin.com/files?fileName=image-1678429840128.png', 1, 2, NULL, NULL, NULL, '2023-03-10 05:16:52', 1, 'Hi I’m Describe my Self', '$2a$10$8QNSrPc3nsDKrQtouXF/CuMru2kUyykpnRirycEUADJjxDm6FPlqq', '0', NULL, 'India', 'FAV ACTIVITY', '395008', 0, 0, 'd0Myuz0KB0qriOx0w8e4bs:APA91bHyZyPxp4rdMry_luZDlVEsUQzuXjNHdActBw3q7GoVoWlZtrpJ25iHl1cu9rivfTpGfN0Jliyo3brkXtUHq9ia-70EpNH_3niVMuS9gH5BqLi9YXMPtK5gH2yoMlL7n7IKcloy'),
(67, NULL, '222222222', '03/10/2000', 'SMIT', 'https://backend.sayyesadmin.com/files?fileName=image-1678429829773.png', 2, 1, NULL, NULL, NULL, '2023-03-10 05:33:10', 1, 'Hi I’m Smit ', '$2a$10$0AVHR7.UfS.1xOMD0d5Zuu1CeScA0YiRKYvUDhruNGnuaKmI52Jvm', '0', NULL, 'India', 'FAV', '395008', 0, 0, 'd0Myuz0KB0qriOx0w8e4bs:APA91bHyZyPxp4rdMry_luZDlVEsUQzuXjNHdActBw3q7GoVoWlZtrpJ25iHl1cu9rivfTpGfN0Jliyo3brkXtUHq9ia-70EpNH_3niVMuS9gH5BqLi9YXMPtK5gH2yoMlL7n7IKcloy'),
(68, NULL, '7085951380', '09/21/1997', 'LilSleez', '', 1, 2, NULL, NULL, NULL, '2023-03-12 19:06:44', 1, 'Basketball, FootBall , Movies, Shopping and Entertainment dates and food dates', '$2a$10$4tLFBo/0IqeHEYSy0Ch8H.Ej4HfyBPsf4JFORbRsw5/QgHcoB3P6y', '1', NULL, 'USA', NULL, '60478', 0, 0, NULL),
(69, NULL, '6463617608', '07/07/1977', 'Wood99', 'https://backend.sayyesadmin.com/files?fileName=image-1679492021577.png', 1, 2, NULL, NULL, NULL, '2023-03-16 16:36:51', 1, 'Adventurer', '$2a$10$U7TbHwcyTQ/zaJSv43KxEeb6Bp8trj1R59eBFHF0tH2/Nzq22F9/q', '1', NULL, 'United States', 'Travel', '10977', 0, 0, 'e0vuSrMam01SslezPd-WDz:APA91bGPFetNTNYM4CQxUMpToCX7LLkurkN7_bpT1hN4DoCnPyOXJjhk1nbdPUo7B5-Ybz1zUMjfW7e9gHgUtwP0rP2wbk_Ui3HpMcwpCQoQPg89SW6h5co32xOochYv7osWWkbBUzMi'),
(70, NULL, '7327880665', '02/06/1980', 'Je An', '', 2, 1, NULL, NULL, NULL, '2023-03-16 19:09:16', 1, '&', '$2a$10$mFH4kcviSDHaS8mO4K.5ZefQJr3s.MiRQxKiISBHyLd7SJlYrNR2a', '1', NULL, 'USA', NULL, '10029', 0, 0, 'cpvHSPBvbka6j0jPH_uoOh:APA91bEYQurFDc3IbWJLzQs7qo9lBnSVWgcY3zPPK-inRONZ4hG9N_YkglEbGgVl9Gb0CVznKvSDKGRjvVzZYbHwWqzIFFqHwykkSwPQg04A7yIsamI1dpz_4Qpl5qIAleRlO4xWbuf-'),
(71, NULL, '8135739712', '07/16/2000', 'vicenterancel', 'https://backend.sayyesadmin.com/files?fileName=image-1681412809136.png', 1, 2, NULL, NULL, NULL, '2023-03-17 13:21:09', 1, 'Say yes ', '$2a$10$W54aJg0mLKXsaSsQD8B99uimGjbFO4lyeTp7xiNYauGvsYDAYatIG', '1', NULL, 'United States', 'Hello', '33634', 0, 0, 'fdYlUM4eAEPhjkFL22A25w:APA91bH19ddHDTvKTGJN5QUufm3lN5NmJPW1bU1p3lnJmcdJPSes26Y0rsMhdZ9qdwh3gd-gZt7_OLSWooPulragVaPn52b1b74HwOvlG-_wJoAE8EyX6r6lViDnWuppEnHWoNABIGnx'),
(72, NULL, '6463397185', '11/29/1985', 'Aroxxx', '', 2, 1, NULL, NULL, NULL, '2023-03-19 01:09:47', 1, 'I’m exciting and excellent 🌝', '$2a$10$EKSwY1NC.AmmzrSI8UCwOOmTB1sMhTuD5fdagKLGURoitNW5Aq5Sy', '1', NULL, 'USA', NULL, '10475', 0, 0, NULL),
(73, NULL, '8454614816', '04/17/1990', 'david ', '', 3, 3, NULL, NULL, NULL, '2023-03-25 04:28:16', 1, 'I’m cool ', '$2a$10$xi/0IviXU.M7eSsZ/KtsyeYk3a8AhJOlSF6o0vFZTaxJxciJZeph.', '1', NULL, 'USA', NULL, '10960', 0, 0, NULL),
(74, NULL, '8452702432', '06/02/1993', 'young_nrestless', 'https://backend.sayyesadmin.com/files?fileName=image-1680748654814.png', 1, 2, NULL, NULL, NULL, '2023-03-29 01:13:43', 1, 'Gods Son ', '$2a$10$44fzTbOl.cCalIhp98hU/OOBBgx0jmDzH.6jb.uGeVwiFKVP6peJ6', '1', NULL, 'United States', 'Make money show love ', '10954', 0, 0, 'cAQWbAHK0Ei9qGgjTWxpvI:APA91bFgV_MzlIEGoFOWf4y3U04BqDv-j-8kXxb_LaC4T3yj8ddD0SCOi3CvsSCXjGKjvyJQvY8RA_Y43DSz4hX9o7r_RALUnxPsrNs_SbfllsF6F1vff9bJw9hz-3J1eHkkO6y43BY3'),
(75, NULL, '8457297815', '11/01/1991', 'cpjrtaz821@gmail.com', '', 1, 1, NULL, NULL, NULL, '2023-03-31 01:39:56', 1, 'N', '$2a$10$r10O0VWhMMpege4cWPHIMeSdUcjx1FgJ4EVtiQmQnZr4qSfZVyVCa', '1', NULL, 'USA', NULL, '10977', 0, 0, NULL),
(76, NULL, '8622333202', '06/21/2021', 'OG_jhenn', '', 2, 1, NULL, NULL, NULL, '2023-04-22 12:45:51', 1, 'I’m Jennifer', '$2a$10$R2qAZl7pkTlRiV067mMuaeVnwgHqyigJkxUCdtUcYVTZeGEM7Uh5O', '0', NULL, 'USA', NULL, '11423', 0, 0, NULL),
(77, NULL, '8238551009', '05/12/2000', 'Dips johnson', 'https://backend.sayyesadmin.com/files?fileName=image-1683548671866.png', 2, 2, NULL, NULL, NULL, '2023-05-08 12:06:47', 1, 'I am a very honest and decent boy and follow all the instructions from my parents and teachers. I complete my homework regularly and never get late to school. I pay attention and respect to my teachers and elders.', '$2a$10$YX7ALhzClLg3ADJokfvep.2FMAZ6e0WNSVi8Fsok9tPRcyQd6Q5wG', '0', NULL, 'India', 'Sports ', '394100', 0, 0, NULL),
(78, NULL, '925774846', '10/12/1996', 'jakeypo0_', '', 1, 2, NULL, NULL, NULL, '2023-05-09 18:24:18', 1, 'Yes.', '$2a$10$3LYbZTvXkVSrUVzWuLPAROHX4zc49Bun.Jnp7bRU2P44ofo1/DIFS', '0', NULL, 'USA', NULL, '95630', 0, 0, NULL),
(79, NULL, '5026814542', '04/26/1984', 'Shanie', '', 2, 1, NULL, NULL, NULL, '2023-05-14 01:54:54', 1, 'I’m very joyful person ', '$2a$10$IQtLCUjNweDOQEU5UzKhKePWgzu8QYnUnkKWZ3RJ4A4z2S5Rhu4vS', '0', NULL, 'USA', NULL, '40202', 0, 0, NULL),
(80, NULL, '6614189201', '05/30/1980', 'msRai', '', 2, 1, NULL, NULL, NULL, '2023-05-18 02:03:25', 1, 'I like to try new things ,visit new places ,,I’m a foodie love decorating and arts and crafts live music spending time with family and friends..', '$2a$10$gChk4usLlTMc2VZqeu/Gk.8Afn1f2iF4JBh3VBipFeuImoNAW/SvS', '0', NULL, 'USA', NULL, '93550', 0, 0, NULL),
(81, NULL, '9173020298', '12/24/1960', 'juan ynoa', '', 1, 1, NULL, NULL, NULL, '2023-05-18 18:19:57', 1, 'Perfume', '$2a$10$zr0KPWVm.OQi.pUZSryFvOPKm56A0HcGx73lHr9TnFjA59Ph1U7bG', '1', NULL, 'USA', NULL, '10032', 0, 0, NULL),
(82, NULL, '3215433882', '11/09/1973', 'nishelby', '', 2, 1, NULL, NULL, NULL, '2023-05-20 17:04:50', 1, 'Hi ', '$2a$10$79qhWfHnQeWaCBx9lSptMOs7Fol6uY93Z2xJ6aPN5LR9l2gCUdHC.', '1', NULL, 'USA', NULL, '32955', 0, 0, NULL),
(83, NULL, '3204580903', '08/20/1980', 'Johnson', 'https://backend.sayyesadmin.com/files?fileName=image-1684879872766.png', 1, 2, NULL, NULL, NULL, '2023-05-23 22:05:01', 1, 'I’m a good loving caring honest trustworthy loyal faithful and respectful man ', '$2a$10$BjuPY8waGgef4eOSZyzdCeysxXEi5nZXnJRCuNMLK51Lo7BhHHXlS', '1', NULL, 'United States', 'Working ', '59486', 0, 0, NULL),
(84, NULL, '9015813796', '01/24/1994', 'iamsmurftv', '', 1, 2, NULL, NULL, NULL, '2023-06-04 02:23:56', 1, 'Me', '$2a$10$PXO3.GlLa7VoimOx3jyZ/.GKLKBwqq/E1ZNoaeXJpRsU215tBAg7y', '1', NULL, 'USA', NULL, '37130', 0, 0, NULL),
(85, NULL, '8139578470', '03/24/1986', 'YayaChanel', 'https://backend.sayyesadmin.com/files?fileName=image-1688935762413.png', 2, 3, NULL, NULL, NULL, '2023-07-01 03:50:37', 1, 'I’m fun and like to laugh. I love poetry and learning new things. ', '$2a$10$4fsgKwshQKhfuqWZZy7/WOqSlIoOHiXHyOvXQHqhvzLkCWAxSh/ia', '0', NULL, 'United States', 'Walking \nBeach \nbike riding \nSkating \nMuseum', '33615', 0, 0, 'fMeJsslMKEhggx1yT3ovNf:APA91bFb3r2ed7_eIMwjqc5Ww9lgl4iyapuP5iuDZyNNkJWHC9i3AmKrmvAGCO0id61gxbBpL962rYa3bp1-l4EfQrdRueO4gKRWH7CSfu_HX-fsZrFN2cwRemEwJqYt1HKIJ34c7793'),
(86, NULL, '2028235090', '05/25/1966', 'felicita135@gmail.com', '', 2, 2, NULL, NULL, NULL, '2023-07-06 02:42:13', 1, 'Perfumes de hoy mujer ', '$2a$10$MFbmis6zLkSmtVQaMImpmuzhBksLxlAkT9zer5v425xmfrEu77C/m', '1', NULL, 'USA', NULL, '20012', 0, 0, NULL),
(87, NULL, '9736099244', '09/18/1990', 'ohshiiid', '', 1, 2, NULL, NULL, NULL, '2023-07-25 10:53:53', 1, 'Blissful ', '$2a$10$AqHPX6CtiCcMEF/5lpqWxOwEeSgwQDOK7vyEQ42gt500cJsPtv8JC', '1', NULL, 'USA', NULL, '33463', 0, 0, NULL),
(88, NULL, '5856662511', '09/19/1996', 'nzjxjbxbv', '', 1, 1, NULL, NULL, NULL, '2023-09-19 20:25:12', 1, 'ndjcjjxjdj dndjjd', '$2a$10$4mHbX/4Cyev3JPA79PksaemBZR5Sthh7DJfNKVBLDbnsSVJqAS0CW', '0', NULL, 'USA', NULL, '01111', 0, 0, NULL),
(89, NULL, '+19143404498', '01/06/1998', 'camillegilbert_206', 'https://backend.sayyesadmin.com/files?fileName=image-1695395654731.png', 2, 1, NULL, NULL, NULL, '2023-09-22 14:58:09', 1, '🤐😇🥳', '$2a$10$6O1HbbAdLuGYoNlCOkvP5upTjc2gXa8wR5JHpKZFgHC/YhL.J32dW', '0', NULL, 'United States', 'Yoga, dancing and clubbing ', '10013', 0, 0, NULL),
(90, NULL, '53434535', '09/28/2023', 'ff', '', 1, 1, NULL, NULL, NULL, '2023-09-28 07:18:06', 1, 'Fads', '$2a$10$kR5oE9HadgB2sdDxTY.Hr.Whr6.sKomjonh2IH9REYh7lUE9DaHoS', '0', NULL, 'USA', NULL, '34', 0, 0, NULL),
(91, NULL, '8456658387', '09/30/1978', 'Yesenia1356', '', 3, 3, NULL, NULL, NULL, '2023-09-30 16:51:42', 1, 'Good', '$2a$10$EVN74XgyZq3tUpEx4MkXIu3OIAQv.GEzjUvetuP.bCwUyGvzRm7zC', '0', NULL, 'USA', NULL, '12754', 0, 0, 'fUWwKWc2UUOrmw1yr1a46X:APA91bHZ-egzlnPxsMj7NkfxUrJ4sdGhJw6zlAvEEOOgkSjeOrkPbPoXLJn_KI8hAW7LBT3CXnCekE972NQshf8CezwRx9GFohO4HYQ1ecUBJFE8x2iQww7Z9UvcoPcr6UyfeUDlrPap'),
(92, NULL, '2144543527', '05/14/1976', 'teresa1004', '', 2, 2, NULL, NULL, NULL, '2023-10-30 01:56:43', 1, 'Blanca y bajita de altura', '$2a$10$HhvhKPECYJVEQGahGLBC/uzuo5XWejZetyl3EkpGz0XU3RUWGd6UO', '0', NULL, 'USA', NULL, '75052', 0, 0, NULL),
(93, NULL, '2017797965', '03/05/1973', 'Fanny', '', 1, 1, NULL, NULL, NULL, '2023-10-31 02:25:09', 1, 'Fancy ', '$2a$10$b4ejUz4Og2JbIZE2XN1hkev35iRZOufvthtA3fiUqyyebWBk1kD2G', '0', NULL, 'USA', NULL, '07307', 0, 0, NULL),
(94, NULL, '09255274556', '05/05/2000', 'Aryan ', '', 1, 1, NULL, NULL, NULL, '2023-11-04 07:44:53', 1, 'Myanmar', '$2a$10$uCrBlYnLe4DFVAdu396clOYbeOQQwL1egbrMuBEdpjgxqj2Tt1fTG', '0', NULL, 'USA', NULL, '758141', 0, 0, 'd4a7rqDT50dwrLZuBlzp5p:APA91bGZoZQ95aqaaYRiq1sKCu8SebBPoZIulc3QX6JcfEW4WKhpl-VYIhS_CTDglHuVOMuKZIQ5dKIB2nPc65H1J61H0Mgje-ArvoVjMpvoKxoPqhLPX9U-uN3frrll6oeXJRSx9p2R'),
(95, NULL, '7879308152', '05/04/1961', 'lety', '', 2, 1, NULL, NULL, NULL, '2023-11-17 20:57:01', 1, 'Perfume ', '$2a$10$z2RdHUMsHIZZ3YskR68qZO7mB4i3VvHV55pUqOijD.aBmrihNAjlW', '0', NULL, 'USA', NULL, '00911', 0, 0, 'cMu4HVLMgkn6sa_tNfge8Q:APA91bEbEtGnB_udTzh9HRA1Ur6PPZ6EoWrEhSnDr4TFu0CiQY853D61AwKiEdpOjS81L_30uIASMdHnZJsqQ8aGFTBizYUGUjtz9DGsIALW-p5KzJ5lFoXnI5OP13nklz47AkvZQb2x'),
(96, NULL, '5389', '05/05/1961', 'letty', '', 2, 3, NULL, NULL, NULL, '2023-11-18 00:56:07', 1, 'Perfume ', '$2a$10$0pSULdioL0JSy5hVdm2Y/.MQndZxfNSOonr78PHAlH45S1jJ1/aWK', '0', NULL, 'USA', NULL, '000911', 0, 0, NULL),
(97, NULL, '2104256709', '03/24/1970', 'Gabby Reyes', '', 2, 3, NULL, NULL, NULL, '2023-11-18 02:01:28', 1, 'Soy una persona muy independiente y me gusta trabajar en lo que me gusta.', '$2a$10$N/vcFtd8gX0pxgkCd6hJ9OCTsspfPiNsSRKkbWEwrAbkwH/0yuCw6', '0', NULL, 'USA', NULL, '78221', 0, 0, NULL),
(98, NULL, '123456789', '11/24/1992', 'mansi', '', 1, 1, NULL, NULL, NULL, '2023-11-24 04:52:42', 1, 'Man Jen heheh djhysjd ', '$2a$10$OmX.vgGyOQFcxgurK/U49efpvtohZwzcm3eWwxWzmWC.KfFJqymWu', '0', NULL, 'USA', NULL, '395008', 0, 0, '123'),
(99, NULL, '9313325938', '12/02/2003', 'mansi', 'https://backend.sayyesadmin.com/files?fileName=image-1700885673041.png', 2, 3, NULL, NULL, NULL, '2023-11-24 04:56:50', 1, 'Hey! ', '$2a$10$ylWxjPJ5yfLWzC3ajGEoVOglc1FIU3F/fT5JQKUriKVHlyjG3Lzbm', '0', NULL, 'India', 'ABCD', '394105', 0, 0, 'cDxtTeFLxkcHoU3r-nNW1Q:APA91bGCPkFL6hCUdfMenkhvV0To73ok8kKITQR6wQwR9fP-VKsp9dtCYclAt8Ghv6fBHjY8O4EQRoC1xJKqlHJJnOmMIxEcCmShcNZEdFAPk0MFnQ2T3AygdoxJLrGa--RqW_mlGe0x'),
(100, NULL, '123456788', '03/02/1993', 'palak', '', 2, 3, NULL, NULL, NULL, '2023-11-24 06:48:05', 1, 'Hey! Palak', '$2a$10$h.TcshwRBh.7Wu3L.ROxFe/Kz8KGIWlCgL90FtrpC5uZTzOGftvtW', '0', NULL, 'USA', NULL, '1362', 0, 0, NULL),
(101, NULL, '563214789', '06/21/2001', 'ABCD', '', 2, 2, NULL, NULL, NULL, '2023-11-24 06:53:21', 1, 'SDSDB', '$2a$10$SEllirs0baS7bZDw36cL/uihrKCSX7zlWtQlOcZgZ7AG6gGdL5TKe', '0', NULL, 'USA', NULL, '3652', 0, 0, NULL),
(102, NULL, '563214787', '03/18/2002', 'MLK', '', 1, 2, NULL, NULL, NULL, '2023-11-24 06:57:14', 1, 'MKO NJI BHU', '$2a$10$v6TVZq3GvlmRJ8ioT7YUa.UjoomAhoaOHpOq.Ncts4ShGsDu5pdZO', '0', NULL, 'USA', NULL, '1478', 0, 0, NULL),
(103, NULL, '987654321', '11/24/1996', 'swift taylor', '', 2, 2, NULL, NULL, NULL, '2023-11-24 09:10:30', 1, 'Gvbbnhh. Hjjhjj Jimmie ', '$2a$10$zAKE.T.xP/ywKuqzJSFJj.m.4Z1MKs/HEwDSYf8n6sareCbxlqsn2', '0', NULL, 'USA', NULL, '78965', 0, 0, NULL),
(104, NULL, '963258741', '09/11/2002', 'added', '', 3, 3, NULL, NULL, NULL, '2023-11-24 10:51:00', 1, 'Fdfdfe fed feed ', '$2a$10$32fjejEhn9UVKzvddjUAn.ecpxZGDsDabo1wlu7CVaX0vYXsJFU66', '0', NULL, 'USA', NULL, '123654', 0, 0, NULL),
(105, NULL, '741852963', '12/25/2004', 'palak', 'https://backend.sayyesadmin.com/files?fileName=image-1700885672388.png', 2, 3, NULL, NULL, NULL, '2023-11-24 12:05:09', 1, 'Hey! I am palak', '$2a$10$Wiq4lhm/Z.gBQ8zqL3cCBOSxLoYZqShtMNn/1bayvj4KHPrg0.qs2', '0', NULL, 'India', 'Listning songs\n', '394105', 0, 0, 'faBES6fO3k0euPSxBUzcvH:APA91bEog0OsDReAoOrtEtX-dQJiLMQPbPM-eJQE-HatFwTjG4Ej6R3L_I2pVtbX3Umsxtr0w5QBwJr_WPeBIF-8N-J-mRM9s4L12uHniZpEqr9mOVkRKklnfKNtS_-MLFkjGkybaRac'),
(106, NULL, '369874125', '09/15/2004', 'Deep Savaliya', 'https://backend.sayyesadmin.com/files?fileName=image-1701058168137.png', 1, 1, NULL, NULL, NULL, '2023-11-27 04:02:18', 1, 'Hey! I am Deep Savaliya', '$2a$10$cfUNmB/kKClbMFi.dNxIu.PDGOnc5px8z3xRHCYj/Be591cCJc3cm', '0', NULL, 'India', 'Listening english song', '394105', 0, 0, 'cDxtTeFLxkcHoU3r-nNW1Q:APA91bGCPkFL6hCUdfMenkhvV0To73ok8kKITQR6wQwR9fP-VKsp9dtCYclAt8Ghv6fBHjY8O4EQRoC1xJKqlHJJnOmMIxEcCmShcNZEdFAPk0MFnQ2T3AygdoxJLrGa--RqW_mlGe0x'),
(107, NULL, '147896325', '11/27/1996', 'Piyush Vasoya', 'https://backend.sayyesadmin.com/files?fileName=image-1701058187973.png', 1, 3, NULL, NULL, NULL, '2023-11-27 04:06:01', 1, 'Hey! I am Piyush vasoya', '$2a$10$qxNPx2MF9kDQ8FvJaOn5sOwd92vtSMqYHOG84331N89arF6VIxe.C', '0', NULL, 'India', 'Listening Bollywood song', '394105', 0, 0, 'faBES6fO3k0euPSxBUzcvH:APA91bEog0OsDReAoOrtEtX-dQJiLMQPbPM-eJQE-HatFwTjG4Ej6R3L_I2pVtbX3Umsxtr0w5QBwJr_WPeBIF-8N-J-mRM9s4L12uHniZpEqr9mOVkRKklnfKNtS_-MLFkjGkybaRac'),
(108, NULL, '523698741', '11/27/2023', 'but', '', 1, 2, NULL, NULL, NULL, '2023-11-27 06:52:43', 1, 'Likhjkljk jiggle ', '$2a$10$FbKndaxGtmFv397gUG5QbeqOkM/Ic44mi/W.OVe4ifZTgScGbyob6', '0', NULL, 'USA', NULL, '12358', 0, 0, NULL),
(109, NULL, '8799288364', '11/01/1992', 'Deep kmsoft', 'https://backend.sayyesadmin.com/files?fileName=image-1701489197145.png', 1, 1, NULL, NULL, NULL, '2023-12-01 12:07:02', 1, 'Disco', '$2a$10$IPBLSmSxgeP.abkB0DfJ6eq3cC02MLZM8aysYqL9gIVEGJvtKx6pq', '0', NULL, 'India', 'Fav activity ', '395008', 0, 0, NULL),
(110, NULL, '999999999', '11/02/1992', 'Piyush', 'https://backend.sayyesadmin.com/files?fileName=image-1701855565378.png', 1, 1, NULL, NULL, NULL, '2023-12-02 05:54:11', 1, 'Demo', '$2a$10$U3XpD4tQSC6AteEJiHcCz.iThRph1RxWWEAWq7aXUdJwBikjOsqrq', '0', NULL, 'Antarctica', 'Dance', '395008', 0, 0, 'dsYzKFW-80BuqtrtCB00_Z:APA91bEwvkJ9Q5bOoOx2-Mf11snDM2Vokxtk9y5ev-evF_gABcrd0jOpHhwFnza7MR3k9EiEtv4EceBDZkCNDz6Jut-lwdFsjUofWsGsAYbVf1nDUFpmUK8J6WP4oEnaun7nn3oc4GwG'),
(111, NULL, '888888888', '11/02/2023', 'Rahul', 'https://backend.sayyesadmin.com/files?fileName=image-1701771511014.png', 1, 1, NULL, NULL, NULL, '2023-12-02 06:39:38', 1, 'Please do it again ……', '$2a$10$ULydRHejwkPRPu.nKRNTvO.W.7P7buyAA4Gfv3pgYpmrUSyJBraaK', '0', NULL, 'India', 'Fav fav activity ', '395008', 0, 0, '123'),
(112, NULL, '4556456484', '12/04/2006', 'ergdsfg', '', 1, 2, NULL, NULL, NULL, '2023-12-04 11:53:42', 1, 'Shtrh', '$2a$10$xn3SlDcOhEiyNk.f1em1POE.1XA3v10VVCUOr/lB/fIGAFjrOL9na', '0', NULL, 'USA', NULL, '789456', 0, 0, NULL),
(113, NULL, '4752667224', '04/08/2000', 'adriana', '', 2, 2, NULL, NULL, NULL, '2023-12-06 06:35:55', 1, 'Perfum', '$2a$10$VeY8i4XnKNXlB9tuFDAEbO9w/xZfA95PPrbCwWuobzYvDGwHfg/Si', '0', NULL, 'USA', NULL, '06902', 0, 0, NULL),
(114, NULL, '14', '12/07/2023', 'maya', '', 1, 1, NULL, NULL, NULL, '2023-12-07 12:18:12', 1, 'Sdfgrt', '$2a$10$MzNhyaNKz7AGzPdUDf/CmO1PrUBRcV4qd708aPx3oaQrEKXR.TK4W', '0', NULL, 'USA', NULL, '14', 0, 0, 'fOipC95JPkfFkEu17NOyCY:APA91bEPtsXTbV3dyU4bE98PQKING2oLQ7dBSZQYGTjlOXmo6_bvR2UnTPhDEWgj396V1gQHn2dzU6aVMWe5Yx_LbIbHiYIiaNIJGek_UizSCnrYXHTnkOI5PcyBpi3uydMLSwFa32h7'),
(115, NULL, '145', '12/07/2023', 'Ravi', '', 1, 1, NULL, NULL, NULL, '2023-12-07 12:23:25', 1, 'Fgt', '$2a$10$8W21/iq4xCvAuCu.Xn9fLeGt9ljKeXuq67PJLO2Rq6/Y/6D8XdhGW', '0', NULL, 'USA', NULL, '1', 0, 0, NULL),
(116, NULL, '1', '12/07/2023', 'q', '', 1, 1, NULL, NULL, NULL, '2023-12-07 12:32:00', 1, 'Dsfd', '$2a$10$1VXdI5dG3i3qRe3S7Dyf9.dd9cVtDmgm.zKg0uhlQOskA1zU56x6W', '0', NULL, 'USA', NULL, '123', 0, 0, NULL),
(117, NULL, '11', '12/07/2023', 'a', 'https://backend.sayyesadmin.com/files?fileName=image-1702015206025.png', 1, 1, NULL, NULL, NULL, '2023-12-07 12:35:42', 1, 'Rt', '$2a$10$uAXQJRxgFjAx5rNYZB0Oo.8NMB7chnF5s1/SFKgcGBVF0PYG84qOC', '0', NULL, 'Canada', 'Reading books, traveling, listening music, spending time with friends', '896', 0, 0, 'eDG0csaIvUOfgywNjHBEka:APA91bGT2-mnDXseuP2R6zGxpcfkAQ-L936uCZzqVRt04BAKE-fDuUoZXrxgltrufRaK0zwZ10GtipL-a7xfMiufr-0XKOGUB9jNTFc5GnlrHs_egvSbFZsDgC-lrdNs52u7YEoI8Dqa'),
(118, NULL, '147258369', '12/08/1999', 'Ayushi', 'https://backend.sayyesadmin.com/files?fileName=image-1702016052541.png', 2, 1, NULL, NULL, NULL, '2023-12-08 03:43:03', 1, 'Great job..', '$2a$10$HNmLUPt2jxt/s4CtBRpNROUrqWXfpntuSe26sI7ZD21tXZTMamKoi', '0', NULL, 'Antarctica', 'Listening music, exploring world, reading books', '789', 0, 0, 'fOipC95JPkfFkEu17NOyCY:APA91bEPtsXTbV3dyU4bE98PQKING2oLQ7dBSZQYGTjlOXmo6_bvR2UnTPhDEWgj396V1gQHn2dzU6aVMWe5Yx_LbIbHiYIiaNIJGek_UizSCnrYXHTnkOI5PcyBpi3uydMLSwFa32h7'),
(119, NULL, '159159159', '12/08/2023', 'Palak', 'https://backend.sayyesadmin.com/files?fileName=image-1702034125604.png', 2, 1, NULL, NULL, NULL, '2023-12-08 10:41:10', 1, 'Hello everyone', '$2a$10$2fnxI6NcZWyjR4q.NbccJu83kNVcslqBueUq3thZoWcRCvM82oibO', '0', NULL, 'Antarctica', '147', '123', 0, 0, 'dsYzKFW-80BuqtrtCB00_Z:APA91bEwvkJ9Q5bOoOx2-Mf11snDM2Vokxtk9y5ev-evF_gABcrd0jOpHhwFnza7MR3k9EiEtv4EceBDZkCNDz6Jut-lwdFsjUofWsGsAYbVf1nDUFpmUK8J6WP4oEnaun7nn3oc4GwG'),
(120, NULL, 'bn', '12/08/2023', 'go', '', 1, 1, NULL, NULL, NULL, '2023-12-08 10:59:09', 1, 'Gh', '$2a$10$P9N0PIglakteyuAG9Az25.7wdYAB0vcvhb7ccUc.Vi.p/IXErKLSK', '0', NULL, 'USA', NULL, 'hj', 0, 0, NULL),
(121, NULL, 'Macy’s', '12/08/2023', 'Macy’s', 'https://backend.sayyesadmin.com/files?fileName=image-1702112391082.png', 1, 1, NULL, NULL, NULL, '2023-12-08 11:28:18', 1, 'Dsfddfg', '$2a$10$qTlakgwegAmT/CM3MxoZsO.Wx1dzlY55eCJyTmR3SpfQKE5PQWEey', '0', NULL, 'Antarctica', 'Listening music\n', '1', 0, 0, NULL),
(122, NULL, 'test', '11/17/1992', 'shah', '', 2, 2, NULL, NULL, NULL, '2023-12-09 03:27:31', 1, 'Hi im from kmsoft', '$2a$10$U1s1tYeaVMb2Ivid8423e.69Kd8kmfG/AUq38K5bJQasT8eVEePii', '0', NULL, 'USA', NULL, '395008', 0, 0, 'dsYzKFW-80BuqtrtCB00_Z:APA91bEwvkJ9Q5bOoOx2-Mf11snDM2Vokxtk9y5ev-evF_gABcrd0jOpHhwFnza7MR3k9EiEtv4EceBDZkCNDz6Jut-lwdFsjUofWsGsAYbVf1nDUFpmUK8J6WP4oEnaun7nn3oc4GwG'),
(123, NULL, 'Neha', '11/17/1992', 'shah', 'https://backend.sayyesadmin.com/files?fileName=image-1702113740914.jpeg', 2, 2, NULL, NULL, NULL, '2023-12-09 09:22:21', 1, 'Hi im from kmsoft', '$2a$10$Fe3BPp5vLaMPazSmR6OWsObmkjRfwUODPQTD0nz6zgk3nMxMBIWc.', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(124, NULL, 'Hema', '11/17/1992', 'shah', 'https://backend.sayyesadmin.com/files?fileName=image-1702113976794.jpeg', 2, 2, NULL, NULL, NULL, '2023-12-09 09:26:16', 1, 'Hi im from kmsoft', '$2a$10$ne9dowv9gfSBmy1B8RqhMOdkftgDM3tz4EjmzhB11uaDRM7CthKPu', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(125, NULL, 'Jaya', '11/17/1992', 'shah', 'http://192.168.29.100:1111/files?fileName=image-1702114082982.jpeg', 2, 2, NULL, NULL, NULL, '2023-12-09 09:28:03', 1, 'Hi im from kmsoft', '$2a$10$kxUbGNDwj3DtKkOfmtWkgOyd8VkPSqjTG1eT9QDBMiBJGDq7mjmiq', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(126, NULL, 'palak01', '12/11/2023', 'palak', 'http://192.168.29.100:1111/files?fileName=image-1702269578958.png', 2, 1, NULL, NULL, NULL, '2023-12-11 04:39:39', 1, 'Fgfh', '$2a$10$Nx49Ac1l4/Ate07/5FgUk.dWCf3C1TGpto6SZbGENLA2fzFVeyUOC', '0', NULL, 'USA', NULL, '123', 0, 0, NULL),
(127, NULL, 'jash07', '12/11/2023', 'jash07', 'http://192.168.29.100:1111/files?fileName=image-1702271373718.png', 2, 1, NULL, NULL, NULL, '2023-12-11 04:43:27', 1, 'Hello', '$2a$10$FIXv8Z.WE2pKICJzRGzqme4hYl1AMI7CwKqQ2lGo4ApIIgonPZ/DW', '0', NULL, 'Antarctica', 'Music', '123456', 0, 0, 'dsYzKFW-80BuqtrtCB00_Z:APA91bEwvkJ9Q5bOoOx2-Mf11snDM2Vokxtk9y5ev-evF_gABcrd0jOpHhwFnza7MR3k9EiEtv4EceBDZkCNDz6Jut-lwdFsjUofWsGsAYbVf1nDUFpmUK8J6WP4oEnaun7nn3oc4GwG'),
(128, NULL, 'janvi_05', '12/11/2023', 'janvi', 'http://192.168.29.100:1111/files?fileName=image-1702271274166.png', 2, 1, NULL, NULL, NULL, '2023-12-11 04:51:55', 1, 'Hello', '$2a$10$BUmsBNrq6N0uSBqqgCaLj.i8Ilb2UJRJ4nQ4KrG0eolfHsTe8D0mK', '0', NULL, 'Antarctica', 'Dance', '123456', 0, 0, 'dsYzKFW-80BuqtrtCB00_Z:APA91bEwvkJ9Q5bOoOx2-Mf11snDM2Vokxtk9y5ev-evF_gABcrd0jOpHhwFnza7MR3k9EiEtv4EceBDZkCNDz6Jut-lwdFsjUofWsGsAYbVf1nDUFpmUK8J6WP4oEnaun7nn3oc4GwG'),
(129, NULL, 'priya01', '12/11/2003', 'priya', 'http://192.168.29.100:1111/files?fileName=image-1702273372224.png', 1, 1, NULL, NULL, NULL, '2023-12-11 05:26:09', 1, 'Hello', '$2a$10$dF9qqrTvPi9260BSpa6tyO8dWLA0fKCCc9AOCZuI8IKAAIIrROpxW', '0', NULL, 'Antarctica', 'Dance', '123', 0, 0, 'fOipC95JPkfFkEu17NOyCY:APA91bEPtsXTbV3dyU4bE98PQKING2oLQ7dBSZQYGTjlOXmo6_bvR2UnTPhDEWgj396V1gQHn2dzU6aVMWe5Yx_LbIbHiYIiaNIJGek_UizSCnrYXHTnkOI5PcyBpi3uydMLSwFa32h7'),
(130, NULL, 'arju_01', '12/11/1997', 'arju', 'http://192.168.29.100:1111/files?fileName=image-1702274815825.png', 2, 1, NULL, NULL, NULL, '2023-12-11 06:06:56', 1, 'Hello', '$2a$10$n69sirx50dp7od3rbglmvup9nxVc2lV8ldJICbV14YYjbf597AI5y', '0', NULL, 'USA', NULL, '123', 0, 0, NULL),
(131, NULL, 'ashi_01', '12/11/2000', 'ashita', 'http://192.168.29.100:1111/files?fileName=image-1702275666206.png', 2, 1, NULL, NULL, NULL, '2023-12-11 06:21:06', 1, 'Gffjyghjyhn', '$2a$10$0z48ZQN8y2.ZPuJSbkq.s.zt294El8uc7q1C.WRM4g8Q36pK.r1qK', '0', NULL, 'USA', NULL, '123', 0, 0, NULL),
(132, NULL, '2', '12/11/1995', 'Rahul kmsoft', 'http://192.168.29.100:1111/files?fileName=image-1702277074037.png', 1, 1, NULL, NULL, NULL, '2023-12-11 06:44:34', 1, 'Qw', '$2a$10$pLcV3pLQGqblOZaxXUAJmObPN2Cn9J0wu50Sg2xvDspKZiDK635me', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(133, NULL, '3', '12/11/2005', 'Rahul 2 kmsoft', 'http://192.168.29.100:1111/files?fileName=image-1702277500522.png', 1, 1, NULL, NULL, NULL, '2023-12-11 06:51:40', 1, 'Aqwq', '$2a$10$xHchot1v6/BrjXWW6HvqnO8nO1uLNKKSGJspuL5YM9MwxADFUUnoe', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(134, NULL, '44', '12/11/1981', 'test', 'http://192.168.29.100:1111/files?fileName=image-1702278656547.png', 1, 1, NULL, NULL, NULL, '2023-12-11 06:56:40', 1, 'Qqq', '$2a$10$u6g.pBtvGIiYizyxH0/q2uRJ4y3PAN0tcDGWOyz23McEsptY75W8i', '0', NULL, 'Angola', 'Aaq', '395008', 0, 0, 'f4WNhiwuPEIgnjN8I1lkGm:APA91bEvOdX9VKdN4cjpXO3D2svKzQUFt3SDHYisjpUxxwC0pV8nEn740mmRuhhKLHMwbnTmk7g1P6L-93KVw0sZWdjVzkjaXlCAa9DlSuYjLgOqGfOwWx5bXoi4I7qDlpwA-c11tPQs'),
(135, NULL, '5', '12/11/1973', '5', 'http://192.168.29.100:1111/files?fileName=image-1702278154140.png', 1, 1, NULL, NULL, NULL, '2023-12-11 07:02:34', 1, 'Aaqa', '$2a$10$J/WqxZbc8eLFGQcDAnVxIeo53u1e9CI2kVaDwa7NXavw9p44BN/pW', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(136, NULL, '6	', '12/11/2003', '6', 'http://192.168.29.100:1111/files?fileName=image-1702278307179.png', 1, 1, NULL, NULL, NULL, '2023-12-11 07:05:07', 1, 'Aaaa', '$2a$10$1yGXyVDmmqkZwz3EtxhB6.3cq7JXt37KD0ZJr9nqrICpGDDyPaRhi', '0', NULL, 'USA', NULL, '395008', 0, 0, NULL),
(137, NULL, 'maya_01', '12/11/1994', 'maya sharma', 'http://192.168.29.100:1111/files?fileName=image-1702288487484.png', 2, 1, NULL, NULL, NULL, '2023-12-11 07:19:09', 1, 'I am iOS developer', '$2a$10$uA7IE.x5.RdtmbZ1n/T1SOrCTsvS9Jn9Z9BbQFVgXPT4Uz0W/syAq', '0', NULL, 'Antarctica', 'Playing badminton', '123564', 0, 0, 'cpUPZLJm0Erxlo5kAEB6ag:APA91bELpB2U7l-icc-cOW4QWAoe0tNS9tmW29GhLoJ5MpI85Nwa4NcX5ILwOh4ZNF5AtnQlbmRvdWQL0IaArbn-tsuqkOoyul-ETv2CRXzzVHBgA-m3XmUbnpK6suOxfKnsrQYfYjP8'),
(138, NULL, 'rajvi_01', '12/11/2004', 'Rajvi birla', 'http://192.168.29.100:1111/files?fileName=image-1702290423977.png', 2, 1, NULL, NULL, NULL, '2023-12-11 07:28:47', 1, 'I am a good girl, I am studying in bca in sutex bank college of computer science', '$2a$10$dMOt862SFVzhseqtyEn4vey.yY8bZ4kob9DeLcck9/RIHmxttraVC', '0', NULL, 'Angola', 'Dance, listening music, drawing painting,\nPlaying cricket, watch English movies, traveling, etc', '123455', 0, 0, 'f4WNhiwuPEIgnjN8I1lkGm:APA91bEvOdX9VKdN4cjpXO3D2svKzQUFt3SDHYisjpUxxwC0pV8nEn740mmRuhhKLHMwbnTmk7g1P6L-93KVw0sZWdjVzkjaXlCAa9DlSuYjLgOqGfOwWx5bXoi4I7qDlpwA-c11tPQs'),
(139, NULL, 'kaxa_01', '12/11/2010', 'kaxa dhanani', 'http://192.168.29.100:1111/files?fileName=image-1702287341830.png', 2, 1, NULL, NULL, NULL, '2023-12-11 09:34:57', 1, 'Dsggdh', '$2a$10$0amFrCryXgKYpdtL2z7S5enLlheRIn3uF8o33lcC0ZRehvv9vbRWO', '0', NULL, 'Antigua and Barbuda', 'Gossip', '123', 0, 0, NULL),
(140, NULL, 'deep', '12/11/2002', 'deep', 'http://192.168.29.100:1111/files?fileName=image-1702291771960.png', 1, 2, NULL, NULL, NULL, '2023-12-11 10:49:32', 1, 'Something', '$2a$10$kb52tAFHPcNeFESM.Kf4OOFnYkjSgzxgBd3lnYoFRNYhzVK44INWm', '0', NULL, 'USA', NULL, '394006', 0, 0, 'euGAax2NvkHPqeumIkyidh:APA91bEXDsxLXt64mztemALibDhR9xad4OOd7970kU5AM2oKP6xYI8ARgNVWVYrVodNLt7FPbADNqsqOeb0SWF8V5NNoARsaE28OzOTMSTPFE4XUMhbf9McmBhUFQTU1c_DSBxrESe2f'),
(141, NULL, 'Rahul', '12/11/1992', 'Rahul Shah', 'http://192.168.29.100:1111/files?fileName=image-1702295933115.png', 1, 1, NULL, NULL, NULL, '2023-12-11 11:05:54', 1, 'Tell About. His dad hushed sgygdys Davy gsydgsdy sygdysgdysd so ygsyd gs ', '$2a$10$O1s13iHRclvIRNzaqDgFauRBj5CntfEY.UoYbCXHd66Z.AH6Vj.XW', '0', NULL, 'India', 'Fav Activity dfhsdusd usdsds Gigi Dyaus Gus’s sgydsgdy s dysdgys ds', '395008', 0, 0, NULL),
(142, NULL, 'Deep kmsoft', '12/11/2023', 'Deep kmsoft', 'http://192.168.29.100:1111/files?fileName=image-1702292912089.png', 1, 2, NULL, NULL, NULL, '2023-12-11 11:08:32', 1, 'Something', '$2a$10$B69JC6uJCs.VpRyXDpXPDewFAlGxspuzVaux9vMgl465dITVvafgC', '0', NULL, 'USA', NULL, '395006', 0, 0, 'euGAax2NvkHPqeumIkyidh:APA91bEXDsxLXt64mztemALibDhR9xad4OOd7970kU5AM2oKP6xYI8ARgNVWVYrVodNLt7FPbADNqsqOeb0SWF8V5NNoARsaE28OzOTMSTPFE4XUMhbf9McmBhUFQTU1c_DSBxrESe2f'),
(143, NULL, 'Smit ', '12/12/1992', 'smit Kmsoft', 'http://192.168.29.100:1111/files?fileName=image-1702446857868.png', 1, 1, NULL, NULL, NULL, '2023-12-12 05:43:21', 1, 'Tell me about your self….', '$2a$10$e269yYZRfntFMNeLXs8x..TVjX1FtYvk.rSXuVd8tI8oxCa9Cj3yi', '0', 'Surat', 'India', 'Fav Activity', '395008', 0, 0, 'dbko7oydnEg6qdAWYwmGb7:APA91bHou39P3CwWLq6ZGoB-NR8whWDZEhn3k0ub-eZ5BWM1Jlp6gqs2QQFHUcGSFfMB2Xp1vo-cbj5eGI47bbHTRPx0yMZGcvSVZi100zDrbLQ3mpl3Z1OnbOEYRxcQqcTqta5d5qNb'),
(144, NULL, 'RTest', '11/17/1992', 'shah', 'http://192.168.29.100:1111/files?fileName=image-1702439200414.jpeg', 2, 2, NULL, NULL, NULL, '2023-12-13 03:46:40', 1, 'Hi im from kmsoft', '$2a$10$3iIAp5YM2x9xFfWX33719e6tK4JezLVOYjIvts5/Ohpto9jF4QNHa', '0', 'Surat', 'Gujarat', NULL, NULL, 0, 0, NULL),
(145, NULL, 'ShahTest', '11/17/1992', 'shah', 'http://192.168.29.100:1111/files?fileName=image-1702439988801.jpeg', 2, 2, NULL, NULL, NULL, '2023-12-13 03:59:48', 1, 'Hi im from kmsoft', '$2a$10$HBPxgnvFNBpofbLSGVsCBOlAqnOp0XGF2AvqnwS5USX1rTuPMnLqG', '0', NULL, 'USA', NULL, NULL, 0, 0, NULL),
(146, NULL, 'ShahTest§', '11/17/1992', 'shah', 'http://192.168.29.100:1111/files?fileName=image-1702440468493.jpeg', 2, 2, NULL, NULL, NULL, '2023-12-13 04:07:48', 1, 'Hi im from kmsoft', '$2a$10$1qKBOhe/FoIipniJWA4U/OrGMQznGUjw7IBueUkwnAi2E4Mwlh5Gi', '0', 'Surat', 'Gujarat', NULL, NULL, 0, 0, NULL),
(147, NULL, '001', '12/13/1992', '1', 'http://192.168.29.100:1111/files?fileName=image-1702467645979.png', 1, 3, NULL, NULL, NULL, '2023-12-13 04:13:10', 1, 'Please.', '$2a$10$pxNVH06LvaJGv.Le/.kELuYvbxFDzmJf9Tu7a89YJBHy0jaTguSLa', '0', 'Surat', 'India', 'Fav.activity', NULL, 0, 0, NULL),
(148, NULL, 'hello', '09/26/1996', 'hyy', 'http://192.168.29.100:1111/files?fileName=image-1702464692488.png', 1, 2, NULL, NULL, NULL, '2023-12-13 10:51:32', 1, 'Something', '$2a$10$xrtUEEkAa6pEN4mdlMpKX.kQpqw33p6nx2re0w.4rPrzNC4kBAee6', '0', 'Surat', 'India', NULL, NULL, 0, 0, NULL),
(149, NULL, 'hyy', '10/20/2003', 'test', 'http://192.168.29.100:1111/files?fileName=image-1702467152059.png', 2, 1, NULL, NULL, NULL, '2023-12-13 11:08:52', 1, 'Hello', '$2a$10$WZU6s1q5f9SdHSZ/kcj.XOMOEAqLdaIZQeLeDCDSxHqVfKtr/yrR6', '0', 'George Town', 'The Bahamas', 'Fav', NULL, 0, 0, NULL),
(150, NULL, 'deep savaliya', '01/19/2001', 'deep savaliya', 'http://192.168.29.100:1111/files?fileName=image-1702541933902.png', 1, 3, NULL, NULL, NULL, '2023-12-14 04:17:16', 1, 'Hy my name deep', '$2a$10$rZmdTCqLptu0w/da.rQNAeAr1MknAv5CzN2om9AO7UDz4meYSaTgy', '0', 'Surat', 'India', 'rides', NULL, 0, 0, 'dG51wmdvw0dLrND4Xs8M6t:APA91bF_hH6uwZz41tc2rRmUV6qvqFxXyxiW8JRChcrmxfh_rCg9w2iBWpLtW-rxM5epVdbIU8P_ittpAKfpVmlj10npjfWsSzm99T87yWShfhE-48AV3-M8VP9bnxg-JnV62BULGaWW'),
(151, NULL, 'piyush vasoya', '09/26/1997', 'piyush vasoya', 'http://192.168.29.100:1111/files?fileName=image-1702541087438.png', 1, 1, NULL, NULL, NULL, '2023-12-14 04:25:07', 1, 'Hey I am piyush', '$2a$10$8jNOQa7KlfzHqgjEUQdTjOYXcettXGJ7lLii6sk8VKRJakH3pEbzu', '0', 'Seattle', 'United States', 'Aaaa1', NULL, 0, 0, 'djWo_rTlpk6yjXnXXg_rLu:APA91bFo6xgK6bv7F5IToDrHio5T5PTzNHVE5UFDxgWTVDl7eoN5jJg5KYQyw_rF4Prep-q4Rm9Pgngi06JTXDQvIyBzP_3noUwkg7_5aseyiPLA19c7Bg8CRGBSyunvX74Xkiof_fmx'),
(152, NULL, 'akbar', '08/11/1983', 'akbar ', 'http://192.168.29.100:1111/files?fileName=image-1702535121999.png', 1, 2, NULL, NULL, NULL, '2023-12-14 06:25:22', 1, 'Hey! I am akbar', '$2a$10$VTXdoS8yvj/..LjP6VXOG.PI6VY4Ozp/N439e6Q8PmWFDA/eCD6tS', '0', 'Poicha', 'India', NULL, NULL, 0, 0, 'dZo-uiNqSEpRpiuF7ilV2d:APA91bHeZip-KOWDBpcyxb2Wu7OP41p23BT3zeV8JprHgymRzYIBiL9iecTcQPSOSNyFabnJ7GvkLpzj2knm2Y6Ah8jxNrawBlt-Ku3iLQvPx7HIH5Va4b9P45bBPY1aYdiPMXx79pZo'),
(153, NULL, 'birbal', '06/19/1995', 'birbal', 'http://192.168.29.100:1111/files?fileName=image-1702537858495.png', 1, 1, NULL, NULL, NULL, '2023-12-14 06:29:33', 1, 'Hey! I am birbal.', '$2a$10$B6YEJK.j4o8ROyzEgkKD7uvU.TdSideT5nKrqz16BIqI5Y40w0a36', '0', 'Mumbai', 'India', '123', NULL, 0, 0, 'dZo-uiNqSEpRpiuF7ilV2d:APA91bHeZip-KOWDBpcyxb2Wu7OP41p23BT3zeV8JprHgymRzYIBiL9iecTcQPSOSNyFabnJ7GvkLpzj2knm2Y6Ah8jxNrawBlt-Ku3iLQvPx7HIH5Va4b9P45bBPY1aYdiPMXx79pZo'),
(154, NULL, 'munjani', '08/03/1998', 'Shruti', 'http://192.168.29.100:1111/files?fileName=image-1702623902353.png', 2, 1, NULL, NULL, NULL, '2023-12-14 10:18:00', 1, 'Hey I am shruti.', '$2a$10$sCzKZ9Vleg3E6RlSCE3LuOMvW/9.vwzg0mISiXMRKTic3Lv93KDRi', '0', 'Surat', 'India', 'My favorite activity is coding..', NULL, 0, 0, 'd7Mh7ygyGkk4gWX4i0X2io:APA91bHaMLEE1Asj1mhi5jkzE3GwIHugXgpLU7SiqSBVnvNKVTx--GgbID5fdQuvL1ixgMgqz8XiifgLgHIk9SCfZ-QLBGdmWC1K8ro7xg2bgYBnJ0BKMAOvsMdO83-T09g_StEVTIzS'),
(155, NULL, 'dipen', '12/12/1996', 'dipen', 'http://192.168.29.100:1111/files?fileName=image-1702620188285.png', 1, 2, NULL, NULL, NULL, '2023-12-14 10:40:10', 1, 'Hey I am dipen dhaduk.', '$2a$10$eoaRdYVcSxKiUs8/jKVeH.zlPxdIQR4Oy51Wx/k09slu/gfnXSjvO', '0', 'Seattle', 'United States', 'Gaming', NULL, 0, 0, 'f4WNhiwuPEIgnjN8I1lkGm:APA91bEvOdX9VKdN4cjpXO3D2svKzQUFt3SDHYisjpUxxwC0pV8nEn740mmRuhhKLHMwbnTmk7g1P6L-93KVw0sZWdjVzkjaXlCAa9DlSuYjLgOqGfOwWx5bXoi4I7qDlpwA-c11tPQs'),
(156, NULL, 'shah', '12/15/1992', 'Rahul', 'http://192.168.29.100:1111/files?fileName=image-1702639334745.png', 2, 2, NULL, NULL, NULL, '2023-12-15 04:15:50', 1, 'Desc..', '$2a$10$vIGUA6Juxb7X4qg.LVqJnezKhPDfRIb7Fya0RVtcojzIiUl7AvySm', '0', 'Pune', 'India', 'Fav.', NULL, 0, 0, 'dbko7oydnEg6qdAWYwmGb7:APA91bHou39P3CwWLq6ZGoB-NR8whWDZEhn3k0ub-eZ5BWM1Jlp6gqs2QQFHUcGSFfMB2Xp1vo-cbj5eGI47bbHTRPx0yMZGcvSVZi100zDrbLQ3mpl3Z1OnbOEYRxcQqcTqta5d5qNb'),
(157, NULL, 'Carry', '12/15/2023', 'minaty', 'http://192.168.29.100:1111/files?fileName=image-1702629141113.png', 1, 2, NULL, NULL, NULL, '2023-12-15 08:32:21', 1, 'Hey I am carry minaty..', '$2a$10$AIXBFi2pA6i0KNEYPt/Dq.RQqM.muIkx70aQiw4r5pU2lB1Ottace', '0', 'Somnath', 'India', NULL, NULL, 0, 0, NULL),
(158, NULL, 'kavya', '12/15/2014', 'kavya sharma', 'http://192.168.29.100:1111/files?fileName=image-1702640136156.png', 2, 3, NULL, NULL, NULL, '2023-12-15 10:21:57', 1, 'Hello', '$2a$10$61O39jTFNI/S4pRvPuq6QuzLx.1P/N7ALJbhBItS4EI5Yu3/o8ZB2', '0', '', 'Angola', 'Dance', '123456', 0, 0, 'eyjWwD2wZU34mpy3nHXCY0:APA91bG7VfFrBJ1Ixe8_-Si-j0uHGuIZlWo2AEAyZE0UScDcBDOdS_BEaoWjfxjlVxAAtOq7-brGK18dNloytaRBPpZXchkkfoBerWfEYOieINnVzQI1TisVjEt8zE0RxOpvkY5jetgv'),
(159, NULL, 'Boda', '12/15/2000', 'Simit', 'http://192.168.29.100:1111/files?fileName=image-1702637525880.png', 1, 1, NULL, NULL, NULL, '2023-12-15 10:45:25', 1, 'Please Tell About Self.', '$2a$10$o1bkOSl7nI652zSUdKg8mOPDdJsqPm2WlW25zRUs1eu.EdUUbC6LK', '0', 'Pune', 'India', 'Fav.', NULL, 0, 0, 'dG51wmdvw0dLrND4Xs8M6t:APA91bF_hH6uwZz41tc2rRmUV6qvqFxXyxiW8JRChcrmxfh_rCg9w2iBWpLtW-rxM5epVdbIU8P_ittpAKfpVmlj10npjfWsSzm99T87yWShfhE-48AV3-M8VP9bnxg-JnV62BULGaWW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertisements`
--
ALTER TABLE `advertisements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blockusers`
--
ALTER TABLE `blockusers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `confirmActivities`
--
ALTER TABLE `confirmActivities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flages`
--
ALTER TABLE `flages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forgetPasswords`
--
ALTER TABLE `forgetPasswords`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likeliveactivitises`
--
ALTER TABLE `likeliveactivitises`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `liveActivities`
--
ALTER TABLE `liveActivities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `liveActivityImages`
--
ALTER TABLE `liveActivityImages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userActivities`
--
ALTER TABLE `userActivities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userImages`
--
ALTER TABLE `userImages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userreports`
--
ALTER TABLE `userreports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userRequests`
--
ALTER TABLE `userRequests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advertisements`
--
ALTER TABLE `advertisements`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blockusers`
--
ALTER TABLE `blockusers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `confirmActivities`
--
ALTER TABLE `confirmActivities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `flages`
--
ALTER TABLE `flages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `forgetPasswords`
--
ALTER TABLE `forgetPasswords`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `genders`
--
ALTER TABLE `genders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likeliveactivitises`
--
ALTER TABLE `likeliveactivitises`
  MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `liveActivities`
--
ALTER TABLE `liveActivities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `liveActivityImages`
--
ALTER TABLE `liveActivityImages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=220;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `userActivities`
--
ALTER TABLE `userActivities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userImages`
--
ALTER TABLE `userImages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=354;

--
-- AUTO_INCREMENT for table `userreports`
--
ALTER TABLE `userreports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `userRequests`
--
ALTER TABLE `userRequests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
