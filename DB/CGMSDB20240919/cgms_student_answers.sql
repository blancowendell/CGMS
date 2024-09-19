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
-- Table structure for table `student_answers`
--

DROP TABLE IF EXISTS `student_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_answers` (
  `sa_answer_id` int NOT NULL AUTO_INCREMENT,
  `sa_student_id` int NOT NULL,
  `sa_question_id` int NOT NULL,
  `sa_answer_text` text,
  `sa_strand_id` int DEFAULT NULL,
  `sa_school_id` int NOT NULL,
  `sa_choice` int NOT NULL,
  PRIMARY KEY (`sa_answer_id`),
  KEY `sa_question_id` (`sa_question_id`),
  KEY `sa_school_id` (`sa_school_id`),
  KEY `sa_choice` (`sa_choice`),
  KEY `student_answers_ibfk_2` (`sa_strand_id`),
  KEY `student_answers_ibfk_4_idx` (`sa_student_id`),
  CONSTRAINT `student_answers_ibfk_1` FOREIGN KEY (`sa_question_id`) REFERENCES `questions` (`q_question_id`),
  CONSTRAINT `student_answers_ibfk_2` FOREIGN KEY (`sa_strand_id`) REFERENCES `academic_strands` (`as_id`),
  CONSTRAINT `student_answers_ibfk_3` FOREIGN KEY (`sa_school_id`) REFERENCES `school` (`s_school_id`),
  CONSTRAINT `student_answers_ibfk_4` FOREIGN KEY (`sa_choice`) REFERENCES `master_choices` (`mc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_answers`
--

LOCK TABLES `student_answers` WRITE;
/*!40000 ALTER TABLE `student_answers` DISABLE KEYS */;
INSERT INTO `student_answers` VALUES (6,3,4,'Sa bahay lang',NULL,1,4),(7,3,5,'Alone',NULL,1,5),(8,3,6,'With others',NULL,1,8);
/*!40000 ALTER TABLE `student_answers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-19 22:46:25
