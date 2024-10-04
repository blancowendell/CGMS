-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: cgms
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `assessments`
--

DROP TABLE IF EXISTS `assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessments` (
  `a_assessment_id` int NOT NULL AUTO_INCREMENT,
  `a_assessment_name` varchar(100) DEFAULT NULL,
  `a_assessment_description` text,
  `a_assessment_type` varchar(50) DEFAULT NULL,
  `a_created_by` varchar(50) DEFAULT NULL,
  `a_created_date` datetime DEFAULT NULL,
  `a_school_id` int NOT NULL,
  PRIMARY KEY (`a_assessment_id`),
  KEY `a_school_id` (`a_school_id`),
  CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`a_school_id`) REFERENCES `school` (`s_school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessments`
--

LOCK TABLES `assessments` WRITE;
/*!40000 ALTER TABLE `assessments` DISABLE KEYS */;
INSERT INTO `assessments` VALUES (1,'Personality Test','school_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_idschool_id','Personality Test','Tanggol Dimaguiba','2024-09-13 04:16:00',1),(2,'Know Your Skill','                        sample sample sapmp','Skill Assessment','Tanggol Dimaguiba','2024-09-13 19:35:00',1),(3,'Interest Assessment','                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample','Interest Assessment','Tanggol Dimaguiba','2024-09-21 17:38:00',1);
/*!40000 ALTER TABLE `assessments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-04 21:19:53
