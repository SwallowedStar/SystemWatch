-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 16 nov. 2022 à 23:14
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

DROP TABLE IF EXISTS `computer`;
CREATE TABLE IF NOT EXISTS `computer` (
  `computerID` int(11) NOT NULL AUTO_INCREMENT,
  `computerName` varchar(100) NOT NULL,
  `GPUname` varchar(100) NOT NULL,
  `amountRAM` bigint(11) UNSIGNED NOT NULL,
  `amountVRAM` bigint(11) UNSIGNED NOT NULL,
  `CPUid` int(11) NOT NULL,
  PRIMARY KEY (`computerID`),
  KEY `fk_computer_cpu_CPUid` (`CPUid`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `computer`
--

INSERT INTO `computer` (`computerID`, `computerName`, `GPUname`, `amountRAM`, `amountVRAM`, `CPUid`) VALUES
(1, 'Hp envy', 'AMD Radeon', 12000000000, 6000000000, 1);

-- --------------------------------------------------------

--
-- Structure de la table `core`
--

DROP TABLE IF EXISTS `core`;
CREATE TABLE IF NOT EXISTS `core` (
  `idCore` int(11) NOT NULL AUTO_INCREMENT,
  `computerID` int(11) NOT NULL,
  PRIMARY KEY (`idCore`),
  KEY `fk_core_computer_computerID` (`computerID`)
) ENGINE=InnoDB AUTO_INCREMENT=839 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `core`
--

INSERT INTO `core` (`idCore`, `computerID`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1);

-- --------------------------------------------------------

--
-- Structure de la table `corestatus`
--

DROP TABLE IF EXISTS `corestatus`;
CREATE TABLE IF NOT EXISTS `corestatus` (
  `time` datetime NOT NULL,
  `computerID` int(11) NOT NULL,
  `idCore` int(11) NOT NULL,
  `coreFrequency` float NOT NULL,
  `coreTemp` float NOT NULL,
  PRIMARY KEY (`time`,`idCore`,`computerID`),
  KEY `fk_corestatus_core` (`idCore`),
  KEY `fk_corestatus_monitor_computerID` (`computerID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `cpu`
--

DROP TABLE IF EXISTS `cpu`;
CREATE TABLE IF NOT EXISTS `cpu` (
  `CPUid` int(11) NOT NULL AUTO_INCREMENT,
  `CPUname` varchar(100) NOT NULL,
  `coreNumber` int(11) NOT NULL,
  `minFrequency` double UNSIGNED NOT NULL,
  `maxFrequency` double UNSIGNED NOT NULL,
  PRIMARY KEY (`CPUid`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `cpu`
--

INSERT INTO `cpu` (`CPUid`, `CPUname`, `coreNumber`, `minFrequency`, `maxFrequency`) VALUES
(1, 'AMD Ryzen 5 4500U', 6, 0, 2380),
(10, 'Intel i5-3 @ 3.800GHz', 4, 0, 3400000000);

-- --------------------------------------------------------

--
-- Structure de la table `monitor`
--

DROP TABLE IF EXISTS `monitor`;
CREATE TABLE IF NOT EXISTS `monitor` (
  `time` datetime NOT NULL,
  `computerID` int(11) NOT NULL,
  `RAMusage` double UNSIGNED NOT NULL,
  `nbThreads` int(11) NOT NULL,
  `nbProcesses` int(11) NOT NULL,
  `GPUtemp` double NOT NULL,
  `CPUfreq` double UNSIGNED NOT NULL,
  `VRAMusage` double UNSIGNED NOT NULL,
  `fanSpeed` double NOT NULL,
  PRIMARY KEY (`time`,`computerID`),
  KEY `fk_monitor_computer_computerid` (`computerID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `computer`
--
ALTER TABLE `computer`
  ADD CONSTRAINT `fk_computer_cpu_CPUid` FOREIGN KEY (`CPUid`) REFERENCES `cpu` (`CPUid`);

--
-- Contraintes pour la table `core`
--
ALTER TABLE `core`
  ADD CONSTRAINT `fk_core_computer_computerID` FOREIGN KEY (`computerID`) REFERENCES `computer` (`computerID`) ON DELETE CASCADE;

--
-- Contraintes pour la table `corestatus`
--
ALTER TABLE `corestatus`
  ADD CONSTRAINT `fk_corestatus_core` FOREIGN KEY (`idCore`) REFERENCES `core` (`idCore`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_corestatus_monitor_computerID` FOREIGN KEY (`computerID`) REFERENCES `monitor` (`computerID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_corestatus_monitor_time` FOREIGN KEY (`time`) REFERENCES `monitor` (`time`) ON DELETE CASCADE;

--
-- Contraintes pour la table `monitor`
--
ALTER TABLE `monitor`
  ADD CONSTRAINT `fk_monitor_computer_computerid` FOREIGN KEY (`computerID`) REFERENCES `computer` (`computerID`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
