-- StudentHUB - PostgreSQL schema
-- Universitet → Yo'nalish (Faculty) → Fan (Subject) → Fayl

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    university VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(255),
    city VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS faculties (
    id SERIAL PRIMARY KEY,
    university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_type VARCHAR(20) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER DEFAULT 0,
    semester INTEGER,
    course INTEGER,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 0,
    university_id INTEGER NOT NULL REFERENCES universities(id),
    faculty_id INTEGER REFERENCES faculties(id),
    subject_id INTEGER REFERENCES subjects(id),
    uploader_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    UNIQUE (user_id, file_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_files_title ON files(title);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_files_university ON files(university_id);
CREATE INDEX IF NOT EXISTS idx_files_subject ON files(subject_id);
CREATE INDEX IF NOT EXISTS idx_universities_name ON universities(name);
CREATE INDEX IF NOT EXISTS idx_faculties_university ON faculties(university_id);