"""
Create PostgreSQL database if it does not exist.
Run once before first start:  python create_db.py
Uses DATABASE_URL from .env; connects to default 'postgres' DB to create the target DB.
"""
import os
import re
import sys
from dotenv import load_dotenv

load_dotenv()

def main():
    url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/rest_api_db")
    if "sqlite" in url:
        print("Using SQLite; no database creation needed.")
        return 0
    match = re.match(r"postgresql://([^@]+)@([^/]+)/(.+)", url)
    if not match:
        print("Could not parse DATABASE_URL.")
        return 1
    user_pass, host_port, db_name = match.groups()
    # Connect to default 'postgres' database to create our DB
    default_url = f"postgresql://{user_pass}@{host_port}/postgres"
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
        conn = psycopg2.connect(default_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
        if cur.fetchone():
            print(f"Database '{db_name}' already exists.")
        else:
            cur.execute(f'CREATE DATABASE "{db_name}"')
            print(f"Created database '{db_name}'.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
