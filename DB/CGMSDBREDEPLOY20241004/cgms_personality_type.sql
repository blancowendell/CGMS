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
-- Table structure for table `personality_type`
--

DROP TABLE IF EXISTS `personality_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personality_type` (
  `pt_type_id` int NOT NULL AUTO_INCREMENT,
  `pt_school_id` int NOT NULL,
  `pt_code` varchar(50) NOT NULL,
  `pt_description` longtext NOT NULL,
  `pt_strands_id` json NOT NULL,
  `pt_create_date` datetime DEFAULT NULL,
  `pt_create_by` varchar(50) NOT NULL,
  PRIMARY KEY (`pt_type_id`),
  KEY `pt_school_id` (`pt_school_id`),
  CONSTRAINT `personality_type_ibfk_1` FOREIGN KEY (`pt_school_id`) REFERENCES `school` (`s_school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personality_type`
--

LOCK TABLES `personality_type` WRITE;
/*!40000 ALTER TABLE `personality_type` DISABLE KEYS */;
INSERT INTO `personality_type` VALUES (1,1,'INTP','ASDASDASDASDASDASDAS','[\"1\", \"2\"]','2024-09-13 04:20:00','Tanggol Dimaguiba'),(2,1,'STFU','ASDASDASDASDASDAS','[\"1\", \"2\"]','2024-09-13 04:22:00','Tanggol Dimaguiba'),(3,1,'INTJ','                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample                        sample','[\"1\", \"2\", \"3\"]','2024-09-17 15:20:00','Tanggol Dimaguiba'),(4,1,'TG','                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA                        Sample AA','[\"1\"]','2024-09-21 17:42:00','Tanggol Dimaguiba');
/*!40000 ALTER TABLE `personality_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-04 16:25:30
