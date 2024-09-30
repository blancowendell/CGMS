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
-- Table structure for table `master_choices`
--

DROP TABLE IF EXISTS `master_choices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_choices` (
  `mc_id` int NOT NULL AUTO_INCREMENT,
  `mc_name` varchar(100) NOT NULL,
  `mc_choice_type` varchar(10) DEFAULT NULL,
  `mc_personality_id` int NOT NULL,
  `mc_question_id` int NOT NULL,
  `mc_create_by` varchar(100) NOT NULL,
  `mc_create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`mc_id`),
  KEY `mc_personality_id` (`mc_personality_id`),
  KEY `master_choices_ibfk_2_idx` (`mc_question_id`),
  CONSTRAINT `master_choices_ibfk_1` FOREIGN KEY (`mc_personality_id`) REFERENCES `personality_type` (`pt_type_id`),
  CONSTRAINT `master_choices_ibfk_2` FOREIGN KEY (`mc_question_id`) REFERENCES `questions` (`q_question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_choices`
--

LOCK TABLES `master_choices` WRITE;
/*!40000 ALTER TABLE `master_choices` DISABLE KEYS */;
INSERT INTO `master_choices` VALUES (3,'Mag lulu na lang ako','no',1,4,'Tanggol Dimaguiba','2024-09-17 09:54:00'),(4,'Sa bahay lang','yes',2,4,'Tanggol Dimaguiba','2024-09-17 09:54:00'),(5,'Alone  ','no',3,5,'Tanggol Dimaguiba','2024-09-17 11:00:00'),(6,'Alone  ','yes',1,5,'Tanggol Dimaguiba','2024-09-17 11:00:00'),(7,'Alone  ','yes',1,6,'Tanggol Dimaguiba','2024-09-17 17:38:00'),(8,'With others','no',2,6,'Tanggol Dimaguiba','2024-09-17 17:38:00'),(9,'Oo','yes',4,7,'Tanggol Dimaguiba','2024-09-21 17:45:00'),(10,'Ayaw','no',1,7,'Tanggol Dimaguiba','2024-09-21 17:45:00');
/*!40000 ALTER TABLE `master_choices` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-30 16:25:33
