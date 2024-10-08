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
-- Table structure for table `academic_strands`
--

DROP TABLE IF EXISTS `academic_strands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_strands` (
  `as_id` int NOT NULL AUTO_INCREMENT,
  `as_strands_type` int NOT NULL,
  `as_school_id` int NOT NULL,
  `as_name` varchar(50) NOT NULL,
  `as_course_description` text NOT NULL,
  `as_job_description` text NOT NULL,
  `as_create_by` varchar(50) NOT NULL,
  `as_create_date` date DEFAULT NULL,
  PRIMARY KEY (`as_id`),
  KEY `as_strands_type` (`as_strands_type`),
  KEY `as_school_id` (`as_school_id`),
  CONSTRAINT `academic_strands_ibfk_1` FOREIGN KEY (`as_strands_type`) REFERENCES `strands_type` (`st_id`),
  CONSTRAINT `academic_strands_ibfk_2` FOREIGN KEY (`as_school_id`) REFERENCES `school` (`s_school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_strands`
--

LOCK TABLES `academic_strands` WRITE;
/*!40000 ALTER TABLE `academic_strands` DISABLE KEYS */;
INSERT INTO `academic_strands` VALUES (1,1,1,'ICT','Pindot Pindot Lang','Bantay Com Shop','Tanggol Dimaguiba','2024-09-13'),(2,1,1,'ABM','Luto','Mag Lulu','Tanggol Dimaguiba','2024-09-13'),(3,2,1,'HE','sample','sample','Tanggol Dimaguiba','2024-09-13'),(4,1,1,'GAS','sample','sample','Tanggol Dimaguiba','2024-09-18'),(5,1,1,'HUMMS','SAMPLE','SAMPLE','Tanggol Dimaguiba','2024-09-18');
/*!40000 ALTER TABLE `academic_strands` ENABLE KEYS */;
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
