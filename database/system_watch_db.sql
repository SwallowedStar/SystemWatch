-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 14 nov. 2022 à 13:51
-- Version du serveur : 5.7.36
-- Version de PHP : 7.4.26

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `system_watch_db`
--
CREATE DATABASE IF NOT EXISTS `system_watch_db` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `system_watch_db`;

-- --------------------------------------------------------

--
-- Structure de la table `computer`
--
-- Création : lun. 14 nov. 2022 à 13:18
-- Dernière modification : lun. 14 nov. 2022 à 13:18
-- Dernière vérification : lun. 14 nov. 2022 à 13:18
--

DROP TABLE IF EXISTS `computer`;
CREATE TABLE IF NOT EXISTS `computer` (
  `computerID` int(11) NOT NULL AUTO_INCREMENT,
  `computerName` varchar(100) NOT NULL,
  `GPUname` varchar(100) NOT NULL,
  `amountRAM` int(11) NOT NULL,
  `amountVRAM` int(11) NOT NULL,
  `CPUid` int(11) NOT NULL,
  PRIMARY KEY (`computerID`),
  KEY `fk_computer_cpu_CPUid` (`CPUid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `core`
--
-- Création : lun. 14 nov. 2022 à 13:22
-- Dernière modification : lun. 14 nov. 2022 à 13:22
-- Dernière vérification : lun. 14 nov. 2022 à 13:22
--

DROP TABLE IF EXISTS `core`;
CREATE TABLE IF NOT EXISTS `core` (
  `idCore` int(11) NOT NULL AUTO_INCREMENT,
  `computerID` int(11) NOT NULL,
  PRIMARY KEY (`idCore`),
  KEY `fk_core_computer_computerID` (`computerID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `corestatus`
--
-- Création : lun. 14 nov. 2022 à 13:29
-- Dernière modification : lun. 14 nov. 2022 à 13:29
-- Dernière vérification : lun. 14 nov. 2022 à 13:29
--

DROP TABLE IF EXISTS `corestatus`;
CREATE TABLE IF NOT EXISTS `corestatus` (
  `time` datetime NOT NULL,
  `computerID` int(11) NOT NULL,
  `idCore` int(11) NOT NULL,
  `coreUsage` int(11) NOT NULL,
  `coreTemp` float NOT NULL,
  KEY `fk_corestatus_inputtime_time_computerID` (`time`),
  KEY `fk_corestatus_inputtime_computerID` (`computerID`),
  KEY `fk_corestatus_core` (`idCore`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `cpu`
--
-- Création : lun. 14 nov. 2022 à 13:05
-- Dernière modification : lun. 14 nov. 2022 à 13:05
--

DROP TABLE IF EXISTS `cpu`;
CREATE TABLE IF NOT EXISTS `cpu` (
  `CPUid` int(11) NOT NULL AUTO_INCREMENT,
  `CPUname` varchar(100) NOT NULL,
  PRIMARY KEY (`CPUid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `inputtime`
--
-- Création : lun. 14 nov. 2022 à 13:46
-- Dernière modification : lun. 14 nov. 2022 à 13:46
-- Dernière vérification : lun. 14 nov. 2022 à 13:46
--

DROP TABLE IF EXISTS `inputtime`;
CREATE TABLE IF NOT EXISTS `inputtime` (
  `time` datetime NOT NULL,
  `computerID` int(11) NOT NULL,
  `RAMusage` int(11) NOT NULL,
  `nbThreads` int(11) NOT NULL,
  `nbProcesses` int(11) NOT NULL,
  `GPUtemp` int(11) NOT NULL,
  `CPUfreq` int(11) NOT NULL,
  `VRAMusage` int(11) NOT NULL,
  `fanSpeed` int(11) NOT NULL,
  PRIMARY KEY (`time`,`computerID`),
  KEY `fk_inputtime_computer_computerid` (`computerID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
