-- CA Manage Database Initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create full-text search index support
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
