-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2024 at 09:39 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `slomejs`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts_worlds`
--

CREATE TABLE `accounts_worlds` (
  `account_id` int(11) NOT NULL,
  `world_id` int(11) NOT NULL,
  `whitelist` longtext NOT NULL,
  `whitelist_on` tinyint(1) NOT NULL,
  `password` varchar(32) NOT NULL,
  `alias` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_worlds`
--
ALTER TABLE `accounts_worlds`
  ADD PRIMARY KEY (`account_id`,`world_id`),
  ADD KEY `world_id` (`world_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts_worlds`
--
ALTER TABLE `accounts_worlds`
  ADD CONSTRAINT `accounts_worlds_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accounts_worlds_ibfk_2` FOREIGN KEY (`world_id`) REFERENCES `worlds` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
