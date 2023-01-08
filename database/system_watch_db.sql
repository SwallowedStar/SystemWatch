-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: system_watch_db
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `computer`
--

CREATE Database IF NOT EXISTS system_watch_db;
USE system_watch_db;

DROP TABLE IF EXISTS `computer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `computer` (
  `computerID` int NOT NULL AUTO_INCREMENT,
  `computerName` varchar(100) NOT NULL,
  `GPUname` varchar(100) NOT NULL,
  `amountRAM` bigint unsigned NOT NULL,
  `amountVRAM` bigint unsigned NOT NULL,
  `CPUid` int NOT NULL,
  `osName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`computerID`),
  KEY `fk_computer_cpu_CPUid` (`CPUid`),
  CONSTRAINT `fk_computer_cpu_CPUid` FOREIGN KEY (`CPUid`) REFERENCES `cpu` (`CPUid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `computer`
--

LOCK TABLES `computer` WRITE;
/*!40000 ALTER TABLE `computer` DISABLE KEYS */;
/*!40000 ALTER TABLE `computer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core`
--

DROP TABLE IF EXISTS `core`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core` (
  `idCore` int NOT NULL AUTO_INCREMENT,
  `computerID` int NOT NULL,
  PRIMARY KEY (`idCore`),
  KEY `fk_core_computer_computerID` (`computerID`),
  CONSTRAINT `fk_core_computer_computerID` FOREIGN KEY (`computerID`) REFERENCES `computer` (`computerID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core`
--

LOCK TABLES `core` WRITE;
/*!40000 ALTER TABLE `core` DISABLE KEYS */;
/*!40000 ALTER TABLE `core` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `corestatus`
--

DROP TABLE IF EXISTS `corestatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `corestatus` (
  `time` datetime NOT NULL,
  `computerID` int NOT NULL,
  `idCore` int NOT NULL,
  `coreFrequency` float NOT NULL,
  `coreTemp` float NOT NULL,
  `coreUsage` double DEFAULT '0',
  PRIMARY KEY (`time`,`idCore`,`computerID`),
  KEY `fk_corestatus_core` (`idCore`),
  KEY `fk_corestatus_monitor_computerID` (`computerID`),
  CONSTRAINT `fk_corestatus_core` FOREIGN KEY (`idCore`) REFERENCES `core` (`idCore`) ON DELETE CASCADE,
  CONSTRAINT `fk_corestatus_monitor_computerID` FOREIGN KEY (`computerID`) REFERENCES `monitor` (`computerID`) ON DELETE CASCADE,
  CONSTRAINT `fk_corestatus_monitor_time` FOREIGN KEY (`time`) REFERENCES `monitor` (`time`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corestatus`
--

LOCK TABLES `corestatus` WRITE;
/*!40000 ALTER TABLE `corestatus` DISABLE KEYS */;
/*!40000 ALTER TABLE `corestatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cpu`
--

DROP TABLE IF EXISTS `cpu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cpu` (
  `CPUid` int NOT NULL AUTO_INCREMENT,
  `CPUname` varchar(100) NOT NULL,
  `coreNumber` int NOT NULL,
  `minFrequency` double unsigned NOT NULL,
  `maxFrequency` double unsigned NOT NULL,
  PRIMARY KEY (`CPUid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cpu`
--

LOCK TABLES `cpu` WRITE;
/*!40000 ALTER TABLE `cpu` DISABLE KEYS */;
/*!40000 ALTER TABLE `cpu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitor`
--

DROP TABLE IF EXISTS `monitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitor` (
  `time` datetime NOT NULL,
  `computerID` int NOT NULL,
  `RAMusage` double unsigned NOT NULL,
  `nbThreads` int NOT NULL,
  `nbProcesses` int NOT NULL,
  `GPUtemp` double NOT NULL,
  `CPUfreq` double unsigned NOT NULL,
  `VRAMusage` double unsigned NOT NULL,
  `electricalConsumption` double NOT NULL,
  PRIMARY KEY (`time`,`computerID`),
  KEY `fk_monitor_computer_computerid` (`computerID`),
  CONSTRAINT `fk_monitor_computer_computerid` FOREIGN KEY (`computerID`) REFERENCES `computer` (`computerID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitor`
--

LOCK TABLES `monitor` WRITE;
/*!40000 ALTER TABLE `monitor` DISABLE KEYS */;
/*!40000 ALTER TABLE `monitor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-16 15:37:28