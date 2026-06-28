-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2026 at 06:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vsp_v2`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `id_time_entry` int(10) UNSIGNED DEFAULT NULL,
  `screenshot_url` varchar(500) DEFAULT NULL,
  `activity_percent` int(11) DEFAULT NULL,
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(300) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `target_audience` varchar(30) NOT NULL DEFAULT 'all' COMMENT 'all, admin, employees, clients, department',
  `priority` varchar(20) NOT NULL DEFAULT 'normal' COMMENT 'low, normal, high, urgent',
  `published_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement_acks`
--

CREATE TABLE `announcement_acks` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_announcement` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `user_type` varchar(10) NOT NULL DEFAULT '0' COMMENT '0=admin, 1=employee, 2=client',
  `acknowledged_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `id` int(10) UNSIGNED NOT NULL,
  `fn` varchar(50) DEFAULT NULL,
  `mn` varchar(50) DEFAULT NULL,
  `sn` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `resume_path` varchar(500) DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL COMMENT 'website, referral, job_board, social_media',
  `status` varchar(30) NOT NULL DEFAULT 'applied' COMMENT 'applied, screening, assessment, interview, client_interview, hired, pool, reprofile, rejected',
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `bday` date DEFAULT NULL,
  `photo_filename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicants`
--

INSERT INTO `applicants` (`id`, `fn`, `mn`, `sn`, `email`, `phone`, `resume_path`, `source`, `status`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `gender`, `bday`, `photo_filename`) VALUES
(1, 'Anton John', '', 'Estor', 'antonjohnestor@gmail.com', '+639943916608', NULL, 'social_media', 'screening', NULL, NULL, 1, 0, 0, '[{\"timestamp\":\"2026-06-27T06:49:38.504Z\",\"userId\":1,\"changes\":{\"gender\":{\"from\":null,\"to\":\"1\"},\"bday\":{\"from\":null,\"to\":\"1990-07-05\"}}}]', 1, '2026-06-27 06:45:50', '2026-06-27 06:45:50', NULL, NULL, NULL, NULL, '1', '1990-07-05', 'Gemini_Generated_Image_yj2qgvyj2qgvyj2q.webp');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED DEFAULT NULL,
  `user_type` varchar(10) DEFAULT NULL COMMENT '0=admin, 1=employee, 2=client',
  `action` varchar(50) NOT NULL COMMENT 'create, update, delete, login, logout, export',
  `entity_type` varchar(50) DEFAULT NULL COMMENT 'Table or resource name',
  `entity_id` int(10) UNSIGNED DEFAULT NULL,
  `details` text DEFAULT NULL COMMENT 'JSON details of the action',
  `ip_address` varchar(50) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bench_status`
--

CREATE TABLE `bench_status` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'available' COMMENT 'available, floating, partial, cross_trained, backup',
  `available_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `id_position` int(11) DEFAULT NULL,
  `fn` varchar(30) DEFAULT NULL,
  `mn` varchar(30) DEFAULT NULL,
  `sn` varchar(30) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `bday` date DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `photo_filename` varchar(200) DEFAULT NULL,
  `otp` smallint(1) NOT NULL DEFAULT 0,
  `event` smallint(1) NOT NULL DEFAULT 1,
  `notification` smallint(1) NOT NULL DEFAULT 1,
  `un` varchar(30) DEFAULT NULL,
  `pw` varchar(100) DEFAULT NULL,
  `sidebar` smallint(1) NOT NULL DEFAULT 0,
  `dark` smallint(1) NOT NULL DEFAULT 0,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `id_position`, `fn`, `mn`, `sn`, `gender`, `bday`, `phone`, `email`, `address`, `photo_filename`, `otp`, `event`, `notification`, `un`, `pw`, `sidebar`, `dark`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 6, 'Jollibee', 'C.', 'Celevante', '1', '1986-08-25', '0935 663 8566x', 'jericcelevante.se@gmail.com', 'Pasong Camachile 1, General Trias City', 'logo.jpeg', 0, 1, 1, 'client', '$2b$10$w7HAorgeoacUh2sIHaO8V.UPoUKdguZnqwWoji7PkoMkZe8qg.mLy', 0, 1, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(2, 6, 'Mc Donalds', 'Valdez', 'Celevante', '2', '1899-11-18', '0910-000-0000', 'jericcelevante.sa@gmail.com', 'Cedar 1, Carmona, Cavite', 'sonjay.jpg', 0, 1, 1, 'client2', '$2a$12$7yMk7T80DK0jMcN8XfQRL.bE8I5gt6Dk62DlFcvn5cWc5oJpWiLyO', 0, 1, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(3, 6, 'Biggs', 'R.', 'Magno', '1', '1899-11-27', '', 'magnosquare17@gmail.com', '', 'mags.jpeg', 0, 1, 1, 'client3', '$2a$10$FPWX2GJZ..RM099NNX8cFO6GrZ9GlV6pl6F4SZrrWMEA2bVQc4K9.', 0, 0, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `client_contracts`
--

CREATE TABLE `client_contracts` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_client` int(10) UNSIGNED NOT NULL,
  `contract_type` varchar(30) NOT NULL COMMENT 'msa, nda, baa, sow, staffing',
  `title` varchar(300) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'active' COMMENT 'draft, active, expired, terminated',
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `client_staff_assignments`
--

CREATE TABLE `client_staff_assignments` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_client` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'active' COMMENT 'active, ended, on_hold',
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `monthly_rate` decimal(12,2) DEFAULT NULL,
  `billing_type` varchar(20) NOT NULL DEFAULT 'hourly' COMMENT 'hourly, monthly',
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_staff_assignments`
--

INSERT INTO `client_staff_assignments` (`id`, `id_client`, `id_employee`, `start_date`, `end_date`, `status`, `hourly_rate`, `monthly_rate`, `billing_type`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 2, 3, '2026-06-28', '2027-06-28', 'active', 4.50, 720.00, 'hourly', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:23:53', '2026-06-28 01:23:53', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `client_training_materials`
--

CREATE TABLE `client_training_materials` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_client` int(10) UNSIGNED NOT NULL,
  `title` varchar(300) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_type` varchar(30) DEFAULT NULL COMMENT 'pdf, video, document, link',
  `description` text DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `compliance_records`
--

CREATE TABLE `compliance_records` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `compliance_type` varchar(50) NOT NULL COMMENT 'hipaa, nda, device_check, internet_redundancy, training, policy_ack',
  `status` varchar(30) NOT NULL DEFAULT 'pending' COMMENT 'pending, compliant, non_compliant, expired',
  `due_date` date DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `document_path` varchar(500) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `compliance_records`
--

INSERT INTO `compliance_records` (`id`, `id_employee`, `compliance_type`, `status`, `due_date`, `completed_at`, `document_path`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 3, 'nda', 'compliant', '2026-06-28', '2026-06-28 02:37:00', '1782614270936_ANTON-JOHN-ESTOR_RESUME.pdf', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 02:37:50', '2026-06-28 02:37:50', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(300) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL COMMENT 'hipaa, dental, insurance, billing, customer_service, internal',
  `duration_hours` int(11) DEFAULT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_enrollments`
--

CREATE TABLE `course_enrollments` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `id_course` int(10) UNSIGNED NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'enrolled' COMMENT 'enrolled, in_progress, completed, failed',
  `progress_percent` int(11) NOT NULL DEFAULT 0,
  `score` decimal(5,2) DEFAULT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_modules`
--

CREATE TABLE `course_modules` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_course` int(10) UNSIGNED NOT NULL,
  `title` varchar(300) DEFAULT NULL,
  `content` text DEFAULT NULL COMMENT 'Rich text content via Tiptap',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `duration_minutes` int(11) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disbursement_accounts`
--

CREATE TABLE `disbursement_accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `account_type` varchar(30) NOT NULL DEFAULT 'bank' COMMENT 'bank, gcash, payoneer, wise',
  `account_name` varchar(200) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `bank_name` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `id_position` int(11) DEFAULT NULL,
  `fn` varchar(30) DEFAULT NULL,
  `mn` varchar(30) DEFAULT NULL,
  `sn` varchar(30) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `bday` date DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `photo_filename` varchar(200) DEFAULT NULL,
  `otp` smallint(1) NOT NULL DEFAULT 0,
  `event` smallint(1) NOT NULL DEFAULT 1,
  `notification` smallint(1) NOT NULL DEFAULT 1,
  `un` varchar(30) DEFAULT NULL,
  `pw` varchar(100) DEFAULT NULL,
  `sidebar` smallint(1) NOT NULL DEFAULT 0,
  `dark` smallint(1) NOT NULL DEFAULT 0,
  `keyword` varchar(10) DEFAULT NULL,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `id_position`, `fn`, `mn`, `sn`, `gender`, `bday`, `phone`, `email`, `address`, `photo_filename`, `otp`, `event`, `notification`, `un`, `pw`, `sidebar`, `dark`, `keyword`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 5, 'Alpha', 'Goyena', 'Ugalde', '1', '1986-08-25', '0935 663 8566', 'jericcelevante.sa@gmail.com', 'Pasong Camachile 1, General Trias City', 'ani-profile.webp', 0, 1, 1, 'employee', '$2b$10$tRWCcaFdlzQidFfZzeAL1OArTkS3SjTxtRt5v12lzzTh3um.vbwKm', 0, 1, NULL, 0, 0, 1, '2025-08-26 08:20:33', 0, NULL, NULL, NULL, ''),
(2, 5, 'Ralph Ian', 'Lee', 'Gojit', '2', '1899-11-18', '0910-000-0000', 'celevantejason@gmail.com', 'Cedar 1, Carmona, Cavite', 'sonjay.jpg', 0, 1, 1, '@jason2025', '$2a$12$7yMk7T80DK0jMcN8XfQRL.bE8I5gt6Dk62DlFcvn5cWc5oJpWiLyO', 0, 1, NULL, 0, 0, 1, '2025-08-26 08:20:33', 0, NULL, NULL, NULL, NULL),
(3, 5, 'Vicente', 'R.', 'Manlangit', '1', '1899-11-27', '', 'magnosquare17@gmail.com', '', 'mags.webp', 0, 1, 1, 'magno', '$2a$10$FPWX2GJZ..RM099NNX8cFO6GrZ9GlV6pl6F4SZrrWMEA2bVQc4K9.', 0, 0, NULL, 0, 0, 1, '2025-08-26 08:20:33', 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee_documents`
--

CREATE TABLE `employee_documents` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `document_type` varchar(50) NOT NULL COMMENT 'resume, government_id, certification, contract, emergency_contact',
  `title` varchar(300) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_skills`
--

CREATE TABLE `employee_skills` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  `proficiency_level` varchar(30) DEFAULT NULL COMMENT 'beginner, intermediate, advanced, expert',
  `years_experience` int(11) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_client` int(10) UNSIGNED NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'draft' COMMENT 'draft, sent, paid, overdue, void',
  `due_date` date DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `stripe_invoice_id` varchar(100) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `id_client`, `invoice_number`, `period_start`, `period_end`, `subtotal`, `tax`, `total`, `status`, `due_date`, `paid_at`, `stripe_invoice_id`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 1, 'INV-2026-0001', '2026-06-22', '2026-07-22', 720.00, 55.08, 775.08, 'sent', '2026-06-30', NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:17:03', '2026-06-28 03:17:03', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_line_items`
--

CREATE TABLE `invoice_line_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_invoice` int(10) UNSIGNED NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `id_employee` int(10) UNSIGNED DEFAULT NULL,
  `hours` decimal(8,2) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_line_items`
--

INSERT INTO `invoice_line_items` (`id`, `id_invoice`, `description`, `id_employee`, `hours`, `rate`, `amount`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 1, 'API Rate Limit', 3, 80.00, 4.50, 360.00, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:33:55', '2026-06-28 03:33:55', NULL, NULL, NULL, NULL),
(2, 1, 'API Rate Limit', 1, 80.00, 4.50, 360.00, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:47:36', '2026-06-28 03:47:36', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `iplist`
--

CREATE TABLE `iplist` (
  `id` int(11) NOT NULL,
  `id_user` int(10) DEFAULT 0,
  `ip` varchar(50) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `iplist`
--

INSERT INTO `iplist` (`id`, `id_user`, `ip`, `remarks`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 1, '127.0.0.1', 'Development IP', 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '001_create_tenant_rbac.js', 1, '2026-06-27 05:18:00'),
(2, '002_create_client_management.js', 1, '2026-06-27 05:18:11'),
(3, '003_create_workforce.js', 1, '2026-06-27 05:18:31'),
(4, '004_create_operations.js', 1, '2026-06-27 05:18:46'),
(5, '005_create_finance_time.js', 1, '2026-06-27 05:19:09'),
(6, '006_create_system.js', 1, '2026-06-27 05:19:13'),
(7, '007_update_applicants.js', 2, '2026-06-27 06:47:08'),
(8, '008_create_payroll.js', 3, '2026-06-28 04:09:53');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `layout_blocks`
--

CREATE TABLE `layout_blocks` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `block_type` varchar(255) NOT NULL,
  `preview_image` varchar(255) DEFAULT NULL,
  `properties` text DEFAULT NULL COMMENT 'JSON CSS properties',
  `inactive` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `layout_pages`
--

CREATE TABLE `layout_pages` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `preview_image` varchar(255) DEFAULT NULL,
  `sections_config` text DEFAULT NULL COMMENT 'JSON configuration for sections',
  `inactive` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `layout_presets`
--

CREATE TABLE `layout_presets` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `template_key` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT 'general',
  `default_sections` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `preview_image` varchar(255) DEFAULT NULL,
  `inactive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_presets`
--

INSERT INTO `layout_presets` (`id`, `name`, `template_key`, `category`, `default_sections`, `preview_image`, `inactive`) VALUES
(1, 'Standard Landing Page', 'landing_page', 'marketing', '[{\"template\":\"hero_centered\",\"section_name\":\"Hero\"},{\"template\":\"feature_grid\",\"section_name\":\"Features\"},{\"template\":\"pricing_pro\",\"section_name\":\"Pricing\"},{\"template\":\"faq_accordion\",\"section_name\":\"FAQ\"},{\"template\":\"newsletter_section\",\"section_name\":\"Newsletter\"}]', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `layout_sections`
--

CREATE TABLE `layout_sections` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `template_key` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT 'general',
  `default_blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`default_blocks`)),
  `preview_image` varchar(255) DEFAULT NULL,
  `inactive` tinyint(1) DEFAULT 0,
  `default_settings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_sections`
--

INSERT INTO `layout_sections` (`id`, `name`, `template_key`, `category`, `default_blocks`, `preview_image`, `inactive`, `default_settings`) VALUES
(1, 'Full Title', 'full_title', 'title', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', NULL, 0, '{\"layout\":\"flex-block\"}');

-- --------------------------------------------------------

--
-- Table structure for table `layout_themes`
--

CREATE TABLE `layout_themes` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `preview_image` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `pages_config` text DEFAULT NULL COMMENT 'JSON configuration for page structures',
  `inactive` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `config` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_themes`
--

INSERT INTO `layout_themes` (`id`, `name`, `description`, `preview_image`, `category`, `pages_config`, `inactive`, `created_at`, `config`) VALUES
(1, 'Premium Dark', 'A sleek dark theme with blue accents', NULL, 'modern', NULL, 0, '2026-05-01 17:41:06', '{\"colors\":{\"primary\":\"#1877f2\",\"background\":\"#121212\",\"text\":\"#ffffff\"},\"typography\":{\"fontFamily\":\"Inter, sans-serif\"}}'),
(2, 'Clean Corporate', 'Professional light theme for business', NULL, 'business', NULL, 0, '2026-05-01 17:41:06', '{\"colors\":{\"primary\":\"#2c3e50\",\"background\":\"#ffffff\",\"text\":\"#333333\"},\"typography\":{\"fontFamily\":\"Roboto, sans-serif\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `id_client` int(10) UNSIGNED DEFAULT NULL,
  `leave_type` varchar(30) NOT NULL COMMENT 'vacation, sick, personal, emergency',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT 'pending, approved, rejected, cancelled',
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `user_type` varchar(10) NOT NULL DEFAULT '0' COMMENT '0=admin, 1=employee, 2=client',
  `title` varchar(300) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'info' COMMENT 'info, warning, success, error, action_required',
  `read_at` timestamp NULL DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL COMMENT 'URL to redirect when clicked',
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_invoice` int(10) UNSIGNED DEFAULT NULL,
  `id_client` int(10) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `stripe_payment_id` varchar(100) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending' COMMENT 'pending, succeeded, failed, refunded',
  `paid_at` timestamp NULL DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payrolls`
--

CREATE TABLE `payrolls` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `gross_pay` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deductions` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_pay` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'draft' COMMENT 'draft, processing, paid',
  `payment_date` date DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payrolls`
--

INSERT INTO `payrolls` (`id`, `id_employee`, `period_start`, `period_end`, `gross_pay`, `deductions`, `net_pay`, `status`, `payment_date`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 1, '2026-06-01', '2026-06-30', 720.00, 10.00, 710.00, 'paid', '2026-07-07', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 04:19:49', '2026-06-28 04:19:49', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payroll_runs`
--

CREATE TABLE `payroll_runs` (
  `id` int(10) UNSIGNED NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `total_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'draft' COMMENT 'draft, processing, completed, cancelled',
  `processed_by` int(10) UNSIGNED DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payslips`
--

CREATE TABLE `payslips` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `gross_pay` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deductions` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_pay` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'draft' COMMENT 'draft, released, void',
  `file_path` varchar(500) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `module`, `action`, `description`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 'workforce', 'read', 'read access to workforce module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:28', '2026-06-27 05:22:28', NULL, NULL, NULL, NULL),
(2, 'workforce', 'write', 'write access to workforce module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:28', '2026-06-27 05:22:28', NULL, NULL, NULL, NULL),
(3, 'workforce', 'delete', 'delete access to workforce module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:28', '2026-06-27 05:22:28', NULL, NULL, NULL, NULL),
(4, 'billing', 'read', 'read access to billing module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:28', '2026-06-27 05:22:28', NULL, NULL, NULL, NULL),
(5, 'billing', 'write', 'write access to billing module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:28', '2026-06-27 05:22:28', NULL, NULL, NULL, NULL),
(6, 'billing', 'delete', 'delete access to billing module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:28', '2026-06-27 05:22:28', NULL, NULL, NULL, NULL),
(7, 'recruitment', 'read', 'read access to recruitment module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:29', '2026-06-27 05:22:29', NULL, NULL, NULL, NULL),
(8, 'recruitment', 'write', 'write access to recruitment module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:29', '2026-06-27 05:22:29', NULL, NULL, NULL, NULL),
(9, 'recruitment', 'delete', 'delete access to recruitment module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:29', '2026-06-27 05:22:29', NULL, NULL, NULL, NULL),
(10, 'compliance', 'read', 'read access to compliance module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:29', '2026-06-27 05:22:29', NULL, NULL, NULL, NULL),
(11, 'compliance', 'write', 'write access to compliance module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:29', '2026-06-27 05:22:29', NULL, NULL, NULL, NULL),
(12, 'compliance', 'delete', 'delete access to compliance module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:29', '2026-06-27 05:22:29', NULL, NULL, NULL, NULL),
(13, 'lms', 'read', 'read access to lms module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:30', '2026-06-27 05:22:30', NULL, NULL, NULL, NULL),
(14, 'lms', 'write', 'write access to lms module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:30', '2026-06-27 05:22:30', NULL, NULL, NULL, NULL),
(15, 'lms', 'delete', 'delete access to lms module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:30', '2026-06-27 05:22:30', NULL, NULL, NULL, NULL),
(16, 'reports', 'read', 'read access to reports module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:30', '2026-06-27 05:22:30', NULL, NULL, NULL, NULL),
(17, 'reports', 'write', 'write access to reports module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:30', '2026-06-27 05:22:30', NULL, NULL, NULL, NULL),
(18, 'reports', 'delete', 'delete access to reports module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:30', '2026-06-27 05:22:30', NULL, NULL, NULL, NULL),
(19, 'operations', 'read', 'read access to operations module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(20, 'operations', 'write', 'write access to operations module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(21, 'operations', 'delete', 'delete access to operations module', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(22, 'finance', 'read', 'finance read', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:07:07', '2026-06-28 03:07:07', NULL, NULL, NULL, NULL),
(23, 'finance', 'write', 'finance write', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:07:07', '2026-06-28 03:07:07', NULL, NULL, NULL, NULL),
(24, 'finance', 'delete', 'finance delete', NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:07:08', '2026-06-28 03:07:08', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(300) DEFAULT NULL,
  `subtitle` varchar(200) DEFAULT NULL,
  `venue` varchar(200) DEFAULT NULL,
  `dated` date DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `subtitle`, `venue`, `dated`, `remarks`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 'Test Name', 'Subtitle test', 'Makati City', '2026-03-30', 'Remarks here', 0, 0, 1, '2025-08-26 08:20:33', 1, '2026-04-15 20:13:30', NULL, NULL, NULL),
(2, 'FIXED TEST AGANE VERIFI FINALED!! v2!!', 'Description here', 'BGC', '2026-02-12', 'Description here', 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(3, 'Triskelion Blood Donation Drive 2024', 'Saving Lives, One Pint at a Time', 'Philippine Red Cross Tower, Manila', '2026-03-30', 'Annual blood donation drive in partnership with the PRC. Successfully collected 150+ units of blood.', 0, 0, 1, '2026-04-15 19:21:37', NULL, NULL, NULL, NULL, NULL),
(4, 'TGP Feeding & Nutrition Program', '\"Nutrisyon para sa Kabataan\"', 'Barangay 123 Covered Court, Quezon City', '2024-05-17', 'Community feeding program for underdeveloped areas. Benefited over 200 children.', 0, 0, 1, '2026-04-15 19:21:37', NULL, NULL, NULL, NULL, NULL),
(5, 'Grand Triskelion Tree Planting 2024', 'Green the Earth, Protect the Future', 'Mt. Makiling Forest Reserve', '2024-06-13', 'Environmental awareness project aimed at reforestation. Planted 500 indigenous seedlings.', 0, 0, 1, '2026-04-15 19:21:37', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `recruitment_stages`
--

CREATE TABLE `recruitment_stages` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_applicant` int(10) UNSIGNED NOT NULL,
  `stage` varchar(30) NOT NULL COMMENT 'applied, screening, assessment, interview, client_interview, hired, pool, reprofile',
  `notes` text DEFAULT NULL,
  `interviewer` varchar(100) DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recruitment_stages`
--

INSERT INTO `recruitment_stages` (`id`, `id_applicant`, `stage`, `notes`, `interviewer`, `scheduled_at`, `completed_at`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 1, 'screening', 'This is only a test.', 'Nikki Balisong', '2026-06-29 07:00:00', '0000-00-00 00:00:00', NULL, NULL, 1, 0, 0, NULL, 1, '2026-06-28 03:31:16', '2026-06-28 03:31:16', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `replacement_requests`
--

CREATE TABLE `replacement_requests` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_client` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL COMMENT 'Employee being replaced',
  `reason` text DEFAULT NULL,
  `urgency` varchar(20) NOT NULL DEFAULT 'normal' COMMENT 'low, normal, high, emergency',
  `status` varchar(30) NOT NULL DEFAULT 'pending' COMMENT 'pending, in_progress, resolved, cancelled',
  `id_replacement` int(10) UNSIGNED DEFAULT NULL COMMENT 'Replacement employee ID',
  `resolved_at` timestamp NULL DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `code`, `description`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, '0-SA', 'Full system access', 'Super Admin', NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:27', '2026-06-27 05:22:27', NULL, NULL, NULL, NULL),
(2, '0-HR', 'Human resources and recruitment management', 'HR Admin', NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:27', '2026-06-27 05:22:27', NULL, NULL, NULL, NULL),
(3, '0-FIN', 'Billing, payroll, and financial operations', 'Finance Admin', NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:27', '2026-06-27 05:22:27', NULL, NULL, NULL, NULL),
(4, '0-OPS', 'Day-to-day operations and compliance', 'Operations Admin', NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:27', '2026-06-27 05:22:27', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_role` int(10) UNSIGNED NOT NULL,
  `id_permission` int(10) UNSIGNED NOT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `id_role`, `id_permission`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 1, 1, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:31', '2026-06-27 05:22:31', NULL, NULL, NULL, NULL),
(2, 1, 2, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:31', '2026-06-27 05:22:31', NULL, NULL, NULL, NULL),
(3, 1, 3, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:31', '2026-06-27 05:22:31', NULL, NULL, NULL, NULL),
(4, 1, 4, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:31', '2026-06-27 05:22:31', NULL, NULL, NULL, NULL),
(5, 1, 5, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(6, 1, 6, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(7, 1, 7, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(8, 1, 8, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(9, 1, 9, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(10, 1, 10, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(11, 1, 11, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(12, 1, 12, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:32', '2026-06-27 05:22:32', NULL, NULL, NULL, NULL),
(13, 1, 13, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(14, 1, 14, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(15, 1, 15, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(16, 1, 16, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(17, 1, 17, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(18, 1, 18, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(19, 2, 1, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(20, 2, 2, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:33', '2026-06-27 05:22:33', NULL, NULL, NULL, NULL),
(21, 2, 3, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:34', '2026-06-27 05:22:34', NULL, NULL, NULL, NULL),
(22, 2, 7, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:34', '2026-06-27 05:22:34', NULL, NULL, NULL, NULL),
(23, 2, 8, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:34', '2026-06-27 05:22:34', NULL, NULL, NULL, NULL),
(24, 2, 9, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:35', '2026-06-27 05:22:35', NULL, NULL, NULL, NULL),
(25, 2, 10, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:35', '2026-06-27 05:22:35', NULL, NULL, NULL, NULL),
(26, 2, 11, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:35', '2026-06-27 05:22:35', NULL, NULL, NULL, NULL),
(27, 2, 13, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:35', '2026-06-27 05:22:35', NULL, NULL, NULL, NULL),
(28, 2, 14, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:35', '2026-06-27 05:22:35', NULL, NULL, NULL, NULL),
(29, 2, 15, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:35', '2026-06-27 05:22:35', NULL, NULL, NULL, NULL),
(30, 2, 16, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:35', '2026-06-27 05:22:35', NULL, NULL, NULL, NULL),
(31, 3, 4, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(32, 3, 5, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(33, 3, 6, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(34, 3, 16, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(35, 3, 17, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(36, 3, 1, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(37, 4, 10, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(38, 4, 11, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(39, 4, 12, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(40, 4, 1, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:36', '2026-06-27 05:22:36', NULL, NULL, NULL, NULL),
(41, 4, 2, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:37', '2026-06-27 05:22:37', NULL, NULL, NULL, NULL),
(42, 4, 16, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:37', '2026-06-27 05:22:37', NULL, NULL, NULL, NULL),
(43, 1, 19, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(44, 4, 19, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(45, 1, 20, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(46, 4, 20, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(47, 1, 21, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(48, 4, 21, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 01:20:22', '2026-06-28 01:20:22', NULL, NULL, NULL, NULL),
(49, 1, 22, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:07:07', '2026-06-28 03:07:07', NULL, NULL, NULL, NULL),
(50, 1, 23, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:07:08', '2026-06-28 03:07:08', NULL, NULL, NULL, NULL),
(51, 1, 24, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-28 03:07:08', '2026-06-28 03:07:08', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `category`, `remarks`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 'system', 'VSP', 'system', NULL, 0, 0, NULL, '2026-03-31 19:40:06', NULL, NULL, NULL, NULL, NULL),
(2, 'version', '1.0', 'system', NULL, 0, 0, NULL, '2026-03-31 19:40:06', NULL, NULL, NULL, NULL, NULL),
(3, 'otp', '0', 'security', NULL, 0, 0, NULL, '2026-03-31 19:40:06', NULL, NULL, NULL, NULL, NULL),
(4, 'whitelist', '0', 'security', NULL, 0, 0, NULL, '2026-03-31 19:40:06', NULL, NULL, NULL, NULL, NULL),
(5, 'title', 'VSP Workforce Management', NULL, NULL, 0, 0, NULL, '2026-03-30 04:07:33', NULL, NULL, NULL, NULL, NULL),
(6, 'subtitle', 'Vital Solution Partners - Workforce Management Platform', 'site', NULL, 0, 0, NULL, '2026-03-31 19:40:06', NULL, NULL, NULL, NULL, NULL),
(7, 'emails', '[\"info@template.com\", \"support@template.com\"]', 'contact', NULL, 0, 0, NULL, '2026-03-30 03:22:59', NULL, NULL, NULL, NULL, NULL),
(8, 'phones', '[\"+63 935 000 0000\", \"+63 935 111 1111\"]', NULL, NULL, 0, 0, NULL, '2026-03-30 04:26:58', NULL, NULL, NULL, NULL, NULL),
(9, 'socials', '[{\"icon\":\"facebook\",\"href\":\"https://facebook.com\"},{\"icon\":\"instagram\",\"href\":\"https://instagram.com\"},{\"icon\":\"linkedin\",\"href\":\"https://linkedin.com\"},{\"icon\":\"twitter\",\"href\":\"https://x.com\"}]', NULL, NULL, 0, 0, NULL, '2026-03-30 04:22:38', NULL, NULL, NULL, NULL, NULL),
(10, 'footer_logo', '/default/logo/logo.png', 'footer', NULL, 0, 0, NULL, '2026-03-30 03:22:59', NULL, NULL, NULL, NULL, NULL),
(11, 'footer_about', '<b>- Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s...', 'footer', NULL, 0, 0, NULL, '2026-03-30 03:22:59', NULL, NULL, NULL, NULL, NULL),
(12, 'logo', 'logo.png', NULL, NULL, 0, 0, NULL, '2026-04-05 12:18:47', NULL, NULL, NULL, NULL, NULL),
(13, 'dashboard_logo', 'dashboard.png', NULL, NULL, 0, 0, NULL, '2026-04-05 12:18:56', NULL, NULL, NULL, NULL, NULL),
(14, 'desktop_interaction_mode', 'click', NULL, NULL, 0, 0, NULL, '2026-06-07 03:03:40', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`id`, `slug`, `is_active`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 'vsp', 1, 'Vital Solution Partners', NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:27', '2026-06-27 05:22:27', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `time_entries`
--

CREATE TABLE `time_entries` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_employee` int(10) UNSIGNED NOT NULL,
  `id_client` int(10) UNSIGNED DEFAULT NULL,
  `date` date NOT NULL,
  `hours_worked` decimal(6,2) NOT NULL DEFAULT 0.00,
  `activity_percent` int(11) DEFAULT NULL,
  `source` varchar(20) NOT NULL DEFAULT 'manual' COMMENT 'hubstaff, manual',
  `hubstaff_id` varchar(50) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trim`
--

CREATE TABLE `trim` (
  `id` int(11) NOT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `trim`
--

INSERT INTO `trim` (`id`, `name`, `remarks`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 'Test Name', 'Remarks here', 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(2, 'Another Name', 'Description here', 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `id_position` int(11) DEFAULT NULL,
  `fn` varchar(30) DEFAULT NULL,
  `mn` varchar(30) DEFAULT NULL,
  `sn` varchar(30) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `bday` date DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `photo_filename` varchar(200) DEFAULT NULL,
  `otp` smallint(1) DEFAULT 0,
  `event` smallint(1) DEFAULT 1,
  `notification` smallint(1) NOT NULL DEFAULT 1,
  `un` varchar(30) DEFAULT NULL,
  `pw` varchar(100) DEFAULT NULL,
  `sidebar` smallint(1) NOT NULL DEFAULT 0,
  `dark` smallint(1) NOT NULL DEFAULT 0,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `id_position`, `fn`, `mn`, `sn`, `gender`, `bday`, `phone`, `email`, `address`, `photo_filename`, `otp`, `event`, `notification`, `un`, `pw`, `sidebar`, `dark`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 1, 'Jeric', 'V.', 'Celevante', '1', '1986-08-27', '0935 663 8566', 'jericcelevante.se@gmail.com', '', 'ani-profile.webp', 0, 1, 1, 'admin', '$2b$10$58l6zJmWyNVV4YoEGXrIO.Zqv2.1WZ3oIq1cQgn4Hjrj.7CTBWxdq', 0, 1, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(2, 2, 'Jason', 'Valdez', 'Celevante', '2', '1899-11-18', '0910-000-0000', 'jericcelevante.sa@gmail.com', 'Cedar 1, Carmona, Cavite', 'sonjay.jpg', 0, 1, 1, '@jason2025', '$2a$12$7yMk7T80DK0jMcN8XfQRL.bE8I5gt6Dk62DlFcvn5cWc5oJpWiLyO', 0, 1, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(3, 3, 'Magno', 'R.', 'Magno', '1', '1899-11-23', '', 'magnosquare17@gmail.com', '', 'mags.webp', 0, 1, 1, 'magno', '$2a$10$FPWX2GJZ..RM099NNX8cFO6GrZ9GlV6pl6F4SZrrWMEA2bVQc4K9.', 0, 0, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_position`
--

CREATE TABLE `user_position` (
  `id` int(11) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `type` smallint(1) DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `archived` smallint(1) NOT NULL DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_position`
--

INSERT INTO `user_position` (`id`, `name`, `type`, `remarks`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, 'Programmer', 1, NULL, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(2, 'Superuser', 1, NULL, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(3, 'Administrator', 1, NULL, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(4, 'User', 1, NULL, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(5, 'Employee', 2, NULL, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(6, 'Client', 3, NULL, 0, 0, 1, '2025-08-26 08:20:33', NULL, NULL, NULL, NULL, NULL),
(7, 'HR Manager', 1, 'Human Resources Management', 0, 0, 1, '2026-06-27 05:22:37', NULL, NULL, NULL, NULL, NULL),
(8, 'Recruitment Specialist', 1, 'Talent Acquisition', 0, 0, 1, '2026-06-27 05:22:37', NULL, NULL, NULL, NULL, NULL),
(9, 'Finance Officer', 1, 'Financial Operations', 0, 0, 1, '2026-06-27 05:22:38', NULL, NULL, NULL, NULL, NULL),
(10, 'Operations Lead', 1, 'Operations Management', 0, 0, 1, '2026-06-27 05:22:38', NULL, NULL, NULL, NULL, NULL),
(11, 'Team Lead', 2, 'Employee Team Leadership', 0, 0, 1, '2026-06-27 05:22:38', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `user_type` varchar(10) NOT NULL DEFAULT '0' COMMENT '0=admin, 1=employee, 2=client',
  `id_role` int(10) UNSIGNED NOT NULL,
  `name` varchar(300) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `tenant_id` int(11) NOT NULL DEFAULT 1,
  `inactive` smallint(6) DEFAULT 0,
  `archived` smallint(6) NOT NULL DEFAULT 0,
  `changelog` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) UNSIGNED DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `id_user`, `user_type`, `id_role`, `name`, `remarks`, `tenant_id`, `inactive`, `archived`, `changelog`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`) VALUES
(1, 1, '0', 1, NULL, NULL, 1, 0, 0, NULL, NULL, '2026-06-27 05:22:39', '2026-06-27 05:22:39', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `web_footers`
--

CREATE TABLE `web_footers` (
  `id` int(11) NOT NULL,
  `id_project` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'Default Footer',
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `settings_draft` longtext DEFAULT NULL,
  `settings_live` longtext DEFAULT NULL,
  `content_draft` longtext DEFAULT NULL,
  `content_live` longtext DEFAULT NULL,
  `inactive` tinyint(1) NOT NULL DEFAULT 0,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_footers`
--

INSERT INTO `web_footers` (`id`, `id_project`, `name`, `status`, `settings_draft`, `settings_live`, `content_draft`, `content_live`, `inactive`, `archived`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, NULL, 'Default', 'published', '{\"bgColor\":\"#f8a0a0\",\"padding\":\"40px 20px\",\"color\":\"\",\"layout\":\"flex-block\",\"gap\":\"\",\"alignItems\":\"stretch\",\"justifyContent\":\"space-between\",\"innerClass\":\"footer-content-wrapper\",\"overlayColor\":\"#f74040\",\"overlayOpacity\":0,\"boxShadow\":\"\"}', '{\"bgColor\":\"#f8a0a0\",\"padding\":\"40px 20px\",\"color\":\"\",\"layout\":\"flex-block\",\"gap\":\"\",\"alignItems\":\"stretch\",\"justifyContent\":\"space-between\",\"innerClass\":\"footer-content-wrapper\",\"overlayColor\":\"#f74040\",\"overlayOpacity\":0,\"boxShadow\":\"\"}', '[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"130px\",\"bg-image\":\"http://localhost:3010/images/logo.webp\",\"width\":\"130px\"}}]', '[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"130px\",\"bg-image\":\"http://localhost:3010/images/logo.webp\",\"width\":\"130px\"}}]', 0, 0, 1, '2026-05-18 01:06:00', '2026-06-26 04:25:04', NULL, NULL, NULL, NULL, '[{\"timestamp\":\"2026-06-26T12:25:03.502Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3010/images/logo.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"130px\\\",\\\"bg-image\\\":\\\"http://localhost:3010/images/logo.webp\\\",\\\"width\\\":\\\"130px\\\"}}]\"}}},{\"timestamp\":\"2026-06-26T12:04:07.732Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3010/images/ai-logo.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3010/images/logo.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\"}}},{\"timestamp\":\"2026-06-26T11:55:50.255Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/ai-logo.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3010/images/ai-logo.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\"}}},{\"timestamp\":\"2026-05-23T22:33:27.460Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"#f8a0a0\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\",\\\"overlayColor\\\":\\\"#f74040\\\",\\\"overlayOpacity\\\":0,\\\"boxShadow\\\":\\\"0px 0px 20px 0px #000000\\\"}\",\"to\":\"{\\\"bgColor\\\":\\\"#f8a0a0\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\",\\\"overlayColor\\\":\\\"#f74040\\\",\\\"overlayOpacity\\\":0,\\\"boxShadow\\\":\\\"\\\"}\"}}},{\"timestamp\":\"2026-05-23T22:33:17.904Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"#f8a0a0\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\",\\\"overlayColor\\\":\\\"#f74040\\\",\\\"overlayOpacity\\\":0}\",\"to\":\"{\\\"bgColor\\\":\\\"#f8a0a0\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\",\\\"overlayColor\\\":\\\"#f74040\\\",\\\"overlayOpacity\\\":0,\\\"boxShadow\\\":\\\"0px 0px 20px 0px #000000\\\"}\"}}},{\"timestamp\":\"2026-05-23T20:39:14.019Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/e426d889190642ec81c95121c8227bd3d12feed7e2aca10e4e145b1dd2aaa518.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/ai-logo.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\"}}},{\"timestamp\":\"2026-05-23T19:15:45.346Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"237px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/e426d889190642ec81c95121c8227bd3d12feed7e2aca10e4e145b1dd2aaa518.webp\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"157px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/e426d889190642ec81c95121c8227bd3d12feed7e2aca10e4e145b1dd2aaa518.webp\\\",\\\"width\\\":\\\"131px\\\"}}]\"}}},{\"timestamp\":\"2026-05-23T07:59:36.074Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"252px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/e426d889190642ec81c95121c8227bd3d12feed7e2aca10e4e145b1dd2aaa518.webp\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"237px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/e426d889190642ec81c95121c8227bd3d12feed7e2aca10e4e145b1dd2aaa518.webp\\\"}}]\"}}},{\"timestamp\":\"2026-05-23T07:59:20.589Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\"}\",\"to\":\"{\\\"bgColor\\\":\\\"#f8a0a0\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\",\\\"overlayColor\\\":\\\"#f74040\\\",\\\"overlayOpacity\\\":0}\"}}},{\"timestamp\":\"2026-05-23T07:58:06.393Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[]\",\"to\":\"[{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"252px\\\",\\\"bg-image\\\":\\\"http://localhost:3000/images/e426d889190642ec81c95121c8227bd3d12feed7e2aca10e4e145b1dd2aaa518.webp\\\"}}]\"}}},{\"timestamp\":\"2026-05-18T23:48:18.505Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\",\\\"text-align\\\":\\\"center\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\",\"to\":\"[]\"}}},{\"timestamp\":\"2026-05-18T23:40:24.233Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\",\"to\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\",\\\"text-align\\\":\\\"center\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\"},\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"#0f172a\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"#94a3b8\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"30px\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\"}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"40px 20px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"stretch\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"footer-content-wrapper\\\"}\"}}},{\"timestamp\":\"2026-05-18T10:39:47.285Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\",\"to\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\"}}},{\"timestamp\":\"2026-05-18T10:39:40.014Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"flex-start\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"gap\\\":\\\"40px\\\",\\\"width\\\":\\\"100%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"15px\\\",\\\"width\\\":\\\"250px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"Simplifying and elevating the digital publishing experience through intelligent dynamic blocks.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Company\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"About Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/about\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Solutions\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Patients\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/patients\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Doctors\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/doctors\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Pharmacies\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/pharmacies\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Connect\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Contact Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/contact\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Support\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/support\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Locations\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/locations\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\",\"to\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\"}}},{\"timestamp\":\"2026-05-18T10:39:33.118Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"flex-start\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"gap\\\":\\\"40px\\\",\\\"width\\\":\\\"100%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"15px\\\",\\\"width\\\":\\\"250px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"Simplifying and elevating the digital publishing experience through intelligent dynamic blocks.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Company\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"About Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/about\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Platform\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/platform\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Solutions\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Patients\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/patients\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Doctors\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/doctors\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Pharmacies\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/pharmacies\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Connect\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Contact Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/contact\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Support\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/support\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Locations\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/locations\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\",\"to\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"flex-start\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"gap\\\":\\\"40px\\\",\\\"width\\\":\\\"100%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"15px\\\",\\\"width\\\":\\\"250px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"Simplifying and elevating the digital publishing experience through intelligent dynamic blocks.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Company\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"About Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/about\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Solutions\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Patients\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/patients\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Doctors\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/doctors\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Pharmacies\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/pharmacies\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Connect\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Contact Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/contact\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Support\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/support\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Locations\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/locations\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\"}}},{\"timestamp\":\"2026-05-18T10:37:08.685Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"flex-start\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"gap\\\":\\\"40px\\\",\\\"width\\\":\\\"100%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"15px\\\",\\\"width\\\":\\\"250px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"Simplifying and elevating the digital publishing experience through intelligent dynamic blocks.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"10px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"facebook\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"instagram\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"twitter\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Company\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"About Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/about\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Platform\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/platform\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Careers\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/careers\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Solutions\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Patients\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/patients\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Doctors\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/doctors\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Pharmacies\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/pharmacies\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Connect\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Contact Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/contact\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Support\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/support\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Locations\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/locations\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\",\"to\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"flex-start\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"gap\\\":\\\"40px\\\",\\\"width\\\":\\\"100%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"15px\\\",\\\"width\\\":\\\"250px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"Simplifying and elevating the digital publishing experience through intelligent dynamic blocks.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Company\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"About Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/about\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Platform\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/platform\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Solutions\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Patients\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/patients\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Doctors\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/doctors\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Pharmacies\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/pharmacies\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Connect\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Contact Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/contact\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Support\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/support\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Locations\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/locations\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\"}}},{\"timestamp\":\"2026-05-18T10:31:24.987Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"flex-start\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"gap\\\":\\\"40px\\\",\\\"width\\\":\\\"100%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"15px\\\",\\\"width\\\":\\\"250px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h3\\\",\\\"content\\\":\\\"CMX Studio\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"20px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"Simplifying and elevating the digital publishing experience through intelligent dynamic blocks.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"10px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"facebook\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"instagram\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"twitter\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Company\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"About Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/about\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Platform\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/platform\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Careers\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/careers\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Solutions\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Patients\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/patients\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Doctors\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/doctors\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Pharmacies\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/pharmacies\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Connect\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Contact Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/contact\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Support\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/support\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Locations\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/locations\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\",\"to\":\"[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"flex-start\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"gap\\\":\\\"40px\\\",\\\"width\\\":\\\"100%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"15px\\\",\\\"width\\\":\\\"250px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"Simplifying and elevating the digital publishing experience through intelligent dynamic blocks.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"10px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"facebook\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"instagram\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"icon\\\",\\\"properties\\\":{\\\"icon\\\":\\\"twitter\\\",\\\"size\\\":\\\"20px\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Company\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"About Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/about\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Platform\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/platform\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Careers\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/careers\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Solutions\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Patients\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/patients\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Doctors\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/doctors\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"For Pharmacies\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/pharmacies\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"column\\\",\\\"gap\\\":\\\"12px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Connect\\\",\\\"properties\\\":{\\\"color\\\":\\\"#ffffff\\\",\\\"font-size\\\":\\\"16px\\\",\\\"font-weight\\\":\\\"bold\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Contact Us\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/contact\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Support\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/support\\\",\\\"color\\\":\\\"#94a3b8\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Locations\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"14px\\\",\\\"href\\\":\\\"/locations\\\",\\\"color\\\":\\\"#94a3b8\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"border-top\\\":\\\"1px solid #1e293b\\\",\\\"width\\\":\\\"100%\\\",\\\"margin-top\\\":\\\"20px\\\",\\\"margin-bottom\\\":\\\"10px\\\"},\\\"blocks\\\":[]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"justify-content\\\":\\\"space-between\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-wrap\\\":\\\"wrap\\\",\\\"width\\\":\\\"100%\\\",\\\"gap\\\":\\\"15px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"&copy; 2026 CMX Corp. All rights reserved.\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"flex-direction\\\":\\\"row\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Privacy Policy\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/privacy\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Terms of Service\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/terms\\\",\\\"color\\\":\\\"#64748b\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Cookie Settings\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"12px\\\",\\\"href\\\":\\\"/cookies\\\",\\\"color\\\":\\\"#64748b\\\"}}]}]}]\"}}}]');

-- --------------------------------------------------------

--
-- Table structure for table `web_headers`
--

CREATE TABLE `web_headers` (
  `id` int(11) NOT NULL,
  `id_project` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'Default Header',
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `settings_draft` longtext DEFAULT NULL,
  `settings_live` longtext DEFAULT NULL,
  `content_draft` longtext DEFAULT NULL,
  `content_live` longtext DEFAULT NULL,
  `inactive` tinyint(1) NOT NULL DEFAULT 0,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_headers`
--

INSERT INTO `web_headers` (`id`, `id_project`, `name`, `status`, `settings_draft`, `settings_live`, `content_draft`, `content_live`, `inactive`, `archived`, `created_by`, `created_at`, `updated_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, NULL, 'Default', 'published', '{\"bgColor\":\"\",\"padding\":\"0px\",\"color\":\"\",\"layout\":\"flex-block\",\"gap\":\"\",\"alignItems\":\"center\",\"justifyContent\":\"space-between\",\"innerClass\":\"\",\"height\":\"auto\",\"boxShadow\":\"0px 0px 8px 0px #766f6f\",\"top\":\"0px\",\"overlayColor\":\"#000000\",\"overlayOpacity\":0,\"bgImage\":\"\",\"position\":\"sticky\",\"hideMobile\":false,\"hideTablet\":false,\"showTitle\":true,\"showSubtitle\":true,\"showCustomButtons\":false,\"navAlign\":\"center\",\"logoLinkToHome\":true,\"navSettings\":{\"color\":\"\",\"hideMobile\":true,\"gap\":\"\",\"justifyContent\":\"flex-end\",\"bgColor\":\"\",\"alignItems\":\"center\",\"padding\":\"0px 0px 0px 0px\",\"height\":\"auto\",\"transition\":\"all 0.8s ease\",\"hoverScale\":\"zoom\",\"hoverBgColor\":\"\",\"hideTablet\":false,\"mobileNavStyle\":\"popup\"},\"margin\":\"0px\",\"fontSize\":\"\",\"fontWeight\":\"700\",\"fontStyle\":\"italic\",\"textDecoration\":\"underline\",\"hoverColor\":\"\",\"hoverTextDecoration\":\"none\",\"hoverNavAlign\":\"right\",\"hoverTransition\":\"\",\"hoverHoverScale\":\"\",\"dropdownTrigger\":\"click\",\"responsive\":{\"tablet\":{\"gap\":\"10px\",\"navSettings\":{\"gap\":\"0px\"},\"bgColor\":\"\"}}}', '{\"bgColor\":\"\",\"padding\":\"0px\",\"color\":\"\",\"layout\":\"flex-block\",\"gap\":\"\",\"alignItems\":\"center\",\"justifyContent\":\"space-between\",\"innerClass\":\"\",\"height\":\"auto\",\"boxShadow\":\"0px 0px 8px 0px #766f6f\",\"top\":\"0px\",\"overlayColor\":\"#000000\",\"overlayOpacity\":0,\"bgImage\":\"\",\"position\":\"sticky\",\"hideMobile\":false,\"hideTablet\":false,\"showTitle\":true,\"showSubtitle\":true,\"showCustomButtons\":false,\"navAlign\":\"center\",\"logoLinkToHome\":true,\"navSettings\":{\"color\":\"\",\"hideMobile\":true,\"gap\":\"\",\"justifyContent\":\"flex-end\",\"bgColor\":\"\",\"alignItems\":\"center\",\"padding\":\"0px 0px 0px 0px\",\"height\":\"auto\",\"transition\":\"all 0.8s ease\",\"hoverScale\":\"zoom\",\"hoverBgColor\":\"\",\"hideTablet\":false,\"mobileNavStyle\":\"popup\"},\"margin\":\"0px\",\"fontSize\":\"\",\"fontWeight\":\"700\",\"fontStyle\":\"italic\",\"textDecoration\":\"underline\",\"hoverColor\":\"\",\"hoverTextDecoration\":\"none\",\"hoverNavAlign\":\"right\",\"hoverTransition\":\"\",\"hoverHoverScale\":\"\",\"dropdownTrigger\":\"click\",\"responsive\":{\"tablet\":{\"gap\":\"10px\",\"navSettings\":{\"gap\":\"0px\"},\"bgColor\":\"\"}}}', '[{\"block_type\":\"text\",\"tag\":\"h1\",\"content\":\"<b>HEADER</b>\",\"properties\":{\"margin\":\"0\",\"color\":\"#1178ac\",\"width\":\"72px\",\"font-size\":\"16px\",\"height\":\"auto\"}},{\"block_type\":\"text\",\"tag\":\"h4\",\"content\":\"Subtitle here\",\"properties\":{\"margin\":\"0\",\"color\":\"#469dc8\",\"font-weight\":\"normal\",\"height\":\"10px\",\"font-size\":\"10.7px\",\"width\":\"69px\"}},null,null,null,null,{\"properties\":{\"width\":\"243px\"}}]', '[{\"block_type\":\"text\",\"tag\":\"h1\",\"content\":\"<b>HEADER</b>\",\"properties\":{\"margin\":\"0\",\"color\":\"#1178ac\",\"width\":\"72px\",\"font-size\":\"16px\",\"height\":\"auto\"}},{\"block_type\":\"text\",\"tag\":\"h4\",\"content\":\"Subtitle here\",\"properties\":{\"margin\":\"0\",\"color\":\"#469dc8\",\"font-weight\":\"normal\",\"height\":\"10px\",\"font-size\":\"10.7px\",\"width\":\"69px\"}},null,null,null,null,{\"properties\":{\"width\":\"243px\"}}]', 0, 0, 1, '2026-05-20 04:42:07', '2026-06-24 16:47:28', NULL, NULL, NULL, NULL, '[{\"timestamp\":\"2026-06-25T00:47:27.969Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"flex-end\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"flex-end\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-25T00:20:00.656Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"flex-end\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-25T00:08:08.513Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-25T00:07:51.119Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-25T00:07:30.814Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h1\\\",\\\"content\\\":\\\"<b>HEADER</b>\\\",\\\"properties\\\":{\\\"margin\\\":\\\"0\\\",\\\"color\\\":\\\"#1178ac\\\",\\\"width\\\":\\\"72px\\\",\\\"font-size\\\":\\\"16px\\\",\\\"height\\\":\\\"auto\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Subtitle here\\\",\\\"properties\\\":{\\\"margin\\\":\\\"0\\\",\\\"color\\\":\\\"#469dc8\\\",\\\"font-weight\\\":\\\"normal\\\",\\\"height\\\":\\\"10px\\\",\\\"font-size\\\":\\\"10.7px\\\",\\\"width\\\":\\\"69px\\\"}},null,null,null,null,{\\\"properties\\\":{\\\"width\\\":\\\"243px\\\"}},{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Test Link\\\",\\\"properties\\\":{\\\"width\\\":\\\"96px\\\",\\\"hideMobile\\\":true}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h1\\\",\\\"content\\\":\\\"<b>HEADER</b>\\\",\\\"properties\\\":{\\\"margin\\\":\\\"0\\\",\\\"color\\\":\\\"#1178ac\\\",\\\"width\\\":\\\"72px\\\",\\\"font-size\\\":\\\"16px\\\",\\\"height\\\":\\\"auto\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h4\\\",\\\"content\\\":\\\"Subtitle here\\\",\\\"properties\\\":{\\\"margin\\\":\\\"0\\\",\\\"color\\\":\\\"#469dc8\\\",\\\"font-weight\\\":\\\"normal\\\",\\\"height\\\":\\\"10px\\\",\\\"font-size\\\":\\\"10.7px\\\",\\\"width\\\":\\\"69px\\\"}},null,null,null,null,{\\\"properties\\\":{\\\"width\\\":\\\"243px\\\"}}]\"},\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":false,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T01:56:44.599Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T01:56:13.077Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T01:43:21.228Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T01:41:09.371Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T00:59:50.453Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T00:59:34.855Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T00:40:08.569Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T00:26:27.423Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-23T00:25:55.011Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T16:33:10.372Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T16:31:34.782Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T16:19:28.510Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"click\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T13:10:25.982Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T12:45:41.743Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T12:44:25.685Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T12:43:59.012Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-22T01:11:03.309Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-21T01:09:23.201Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-21T00:45:03.555Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-21T00:44:40.607Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"drawer\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-06-21T00:14:07.397Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0px\\\",\\\"color\\\":\\\"\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"gap\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"innerClass\\\":\\\"\\\",\\\"height\\\":\\\"auto\\\",\\\"boxShadow\\\":\\\"0px 0px 8px 0px #766f6f\\\",\\\"top\\\":\\\"0px\\\",\\\"overlayColor\\\":\\\"#000000\\\",\\\"overlayOpacity\\\":0,\\\"bgImage\\\":\\\"\\\",\\\"position\\\":\\\"sticky\\\",\\\"hideMobile\\\":false,\\\"hideTablet\\\":false,\\\"showTitle\\\":true,\\\"showSubtitle\\\":true,\\\"showCustomButtons\\\":true,\\\"navAlign\\\":\\\"center\\\",\\\"logoLinkToHome\\\":true,\\\"navSettings\\\":{\\\"color\\\":\\\"\\\",\\\"hideMobile\\\":true,\\\"gap\\\":\\\"\\\",\\\"justifyContent\\\":\\\"center\\\",\\\"bgColor\\\":\\\"\\\",\\\"alignItems\\\":\\\"center\\\",\\\"padding\\\":\\\"0px 0px 0px 0px\\\",\\\"height\\\":\\\"auto\\\",\\\"transition\\\":\\\"all 0.8s ease\\\",\\\"hoverScale\\\":\\\"zoom\\\",\\\"hoverBgColor\\\":\\\"\\\",\\\"hideTablet\\\":false,\\\"mobileNavStyle\\\":\\\"popup\\\"},\\\"margin\\\":\\\"0px\\\",\\\"fontSize\\\":\\\"\\\",\\\"fontWeight\\\":\\\"700\\\",\\\"fontStyle\\\":\\\"italic\\\",\\\"textDecoration\\\":\\\"underline\\\",\\\"hoverColor\\\":\\\"\\\",\\\"hoverTextDecoration\\\":\\\"none\\\",\\\"hoverNavAlign\\\":\\\"right\\\",\\\"hoverTransition\\\":\\\"\\\",\\\"hoverHoverScale\\\":\\\"\\\",\\\"dropdownTrigger\\\":\\\"hover\\\",\\\"responsive\\\":{\\\"tablet\\\":{\\\"gap\\\":\\\"10px\\\",\\\"navSettings\\\":{\\\"gap\\\":\\\"0px\\\"},\\\"bgColor\\\":\\\"\\\"}}}\",\"to\":\"{\\\"bgColor\\\":\\\"\\\",\\\"padding\\\":\\\"5px 0px 5px 0p');

-- --------------------------------------------------------

--
-- Table structure for table `web_navigations`
--

CREATE TABLE `web_navigations` (
  `id` int(11) NOT NULL,
  `id_project` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `style_role` varchar(50) DEFAULT 'default',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `type` varchar(50) DEFAULT '''internal''',
  `target` varchar(20) DEFAULT '''_self''',
  `archived` smallint(1) DEFAULT 0,
  `inactive` smallint(1) DEFAULT 0,
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(10) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL,
  `settings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_navigations`
--

INSERT INTO `web_navigations` (`id`, `id_project`, `parent_id`, `label`, `url`, `style_role`, `sort_order`, `type`, `target`, `archived`, `inactive`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`, `settings`) VALUES
(1, NULL, NULL, 'About', '/about', 'default', 0, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{\"target\":\"_self\",\"title\":\"AboutX\",\"aria-label\":\"AboutYY\",\"hideTablet\":false,\"hideMobile\":false,\"font-size\":\"\",\"color\":\"\",\"width\":\"\",\"height\":\"\"}'),
(2, NULL, NULL, 'Platform', '/platform', 'default', 1, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{\"hideTablet\":true,\"hideMobile\":true,\"width\":\"auto\",\"height\":\"auto\"}'),
(3, NULL, NULL, 'Solutions', NULL, 'default', 2, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{}'),
(4, NULL, 3, 'For Patients', '/solutions/patients', 'default', 7, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{\"hideMobile\":true}'),
(5, NULL, 3, 'For Doctors', '/solutions/doctors', 'default', 9, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{}'),
(6, NULL, 3, 'For Pharmacies', '/solutions/pharmacies', 'default', 10, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{}'),
(7, NULL, 8, 'Healthcare Organizations', '', 'default', 8, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{\"width\":\"223px\"}'),
(8, NULL, NULL, 'Resources', '', 'default', 3, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{}'),
(9, NULL, NULL, 'Careers', '/careers', 'default', 4, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{}'),
(10, NULL, NULL, 'Contact', '/contact', 'default', 5, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{\"transition\":\"all 0.1s ease\",\"hover-scale\":\"zoom\",\"bg-color\":\"\",\"hover-hover-bg-color\":\"#b11010\",\"padding\":\"0px 0px 0px 0px\"}'),
(11, NULL, NULL, 'Login', '/login', 'primary-button', 6, 'internal', '_self', 0, 0, NULL, '2026-06-07 02:55:37', NULL, NULL, NULL, NULL, NULL, '{\"button-style\":\"btn-primary\",\"transition\":\"all 0.8s ease\",\"hover-scale\":\"zoom\",\"hover-hover-bg-color\":\"#ce2c2c\",\"bg-color\":\"\",\"overlay-color\":\"#000000\",\"overlay-opacity\":0,\"hideTablet\":true,\"hideMobile\":false,\"button-variant\":\"btn-pill\",\"button-size\":\"\",\"iconRight\":\"login\"}'),
(17, NULL, NULL, 'Local Test', NULL, 'default', 8, 'external', '_self', 0, 1, NULL, '2026-06-07 03:19:21', 1, '2026-06-08 14:55:00', NULL, NULL, NULL, NULL),
(18, NULL, 8, 'New Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-23 07:31:45', NULL, NULL, NULL, NULL, NULL, '{}'),
(19, NULL, NULL, 'New Link', '#', 'default', 7, '\'internal\'', '_self', 1, 1, NULL, '2026-06-23 07:31:52', NULL, NULL, NULL, NULL, NULL, '{}'),
(20, NULL, 8, 'New Link', '#', 'default', 12, '\'internal\'', '_self', 1, 1, NULL, '2026-06-23 07:31:52', NULL, NULL, NULL, NULL, NULL, '{}'),
(21, NULL, NULL, 'New Link', '#', 'default', 7, '\'internal\'', '_self', 1, 1, NULL, '2026-06-23 07:42:43', NULL, NULL, NULL, NULL, NULL, '{}'),
(22, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:07:30', NULL, NULL, NULL, NULL, NULL, '{}'),
(23, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:07:51', NULL, NULL, NULL, NULL, NULL, '{}'),
(24, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:08:08', NULL, NULL, NULL, NULL, NULL, '{}'),
(25, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:09:05', NULL, NULL, NULL, NULL, NULL, '{}'),
(26, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:09:31', NULL, NULL, NULL, NULL, NULL, '{}'),
(27, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:10:53', NULL, NULL, NULL, NULL, NULL, '{}'),
(28, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:11:40', NULL, NULL, NULL, NULL, NULL, '{}'),
(29, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:12:20', NULL, NULL, NULL, NULL, NULL, '{}'),
(30, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:12:55', NULL, NULL, NULL, NULL, NULL, '{}'),
(31, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:15:53', NULL, NULL, NULL, NULL, NULL, '{}'),
(32, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:17:35', NULL, NULL, NULL, NULL, NULL, '{}'),
(33, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:20:00', NULL, NULL, NULL, NULL, NULL, '{}'),
(34, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:20:46', NULL, NULL, NULL, NULL, NULL, '{}'),
(35, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:22:41', NULL, NULL, NULL, NULL, NULL, '{}'),
(36, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:43:51', NULL, NULL, NULL, NULL, NULL, '{}'),
(37, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:46:56', NULL, NULL, NULL, NULL, NULL, '{}'),
(38, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 1, 1, NULL, '2026-06-24 16:47:27', NULL, NULL, NULL, NULL, NULL, '{}'),
(39, NULL, 8, 'Next Link', '#', 'default', 11, '\'internal\'', '_self', 0, 0, NULL, '2026-06-24 16:52:45', NULL, NULL, NULL, NULL, NULL, '{}');

-- --------------------------------------------------------

--
-- Table structure for table `web_pages`
--

CREATE TABLE `web_pages` (
  `id` int(11) NOT NULL,
  `id_project` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_desc` text DEFAULT NULL,
  `has_header` tinyint(1) DEFAULT 1,
  `has_footer` tinyint(1) DEFAULT 1,
  `status` enum('draft','published') DEFAULT 'draft',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `inactive` tinyint(1) DEFAULT 0,
  `archived` tinyint(1) DEFAULT 0,
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_pages`
--

INSERT INTO `web_pages` (`id`, `id_project`, `title`, `slug`, `meta_title`, `meta_desc`, `has_header`, `has_footer`, `status`, `created_by`, `created_at`, `inactive`, `archived`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(1, NULL, 'Home', 'home', 'Home Test', 'this is the testing', 1, 1, 'published', 1, '2026-04-06 07:17:28', 0, 0, NULL, NULL, NULL, NULL, '[{\"timestamp\":\"2026-05-16T10:26:17.562Z\",\"userId\":1,\"changes\":{\"meta_title\":{\"from\":\"Home Testx\",\"to\":\"Home Test\"}}},{\"timestamp\":\"2026-05-16T10:26:07.147Z\",\"userId\":1,\"changes\":{\"meta_title\":{\"from\":\"Home Test\",\"to\":\"Home Testx\"}}},{\"timestamp\":\"2026-05-13T01:11:08.398Z\",\"userId\":1,\"changes\":{\"status\":{\"from\":\"published\",\"to\":\"draft\"}}},{\"timestamp\":\"2026-05-12T23:32:24.441Z\",\"userId\":1,\"changes\":{\"title\":{\"from\":\"Homes\",\"to\":\"Home\"}}},{\"timestamp\":\"2026-05-12T23:32:18.961Z\",\"userId\":1,\"changes\":{\"title\":{\"from\":\"Home\",\"to\":\"Homes\"}}}]'),
(2, NULL, 'About Us', 'about', 'About Us', 'This is the descriptioin', 1, 1, 'published', 1, '2026-04-07 16:50:22', 0, 0, NULL, NULL, NULL, NULL, '[{\"timestamp\":\"2026-05-16T22:43:44.599Z\",\"userId\":1,\"changes\":{\"title\":{\"from\":\"About UsX\",\"to\":\"About Us\"}}},{\"timestamp\":\"2026-05-16T10:25:33.676Z\",\"userId\":1,\"changes\":{\"title\":{\"from\":\"About Us\",\"to\":\"About UsX\"}}},{\"timestamp\":\"2026-05-16T10:25:09.485Z\",\"userId\":1,\"changes\":{\"title\":{\"from\":\"About UsX\",\"to\":\"About Us\"}}},{\"timestamp\":\"2026-05-16T10:24:04.301Z\",\"userId\":1,\"changes\":{\"title\":{\"from\":\"About Us\",\"to\":\"About UsX\"}}}]'),
(3, NULL, 'Contact Us', 'contact-us', 'Test Page', 'This is just a test', 1, 1, 'published', 1, '2026-04-07 17:06:46', 0, 0, NULL, NULL, NULL, NULL, '[{\"timestamp\":\"2026-05-13T01:18:05.163Z\",\"userId\":1,\"changes\":{\"status\":{\"from\":\"published\",\"to\":\"draft\"}}}]'),
(4, NULL, 'Services', 'services', 'Test Page', '', 1, 1, 'draft', 1, '2026-04-07 17:07:01', 0, 0, NULL, NULL, NULL, NULL, '[{\"timestamp\":\"2026-05-13T01:21:24.166Z\",\"userId\":1,\"changes\":{\"status\":{\"from\":\"published\",\"to\":\"draft\"}}},{\"timestamp\":\"2026-05-12T23:33:03.086Z\",\"userId\":1,\"changes\":{\"status\":{\"from\":\"published\",\"to\":\"draft\"}}},{\"timestamp\":\"2026-05-12T23:32:54.011Z\",\"userId\":1,\"changes\":{\"status\":{\"from\":\"draft\",\"to\":\"published\"}}}]');

-- --------------------------------------------------------

--
-- Table structure for table `web_projects`
--

CREATE TABLE `web_projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `inactive` tinyint(1) DEFAULT 0,
  `archived` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `web_sections`
--

CREATE TABLE `web_sections` (
  `id` int(11) NOT NULL,
  `id_page` int(11) DEFAULT NULL,
  `section_name` varchar(255) DEFAULT '',
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `template` varchar(50) NOT NULL,
  `ord` int(11) DEFAULT 0,
  `inactive` tinyint(1) DEFAULT 0,
  `archived` tinyint(1) DEFAULT 0,
  `content_draft` text DEFAULT NULL COMMENT 'JSON storage for blocks in draft',
  `content_live` text DEFAULT NULL COMMENT 'JSON storage for blocks in live',
  `settings_draft` text DEFAULT NULL COMMENT 'JSON storage for section settings in draft',
  `settings_live` text DEFAULT NULL COMMENT 'JSON storage for section settings in live',
  `created_by` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_by` int(12) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_by` int(10) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `changelog` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_sections`
--

INSERT INTO `web_sections` (`id`, `id_page`, `section_name`, `settings`, `template`, `ord`, `inactive`, `archived`, `content_draft`, `content_live`, `settings_draft`, `settings_live`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(3, 1, 'Full Title', NULL, 'full_title', 0, 1, 0, '[{\"block_type\":\"text\",\"content\":\"Main Headlines in here\",\"properties\":{\"width\":\"\",\"height\":\"\",\"bg-image\":\"\",\"overlay-opacity\":0,\"overlay-color\":\"#f6f4f4\",\"bg-size\":\"contain\"},\"responsive\":{\"mobile\":{\"properties\":{\"width\":\"100%\",\"height\":\"200px\"}}}},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\",\"properties\":{\"height\":\"\",\"text-align\":\"right\",\"bg-image\":\"\"},\"responsive\":{\"mobile\":{\"properties\":{\"width\":\"100%\"}}}}]', '[{\"block_type\":\"text\",\"content\":\"Main Headlines in here\",\"properties\":{\"width\":\"\",\"height\":\"\",\"bg-image\":\"\",\"overlay-opacity\":0,\"overlay-color\":\"#f6f4f4\",\"bg-size\":\"contain\"},\"responsive\":{\"mobile\":{\"properties\":{\"width\":\"100%\",\"height\":\"200px\"}}}},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\",\"properties\":{\"height\":\"\",\"text-align\":\"right\",\"bg-image\":\"\"},\"responsive\":{\"mobile\":{\"properties\":{\"width\":\"100%\"}}}}]', '{\"layout\":\"flex-block\",\"alignItems\":\"center\",\"responsive\":{\"mobile\":{\"gap\":\"30px\",\"padding\":\"020px 0px 020px px\"}},\"bgColor\":\"#fbf9f9\",\"bgImage\":\"\",\"overlayColor\":\"#fb6060\",\"overlayOpacity\":0,\"gap\":\"\"}', '{\"layout\":\"flex-block\",\"alignItems\":\"center\",\"responsive\":{\"mobile\":{\"gap\":\"30px\",\"padding\":\"020px 0px 020px px\"}},\"bgColor\":\"#fbf9f9\",\"bgImage\":\"\",\"overlayColor\":\"#fb6060\",\"overlayOpacity\":0,\"gap\":\"\"}', 1, '2026-05-03 20:39:04', 1, '2026-05-05 15:17:13', NULL, NULL, '[{\"timestamp\":\"2026-05-05T23:07:12.909Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"padding\\\":\\\"020px 0px 020px px\\\"}},\\\"bgColor\\\":\\\"#fbf9f9\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0,\\\"gap\\\":\\\"\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"padding\\\":\\\"020px 0px 020px px\\\"}},\\\"bgColor\\\":\\\"#fbf9f9\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0,\\\"gap\\\":\\\"\\\"}\"}}},{\"timestamp\":\"2026-05-05T23:07:05.511Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines in here\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"100px\\\",\\\"bg-image\\\":\\\"\\\",\\\"overlay-opacity\\\":0,\\\"overlay-color\\\":\\\"#f6f4f4\\\",\\\"bg-size\\\":\\\"contain\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines in here\\\",\\\"properties\\\":{\\\"width\\\":\\\"\\\",\\\"height\\\":\\\"\\\",\\\"bg-image\\\":\\\"\\\",\\\"overlay-opacity\\\":0,\\\"overlay-color\\\":\\\"#f6f4f4\\\",\\\"bg-size\\\":\\\"contain\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\"},\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"padding\\\":\\\"020px 0px 020px px\\\"}},\\\"bgColor\\\":\\\"#fbf9f9\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0,\\\"gap\\\":\\\"50px\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"padding\\\":\\\"020px 0px 020px px\\\"}},\\\"bgColor\\\":\\\"#fbf9f9\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0,\\\"gap\\\":\\\"\\\"}\"}}},{\"timestamp\":\"2026-05-05T23:06:39.908Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines in here\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"100px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\",\\\"bg-size\\\":\\\"contain\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines in here\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"100px\\\",\\\"bg-image\\\":\\\"\\\",\\\"overlay-opacity\\\":0,\\\"overlay-color\\\":\\\"#f6f4f4\\\",\\\"bg-size\\\":\\\"contain\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\"}}},{\"timestamp\":\"2026-05-05T23:03:46.451Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"100px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\",\\\"bg-size\\\":\\\"contain\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines in here\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"100px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\",\\\"bg-size\\\":\\\"contain\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\"}}},{\"timestamp\":\"2026-05-05T23:03:07.992Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\"}},\\\"bgColor\\\":\\\"#fbf9f9\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0,\\\"gap\\\":\\\"50px\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"padding\\\":\\\"020px 0px 020px px\\\"}},\\\"bgColor\\\":\\\"#fbf9f9\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0,\\\"gap\\\":\\\"50px\\\"}\"}}},{\"timestamp\":\"2026-05-05T23:02:21.586Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\"}},\\\"bgColor\\\":\\\"#fdb9b9\\\",\\\"bgImage\\\":\\\"https://imgs.search.brave.com/d6wylHm0_Phl7KYBy-ULR3uBxDySSJlo1wGOryWr7ac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzEv/NjAzLzM4Ny9zbWFs/bC9nZW9tZXRyeS1o/ZXhhZ29uLWRpZ2l0/YWwtaGV4YWdvbi1h/YnN0cmFjdC1iYWNr/Z3JvdW5kLWZ1dHVy/aXN0aWMtbmVvbi13/YWxsLWFic3RyYWN0/LWJhY2tncm91bmQt/Z2VuZXJhdGl2ZS1h/aS1waG90by5qcGc\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0.65}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\"}},\\\"bgColor\\\":\\\"#fbf9f9\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0,\\\"gap\\\":\\\"50px\\\"}\"}}},{\"timestamp\":\"2026-05-05T23:01:55.523Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"300px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"100px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\",\\\"bg-size\\\":\\\"contain\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\"}}},{\"timestamp\":\"2026-05-05T23:01:27.120Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\"}}}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\"}},\\\"bgColor\\\":\\\"#fdb9b9\\\",\\\"bgImage\\\":\\\"https://imgs.search.brave.com/d6wylHm0_Phl7KYBy-ULR3uBxDySSJlo1wGOryWr7ac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzEv/NjAzLzM4Ny9zbWFs/bC9nZW9tZXRyeS1o/ZXhhZ29uLWRpZ2l0/YWwtaGV4YWdvbi1h/YnN0cmFjdC1iYWNr/Z3JvdW5kLWZ1dHVy/aXN0aWMtbmVvbi13/YWxsLWFic3RyYWN0/LWJhY2tncm91bmQt/Z2VuZXJhdGl2ZS1h/aS1waG90by5qcGc\\\",\\\"overlayColor\\\":\\\"#fb6060\\\",\\\"overlayOpacity\\\":0.65}\"}}},{\"timestamp\":\"2026-05-05T22:59:36.635Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"300px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"300px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"height\\\":\\\"200px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}}]\"},\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\"}}}\"}}},{\"timestamp\":\"2026-05-05T22:56:26.160Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"300px\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\",\\\"overlay-opacity\\\":0.65,\\\"overlay-color\\\":\\\"#c56767\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\",\\\"properties\\\":{\\\"height\\\":\\\"200px\\\",\\\"text-align\\\":\\\"right\\\",\\\"bg-image\\\":\\\"https://imgs.search.brave.com/QDq33gd9TMR86I_YH41XyGXs0H1remML9mhSClg5lPE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzc5LzUyLzk3/LzM2MF9GXzM3OTUy/OTc5MV9sbm01cEFN/ZDZjV0FiY2dTZlVK/YmlWQnR1NXN4RGJv/cC5qcGc\\\"}}]\"},\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\"}}},{\"timestamp\":\"2026-05-05T22:30:06.588Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\"}}},{\"timestamp\":\"2026-05-05T22:29:51.824Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"properties\\\":{\\\"width\\\":\\\"50%\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\"}}},{\"timestamp\":\"2026-05-05T21:12:25.422Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-end\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}},{\"timestamp\":\"2026-05-05T21:07:22.432Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-end\\\"}\"}}},{\"timestamp\":\"2026-05-05T21:03:37.713Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}},{\"timestamp\":\"2026-05-05T21:03:27.678Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-end\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\"}}},{\"timestamp\":\"2026-05-05T20:55:25.354Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-end\\\"}\"}}},{\"timestamp\":\"2026-05-05T20:55:18.691Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}},{\"timestamp\":\"2026-05-05T20:35:05.558Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\"}}},{\"timestamp\":\"2026-05-05T20:00:40.128Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}}]'),
(4, 1, 'Full Title', NULL, 'full_title', 1, 1, 0, '[{\"block_type\":\"text\",\"content\":\"Main Headline here\",\"responsive\":{\"mobile\":{\"properties\":{\"gap\":\"30px\",\"tag\":\"h1\"}}}},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\",\"responsive\":{\"mobile\":{\"properties\":{\"gap\":\"30px\"}}}},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '{\"innerClass\":\"c\",\"layout\":\"flex-block\",\"bgImage\":\"\",\"overlayOpacity\":0,\"overlayColor\":\"#ffffff\",\"responsive\":{\"mobile\":{\"gap\":\"30px\",\"bgImage\":\"\"}}}', '{\"innerClass\":\"c\",\"layout\":\"flex-block\",\"bgImage\":\"\",\"overlayOpacity\":0.4,\"overlayColor\":\"#5163ec\",\"responsive\":{\"mobile\":{\"gap\":\"30px\",\"bgImage\":\"\"}}}', 1, '2026-05-04 07:19:20', 1, '2026-05-05 15:18:40', NULL, NULL, '[{\"timestamp\":\"2026-05-05T23:17:41.698Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"30px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline here\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"30px\\\",\\\"tag\\\":\\\"h1\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\"}}},{\"timestamp\":\"2026-05-05T23:16:17.727Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"innerClass\\\":\\\"c\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayOpacity\\\":0.4,\\\"overlayColor\\\":\\\"#5163ec\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"bgImage\\\":\\\"\\\"}}}\",\"to\":\"{\\\"innerClass\\\":\\\"c\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayOpacity\\\":0,\\\"overlayColor\\\":\\\"#ffffff\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"bgImage\\\":\\\"\\\"}}}\"}}},{\"timestamp\":\"2026-05-05T23:06:39.922Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"30px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\"},\"settings_draft\":{\"from\":\"{\\\"innerClass\\\":\\\"c\\\",\\\"layout\\\":\\\"flex-block\\\"}\",\"to\":\"{\\\"innerClass\\\":\\\"c\\\",\\\"layout\\\":\\\"flex-block\\\",\\\"bgImage\\\":\\\"\\\",\\\"overlayOpacity\\\":0.4,\\\"overlayColor\\\":\\\"#5163ec\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"gap\\\":\\\"30px\\\",\\\"bgImage\\\":\\\"\\\"}}}\"}}}]'),
(5, 1, 'Full Title', NULL, 'full_title', 2, 1, 0, '[{\"block_type\":\"text\",\"content\":\"Main Headline\",\"tag\":\"h1\",\"properties\":{\"text-align\":\"left\"}},{\"block_type\":\"text\",\"content\":\"Description and Other text here\",\"tag\":\"p\"}]', '[{\"block_type\":\"text\",\"content\":\"Main Headline\",\"tag\":\"h1\",\"properties\":{\"text-align\":\"left\"}},{\"block_type\":\"text\",\"content\":\"Description and Other text here\",\"tag\":\"p\"}]', '{\"layout\":\"flex-block\",\"alignItems\":\"flex-start\"}', '{\"layout\":\"flex-block\",\"alignItems\":\"flex-start\"}', 1, '2026-05-05 15:17:27', 1, '2026-05-12 19:00:11', NULL, NULL, '[{\"timestamp\":\"2026-05-10T03:03:40.420Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\"}}},{\"timestamp\":\"2026-05-06T00:36:10.823Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"},{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"300px\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"}]\"}}},{\"timestamp\":\"2026-05-06T00:35:58.879Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"},{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"300px\\\"}}]\"}}},{\"timestamp\":\"2026-05-06T00:35:50.935Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"},{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"300px\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"}]\"}}},{\"timestamp\":\"2026-05-06T00:29:06.315Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"},{\\\"block_type\\\":\\\"image\\\",\\\"properties\\\":{\\\"src\\\":\\\"/defaults/no-image.webp\\\",\\\"height\\\":\\\"300px\\\"}}]\"}}},{\"timestamp\":\"2026-05-05T23:59:29.594Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}},{\"timestamp\":\"2026-05-05T23:59:01.334Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headline\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"}]\"}}},{\"timestamp\":\"2026-05-05T23:58:51.732Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines\\\",\\\"tag\\\":\\\"h1\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here...\\\",\\\"tag\\\":\\\"p\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"left\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here\\\",\\\"tag\\\":\\\"p\\\"}]\"}}},{\"timestamp\":\"2026-05-05T23:28:38.364Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines\\\",\\\"tag\\\":\\\"h1\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines\\\",\\\"tag\\\":\\\"h1\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Description and Other text here...\\\",\\\"tag\\\":\\\"p\\\"}]\"}}},{\"timestamp\":\"2026-05-05T23:28:21.650Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Main Headlines\\\",\\\"tag\\\":\\\"h1\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\"}}}]'),
(6, 1, 'Empty Section', NULL, 'empty', 3, 1, 0, '[{\"block_type\":\"text\",\"tag\":\"h1\",\"content\":\"Main Heading\",\"properties\":{\"text-align\":\"center\"}},{\"block_type\":\"text\",\"tag\":\"small\",\"content\":\"Small descriptive text\",\"properties\":{\"text-align\":\"center\",\"width\":\"100%\"}}]', NULL, '{\"alignItems\":\"center\"}', NULL, 1, '2026-05-05 16:37:00', 1, '2026-05-05 16:42:40', NULL, NULL, '[{\"timestamp\":\"2026-05-06T00:40:23.996Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"h1\\\",\\\"content\\\":\\\"Main Heading\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"small\\\",\\\"content\\\":\\\"Small descriptive text\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\"}}]\"},\"settings_draft\":{\"from\":\"{}\",\"to\":\"{\\\"alignItems\\\":\\\"center\\\"}\"}}}]'),
(7, 1, 'Full Title', NULL, 'full_title', 3, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '{\"layout\":\"flex-block\"}', '{\"layout\":\"flex-block\"}', 1, '2026-05-07 06:27:03', 1, '2026-05-12 18:41:04', NULL, NULL, NULL),
(8, 1, 'Full Title', NULL, 'full_title', 4, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '{\"layout\":\"flex-block\"}', '{\"layout\":\"flex-block\"}', 1, '2026-05-07 06:27:04', 1, '2026-05-12 17:24:56', NULL, NULL, NULL),
(9, 1, 'Full Title', NULL, 'full_title', 5, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '{\"layout\":\"flex-block\"}', '{\"layout\":\"flex-block\"}', 1, '2026-05-07 06:27:05', 1, '2026-05-10 15:41:59', NULL, NULL, NULL),
(10, 1, 'Full Title', NULL, 'full_title', 6, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '{\"layout\":\"flex-block\"}', '{\"layout\":\"flex-block\"}', 1, '2026-05-07 13:25:44', 1, '2026-05-10 15:41:56', NULL, NULL, NULL),
(11, 1, 'Full Title', NULL, 'full_title', 7, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '{\"layout\":\"flex-block\"}', '{\"layout\":\"flex-block\"}', 1, '2026-05-07 13:25:47', 1, '2026-05-10 15:41:52', NULL, NULL, NULL),
(12, 1, 'Empty Section', NULL, 'empty', 5, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-05-12 17:23:10', 1, '2026-05-12 17:23:35', NULL, NULL, NULL),
(13, 2, 'Full Title', NULL, 'full_title', 0, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', NULL, '{\"layout\":\"flex-block\"}', NULL, 1, '2026-05-12 17:25:55', 1, '2026-05-12 17:35:15', NULL, NULL, NULL),
(14, 2, 'Empty Section', NULL, 'empty', 1, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-05-12 17:26:05', 1, '2026-05-12 17:35:19', NULL, NULL, NULL),
(15, 2, 'Full Title', NULL, 'full_title', 0, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<font color=\\\"#fafafa\\\">The intelligence behind better healthcare</font>\",\"tag\":\"h1\",\"properties\":{\"font-size\":\"70px\",\"text-align\":\"center\",\"width\":\"70%\",\"margin\":\"150px 0px 0px 0px\"},\"responsive\":{\"mobile\":{\"properties\":{\"width\":\"100%\",\"font-size\":\"40px\",\"margin\":\"50px 0px 0px 0px\"}}}},{\"block_type\":\"text\",\"content\":\"<font color=\\\"#ffffff\\\">Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.</font>\",\"tag\":\"p\",\"properties\":{\"font-size\":\"23px\",\"margin\":\"20px 0px 0px 0px\",\"font-weight\":\"100\",\"width\":\"70%\",\"text-align\":\"center\"},\"responsive\":{\"mobile\":{\"properties\":{\"font-size\":\"\",\"font-weight\":\"\",\"width\":\"100%\"}}}},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"width\":\"400px\",\"margin\":\"50px 0px 0px 0px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"align-items\":\"center\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Get Started\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"10px 20px\",\"border-radius\":\"5px\",\"width\":\"150px\",\"height\":\"40px\",\"text-align\":\"center\"}}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"margin\":\"0px 0px 0px 0px\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Watch Demo\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"10px 20px\",\"border-radius\":\"5px\",\"text-align\":\"center\",\"width\":\"150px\",\"height\":\"40px\"}}]}]}]', NULL, '{\"layout\":\"flex-block\",\"bgImage\":\"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop\",\"height\":\"800px\",\"overlayColor\":\"#0f042f\",\"overlayOpacity\":0.7,\"alignItems\":\"center\",\"responsive\":{\"mobile\":{\"height\":\"400px\"}}}', NULL, 1, '2026-05-12 17:35:23', 1, '2026-05-12 20:18:40', NULL, NULL, '[{\"timestamp\":\"2026-05-13T04:18:31.628Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<font color=\\\\\\\"#fafafa\\\\\\\">The intelligence behind better healthcare</font>\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"70px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"70%\\\",\\\"margin\\\":\\\"150px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"font-size\\\":\\\"40px\\\",\\\"margin\\\":\\\"50px 0px 0px 0px\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<font color=\\\\\\\"#ffffff\\\\\\\">Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.</font>\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"23px\\\",\\\"margin\\\":\\\"20px 0px 0px 0px\\\",\\\"font-weight\\\":\\\"100\\\",\\\"width\\\":\\\"70%\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\",\\\"font-weight\\\":\\\"\\\",\\\"width\\\":\\\"100%\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"400px\\\",\\\"margin\\\":\\\"50px 0px 0px 0px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"align-items\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Get Started\\\",\\\"properties\\\":{\\\"bg-color\\\":\\\"#3b82f6\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"padding\\\":\\\"10px 20px\\\",\\\"border-radius\\\":\\\"5px\\\",\\\"width\\\":\\\"150px\\\",\\\"height\\\":\\\"40px\\\",\\\"text-align\\\":\\\"center\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"margin\\\":\\\"0px 0px 0px 0px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Watch Demo\\\",\\\"properties\\\":{\\\"bg-color\\\":\\\"#3b82f6\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"padding\\\":\\\"10px 20px\\\",\\\"border-radius\\\":\\\"5px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"150px\\\",\\\"height\\\":\\\"40px\\\"}}]}]}]\"},\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"bgImage\\\":\\\"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop\\\",\\\"height\\\":\\\"800px\\\",\\\"overlayColor\\\":\\\"#0f042f\\\",\\\"overlayOpacity\\\":0.7,\\\"alignItems\\\":\\\"center\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"height\\\":\\\"400px\\\"}}}\"}}}]'),
(16, 1, 'Empty Section', NULL, 'empty', 3, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-05-12 18:41:16', 1, '2026-05-12 18:41:20', NULL, NULL, NULL),
(17, 1, 'Full Title', NULL, 'full_title', 0, 1, 0, '[{\"block_type\":\"text\",\"content\":\"Ready to Transform Your Healthcare Experience?\",\"properties\":{\"bg-color\":\"\",\"font-size\":\"40px\",\"text-align\":\"center\",\"width\":\"800px\"},\"tag\":\"h1\"},{\"block_type\":\"text\",\"content\":\"Join thousands of patients and healthcare providers who are already experiencing the future of healthcare with InstaMed.\",\"tag\":\"p\",\"properties\":{\"width\":\"700px\",\"text-align\":\"center\",\"font-size\":\"20px\",\"margin\":\"20px 0px 40px 0px\"}},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"width\":\"400px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"justify-content\":\"center\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Get Started\",\"properties\":{\"iconRight\":\"arrowRight\",\"button-style\":\"btn-outlined\",\"color\":\"#000000\",\"href\":\"https://www.instamedcorp.com/contact\",\"bg-color\":\"#fbf9f9\",\"border-color\":\"\",\"height\":\"\",\"padding\":\"22px\"}}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Contact Sales\",\"properties\":{\"iconLeft\":\"email\",\"button-style\":\"btn-link\",\"border-color\":\"#f3ecec\",\"color\":\"#faf5f5\",\"padding\":\"022px\"}}]}]},{\"block_type\":\"text\",\"tag\":\"small\",\"content\":\"No credit card required • Free consultation • 24/7 support\",\"properties\":{\"margin\":\"40px 0px 0px 0px\"}}]', '[{\"block_type\":\"text\",\"content\":\"Ready to Transform Your Healthcare Experience?\",\"properties\":{\"bg-color\":\"\",\"font-size\":\"40px\",\"text-align\":\"center\",\"width\":\"800px\"},\"tag\":\"h1\"},{\"block_type\":\"text\",\"content\":\"Join thousands of patients and healthcare providers who are already experiencing the future of healthcare with InstaMed.\",\"tag\":\"p\",\"properties\":{\"width\":\"700px\",\"text-align\":\"center\",\"font-size\":\"20px\",\"margin\":\"20px 0px 40px 0px\"}},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"width\":\"400px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"justify-content\":\"center\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Get Started\",\"properties\":{\"iconRight\":\"arrowRight\",\"button-style\":\"btn-outlined\",\"color\":\"#000000\",\"href\":\"https://www.instamedcorp.com/contact\",\"bg-color\":\"#fbf9f9\",\"border-color\":\"\",\"height\":\"\",\"padding\":\"22px\"}}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Contact Sales\",\"properties\":{\"iconLeft\":\"email\",\"button-style\":\"btn-link\",\"border-color\":\"#f3ecec\",\"color\":\"#faf5f5\",\"padding\":\"022px\"}}]}]},{\"block_type\":\"text\",\"tag\":\"small\",\"content\":\"No credit card required • Free consultation • 24/7 support\",\"properties\":{\"margin\":\"40px 0px 0px 0px\"}}]', '{\"layout\":\"flex-block\",\"alignItems\":\"center\",\"bgColor\":\"#00476c\",\"overlayColor\":\"#00476c\",\"overlayOpacity\":0.85,\"color\":\"#faf4f4\",\"bgImage\":\"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop\",\"padding\":\"200px 0px 200px 0px\"}', '{\"layout\":\"flex-block\",\"alignItems\":\"center\",\"bgColor\":\"#00476c\",\"overlayColor\":\"#00476c\",\"overlayOpacity\":0.85,\"color\":\"#faf4f4\",\"bgImage\":\"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop\",\"padding\":\"200px 0px 200px 0px\"}', 1, '2026-05-12 19:00:19', 1, '2026-05-18 01:48:27', NULL, NULL, '[{\"timestamp\":\"2026-05-17T09:57:00.283Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"},{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"add\\\",\\\"iconRight\\\":\\\"alertCircle\\\",\\\"target\\\":\\\"_blank\\\",\\\"href\\\":\\\"https://www.speedtest.net/result/19202903387\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"},{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"add\\\",\\\"iconRight\\\":\\\"alertCircle\\\",\\\"target\\\":\\\"_self\\\",\\\"href\\\":\\\"\\\"}}]\"}}},{\"timestamp\":\"2026-05-16T23:49:38.284Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}},{\"timestamp\":\"2026-05-16T23:48:58.941Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\"}}},{\"timestamp\":\"2026-05-16T23:48:33.646Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}},{\"timestamp\":\"2026-05-16T23:48:08.887Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\"}}},{\"timestamp\":\"2026-05-16T23:47:47.876Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\"}}},{\"timestamp\":\"2026-05-16T23:46:48.523Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-end\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-start\\\"}\"}}},{\"timestamp\":\"2026-05-16T23:34:57.392Z\",\"userId\":1,\"changes\":{\"settings_draft\":{\"from\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"center\\\"}\",\"to\":\"{\\\"layout\\\":\\\"flex-block\\\",\\\"alignItems\\\":\\\"flex-end\\\"}\"}}},{\"timestamp\":\"2026-05-16T07:06:12.799Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"},{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{}}]\"}}},{\"timestamp\":\"2026-05-16T05:44:44.757Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Link Text\\\",\\\"properties\\\":{\\\"href\\\":\\\"#\\\",\\\"target\\\":\\\"_self\\\",\\\"height\\\":\\\"100px\\\"}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\"}}},{\"timestamp\":\"2026-05-16T05:16:14.055Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<h1>Main Headline</h1>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"<p>Description and Other text here</p>\\\"},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"a\\\",\\\"content\\\":\\\"Link Text\\\",\\\"properties\\\":{\\\"href\\\":\\\"#\\\",\\\"target\\\":\\\"_self\\\",\\\"height\\\":\\\"100px\\\"}}]\"}}}]'),
(18, 2, 'Full Title', NULL, 'full_title', 0, 0, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\",\"responsive\":{\"mobile\":{\"properties\":{\"bg-image\":\"\"}}}},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\",\"responsive\":{\"mobile\":{\"properties\":{\"bg-image\":\"\"}}}},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', '{\"layout\":\"flex-block\",\"alignItems\":\"center\",\"bgImage\":\"\",\"height\":\"\",\"responsive\":{\"mobile\":{\"height\":\"495px\",\"bgImage\":\"\"}},\"bgPosition\":\"center\",\"fontSize\":\"\",\"overlayColor\":\"#000000\",\"overlayOpacity\":0.1,\"boxShadow\":\"\",\"justifyContent\":\"center\"}', '{\"layout\":\"flex-block\",\"alignItems\":\"center\",\"bgImage\":\"\",\"height\":\"\",\"responsive\":{\"mobile\":{\"height\":\"495px\",\"bgImage\":\"\"}},\"bgPosition\":\"center\",\"fontSize\":\"\",\"overlayColor\":\"#000000\",\"overlayOpacity\":0.1,\"boxShadow\":\"\",\"justifyContent\":\"center\"}', 1, '2026-05-12 20:18:44', NULL, NULL, NULL, NULL, NULL),
(19, 2, 'Empty Section', NULL, 'empty', 1, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-05-13 08:46:14', 1, '2026-05-13 08:46:30', NULL, NULL, NULL);
INSERT INTO `web_sections` (`id`, `id_page`, `section_name`, `settings`, `template`, `ord`, `inactive`, `archived`, `content_draft`, `content_live`, `settings_draft`, `settings_live`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(20, 1, 'Full Title', NULL, 'full_title', 1, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"&lt;script&gt;alert();&lt;/script&gt;\",\"tag\":\"p\"}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"&lt;script&gt;alert();&lt;/script&gt;\",\"tag\":\"p\"}]', '{\"layout\":\"flex-block\"}', '{\"layout\":\"flex-block\"}', 1, '2026-05-17 23:27:06', 1, '2026-05-18 01:52:54', NULL, NULL, NULL),
(21, 1, 'Full Title', NULL, 'full_title', 2, 1, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"}]', NULL, '{\"layout\":\"flex-block\"}', NULL, 1, '2026-05-18 01:10:05', 1, '2026-05-18 01:11:09', NULL, NULL, NULL);
INSERT INTO `web_sections` (`id`, `id_page`, `section_name`, `settings`, `template`, `ord`, `inactive`, `archived`, `content_draft`, `content_live`, `settings_draft`, `settings_live`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(22, 1, 'Full Title', NULL, 'full_title', 0, 0, 0, '[{\"block_type\":\"text\",\"content\":\"The Intelligence Behind <br>Better Healthcare\",\"tag\":\"h1\",\"properties\":{\"font-size\":\"55px\",\"text-align\":\"center\",\"width\":\"800px\",\"margin\":\"0px 0px 0px 0px\"},\"responsive\":{\"mobile\":{\"properties\":{\"font-size\":\"35px\",\"margin\":\"0px\",\"text-align\":\"center\",\"width\":\"200%\"}},\"tablet\":{\"properties\":{\"width\":\"100%\",\"bg-color\":\"\"}}}},{\"block_type\":\"text\",\"content\":\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\",\"tag\":\"p\",\"properties\":{\"font-size\":\"20px\",\"width\":\"800px\",\"margin\":\"50px 0px 50px 0px\",\"text-align\":\"center\",\"padding\":\"0px 0px 0px 0px\"},\"responsive\":{\"mobile\":{\"properties\":{\"font-size\":\"\",\"margin\":\"40px 0px 40px 0px\"}},\"tablet\":{\"properties\":{\"margin\":\"0px 0px 0px 0px\"}}}},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"justify-content\":\"center\",\"align-items\":\"center\",\"gap\":\"15px\",\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Click Me\",\"properties\":{\"iconLeft\":\"archive\",\"iconGap\":\"6px\",\"button-size\":\"btn-lg\",\"button-variant\":\"btn-pill\"}}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Click Me\",\"properties\":{\"button-style\":\"btn-danger\",\"iconRight\":\"check\",\"iconLeft\":\"close\",\"iconGap\":\"4px\",\"button-size\":\"btn-lg\"}}]}],\"responsive\":{\"mobile\":{\"properties\":{\"margin\":\"0px\"}}}},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"justify-content\":\"center\",\"gap\":\"30px\",\"margin\":\"50px 0px 0px 0px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"<span style=\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\">Partner Hospitals</span>\"}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"<span style=\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\">Licensed Physicians</span>\"}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"<span style=\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\">Partner Pharmacies</span>\"}]}],\"responsive\":{\"mobile\":{\"properties\":{\"flex-direction\":\"column\",\"align-items\":\"center\",\"gap\":\"10px\",\"margin\":\"40px 0px 0px 0px\"}},\"tablet\":{\"properties\":{\"margin\":\"0px 0px 0px 0px\"}}}}]', '[{\"block_type\":\"text\",\"content\":\"The Intelligence Behind <br>Better Healthcare\",\"tag\":\"h1\",\"properties\":{\"font-size\":\"55px\",\"text-align\":\"center\",\"width\":\"800px\",\"margin\":\"0px 0px 0px 0px\"},\"responsive\":{\"mobile\":{\"properties\":{\"font-size\":\"35px\",\"margin\":\"0px\",\"text-align\":\"center\",\"width\":\"200%\"}},\"tablet\":{\"properties\":{\"width\":\"100%\",\"bg-color\":\"\"}}}},{\"block_type\":\"text\",\"content\":\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\",\"tag\":\"p\",\"properties\":{\"font-size\":\"20px\",\"width\":\"800px\",\"margin\":\"50px 0px 50px 0px\",\"text-align\":\"center\",\"padding\":\"0px 0px 0px 0px\"},\"responsive\":{\"mobile\":{\"properties\":{\"font-size\":\"\",\"margin\":\"40px 0px 40px 0px\"}},\"tablet\":{\"properties\":{\"margin\":\"0px 0px 0px 0px\"}}}},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"justify-content\":\"center\",\"align-items\":\"center\",\"gap\":\"15px\",\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Click Me\",\"properties\":{\"iconLeft\":\"archive\",\"iconGap\":\"6px\",\"button-size\":\"btn-lg\",\"button-variant\":\"btn-pill\"}}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"button\",\"content\":\"Click Me\",\"properties\":{\"button-style\":\"btn-danger\",\"iconRight\":\"check\",\"iconLeft\":\"close\",\"iconGap\":\"4px\",\"button-size\":\"btn-lg\"}}]}],\"responsive\":{\"mobile\":{\"properties\":{\"margin\":\"0px\"}}}},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"justify-content\":\"center\",\"gap\":\"30px\",\"margin\":\"50px 0px 0px 0px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"<span style=\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\">Partner Hospitals</span>\"}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"<span style=\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\">Licensed Physicians</span>\"}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"auto\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"<span style=\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\">Partner Pharmacies</span>\"}]}],\"responsive\":{\"mobile\":{\"properties\":{\"flex-direction\":\"column\",\"align-items\":\"center\",\"gap\":\"10px\",\"margin\":\"40px 0px 0px 0px\"}},\"tablet\":{\"properties\":{\"margin\":\"0px 0px 0px 0px\"}}}}]', '{\"layout\":\"flex-block\",\"hoverScale\":\"\",\"alignItems\":\"center\",\"bgImage\":\"/images/hero.webp\",\"overlayColor\":\"#0a3952\",\"overlayOpacity\":0.8,\"color\":\"#faf9f9\",\"height\":\"auto\",\"bgSize\":\"cover\",\"responsive\":{\"mobile\":{\"height\":\"auto\",\"padding\":\"80px 0px 80px 0px\"},\"tablet\":{\"bgColor\":\"#ffa3a3\",\"padding\":\"0px 0px 0px 0px\"}},\"hideMobile\":false,\"padding\":\"200px 0px 200px 0px\"}', '{\"layout\":\"flex-block\",\"hoverScale\":\"\",\"alignItems\":\"center\",\"bgImage\":\"/images/hero.webp\",\"overlayColor\":\"#0a3952\",\"overlayOpacity\":0.8,\"color\":\"#faf9f9\",\"height\":\"auto\",\"bgSize\":\"cover\",\"responsive\":{\"mobile\":{\"height\":\"auto\",\"padding\":\"80px 0px 80px 0px\"},\"tablet\":{\"bgColor\":\"#ffa3a3\",\"padding\":\"0px 0px 0px 0px\"}},\"hideMobile\":false,\"padding\":\"200px 0px 200px 0px\"}', 1, '2026-05-18 01:52:59', NULL, NULL, NULL, NULL, '[{\"timestamp\":\"2026-06-19T01:55:38.207Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"250px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"200%\\\"}},\\\"tablet\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"bg-color\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\",\\\"height\\\":\\\"60px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"\\\",\\\"border-radius\\\":\\\"\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\",\\\"iconRight\\\":\\\"alertTriangle\\\",\\\"iconLeft\\\":\\\"arrowCircleDown\\\",\\\"gap\\\":\\\"\\\",\\\"iconGap\\\":\\\"0px\\\",\\\"hideMobile\\\":true,\\\"button-variant\\\":\\\"\\\",\\\"button-size\\\":\\\"btn-sm\\\",\\\"border-color\\\":\\\"#521fe0\\\",\\\"border-style\\\":\\\"solid\\\",\\\"border-radius\\\":\\\"\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\",\\\"gap\\\":\\\"30px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"131px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"131px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"36px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"150px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"157px\\\",\\\"height\\\":\\\"20px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"20px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"146px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"145px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"37px\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\",\\\"height\\\":\\\"55px\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"250px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"200%\\\"}},\\\"tablet\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"bg-color\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\",\\\"height\\\":\\\"60px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"\\\",\\\"border-radius\\\":\\\"\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\",\\\"iconRight\\\":\\\"alertTriangle\\\",\\\"iconLeft\\\":\\\"arrowCircleDown\\\",\\\"gap\\\":\\\"\\\",\\\"iconGap\\\":\\\"0px\\\",\\\"hideMobile\\\":true,\\\"button-variant\\\":\\\"\\\",\\\"button-size\\\":\\\"\\\",\\\"border-color\\\":\\\"#521fe0\\\",\\\"border-style\\\":\\\"solid\\\",\\\"border-radius\\\":\\\"\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\",\\\"gap\\\":\\\"30px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"131px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"131px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"36px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"150px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"157px\\\",\\\"height\\\":\\\"20px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"20px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"146px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"145px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"37px\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\",\\\"height\\\":\\\"55px\\\"}}}}]\"}}},{\"timestamp\":\"2026-06-19T01:55:15.728Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"250px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"200%\\\"}},\\\"tablet\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"bg-color\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\",\\\"height\\\":\\\"60px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"\\\",\\\"border-radius\\\":\\\"\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\",\\\"iconRight\\\":\\\"alertTriangle\\\",\\\"iconLeft\\\":\\\"arrowCircleDown\\\",\\\"gap\\\":\\\"\\\",\\\"iconGap\\\":\\\"0px\\\",\\\"hideMobile\\\":true,\\\"button-variant\\\":\\\"\\\",\\\"button-size\\\":\\\"\\\",\\\"border-color\\\":\\\"#521fe0\\\",\\\"border-style\\\":\\\"solid\\\",\\\"border-radius\\\":\\\"\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\",\\\"gap\\\":\\\"30px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"131px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"131px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"36px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"150px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"157px\\\",\\\"height\\\":\\\"20px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"20px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"146px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"145px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"37px\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\",\\\"height\\\":\\\"55px\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"250px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"200%\\\"}},\\\"tablet\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"bg-color\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\",\\\"height\\\":\\\"60px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"\\\",\\\"border-radius\\\":\\\"\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\",\\\"iconRight\\\":\\\"alertTriangle\\\",\\\"iconLeft\\\":\\\"arrowCircleDown\\\",\\\"gap\\\":\\\"\\\",\\\"iconGap\\\":\\\"0px\\\",\\\"hideMobile\\\":true,\\\"button-variant\\\":\\\"\\\",\\\"button-size\\\":\\\"btn-sm\\\",\\\"border-color\\\":\\\"#521fe0\\\",\\\"border-style\\\":\\\"solid\\\",\\\"border-radius\\\":\\\"\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\",\\\"gap\\\":\\\"30px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"131px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"131px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"36px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"150px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"157px\\\",\\\"height\\\":\\\"20px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"20px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"146px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"145px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"37px\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\",\\\"height\\\":\\\"55px\\\"}}}}]\"}}},{\"timestamp\":\"2026-06-19T01:55:08.430Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"250px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"200%\\\"}},\\\"tablet\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"bg-color\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\",\\\"height\\\":\\\"60px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"\\\",\\\"border-radius\\\":\\\"\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\",\\\"iconRight\\\":\\\"alertTriangle\\\",\\\"iconLeft\\\":\\\"arrowCircleDown\\\",\\\"gap\\\":\\\"\\\",\\\"iconGap\\\":\\\"0px\\\",\\\"hideMobile\\\":true,\\\"button-variant\\\":\\\"\\\",\\\"button-size\\\":\\\"btn-sm\\\",\\\"border-color\\\":\\\"#521fe0\\\",\\\"border-style\\\":\\\"solid\\\",\\\"border-radius\\\":\\\"\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\",\\\"gap\\\":\\\"30px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"131px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"131px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"36px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"150px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"157px\\\",\\\"height\\\":\\\"20px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"20px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"146px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"145px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"37px\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\",\\\"height\\\":\\\"55px\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"250px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"200%\\\"}},\\\"tablet\\\":{\\\"properties\\\":{\\\"width\\\":\\\"100%\\\",\\\"bg-color\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\",\\\"height\\\":\\\"60px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"\\\",\\\"border-radius\\\":\\\"\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\",\\\"iconRight\\\":\\\"alertTriangle\\\",\\\"iconLeft\\\":\\\"arrowCircleDown\\\",\\\"gap\\\":\\\"\\\",\\\"iconGap\\\":\\\"0px\\\",\\\"hideMobile\\\":true,\\\"button-variant\\\":\\\"\\\",\\\"button-size\\\":\\\"\\\",\\\"border-color\\\":\\\"#521fe0\\\",\\\"border-style\\\":\\\"solid\\\",\\\"border-radius\\\":\\\"\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\",\\\"gap\\\":\\\"30px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"131px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"131px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"36px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"150px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"157px\\\",\\\"height\\\":\\\"20px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"20px\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"146px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\",\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}},\\\"properties\\\":{\\\"width\\\":\\\"145px\\\"}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"height\\\":\\\"37px\\\"}}}}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\",\\\"height\\\":\\\"55px\\\"}}}}]\"}}},{\"timestamp\":\"2026-06-06T23:04:52.853Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0150px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"160px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\"}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"162px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"175px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\"}]}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\"}}}}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0150px 0px 0px 0px\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"35px\\\",\\\"margin\\\":\\\"0px\\\",\\\"text-align\\\":\\\"center\\\"}}}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"},\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"font-size\\\":\\\"\\\"}}}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"100%\\\",\\\"margin\\\":\\\"0px 0px 40px 0px\\\",\\\"gap\\\":\\\"20px\\\",\\\"height\\\":\\\"45px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\",\\\"width\\\":\\\"50%\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"gap\\\":\\\"20px\\\",\\\"width\\\":\\\"50%\\\",\\\"height\\\":\\\"39px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"button-style\\\":\\\"btn-danger\\\"}}]}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"1009px\\\",\\\"justify-content\\\":\\\"center\\\",\\\"align-items\\\":\\\"center\\\",\\\"margin\\\":\\\"40px 0px 0px 0px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"160px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\"}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"162px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"175px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\"}]}],\\\"responsive\\\":{\\\"mobile\\\":{\\\"properties\\\":{\\\"gap\\\":\\\"0px\\\",\\\"align-items\\\":\\\"center\\\",\\\"flex-direction\\\":\\\"column\\\"}}}}]\"}}},{\"timestamp\":\"2026-05-19T22:57:06.696Z\",\"userId\":1,\"changes\":{\"content_draft\":{\"from\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"50px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"668px\\\",\\\"margin\\\":\\\"0150px 0px 0px 0px\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"678px\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"464px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconRight\\\":\\\"arrowRight\\\",\\\"color\\\":\\\"#1a1a1a\\\",\\\"bg-color\\\":\\\"#f5f5f5\\\",\\\"padding\\\":\\\"0px 0px 0px px\\\",\\\"height\\\":\\\"51px\\\",\\\"width\\\":\\\"170px\\\",\\\"href\\\":\\\"https://www.instamedcorp.com/contact\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"layoutGrid\\\",\\\"button-style\\\":\\\"btn-outlined\\\",\\\"border-width\\\":\\\"2px\\\",\\\"border-color\\\":\\\"\\\",\\\"color\\\":\\\"#f8f6f6\\\",\\\"height\\\":\\\"52px\\\",\\\"width\\\":\\\"163px\\\"}}]}]},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"small\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgba(255, 255, 255, 0.7); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 14px; text-align: center;\\\\\\\">Trusted by healthcare organizations across the Philippines</span>\\\",\\\"properties\\\":{\\\"padding\\\":\\\"20px 0px 0px 0px\\\",\\\"margin\\\":\\\"60px 0px 30px 0px\\\",\\\"width\\\":\\\"722px\\\",\\\"text-align\\\":\\\"center\\\",\\\"border-width\\\":\\\"1px 0px 0px 0px\\\",\\\"border-color\\\":\\\"#8e7b7b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"541px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"160px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\"}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"162px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"175px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\"}]}]}]\",\"to\":\"[{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"The intelligence behind better healthcare\\\",\\\"tag\\\":\\\"h1\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"55px\\\",\\\"text-align\\\":\\\"center\\\",\\\"width\\\":\\\"668px\\\",\\\"margin\\\":\\\"0150px 0px 0px 0px\\\"}},{\\\"block_type\\\":\\\"text\\\",\\\"content\\\":\\\"Connect with healthcare providers instantly through Instamedico, our flagship telemedicine platform. Empowering patients and providers with faster, safer, and more connected healthcare solutions.\\\",\\\"tag\\\":\\\"p\\\",\\\"properties\\\":{\\\"font-size\\\":\\\"20px\\\",\\\"width\\\":\\\"678px\\\",\\\"margin\\\":\\\"25px 0px 25px 0px\\\",\\\"text-align\\\":\\\"center\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"464px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"flex-end\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconRight\\\":\\\"arrowRight\\\",\\\"color\\\":\\\"#1a1a1a\\\",\\\"bg-color\\\":\\\"#f5f5f5\\\",\\\"padding\\\":\\\"0px 0px 0px px\\\",\\\"height\\\":\\\"51px\\\",\\\"width\\\":\\\"170px\\\",\\\"href\\\":\\\"https://www.instamedcorp.com/contact\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"button\\\",\\\"content\\\":\\\"Click Me\\\",\\\"properties\\\":{\\\"iconLeft\\\":\\\"layoutGrid\\\",\\\"button-style\\\":\\\"btn-outlined\\\",\\\"border-width\\\":\\\"2px\\\",\\\"border-color\\\":\\\"\\\",\\\"color\\\":\\\"#f8f6f6\\\",\\\"height\\\":\\\"52px\\\",\\\"width\\\":\\\"163px\\\"}}]}]},{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"small\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgba(255, 255, 255, 0.7); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 14px; text-align: center;\\\\\\\">Trusted by healthcare organizations across the Philippines</span>\\\",\\\"properties\\\":{\\\"padding\\\":\\\"20px 0px 0px 0px\\\",\\\"margin\\\":\\\"60px 0px 30px 0px\\\",\\\"width\\\":\\\"722px\\\",\\\"text-align\\\":\\\"center\\\",\\\"border-width\\\":\\\"1px 0px 0px 0px\\\",\\\"border-color\\\":\\\"#8e7b7b\\\"}},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-cols-row\\\",\\\"width\\\":\\\"541px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"160px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Hospitals</span>\\\"}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"justify-content\\\":\\\"center\\\",\\\"width\\\":\\\"162px\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Licensed Physicians</span>\\\",\\\"properties\\\":{\\\"text-align\\\":\\\"center\\\"}}]},{\\\"block_type\\\":\\\"container\\\",\\\"properties\\\":{\\\"className\\\":\\\"cms-col\\\",\\\"width\\\":\\\"175px\\\",\\\"justify-content\\\":\\\"center\\\"},\\\"blocks\\\":[{\\\"block_type\\\":\\\"text\\\",\\\"tag\\\":\\\"p\\\",\\\"content\\\":\\\"<span style=\\\\\\\"color: rgb(255, 255, 255); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: medium; font-weight: 600; text-align: center;\\\\\\\">Partner Pharmacies</span>\\\"}]}]}]\"}}}]');
INSERT INTO `web_sections` (`id`, `id_page`, `section_name`, `settings`, `template`, `ord`, `inactive`, `archived`, `content_draft`, `content_live`, `settings_draft`, `settings_live`, `created_by`, `created_at`, `deleted_by`, `deleted_at`, `archived_by`, `archived_at`, `changelog`) VALUES
(23, 2, 'Full Title', NULL, 'full_title', 1, 0, 0, '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"justify-content\":\"space-between\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"169px\"},\"blocks\":[]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"199px\"},\"blocks\":[]}]}]', '[{\"block_type\":\"text\",\"content\":\"<h1>Main Headline</h1>\"},{\"block_type\":\"text\",\"content\":\"<p>Description and Other text here</p>\"},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"justify-content\":\"space-between\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"169px\"},\"blocks\":[]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\",\"width\":\"199px\"},\"blocks\":[]}]}]', '{\"layout\":\"flex-block\",\"bgColor\":\"\",\"justifyContent\":\"flex-end\"}', '{\"layout\":\"flex-block\",\"bgColor\":\"\",\"justifyContent\":\"flex-end\"}', 1, '2026-05-19 17:00:17', NULL, NULL, NULL, NULL, NULL),
(24, 2, 'Empty Section', NULL, 'empty', 2, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-05-23 14:32:04', 1, '2026-05-23 14:32:12', NULL, NULL, NULL),
(25, 1, 'Empty Section', NULL, 'empty', 1, 1, 0, '[{\"block_type\":\"button\",\"content\":\"Click Me\",\"properties\":{}}]', '[{\"block_type\":\"button\",\"content\":\"Click Me\",\"properties\":{}}]', '{}', '{}', 1, '2026-06-05 02:26:06', 1, '2026-06-06 03:43:44', NULL, NULL, NULL),
(26, 1, 'Empty Section', NULL, 'empty', 1, 1, 0, '[]', '[]', '{\"height\":\"80px\"}', '{\"height\":\"80px\"}', 1, '2026-06-06 03:58:18', 1, '2026-06-18 11:04:49', NULL, NULL, NULL),
(27, 1, 'Empty Section', NULL, 'empty', 2, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-06-17 17:04:41', 1, '2026-06-17 17:04:47', NULL, NULL, NULL),
(28, 1, 'Empty Section', NULL, 'empty', 1, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-06-18 11:05:00', 1, '2026-06-18 11:05:17', NULL, NULL, NULL),
(29, 1, 'Empty Section', NULL, 'empty', 1, 1, 0, '[]', '[]', '{\"height\":\"142px\"}', '{\"height\":\"142px\"}', 1, '2026-06-18 11:05:36', 1, '2026-06-20 14:19:33', NULL, NULL, NULL),
(30, 1, 'Empty Section', NULL, 'empty', 1, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-06-20 14:19:45', 1, '2026-06-20 14:20:20', NULL, NULL, NULL),
(31, 1, 'Empty Section', NULL, 'empty', 1, 1, 0, '[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"width\":\"\",\"gap\":\"20px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\",\"button-variant\":\"btn-pill\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]}],\"responsive\":{\"tablet\":{\"properties\":{\"flex-direction\":\"column\"}}}}]', '[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"width\":\"\",\"gap\":\"20px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\",\"button-variant\":\"btn-pill\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]}],\"responsive\":{\"tablet\":{\"properties\":{\"flex-direction\":\"column\"}}}}]', '{\"padding\":\"80px 0px 80px 0px\"}', '{\"padding\":\"80px 0px 80px 0px\"}', 1, '2026-06-24 13:57:27', 1, '2026-06-24 16:22:36', NULL, NULL, NULL),
(32, 1, 'Empty Section', NULL, 'empty', 2, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-06-24 14:46:55', 1, '2026-06-24 14:57:03', NULL, NULL, NULL),
(33, 1, 'Empty Section', NULL, 'empty', 2, 1, 0, '[]', '[]', '{}', '{}', 1, '2026-06-24 14:57:09', 1, '2026-06-24 14:58:59', NULL, NULL, NULL),
(34, 1, 'Empty Section', NULL, 'empty', 3, 1, 0, '[]', '[]', '{}', '{}', 1, '2026-06-24 14:57:53', 1, '2026-06-24 14:59:02', NULL, NULL, NULL),
(35, 1, 'Empty Section', NULL, 'empty', 2, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-06-24 14:59:05', 1, '2026-06-24 14:59:45', NULL, NULL, NULL),
(36, 1, 'Empty Section', NULL, 'empty', 3, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-06-24 14:59:28', 1, '2026-06-24 14:59:48', NULL, NULL, NULL),
(37, 1, 'Empty Section', NULL, 'empty', 2, 1, 0, '[]', NULL, '{}', NULL, 1, '2026-06-24 15:12:05', 1, '2026-06-24 15:12:34', NULL, NULL, NULL),
(38, 1, 'Empty Section', NULL, 'empty', 2, 1, 0, '[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]', '[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]', '{}', '{}', 1, '2026-06-24 15:30:23', 1, '2026-06-24 16:05:08', NULL, NULL, NULL),
(39, 1, 'Empty Section', NULL, 'empty', 2, 1, 0, '[{\"block_type\":\"text\",\"tag\":\"h1\",\"content\":\"<h2 class=\\\"text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; font-size: 3rem; margin: 0px 0px 1rem; line-height: 1; --tw-text-opacity: 1; font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; text-align: center;\\\">Everything You Need for <span class=\\\"gradient-text\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; background-image: linear-gradient(to right, rgb(59, 130, 246), rgb(96, 165, 250), rgb(91, 164, 207)); --tw-gradient-from: #3B82F6; --tw-gradient-stops: #3B82F6 ,#60A5FA ,#5BA4CF; --tw-gradient-to: #5BA4CF; background-clip: text; color: transparent;\\\">Modern Healthcare</span></h2>\"},{\"block_type\":\"container\",\"properties\":{\"className\":\"flex-block\",\"padding\":\"0px\",\"justify-content\":\"center\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"<span style=\\\"color: rgb(75, 85, 99); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 18px; text-align: center;\\\">Our platform combines cutting-edge technology with medical expertise to deliver exceptional healthcare experiences.</span>\",\"properties\":{\"width\":\"659px\",\"text-align\":\"center\"}}]}]', '[{\"block_type\":\"text\",\"tag\":\"h1\",\"content\":\"<h2 class=\\\"text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; font-size: 3rem; margin: 0px 0px 1rem; line-height: 1; --tw-text-opacity: 1; font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; text-align: center;\\\">Everything You Need for <span class=\\\"gradient-text\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; background-image: linear-gradient(to right, rgb(59, 130, 246), rgb(96, 165, 250), rgb(91, 164, 207)); --tw-gradient-from: #3B82F6; --tw-gradient-stops: #3B82F6 ,#60A5FA ,#5BA4CF; --tw-gradient-to: #5BA4CF; background-clip: text; color: transparent;\\\">Modern Healthcare</span></h2>\"},{\"block_type\":\"container\",\"properties\":{\"className\":\"flex-block\",\"padding\":\"0px\",\"justify-content\":\"center\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"<span style=\\\"color: rgb(75, 85, 99); font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 18px; text-align: center;\\\">Our platform combines cutting-edge technology with medical expertise to deliver exceptional healthcare experiences.</span>\",\"properties\":{\"width\":\"659px\",\"text-align\":\"center\"}}]}]', '{\"justifyContent\":\"center\",\"alignItems\":\"center\",\"bgColor\":\"#f5f4f4\"}', '{\"justifyContent\":\"center\",\"alignItems\":\"center\",\"bgColor\":\"#f5f4f4\"}', 1, '2026-06-24 16:13:20', 1, '2026-06-24 16:22:39', NULL, NULL, NULL),
(40, 1, 'Empty Section', NULL, 'empty', 1, 0, 0, '[{\"block_type\":\"container\",\"properties\":{\"className\":\"flex-block\",\"padding\":\"20px\",\"justify-content\":\"center\",\"height\":\"80px\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h1\",\"content\":\"<h2 class=\\\"text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; font-size: 3rem; margin: 0px 0px 1rem; line-height: 1; --tw-text-opacity: 1; font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; text-align: center;\\\">Everything You Need for <span class=\\\"gradient-text\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; background-image: linear-gradient(to right, rgb(59, 130, 246), rgb(96, 165, 250), rgb(91, 164, 207)); --tw-gradient-from: #3B82F6; --tw-gradient-stops: #3B82F6 ,#60A5FA ,#5BA4CF; --tw-gradient-to: #5BA4CF; background-clip: text; color: transparent;\\\">Modern Healthcare</span></h2>\"}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"gap\":\"20px\",\"padding\":\"10px 0px 10px 0px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"\",\"color\":\"\",\"padding\":\"8px 16px\",\"border-radius\":\"\",\"button-style\":\"btn-danger\",\"button-variant\":\"btn-pill\",\"button-size\":\"\",\"iconGap\":\"0px\",\"border-color\":\"\",\"border-width\":\"\",\"border-style\":\"\",\"hover-bg-color\":\"\",\"hover-color\":\"\",\"active-bg-color\":\"\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\",\"width\":\"284px\",\"height\":\"292px\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"\",\"color\":\"\",\"padding\":\"8px 16px\",\"border-radius\":\"\",\"button-variant\":\"btn-square\",\"border-color\":\"\",\"border-width\":\"\",\"border-style\":\"\",\"button-style\":\"btn-success\",\"hover-bg-color\":\"\",\"hover-color\":\"\",\"active-bg-color\":\"\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"\",\"color\":\"\",\"padding\":\"8px 16px\",\"border-radius\":\"\",\"button-variant\":\"btn-dashed\",\"border-color\":\"\",\"border-width\":\"\",\"border-style\":\"\",\"button-style\":\"btn-outlined\",\"hover-bg-color\":\"\",\"hover-color\":\"\",\"active-bg-color\":\"\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]}]}]', '[{\"block_type\":\"container\",\"properties\":{\"className\":\"flex-block\",\"padding\":\"20px\",\"justify-content\":\"center\",\"height\":\"80px\"},\"blocks\":[{\"block_type\":\"text\",\"tag\":\"h1\",\"content\":\"<h2 class=\\\"text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; font-size: 3rem; margin: 0px 0px 1rem; line-height: 1; --tw-text-opacity: 1; font-family: ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; text-align: center;\\\">Everything You Need for <span class=\\\"gradient-text\\\" style=\\\"--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246/0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; border: 0px solid rgb(229, 231, 235); --tw-border-opacity: 1; background-image: linear-gradient(to right, rgb(59, 130, 246), rgb(96, 165, 250), rgb(91, 164, 207)); --tw-gradient-from: #3B82F6; --tw-gradient-stops: #3B82F6 ,#60A5FA ,#5BA4CF; --tw-gradient-to: #5BA4CF; background-clip: text; color: transparent;\\\">Modern Healthcare</span></h2>\"}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-cols-row\",\"gap\":\"20px\",\"padding\":\"10px 0px 10px 0px\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"\",\"color\":\"\",\"padding\":\"8px 16px\",\"border-radius\":\"\",\"button-style\":\"btn-danger\",\"button-variant\":\"btn-pill\",\"button-size\":\"\",\"iconGap\":\"0px\",\"border-color\":\"\",\"border-width\":\"\",\"border-style\":\"\",\"hover-bg-color\":\"\",\"hover-color\":\"\",\"active-bg-color\":\"\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\",\"width\":\"284px\",\"height\":\"292px\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"\",\"color\":\"\",\"padding\":\"8px 16px\",\"border-radius\":\"\",\"button-variant\":\"btn-square\",\"border-color\":\"\",\"border-width\":\"\",\"border-style\":\"\",\"button-style\":\"btn-success\",\"hover-bg-color\":\"\",\"hover-color\":\"\",\"active-bg-color\":\"\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"\",\"color\":\"\",\"padding\":\"8px 16px\",\"border-radius\":\"\",\"button-variant\":\"btn-dashed\",\"border-color\":\"\",\"border-width\":\"\",\"border-style\":\"\",\"button-style\":\"btn-outlined\",\"hover-bg-color\":\"\",\"hover-color\":\"\",\"active-bg-color\":\"\"}}]}]},{\"block_type\":\"container\",\"properties\":{\"className\":\"cms-col\"},\"blocks\":[{\"block_type\":\"container\",\"properties\":{\"className\":\"card-case\",\"padding\":\"20px\",\"bg-color\":\"#ffffff\",\"flex-direction\":\"column\",\"gap\":\"10px\",\"border-radius\":\"12px\",\"box-shadow\":\"0px 0px 15px 0px #d8d0d0\"},\"blocks\":[{\"block_type\":\"image\",\"properties\":{\"src\":\"/defaults/no-image.webp\",\"height\":\"150px\"}},{\"block_type\":\"text\",\"tag\":\"h3\",\"content\":\"Card Title\",\"properties\":{\"margin-bottom\":\"10px\"}},{\"block_type\":\"text\",\"tag\":\"p\",\"content\":\"Card description goes here.\",\"properties\":{\"margin-bottom\":\"15px\"}},{\"block_type\":\"button\",\"content\":\"Learn More\",\"properties\":{\"bg-color\":\"#3b82f6\",\"color\":\"#ffffff\",\"padding\":\"8px 16px\",\"border-radius\":\"4px\"}}]}]}]}]', '{}', '{}', 1, '2026-06-24 16:43:47', NULL, NULL, NULL, NULL, NULL),
(41, 1, 'Empty Section', NULL, 'empty', 2, 0, 0, '[]', '[]', '{}', '{}', 1, '2026-06-24 16:43:47', NULL, NULL, NULL, NULL, NULL),
(42, 1, 'Empty Section', NULL, 'empty', 3, 0, 0, '[{\"block_type\":\"container\",\"properties\":{\"className\":\"flex-block\",\"padding\":\"20px\"},\"blocks\":[]}]', '[{\"block_type\":\"container\",\"properties\":{\"className\":\"flex-block\",\"padding\":\"20px\"},\"blocks\":[]}]', '{}', '{}', 1, '2026-06-24 16:43:48', NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_id_employee_index` (`id_employee`),
  ADD KEY `activity_logs_id_time_entry_foreign` (`id_time_entry`),
  ADD KEY `activity_logs_tenant_id_index` (`tenant_id`),
  ADD KEY `activity_logs_inactive_index` (`inactive`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcements_tenant_id_index` (`tenant_id`),
  ADD KEY `announcements_inactive_index` (`inactive`);

--
-- Indexes for table `announcement_acks`
--
ALTER TABLE `announcement_acks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_acks_id_announcement_foreign` (`id_announcement`),
  ADD KEY `announcement_acks_tenant_id_index` (`tenant_id`),
  ADD KEY `announcement_acks_inactive_index` (`inactive`);

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicants_tenant_id_index` (`tenant_id`),
  ADD KEY `applicants_inactive_index` (`inactive`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_tenant_id_index` (`tenant_id`),
  ADD KEY `audit_logs_inactive_index` (`inactive`);

--
-- Indexes for table `bench_status`
--
ALTER TABLE `bench_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bench_status_id_employee_index` (`id_employee`),
  ADD KEY `bench_status_tenant_id_index` (`tenant_id`),
  ADD KEY `bench_status_inactive_index` (`inactive`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE,
  ADD KEY `position` (`id_position`);

--
-- Indexes for table `client_contracts`
--
ALTER TABLE `client_contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_contracts_id_client_index` (`id_client`),
  ADD KEY `client_contracts_tenant_id_index` (`tenant_id`),
  ADD KEY `client_contracts_inactive_index` (`inactive`);

--
-- Indexes for table `client_staff_assignments`
--
ALTER TABLE `client_staff_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_staff_assignments_id_client_index` (`id_client`),
  ADD KEY `client_staff_assignments_id_employee_index` (`id_employee`),
  ADD KEY `client_staff_assignments_tenant_id_index` (`tenant_id`),
  ADD KEY `client_staff_assignments_inactive_index` (`inactive`);

--
-- Indexes for table `client_training_materials`
--
ALTER TABLE `client_training_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_training_materials_id_client_index` (`id_client`),
  ADD KEY `client_training_materials_tenant_id_index` (`tenant_id`),
  ADD KEY `client_training_materials_inactive_index` (`inactive`);

--
-- Indexes for table `compliance_records`
--
ALTER TABLE `compliance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compliance_records_id_employee_index` (`id_employee`),
  ADD KEY `compliance_records_tenant_id_index` (`tenant_id`),
  ADD KEY `compliance_records_inactive_index` (`inactive`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_tenant_id_index` (`tenant_id`),
  ADD KEY `courses_inactive_index` (`inactive`);

--
-- Indexes for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_enrollments_id_employee_index` (`id_employee`),
  ADD KEY `course_enrollments_id_course_foreign` (`id_course`),
  ADD KEY `course_enrollments_tenant_id_index` (`tenant_id`),
  ADD KEY `course_enrollments_inactive_index` (`inactive`);

--
-- Indexes for table `course_modules`
--
ALTER TABLE `course_modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_modules_id_course_foreign` (`id_course`),
  ADD KEY `course_modules_tenant_id_index` (`tenant_id`),
  ADD KEY `course_modules_inactive_index` (`inactive`);

--
-- Indexes for table `disbursement_accounts`
--
ALTER TABLE `disbursement_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `disbursement_accounts_id_employee_index` (`id_employee`),
  ADD KEY `disbursement_accounts_tenant_id_index` (`tenant_id`),
  ADD KEY `disbursement_accounts_inactive_index` (`inactive`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE,
  ADD KEY `position` (`id_position`);

--
-- Indexes for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_documents_id_employee_index` (`id_employee`),
  ADD KEY `employee_documents_tenant_id_index` (`tenant_id`),
  ADD KEY `employee_documents_inactive_index` (`inactive`);

--
-- Indexes for table `employee_skills`
--
ALTER TABLE `employee_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_skills_id_employee_index` (`id_employee`),
  ADD KEY `employee_skills_tenant_id_index` (`tenant_id`),
  ADD KEY `employee_skills_inactive_index` (`inactive`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
  ADD KEY `invoices_id_client_index` (`id_client`),
  ADD KEY `invoices_tenant_id_index` (`tenant_id`),
  ADD KEY `invoices_inactive_index` (`inactive`);

--
-- Indexes for table `invoice_line_items`
--
ALTER TABLE `invoice_line_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_line_items_id_invoice_foreign` (`id_invoice`),
  ADD KEY `invoice_line_items_tenant_id_index` (`tenant_id`),
  ADD KEY `invoice_line_items_inactive_index` (`inactive`);

--
-- Indexes for table `iplist`
--
ALTER TABLE `iplist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE;

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `layout_blocks`
--
ALTER TABLE `layout_blocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `layout_pages`
--
ALTER TABLE `layout_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `layout_presets`
--
ALTER TABLE `layout_presets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_key` (`template_key`);

--
-- Indexes for table `layout_sections`
--
ALTER TABLE `layout_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_key` (`template_key`);

--
-- Indexes for table `layout_themes`
--
ALTER TABLE `layout_themes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leave_requests_id_employee_index` (`id_employee`),
  ADD KEY `leave_requests_id_client_index` (`id_client`),
  ADD KEY `leave_requests_tenant_id_index` (`tenant_id`),
  ADD KEY `leave_requests_inactive_index` (`inactive`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_id_user_index` (`id_user`),
  ADD KEY `notifications_tenant_id_index` (`tenant_id`),
  ADD KEY `notifications_inactive_index` (`inactive`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_id_invoice_foreign` (`id_invoice`),
  ADD KEY `payments_id_client_index` (`id_client`),
  ADD KEY `payments_tenant_id_index` (`tenant_id`),
  ADD KEY `payments_inactive_index` (`inactive`);

--
-- Indexes for table `payrolls`
--
ALTER TABLE `payrolls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payrolls_id_employee_index` (`id_employee`),
  ADD KEY `payrolls_tenant_id_index` (`tenant_id`),
  ADD KEY `payrolls_inactive_index` (`inactive`);

--
-- Indexes for table `payroll_runs`
--
ALTER TABLE `payroll_runs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payroll_runs_tenant_id_index` (`tenant_id`),
  ADD KEY `payroll_runs_inactive_index` (`inactive`);

--
-- Indexes for table `payslips`
--
ALTER TABLE `payslips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payslips_id_employee_index` (`id_employee`),
  ADD KEY `payslips_tenant_id_index` (`tenant_id`),
  ADD KEY `payslips_inactive_index` (`inactive`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_module_action_unique` (`module`,`action`),
  ADD KEY `permissions_tenant_id_index` (`tenant_id`),
  ADD KEY `permissions_inactive_index` (`inactive`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE;

--
-- Indexes for table `recruitment_stages`
--
ALTER TABLE `recruitment_stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recruitment_stages_id_applicant_foreign` (`id_applicant`),
  ADD KEY `recruitment_stages_tenant_id_index` (`tenant_id`),
  ADD KEY `recruitment_stages_inactive_index` (`inactive`);

--
-- Indexes for table `replacement_requests`
--
ALTER TABLE `replacement_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `replacement_requests_id_client_index` (`id_client`),
  ADD KEY `replacement_requests_id_employee_index` (`id_employee`),
  ADD KEY `replacement_requests_tenant_id_index` (`tenant_id`),
  ADD KEY `replacement_requests_inactive_index` (`inactive`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_code_unique` (`code`),
  ADD KEY `roles_tenant_id_index` (`tenant_id`),
  ADD KEY `roles_inactive_index` (`inactive`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_permissions_id_role_id_permission_unique` (`id_role`,`id_permission`),
  ADD KEY `role_permissions_id_permission_foreign` (`id_permission`),
  ADD KEY `role_permissions_tenant_id_index` (`tenant_id`),
  ADD KEY `role_permissions_inactive_index` (`inactive`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`) USING BTREE,
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE;

--
-- Indexes for table `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenants_slug_unique` (`slug`),
  ADD KEY `tenants_tenant_id_index` (`tenant_id`),
  ADD KEY `tenants_inactive_index` (`inactive`);

--
-- Indexes for table `time_entries`
--
ALTER TABLE `time_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time_entries_id_employee_index` (`id_employee`),
  ADD KEY `time_entries_id_client_index` (`id_client`),
  ADD KEY `time_entries_tenant_id_index` (`tenant_id`),
  ADD KEY `time_entries_inactive_index` (`inactive`);

--
-- Indexes for table `trim`
--
ALTER TABLE `trim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE,
  ADD KEY `position` (`id_position`);

--
-- Indexes for table `user_position`
--
ALTER TABLE `user_position`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pre` (`inactive`,`archived`) USING BTREE,
  ADD KEY `type` (`type`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_roles_id_user_user_type_id_role_unique` (`id_user`,`user_type`,`id_role`),
  ADD KEY `user_roles_id_role_foreign` (`id_role`),
  ADD KEY `user_roles_tenant_id_index` (`tenant_id`),
  ADD KEY `user_roles_inactive_index` (`inactive`);

--
-- Indexes for table `web_footers`
--
ALTER TABLE `web_footers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_footers_project` (`id_project`);

--
-- Indexes for table `web_headers`
--
ALTER TABLE `web_headers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_headers_project` (`id_project`);

--
-- Indexes for table `web_navigations`
--
ALTER TABLE `web_navigations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_parent_nav` (`parent_id`);

--
-- Indexes for table `web_pages`
--
ALTER TABLE `web_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_pages_project` (`id_project`);

--
-- Indexes for table `web_projects`
--
ALTER TABLE `web_projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `pre` (`inactive`,`archived`);

--
-- Indexes for table `web_sections`
--
ALTER TABLE `web_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_page_idx` (`id_page`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement_acks`
--
ALTER TABLE `announcement_acks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bench_status`
--
ALTER TABLE `bench_status`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `client_contracts`
--
ALTER TABLE `client_contracts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client_staff_assignments`
--
ALTER TABLE `client_staff_assignments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `client_training_materials`
--
ALTER TABLE `client_training_materials`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `compliance_records`
--
ALTER TABLE `compliance_records`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_modules`
--
ALTER TABLE `course_modules`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disbursement_accounts`
--
ALTER TABLE `disbursement_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employee_documents`
--
ALTER TABLE `employee_documents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_skills`
--
ALTER TABLE `employee_skills`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `invoice_line_items`
--
ALTER TABLE `invoice_line_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `iplist`
--
ALTER TABLE `iplist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `layout_blocks`
--
ALTER TABLE `layout_blocks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `layout_pages`
--
ALTER TABLE `layout_pages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `layout_presets`
--
ALTER TABLE `layout_presets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `layout_sections`
--
ALTER TABLE `layout_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `layout_themes`
--
ALTER TABLE `layout_themes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payrolls`
--
ALTER TABLE `payrolls`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payroll_runs`
--
ALTER TABLE `payroll_runs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payslips`
--
ALTER TABLE `payslips`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `recruitment_stages`
--
ALTER TABLE `recruitment_stages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `replacement_requests`
--
ALTER TABLE `replacement_requests`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tenants`
--
ALTER TABLE `tenants`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `time_entries`
--
ALTER TABLE `time_entries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trim`
--
ALTER TABLE `trim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_position`
--
ALTER TABLE `user_position`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `web_footers`
--
ALTER TABLE `web_footers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `web_headers`
--
ALTER TABLE `web_headers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `web_navigations`
--
ALTER TABLE `web_navigations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `web_pages`
--
ALTER TABLE `web_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `web_projects`
--
ALTER TABLE `web_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `web_sections`
--
ALTER TABLE `web_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_id_time_entry_foreign` FOREIGN KEY (`id_time_entry`) REFERENCES `time_entries` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `announcement_acks`
--
ALTER TABLE `announcement_acks`
  ADD CONSTRAINT `announcement_acks_id_announcement_foreign` FOREIGN KEY (`id_announcement`) REFERENCES `announcements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD CONSTRAINT `course_enrollments_id_course_foreign` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_modules`
--
ALTER TABLE `course_modules`
  ADD CONSTRAINT `course_modules_id_course_foreign` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_line_items`
--
ALTER TABLE `invoice_line_items`
  ADD CONSTRAINT `invoice_line_items_id_invoice_foreign` FOREIGN KEY (`id_invoice`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_id_invoice_foreign` FOREIGN KEY (`id_invoice`) REFERENCES `invoices` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `recruitment_stages`
--
ALTER TABLE `recruitment_stages`
  ADD CONSTRAINT `recruitment_stages_id_applicant_foreign` FOREIGN KEY (`id_applicant`) REFERENCES `applicants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_id_permission_foreign` FOREIGN KEY (`id_permission`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_id_role_foreign` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_id_role_foreign` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `web_navigations`
--
ALTER TABLE `web_navigations`
  ADD CONSTRAINT `fk_parent_nav` FOREIGN KEY (`parent_id`) REFERENCES `web_navigations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `web_sections`
--
ALTER TABLE `web_sections`
  ADD CONSTRAINT `web_sections_ibfk_1` FOREIGN KEY (`id_page`) REFERENCES `web_pages` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
