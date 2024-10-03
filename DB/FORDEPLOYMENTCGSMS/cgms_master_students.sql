-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cgms
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `master_students`
--

DROP TABLE IF EXISTS `master_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_students` (
  `ms_studentid` int NOT NULL AUTO_INCREMENT,
  `ms_firstname` varchar(50) NOT NULL,
  `ms_lastname` varchar(50) NOT NULL,
  `ms_middlename` varchar(50) NOT NULL,
  `ms_email` varchar(100) NOT NULL,
  `ms_school_id` int NOT NULL,
  `ms_username` varchar(300) NOT NULL,
  `ms_password` longtext NOT NULL,
  `ms_access_id` int DEFAULT NULL,
  PRIMARY KEY (`ms_studentid`),
  KEY `ms_school_id` (`ms_school_id`),
  KEY `fk_ms_access_id` (`ms_access_id`),
  CONSTRAINT `fk_ms_access_id` FOREIGN KEY (`ms_access_id`) REFERENCES `master_access` (`ma_accessid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `master_students_ibfk_1` FOREIGN KEY (`ms_school_id`) REFERENCES `school` (`s_school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_students`
--

LOCK TABLES `master_students` WRITE;
/*!40000 ALTER TABLE `master_students` DISABLE KEYS */;
INSERT INTO `master_students` VALUES (3,'Wendell','Blanco','L','markanasarias6@gmail.com',1,'wblanco','542cd7af7e9c771697005ed48d97b1ac',2),(4,'Mark','Anasarias','D','wdblanco.spcpc@gmail.com',1,'marka','542cd7af7e9c771697005ed48d97b1ac',2),(5,'Jover Brylle ','Edem','De Vera','joverbrylleedem.spcpc@gmail.com',1,'Pogi123','53cab390b44c85cbd3611b866086e1dc',2);
/*!40000 ALTER TABLE `master_students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-03 16:29:03
