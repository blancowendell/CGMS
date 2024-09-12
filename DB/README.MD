DATABASE FOLDER

This folder contains the database files for the CGMS application.

The CGMS application uses the following database:

- CGMS

The CGMS application uses the following database tables:    

- CGMS
- CGMS_USER
- CGMS_USER_ROLE
- CGMS_USER_ROLE_PERMISSION



- DATABASE STRUCTURE


CREATE TABLE master_access (
    ma_accessid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ma_accessname VARCHAR(300) NOT NULL,
    ma_createby VARCHAR(50) NOT NULL,
    ma_createdate DATETIME NOT NULL,
    ma_status VARCHAR(20) NOT NULL
);

-- Table for schools
CREATE TABLE school (
    s_school_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    s_school_name LONGTEXT NOT NULL,
    s_school_code TEXT,
    s_create_date DATETIME,
    s_create_by VARCHAR(50) NOT NULL
);

CREATE TABLE super_admin_user (
    sau_userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sau_image LONGTEXT NOT NULL,
    sau_fullname VARCHAR(50) NOT NULL,
    sau_username VARCHAR(300) NOT NULL,
    sau_password TEXT NOT NULL,
    sau_status VARCHAR(10) NOT NULL,
    sau_createby VARCHAR(20) NOT NULL,
    sau_createdate VARCHAR(50) NOT NULL,
    sau_email VARCHAR(50) NOT NULL
);

-- Table for master_students
CREATE TABLE master_students (
    ms_studentid VARCHAR(9) NOT NULL PRIMARY KEY,
    ms_firstname VARCHAR(50) NOT NULL,
    ms_lastname VARCHAR(50) NOT NULL,
    ms_middlename VARCHAR(50) NOT NULL,
    ms_email VARCHAR(100) NOT NULL,
    ms_school_id INT NOT NULL,
    FOREIGN KEY (ms_school_id) REFERENCES school(s_school_id)
);

-- Table for assessments
CREATE TABLE assessments (
    a_assessment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    a_assessment_name VARCHAR(100),
    a_assessment_description TEXT,
    a_assessment_type VARCHAR(50),
    a_created_by VARCHAR(50),
    a_created_date DATETIME,
    a_school_id INT NOT NULL,
    FOREIGN KEY (a_school_id) REFERENCES school(s_school_id)
);

-- Table for strands_type
CREATE TABLE strands_type (
    st_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    st_school_id INT NOT NULL,
    st_name VARCHAR(50) NOT NULL,
    st_description TEXT NOT NULL,
    st_status VARCHAR(50) NOT NULL,
    st_create_date DATE,
    st_create_by VARCHAR(50) NOT NULL,
    FOREIGN KEY (st_school_id) REFERENCES school(s_school_id)
);

-- Table for academic_strands
CREATE TABLE academic_strands (
    as_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    as_strands_type INT NOT NULL,
    as_school_id INT NOT NULL,
    as_name VARCHAR(50) NOT NULL,
    as_course_description TEXT NOT NULL,
    as_job_description TEXT NOT NULL,
    as_create_by VARCHAR(50) NOT NULL,
    as_create_date DATE,
    FOREIGN KEY (as_strands_type) REFERENCES strands_type(st_id),
    FOREIGN KEY (as_school_id) REFERENCES school(s_school_id)
);

-- Table for questions
CREATE TABLE questions (
    q_question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    q_school_id INT NOT NULL,
    q_assessment_id INT,
    q_question_text TEXT,
    q_question_type VARCHAR(50),
    FOREIGN KEY (q_school_id) REFERENCES school(s_school_id),
    FOREIGN KEY (q_assessment_id) REFERENCES assessments(a_assessment_id)
);


-- Table for personality_type
CREATE TABLE personality_type (
    pt_type_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pt_school_id INT NOT NULL,
    pt_code VARCHAR(50) NOT NULL,
    pt_description LONGTEXT NOT NULL,
    pt_strands_id JSON NOT NULL,
    pt_create_date DATETIME,
    pt_create_by VARCHAR(50) NOT NULL,
    FOREIGN KEY (pt_school_id) REFERENCES school(s_school_id)
);

-- Table for student_answers
CREATE TABLE student_answers (
    sa_answer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sa_question_id INT NOT NULL,
    sa_answer_text TEXT,
    sa_strand_id INT NOT NULL,
    sa_school_id INT NOT NULL,
    sa_personality_type_id INT NOT NULL,
    FOREIGN KEY (sa_question_id) REFERENCES questions(q_question_id),
    FOREIGN KEY (sa_strand_id) REFERENCES academic_strands(as_id),
    FOREIGN KEY (sa_school_id) REFERENCES school(s_school_id),
    FOREIGN KEY (sa_personality_type_id) REFERENCES personality_type(pt_type_id)
);

-- Table for video_clip
CREATE TABLE video_clip (
    vc_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    vc_school_id INT NOT NULL,
    vc_name VARCHAR(50) NOT NULL,
    vc_strandsid INT NOT NULL,
    vc_file LONGTEXT NOT NULL,
    vc_description TEXT,
    vc_youtubelink TEXT,
    vc_create_date DATE,
    vc_create_by VARCHAR(50) NOT NULL,
    FOREIGN KEY (vc_school_id) REFERENCES school(s_school_id),
    FOREIGN KEY (vc_strandsid) REFERENCES academic_strands(as_id)
);

-- Table for job_descriptions
CREATE TABLE job_descriptions (
    jd_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    jd_school_id INT NOT NULL,
    jd_name TEXT NOT NULL,
    jd_strand_id INT NOT NULL,
    jd_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (jd_school_id) REFERENCES school(s_school_id),
    FOREIGN KEY (jd_strand_id) REFERENCES academic_strands(as_id)
);

-- Table for job_requirements
CREATE TABLE job_requirements (
    jr_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    jr_school_id INT NOT NULL,
    jr_name TEXT NOT NULL,
    jr_strand_id INT NOT NULL,
    jr_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (jr_school_id) REFERENCES school(s_school_id),
    FOREIGN KEY (jr_strand_id) REFERENCES academic_strands(as_id)
);

-- Table for skills_requirements
CREATE TABLE skills_requirements (
    sr_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sr_school_id INT NOT NULL,
    sr_name TEXT NOT NULL,
    sr_strand_id INT NOT NULL,
    sr_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (sr_school_id) REFERENCES school(s_school_id),
    FOREIGN KEY (sr_strand_id) REFERENCES academic_strands(as_id)
);
