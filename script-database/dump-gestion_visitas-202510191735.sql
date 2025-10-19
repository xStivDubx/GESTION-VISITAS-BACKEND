-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: seminario-gestion-visitas.c9u8i4gskogd.us-east-2.rds.amazonaws.com    Database: gestion_visitas
-- ------------------------------------------------------
-- Server version	8.0.42

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `ADM_PERMISSION`
--

DROP TABLE IF EXISTS `ADM_PERMISSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADM_PERMISSION` (
  `PERMISSION_ID` int NOT NULL COMMENT 'Identificador único del permiso',
  `NAME` varchar(100) NOT NULL COMMENT 'Nombre del permiso',
  `DESCRIPTION` varchar(255) DEFAULT NULL COMMENT 'Descripción del permiso',
  `STATE` tinyint DEFAULT '1' COMMENT 'Estado del permiso (1=Activo, 0=Inactivo)',
  `CODE` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Codigo unico del permiso, utilizado en el backend',
  `ICON` varchar(100) DEFAULT NULL COMMENT 'Ícono asociado al permiso',
  `ROUTE_FRONT` varchar(200) DEFAULT NULL COMMENT 'Ruta de frontend asociada al permiso',
  `LAST_UPDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última fecha de actualización',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`PERMISSION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Catálogo de permisos del sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADM_PERMISSION`
--

LOCK TABLES `ADM_PERMISSION` WRITE;
/*!40000 ALTER TABLE `ADM_PERMISSION` DISABLE KEYS */;
INSERT INTO `ADM_PERMISSION` VALUES (1,'Usuarios','Modulo de usuarios',1,'/user','fas fa-user','accesos/usuarios','2025-10-04 16:41:06','2025-09-21 22:37:10'),(2,'Roles','Modulo de roles',1,'/role','fas fa-user-shield','accesos/roles','2025-10-04 16:41:07','2025-09-21 22:38:17'),(3,'Clientes','Modulo de clientes',1,'/client','fas fa-address-book','administracion/clientes','2025-10-05 04:55:00','2025-09-28 15:19:25'),(4,'Visitas Tecnias','Modulo para gestionar las visitas tecnicas',1,'/technical-visit','fas fa-clipboard-list','operaciones/visitas','2025-10-14 02:37:52','2025-09-28 22:27:03'),(5,'configurar visitas','permiso de api para crear y configurar visitas tecnicas \r\n- lo debe de tener un supervisor y administrador',1,'/config-visit',NULL,NULL,'2025-10-01 03:37:51','2025-09-29 03:54:20'),(6,'mostrar visitas general','funcion para mostrar todas las visitas tecnicas de manera general\r\n- este permiso debe de utilizarlo el administrador',1,'show-visit-gen',NULL,NULL,'2025-10-01 03:37:22','2025-10-01 03:11:08'),(7,'mostrar visitas asignadas tecnico','funcion para mostrar las visitas tecnicas que tiene asignadas un tecnico\r\n- este permiso debe de ser utilizado por un tecnico',1,'show-visit-tec',NULL,NULL,'2025-10-01 03:37:22','2025-10-01 03:12:09'),(8,'mostrar visitas tecnicas que tiene un supervisor','funcion para mostrar las visitas tecnicas que creo un supervisor\r\n- este permiso lo tiene que tener un supervisor',1,'show-visit-sup',NULL,NULL,'2025-10-01 03:37:22','2025-10-01 03:14:03'),(9,'Configuraciones','Modulo de Configuraciones',1,'/configuration','fas fa-cogs','administracion/parametros','2025-10-05 02:57:58','2025-10-02 06:23:00'),(10,'asignar tecnicos','permiso para mostrar el botón de asignar tecnicos',1,'assign-tech',NULL,NULL,'2025-10-04 23:14:44','2025-10-04 23:14:44'),(11,'operaciones tecnico','permisos para mostrar los botones de checkin, checkout y navegación',1,'operation-tech',NULL,NULL,'2025-10-14 02:39:35','2025-10-14 02:39:35'),(12,'Descargar Reportes','Permiso para generar y descargar reportes de los modulos principales',1,'/report',NULL,NULL,'2025-10-18 17:47:15','2025-10-18 17:47:15'),(13,'Graficas Administrador','Graficas que se mostraran a un administrador',1,'/graph-admin',NULL,NULL,'2025-10-19 00:27:03','2025-10-19 00:21:10'),(14,'Graficas Supervisor','Graficas que se mostraran a los supervisores',1,'/graph-supervisor',NULL,NULL,'2025-10-19 00:27:03','2025-10-19 00:21:36'),(15,'Graficas Tecnico','Graficas que se mostraran a los tecnicos',1,'/graph-tech',NULL,NULL,'2025-10-19 00:27:04','2025-10-19 00:21:56');
/*!40000 ALTER TABLE `ADM_PERMISSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ADM_ROLE`
--

DROP TABLE IF EXISTS `ADM_ROLE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADM_ROLE` (
  `ROLE_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del rol',
  `NAME` varchar(100) NOT NULL COMMENT 'Nombre del rol',
  `DESCRIPTION` varchar(255) DEFAULT NULL COMMENT 'Descripción del rol',
  `UPDATE_USER` int NOT NULL COMMENT 'ULTIMO USUARIO QUE REALIZO LA ACTUALIZACION',
  `STATE` tinyint DEFAULT '1' COMMENT 'Estado del rol (1=Activo, 0=Inactivo)',
  `LAST_UPDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última fecha de actualización',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`ROLE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Catálogo de roles del sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADM_ROLE`
--

LOCK TABLES `ADM_ROLE` WRITE;
/*!40000 ALTER TABLE `ADM_ROLE` DISABLE KEYS */;
INSERT INTO `ADM_ROLE` VALUES (1,'Administrador','tiene todos los permisos',0,1,'2025-09-21 17:36:54','2025-09-21 17:36:54'),(2,'Supervisor','Persona encargada de gestionar las visitas tecnicas y los tecnicos',0,1,'2025-09-27 21:05:11','2025-09-27 21:05:11'),(3,'Tecnico','Persona encargarda de realizar las visitas tecnicas',0,1,'2025-09-27 21:05:29','2025-09-27 21:05:29'),(4,'prueba2','probando',1,0,'2025-09-28 01:03:21','2025-09-28 00:19:47'),(5,'prueba','probando',1,1,'2025-09-28 01:08:51','2025-09-28 01:08:51'),(6,'prueba2-origin','esto es una prueba origin',1,0,'2025-10-14 03:31:03','2025-10-05 01:18:31'),(7,'prueba 43-cambio','prueba-cambio',1,0,'2025-10-05 02:03:26','2025-10-05 02:00:40'),(8,'prueba 123','prueba - cambio',1,0,'2025-10-14 03:31:00','2025-10-05 02:45:02'),(9,'nnnaasdf','nnnasdfas',1,0,'2025-10-05 02:46:30','2025-10-05 02:45:58');
/*!40000 ALTER TABLE `ADM_ROLE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ADM_ROLE_PERMISSION`
--

DROP TABLE IF EXISTS `ADM_ROLE_PERMISSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADM_ROLE_PERMISSION` (
  `ROLE_PERMISSION_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la relación rol-permiso',
  `ROLE_ID` int NOT NULL COMMENT 'Identificador del rol',
  `PERMISSION_ID` int NOT NULL COMMENT 'Identificador del permiso',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`ROLE_PERMISSION_ID`),
  KEY `ROLE_ID` (`ROLE_ID`),
  KEY `PERMISSION_ID` (`PERMISSION_ID`),
  CONSTRAINT `ADM_ROLE_PERMISSION_ibfk_1` FOREIGN KEY (`ROLE_ID`) REFERENCES `ADM_ROLE` (`ROLE_ID`),
  CONSTRAINT `ADM_ROLE_PERMISSION_ibfk_2` FOREIGN KEY (`PERMISSION_ID`) REFERENCES `ADM_PERMISSION` (`PERMISSION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Relación de roles con permisos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADM_ROLE_PERMISSION`
--

LOCK TABLES `ADM_ROLE_PERMISSION` WRITE;
/*!40000 ALTER TABLE `ADM_ROLE_PERMISSION` DISABLE KEYS */;
INSERT INTO `ADM_ROLE_PERMISSION` VALUES (8,1,2,'2025-09-25 04:53:40'),(9,1,1,'2025-09-28 00:53:13'),(10,5,1,'2025-09-28 01:09:10'),(11,1,3,'2025-09-28 15:21:04'),(12,1,4,'2025-09-28 22:27:54'),(13,1,5,'2025-09-29 03:54:40'),(14,1,6,'2025-10-01 03:20:05'),(15,1,9,'2025-10-02 06:23:22'),(16,2,10,'2025-10-04 23:15:22'),(17,6,2,'2025-10-05 02:33:56'),(18,5,3,'2025-10-05 02:34:06'),(19,5,4,'2025-10-05 02:34:07'),(20,5,6,'2025-10-05 02:34:09'),(21,6,10,'2025-10-05 02:34:29'),(25,8,5,'2025-10-05 02:45:48'),(27,9,6,'2025-10-05 02:46:20'),(28,3,4,'2025-10-07 04:18:17'),(29,3,7,'2025-10-07 04:18:25'),(30,2,3,'2025-10-14 03:31:12'),(31,2,5,'2025-10-14 03:31:16'),(32,2,8,'2025-10-14 03:31:31'),(33,2,4,'2025-10-14 03:31:42'),(34,3,11,'2025-10-14 03:32:15'),(35,1,12,'2025-10-18 17:47:29'),(36,2,12,'2025-10-18 17:47:43'),(37,1,13,'2025-10-19 00:30:23'),(38,2,14,'2025-10-19 03:07:38'),(39,3,15,'2025-10-19 04:28:49');
/*!40000 ALTER TABLE `ADM_ROLE_PERMISSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ADM_SUPERVISOR_TECHNICIAN`
--

DROP TABLE IF EXISTS `ADM_SUPERVISOR_TECHNICIAN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADM_SUPERVISOR_TECHNICIAN` (
  `SUPERVISOR_TECHNICIAN_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la relación supervisor-técnico',
  `SUPERVISOR_ID` int NOT NULL COMMENT 'Identificador del usuario supervisor',
  `TECHNICIAN_ID` int NOT NULL COMMENT 'Identificador del usuario técnico',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`SUPERVISOR_TECHNICIAN_ID`),
  KEY `SUPERVISOR_ID` (`SUPERVISOR_ID`),
  KEY `TECHNICIAN_ID` (`TECHNICIAN_ID`),
  CONSTRAINT `ADM_SUPERVISOR_TECHNICIAN_ibfk_1` FOREIGN KEY (`SUPERVISOR_ID`) REFERENCES `ADM_USER` (`USER_ID`),
  CONSTRAINT `ADM_SUPERVISOR_TECHNICIAN_ibfk_2` FOREIGN KEY (`TECHNICIAN_ID`) REFERENCES `ADM_USER` (`USER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Relación de supervisores con técnicos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADM_SUPERVISOR_TECHNICIAN`
--

LOCK TABLES `ADM_SUPERVISOR_TECHNICIAN` WRITE;
/*!40000 ALTER TABLE `ADM_SUPERVISOR_TECHNICIAN` DISABLE KEYS */;
INSERT INTO `ADM_SUPERVISOR_TECHNICIAN` VALUES (5,21,18,'2025-09-27 23:35:11'),(7,25,23,'2025-10-05 00:45:26'),(8,17,7,'2025-10-05 00:45:38'),(10,17,20,'2025-10-05 00:54:46'),(11,25,22,'2025-10-05 02:45:34'),(12,19,18,'2025-10-12 03:59:52'),(13,19,22,'2025-10-12 03:59:55');
/*!40000 ALTER TABLE `ADM_SUPERVISOR_TECHNICIAN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ADM_USER`
--

DROP TABLE IF EXISTS `ADM_USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADM_USER` (
  `USER_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario',
  `NAME` varchar(100) NOT NULL COMMENT 'Nombre del usuario',
  `LASTNAME` varchar(100) DEFAULT NULL COMMENT 'Apellido del usuario',
  `PHONE` varchar(20) DEFAULT NULL COMMENT 'Número de teléfono del usuario',
  `EMAIL` varchar(100) DEFAULT NULL COMMENT 'Correo electrónico del usuario',
  `USERNAME` varchar(100) DEFAULT NULL COMMENT 'Nombre de usuario para login',
  `PASSWORD` varchar(500) NOT NULL COMMENT 'Contraseña encriptada',
  `ROLE_ID` int NOT NULL COMMENT 'Identificador del rol asociado',
  `STATE` tinyint DEFAULT '2' COMMENT 'Estado del usuario (0=Inactivo, 1=Activo,  2 =Cambiar password)',
  `UPDATE_USER` int DEFAULT NULL COMMENT 'ultimo usuario que lo modifico',
  `LAST_UPDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última fecha de actualización',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`USER_ID`),
  KEY `ROLE_ID` (`ROLE_ID`),
  CONSTRAINT `ADM_USER_ibfk_1` FOREIGN KEY (`ROLE_ID`) REFERENCES `ADM_ROLE` (`ROLE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Usuarios del sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADM_USER`
--

LOCK TABLES `ADM_USER` WRITE;
/*!40000 ALTER TABLE `ADM_USER` DISABLE KEYS */;
INSERT INTO `ADM_USER` VALUES (1,'julio estiven','dubon morales','59855967','jdubonm2@miumg.edu.gt','jdubonm2','$2b$10$BWwc0Vj20T0/4YLO/9J7MOUd7dB4DIqzuY3JLaafvFUyuXZe2a93i',1,1,NULL,'2025-09-27 05:44:53','2025-09-21 17:37:59'),(7,'tecnico','morales','12345678','estivendubon123@gmail.com','estiven123','$2b$10$PJgK8gju4OyOqngMNqwtZe8I24agn1aNiWWQ5PUGAOQx3yZWAmUvy',3,1,1,'2025-10-14 03:30:30','2025-09-27 05:44:10'),(8,'admin jejeje','admin','12345678','admin@gmail.com','admin.jejeje','$2b$10$WyrdMmC47s7hUALI4ZSREOISvpSDGQd4QseAn36LDGwWiJ5cOWWHS',1,2,1,'2025-10-04 22:05:32','2025-09-27 16:45:06'),(17,'supervisor','dub','12345678','stivdub01@gmail.com','stivdub01','$2b$10$kiuKZGAxeKapZW5dwp/zc.xIz8h8Bqh6OFsjy3B0NeXQ8kPt9fUmy',2,1,1,'2025-10-14 03:29:21','2025-09-27 19:12:01'),(18,'triplex','triplex','12345678','triplex@mail.com','x1111','a',3,2,1,'2025-10-04 21:38:17','2025-09-27 21:42:52'),(19,'muchosdos','muchosdos','33223344','muchosdos@mail.com','muchosdos','a',2,2,1,'2025-10-04 21:40:03','2025-09-27 21:43:06'),(20,'testuser','triplex','11002200','testuser@mail.com','x3333','a',3,2,1,'2025-10-04 21:41:11','2025-09-27 21:43:18'),(21,'triplea','triplea','22332233','triplea@mail.com','triple.a','a',2,0,1,'2025-10-04 22:09:58','2025-09-27 21:43:29'),(22,'doble a','doblb','77885588','doiblkea@mail.com','doiblkea','a',3,2,1,'2025-10-04 21:40:35','2025-09-27 21:44:18'),(23,'user cambio','test','12345678','user.test@mail.com','user.test','$2b$10$wvBMxn6n4vAwE4Sny7MWvuXBk5E/HBGIG9gJojmBpJjbzqG/F4VQy',3,2,1,'2025-10-04 21:37:17','2025-10-04 20:39:31'),(24,'usertest','test','12345678','user.test2@mail.com','user.test2','$2b$10$P36mFFS3plng6X1lFGaGSuO5PvOWrQgF0gXcVQGiYy4no01bohhmy',3,0,1,'2025-10-04 22:46:18','2025-10-04 20:46:05'),(25,'user cuatrosss','cuatro cuatro','33552233','usercuatro@mail.com','user.cuatro','$2b$10$czPv6s9U47/hTv07h0/gVeTt2KzdFlGtJC1cy6CwNJbYp.Gk1nyMO',2,0,1,'2025-10-07 03:38:33','2025-10-04 22:10:46'),(26,'tecnico test asig','test','44455667','testtest@mail.com','testtest','$2b$10$yDxYa6/N1SZUcAjgoTNXX.eISLcTY5o1.IkfMaZm46xe0Xwjs3GwS',3,2,1,'2025-10-18 19:43:13','2025-10-18 19:43:13');
/*!40000 ALTER TABLE `ADM_USER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CAT_CLIENT`
--

DROP TABLE IF EXISTS `CAT_CLIENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CAT_CLIENT` (
  `CLIENT_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del cliente',
  `NAME` varchar(150) NOT NULL COMMENT 'Nombre del cliente',
  `CONTACT_NAME` varchar(150) DEFAULT NULL COMMENT 'Nombre de la persona de contacto',
  `EMAIL` varchar(150) DEFAULT NULL COMMENT 'Correo electrónico del cliente',
  `PHONE` varchar(20) DEFAULT NULL COMMENT 'Teléfono del cliente',
  `STATE` tinyint DEFAULT '1' COMMENT 'Estado del cliente (1=Activo, 0=Inactivo)',
  `UPDATE_USER` int DEFAULT NULL COMMENT 'ULTIMO USUARIO QUE ACTUALIZO',
  `LAST_UPDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última fecha de actualización',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`CLIENT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Catálogo de clientes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CAT_CLIENT`
--

LOCK TABLES `CAT_CLIENT` WRITE;
/*!40000 ALTER TABLE `CAT_CLIENT` DISABLE KEYS */;
INSERT INTO `CAT_CLIENT` VALUES (1,'empresa 123','test test','estivendubon123@gmail.com','12345678',1,NULL,'2025-10-01 05:15:48','2025-09-28 15:07:29'),(2,'test2-111','contacto1','empresa@empresa.com','12345678',0,1,'2025-09-28 16:40:06','2025-09-28 16:10:44'),(3,'test2','contacto1','empresa@empresa.com','12345678',0,1,'2025-09-28 16:40:29','2025-09-28 16:40:12'),(4,'test2','contacto1','empresa@empresa.com','12345678',1,1,'2025-09-28 16:40:36','2025-09-28 16:40:36'),(5,'test3','contacto1','empresa@empresa.com','12345678',1,1,'2025-09-28 16:59:11','2025-09-28 16:59:11'),(6,'test4','contacto1','empresa@empresa.com','12345678',1,1,'2025-10-05 05:09:40','2025-10-05 05:09:40'),(7,'test5update','contacto1','empresa@empresa.com','12345677',0,1,'2025-10-05 14:13:24','2025-10-05 05:29:25'),(8,'testcambio','testtest','test@mail.com','12345678',0,1,'2025-10-05 05:54:41','2025-10-05 05:31:50'),(9,'test6','testtestcamb','test@mail.com','12345678',0,1,'2025-10-05 05:54:16','2025-10-05 05:32:34');
/*!40000 ALTER TABLE `CAT_CLIENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CAT_CLIENT_SITE`
--

DROP TABLE IF EXISTS `CAT_CLIENT_SITE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CAT_CLIENT_SITE` (
  `SITE_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del sitio del cliente',
  `CLIENT_ID` int NOT NULL COMMENT 'Identificador del cliente asociado',
  `SITE_NAME` varchar(150) NOT NULL COMMENT 'Nombre del sitio',
  `DEPARTMENT` varchar(100) DEFAULT NULL COMMENT 'Departamento donde se ubica el sitio',
  `MUNICIPALITY` varchar(100) DEFAULT NULL COMMENT 'Municipio donde se ubica el sitio',
  `ADDRESS` varchar(255) DEFAULT NULL COMMENT 'Dirección del sitio',
  `LATITUDE` decimal(10,6) DEFAULT NULL COMMENT 'Latitud de la ubicación',
  `LONGITUDE` decimal(10,6) DEFAULT NULL COMMENT 'Longitud de la ubicación',
  `STATE` tinyint DEFAULT '1' COMMENT 'Estado del sitio (1=Activo, 0=Inactivo)',
  `UPDATE_USER` int DEFAULT NULL COMMENT 'ULTIMO USUARIO QUE ACTUALIZO LA SEDE',
  `LAST_UPDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última fecha de actualización',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`SITE_ID`),
  KEY `CLIENT_ID` (`CLIENT_ID`),
  CONSTRAINT `CAT_CLIENT_SITE_ibfk_1` FOREIGN KEY (`CLIENT_ID`) REFERENCES `CAT_CLIENT` (`CLIENT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Catálogo de sitios de clientes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CAT_CLIENT_SITE`
--

LOCK TABLES `CAT_CLIENT_SITE` WRITE;
/*!40000 ALTER TABLE `CAT_CLIENT_SITE` DISABLE KEYS */;
INSERT INTO `CAT_CLIENT_SITE` VALUES (1,1,'sede villa nueva','guatemala','villa nueva','fuentes del valle 2',14.525889,-90.566078,1,1,'2025-09-28 20:38:40','2025-09-28 18:27:28'),(2,1,'sede ciudad','guatemala','guatemala','zona 1 17 calle',14.525889,-90.566078,0,1,'2025-09-28 20:45:57','2025-09-28 20:39:28'),(3,1,'sede ciudad','guatemala','guatemala','zona 1 17 calle',14.525889,-90.566078,0,1,'2025-09-28 21:06:18','2025-09-28 20:46:16'),(4,1,'sede ciudad','guatemala','guatemala','zona 1 17 calle',14.524015,-90.553385,1,1,'2025-10-06 03:03:17','2025-09-28 21:06:21'),(5,1,'prueba','guatemala','guatemala','guatemala',1.231230,1.231230,1,1,'2025-10-05 18:17:30','2025-10-05 18:17:30'),(6,1,'prueba2','guatemala','guatemala','guatemala',1.234324,3.423424,1,1,'2025-10-05 18:18:00','2025-10-05 18:18:00'),(7,5,'prueba','guatemala','guatemala','guatemala',2.423423,2.423400,1,1,'2025-10-05 18:18:32','2025-10-05 18:18:32'),(8,5,'test','test3','test2','test fuentes 2',2.333330,1.444500,0,1,'2025-10-05 18:54:33','2025-10-05 18:44:35'),(9,5,'test','guatemala','guatemala','municipalidad de guatemala',14.626977,-90.515089,1,1,'2025-10-12 17:46:47','2025-10-05 18:54:51'),(10,6,'test2','guatemala','guatemala','claro central',14.640940,-90.506013,1,1,'2025-10-11 04:28:14','2025-10-05 18:55:43'),(11,5,'test coordenadas','guatemala','guatemala','iggs de zona 1',14.634938,-90.506798,1,1,'2025-10-12 17:47:17','2025-10-06 01:56:39'),(12,5,'test4','guatemala','villa nueva','municipalidad de villa nueva',14.525696,-90.588785,1,1,'2025-10-12 17:47:37','2025-10-06 02:14:04'),(13,5,'test44','guatemala','san miguel petapa','san miguel petapa',14.506622,-90.554149,1,1,'2025-10-12 17:47:58','2025-10-06 02:15:28'),(14,1,'prueba sede 1','guatemala','guatemala','parque de la industria',14.610007,-90.523683,1,1,'2025-10-06 03:24:14','2025-10-06 03:24:14'),(15,4,'sede central','guatemala','villa nueva','metrocentro',14.514063,-90.577282,1,1,'2025-10-08 03:06:11','2025-10-08 03:06:11'),(16,4,'sede villa nueva','guatemala','villa nueva','el frutal',14.521452,-90.564314,1,1,'2025-10-08 13:39:13','2025-10-08 13:39:13'),(17,6,'sede amatitlan','guatemala','amatitlan','mercado',14.479809,-90.621666,1,1,'2025-10-19 05:02:37','2025-10-19 05:02:22');
/*!40000 ALTER TABLE `CAT_CLIENT_SITE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CFG_CONFIGURATION`
--

DROP TABLE IF EXISTS `CFG_CONFIGURATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CFG_CONFIGURATION` (
  `CONFIG_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la configuración',
  `CODE` varchar(200) NOT NULL COMMENT 'Código de configuración',
  `VALUE` text COMMENT 'Valor de configuración (texto largo)',
  `DESCRIPTION` varchar(500) DEFAULT NULL COMMENT 'Descripción de la configuración',
  `UPDATE_USER` int DEFAULT NULL COMMENT 'ULTIMO USUARIO QUE LO MODIFICO',
  PRIMARY KEY (`CONFIG_ID`),
  UNIQUE KEY `CODE` (`CODE`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Configuraciones generales del sistema';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CFG_CONFIGURATION`
--

LOCK TABLES `CFG_CONFIGURATION` WRITE;
/*!40000 ALTER TABLE `CFG_CONFIGURATION` DISABLE KEYS */;
INSERT INTO `CFG_CONFIGURATION` VALUES (1,'QUERY_USER_GETALL','SELECT \r\n    au.USER_ID AS userId,\r\n    CONCAT(au.NAME, \' \', au.LASTNAME) AS name,\r\n    au.email,\r\n    au.username,\r\n    au.ROLE_ID AS roleId,\r\n    ar.NAME AS roleName,\r\n    CASE \r\n        WHEN EXISTS (\r\n            SELECT 1\r\n            FROM ADM_ROLE_PERMISSION arp\r\n            JOIN ADM_PERMISSION ap \r\n              ON ap.PERMISSION_ID = arp.PERMISSION_ID\r\n            WHERE arp.ROLE_ID = au.ROLE_ID\r\n              AND ap.CODE = \'assign-tech\'\r\n        ) THEN 1\r\n        ELSE 0\r\n    END AS showAssignTech\r\nFROM ADM_USER au\r\nJOIN ADM_ROLE ar \r\n  ON ar.ROLE_ID = au.ROLE_ID\r\nWHERE au.STATE IN (1, 2)','QUERY UTILIZADO PARA LISTAR TODOS LOS USUARIOS ACTIVOS',NULL),(2,'QUERY_USER_GETBYID','SELECT \r\nau.USER_ID as userId,\r\nau.name,\r\nau.lastname ,\r\nau.email ,\r\nau.phone,\r\nau.username,\r\nar.ROLE_ID as roleId ,\r\nar.NAME as roleName\r\nFROM ADM_USER au \r\njoin ADM_ROLE ar ON au.ROLE_ID =ar.ROLE_ID \r\nWHERE au.STATE in (1,2) \r\nand au.USER_ID = ?','QUERY UTILIZADO PARA OBTENER LA INFORMACION DEL USUARIO',NULL),(3,'SEND_MAIL_EMAIL','estivendubon123@gmail.com','CORREO EMISOR, UTILIZADO PARA ENVIAR LAS NOTIFICACIONES DE CORREOS ELECTRONICOS',1),(4,'SEND_MAIL_PASSWORD_APP','egvr linp sejx cokd','CONTRASEÑA DE APLICACION PARA EL CORREO ELECTRONICO',NULL),(5,'MAIL_USER_PASS_SUBJECT','Usuario Creado','titulo del correo para enviar la contraseña de la cuenta creada',NULL),(6,'MAIL_USER_PASS_BODY','<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;\">\r\n  <h2 style=\"color: #2c3e50; text-align: center;\">¡Bienvenido {username}!</h2>\r\n\r\n  <p style=\"font-size: 16px; color: #333;\">\r\n    Tu cuenta en <b>Sistema Gestion Visitas</b> fue creada con éxito. A continuación encontrarás tu información de acceso:\r\n  </p>\r\n\r\n  <p style=\"font-size: 16px; margin: 10px 0;\">\r\n    <b>Usuario:</b> {username}<br/>\r\n    <b>Contraseña temporal:</b> {password}\r\n  </p>\r\n\r\n  <p style=\"font-size: 14px; color: #555;\">\r\n    Te recomendamos cambiar tu contraseña al primer inicio de sesión para mantener tu cuenta segura.\r\n  </p>\r\n\r\n\r\n\r\n  <hr style=\"margin: 20px 0;\"/>\r\n\r\n  <small style=\"color: #999; font-size: 12px; text-align: center; display: block;\">\r\n    No respondas a este correo. <br/> Soporte Sistema Gestion Visitas © 2025\r\n  </small>\r\n</div>\r\n','cuerpo del correo para enviar la contraseña del usuario creado',NULL),(7,'SEND_MAIL_ENDPOINT','https://zczf7o68tc.execute-api.us-east-2.amazonaws.com/Prod/mail/send','endpoint de la lambda para enviar el correo electronico',NULL),(8,'MAIL_USER_RESET_BODY','<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;\">\r\n  <h2 style=\"color: #2c3e50; text-align: center;\">Contraseña reiniciada</h2>\r\n\r\n  <p style=\"font-size: 16px; color: #333;\">\r\n    Tu cuenta en <b>Sistema Gestión Visitas</b> ha sido restablecida correctamente. A continuación encontrarás tu nueva información de acceso:\r\n  </p>\r\n\r\n  <p style=\"font-size: 16px; margin: 10px 0;\">\r\n    <b>Usuario:</b> {username}<br/>\r\n    <b>Nueva contraseña temporal:</b> {password}\r\n  </p>\r\n\r\n  <p style=\"font-size: 14px; color: #555;\">\r\n    Por motivos de seguridad, deberás cambiar esta contraseña temporal al iniciar sesión nuevamente.\r\n  </p>\r\n  \r\n\r\n\r\n  <hr style=\"margin: 20px 0;\"/>\r\n\r\n  <small style=\"color: #999; font-size: 12px; text-align: center; display: block;\">\r\n    Si no solicitaste este reinicio de contraseña, por favor contacta al área de soporte de inmediato.<br/><br/>\r\n    Soporte Sistema Gestión Visitas © 2025\r\n  </small>\r\n</div>\r\n','CUERPO DEL CORREO CUANDO SE REINICIA LA CONTRASEÑA DEL USUARIO',NULL),(10,'MAIL_USER_RESET_SUBJECT','Reinicio de contraseña','titulo del correo cuando se reinicia la contraseña del usuario',NULL),(11,'QUERY_USER_GETALL_TECHNICAL','SELECT \r\n    au.user_id AS userId,\r\n    au.username,\r\n    CONCAT(au.NAME, \' \', au.LASTNAME) AS fullName,\r\n    au.phone,\r\n    au.ROLE_ID AS roleId,\r\n    CASE \r\n        WHEN ast.SUPERVISOR_ID IS NULL \r\n             OR sup.STATE = 0 THEN 1 \r\n        ELSE 0 \r\n    END AS isFree,\r\n    CASE \r\n        WHEN ast.SUPERVISOR_ID = ? THEN 1 \r\n        ELSE 0 \r\n    END AS assignedToCurrent\r\nFROM ADM_USER au\r\nLEFT JOIN ADM_SUPERVISOR_TECHNICIAN ast \r\n       ON ast.TECHNICIAN_ID = au.user_id\r\nLEFT JOIN ADM_USER sup \r\n       ON sup.USER_ID = ast.SUPERVISOR_ID\r\nWHERE au.STATE IN (1,2) \r\n  AND au.ROLE_ID = 3\r\n  AND (\r\n       ast.SUPERVISOR_ID IS NULL      \r\n       OR ast.SUPERVISOR_ID = ?      \r\n       OR sup.STATE = 0               -- el supervisor asignado está inactivo\r\n  )\r\nORDER BY assignedToCurrent DESC, au.NAME','listar tecnicos disponibles a asignar',NULL),(12,'QUERY_ROLE_GETALL','select \r\nar.ROLE_ID as roleId,\r\nar.name,\r\nar.description\r\nfrom ADM_ROLE ar \r\nwhere ar.STATE = 1','consulta para listar todos los roles activos',NULL),(13,'QUERY_ROLE_GETBYID','select \r\nar.ROLE_ID as roleId,\r\nar.name,\r\nar.description\r\nfrom ADM_ROLE ar \r\nwhere ar.STATE = 1 and ar.ROLE_ID = ?','query para listar la informacion del role por id',NULL),(14,'QUERY_ROLE_GET_PERMISSIONS','SELECT \r\n    p.PERMISSION_ID AS permissionId,\r\n    p.NAME AS permissionName,\r\n    p.description,\r\n    -- Booleano: 1 si el rol ya tiene asignado el permiso\r\n    CASE WHEN rp.ROLE_ID IS NOT NULL THEN 1 ELSE 0 END AS assigned\r\nFROM ADM_PERMISSION p\r\nLEFT JOIN ADM_ROLE_PERMISSION rp\r\n       ON rp.PERMISSION_ID = p.PERMISSION_ID\r\n      AND rp.ROLE_ID = ?   \r\nWHERE p.STATE = 1\r\nORDER BY p.name ASC','query utilizado para listar todos los permisos disponibles para asignar al rol',NULL),(15,'QUERY_CLIENT_GETALL','select \r\ncc.CLIENT_ID as clientId,\r\ncc.name,\r\ncc.CONTACT_NAME as contactName,\r\ncc.email,\r\ncc.phone,\r\n(\r\n    SELECT COUNT(*) \r\n    FROM CAT_CLIENT_SITE s\r\n    WHERE s.CLIENT_ID = cc.CLIENT_ID and s.STATE=1\r\n) AS totalSites\r\nfrom CAT_CLIENT cc \r\nwhere cc.STATE = 1','query utilizado para listar todos los clientes activos',NULL),(16,'QUERY_CLIENT_GETBYID','select \r\ncc.CLIENT_ID as clientId,\r\ncc.name,\r\ncc.CONTACT_NAME as contactName,\r\ncc.email,\r\ncc.phone\r\nfrom CAT_CLIENT cc \r\nwhere cc.STATE = 1 and cc.CLIENT_ID = ?','query utilizado para recuperar la informacion del cliente por id',NULL),(17,'QUERY_SITES_BY_CLIENTID','SELECT \r\n	s.CLIENT_ID as clientId,\r\n	cc.NAME as clientName,\r\n    s.SITE_ID as siteId,\r\n    s.SITE_NAME as siteName,\r\n    s.department,\r\n    s.municipality,\r\n    s.address,\r\n    s.latitude,\r\n    s.longitude\r\nFROM CAT_CLIENT_SITE s\r\njoin CAT_CLIENT cc on cc.CLIENT_ID =s.CLIENT_ID \r\nWHERE s.CLIENT_ID = ?   -- aquí colocas el id del cliente\r\n  AND s.STATE = 1','query para listar las sedes activas de un cliente',NULL),(18,'QUERY_SITE_GETBYSITEID','SELECT \r\ns.CLIENT_ID as clientId,\r\n    s.SITE_ID as siteId,\r\n    s.SITE_NAME as siteName,\r\n    s.department,\r\n    s.municipality,\r\n    s.address,\r\n    s.latitude,\r\n    s.longitude\r\nFROM CAT_CLIENT_SITE s\r\nWHERE s.SITE_ID  = ?   \r\n  AND s.STATE = 1','QUERY PARA LISTAR LA SEDE POR SU ID',NULL),(19,'QUERY_VISIT_GETALL','select \r\n	tv.VISIT_ID as visitId,\r\n	tv.name,\r\n	tv.description,\r\n	cc.NAME as clientName,\r\n	ccs.SITE_NAME as siteName,\r\n	au.USERNAME as supervisor,\r\n	au2.USERNAME as technician,\r\n	tv.VISIT_DATE as visitDate,\r\n	cvs.DESCRIPTION as status,\r\n	tv.PLANNED_START_TIME as plannedStart,\r\n	tv.PLANNED_END_TIME as plannedEnd,\r\n	\'1\' as showButtonsConfigs\r\nfrom TRA_VISIT tv \r\njoin CAT_CLIENT_SITE ccs on ccs.SITE_ID = tv.SITE_ID\r\njoin CAT_CLIENT cc on cc.CLIENT_ID = ccs.CLIENT_ID\r\njoin ADM_USER au on au.USER_ID = tv.SUPERVISOR_ID \r\njoin ADM_USER au2 on au2.USER_ID = tv.TECHNICIAN_ID \r\njoin CFG_VISIT_STATUS cvs on cvs.STATUS_ID = tv.STATUS\r\nORDER BY tv.STATUS asc, tv.VISIT_DATE asc, tv.VISIT_ID DESC','QUERY PARA LISTAR TODAS LAS VISITAS TECNICAS QUE HAYAN SIDO CREADAS',NULL),(20,'QUERY_VISIT_GETALL_BY_SUPERVISOR','select \r\n	tv.VISIT_ID as visitId,\r\n	tv.name,\r\n	tv.description,\r\n	cc.NAME as clientName,\r\n	ccs.SITE_NAME as siteName,\r\n	au.USERNAME as supervisor,\r\n	au2.USERNAME as technician,\r\n	tv.VISIT_DATE as visitDate,\r\n	cvs.DESCRIPTION as status,\r\n	tv.PLANNED_START_TIME as plannedStart,\r\n	tv.PLANNED_END_TIME as plannedEnd,\r\n	\'1\' as showButtonsConfigs\r\nfrom TRA_VISIT tv \r\njoin CAT_CLIENT_SITE ccs on ccs.SITE_ID = tv.SITE_ID\r\njoin CAT_CLIENT cc on cc.CLIENT_ID = ccs.CLIENT_ID\r\njoin ADM_USER au on au.USER_ID = tv.SUPERVISOR_ID \r\njoin ADM_USER au2 on au2.USER_ID = tv.TECHNICIAN_ID \r\njoin CFG_VISIT_STATUS cvs on cvs.STATUS_ID = tv.STATUS\r\nwhere tv.SUPERVISOR_ID = ?\r\norder by tv.STATUS asc, tv.VISIT_DATE asc, tv.VISIT_ID DESC','query para listar todas las visitas tecnicas que fueron creadas por el supervisor',NULL),(21,'QUERY_VISIT_GETALL_BY_TECHNICIAN','select \r\n	tv.VISIT_ID as visitId, \r\n	tv.name, tv.description, \r\n	cc.NAME as clientName, \r\n	ccs.SITE_NAME as siteName, \r\n	au.USERNAME as supervisor, \r\n	au2.USERNAME as technician, \r\n	tv.VISIT_DATE as visitDate, \r\n	cvs.DESCRIPTION as status,\r\n	tv.PLANNED_START_TIME as plannedStart,\r\n	tv.PLANNED_END_TIME as plannedEnd, \r\n	\'0\' as showButtonsConfigs \r\nfrom \r\n    TRA_VISIT tv \r\n    join CAT_CLIENT_SITE ccs on ccs.SITE_ID = tv.SITE_ID \r\n    join CAT_CLIENT cc on cc.CLIENT_ID = ccs.CLIENT_ID \r\n    join ADM_USER au on au.USER_ID = tv.SUPERVISOR_ID \r\n    join ADM_USER au2 on au2.USER_ID = tv.TECHNICIAN_ID \r\n    join CFG_VISIT_STATUS cvs on cvs.STATUS_ID = tv.STATUS \r\nwhere \r\ntv.TECHNICIAN_ID = ? \r\nand tv.STATUS in (1,2,3,4,5) \r\nand tv.VISIT_DATE = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))\r\norder by tv.STATUS asc, tv.VISIT_DATE asc, tv.VISIT_ID','query para listar las visitas tecnias activas que tiene asignadas un tecnico',NULL),(22,'QUERY_VISIT_GETBYID','select \r\n	-- datos de la visita\r\n	tv.VISIT_ID as visitId,\r\n	tv.name as visitName,\r\n	tv.description as visitDescription,\r\n	tv.VISIT_DATE as visitDate,\r\n	tv.PLANNED_START_TIME as plannedStart,\r\n	tv.PLANNED_END_TIME as plannedEnd,\r\n	tv.STATUS as statusId,\r\n	cvs.DESCRIPTION as statusDescription,\r\n	tv.COMMENT as visitComment,\r\n	-- datos del cliente\r\n	cc.CLIENT_ID as clientId,\r\n	cc.NAME as clientName,\r\n	cc.CONTACT_NAME as clientContact,\r\n	cc.EMAIL as clientEmail,\r\n	cc.phone as clientPhone,\r\n	-- datos de la sede del cliente\r\n	ccs.SITE_ID as siteId,\r\n	ccs.SITE_NAME as siteName,\r\n	ccs.DEPARTMENT as siteDepartment,\r\n	ccs.MUNICIPALITY as siteMunicipality,\r\n	ccs.ADDRESS as siteAddress,\r\n	ccs.LATITUDE as siteLatitude,\r\n	ccs.LONGITUDE as siteLongitude,\r\n	-- supervisor\r\n	tv.SUPERVISOR_ID as supervisorId,\r\n	au.USERNAME as supervisorUser,\r\n	au.EMAIL as supervisorEmail,\r\n	CONCAT(au.NAME, \' \', au.LASTNAME) AS supervisorName,\r\n	-- tecnico\r\n	tv.TECHNICIAN_ID as technicianId,\r\n	au2.USERNAME as technicianUser,\r\n	CONCAT(au2.NAME, \' \', au2.LASTNAME) AS technicianName,\r\n	-- detalles de la visita\r\n	tvd.CHECKIN_DATETIME as detailCheckinDate,\r\n	tvd.CHECKIN_LATITUDE as detailCheckinLatitude,\r\n	tvd.CHECKIN_LONGITUDE as detailCheckinLongitude,\r\n	tvd.CHECKOUT_DATETIME as detailCheckoutDate,\r\n	tvd.CHECKOUT_LATITUDE as detailCheckoutLatitude,\r\n	tvd.CHECKOUT_LONGITUDE as detailCheckoutLongitude,\r\n	tvd.RESUME as detailResume,\r\n	tvd.MATERIALS_USED as detailMaterialsUsed\r\nfrom TRA_VISIT tv \r\njoin CAT_CLIENT_SITE ccs on ccs.SITE_ID = tv.SITE_ID\r\njoin CAT_CLIENT cc on cc.CLIENT_ID = ccs.CLIENT_ID\r\njoin ADM_USER au on au.USER_ID = tv.SUPERVISOR_ID \r\njoin ADM_USER au2 on au2.USER_ID = tv.TECHNICIAN_ID \r\njoin CFG_VISIT_STATUS cvs on cvs.STATUS_ID = tv.STATUS \r\nleft join TRA_VISIT_DETAIL tvd ON tvd.VISIT_ID  = tv.VISIT_ID \r\nwhere tv.VISIT_ID  = ?','query para listar todo el detalle de la visita tecnica para realizar un seguimiento',NULL),(23,'QUERY_TECHNICIANS_BY_SUPERVISOR','SELECT \r\n    au.USER_ID AS technicianId,\r\n    CONCAT(au.NAME, \' \', au.LASTNAME) AS technicianFullName,\r\n    au.EMAIL AS technicianEmail,\r\n    au.USERNAME AS technicianUsername\r\nFROM ADM_SUPERVISOR_TECHNICIAN ast\r\nJOIN ADM_USER au ON au.USER_ID = ast.TECHNICIAN_ID\r\nWHERE ast.SUPERVISOR_ID = ?\r\n  AND au.STATE IN (1, 2)','query para listar solo los tecnicos que tiene asignado el supervisor - utilizado en el modulo de visitas tecnicas',NULL),(24,'QUERY_VISIT_CLIENTS_ACTIVE','SELECT \r\n	cc.CLIENT_ID as clientId,\r\n	cc.NAME as clientName\r\nFROM CAT_CLIENT cc WHERE cc.STATE = 1','query para listar clientes activos - utilizado al momento de crear una visita tecnica',NULL),(25,'QUERY_VISIT_LOCATIONS_ACTIVE_BY_CLIENT','select \r\n	ccs.SITE_ID as siteId,\r\n	ccs.SITE_NAME  as siteName\r\nfrom \r\n	CAT_CLIENT_SITE ccs \r\nwhere \r\n	ccs.CLIENT_ID = ?\r\n	and ccs.STATE = 1','query para listar las sedes activas del cliente - utilizado al momento de crear una visita tecnica',NULL),(26,'QUERY_VISIT_BY_TECHNICIAN_AND_DATE','SELECT\r\n  tv.VISIT_ID,\r\n  tv.NAME,\r\n  tv.PLANNED_START_TIME,\r\n  tv.PLANNED_END_TIME\r\nFROM TRA_VISIT tv\r\nWHERE tv.TECHNICIAN_ID = ?\r\n  AND tv.VISIT_DATE = DATE(?)                -- misma fecha\r\n  AND tv.STATUS IN (1,2,3)             -- activas\r\n  AND NOT (\r\n        ? <= SUBTIME(tv.PLANNED_START_TIME, \'01:00:00\')   -- newEnd <= start - 1h  (sin conflicto)\r\n     OR ? >= ADDTIME(tv.PLANNED_END_TIME,   \'01:00:00\')   -- newStart >= end + 1h  (sin conflicto)\r\n  )','query para saber si el tecnico seleccionado ya tiene otra visita tecnica en la misma fecha\r\n- esto para que el tecnico solo tenga asignada una visita tecnica por día',NULL),(27,'MAIL_CREATE_VISIT_SUBJECT_CLIENT','Visita Técnica Programada','titulo para el correo a enviar al cliente cuando se programe una visita tecnica',NULL),(28,'MAIL_CREATE_VISIT_BODY_CLIENT','<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;\">\r\n  <h2 style=\"color: #2c3e50; text-align: center;\">Visita técnica programada</h2>\r\n\r\n  <p style=\"font-size: 16px; color: #333;\">\r\n    Estimado(a) <b>{clientName}</b>,<br/>\r\n    Te informamos que se ha programado una visita técnica para tu sede <b>{siteName}</b>.\r\n  </p>\r\n\r\n  <p style=\"font-size: 16px; margin: 10px 0;\">\r\n    <b>Fecha programada:</b> {visitDate}<br/>\r\n    <b>Técnico asignado:</b> {technicianName}<br/>\r\n    <b>Proceso a realizar:</b> {processDescription}\r\n  </p>\r\n\r\n  <p style=\"font-size: 14px; color: #555;\">\r\n    Te pedimos estar atento en la fecha indicada y asegurarte de que se pueda realizar el acceso a las instalaciones para facilitar el trabajo del técnico.\r\n  </p>\r\n\r\n  <hr style=\"margin: 20px 0;\"/>\r\n\r\n  <small style=\"color: #999; font-size: 12px; text-align: center; display: block;\">\r\n    No respondas a este correo. <br/> Soporte Sistema Gestión Visitas © 2025\r\n  </small>\r\n</div>\r\n','CUERPO DEL CORREO PARA NOTIFICAR AL CLIENTE QUE SE HA PROGRAMADO UNA VISITA TECNICA',NULL),(29,'MAIL_UPDATE_VISIT_BODY_CLIENT','<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;\">\r\n  <h2 style=\"color: #2c3e50; text-align: center;\">Actualización de visita técnica</h2>\r\n\r\n  <p style=\"font-size: 16px; color: #333;\">\r\n    Estimado(a) <b>{clientName}</b>,<br/>\r\n    Te informamos que los detalles de tu visita técnica programada para la sede <b>{siteName}</b> han sido actualizados.\r\n  </p>\r\n\r\n  <p style=\"font-size: 16px; margin: 10px 0;\">\r\n    <b>Nueva fecha programada:</b> {visitDate}<br/>\r\n    <b>Técnico asignado:</b> {technicianName}<br/>\r\n    <b>Proceso a realizar:</b> {processDescription}\r\n  </p>\r\n\r\n  <p style=\"font-size: 14px; color: #555;\">\r\n    Por favor toma en cuenta esta actualización y asegúrate de que se pueda realizar el acceso a las instalaciones en la nueva fecha indicada.\r\n  </p>\r\n\r\n\r\n  <hr style=\"margin: 20px 0;\"/>\r\n\r\n  <small style=\"color: #999; font-size: 12px; text-align: center; display: block;\">\r\n    No respondas a este correo. <br/> Soporte Sistema Gestión Visitas © 2025\r\n  </small>\r\n</div>\r\n','cuerpo del correo que se envia al cliente cuando se actualizo una visita tecnica',NULL),(30,'MAIL_UPDATE_VISIT_SUBJECT_CLIENT','Actualización en la Visita tecnica','asunto del correo cuando se actualiza una visita tecnica',NULL),(31,'QUERY_CLIENT_BY_VISIT_ID','select \r\ncc.*,\r\nccs.SITE_NAME\r\nfrom TRA_VISIT tv \r\njoin CAT_CLIENT_SITE ccs on ccs.SITE_ID  = tv.SITE_ID \r\njoin CAT_CLIENT cc on cc.CLIENT_ID =ccs.CLIENT_ID \r\nwhere tv.VISIT_ID = ?','obtener información del cliente por el id de la visita tecnica',NULL),(32,'MAIL_RESUME_VISIT_BODY_CLIENT','<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;\">\r\n  <h2 style=\"color: #2c3e50; text-align: center;\">Reporte de visita técnica</h2>\r\n\r\n  <p style=\"font-size: 16px; color: #333;\">\r\n    Estimado(a) <b>{clientName}</b>,<br/>\r\n    Te compartimos el resumen de la visita técnica realizada en tu sede <b>{siteName}</b>.\r\n  </p>\r\n\r\n  <p style=\"font-size: 16px; margin: 10px 0;\">\r\n    <b>ID de la visita:</b> {visitId}<br/>\r\n    <b>Supervisor encargado:</b> {supervisorName} <br/>\r\n    <b>Técnico encargado:</b> {technicianName}<br/>\r\n    <b>Fecha de la Visita:</b> {dateVisit}\r\n  </p>\r\n\r\n  <p style=\"font-size: 16px; margin: 10px 0;\">\r\n    <b>Resumen del trabajo realizado:</b><br/>\r\n    <span style=\"color:#333;\">{resume}</span>\r\n  </p>\r\n\r\n  <p style=\"font-size: 16px; margin: 10px 0;\">\r\n    <b>Materiales utilizados:</b><br/>\r\n    <span style=\"color:#333;\">{materialsUsed}</span>\r\n  </p>\r\n\r\n  <p style=\"font-size: 14px; color: #555;\">\r\n    Gracias por tu tiempo y confianza. Nuestro equipo de soporte queda a disposición en caso de dudas o inconvenientes adicionales.\r\n  </p>\r\n\r\n  <hr style=\"margin: 20px 0;\"/>\r\n\r\n  <small style=\"color: #999; font-size: 12px; text-align: center; display: block;\">\r\n    No respondas a este correo. <br/> Soporte Sistema Gestión Visitas © 2025\r\n  </small>\r\n</div>\r\n','cuerpo del correo electronico a enviar cuando se realiza la accion de checkout al cliente',NULL),(33,'MAIL_RESUME_VISIT_SUBJECT_CLIENT','Resumen de Visita Tecnica','titulo del correo a enviar al cliente cuando se finaliza una visita tecnica',NULL),(34,'QUERY_MODULS_FRONT','SELECT \r\n    p.NAME,\r\n    p.CODE,\r\n    p.ICON, \r\n    p.ROUTE_FRONT\r\n  FROM ADM_ROLE_PERMISSION rp\r\n  LEFT JOIN ADM_PERMISSION p  ON rp.permission_id = p.permission_id\r\n  WHERE rp.role_id = ? \r\n    AND p.state = 1\r\n    AND p.ROUTE_FRONT IS NOT NULL\r\n  ORDER BY p.name ASC','query para listar los modulos en el frontend',NULL),(35,'test','test3','test3',1),(36,'test2','test2','test2ddd',1),(37,'QUERY_FIND_BY_USER','SELECT \r\n                u.USER_ID       AS userId,\r\n                u.username      AS username,\r\n                u.password      AS password,\r\n                r.ROLE_ID       AS roleId,\r\n                r.name          AS roleName,\r\n                p.PERMISSION_ID AS permissionId,\r\n                p.name          AS permissionName,\r\n                p.icon          AS icon,\r\n                p.code          AS code,\r\n                p.route_front   AS routeFront,\r\n                u.state         AS state\r\n            FROM ADM_USER  u\r\n            LEFT JOIN ADM_ROLE  r \r\n            ON u.role_id = r.role_id\r\n            LEFT JOIN ADM_ROLE_PERMISSION rp \r\n            ON r.role_id = rp.role_id\r\n            LEFT JOIN ADM_PERMISSION  p \r\n            ON rp.permission_id = p.permission_id\r\n            WHERE u.username = ?\r\n            AND u.state IN (1,2)\r\n            AND p.state = 1\r\n            ORDER BY p.name ASC','QUERY PARA LISTAR LA INFORMACION DEL USUARIO POR EL USERNAME',NULL),(38,'QUERY_FIND_USER_BY_ID','SELECT \r\n u.user_id       AS userId,\r\n u.username      AS username,\r\n u.password\r\nFROM ADM_USER u\r\nWHERE u.user_id = ?\r\nAND u.state IN (1,2)','QUERY PARA BUSCAR USUARIO POR ID',NULL),(39,'QUERY_SUPERVISORS_VISIT','SELECT \r\n    s.USER_ID AS supervisorId,\r\n    CONCAT(s.NAME, \' \', s.LASTNAME) AS supervisorName,\r\n    s.USERNAME AS username,\r\n    s.PHONE AS phone,\r\n    COUNT(ast.TECHNICIAN_ID) AS totalTechnicians\r\nFROM ADM_USER s\r\nJOIN ADM_SUPERVISOR_TECHNICIAN ast \r\n    ON ast.SUPERVISOR_ID = s.USER_ID\r\nWHERE s.ROLE_ID = 2              -- 2: Rol de supervisor (ajusta si tu código es distinto)\r\n  AND s.STATE IN (1, 2)          -- Activo o habilitado\r\nGROUP BY s.USER_ID, s.NAME, s.LASTNAME, s.USERNAME, s.PHONE\r\nHAVING COUNT(ast.TECHNICIAN_ID) > 0   -- Solo supervisores con técnicos asignados\r\nORDER BY s.NAME','QUERY UTILIZADO PARA LISTAR LOS SUPERVISORES QUE TENGAN TECNICOS ACTIVOS,\r\nUTILIZADO AL MOMENTO DE CREAR UNA VISITA TECNICA',NULL),(40,'QUERY_SUPERVISORS_VISIT_BY_ID','SELECT \r\n    s.USER_ID AS supervisorId,\r\n    CONCAT(s.NAME, \' \', s.LASTNAME) AS supervisorName,\r\n    s.USERNAME AS username,\r\n    s.PHONE AS phone\r\nFROM ADM_USER s\r\nWHERE s.ROLE_ID = 2              \r\n  AND s.STATE IN (1, 2)\r\n  and s.USER_ID = ?\r\nORDER BY s.NAME','query utilizado para recuperar solo la información del supervisor que esta creando la visita tecnica',NULL),(41,'STATUS_ALLOWED_CHECKIN','1,2','estados en los que se puede realizar checkin',NULL),(42,'STATUS_ALLOWED_CHECKOUT','3','estados en que se puede realizar un checkout',NULL),(43,'QUERY_CONFIG_VISIT_BY_ID','SELECT \r\ntv.*,\r\ncc.CLIENT_ID as clientId,\r\ncc.NAME as clientName\r\nFROM TRA_VISIT tv \r\njoin CAT_CLIENT_SITE ccs on ccs.SITE_ID = tv.SITE_ID\r\njoin CAT_CLIENT cc on cc.CLIENT_ID = ccs.CLIENT_ID \r\nWHERE VISIT_ID = ?','query utilizado en la actualizacion de la visita tecnica para listar toda la info de la visita',NULL),(44,'STATUS_ALLOWED_FOR_CANCEL_VISIT','1,2','ESTADOS PERMITIDOS PARA CANCELAR UNA VISITA TECNICA',NULL),(45,'STATUS_ALLOWED_FOR_UPDATE','1,2','estados permitidos para actualizar una visita tecnica',NULL),(46,'STATUS_ALLOWED_INIT','1','ESTADOS EN LOS QUE SE PUEDE INICIALIZAR LA VISITA TECNICA',NULL),(47,'REPORT_USERS','SELECT \r\n    au.USER_ID AS userId,\r\n    au.NAME AS name,\r\n    au.LASTNAME AS lastname,\r\n    au.PHONE AS phone,\r\n    au.EMAIL AS email,\r\n    au.USERNAME AS username,\r\n    ar.NAME AS roleName,\r\n    CASE \r\n        WHEN au.ROLE_ID = 3 THEN CONCAT(sup.NAME, \' \', sup.LASTNAME)\r\n        ELSE \'NO APLICA\'\r\n    END AS supervisorName,\r\n    CONCAT(uc.NAME, \' \', uc.LASTNAME) AS createdBy,\r\n    DATE_SUB(au.CREATED_DATE, INTERVAL 6 HOUR) AS createdDate\r\nFROM ADM_USER au\r\nJOIN ADM_ROLE ar \r\n  ON ar.ROLE_ID = au.ROLE_ID\r\nLEFT JOIN ADM_SUPERVISOR_TECHNICIAN ast \r\n  ON ast.TECHNICIAN_ID = au.USER_ID\r\nLEFT JOIN ADM_USER sup \r\n  ON sup.USER_ID = ast.SUPERVISOR_ID\r\nLEFT JOIN ADM_USER uc \r\n  ON uc.USER_ID = au.UPDATE_USER \r\nWHERE au.STATE IN (1, 2)\r\nORDER BY au.CREATED_DATE ASC','QUERY PARA EL REPORTE DE USUARIOS',NULL),(48,'REPORT_CLIENTS','SELECT \r\n    s.SITE_ID,\r\n    s.SITE_NAME,\r\n    s.DEPARTMENT,\r\n    s.MUNICIPALITY,\r\n    s.ADDRESS,\r\n    s.LATITUDE,\r\n    s.LONGITUDE,\r\n    CONCAT(usite.NAME,\' \',usite.LASTNAME) as userUpdateSite, \r\n    s.CREATED_DATE AS SITE_CREATED_DATE,\r\n    s.LAST_UPDATE AS SITE_LAST_UPDATE,\r\n    c.NAME AS CLIENT_NAME,\r\n    c.CONTACT_NAME AS CLIENT_CONTACT,\r\n    c.EMAIL AS CLIENT_EMAIL,\r\n    c.PHONE AS CLIENT_PHONE,\r\n    CONCAT(uclient.NAME,\' \',uclient.LASTNAME) as userUpdateClient, \r\n    c.CREATED_DATE AS CLIENT_CREATED_DATE,\r\n    c.LAST_UPDATE AS CLIENT_LAST_UPDATE\r\nFROM CAT_CLIENT_SITE s\r\nINNER JOIN CAT_CLIENT c ON s.CLIENT_ID = c.CLIENT_ID\r\nleft join ADM_USER usite on usite.USER_ID = s.UPDATE_USER \r\nleft join ADM_USER uclient on uclient.USER_ID  = c.UPDATE_USER \r\nwhere c.STATE = 1 and s.STATE = 1\r\nORDER BY s.LAST_UPDATE asc','QUERY PARA EL REPORTE DE CLIENTES',NULL),(49,'REPORT_VISITAS','SELECT \r\n	-- Datos principales de la visita\r\n	tv.VISIT_ID AS visitId,\r\n	tv.NAME AS visitName,\r\n	tv.DESCRIPTION AS visitDescription,\r\n	tv.VISIT_DATE AS visitDate,\r\n	tv.PLANNED_START_TIME AS plannedStart,\r\n	tv.PLANNED_END_TIME AS plannedEnd,\r\n	tv.STATUS AS statusId,\r\n	cvs.DESCRIPTION AS statusDescription,\r\n	tv.COMMENT AS visitComment,\r\n	tv.CREATED_DATE AS visitCreatedDate,\r\n	tv.LAST_UPDATE AS visitLastUpdate,\r\n	-- Datos del cliente\r\n	cc.CLIENT_ID AS clientId,\r\n	cc.NAME AS clientName,\r\n	cc.CONTACT_NAME AS clientContact,\r\n	cc.EMAIL AS clientEmail,\r\n	cc.PHONE AS clientPhone,\r\n	-- Datos de la sede del cliente\r\n	ccs.SITE_ID AS siteId,\r\n	ccs.SITE_NAME AS siteName,\r\n	ccs.DEPARTMENT AS siteDepartment,\r\n	ccs.MUNICIPALITY AS siteMunicipality,\r\n	ccs.ADDRESS AS siteAddress,\r\n	ccs.LATITUDE AS siteLatitude,\r\n	ccs.LONGITUDE AS siteLongitude,\r\n	-- Datos del supervisor asignado\r\n	tv.SUPERVISOR_ID AS supervisorId,\r\n	CONCAT(au.NAME, \' \', au.LASTNAME) AS supervisorName,\r\n	au.USERNAME AS supervisorUser,\r\n	au.EMAIL AS supervisorEmail,\r\n	au.PHONE AS supervisorPhone,\r\n	-- Datos del técnico asignado\r\n	tv.TECHNICIAN_ID AS technicianId,\r\n	CONCAT(au2.NAME, \' \', au2.LASTNAME) AS technicianName,\r\n	au2.USERNAME AS technicianUser,\r\n	au2.EMAIL AS technicianEmail,\r\n	au2.PHONE AS technicianPhone,\r\n	-- Detalles de la visita (check-in / check-out)\r\n	tvd.CHECKIN_DATETIME AS detailCheckinDate,\r\n	tvd.CHECKIN_LATITUDE AS detailCheckinLatitude,\r\n	tvd.CHECKIN_LONGITUDE AS detailCheckinLongitude,\r\n	tvd.CHECKOUT_DATETIME AS detailCheckoutDate,\r\n	tvd.CHECKOUT_LATITUDE AS detailCheckoutLatitude,\r\n	tvd.CHECKOUT_LONGITUDE AS detailCheckoutLongitude,\r\n	tvd.RESUME AS detailResume,\r\n	tvd.MATERIALS_USED AS detailMaterialsUsed,\r\n	tvd.LAST_UPDATE AS detailLastUpdate\r\nFROM TRA_VISIT tv\r\nLEFT JOIN CFG_VISIT_STATUS cvs ON cvs.STATUS_ID = tv.STATUS\r\nLEFT JOIN CAT_CLIENT_SITE ccs ON ccs.SITE_ID = tv.SITE_ID\r\nLEFT JOIN CAT_CLIENT cc ON cc.CLIENT_ID = ccs.CLIENT_ID\r\nLEFT JOIN ADM_USER au ON au.USER_ID = tv.SUPERVISOR_ID\r\nLEFT JOIN ADM_USER au2 ON au2.USER_ID = tv.TECHNICIAN_ID\r\nLEFT JOIN TRA_VISIT_DETAIL tvd ON tvd.VISIT_ID = tv.VISIT_ID\r\nORDER BY tv.VISIT_DATE DESC, tv.LAST_UPDATE DESC','QUERY PARA EL REPORTE DE VISITAS TECNICAS',NULL),(50,'GRAPH_STATE_VISIT_ADMIN','SELECT \r\n	\'pie\' as type,\r\n	cvs.DESCRIPTION as state,\r\n	COUNT(*) AS total\r\nFROM TRA_VISIT tv\r\n join CFG_VISIT_STATUS cvs on cvs.STATUS_ID  =tv.STATUS \r\nGROUP BY tv.STATUS\r\nORDER BY tv.STATUS','QUERY PARA TRAER LOS DATOS DEL DASHBOARD DE ESTADOS DE LAS VISITAS TECNCIAS',NULL),(51,'GRAPH_VISIT_MONTH_ADMIN','SELECT\r\n  \'line\' as type,\r\n  MONTH(VISIT_DATE) AS mes,\r\n  COUNT(*) AS total\r\nFROM TRA_VISIT\r\nWHERE YEAR(VISIT_DATE) = YEAR(CURDATE())\r\nGROUP BY MONTH(VISIT_DATE)\r\nORDER BY MONTH(VISIT_DATE)','QUERY PARA TRAER LOS DATOS DEL DASHBOARD DE VISITAS POR MES ADMIN',NULL),(52,'GRAPH_USERS_ADMIN','SELECT \r\n	\'doughnut\' AS type,\r\n  r.NAME AS rol,\r\n  COUNT(u.USER_ID) AS total\r\nFROM ADM_USER u\r\nJOIN ADM_ROLE r \r\n  ON u.ROLE_ID = r.ROLE_ID\r\nWHERE u.STATE IN (1, 2) -- activos o habilitados\r\nGROUP BY r.NAME\r\nORDER BY total DESC','QUERY PARA TRAER LOS DATOS DEL DASHBOARD TIPOS DE USUARIOS ACTIVOS EN EL SISTEMA',NULL),(53,'GRAPH_TOP_CLIENTS_ADMIN','SELECT \r\n	\'bar\' as type,\r\n  c.NAME AS cliente,\r\n  COUNT(v.VISIT_ID) AS total\r\nFROM TRA_VISIT v\r\nJOIN CAT_CLIENT_SITE s \r\n  ON v.SITE_ID = s.SITE_ID\r\nJOIN CAT_CLIENT c \r\n  ON s.CLIENT_ID = c.CLIENT_ID\r\nWHERE c.STATE IN (1, 2) -- activos\r\nGROUP BY c.NAME \r\nORDER BY total DESC\r\nLIMIT 5','TOP 5 CLIENTES ',NULL),(54,'GRAPH_VISIT_CANCEL_ADMIN','SELECT \r\n\'line\' as type,\r\n  MONTH(VISIT_DATE) AS mes,\r\n  COUNT(*) AS total\r\nFROM TRA_VISIT\r\nWHERE STATUS = 4  -- Canceladas\r\n  AND YEAR(VISIT_DATE) = YEAR(CURDATE())\r\nGROUP BY MONTH(VISIT_DATE)\r\nORDER BY MONTH(VISIT_DATE)','VISITAS CANCELADAS EN EL AÑO - ADMIN',NULL),(55,'CARDS_VISITS_ADMIN','SELECT \r\n  -- 1. Total de visitas programadas para hoy\r\n  (SELECT COUNT(*) \r\n   FROM TRA_VISIT \r\n   WHERE STATUS = 1 \r\n     AND DATE(VISIT_DATE) = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))) AS totalVisitasHoy,\r\n  -- 2. Total de visitas activas (programadas o en progreso)\r\n  (SELECT COUNT(*) \r\n   FROM TRA_VISIT \r\n   WHERE STATUS IN (1, 2,3)) AS visitasActivas,\r\n\r\n  -- 3. Total de técnicos activos\r\n  (SELECT COUNT(*) \r\n   FROM ADM_USER \r\n   WHERE ROLE_ID = 3 \r\n     AND STATE IN (1,2)) AS tecnicosActivos,\r\n\r\n  -- 4. Promedio de visitas por técnico\r\n  (SELECT \r\n     ROUND(COUNT(*) / NULLIF(\r\n       (SELECT COUNT(*) FROM ADM_USER WHERE ROLE_ID = 3 AND STATE = 1),\r\n     0), 2)\r\n   FROM TRA_VISIT) AS promedioVisitasTecnico,\r\n\r\n  -- 5. Porcentaje de cumplimiento (visitas finalizadas)\r\n  (SELECT \r\n     ROUND(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2)\r\n   FROM TRA_VISIT) AS porcentajeCumplimiento,\r\n\r\n  -- 6. Total de visitas del año\r\n  (SELECT COUNT(*) \r\n   FROM TRA_VISIT \r\n   WHERE YEAR(VISIT_DATE) = YEAR(CURDATE())) AS totalVisitasAnio','DATOS A MOSTRAR EN LAS CARDS DEL DASHBOARD',NULL),(56,'GRAPH_STATE_VISIT_SUPERVISOR','SELECT \r\n  \'pie\' AS type,\r\n  cvs.DESCRIPTION AS state,\r\n  COUNT(*) AS total\r\nFROM TRA_VISIT tv\r\nJOIN CFG_VISIT_STATUS cvs \r\n  ON cvs.STATUS_ID = tv.STATUS\r\nWHERE tv.SUPERVISOR_ID = ?\r\nGROUP BY tv.STATUS\r\nORDER BY tv.STATUS','QUERY PARA TRAER LOS DATOS DEL DASHBOARD DE ESTADOS DE LAS VISITAS TECNCIAS - SUPERVISOR',NULL),(57,'GRAPH_TOP_TECHNICIANS_SUPERVISOR','SELECT \r\n  \'bar\' AS type,\r\n  CONCAT(u.NAME, \' \', u.LASTNAME) AS tecnico,\r\n  COUNT(v.VISIT_ID) AS total\r\nFROM TRA_VISIT v\r\nJOIN ADM_USER u \r\n  ON v.TECHNICIAN_ID = u.USER_ID\r\nWHERE v.SUPERVISOR_ID = ?\r\nGROUP BY u.USER_ID\r\nORDER BY total DESC\r\nLIMIT 5','top 5 supervisores',NULL),(58,'GRAPH_VISIT_MONTH_SUPERVISOR','SELECT \r\n  \'line\' AS type,\r\n  MONTH(v.VISIT_DATE) AS mes,\r\n  COUNT(*) AS total\r\nFROM TRA_VISIT v\r\nWHERE v.SUPERVISOR_ID = ?\r\n  AND YEAR(v.VISIT_DATE) = YEAR(CURDATE())\r\nGROUP BY MONTH(v.VISIT_DATE)\r\nORDER BY MONTH(v.VISIT_DATE)','QUERY PARA TRAER LOS DATOS DEL DASHBOARD DE VISITAS POR MES - supervisor',NULL),(59,'CARDS_VISITS_SUPERVISOR','SELECT \r\n  (SELECT COUNT(*) FROM TRA_VISIT WHERE SUPERVISOR_ID = ? AND DATE(VISIT_DATE) = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))) AS totalVisitasHoy,\r\n  (SELECT COUNT(*) FROM TRA_VISIT WHERE SUPERVISOR_ID = ? AND STATUS IN (1,2,3)) AS visitasActivas,\r\n  (SELECT COUNT(DISTINCT TECHNICIAN_ID) FROM TRA_VISIT WHERE SUPERVISOR_ID = ?) AS tecnicosActivos,\r\n  (SELECT ROUND(SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2)\r\n   FROM TRA_VISIT WHERE SUPERVISOR_ID = ?) AS porcentajeCumplimiento','DATOS A MOSTRAR EN LAS CARDS DEL DASHBOARD - SUPERVISOR',NULL),(60,'GRAPH_TOP_CLIENTS_SUPERVISOR','SELECT \r\n  \'bar\' AS type,\r\n  c.NAME AS cliente,\r\n  COUNT(v.VISIT_ID) AS total\r\nFROM TRA_VISIT v\r\nJOIN CAT_CLIENT_SITE s ON v.SITE_ID = s.SITE_ID\r\nJOIN CAT_CLIENT c ON s.CLIENT_ID = c.CLIENT_ID\r\nWHERE v.SUPERVISOR_ID = ?\r\nGROUP BY c.NAME\r\nORDER BY total DESC\r\nLIMIT 5','TOP 5 CLIENTES - SUPERVISOR',NULL),(61,'GRAPH_VISIT_CANCEL_SUPERVISOR','SELECT \r\n  \'line\' AS type,\r\n  MONTH(v.VISIT_DATE) AS mes,\r\n  COUNT(*) AS total\r\nFROM TRA_VISIT v\r\nWHERE v.SUPERVISOR_ID = ?\r\n  AND (\r\n    v.STATUS = 4\r\n    OR (v.STATUS IN (1, 2) AND v.VISIT_DATE < CURDATE())\r\n  )\r\n  AND YEAR(v.VISIT_DATE) = YEAR(CURDATE())\r\nGROUP BY MONTH(v.VISIT_DATE)\r\nORDER BY MONTH(v.VISIT_DATE)','VISITAS CANCELADAS EN EL AÑO - SUPERVISOR',NULL),(62,'GRAPH_STATE_VISIT_TECH','SELECT \r\n    \'pie\' AS type,\r\n    cvs.DESCRIPTION AS state,\r\n    COUNT(*) AS total\r\nFROM TRA_VISIT tv\r\nJOIN CFG_VISIT_STATUS cvs ON cvs.STATUS_ID = tv.STATUS\r\nWHERE tv.TECHNICIAN_ID = ? AND DATE(VISIT_DATE) = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))\r\nGROUP BY tv.STATUS\r\nORDER BY tv.STATUS','QUERY PARA TRAER LOS DATOS DEL DASHBOARD DE ESTADOS DE LAS VISITAS TECNCIAS - TECNICO',NULL),(63,'CARDS_VISITS_TECH','SELECT \r\n  -- Total de visitas asignadas hoy\r\n  (SELECT COUNT(*) \r\n   FROM TRA_VISIT \r\n   WHERE TECHNICIAN_ID = ? \r\n     AND DATE(VISIT_DATE) = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))\r\n  ) AS totalVisitasHoy,\r\n  -- Visitas activas hoy (pendientes / en progreso)\r\n  (SELECT COUNT(*) \r\n   FROM TRA_VISIT \r\n   WHERE TECHNICIAN_ID = ? \r\n     AND STATUS IN (1, 2, 3)\r\n     AND DATE(VISIT_DATE) = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))\r\n  ) AS visitasActivasHoy,\r\n  -- Visitas completadas hoy\r\n  (SELECT COUNT(*) \r\n   FROM TRA_VISIT \r\n   WHERE TECHNICIAN_ID = ? \r\n     AND STATUS = 4\r\n     AND DATE(VISIT_DATE) = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))\r\n  ) AS visitasCompletadasHoy,\r\n  -- Porcentaje de cumplimiento hoy (completadas / total del día)\r\n  (SELECT \r\n      ROUND(\r\n          (SUM(CASE WHEN STATUS = 4 THEN 1 ELSE 0 END) / COUNT(*)) * 100, \r\n          2\r\n      )\r\n   FROM TRA_VISIT \r\n   WHERE TECHNICIAN_ID = ?\r\n     AND DATE(VISIT_DATE) = DATE(CONVERT_TZ(NOW(), \'+00:00\', \'-06:00\'))\r\n  ) AS porcentajeCumplimientoHoy','DATOS A MOSTRAR EN LAS CARDS DEL DASHBOARD - TECNICO',NULL);
/*!40000 ALTER TABLE `CFG_CONFIGURATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CFG_VISIT_STATUS`
--

DROP TABLE IF EXISTS `CFG_VISIT_STATUS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CFG_VISIT_STATUS` (
  `STATUS_ID` int NOT NULL COMMENT 'Identificador único del estado de la visita técnica',
  `DESCRIPTION` varchar(100) NOT NULL COMMENT 'Nombre del estado de la visita',
  PRIMARY KEY (`STATUS_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Catálogo de estados de las visitas técnicas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CFG_VISIT_STATUS`
--

LOCK TABLES `CFG_VISIT_STATUS` WRITE;
/*!40000 ALTER TABLE `CFG_VISIT_STATUS` DISABLE KEYS */;
INSERT INTO `CFG_VISIT_STATUS` VALUES (1,'Programada'),(2,'En camino'),(3,'Iniciada'),(4,'Completada'),(5,'Cancelada');
/*!40000 ALTER TABLE `CFG_VISIT_STATUS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TRA_VISIT`
--

DROP TABLE IF EXISTS `TRA_VISIT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRA_VISIT` (
  `VISIT_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la visita técnica',
  `NAME` varchar(150) NOT NULL COMMENT 'Nombre o título de la visita',
  `DESCRIPTION` varchar(255) DEFAULT NULL COMMENT 'Descripción de la visita',
  `SITE_ID` int NOT NULL COMMENT 'Identificador del sitio visitado',
  `SUPERVISOR_ID` int NOT NULL COMMENT 'Identificador del supervisor asignado',
  `TECHNICIAN_ID` int NOT NULL COMMENT 'Identificador del técnico asignado',
  `VISIT_DATE` date NOT NULL COMMENT 'Fecha programada de la visita',
  `PLANNED_START_TIME` time DEFAULT NULL COMMENT 'campo para guardar la hora de inicio planificada',
  `PLANNED_END_TIME` time DEFAULT NULL COMMENT 'campo para guardar la hora fin estimada',
  `STATUS` int DEFAULT '1' COMMENT 'Estado de la visita',
  `COMMENT` varchar(255) DEFAULT NULL COMMENT 'Comentarios adicionales',
  `LAST_UPDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última fecha de actualización',
  `CREATED_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`VISIT_ID`),
  KEY `SITE_ID` (`SITE_ID`),
  KEY `SUPERVISOR_ID` (`SUPERVISOR_ID`),
  KEY `TECHNICIAN_ID` (`TECHNICIAN_ID`),
  KEY `TRA_VISIT_CFG_VISIT_STATUS_FK` (`STATUS`),
  CONSTRAINT `TRA_VISIT_CFG_VISIT_STATUS_FK` FOREIGN KEY (`STATUS`) REFERENCES `CFG_VISIT_STATUS` (`STATUS_ID`),
  CONSTRAINT `TRA_VISIT_ibfk_1` FOREIGN KEY (`SITE_ID`) REFERENCES `CAT_CLIENT_SITE` (`SITE_ID`),
  CONSTRAINT `TRA_VISIT_ibfk_2` FOREIGN KEY (`SUPERVISOR_ID`) REFERENCES `ADM_USER` (`USER_ID`),
  CONSTRAINT `TRA_VISIT_ibfk_3` FOREIGN KEY (`TECHNICIAN_ID`) REFERENCES `ADM_USER` (`USER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro de visitas técnicas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TRA_VISIT`
--

LOCK TABLES `TRA_VISIT` WRITE;
/*!40000 ALTER TABLE `TRA_VISIT` DISABLE KEYS */;
INSERT INTO `TRA_VISIT` VALUES (3,'test','pruea',1,17,20,'2025-09-25',NULL,NULL,5,'prueba | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 05:18:19 | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 14:05:38','2025-10-19 01:12:24','2025-10-01 04:37:50'),(4,'test2','pruea',1,17,20,'2025-10-02',NULL,NULL,5,'prueba | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 05:18:19 | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 14:05:38','2025-10-12 14:05:38','2025-10-01 05:19:37'),(5,'test3','pruea',1,17,20,'2025-10-03',NULL,NULL,5,'prueba | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 05:18:19 | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 14:05:38 | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-01 05:21:15'),(6,'test4','prueba actualizacion cambio',1,17,20,'2025-10-10',NULL,NULL,5,'prueba actualizacion | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 05:18:19 | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 14:05:38 | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-01 05:22:56'),(7,'test5','pruea',1,17,20,'2025-10-04',NULL,NULL,5,'prueba | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 05:18:19 | Cancelada automáticamente por vencimiento de fecha el 2025-10-12 14:05:38 | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-02 03:23:01'),(8,'prueba-CAMBIO','prueba|',16,19,18,'2025-10-12',NULL,NULL,5,'prueba','2025-10-12 16:48:24','2025-10-12 04:34:02'),(9,'prueba2-CAMBIO123','prueba-CAMBIO',16,19,18,'2025-10-16',NULL,NULL,4,'testtest','2025-10-13 02:39:45','2025-10-12 05:06:43'),(10,'nueva visita','nueva visita',11,17,7,'2025-10-16',NULL,NULL,4,'esto es una prueba de creacion','2025-10-12 22:42:31','2025-10-12 16:15:39'),(11,'visita tecnica-test2-16102025','esto es una prueba',15,17,20,'2025-10-17',NULL,NULL,4,'prueba de visita','2025-10-13 03:14:49','2025-10-13 03:11:32'),(12,'prueba-supervisor','esto es una prueba',11,19,22,'2025-10-18','10:48:00','14:48:00',5,'test1234 | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-14 03:47:05'),(13,'test-supervisor','esto es una prueba',1,17,7,'2025-10-14','06:00:00','09:30:00',4,'esto es una prueba','2025-10-16 04:09:29','2025-10-14 03:48:06'),(14,'test141025','esto es una prueba',16,17,7,'2025-10-16',NULL,NULL,5,'esto es una prueba | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-14 22:14:47'),(15,'testhoy','esto es una prueba',15,17,7,'2025-10-19','06:00:00','09:30:00',4,'teste','2025-10-19 06:27:22','2025-10-14 22:15:36'),(18,'prueba hora ','pruea',1,17,7,'2025-10-19','11:00:00','12:35:00',4,'prueba','2025-10-19 21:59:00','2025-10-16 04:30:05'),(19,'prueba hora 2','pruea',1,17,7,'2025-10-19','14:00:00','15:20:00',3,'prueba','2025-10-19 22:01:34','2025-10-16 04:32:16'),(20,'prueba hora 3','pruea',1,17,20,'2025-10-19','05:00:00','08:00:00',1,'prueba','2025-10-19 06:15:27','2025-10-16 04:37:38'),(21,'test horario','prueba de horario',4,17,7,'2025-10-17','09:58:00','10:59:00',5,'esto es una prueba de horario | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-16 05:00:13'),(22,'prueba hora 55','pruea',1,17,20,'2025-10-18','13:00:00','14:00:00',5,'prueba | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-18 18:57:41'),(23,'asdfasfasdfasdfasd','asdfasdfasdfasdf',15,17,20,'2025-10-18','15:18:00','16:18:00',5,'asdfasfasdfasdf | Cancelada automáticamente por vencimiento de fecha el 2025-10-19 18:45:56','2025-10-19 18:45:56','2025-10-18 19:25:29');
/*!40000 ALTER TABLE `TRA_VISIT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TRA_VISIT_DETAIL`
--

DROP TABLE IF EXISTS `TRA_VISIT_DETAIL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRA_VISIT_DETAIL` (
  `VISIT_DETAIL_ID` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del detalle de visita',
  `VISIT_ID` int NOT NULL COMMENT 'Identificador de la visita técnica',
  `CHECKIN_DATETIME` datetime DEFAULT NULL COMMENT 'Fecha y hora de check-in',
  `CHECKIN_LATITUDE` decimal(10,6) DEFAULT NULL COMMENT 'Latitud en check-in',
  `CHECKIN_LONGITUDE` decimal(10,6) DEFAULT NULL COMMENT 'Longitud en check-in',
  `CHECKOUT_DATETIME` datetime DEFAULT NULL COMMENT 'Fecha y hora de check-out',
  `CHECKOUT_LATITUDE` decimal(10,6) DEFAULT NULL COMMENT 'Latitud en check-out',
  `CHECKOUT_LONGITUDE` decimal(10,6) DEFAULT NULL COMMENT 'Longitud en check-out',
  `RESUME` text COMMENT 'Resumen de la visita',
  `MATERIALS_USED` text COMMENT 'Materiales utilizados en la visita',
  `LAST_UPDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última fecha de actualización',
  PRIMARY KEY (`VISIT_DETAIL_ID`),
  KEY `VISIT_ID` (`VISIT_ID`),
  CONSTRAINT `TRA_VISIT_DETAIL_ibfk_1` FOREIGN KEY (`VISIT_ID`) REFERENCES `TRA_VISIT` (`VISIT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Detalle de cada visita técnica (check-in, check-out, materiales, etc.)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TRA_VISIT_DETAIL`
--

LOCK TABLES `TRA_VISIT_DETAIL` WRITE;
/*!40000 ALTER TABLE `TRA_VISIT_DETAIL` DISABLE KEYS */;
INSERT INTO `TRA_VISIT_DETAIL` VALUES (2,3,'2025-10-02 05:03:40',14.525889,-90.566078,'2025-10-02 05:14:08',14.525889,-90.566078,'se hizo todooo','nuevo router jeje','2025-10-02 05:14:08'),(3,4,'2025-10-02 05:22:23',14.525889,-90.566078,'2025-10-02 05:22:33',14.525889,-90.566078,'se hizo todooo','nuevo router jeje','2025-10-02 05:22:33'),(5,5,'2025-10-02 06:00:07',14.525889,-90.566078,'2025-10-02 06:00:13',14.525889,-90.566078,'se hizo todooo','nuevo router jeje','2025-10-02 06:00:13'),(6,6,'2025-10-02 06:03:47',14.525889,-90.566078,'2025-10-02 06:04:16',14.525889,-90.566078,'se realizo un backup al servidor prd de la empresa','nuevo router jeje','2025-10-02 06:04:16'),(7,7,'2025-10-02 06:06:01',14.525889,-90.566078,'2025-10-02 06:06:12',14.525889,-90.566078,'se realizo un backup al servidor prd de la empresa','nuevo router jeje','2025-10-02 06:06:12'),(8,10,'2025-10-12 22:00:35',14.525708,-90.566067,'2025-10-12 22:42:31',14.525760,-90.566096,'prueba',NULL,'2025-10-12 22:42:31'),(9,9,'2025-10-13 02:39:30',14.525766,-90.566096,'2025-10-13 02:39:45',14.525766,-90.566096,'todo de todo','nada de nada','2025-10-13 02:39:45'),(10,11,'2025-10-13 03:14:31',14.526194,-90.565956,'2025-10-13 03:14:49',14.526197,-90.565958,'Todo de todo','Nada de nada','2025-10-13 03:14:49'),(11,13,'2025-10-14 03:57:30',14.525786,-90.566097,'2025-10-14 03:57:49',14.525786,-90.566097,'todo de todo','nada de nada','2025-10-14 03:57:49'),(12,15,'2025-10-19 06:26:50',14.525786,-90.566097,'2025-10-19 06:27:22',14.525786,-90.566097,'se hizo de todo','nada de nada','2025-10-19 06:27:22'),(13,18,'2025-10-19 21:58:26',14.525814,-90.566097,'2025-10-19 21:59:00',14.525775,-90.566097,'resumen1234','no aplica','2025-10-19 21:59:00'),(14,19,'2025-10-19 22:01:34',14.525786,-90.566097,NULL,NULL,NULL,NULL,NULL,'2025-10-19 22:01:34');
/*!40000 ALTER TABLE `TRA_VISIT_DETAIL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'gestion_visitas'
--
/*!50003 DROP PROCEDURE IF EXISTS `SP_CANCELAR_VISITAS_VENCIDAS` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `SP_CANCELAR_VISITAS_VENCIDAS`()
BEGIN
    -- Actualiza todas las visitas con estado 1, 2 o 3 cuya fecha ya pasó
    UPDATE TRA_VISIT
    SET STATUS = 5,
        COMMENT = CONCAT(
            IFNULL(COMMENT, ''), 
            CASE 
                WHEN COMMENT IS NULL OR COMMENT = '' THEN ''
                ELSE ' | '
            END,
            'Cancelada automáticamente por vencimiento de fecha el ',
            DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
        ),
        LAST_UPDATE = NOW()
    WHERE STATUS IN (1, 2, 3)
      AND VISIT_DATE < CURDATE();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-19 17:35:56
